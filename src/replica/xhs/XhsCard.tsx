import React, {useEffect, useState} from 'react';
import {AbsoluteFill, Img, continueRender, delayRender, staticFile} from 'remotion';
import {REPLICA_THEME} from '../theme';
import {estimateTextLines} from '../vertical/verticalLayout';
import type {XhsCardSpec, XhsDeck, XhsWordCard} from './xhsCardData';

/** 小红书 3:4 图文卡（1080×1440）：暖白纸纹、大标题、荧光笔重点、大尺寸小黑。 */
export const XHS_CARD = {width: 1080, height: 1440, fps: 30} as const;

export const PAD = 72;
export const INNER = XHS_CARD.width - PAD * 2;
export const PAPER = '#FFFBF3';
const DOTS = '#EDE4D3';
export const HIGHLIGHTER = '#FFE36E';
export const SOFT_BLUE = '#EAF0FF';
export const SOFT_ORANGE = '#FFEEE2';

export type XhsCardProps = {
  deck: XhsDeck;
  card: XhsCardSpec;
  page: number;
  total: number;
  saveCta: string;
  followCta: string;
  commentPrompt: string;
};

export const img = (src: string) => (/^(?:https?:|data:)/.test(src) ? src : staticFile(src.replace(/^\/+/, '')));

/**
 * Pose art often sits small inside a wide transparent canvas. Measure the visible pixels once in the
 * browser (alpha or non-white) and crop the empty margin with object-view-box, so Xiaohei fills the
 * card without clipping wide scenes. Falls back to the full image if measuring fails.
 */
export const TrimmedImg: React.FC<{src: string; style: React.CSSProperties; pad?: number}> = ({src, style, pad = 0.05}) => {
  const [viewBox, setViewBox] = useState<string | undefined>(undefined);
  const [handle] = useState(() => delayRender(`trim ${src}`));
  useEffect(() => {
    const image = new Image();
    const done = (value?: string) => {
      setViewBox(value);
      continueRender(handle);
    };
    image.onload = () => {
      try {
        const width = 240;
        const height = Math.max(1, Math.round((width * image.naturalHeight) / image.naturalWidth));
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const context = canvas.getContext('2d', {willReadFrequently: true});
        if (!context) return done();
        context.drawImage(image, 0, 0, width, height);
        const {data} = context.getImageData(0, 0, width, height);
        let minX = width, minY = height, maxX = -1, maxY = -1;
        for (let y = 0; y < height; y += 1) {
          for (let x = 0; x < width; x += 1) {
            const i = (y * width + x) * 4;
            const visible = data[i + 3] > 24 && !(data[i] > 244 && data[i + 1] > 244 && data[i + 2] > 244);
            if (!visible) continue;
            if (x < minX) minX = x;
            if (x > maxX) maxX = x;
            if (y < minY) minY = y;
            if (y > maxY) maxY = y;
          }
        }
        if (maxX < 0) return done();
        const pct = (value: number, total: number) => Math.max(0, (value / total) * 100);
        const padX = pad * (maxX - minX), padY = pad * (maxY - minY);
        done(`inset(${pct(minY - padY, height)}% ${pct(width - 1 - maxX - padX, width)}% ${pct(height - 1 - maxY - padY, height)}% ${pct(minX - padX, width)}%)`);
      } catch {
        done();
      }
    };
    image.onerror = () => done();
    image.src = src;
  }, [handle, pad, src]);
  return <Img src={src} style={{...style, objectFit: 'contain', ...(viewBox ? ({objectViewBox: viewBox} as React.CSSProperties) : {})}} />;
};

export const fit = (text: string, max: number, width = INNER, min = 40) => {
  let size = max;
  while (size > min && estimateTextLines([{text}], size, width) > 1) size -= 4;
  return size;
};

const Highlight: React.FC<{word: string; part: string; color?: string}> = ({word, part, color = REPLICA_THEME.primary}) => {
  const at = word.toLocaleLowerCase().lastIndexOf(part.toLocaleLowerCase());
  if (!part || at < 0) return <span style={{color}}>{word}</span>;
  return (
    <span style={{color}}>
      {word.slice(0, at)}
      <span style={{color: REPLICA_THEME.accent, background: `linear-gradient(transparent 58%, ${HIGHLIGHTER} 58%, ${HIGHLIGHTER} 92%, transparent 92%)`}}>
        {word.slice(at, at + part.length)}
      </span>
      {word.slice(at + part.length)}
    </span>
  );
};

export const Frame: React.FC<{series: string; page: number; total: number; children: React.ReactNode}> = ({series, page, total, children}) => (
  <AbsoluteFill style={{background: PAPER, backgroundImage: `radial-gradient(${DOTS} 2.2px, transparent 2.2px)`, backgroundSize: '36px 36px',
    fontFamily: REPLICA_THEME.fontFamily, color: REPLICA_THEME.ink, letterSpacing: 0}}>
    <div style={{position: 'absolute', left: PAD, right: PAD, top: 52, display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
        <div style={{width: 38, height: 48, borderRadius: '19px 19px 14px 14px', background: REPLICA_THEME.ink, position: 'relative'}}>
          <span style={{position: 'absolute', width: 6, height: 6, borderRadius: 6, background: '#fff', left: 10, top: 17}} />
          <span style={{position: 'absolute', width: 6, height: 6, borderRadius: 6, background: '#fff', right: 10, top: 17}} />
        </div>
        <div style={{fontSize: 32, fontWeight: 850, color: REPLICA_THEME.primary}}>{series}</div>
      </div>
      <div style={{fontSize: 30, fontWeight: 800, color: REPLICA_THEME.muted}}>{String(page).padStart(2, '0')} / {String(total).padStart(2, '0')}</div>
    </div>
    {children}
  </AbsoluteFill>
);

export const Ribbon: React.FC<{text: string; top: number}> = ({text, top}) => (
  <div style={{position: 'absolute', left: PAD, right: PAD, top, display: 'flex', justifyContent: 'center'}}>
    <div style={{background: REPLICA_THEME.accent, color: '#fff', fontSize: 40, fontWeight: 880, borderRadius: 20, padding: '14px 40px',
      boxShadow: '0 8px 0 rgba(232,88,16,0.18)'}}>{text}</div>
  </div>
);

const CoverCard: React.FC<{deck: XhsDeck; saveCta: string}> = ({deck, saveCta}) => {
  const rootSize = fit(deck.root, 190);
  return (
    <>
      <div style={{position: 'absolute', left: PAD, top: 150}}>
        <span style={{background: REPLICA_THEME.primary, color: '#fff', fontSize: 34, fontWeight: 850, borderRadius: 999, padding: '10px 28px'}}>{deck.familyLabel ?? '英语词根学习'}</span>
      </div>
      <div style={{position: 'absolute', left: PAD, top: 235, width: INNER, fontSize: rootSize, fontWeight: 900, lineHeight: 1.05, color: REPLICA_THEME.accent, whiteSpace: 'nowrap'}}>
        {deck.root}
      </div>
      <div style={{position: 'absolute', left: PAD, top: 250 + rootSize * 1.08, width: INNER, fontSize: fit(`= ${deck.chineseMeaning}`, 86), fontWeight: 900, whiteSpace: 'nowrap'}}>
        <span style={{color: REPLICA_THEME.primary}}>= </span>
        <span style={{background: `linear-gradient(transparent 60%, ${HIGHLIGHTER} 60%)`}}>{deck.chineseMeaning}</span>
      </div>
      <div style={{position: 'absolute', left: PAD, top: 375 + rootSize * 1.08, width: INNER, fontSize: 44, fontWeight: 760, color: REPLICA_THEME.muted}}>
        {deck.words.length} 个相关词 · 对照动作与例句
      </div>
      <div style={{position: 'absolute', left: (XHS_CARD.width - 700) / 2, top: 640, width: 700, height: 520, borderRadius: 260, background: SOFT_BLUE}} />
      <TrimmedImg src={img(deck.heroArt)} style={{position: 'absolute', left: 190, top: 610, width: 700, height: 580}} pad={0.08} />
      <div style={{position: 'absolute', left: PAD, top: 1200, width: INNER, display: 'flex', flexWrap: 'wrap', gap: 14, justifyContent: 'center'}}>
        {deck.words.map((word) => (
          <span key={word.word} style={{fontSize: deck.words.length > 7 ? 34 : 38, fontWeight: 820, background: '#fff', border: `3px solid ${REPLICA_THEME.primary}`, borderRadius: 999, padding: '4px 20px'}}>
            <Highlight word={word.word} part={word.highlight} />
          </span>
        ))}
      </div>
      <Ribbon text={saveCta} top={1340} />
    </>
  );
};

const WordCard: React.FC<{word: XhsWordCard; index: number}> = ({word, index}) => (
  <>
    <div style={{position: 'absolute', left: PAD, top: 140, fontSize: 30, fontWeight: 850, color: REPLICA_THEME.accent}}>WORD {String(index + 1).padStart(2, '0')}</div>
    <div style={{position: 'absolute', left: PAD, top: 182, width: INNER, fontSize: fit(word.word, 170), fontWeight: 900, lineHeight: 1.08, whiteSpace: 'nowrap'}}>
      <Highlight word={word.word} part={word.highlight} />
    </div>
    {word.formula ? (
      <div style={{position: 'absolute', left: PAD, top: 395, width: INNER, display: 'flex', alignItems: 'center', gap: 22, flexWrap: 'nowrap'}}>
        <span style={{flexShrink: 0, fontSize: 40, fontWeight: 850, color: REPLICA_THEME.primary, border: `3px solid ${REPLICA_THEME.primary}`, borderRadius: 999, padding: '6px 26px', background: '#fff'}}>{word.formula}</span>
        {word.gloss ? <span style={{fontSize: fit(word.gloss, 38, INNER - 420, 28), fontWeight: 760, color: REPLICA_THEME.muted, whiteSpace: 'nowrap'}}>{word.gloss}</span> : null}
      </div>
    ) : null}
    {word.meaning ? (
      <div style={{position: 'absolute', left: PAD, top: 488, width: INNER, fontSize: fit(word.meaning, 76), fontWeight: 900, whiteSpace: 'nowrap'}}>{word.meaning}</div>
    ) : null}
    {word.art ? (
      <div style={{position: 'absolute', left: PAD, top: 620, width: INNER, height: 560, borderRadius: 44, background: SOFT_BLUE, overflow: 'hidden'}}>
        <TrimmedImg src={img(word.art)} style={{position: 'absolute', left: 40, top: 30, width: INNER - 80, height: 500}} />
      </div>
    ) : null}
    {word.example ? (
      <div style={{position: 'absolute', left: PAD, top: 1215, width: INNER, display: 'flex', gap: 20, alignItems: 'flex-start'}}>
        <span style={{flexShrink: 0, fontSize: 32, fontWeight: 850, color: '#fff', background: REPLICA_THEME.accent, borderRadius: 12, padding: '6px 16px', marginTop: 6}}>例句</span>
        <span style={{fontSize: estimateTextLines([{text: word.example}], 46, INNER - 140) > 2 ? 38 : 46, fontWeight: 760, lineHeight: 1.3, color: REPLICA_THEME.ink}}>
          {word.example.split(new RegExp(`(\\b${word.word.replace(/e$/, '')}[a-z]*)`, 'i')).map((part, i) =>
            i % 2 === 1 ? <b key={i} style={{color: REPLICA_THEME.primary, background: `linear-gradient(transparent 62%, ${HIGHLIGHTER} 62%)`}}>{part}</b> : <span key={i}>{part}</span>,
          )}
        </span>
      </div>
    ) : null}
  </>
);

const SummaryCard: React.FC<{deck: XhsDeck; saveCta: string}> = ({deck, saveCta}) => {
  const rowHeight = Math.min(118, Math.floor(980 / deck.words.length));
  return (
    <>
      <div style={{position: 'absolute', left: PAD, top: 140, width: INNER, fontSize: fit(`${deck.root} 一页总结`, 80), fontWeight: 900, whiteSpace: 'nowrap'}}>
        <span style={{color: REPLICA_THEME.accent}}>{deck.root}</span> 一页总结
      </div>
      <div style={{position: 'absolute', left: PAD, top: 250, fontSize: 40, fontWeight: 780, color: REPLICA_THEME.muted}}>
        {deck.root} = {deck.englishMeaning} · {deck.chineseMeaning}
      </div>
      <div style={{position: 'absolute', left: PAD, top: 330, width: INNER, borderRadius: 36, overflow: 'hidden', border: `3px solid ${REPLICA_THEME.primary}`, background: '#fff'}}>
        {deck.words.map((word, index) => (
          <div key={word.word} style={{display: 'flex', alignItems: 'center', height: rowHeight, padding: '0 36px', background: index % 2 ? '#fff' : SOFT_ORANGE}}>
            <div style={{width: 400, fontSize: Math.min(54, rowHeight * 0.5), fontWeight: 880}}><Highlight word={word.word} part={word.highlight} /></div>
            <div style={{flex: 1, fontSize: Math.min(44, rowHeight * 0.4), fontWeight: 800}}>{word.meaning ?? ''}</div>
          </div>
        ))}
      </div>
      <Ribbon text={saveCta} top={1340} />
    </>
  );
};

/** Deterministic shuffle so the self-test order differs from the summary but never changes between renders. */
const shuffled = <T,>(items: T[], seed: string) => {
  let state = [...seed].reduce((sum, char) => (sum * 31 + char.charCodeAt(0)) >>> 0, 7);
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    state = (state * 1103515245 + 12345) >>> 0;
    const j = state % (i + 1);
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

const QuizCard: React.FC<{deck: XhsDeck}> = ({deck}) => {
  const items = shuffled(deck.words.filter((word) => word.meaning), deck.slug);
  const rowHeight = Math.min(120, Math.floor(1000 / Math.max(1, items.length)));
  return (
    <>
      <div style={{position: 'absolute', left: PAD, top: 140, fontSize: 80, fontWeight: 900}}>
        <span style={{background: `linear-gradient(transparent 60%, ${HIGHLIGHTER} 60%)`}}>自测</span>：看中文写单词
      </div>
      <div style={{position: 'absolute', left: PAD, top: 250, fontSize: 40, fontWeight: 780, color: REPLICA_THEME.muted}}>先别往回翻，答案在上一页</div>
      {items.map((word, index) => (
        <div key={word.word} style={{position: 'absolute', left: PAD, top: 340 + index * rowHeight, width: INNER, height: rowHeight, display: 'flex', alignItems: 'center', gap: 24}}>
          <span style={{width: 56, height: 56, flexShrink: 0, borderRadius: 28, background: REPLICA_THEME.primary, color: '#fff', fontSize: 30, fontWeight: 880, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{index + 1}</span>
          <span style={{width: 430, fontSize: Math.min(46, rowHeight * 0.4), fontWeight: 820}}>{word.meaning}</span>
          <span style={{flex: 1, borderBottom: `4px dashed ${REPLICA_THEME.rule}`, height: rowHeight * 0.45}} />
        </div>
      ))}
    </>
  );
};

const EndCard: React.FC<{deck: XhsDeck; followCta: string; commentPrompt: string}> = ({deck, followCta, commentPrompt}) => (
  <>
    <div style={{position: 'absolute', left: (XHS_CARD.width - 760) / 2, top: 230, width: 760, height: 560, borderRadius: 280, background: SOFT_ORANGE}} />
    <TrimmedImg src={img(deck.heroArt)} style={{position: 'absolute', left: 240, top: 240, width: 600, height: 560}} pad={0.08} />
    <div style={{position: 'absolute', left: PAD, top: 890, width: INNER, textAlign: 'center', fontSize: fit(followCta, 72), fontWeight: 900, color: REPLICA_THEME.primary, whiteSpace: 'nowrap'}}>{followCta}</div>
    <div style={{position: 'absolute', left: PAD + 40, top: 1030, width: INNER - 80, background: '#fff', border: `3px solid ${REPLICA_THEME.accent}`, borderRadius: 32, padding: '30px 36px',
      fontSize: 44, fontWeight: 800, lineHeight: 1.35, textAlign: 'center', boxSizing: 'border-box'}}>{commentPrompt}</div>
  </>
);

export const XhsCard: React.FC<XhsCardProps> = ({deck, card, page, total, saveCta, followCta, commentPrompt}) => (
  <Frame series={deck.series} page={page} total={total}>
    {card.kind === 'cover' ? <CoverCard deck={deck} saveCta={saveCta} /> : null}
    {card.kind === 'word' ? <WordCard word={deck.words[card.index]} index={card.index} /> : null}
    {card.kind === 'summary' ? <SummaryCard deck={deck} saveCta={saveCta} /> : null}
    {card.kind === 'quiz' ? <QuizCard deck={deck} /> : null}
    {card.kind === 'end' ? <EndCard deck={deck} followCta={followCta} commentPrompt={commentPrompt} /> : null}
  </Frame>
);
