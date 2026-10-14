import {existsSync, readFileSync} from 'node:fs';
import path from 'node:path';
import {shortLibrary} from '../../src/shorts/library';

/**
 * 抖音数据报告：npm run metrics:report [-- --date=YYYY-MM-DD]
 * 读 planning/douyin-metrics.json（每条视频每天一条累计快照），取每条视频最新（或指定日期前最新）的一条，
 * 算出每百次播放的互动、关注转化，并按同一短视频的 A / B 钩子并排比较。
 */
type Snapshot = {
  date: string;
  id: string; // <短视频id>-<A|B>，长视频用期名
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

const latest = new Map<string, Snapshot>();
for (const snap of data.snapshots) {
  if (until && snap.date > until) continue;
  const prev = latest.get(snap.id);
  if (!prev || snap.date >= prev.date) latest.set(snap.id, snap);
}
if (latest.size === 0) {
  console.log('No snapshots yet. Add rows to planning/douyin-metrics.json (see docs/DOUYIN-DATA-EN.md).');
  process.exit(0);
}

const durationOf = (id: string) => {
  const match = /^(.*)-([AB])$/.exec(id);
  const short = match && shortLibrary.find((item) => item.id === match[1]);
  if (!short) return undefined;
  const report = path.resolve('outputs', short.episode, 'douyin-shorts', `${id}-report.json`);
  return existsSync(report) ? (JSON.parse(readFileSync(report, 'utf8')) as {seconds: number}).seconds : undefined;
};
const per = (count: number | undefined, views: number, base = 100) => (count === undefined || !views ? undefined : (count / views) * base);
const fmt = (value: number | undefined, digits = 1, suffix = '') => (value === undefined || Number.isNaN(value) ? '—' : `${value.toFixed(digits)}${suffix}`);

const rows = [...latest.values()].sort((a, b) => a.id.localeCompare(b.id)).map((snap) => {
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

const header = ['video', 'date', 'views', 'finish%', 'avgWatch', 'watched%', '2s exit%', '5s finish%', 'like/100', 'save/100', 'cmt/100', 'share/100', 'follow/1k'];
const table = rows.map((row) => [
  row.snap.id, row.snap.date, String(row.snap.views), fmt(row.snap.completionRate), fmt(row.snap.avgWatchSeconds, 1, 's'), fmt(row.watchShare),
  fmt(row.snap.bounce2s), fmt(row.snap.finish5s), fmt(row.likes, 2), fmt(row.saves, 2), fmt(row.comments, 2), fmt(row.shares, 2), fmt(row.follows, 2),
]);
const widths = header.map((title, index) => Math.max(title.length, ...table.map((line) => line[index].length)));
const line = (cells: string[]) => cells.map((cell, index) => (index === 0 ? cell.padEnd(widths[index]) : cell.padStart(widths[index]))).join('  ');
console.log(line(header));
console.log(widths.map((width) => '-'.repeat(width)).join('  '));
for (const cells of table) console.log(line(cells));

// A/B：同一短视频两个钩子并排，只在两边都有数据时比较。
const pairs = shortLibrary.map((short) => [short.id, latest.get(`${short.id}-A`), latest.get(`${short.id}-B`)] as const).filter(([, a, b]) => a && b);
if (pairs.length) {
  console.log('\nA/B hooks (higher wins; 2s exit lower wins):');
  for (const [id, a, b] of pairs) {
    const pick = (x?: number, y?: number, lowerWins = false) => (x === undefined || y === undefined ? '—' : x === y ? '=' : (lowerWins ? x < y : x > y) ? 'A' : 'B');
    console.log(`  ${id}: finish ${pick(a!.completionRate, b!.completionRate)} · 2s exit ${pick(a!.bounce2s, b!.bounce2s, true)} · 5s finish ${pick(a!.finish5s, b!.finish5s)} · saves/100 ${pick(per(a!.saves, a!.views), per(b!.saves, b!.views))} · follows/1k ${pick(per(a!.follows, a!.views, 1000), per(b!.follows, b!.views, 1000))}`);
  }
}

// 工作目标：30–45 秒知识短视频的经验区间，用来判断下一轮先改哪里，不是平台官方标准。
console.log('\nWorking targets for 30–45 s shorts: 2s exit < 30% · 5s finish > 60% · finish > 30% · save/100 > 1.5 · follow/1k > 5');
