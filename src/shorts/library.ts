import {HOOK_ROTATION, type HookType, type ShortScript} from './types';

const clud = (name: string) => `assets/replica/clud-clus/${name}.png`;
const cet6w = (name: string) => `assets/replica/cet6-writing-concession/${name}.png`;
const poses = (word: string) => ['before', 'change', 'result'].map((stage) => clud(`${word}-${stage}`));
/** 答案拍结尾的收藏提示（v2：不再单独做收藏节拍，答案就是结尾）。 */
const SAVE = '收藏这条，考前翻出来。';

/**
 * 竖屏短视频脚本库（抖音与小红书发同一条）。规则见 AGENTS.md 第 7 节：
 * 0–2 秒钩子（画面第一帧就有大字和小黑）→ 讲一个点 → 暂停作答（2 秒倒计时）→ 答案 + 收藏（答案即结尾）。
 * 数组顺序 = 发布顺序；第 i 条的钩子类型必须是 HOOK_ROTATION[i % 4]（挑战 → 错误 → 反差 → 结果先行）。
 * 新视频追加在末尾，用 nextHookType() 取它该用的钩子类型。v2：每段旁白 3–5 秒，全片 20–30 秒。
 */
export const shortLibrary: readonly ShortScript[] = [
  {
    // 2026-10-14 20:49 已发布到抖音（旧模板 v1，原样存档；数据见 planning/douyin-metrics.json）。
    id: 'exclude-preclude',
    version: 1,
    episode: 'clud-clus',
    category: '六级 · 考研词汇',
    topic: 'exclude 和 preclude：排除，还是办不成',
    hookType: 'challenge',
    hook: {id: 'hook-a', kind: 'hook', headline: '受伤**没法**参赛\n用 excluded 还是 **precluded**？', voice: '受伤没法参赛，用 excluded 还是 precluded？很多人选错。', art: clud('preclude-result')},
    body: [
      {id: 'fix-ex', kind: 'fix', headline: '**exclude**：不纳入', voice: 'exclude 是不纳入。把人或费用，留在名单外面。', arts: poses('exclude'), example: 'He was excluded from the team.'},
      {id: 'fix-pre', kind: 'fix', headline: '**preclude**：让事情办不成', voice: 'preclude 是提前堵住。球还没滚过去，闸门先关上，事情就办不成。', arts: poses('preclude'), example: 'The injury precluded him from playing.', exampleAt: 0.55},
      {id: 'test', kind: 'test', headline: 'Heavy rain ___ the game.\n（大雨让比赛办不成）', options: ['excluded', 'precluded'], correct: 1, pause: 3, voice: '考考你：大雨让比赛办不成，选哪个？'},
      {id: 'answer', kind: 'answer', headline: '答案：**precluded**', voice: '答案是 precluded。事情办不成，就用 preclude。', art: clud('preclude-result'), example: 'Heavy rain precluded the game.', exampleAt: 0.1},
      {id: 'cta', kind: 'cta', headline: '收藏这条\n写作文少踩一个坑', voice: '收藏这条，写作文少踩一个坑。关注小黑，每天一个四六级小技巧。', art: clud('preclude-result')},
    ],
    publish: {
      title: '受伤没法参赛，用excluded还是precluded？',
      xhsTitle: 'exclude和preclude差在哪',
      body: 'exclude 是不纳入，preclude 是让事情办不成。一个闸门记住区别，结尾有小题，评论区交答案。',
      tags: ['#六级词汇', '#考研英语', '#英语单词', '#易混词', '#四六级备考', '#小黑英语'],
      pinnedComment: '答案：Heavy rain precluded the game. 你选对了吗？还有哪组“意思差不多”的词想看，评论区告诉我～',
    },
  },
  {
    id: 'concession-sentence',
    episode: 'cet6-writing-concession',
    category: '六级作文',
    topic: '六级作文让步句：It is true that… However…',
    hookType: 'mistake',
    hook: {id: 'hook', kind: 'mistake', headline: '作文开头写\n**I totally agree**？', wrong: 'I totally agree. Part-time jobs are good.', right: 'It is true that … However, …', voice: '六级作文开头只会写 I totally agree？像喊口号。', art: cet6w('hook-scale')},
    body: [
      {id: 'fix-concede', kind: 'fix', headline: '先让步：\n**It is true that …**', voice: '先承认对方：It is true that part-time jobs take time.', art: cet6w('concede-nod'), english: true, example: 'It is true that part-time jobs take time.', exampleAt: 0.25},
      {id: 'fix-turn', kind: 'fix', headline: '再转回：\n**However, …**', voice: '再转回来：However, they teach students to plan their time.', art: cet6w('turn-arrow'), english: true, example: 'However, they teach students to plan their time.', exampleAt: 0.25},
      {id: 'test', kind: 'test', headline: '写“网课会取代课堂吗”\n哪句是让步开头？', options: ['Online courses are bad.', 'Admittedly, online courses are flexible.'], correct: 1, pause: 2, voice: '考考你：哪句是让步开头？'},
      {id: 'answer', kind: 'answer', headline: '答案：**B. Admittedly …**', voice: `答案是 B：先承认，再用 However 转回来。${SAVE}`, art: cet6w('turn-arrow'), example: 'Admittedly, … However, …', exampleAt: 0.05},
    ],
    publish: {
      title: '六级作文只会写I totally agree？',
      xhsTitle: '六级作文让步句，考前背熟',
      body: '让步一句 It is true that…，转折一句 However…，再给一个例子。结尾有小题，评论区交答案。',
      tags: ['#六级作文', '#六级写作', '#英语六级', '#英语写作', '#四六级备考', '#小黑英语'],
      pinnedComment: '答案：B. Admittedly, online courses are flexible. 下一句你会怎么用 However 转回来？评论区写写看～',
    },
  },
  {
    id: 'include-exclude',
    episode: 'clud-clus',
    category: '四六级词汇',
    topic: 'include 和 exclude：早餐算不算钱',
    hookType: 'contrast',
    hook: {id: 'hook', kind: 'hook', headline: '只差两个字母\n**include** ≠ **exclude**', voice: 'include 和 exclude 只差两个字母，意思正好相反。', art: clud('exclude-result')},
    body: [
      {id: 'fix-in', kind: 'fix', headline: '**in-** = 收进里面', voice: 'in 是收进里面：餐盘放进盒子，早餐算在价格里。', arts: poses('include'), example: 'Breakfast is included.  含早餐'},
      {id: 'fix-ex', kind: 'fix', headline: '**ex-** = 留在外面', voice: 'ex 是留在外面：盒子盖上，餐盘还在外面，早餐不算。', arts: poses('exclude'), example: 'Breakfast is excluded.  不含早餐'},
      {id: 'test', kind: 'test', headline: 'The fee ___ meals.\n（费用不含餐）', options: ['includes', 'excludes'], correct: 1, pause: 2, voice: '考考你：费用不含餐，选哪个？'},
      {id: 'answer', kind: 'answer', headline: '答案：**excludes**', voice: `答案是 excludes，ex 留在外面。${SAVE}`, art: clud('exclude-result'), example: 'The fee excludes meals.', exampleAt: 0.05},
    ],
    publish: {
      title: 'include和exclude只差两个字母，意思正相反',
      xhsTitle: 'include和exclude怎么分',
      body: 'in- 收进里面，ex- 留在外面。看小黑一个盒子记住 include / exclude，最后有一道小题，评论区交答案。',
      tags: ['#四级词汇', '#六级词汇', '#英语单词', '#词根词缀', '#四六级备考', '#小黑英语'],
      pinnedComment: '答案：The fee excludes meals.（费用不含餐）你选对了吗？评论区说说你还容易把哪两个词搞反～',
    },
  },
];

/** 下一条新视频该用的钩子类型（按发布顺序轮换）。 */
export const nextHookType = (): HookType => HOOK_ROTATION[shortLibrary.length % HOOK_ROTATION.length];

export const findShort = (id: string) => {
  const short = shortLibrary.find((item) => item.id === id);
  if (!short) throw new Error(`Unknown short "${id}". Available: ${shortLibrary.map((item) => item.id).join(', ')}`);
  return short;
};
