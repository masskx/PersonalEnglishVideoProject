import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {REPLICA_THEME, SOFT_BLUE, paperStyle} from '../replica/theme';
import {Rich} from './DouyinShort';

/**
 * 短视频封面，同一内容出三种尺寸（每条视频都要三张）：
 * - 抖音竖封面 1080×1920（9:16）：电脑端上传会裁成中间 3:4，所以内容全部放在中间 1080×1440 范围内；
 * - 抖音横封面 1440×1080（4:3）：左文右图；
 * - 小红书封面 1080×1440（3:4）。
 */
export type ShortCoverFormat = 'douyin-vertical' | 'douyin-landscape' | 'xiaohongshu';

export const SHORT_COVER_FORMATS: Record<ShortCoverFormat, {width: number; height: number; file: string; box: {left: number; top: number; right: number; bottom: number}}> = {
  'douyin-vertical': {width: 1080, height: 1920, file: 'cover-douyin-vertical.png', box: {left: 64, top: 300, right: 1016, bottom: 1620}},
  'douyin-landscape': {width: 1440, height: 1080, file: 'cover-douyin-landscape.png', box: {left: 72, top: 72, right: 1368, bottom: 1008}},
  xiaohongshu: {width: 1080, height: 1440, file: 'cover-xiaohongshu.png', box: {left: 64, top: 64, right: 1016, bottom: 1376}},
};

export type ShortCoverProps = {format: ShortCoverFormat; headline: string; art: string; series: string; category: string; ribbon: string};

export const calculateShortCoverMetadata = ({props}: {props: ShortCoverProps}) => ({
  durationInFrames: 1,
  fps: 30,
  width: SHORT_COVER_FORMATS[props.format].width,
  height: SHORT_COVER_FORMATS[props.format].height,
});

const C = {blue: REPLICA_THEME.primary, orange: REPLICA_THEME.accent};
const FONT = REPLICA_THEME.fontFamily;
const visibleLength = (text: string) => text.replace(/\*\*/g, '').split('\n').reduce((max, line) => Math.max(max, [...line].reduce((sum, ch) => sum + (/[\u0000-ÿ]/.test(ch) ? 0.55 : 1), 0)), 0);
const fit = (text: string, width: number, min: number, max: number) => Math.max(min, Math.min(max, Math.floor(width / Math.max(1, visibleLength(text)))));

const Tag: React.FC<{series: string; category: string; size: number}> = ({series, category, size}) => (
  <div style={{display: 'flex', alignItems: 'center', gap: size * 0.45, fontSize: size, fontWeight: 900, flex: 'none'}}>
    <span style={{background: C.blue, color: '#fff', padding: `${size * 0.22}px ${size * 0.5}px`, borderRadius: size * 0.4}}>{series}</span>
    <span style={{color: C.blue}}>{category}</span>
  </div>
);

const Ribbon: React.FC<{text: string; size: number}> = ({text, size}) => (
  <div style={{flex: 'none', alignSelf: 'flex-start', background: C.orange, color: '#fff', borderRadius: size * 0.5, padding: `${size * 0.3}px ${size * 0.8}px`, fontSize: size, fontWeight: 900,
    boxShadow: '0 8px 0 rgba(232,88,16,0.18)'}}>{text}</div>
);

const Panel: React.FC<{art: string; style?: React.CSSProperties}> = ({art, style}) => (
  <div style={{borderRadius: 48, background: SOFT_BLUE, overflow: 'hidden', position: 'relative', ...style}}>
    <Img src={staticFile(art)} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain', transform: 'scale(1.15)'}} />
  </div>
);

export const ShortCover: React.FC<ShortCoverProps> = ({format, headline, art, series, category, ribbon}) => {
  const {box} = SHORT_COVER_FORMATS[format];
  const width = box.right - box.left;
  const frame: React.CSSProperties = {position: 'absolute', left: box.left, top: box.top, width, height: box.bottom - box.top, display: 'flex', fontFamily: FONT};
  if (format === 'douyin-landscape') {
    const column = width * 0.5;
    return (
      <AbsoluteFill style={{...paperStyle(40), fontFamily: FONT}}>
        <div style={{...frame, gap: 48}}>
          <div style={{width: column, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', paddingTop: 12, paddingBottom: 12}}>
            <Tag series={series} category={category} size={34} />
            <div style={{fontSize: fit(headline, column, 66, 96), fontWeight: 900, lineHeight: 1.22, color: C.blue}}><Rich text={headline} progress={1} /></div>
            <Ribbon text={ribbon} size={36} />
          </div>
          <Panel art={art} style={{flex: 1}} />
        </div>
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill style={{...paperStyle(40), fontFamily: FONT}}>
      <div style={{...frame, flexDirection: 'column', gap: 40}}>
        <Tag series={series} category={category} size={38} />
        <div style={{flex: 'none', fontSize: fit(headline, width, 72, 118), fontWeight: 900, lineHeight: 1.2, color: C.blue}}><Rich text={headline} progress={1} /></div>
        <Panel art={art} style={{flex: 1, minHeight: 0}} />
        <Ribbon text={ribbon} size={42} />
      </div>
    </AbsoluteFill>
  );
};
