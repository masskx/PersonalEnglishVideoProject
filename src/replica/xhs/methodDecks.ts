import {cetTranslationDeck} from '../../cet-translation/xhs';
import {cetWritingDeck} from '../../cet-writing/xhs';
import {cet6ReadingDeck} from '../../cet6-reading/xhs';
import {cet6WritingDeck} from '../../cet6-writing/xhs';
import type {MethodDeck} from './methodDeck';

/** 所有四六级方法类图文卡。新栏目在自己的目录导出 deck 后加到这里。 */
export const methodDecks: readonly MethodDeck[] = [cetWritingDeck, cetTranslationDeck, cet6ReadingDeck, cet6WritingDeck];

export const findMethodDeck = (slug: string) => {
  const normalized = slug.trim().toLocaleLowerCase();
  return methodDecks.find((deck) => deck.slug === normalized || deck.deliveryDir.endsWith(`/${normalized}`));
};
