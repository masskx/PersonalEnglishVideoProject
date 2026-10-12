import {memeVocabOutputDirectory} from './paths';

export const memeVocabShortJsonSchema = {
  $schema: 'https://json-schema.org/draft/2020-12/schema',
  title: 'Meme Vocab Short Input',
  type: 'object',
  additionalProperties: false,
  required: ['targetWord'],
  properties: {
    targetWord: {type: 'string', minLength: 1},
    phonetic: {type: 'string', default: ''},
    accurateMeaning: {type: 'string', default: ''},
    audience: {type: 'string', default: '四六级与考研学生'},
    memeTheme: {type: 'string', default: '大学生活荒诞冲突'},
    scenario: {type: 'string', default: '会议现场突然发生异常行为'},
    durationTarget: {type: 'number', minimum: 15, maximum: 28, default: 22},
    difficulty: {type: 'string', default: 'CET-6'},
    relatedWords: {type: 'array', items: {type: 'string'}, maxItems: 3, default: []},
    exampleSentence: {type: 'string', default: ''},
    interactionType: {enum: ['two_choice', 'fill_blank', 'confusable_word'], default: 'confusable_word'},
    voiceStyle: {type: 'string', default: '自然、快速、带一点吐槽'},
    visualStyle: {type: 'string', default: '白底小黑、橙蓝强调、荒诞手绘'},
    characterProfile: {type: 'string', default: '黑色实心小黑，白点眼，细腿，冷静认真'},
    assetDirectory: {type: 'string', default: 'public/assets/meme-vocab/{targetWord}'},
    bgm: {type: 'string', default: 'assets/music/root-word-series-bgm.mp3'},
    outputDirectory: {type: 'string', default: memeVocabOutputDirectory('{targetWord}')},
  },
} as const;
