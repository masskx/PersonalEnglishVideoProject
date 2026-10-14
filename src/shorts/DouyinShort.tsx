import React from 'react';
import {AbsoluteFill, Audio, Img, Sequence, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {smoothProgress} from '../replica/smoothMotion';
import {REPLICA_THEME, SOFT_BLUE, SOFT_ORANGE, highlighterStyle, paperStyle} from '../replica/theme';
import type {ShortTimeline, TimedShortBeat} from './types';

/**
 * 抖音竖屏短视频 1080×1920（主推格式）。所有内容在抖音安全区内：顶部 200px、底部 440px、右侧 128px 按钮列。
 * 第一帧就有大字钩子和小黑；字幕大字、短句；结尾停在收藏页，适合循环播放。
 */
export const SHORT = {width: 1080, height: 1920, fps: 30, left: 64, right: 952, top: 200, bottom: 1480} as const;
const W = SHORT.right - SHORT.left;
const C = {blue: REPLICA_THEME.primary, orange: REPLICA_THEME.accent, ink: '#111111', muted: '#6673A7', red: '#D6402E', green: '#1F8A4C'};
const FONT = REPLICA_THEME.fontFamily;

export type DouyinShortProps = {timeline: ShortTimeline; series: string; topicLabel: string};

export const calculateShortMetadata = ({props}: {props: DouyinShortProps}) => ({
  durationInFrames: Math.max(30, props.timeline.totalFrames),
  fps: SHORT.fps,
  width: SHORT.width,
  height: SHORT.height,
});

/** **重点** → 橙色 + 荧光色带（随节拍划出）。 */
const Rich: React.FC<{text: string; progress: number}> = ({text, progress}) => (
  <>
    {text.split('\n').map((line, row) => (
      <div key={row}>
        {line.split(/(\*\*[^*]+\*\*)/).map((part, index) =>
          part.startsWith('**') ? (
            <span key={index} style={{color: C.orange, ...highlighterStyle(progress)}}>{part.slice(2, -2)}</span>
          ) : (
            <span key={index}>{part}</span>
          ),
        )}
      </div>
    ))}
  </>
);

const visibleLength = (text: string) => text.replace(/\*\*/g, '').split('\n').reduce((max, line) => Math.max(max, [...line].reduce((sum, ch) => sum + (/[\u0000-ÿ]/.test(ch) ? 0.55 : 1), 0)), 0);
const headlineSize = (text: string) => Math.max(58, Math.min(84, Math.floor(W / Math.max(1, visibleLength(text)))));

/** Split narration into short subtitle chunks (≈ one breath each) and time them by length. */
export const subtitleChunks = (voice: string, audioFrames: number) => {
  const raw = voice.split(/(?<=[，。？！；：,?!;:])/).map((part) => part.trim()).filter(Boolean);
  const chunks: string[] = [];
  for (const part of raw) {
    const clean = part.replace(/[，。；：,;:]$/, '');
    const last = chunks.at(-1);
    if (last && last.length + clean.length <= 9) chunks[chunks.length - 1] = `${last}，${clean}`;
    else chunks.push(clean);
  }
  const weights = chunks.map((chunk) => Math.max(3, chunk.length));
  const total = weights.reduce((a, b) => a + b, 0);
  let cursor = 0;
  return chunks.map((text, index) => {
    const frames = Math.round((weights[index] / total) * audioFrames);
    const item = {text, from: cursor, to: index === chunks.length - 1 ? audioFrames : cursor + frames};
    cursor += frames;
    return item;
  });
};

const Subtitle: React.FC<{beat: TimedShortBeat; local: number; instant: boolean}> = ({beat, local, instant}) => {
  const chunks = React.useMemo(() => subtitleChunks(beat.voice, beat.audioFrames), [beat]);
  const current = chunks.find((chunk) => local >= chunk.from && local < chunk.to) ?? (local >= beat.audioFrames ? null : chunks[0]);
  if (!current) return null;
  const enter = instant && current.from === 0 ? 1 : smoothProgress(local, current.from, 5);
  const size = current.text.length > 22 ? 46 : 56;
  return (
    <div style={{position: 'absolute', left: SHORT.left, top: 1250, width: W, textAlign: 'center', fontFamily: FONT, fontSize: size, fontWeight: 850, lineHeight: 1.35,
      color: C.ink, opacity: enter, transform: `translateY(${10 * (1 - enter)}px)`}}>
      {current.text.split(/([A-Za-z][A-Za-z' -]*[A-Za-z]|[A-Za-z])/).map((part, index) =>
        /[A-Za-z]/.test(part) ? <span key={index} style={{color: C.blue}}>{part}</span> : <span key={index}>{part}</span>,
      )}
    </div>
  );
};

const PANEL = {top: 610, height: 540, shrunk: 400};

/** 小黑底板。多张姿态（before / change / result）在本节拍旁白里依次切换；有例句卡时底板让出下方位置。 */
const ArtPanel: React.FC<{beat: TimedShortBeat; local: number; progress: number; shrink: number}> = ({beat, local, progress, shrink}) => {
  const arts = beat.arts?.length ? beat.arts : beat.art ? [beat.art] : [];
  const height = PANEL.height + (PANEL.shrunk - PANEL.height) * shrink;
  const step = Math.max(1, beat.audioFrames / Math.max(1, arts.length));
  return (
    <div style={{position: 'absolute', left: SHORT.left, top: PANEL.top, width: W, height, borderRadius: 44, background: SOFT_BLUE, overflow: 'hidden',
      opacity: progress, transform: `scale(${0.96 + 0.04 * progress})`}}>
      {arts.map((src, i) => {
        const shown = i === 0 ? 1 : smoothProgress(local, i * step, 6);
        const next = i === arts.length - 1 ? 0 : smoothProgress(local, (i + 1) * step + 6, 1);
        return <Img key={src} src={staticFile(src)} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain', transform: 'scale(1.18)', opacity: shown * (1 - next)}} />;
      })}
    </div>
  );
};

/** 例句卡：橙色“例句”标签 + 深蓝英文；两个空格后的部分是灰色中文释义。 */
const ExampleCard: React.FC<{text: string; progress: number}> = ({text, progress}) => {
  const [english, gloss] = text.split(/\s{2,}/);
  return (
    <div style={{position: 'absolute', left: SHORT.left, top: PANEL.top + PANEL.shrunk + 22, width: W, minHeight: 118, boxSizing: 'border-box', padding: '18px 26px', borderRadius: 26,
      background: '#FFFFFF', border: `3px solid ${C.blue}`, display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap', opacity: progress, transform: `translateY(${20 * (1 - progress)}px)`}}>
      <span style={{flex: 'none', background: C.orange, color: '#fff', borderRadius: 12, padding: '6px 14px', fontFamily: FONT, fontSize: 30, fontWeight: 900}}>例句</span>
      <span style={{fontFamily: 'Arial, sans-serif', fontSize: english.length > 34 ? 36 : 42, fontWeight: 800, color: C.blue, lineHeight: 1.2}}>{english}</span>
      {gloss ? <span style={{fontFamily: FONT, fontSize: 32, fontWeight: 700, color: C.muted}}>{gloss}</span> : null}
    </div>
  );
};

const Visual: React.FC<{beat: TimedShortBeat; local: number; instant: boolean}> = ({beat, local, instant}) => {
  const p = instant ? 1 : smoothProgress(local, 0, 8);
  if (beat.kind === 'mistake' && beat.wrong) {
    // 小黑在上（第一帧可见），错误写法在旁白说到时划掉，正确写法随后出现。
    const strike = smoothProgress(local, Math.round(beat.audioFrames * 0.45), 10);
    const fix = smoothProgress(local, Math.round(beat.audioFrames * 0.7), 10);
    const cardFont = (text: string) => (text.length > 32 ? 38 : 46);
    return (
      <div style={{position: 'absolute', left: SHORT.left, top: 590, width: W, fontFamily: FONT}}>
        {beat.art ? (
          <div style={{height: 270, borderRadius: 36, background: SOFT_BLUE, overflow: 'hidden', opacity: p, marginBottom: 24}}>
            <Img src={staticFile(beat.art)} style={{width: '100%', height: '100%', objectFit: 'contain', transform: 'scale(1.2)'}} />
          </div>
        ) : null}
        <div style={{padding: '24px 30px', borderRadius: 26, background: '#FFFFFF', border: `3px dashed ${C.red}`, fontSize: cardFont(beat.wrong), fontWeight: 800, color: C.muted, opacity: p, position: 'relative'}}>
          <span style={{color: C.red, marginRight: 14}}>✗</span>{beat.wrong}
          <div style={{position: 'absolute', left: 80, right: 30, top: '50%', height: 6, borderRadius: 3, background: C.red, transform: `scaleX(${strike})`, transformOrigin: '0 50%'}} />
        </div>
        {beat.right ? (
          <div style={{marginTop: 22, padding: '24px 30px', borderRadius: 26, background: SOFT_ORANGE, fontSize: cardFont(beat.right) + 2, fontWeight: 850, color: C.ink, opacity: fix, transform: `translateY(${16 * (1 - fix)}px)`}}>
            <span style={{color: C.green, marginRight: 14}}>✓</span>{beat.right}
          </div>
        ) : null}
      </div>
    );
  }
  if (beat.kind === 'test' && beat.options) {
    const after = local - beat.audioFrames;
    const count = after >= 0 ? Math.max(1, Math.ceil((beat.frames - local) / SHORT.fps)) : 0;
    return (
      <div style={{position: 'absolute', left: SHORT.left, top: 640, width: W, fontFamily: FONT}}>
        {beat.options.map((option, index) => {
          const q = smoothProgress(local, 6 + index * 6, 8);
          return (
            <div key={option} style={{display: 'flex', alignItems: 'center', gap: 24, marginBottom: 26, padding: '30px 34px', borderRadius: 28, background: index === 0 ? SOFT_BLUE : SOFT_ORANGE,
              fontSize: option.length > 18 ? 42 : 56, fontWeight: 850, color: C.ink, opacity: q, transform: `translateX(${(index ? 30 : -30) * (1 - q)}px)`}}>
              <span style={{flex: 'none', width: 74, height: 74, borderRadius: 37, background: index === 0 ? C.blue : C.orange, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 44}}>{String.fromCharCode(65 + index)}</span>
              <span style={{fontFamily: /[A-Za-z]/.test(option) ? 'Arial, sans-serif' : FONT}}>{option}</span>
            </div>
          );
        })}
        {count > 0 ? (
          <div style={{marginTop: 20, display: 'flex', justifyContent: 'center'}}>
            <div style={{width: 170, height: 170, borderRadius: 85, background: C.orange, color: '#fff', fontSize: 104, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center',
              transform: `scale(${interpolate((after % SHORT.fps) / SHORT.fps, [0, 0.25, 1], [1.12, 1, 1])})`}}>{count}</div>
          </div>
        ) : null}
      </div>
    );
  }
  if (beat.kind === 'cta') {
    const ribbon = smoothProgress(local, 10, 10);
    return (
      <>
        <ArtPanel beat={beat} local={local} progress={p} shrink={1} />
        <div style={{position: 'absolute', left: SHORT.left, top: PANEL.top + PANEL.shrunk + 34, width: W, display: 'flex', justifyContent: 'center', opacity: ribbon, transform: `translateY(${18 * (1 - ribbon)}px)`}}>
          <div style={{background: C.orange, color: '#fff', borderRadius: 22, padding: '14px 34px', fontFamily: FONT, fontSize: 42, fontWeight: 900, boxShadow: '0 8px 0 rgba(232,88,16,0.18)'}}>收藏 + 关注，考前翻出来</div>
        </div>
      </>
    );
  }
  const exampleIn = beat.example ? smoothProgress(local, Math.round((beat.exampleAt ?? 0.4) * beat.audioFrames), 9) : 0;
  return (
    <>
      {beat.art || beat.arts?.length ? <ArtPanel beat={beat} local={local} progress={p} shrink={exampleIn} /> : null}
      {beat.example ? <ExampleCard text={beat.example} progress={exampleIn} /> : null}
    </>
  );
};

const musicVolume = (timeline: ShortTimeline) => (frame: number) => {
  let speaking = 0;
  for (const beat of timeline.beats) {
    const attack = Math.max(0, Math.min(1, (frame - (beat.from - 6)) / 6));
    const release = 1 - Math.max(0, Math.min(1, (frame - (beat.from + beat.audioFrames)) / 8));
    speaking = Math.max(speaking, Math.min(attack, release));
  }
  const fadeOut = 1 - smoothProgress(frame, timeline.totalFrames - 24, 23);
  return (0.08 + (0.04 - 0.08) * speaking) * fadeOut;
};

const SFX: Record<TimedShortBeat['kind'], string | null> = {hook: null, mistake: 'hit', fix: 'whoosh', test: 'pop', answer: 'stamp', cta: 'pop'};

export const DouyinShort: React.FC<DouyinShortProps> = ({timeline, series, topicLabel}) => {
  const frame = useCurrentFrame();
  const index = Math.max(0, timeline.beats.findIndex((beat) => frame >= beat.from && frame < beat.from + beat.frames));
  const beat = timeline.beats[index] ?? timeline.beats.at(-1)!;
  const local = frame - beat.from;
  const first = index === 0;
  const headIn = first ? 1 : smoothProgress(local, 0, 7);
  const highlight = first ? Math.max(0.35, smoothProgress(local, 4, 14)) : smoothProgress(local, 6, 14);
  return (
    <AbsoluteFill style={{...paperStyle(40), fontFamily: FONT, color: C.ink, overflow: 'hidden'}}>
      <div style={{position: 'absolute', left: SHORT.left, top: SHORT.top + 12, display: 'flex', alignItems: 'center', gap: 16, fontSize: 32, fontWeight: 850}}>
        <span style={{background: C.blue, color: '#fff', padding: '8px 18px', borderRadius: 14}}>{series}</span>
        <span style={{color: C.blue}}>{topicLabel}</span>
      </div>
      <div style={{position: 'absolute', left: SHORT.left, top: 300, width: W, fontSize: headlineSize(beat.headline), fontWeight: 900, lineHeight: 1.22, color: C.blue,
        opacity: headIn, transform: `translateY(${18 * (1 - headIn)}px)`}}>
        <Rich text={beat.headline} progress={highlight} />
      </div>
      <Visual beat={beat} local={local} instant={first} />
      <Subtitle beat={beat} local={local} instant={first} />
      <Audio src={staticFile('assets/music/root-word-series-bgm.mp3')} loop volume={musicVolume(timeline)} />
      {timeline.beats.map((item) => (
        <Sequence key={item.id} from={item.from} durationInFrames={item.audioFrames}>
          <Audio src={staticFile(item.src)} volume={0.9} />
        </Sequence>
      ))}
      {timeline.beats.map((item, i) => {
        const sfx = SFX[item.kind];
        return sfx && i > 0 ? (
          <Sequence key={`sfx-${item.id}`} from={item.from} durationInFrames={20}>
            <Audio src={staticFile(`assets/sfx/${sfx}.mp3`)} volume={0.35} />
          </Sequence>
        ) : null;
      })}
    </AbsoluteFill>
  );
};
