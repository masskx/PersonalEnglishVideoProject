import {existsSync, readFileSync} from 'node:fs';
import path from 'node:path';
import {shortLibrary} from '../../src/shorts/library';

/**
 * 数据报告：npm run metrics:report [-- --date=YYYY-MM-DD]
 * 读 planning/douyin-metrics.json（每条视频每个平台每天一条累计快照），取最新（或指定日期前最新）的一条，
 * 算出每百次播放的互动、关注转化，并按钩子类型（挑战 / 错误 / 反差 / 结果先行）汇总比较。
 */
type Snapshot = {
  date: string;
  id: string; // 视频 ID（outputs/shorts/<id>/）
  platform?: 'douyin' | 'xiaohongshu'; // 默认 douyin
  views: number;
  completionRate?: number; // 完播率 %
  avgWatchSeconds?: number; // 平均播放时长 秒
  bounce2s?: number; // 2秒跳出率 %
  finish5s?: number; // 5秒完播率 %
  likes?: number;
  comments?: number;
  saves?: number;
  shares?: number;
  follows?: number; // 涨粉
  note?: string;
};

const file = path.resolve('planning/douyin-metrics.json');
const data = JSON.parse(readFileSync(file, 'utf8')) as {snapshots: Snapshot[]};
const until = process.argv.slice(2).find((arg) => arg.startsWith('--date='))?.slice('--date='.length);

const keyOf = (snap: Snapshot) => `${snap.id}@${snap.platform ?? 'douyin'}`;
const latest = new Map<string, Snapshot>();
for (const snap of data.snapshots) {
  if (until && snap.date > until) continue;
  const prev = latest.get(keyOf(snap));
  if (!prev || snap.date >= prev.date) latest.set(keyOf(snap), snap);
}
if (latest.size === 0) {
  console.log('No snapshots yet. Add rows to planning/douyin-metrics.json (see docs/DOUYIN-DATA-EN.md).');
  process.exit(0);
}

const durationOf = (id: string) => {
  for (const dir of [id, `${id}发了`]) {
    const report = path.resolve('outputs', 'shorts', dir, 'review', 'report.json');
    if (existsSync(report)) return (JSON.parse(readFileSync(report, 'utf8')) as {seconds: number}).seconds;
  }
  return undefined;
};
const per = (count: number | undefined, views: number, base = 100) => (count === undefined || !views ? undefined : (count / views) * base);
const fmt = (value: number | undefined, digits = 1, suffix = '') => (value === undefined || Number.isNaN(value) ? '—' : `${value.toFixed(digits)}${suffix}`);

const rows = [...latest.values()].sort((a, b) => keyOf(a).localeCompare(keyOf(b))).map((snap) => {
  const duration = durationOf(snap.id);
  return {
    snap,
    duration,
    watchShare: duration && snap.avgWatchSeconds !== undefined ? (snap.avgWatchSeconds / duration) * 100 : undefined,
    likes: per(snap.likes, snap.views),
    saves: per(snap.saves, snap.views),
    comments: per(snap.comments, snap.views),
    shares: per(snap.shares, snap.views),
    follows: per(snap.follows, snap.views, 1000),
  };
});

const header = ['video', 'platform', 'date', 'views', 'finish%', 'avgWatch', 'watched%', '2s exit%', '5s finish%', 'like/100', 'save/100', 'cmt/100', 'share/100', 'follow/1k'];
const table = rows.map((row) => [
  row.snap.id, row.snap.platform === 'xiaohongshu' ? 'xhs' : 'douyin', row.snap.date, String(row.snap.views), fmt(row.snap.completionRate), fmt(row.snap.avgWatchSeconds, 1, 's'), fmt(row.watchShare),
  fmt(row.snap.bounce2s), fmt(row.snap.finish5s), fmt(row.likes, 2), fmt(row.saves, 2), fmt(row.comments, 2), fmt(row.shares, 2), fmt(row.follows, 2),
]);
const widths = header.map((title, index) => Math.max(title.length, ...table.map((line) => line[index].length)));
const line = (cells: string[]) => cells.map((cell, index) => (index === 0 ? cell.padEnd(widths[index]) : cell.padStart(widths[index]))).join('  ');
console.log(line(header));
console.log(widths.map((width) => '-'.repeat(width)).join('  '));
for (const cells of table) console.log(line(cells));

// 钩子类型：同类型视频按播放量加权平均，看哪种开头留人、涨粉更好。
const byHook = new Map<string, {views: number; finish: number; bounce: number; saves: number; follows: number; count: number}>();
for (const row of rows) {
  const short = shortLibrary.find((item) => item.id === row.snap.id);
  if (!short) continue;
  const key = `${short.hookType} @${row.snap.platform ?? 'douyin'}`;
  const agg = byHook.get(key) ?? {views: 0, finish: 0, bounce: 0, saves: 0, follows: 0, count: 0};
  agg.views += row.snap.views; agg.count += 1;
  agg.finish += (row.snap.completionRate ?? 0) * row.snap.views;
  agg.bounce += (row.snap.bounce2s ?? 0) * row.snap.views;
  agg.saves += row.snap.saves ?? 0; agg.follows += row.snap.follows ?? 0;
  byHook.set(key, agg);
}
if (byHook.size) {
  console.log('\nBy hook type (view-weighted):');
  for (const [key, agg] of [...byHook].sort()) {
    console.log(`  ${key.padEnd(24)} videos ${agg.count} · views ${agg.views} · finish ${fmt(agg.finish / agg.views)}% · 2s exit ${fmt(agg.bounce / agg.views)}% · save/100 ${fmt(per(agg.saves, agg.views), 2)} · follow/1k ${fmt(per(agg.follows, agg.views, 1000), 2)}`);
  }
}

// 工作目标：20–30 秒知识短视频的经验区间，用来判断下一轮先改哪里，不是平台官方标准。
console.log('\nWorking targets for 20–30 s shorts: 2s exit < 30% · 5s finish > 60% · finish > 30% · save/100 > 1.5 · follow/1k > 5');
