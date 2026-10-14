import type {ReplicaStoryboard} from './types';

/**
 * 画面节奏闸门：只看画面层（文字层、图片层、表格层）的出现、退出和姿态切换，不看字幕。
 * 字幕换句不算画面变化——观众看到的是同一张静止画面配着下面一行小字。
 *
 * 标定：已验收基准 ten-tain 最长静止 7.7 秒、超过 3.5 秒的静止段占全片 17%；
 * 2026-10-13 的 clud-clus 首版分别为 12.5 秒和 39%，观感明显发闷。
 */
export const PACING_LIMITS = {
  /** 单段画面静止超过这个秒数就计入“静止时间”。 */
  stillAfterSec: 3.5,
  /** 任意一段画面静止的上限（结尾总结页的最后停留除外，便于循环）。 */
  maxStillSec: 8,
  /** 超过 stillAfterSec 的静止时间占全片的上限。 */
  maxStillShare: 0.2,
  /** 开头钩子：第一次画面变化必须早于这个秒数。 */
  firstChangeBySec: 1.5,
  /** 开头钩子：第二次画面变化必须早于这个秒数。 */
  secondChangeBySec: 3,
} as const;

export type PacingReport = {
  maxStillSec: number;
  maxStillAt: string;
  stillShare: number;
  firstChangeSec: number | null;
  secondChangeSec: number | null;
  errors: string[];
};

const EPS = 0.05;

/** Visual change times (seconds, scene-local) for one scene: layer entries, exits and pose swaps. */
const sceneBeats = (scene: ReplicaStoryboard['scenes'][number]) => {
  const beats = new Set<number>([0]);
  for (const layer of scene.layers) {
    const from = layer.from;
    beats.add(from);
    const duration = layer.duration;
    // A layer that leaves well before the scene ends is a visible change too.
    if (duration !== undefined && from + duration < scene.duration - 0.3) beats.add(from + duration);
  }
  return [...beats].filter((time) => time >= 0 && time <= scene.duration + EPS).sort((a, b) => a - b);
};

export const measurePacing = (storyboard: ReplicaStoryboard): PacingReport => {
  const scenes = storyboard.scenes;
  let maxStillSec = 0;
  let maxStillAt = '';
  let stillOverLimit = 0;
  const globalBeats: number[] = [];
  for (const [index, scene] of scenes.entries()) {
    const beats = sceneBeats(scene);
    for (const beat of beats) globalBeats.push(scene.start + beat);
    const times = [...beats, scene.duration];
    const isLast = index === scenes.length - 1;
    for (let k = 1; k < times.length; k++) {
      // The closing summary may hold for a loop-friendly ending.
      if (isLast && k === times.length - 1) continue;
      const gap = times[k] - times[k - 1];
      if (gap > PACING_LIMITS.stillAfterSec) stillOverLimit += gap - PACING_LIMITS.stillAfterSec;
      if (gap > maxStillSec) {
        maxStillSec = gap;
        maxStillAt = `${scene.id} @${times[k - 1].toFixed(1)}s`;
      }
    }
  }
  const changes = [...new Set(globalBeats.map((time) => Math.round(time * 100) / 100))]
    .filter((time) => time > EPS)
    .sort((a, b) => a - b);
  const firstChangeSec = changes[0] ?? null;
  const secondChangeSec = changes[1] ?? null;
  const stillShare = stillOverLimit / Math.max(1, storyboard.duration);

  const errors: string[] = [];
  if (maxStillSec > PACING_LIMITS.maxStillSec + EPS) {
    errors.push(`画面静止 ${maxStillSec.toFixed(1)} 秒（${maxStillAt}），上限 ${PACING_LIMITS.maxStillSec} 秒：在这段旁白里加画面层（例句卡、搭配、对比、姿态切换）。`);
  }
  if (stillShare > PACING_LIMITS.maxStillShare + 0.001) {
    errors.push(`超过 ${PACING_LIMITS.stillAfterSec} 秒的静止画面占全片 ${(stillShare * 100).toFixed(0)}%，上限 ${PACING_LIMITS.maxStillShare * 100}%：缩短场景或增加画面节拍。`);
  }
  if (firstChangeSec === null || firstChangeSec > PACING_LIMITS.firstChangeBySec + EPS) {
    errors.push(`开头第一次画面变化在 ${firstChangeSec?.toFixed(2) ?? '无'} 秒，必须早于 ${PACING_LIMITS.firstChangeBySec} 秒。`);
  }
  if (secondChangeSec === null || secondChangeSec > PACING_LIMITS.secondChangeBySec + EPS) {
    errors.push(`开头第二次画面变化在 ${secondChangeSec?.toFixed(2) ?? '无'} 秒，必须早于 ${PACING_LIMITS.secondChangeBySec} 秒。`);
  }
  return {maxStillSec, maxStillAt, stillShare, firstChangeSec, secondChangeSec, errors};
};

/**
 * 2026-10-14 之前交付的期数按当时标准制作，只提示不拦截；
 * 之后新增或重做的期数必须通过节奏闸门，并使用 ten-tain 同款连续舞台。
 */
export const PACING_LEGACY_EPISODES: ReadonlySet<string> = new Set([
  'press', 'reg', 'fer', 'bouba-kiki', 'ject', 'port', 'spect', 'vis-vid', 'aud', 'dict',
  'script-scrib', 'tract', 'form', 'struct', 'flect-flex', 'rupt', 'mit-miss', 'duc-duct',
  'cred', 'pon-pos',
]);
