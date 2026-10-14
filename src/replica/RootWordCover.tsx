import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import type {ReplicaCoverDefinition} from './projectTypes';
import {REPLICA_THEME, SOFT_BLUE, highlighterStyle, paperStyle} from './theme';

export const ROOT_WORD_COVER = {
  width: 1080,
  height: 1440,
  fps: 30,
} as const;

export const ROOT_WORD_LANDSCAPE_COVER = {
  width: 1200,
  height: 900,
  fps: 30,
} as const;

export type RootWordCoverProps = {
  cover: ReplicaCoverDefinition;
};

const BrandMark: React.FC<{label: string}> = ({label}) => (
  <div style={{display: 'flex', alignItems: 'center', gap: 18}}>
    <div
      style={{
        width: 46,
        height: 58,
        borderRadius: '23px 23px 17px 17px',
        background: REPLICA_THEME.ink,
        position: 'relative',
        transform: 'rotate(-2deg)',
      }}
    >
      <span style={{position: 'absolute', width: 7, height: 7, borderRadius: 8, background: '#fff', left: 13, top: 20}} />
      <span style={{position: 'absolute', width: 7, height: 7, borderRadius: 8, background: '#fff', right: 13, top: 20}} />
    </div>
    <div style={{fontSize: 34, fontWeight: 800, color: REPLICA_THEME.primary}}>{label}</div>
  </div>
);

const Word: React.FC<{word: string; highlight: string}> = ({word, highlight}) => {
  const at = word.toLocaleLowerCase().lastIndexOf(highlight.toLocaleLowerCase());
  const before = at < 0 ? word : word.slice(0, at);
  const match = at < 0 ? '' : word.slice(at, at + highlight.length);
  const after = at < 0 ? '' : word.slice(at + highlight.length);
  return (
    <span style={{whiteSpace: 'nowrap'}}>
      <span>{before}</span>
      <span style={{color: REPLICA_THEME.accent}}>{match}</span>
      <span>{after}</span>
    </span>
  );
};

const MotionArrow: React.FC = () => (
  <svg width="248" height="116" viewBox="0 0 248 116" style={{display: 'block'}}>
    <path
      d="M 18 93 C 84 100, 151 78, 211 29"
      fill="none"
      stroke={REPLICA_THEME.accent}
      strokeWidth="8"
      strokeLinecap="round"
    />
    <path
      d="M 190 28 L 219 21 L 213 50"
      fill="none"
      stroke={REPLICA_THEME.accent}
      strokeWidth="8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M 51 93 L 39 105" stroke={REPLICA_THEME.primary} strokeWidth="5" strokeLinecap="round" />
    <path d="M 79 91 L 73 108" stroke={REPLICA_THEME.primary} strokeWidth="5" strokeLinecap="round" />
  </svg>
);

export const RootWordCover: React.FC<RootWordCoverProps> = ({cover}) => {
  const root = cover.root.replace(/^-|-$/g, '');
  const rootFontSize = cover.root.length > 9 ? 116 : cover.root.length > 6 ? 145 : 192;
  const meaningFontSize = cover.englishMeaning.length > 12 ? 57 : cover.englishMeaning.length > 9 ? 70 : 82;
  const chineseFontSize = cover.chineseMeaning.length > 8 ? 56 : 68;
  const wordCharacterCount = cover.words.join('').length;
  const denseWords = wordCharacterCount > 34;
  const wordFontSize = denseWords ? 31 : wordCharacterCount > 28 ? 34 : 38;
  return (
    <AbsoluteFill
      style={{
        ...paperStyle(),
        fontFamily: REPLICA_THEME.fontFamily,
        letterSpacing: 0,
        color: REPLICA_THEME.primary,
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 38,
          border: `4px solid ${REPLICA_THEME.primary}`,
          borderRadius: 48,
        }}
      />

      <div style={{position: 'absolute', left: 76, right: 76, top: 72, display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
        <BrandMark label={cover.seriesLabel} />
        <div
          style={{
            border: `3px solid ${REPLICA_THEME.accent}`,
            borderRadius: 999,
            padding: '12px 23px 13px',
            fontSize: 25,
            fontWeight: 800,
            color: REPLICA_THEME.accent,
          }}
        >
          {cover.badgeLabel ?? '词根动画记忆卡'}
        </div>
      </div>

      <div style={{position: 'absolute', left: 78, top: 188, display: 'flex', alignItems: 'center', gap: 14}}>
        <div style={{width: 42, height: 6, borderRadius: 6, background: REPLICA_THEME.accent, transform: 'rotate(-4deg)'}} />
        <div style={{fontSize: 28, fontWeight: 800, color: REPLICA_THEME.muted}}>{cover.eyebrow ?? '词根就是一个动作'}</div>
      </div>

      <div style={{position: 'absolute', left: 70, top: 224, fontSize: rootFontSize, lineHeight: 1, fontWeight: 900, color: REPLICA_THEME.primary}}>
        {cover.root}
      </div>
      <div style={{position: 'absolute', left: 82, top: 425, display: 'flex', alignItems: 'baseline', gap: 17}}>
        <span style={{fontSize: 67, fontWeight: 900, color: REPLICA_THEME.primary}}>=</span>
        <span style={{fontSize: meaningFontSize, fontWeight: 900, color: REPLICA_THEME.accent}}>{cover.englishMeaning}</span>
      </div>
      <div style={{position: 'absolute', left: 82, top: 538, zIndex: 2, fontSize: chineseFontSize, lineHeight: 1.2, fontWeight: 900, color: REPLICA_THEME.ink}}>
        <span style={highlighterStyle(1)}>{cover.chineseMeaning}</span>
      </div>

      <div style={{position: 'absolute', left: 72, top: 640, width: 295}}>
        <MotionArrow />
      </div>

      <div
        style={{
          position: 'absolute',
          right: 42,
          top: 560,
          width: 700,
          height: 590,
          overflow: 'hidden',
          borderRadius: 48,
          backgroundColor: SOFT_BLUE,
        }}
      >
        <Img
          src={staticFile(cover.illustrationPath)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: cover.illustrationFit ?? 'cover',
            objectPosition: cover.illustrationPosition ?? '50% 50%',
            transform: `scale(${cover.illustrationScale ?? 1.12})`,
          }}
        />
      </div>

      <div
        style={{
          position: 'absolute',
          left: 74,
          top: 866,
          padding: '14px 23px 15px',
          borderRadius: 18,
          zIndex: 2,
          background: REPLICA_THEME.accent,
          color: '#FFFFFF',
          fontSize: 27,
          fontWeight: 800,
          transform: 'rotate(-1.5deg)',
        }}
      >
        {cover.hook}
      </div>

      <div style={{position: 'absolute', left: 76, right: 76, top: 1138}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 17, marginBottom: 24}}>
          <div style={{fontSize: 26, fontWeight: 800, color: REPLICA_THEME.muted}}>{cover.familyLabel ?? '这一串，一起记'}</div>
          <div style={{height: 3, flex: 1, background: REPLICA_THEME.rule, borderRadius: 3}} />
        </div>
        <div style={{display: 'flex', flexWrap: 'wrap', gap: denseWords ? '10px 12px' : '14px 19px', fontSize: wordFontSize, lineHeight: 1.3, fontWeight: 900}}>
          {cover.words.map((word, index) => (
            <div
              key={word}
              style={{
                border: `3px solid ${REPLICA_THEME.primary}`,
                borderRadius: 999,
                padding: denseWords ? '8px 16px 10px' : '9px 20px 11px',
                background: '#FFFFFF',
              }}
            >
              <Word word={word} highlight={cover.wordHighlights?.[index] ?? root} />
            </div>
          ))}
        </div>
      </div>

      <div style={{position: 'absolute', left: 76, right: 76, bottom: 66, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <div style={{fontSize: 24, fontWeight: 700, color: REPLICA_THEME.muted}}>看动作 · 拆前缀 · 记词族</div>
        <div style={{fontSize: 24, fontWeight: 900, color: REPLICA_THEME.primary}}>{cover.footerLabel ?? 'ROOT WORDS'}</div>
      </div>
    </AbsoluteFill>
  );
};

export const RootWordLandscapeCover: React.FC<RootWordCoverProps> = ({cover}) => {
  const root = cover.root.replace(/^-|-$/g, '');
  // The root must fit the 570px text column; the illustration panel sits right of it.
  const rootFontSize = cover.root.length > 10 ? 76 : cover.root.length > 8 ? 92 : 118;
  const meaningFontSize = cover.englishMeaning.length > 15 ? 34 : cover.englishMeaning.length > 10 ? 40 : 48;
  const chineseFontSize = cover.chineseMeaning.length > 10 ? 30 : 36;
  const wordCharacterCount = cover.words.join('').length;
  const denseWords = wordCharacterCount > 34;
  const wordFontSize = denseWords ? 21 : wordCharacterCount > 28 ? 23 : 26;

  return (
    <AbsoluteFill
      style={{
        ...paperStyle(),
        fontFamily: REPLICA_THEME.fontFamily,
        letterSpacing: 0,
        color: REPLICA_THEME.primary,
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 28,
          border: `3px solid ${REPLICA_THEME.primary}`,
          borderRadius: 36,
        }}
      />

      <div style={{position: 'absolute', left: 58, right: 58, top: 48, display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
        <BrandMark label={cover.seriesLabel} />
        <div style={{border: `3px solid ${REPLICA_THEME.accent}`, borderRadius: 999, padding: '11px 23px 12px', fontSize: 24, fontWeight: 800, color: REPLICA_THEME.accent}}>
        {cover.landscapeBadgeLabel ?? '词根动画记忆课'}
        </div>
      </div>

      <div style={{position: 'absolute', left: 62, top: 132, display: 'flex', alignItems: 'center', gap: 11}}>
        <div style={{width: 34, height: 5, borderRadius: 8, background: REPLICA_THEME.accent, transform: 'rotate(-4deg)'}} />
        <div style={{fontSize: 29, fontWeight: 800, color: REPLICA_THEME.muted}}>{cover.eyebrow ?? '词根就是一个动作'}</div>
      </div>

      <div style={{position: 'absolute', left: 58, top: 168, width: 570, zIndex: 2}}>
        <div style={{fontSize: rootFontSize, lineHeight: 0.95, fontWeight: 900, color: REPLICA_THEME.primary}}>{cover.root}</div>
        <div style={{marginTop: 20, display: 'flex', alignItems: 'baseline', gap: 12}}>
          <span style={{fontSize: 40, fontWeight: 900}}>=</span>
          <span style={{fontSize: meaningFontSize, lineHeight: 1, fontWeight: 900, color: REPLICA_THEME.accent}}>{cover.englishMeaning}</span>
        </div>
        <div style={{marginTop: 16, fontSize: chineseFontSize, lineHeight: 1.22, fontWeight: 900, color: REPLICA_THEME.ink}}><span style={highlighterStyle(1)}>{cover.chineseMeaning}</span></div>
        <div style={{marginTop: 26, display: 'inline-block', maxWidth: 520, padding: '11px 17px 13px', borderRadius: 14, background: REPLICA_THEME.accent, color: '#FFFFFF', fontSize: 20, lineHeight: 1.35, fontWeight: 800, transform: 'rotate(-1deg)'}}>
          {cover.hook}
        </div>
      </div>

      <div style={{position: 'absolute', right: 38, top: 130, width: 610, height: 530, overflow: 'hidden', borderRadius: 40, backgroundColor: SOFT_BLUE}}>
        <Img
          src={staticFile(cover.illustrationPath)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: cover.illustrationFit ?? 'cover',
            objectPosition: cover.illustrationPosition ?? '50% 50%',
            transform: `scale(${Math.min(1.32, (cover.illustrationScale ?? 1.12) * 1.02)})`,
          }}
        />
      </div>

      <div style={{position: 'absolute', left: 52, top: 535, width: 190, transform: 'scale(0.72)', transformOrigin: 'top left'}}>
        <MotionArrow />
      </div>

      <div style={{position: 'absolute', left: 58, right: 58, top: 682}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 13, marginBottom: 14}}>
          <div style={{fontSize: 24, fontWeight: 800, color: REPLICA_THEME.muted}}>{cover.familyLabel ?? '这一串，一起记'}</div>
          <div style={{height: 3, flex: 1, background: REPLICA_THEME.rule, borderRadius: 3}} />
        </div>
        <div style={{display: 'flex', flexWrap: 'wrap', gap: denseWords ? '8px 9px' : '9px 12px', fontSize: wordFontSize, lineHeight: 1.2, fontWeight: 900}}>
          {cover.words.map((word, index) => (
            <div key={word} style={{border: `2px solid ${REPLICA_THEME.primary}`, borderRadius: 999, padding: denseWords ? '6px 11px 7px' : '7px 14px 8px', background: '#FFFFFF'}}>
              <Word word={word} highlight={cover.wordHighlights?.[index] ?? root} />
            </div>
          ))}
        </div>
      </div>

      <div style={{position: 'absolute', left: 58, right: 58, bottom: 42, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <div style={{fontSize: 23, fontWeight: 700, color: REPLICA_THEME.muted}}>看动作 · 拆前缀 · 记词族</div>
        <div style={{fontSize: 23, fontWeight: 900, color: REPLICA_THEME.primary}}>{cover.landscapeFooterLabel ?? 'ROOT WORDS · 4:3'}</div>
      </div>
    </AbsoluteFill>
  );
};
