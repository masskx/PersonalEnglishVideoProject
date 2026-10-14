import type {ReplicaCoverDefinition} from '../replica/projectTypes';
import {writingArt} from './lesson';

export const CET6_WRITING_COVER: ReplicaCoverDefinition = {
  seriesLabel: '小黑英语',
  badgeLabel: '六级写作方法卡',
  landscapeBadgeLabel: '六级写作方法课',
  footerLabel: 'CET6 WRITING',
  landscapeFooterLabel: 'CET6 WRITING · 4:3',
  eyebrow: '议论段多一步',
  footerTagline: '一句让步 · 一句转折 · 一个例子',
  root: 'CET6',
  englishMeaning: 'WRITING',
  chineseMeaning: '六级作文 · 让步与反驳',
  hook: '先让一步，再把话说回来',
  words: ['It is true that', 'Admittedly', 'However', 'Even so', 'For example'],
  wordHighlights: ['true', 'Admittedly', 'However', 'Even so', 'example'],
  familyLabel: '让步段三句话',
  illustrationPath: writingArt.hook,
  illustrationPosition: '50% 50%',
  illustrationFit: 'contain',
  illustrationScale: 1.05,
};
