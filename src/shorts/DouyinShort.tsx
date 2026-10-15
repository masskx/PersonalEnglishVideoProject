import React from 'react';
import {AbsoluteFill, Audio, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame} from 'remotion';
import {smoothProgress} from '../replica/smoothMotion';
import {REPLICA_THEME, SOFT_BLUE, SOFT_ORANGE, highlighterStyle, paperStyle} from '../replica/theme';
import type {ShortTimeline, TimedShortBeat} from './types';

/**
 * 竖屏短视频 1080×1920（抖音、小红书同一条）。所有内容在抖音安全区内：顶部 200px、底部 440px、右侧 128px 按钮列。
 * 第一帧就有大字钩子和小黑；字幕大字、短句；答案即结尾。
 *
 * 动效规则（2026-10-15，见 docs/当前制作基准.md“动效与声音工艺”）：
 * - 一块底板贯穿全片：浅蓝插图底板在节拍之间用弹簧改变位置和高度，不清屏、不出现空白帧；
 * - 文字遮罩换场：旧标题先上移退出，新标题随后从下方升入，两者不叠在一起；
 * - 姿态切换是“硬切 + 轻微回弹”，小黑永远 100% 不透明，不做半透明叠化；
 * - 每个画面事件（例句进场、划掉错误、姿态切换、倒计时、答案）在 shortMoments() 里只算一次，
 *   画面和音效都从这里取时间，音效按测得的峰值对齐到事件帧。
 */
export const SHORT = {width: 1080, height: 1920, fps: 30, left: 64, right: 952, top: 200, bottom: 1480} as const;
const W = SHORT.right - SHORT.left;
const C = {blue: REPLICA_THEME.primary, orange: REPLICA_THEME.accent, ink: '#111111', muted: '#6673A7', red: '#D6402E', green: '#1F8A4C'};
const FONT = REPLICA_THEME.fontFamily;

export type SfxName = 'hit' | 'whoosh' | 'pop' | 'press' | 'scribble' | 'stamp';
export const SFX_NAMES: readonly SfxName[] = ['hit', 'whoosh', 'pop', 'press', 'scribble', 'stamp'];

export type DouyinShortProps = {
  timeline: ShortTimeline;
  series: string;
  category: string;
  /** 每个音效从文件开头到峰值的秒数（shorts:render 实测）；音效提前这么多播放，峰值正好落在画面事件上。 */
  sfxPeaks?: Partial<Record<SfxName, number>>;
};

export const calculateShortMetadata = ({props}: {props: DouyinShortProps}) => ({
  durationInFrames: Math.max(30, props.timeline.totalFrames),
  fps: SHORT.fps,
  width: SHORT.width,
  height: SHORT.height,
});

/** 弹簧：阻尼比约 0.9，最多约 0.2% 过冲——有重量感但不弹跳。帧驱动、纯函数。 */
const settle = (local: number, start = 0) => (local < start ? 0 : spring({frame: local - start, fps: SHORT.fps, config: {damping: 20, stiffness: 180, mass: 0.7}}));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** **重点** → 橙色 + 荧光色带（随节拍划出）。 */
export const Rich: React.FC<{text: string; progress: number}> = ({text, progress}) => (
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
const headlineSize = (text: string, max = 84) => Math.max(58, Math.min(max, Math.floor(W / Math.max(1, visibleLength(text)))));

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

const beatArts = (beat: TimedShortBeat) => (beat.arts?.length ? beat.arts : beat.art ? [beat.art] : []);

/**
 * 一个节拍里所有画面事件的帧（相对节拍起点）。画面和音效共用这一份时间，改这里两边一起变。
 */
export const shortMoments = (beat: TimedShortBeat, last: boolean) => {
  const arts = beatArts(beat);
  const poseStep = Math.max(1, beat.audioFrames / Math.max(1, arts.length));
  const countdown: number[] = [];
  if (beat.kind === 'test' && beat.options) for (let f = beat.audioFrames; f < beat.frames - 4; f += SHORT.fps) countdown.push(f);
  return {
    /** 第 i 张姿态出现的帧（第 0 张随节拍出现）。 */
    poses: arts.map((_, i) => Math.round(i * poseStep)),
    example: beat.example ? Math.round((beat.exampleAt ?? 0.4) * beat.audioFrames) : null,
    strike: beat.kind === 'mistake' && beat.wrong ? Math.round(beat.audioFrames * 0.45) : null,
    fix: beat.kind === 'mistake' && beat.right ? Math.round(beat.audioFrames * 0.7) : null,
    // 选项在底板基本收起后进场（第 7 帧起），不压在小黑上；收起过程中插图只被裁切，画面不空。
    options: beat.kind === 'test' && beat.options ? beat.options.map((_, i) => 7 + i * 5) : [],
    countdown,
    /** v2：答案即结尾，收藏提示叠在答案拍上。 */
    save: (beat.kind === 'answer' && last) || beat.kind === 'cta' ? Math.round((beat.kind === 'cta' ? 0.15 : 0.5) * beat.audioFrames) : null,
  };
};

/** 全片音效时间表（绝对帧）：节拍换场一声轻 whoosh，其余音效落在具体画面事件上。 */
export const shortEvents = (timeline: ShortTimeline): Array<{frame: number; sfx: SfxName; volume: number}> => {
  const events: Array<{frame: number; sfx: SfxName; volume: number}> = [];
  timeline.beats.forEach((beat, index) => {
    const m = shortMoments(beat, index === timeline.beats.length - 1);
    const at = (local: number | null, sfx: SfxName, volume: number) => { if (local !== null) events.push({frame: beat.from + local, sfx, volume}); };
    if (index > 0) at(0, 'whoosh', 0.28);
    m.poses.slice(1).forEach((f) => at(f, 'press', 0.3));
    at(m.example, 'pop', 0.34);
    at(m.strike, 'scribble', 0.4);
    at(m.fix, 'pop', 0.34);
    m.countdown.forEach((f) => at(f, 'press', 0.36));
    if (beat.kind === 'answer') at(6, 'stamp', 0.42);
  });
  return events;
};

/** 底板几何：每种节拍一个落点；节拍之间用弹簧从上一拍的落点变过来。 */
const PANEL = {top: 610, full: 660, withExample: 470, mistakeTop: 590, mistake: 270, radius: 44};
type Rect = {top: number; height: number};
const panelRect = (beat: TimedShortBeat, exampleIn: number): Rect => {
  if (beat.kind === 'test' && beat.options) return {top: PANEL.top, height: 0};
  if (beat.kind === 'mistake' && beat.wrong) return {top: PANEL.mistakeTop, height: beatArts(beat).length ? PANEL.mistake : 0};
  if (!beatArts(beat).length) return {top: PANEL.top, height: 0};
  const shrink = beat.kind === 'cta' ? 1 : exampleIn;
  return {top: PANEL.top, height: lerp(PANEL.full, PANEL.withExample, shrink)};
};

/** 底板里的插图：同一拍内按姿态硬切 + 轻微回弹；与上一拍不同的插图同样硬切，上一拍有图、这一拍没图时插图随底板收起。 */
const PanelArt: React.FC<{src: string; since: number; scale: number; height: number}> = ({src, since, scale, height}) => {
  const pop = settle(since);
  // 插图框贴住底板上沿；底板比插图框矮时只裁切（像卷帘一样从头到脚打开、从脚到头收起），不把小黑缩小。
  return <Img src={staticFile(src)} style={{position: 'absolute', left: 0, top: 0, width: '100%', height, objectFit: 'contain', transform: `scale(${scale * (1.025 - 0.025 * pop)})`}} />;
};

const Panel: React.FC<{beat: TimedShortBeat; prev: TimedShortBeat | null; local: number; exampleIn: number; moments: ReturnType<typeof shortMoments>}> = ({beat, prev, local, exampleIn, moments}) => {
  const target = panelRect(beat, exampleIn);
  const from = prev ? panelRect(prev, prev.example ? 1 : 0) : target;
  const t = prev ? settle(local) : 1;
  const rect = {top: lerp(from.top, target.top, t), height: Math.max(0, lerp(from.height, target.height, t))};
  if (rect.height < 1) return null;
  const arts = beatArts(beat);
  const prevArts = prev ? beatArts(prev) : [];
  const scale = beat.kind === 'mistake' ? 1.2 : 1.18;
  let art: {src: string; since: number} | null = null;
  if (arts.length) {
    let i = 0;
    while (i + 1 < arts.length && local >= moments.poses[i + 1]) i += 1;
    // 和上一拍最后一张是同一张图时不回弹（同一画面延续）。
    const same = i === 0 && prevArts.at(-1) === arts[0];
    art = {src: arts[i], since: same ? -999 : moments.poses[i]};
  } else if (prevArts.length) {
    art = {src: prevArts.at(-1)!, since: -999};
  }
  // 底板打开或收起（一端高度为 0）时，插图框保持“有图那一拍”的静止高度，只被底板裁切。
  const opening = from.height < 1 || target.height < 1;
  const artHeight = opening ? Math.max(rect.height, from.height, target.height) : rect.height;
  return (
    <div style={{position: 'absolute', left: SHORT.left, top: rect.top, width: W, height: rect.height, borderRadius: PANEL.radius, background: SOFT_BLUE, overflow: 'hidden'}}>
      {art ? <PanelArt src={art.src} since={local - art.since} scale={scale} height={artHeight} /> : null}
    </div>
  );
};

/** 例句卡：橙色“例句”标签 + 深蓝英文；两个空格后的部分是灰色中文释义。 */
const ExampleCard: React.FC<{text: string; progress: number}> = ({text, progress}) => {
  const [english, gloss] = text.split(/\s{2,}/);
  return (
    <div style={{width: W, minHeight: 118, boxSizing: 'border-box', padding: '18px 26px', borderRadius: 26,
      background: '#FFFFFF', border: `3px solid ${C.blue}`, display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap',
      opacity: Math.min(1, progress * 2.5), transform: `translateY(${28 * (1 - progress)}px)`}}>
      <span style={{flex: 'none', background: C.orange, color: '#fff', borderRadius: 12, padding: '6px 14px', fontFamily: FONT, fontSize: 30, fontWeight: 900}}>例句</span>
      <span style={{fontFamily: 'Arial, sans-serif', fontSize: english.length > 34 ? 36 : 42, fontWeight: 800, color: C.blue, lineHeight: 1.2}}>{english}</span>
      {gloss ? <span style={{fontFamily: FONT, fontSize: 32, fontWeight: 700, color: C.muted}}>{gloss}</span> : null}
    </div>
  );
};

const SavePill: React.FC<{progress: number; big: boolean}> = ({progress, big}) => (
  <div style={{display: 'flex', justifyContent: 'center', opacity: Math.min(1, progress * 2.5), transform: `translateY(${16 * (1 - progress)}px) scale(${0.94 + 0.06 * progress})`}}>
    <div style={{background: C.orange, color: '#fff', borderRadius: big ? 22 : 18, padding: big ? '14px 34px' : '8px 28px', fontFamily: FONT, fontSize: big ? 42 : 34, fontWeight: 900, boxShadow: '0 6px 0 rgba(232,88,16,0.18)'}}>收藏 + 关注，考前翻出来</div>
  </div>
);

const Visual: React.FC<{beat: TimedShortBeat; local: number; moments: ReturnType<typeof shortMoments>; exampleIn: number; panelBottom: number}> = ({beat, local, moments, exampleIn, panelBottom}) => {
  if (beat.kind === 'mistake' && beat.wrong) {
    // 小黑在上（底板），错误写法在旁白说到时划掉，正确写法随后出现。第一拍时第一帧就完整可见。
    const p = beat.from === 0 ? 1 : settle(local, 4);
    const strike = smoothProgress(local, moments.strike ?? 0, 10);
    const fix = moments.fix === null ? 0 : settle(local, moments.fix);
    const cardFont = (text: string) => (text.length > 32 ? 38 : 46);
    const top = panelRect(beat, 0).top + (beatArts(beat).length ? PANEL.mistake + 24 : 0);
    return (
      <div style={{position: 'absolute', left: SHORT.left, top, width: W, fontFamily: FONT}}>
        <div style={{padding: '24px 30px', borderRadius: 26, background: '#FFFFFF', border: `3px dashed ${C.red}`, fontSize: cardFont(beat.wrong), fontWeight: 800, color: C.muted,
          opacity: Math.min(1, p * 2.5), transform: `translateY(${24 * (1 - p)}px)`, position: 'relative'}}>
          <span style={{color: C.red, marginRight: 14}}>✗</span>{beat.wrong}
          <div style={{position: 'absolute', left: 80, right: 30, top: '50%', height: 6, borderRadius: 3, background: C.red, transform: `scaleX(${strike})`, transformOrigin: '0 50%'}} />
        </div>
        {beat.right ? (
          <div style={{marginTop: 22, padding: '24px 30px', borderRadius: 26, background: SOFT_ORANGE, fontSize: cardFont(beat.right) + 2, fontWeight: 850, color: C.ink,
            opacity: Math.min(1, fix * 2.5), transform: `translateY(${20 * (1 - fix)}px)`}}>
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
          const q = settle(local, moments.options[index]);
          return (
            <div key={option} style={{display: 'flex', alignItems: 'center', gap: 24, marginBottom: 26, padding: '30px 34px', borderRadius: 28, background: index === 0 ? SOFT_BLUE : SOFT_ORANGE,
              fontSize: option.length > 18 ? 42 : 56, fontWeight: 850, color: C.ink, opacity: Math.min(1, q * 2.5), transform: `translateX(${(index ? 60 : -60) * (1 - q)}px)`}}>
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
  const saveIn = moments.save === null ? 0 : settle(local, moments.save);
  if (!beat.example && !saveIn) return null;
  // 例句卡和收藏角标跟着底板下沿排成一列，长例句换行时不会互相压住。
  return (
    <div style={{position: 'absolute', left: SHORT.left, top: panelBottom + 22, width: W, display: 'flex', flexDirection: 'column', gap: 16}}>
      {beat.example ? <ExampleCard text={beat.example} progress={exampleIn} /> : null}
      {saveIn > 0 ? <SavePill progress={saveIn} big={beat.kind === 'cta'} /> : null}
    </div>
  );
};

/** 标题遮罩换场：旧标题 0–6 帧上移退出，新标题第 5 帧起从下方升入（各自独立时间，不重叠）。 */
const HEADLINE_TOP = 300;
const Headline: React.FC<{beat: TimedShortBeat; prev: TimedShortBeat | null; local: number; first: boolean}> = ({beat, prev, local, first}) => {
  const size = (b: TimedShortBeat) => headlineSize(b.headline, b.from === 0 ? 104 : 84);
  const enter = first ? 1 : settle(local, 5);
  const exit = smoothProgress(local, 0, 6);
  const highlight = first ? Math.max(0.35, smoothProgress(local, 4, 14)) : smoothProgress(local, 9, 14);
  const style = (b: TimedShortBeat): React.CSSProperties => ({position: 'absolute', left: 0, top: 0, width: W, fontSize: size(b), fontWeight: 900, lineHeight: 1.22, color: C.blue});
  return (
    <div style={{position: 'absolute', left: SHORT.left, top: HEADLINE_TOP - 20, width: W, height: 300, overflow: 'hidden'}}>
      <div style={{position: 'absolute', top: 20, left: 0, width: W, height: 280}}>
        {prev && exit < 1 ? (
          <div style={{...style(prev), transform: `translateY(${-90 * exit}px)`, opacity: 1 - exit}}><Rich text={prev.headline} progress={1} /></div>
        ) : null}
        {enter > 0 ? (
          <div style={{...style(beat), transform: `translateY(${90 * (1 - enter)}px)`, opacity: Math.min(1, enter * 2)}}><Rich text={beat.headline} progress={highlight} /></div>
        ) : null}
      </div>
    </div>
  );
};

const SUBTITLE_TOP = 1350;
const Subtitle: React.FC<{beat: TimedShortBeat; local: number; instant: boolean}> = ({beat, local, instant}) => {
  const chunks = React.useMemo(() => subtitleChunks(beat.voice, beat.audioFrames), [beat]);
  const current = chunks.find((chunk) => local >= chunk.from && local < chunk.to) ?? (local >= beat.audioFrames ? null : chunks[0]);
  if (!current) return null;
  // 字幕换句快速升入（3 帧），不从全透明开始，避免一闪一闪。
  const enter = instant && current.from === 0 ? 1 : 0.4 + 0.6 * smoothProgress(local, current.from, 3);
  const size = current.text.length > 22 ? 46 : 56;
  return (
    <div style={{position: 'absolute', left: SHORT.left, top: SUBTITLE_TOP, width: W, textAlign: 'center', fontFamily: FONT, fontSize: size, fontWeight: 850, lineHeight: 1.35,
      color: C.ink, opacity: enter, transform: `translateY(${10 * (1 - enter)}px)`}}>
      {current.text.split(/([A-Za-z][A-Za-z' -]*[A-Za-z]|[A-Za-z])/).map((part, index) =>
        /[A-Za-z]/.test(part) ? <span key={index} style={{color: C.blue}}>{part}</span> : <span key={index}>{part}</span>,
      )}
    </div>
  );
};

/**
 * 背景音乐：说话时 0.07，空档抬到 0.10（见 make-xiaohei-english-video Skill“Narration-first background music”），
 * 结尾 0.8 秒淡出。成片最后由 shorts:render 统一响度到 -14 LUFS。
 */
const musicVolume = (timeline: ShortTimeline) => (frame: number) => {
  let speaking = 0;
  for (const beat of timeline.beats) {
    const attack = Math.max(0, Math.min(1, (frame - (beat.from - 6)) / 6));
    const release = 1 - Math.max(0, Math.min(1, (frame - (beat.from + beat.audioFrames)) / 8));
    speaking = Math.max(speaking, Math.min(attack, release));
  }
  const fadeOut = 1 - smoothProgress(frame, timeline.totalFrames - 24, 23);
  return lerp(0.1, 0.07, speaking) * fadeOut;
};

export const DouyinShort: React.FC<DouyinShortProps> = ({timeline, series, category, sfxPeaks}) => {
  const frame = useCurrentFrame();
  const events = React.useMemo(() => shortEvents(timeline), [timeline]);
  if (!timeline.beats.length) return <AbsoluteFill style={{...paperStyle(40)}} />;
  const index = Math.max(0, timeline.beats.findIndex((beat) => frame >= beat.from && frame < beat.from + beat.frames));
  const beat = timeline.beats[index] ?? timeline.beats.at(-1)!;
  const prev = index > 0 ? timeline.beats[index - 1] : null;
  const local = frame - beat.from;
  const first = index === 0;
  const last = index === timeline.beats.length - 1;
  const moments = shortMoments(beat, last);
  const exampleIn = moments.example === null ? 0 : first && moments.example === 0 ? 1 : settle(local, moments.example);
  const target = panelRect(beat, exampleIn);
  const from = prev ? panelRect(prev, prev.example ? 1 : 0) : target;
  const t = prev ? settle(local) : 1;
  const panelBottom = lerp(from.top + from.height, target.top + target.height, t);
  return (
    <AbsoluteFill style={{...paperStyle(40), fontFamily: FONT, color: C.ink, overflow: 'hidden'}}>
      <div style={{position: 'absolute', left: SHORT.left, top: SHORT.top + 12, display: 'flex', alignItems: 'center', gap: 16, fontSize: 32, fontWeight: 850}}>
        <span style={{background: C.blue, color: '#fff', padding: '8px 18px', borderRadius: 14}}>{series}</span>
        <span style={{color: C.blue}}>{category}</span>
      </div>
      <Headline beat={beat} prev={prev} local={local} first={first} />
      <Panel beat={beat} prev={prev} local={local} exampleIn={exampleIn} moments={moments} />
      <Visual beat={beat} local={local} moments={moments} exampleIn={exampleIn} panelBottom={panelBottom} />
      <Subtitle beat={beat} local={local} instant={first} />
      <Audio src={staticFile('assets/music/root-word-series-bgm.mp3')} loop volume={musicVolume(timeline)} />
      {timeline.beats.map((item) => (
        <Sequence key={item.id} from={item.from} durationInFrames={item.audioFrames}>
          <Audio src={staticFile(item.src)} volume={0.9} />
        </Sequence>
      ))}
      {events.map((event, i) => {
        // 峰值对齐：音效提前“文件开头到峰值”的时长播放。
        const lead = Math.round((sfxPeaks?.[event.sfx] ?? 0) * SHORT.fps);
        const start = Math.max(0, event.frame - lead);
        return (
          <Sequence key={`sfx-${i}`} from={start} durationInFrames={20}>
            <Audio src={staticFile(`assets/sfx/${event.sfx}.mp3`)} volume={event.volume} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
