import React from 'react';
import {REPLICA_THEME} from '../theme';
import {estimateTextLines} from '../vertical/verticalLayout';
import {methodDeckArt, type MethodCardSpec, type MethodDeck} from './methodDeck';
import {Frame, HIGHLIGHTER, INNER, PAD, Ribbon, SOFT_BLUE, SOFT_ORANGE, TrimmedImg, fit, img} from './XhsCard';

/** 小红书 3:4 方法卡（四六级写作/阅读/翻译）：与词根卡同一套纸纹、荧光笔、小黑和收藏条。 */
export type XhsMethodCardProps = {
  deck: MethodDeck;
  card: MethodCardSpec;
  page: number;
  total: number;
  saveCta: string;
  followCta: string;
  commentPrompt: string;
};

/** Largest size (≤ max) that keeps the text within maxLines at the given width. */
const sizeFor = (text: string, max: number, maxLines: number, width = INNER, min = 30) => {
  let size = max;
  while (size > min && estimateTextLines([{text}], size, width) > maxLines) size -= 2;
  return size;
};

const marker = `linear-gradient(transparent 60%, ${HIGHLIGHTER} 60%)`;

/** Reuse art on supporting cards only when the lesson has enough distinct pictures; one image on every card looks lazy. */
const artVariety = (deck: MethodDeck) => methodDeckArt(deck).length >= 3;

const Column: React.FC<{children: React.ReactNode; top?: number; bottom?: number; center?: boolean}> = ({children, top = 140, bottom = 150, center = false}) => (
  <div style={{position: 'absolute', left: PAD, top, width: INNER, bottom, display: 'flex', flexDirection: 'column', gap: center ? 44 : 30, justifyContent: center ? 'center' : 'flex-start'}}>{children}</div>
);

const Label: React.FC<{text: string; tone?: 'orange' | 'blue'}> = ({text, tone = 'orange'}) => (
  <div><span style={{background: tone === 'orange' ? REPLICA_THEME.accent : REPLICA_THEME.primary, color: '#fff', fontSize: 34, fontWeight: 850,
    borderRadius: 999, padding: '8px 26px'}}>{text}</span></div>
);

const EnglishBox: React.FC<{text: string; max?: number; maxLines?: number}> = ({text, max = 48, maxLines = 6}) => {
  const lines = text.split('\n');
  const size = Math.min(...lines.map((line) => sizeFor(line, max, Math.max(1, Math.floor(maxLines / lines.length)), INNER - 90)));
  return (
    <div style={{background: '#fff', borderLeft: `10px solid ${REPLICA_THEME.primary}`, borderRadius: 24, padding: '26px 34px', boxShadow: '0 6px 0 rgba(4,31,160,0.08)'}}>
      {lines.map((line) => (
        <div key={line} style={{fontSize: size, fontWeight: 760, lineHeight: 1.35, color: REPLICA_THEME.ink, marginBottom: lines.length > 1 ? 12 : 0}}>{line}</div>
      ))}
    </div>
  );
};

const ArtPanel: React.FC<{src: string; tone?: string}> = ({src, tone = SOFT_BLUE}) => (
  <div style={{flex: 1, minHeight: 260, position: 'relative', borderRadius: 40, background: tone, overflow: 'hidden'}}>
    <TrimmedImg src={img(src)} style={{position: 'absolute', left: 36, top: 24, right: 36, bottom: 24, width: 'calc(100% - 72px)', height: 'calc(100% - 48px)'}} />
  </div>
);

const Cover: React.FC<{deck: MethodDeck; saveCta: string}> = ({deck, saveCta}) => (
  <>
    <Column top={150} bottom={180}>
      <Label text={deck.examLabel} tone="blue" />
      <div style={{fontSize: estimateTextLines([{text: deck.title}], 88, INNER) === 1 ? sizeFor(deck.title, 132, 1) : sizeFor(deck.title, 120, 2), fontWeight: 900, lineHeight: 1.12, color: REPLICA_THEME.accent}}>{deck.title}</div>
      <div style={{fontSize: fit(deck.subtitle, 72), fontWeight: 900, whiteSpace: 'nowrap'}}><span style={{background: marker}}>{deck.subtitle}</span></div>
      <ArtPanel src={deck.heroArt} />
      <div style={{display: 'flex', flexWrap: 'wrap', gap: 14, justifyContent: 'center'}}>
        {deck.checklist.map((item, index) => (
          <span key={item} style={{fontSize: 34, fontWeight: 820, background: '#fff', border: `3px solid ${REPLICA_THEME.primary}`, borderRadius: 999, padding: '4px 20px', color: REPLICA_THEME.primary}}>
            {index + 1}. {item}
          </span>
        ))}
      </div>
    </Column>
    <Ribbon text={saveCta} top={1320} />
  </>
);

const Task: React.FC<{deck: MethodDeck}> = ({deck}) => {
  const long = deck.task.text.length > 120;
  return (
    <Column>
      <Label text={deck.task.label} />
      <div style={{fontSize: 64, fontWeight: 900}}>先读题</div>
      <div style={{background: '#fff', borderRadius: 32, padding: '34px 40px', border: `3px solid ${REPLICA_THEME.rule}`,
        fontSize: sizeFor(deck.task.text, long ? 42 : artVariety(deck) ? 54 : 76, long ? 12 : 6, INNER - 80), fontWeight: 720, lineHeight: 1.5}}>{deck.task.text}</div>
      {deck.task.question ? (
        <div style={{fontSize: sizeFor(deck.task.question, 50, 2), fontWeight: 880, color: REPLICA_THEME.primary}}>Q：{deck.task.question}</div>
      ) : null}
      {deck.task.note ? <div style={{fontSize: 38, fontWeight: 760, color: REPLICA_THEME.muted}}>{deck.task.note}</div> : null}
      {long || !artVariety(deck) ? null : <ArtPanel src={deck.heroArt} tone={SOFT_ORANGE} />}
      <div style={{marginTop: long || !artVariety(deck) ? 'auto' : 0, fontSize: 40, fontWeight: 820, color: REPLICA_THEME.accent}}>先自己想 10 秒，再往后翻 →</div>
    </Column>
  );
};

const Wrong: React.FC<{deck: MethodDeck}> = ({deck}) => (
  <Column center={!artVariety(deck)}>
    <Label text="常见错误" />
    <div style={{fontSize: sizeFor(deck.wrong!.label, 72, 2), fontWeight: 900}}>{deck.wrong!.label}</div>
    <div style={{background: '#F4F4F6', borderRadius: 32, padding: '34px 40px', border: '4px dashed #D9534F', color: REPLICA_THEME.muted,
      fontSize: sizeFor(deck.wrong!.text, 50, 6, INNER - 80), fontWeight: 720, lineHeight: 1.45, textDecoration: 'line-through', textDecorationColor: 'rgba(217,83,79,0.6)'}}>{deck.wrong!.text}</div>
    {deck.wrong!.note ? (
      <div style={{fontSize: sizeFor(deck.wrong!.note, 50, 3), fontWeight: 860, lineHeight: 1.35}}><span style={{background: marker}}>{deck.wrong!.note}</span></div>
    ) : null}
    {artVariety(deck) ? <ArtPanel src={deck.heroArt} tone={SOFT_ORANGE} /> : null}
  </Column>
);

const Step: React.FC<{deck: MethodDeck; index: number}> = ({deck, index}) => {
  const step = deck.steps[index];
  // Without art, the text itself carries the card: bigger type, vertically centred.
  const big = !step.art;
  return (
    <Column>
      <div style={{fontSize: 36, fontWeight: 880, color: REPLICA_THEME.accent}}>{step.label}</div>
      <div style={{flex: big ? 1 : undefined, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: big ? 48 : 30}}>
        <div style={{fontSize: sizeFor(step.title, big ? 96 : 76, 3), fontWeight: 900, lineHeight: 1.22}}>{step.title}</div>
        {step.english ? <EnglishBox text={step.english} max={big ? 60 : 48} maxLines={big ? 8 : Math.max(4, step.english.split('\n').length * 2)} /> : null}
        {step.detail ? <div style={{fontSize: sizeFor(step.detail, big ? 50 : 42, 2), fontWeight: 800, color: REPLICA_THEME.primary}}><span style={{background: marker}}>{step.detail}</span></div> : null}
      </div>
      {step.art ? <ArtPanel src={step.art} /> : null}
    </Column>
  );
};

const Checklist: React.FC<{deck: MethodDeck; saveCta: string}> = ({deck, saveCta}) => (
  <>
    <Column bottom={190}>
      <Label text="一页收藏" tone="blue" />
      <div style={{fontSize: sizeFor(`${deck.examLabel}检查清单`, 92, 1), fontWeight: 900}}>{deck.examLabel}<span style={{background: marker}}>检查清单</span></div>
      {deck.checklist.map((item, index) => (
        <div key={item} style={{display: 'flex', alignItems: 'center', gap: 28, background: index % 2 ? '#fff' : SOFT_ORANGE, borderRadius: 28, padding: artVariety(deck) ? '30px 36px' : '52px 40px'}}>
          <span style={{width: 76, height: 76, flexShrink: 0, borderRadius: 38, background: REPLICA_THEME.primary, color: '#fff', fontSize: 40, fontWeight: 900,
            display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{index + 1}</span>
          <span style={{fontSize: sizeFor(item, artVariety(deck) ? 58 : 72, 2, INNER - 180), fontWeight: 880}}>{item}</span>
        </div>
      ))}
      {artVariety(deck) ? <ArtPanel src={deck.heroArt} /> : null}
    </Column>
    <Ribbon text={saveCta} top={1320} />
  </>
);

const Practice: React.FC<{deck: MethodDeck}> = ({deck}) => (
  <Column>
    <Label text={deck.practice.label} />
    <div style={{fontSize: 72, fontWeight: 900}}>换一题，<span style={{background: marker}}>自己试试</span></div>
    <div style={{background: '#fff', borderRadius: 32, padding: '34px 40px', border: `3px solid ${REPLICA_THEME.primary}`,
      fontSize: sizeFor(deck.practice.text, artVariety(deck) ? 52 : 68, 9, INNER - 80), fontWeight: 720, lineHeight: 1.5}}>{deck.practice.text}</div>
    {deck.practice.question ? <div style={{fontSize: sizeFor(deck.practice.question, 48, 2), fontWeight: 880, color: REPLICA_THEME.primary}}>Q：{deck.practice.question}</div> : null}
    {deck.practice.hint ? <div style={{fontSize: sizeFor(deck.practice.hint, 42, 2), fontWeight: 800, color: REPLICA_THEME.accent}}>提示：{deck.practice.hint}</div> : null}
    {deck.practice.art && deck.practice.text.length <= 160 && artVariety(deck) ? <ArtPanel src={deck.practice.art} /> : null}
    <div style={{marginTop: deck.practice.art && deck.practice.text.length <= 160 && artVariety(deck) ? 0 : 'auto', fontSize: 40, fontWeight: 820, color: REPLICA_THEME.muted}}>写完再翻到下一页对答案 →</div>
  </Column>
);

const Answer: React.FC<{deck: MethodDeck}> = ({deck}) => (
  <Column center={!artVariety(deck)}>
    <Label text="参考答案" tone="blue" />
    <div style={{fontSize: 72, fontWeight: 900}}>对一对</div>
    <EnglishBox text={deck.answer.text} max={52} maxLines={8} />
    {deck.answer.note ? <div style={{fontSize: sizeFor(deck.answer.note, 42, 3), fontWeight: 800, lineHeight: 1.4, color: REPLICA_THEME.muted}}>{deck.answer.note}</div> : null}
    {artVariety(deck) ? <ArtPanel src={deck.steps.at(-1)?.art ?? deck.heroArt} tone={SOFT_ORANGE} /> : null}
  </Column>
);

const End: React.FC<{deck: MethodDeck; followCta: string; commentPrompt: string}> = ({deck, followCta, commentPrompt}) => (
  <Column top={170} bottom={110}>
    <ArtPanel src={deck.heroArt} tone={SOFT_ORANGE} />
    <div style={{textAlign: 'center', fontSize: fit(followCta, 70), fontWeight: 900, color: REPLICA_THEME.primary, whiteSpace: 'nowrap'}}>{followCta}</div>
    <div style={{background: '#fff', border: `3px solid ${REPLICA_THEME.accent}`, borderRadius: 32, padding: '30px 36px', fontSize: 44, fontWeight: 800, lineHeight: 1.35, textAlign: 'center'}}>{commentPrompt}</div>
  </Column>
);

export const XhsMethodCard: React.FC<XhsMethodCardProps> = ({deck, card, page, total, saveCta, followCta, commentPrompt}) => (
  <Frame series={deck.series} page={page} total={total}>
    {card.kind === 'cover' ? <Cover deck={deck} saveCta={saveCta} /> : null}
    {card.kind === 'task' ? <Task deck={deck} /> : null}
    {card.kind === 'wrong' && deck.wrong ? <Wrong deck={deck} /> : null}
    {card.kind === 'step' ? <Step deck={deck} index={card.index} /> : null}
    {card.kind === 'checklist' ? <Checklist deck={deck} saveCta={saveCta} /> : null}
    {card.kind === 'practice' ? <Practice deck={deck} /> : null}
    {card.kind === 'answer' ? <Answer deck={deck} /> : null}
    {card.kind === 'end' ? <End deck={deck} followCta={followCta} commentPrompt={commentPrompt} /> : null}
  </Frame>
);
