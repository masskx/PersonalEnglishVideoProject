# Douyin shorts: posting and daily data (English guide)

This is the 5-day test loop: you post the 30–40 s shorts, send me the numbers each day, and I adjust
hooks, scripts and the template from the data.

## 1. What to post

Each short exists in two hook versions, **A** and **B** (same body, different first 2–5 seconds):

| Video ID | File |
| --- | --- |
| `include-exclude-A` / `-B` | `outputs/clud-clus/douyin-shorts/` |
| `exclude-preclude-A` / `-B` | `outputs/clud-clus/douyin-shorts/` |
| `concession-sentence-A` / `-B` | `outputs/cet6-writing-concession/douyin-shorts/` |

Next to every `.mp4` there is a `.md` with the **title, body text, hashtags and pinned comment**, plus
a `-cover.png` (the first frame) to use as the cover.

Suggested schedule (one to two posts a day, same time each day, e.g. 12:00 or 20:00):

| Day | Post |
| --- | --- |
| 1 | `include-exclude-A` |
| 2 | `exclude-preclude-A`, then `include-exclude-B` in the evening |
| 3 | `concession-sentence-A` |
| 4 | `exclude-preclude-B` |
| 5 | `concession-sentence-B` |

When posting:

- Use the title from the `.md` file and the first frame as the cover.
- Post the **pinned comment** yourself right after publishing and pin it. It reveals the test answer
  and invites replies.
- Turn on the AI-generated content label (the voice and illustrations are AI-generated).
- Put the shorts in a collection (合集) named as in `planning/growth-promotion.json` → `douyinShorts.collections`.
- Account bio suggestion: `四六级备考 · 每天30秒一个写作/词汇小技巧`.
- No WeChat IDs, QR codes, external links, or promises about scores.

## 2. What numbers to send me (daily)

Open **抖音创作者中心 → 作品数据** (Creator Center → Work data), tap each video, and copy these
fields. A screenshot of the data page works too.

| Chinese label | Field name in our ledger | Example |
| --- | --- | --- |
| 播放量 | `views` | 1532 |
| 完播率 | `completionRate` (%) | 28.4 |
| 平均播放时长 | `avgWatchSeconds` (s) | 14.2 |
| 2s跳出率 | `bounce2s` (%) | 41.0 |
| 5s完播率 | `finish5s` (%) | 52.3 |
| 点赞 | `likes` | 37 |
| 评论 | `comments` | 5 |
| 收藏 | `saves` | 21 |
| 分享 | `shares` | 3 |
| 涨粉 / 新增粉丝 | `follows` | 4 |

Easiest format to paste in chat:

```
2026-10-16 include-exclude-A: 播放 1532, 完播 28.4%, 均播 14.2s, 2s跳出 41%, 5s完播 52.3%, 赞 37, 评 5, 藏 21, 转 3, 粉 4
```

Also tell me anything unusual: the video was throttled or flagged, it got pushed to a new audience,
or comments asked for a specific topic.

I record each day in `planning/douyin-metrics.json` and run `npm run metrics:report`. The report shows
per-100-view rates and compares the A and B hooks.

## 3. How I read the numbers

| Number | What it tells us | Working target |
| --- | --- | --- |
| 2s exit rate | Is the first frame and first sentence strong enough? | under 30% |
| 5s finish rate | Does the hook pay off quickly? | over 60% |
| Completion rate | Does the body hold until the answer? | over 30% |
| Saves per 100 views | Is it useful enough to keep? | over 1.5 |
| Follows per 1,000 views | Does it make people want more? | over 5 |

These are working targets for 30–45 s study shorts, not official Douyin numbers. Each round I keep
the stronger hook style and rewrite the weakest part (hook, middle, or ending).

## 4. Optional: your own voice

A real voice usually beats TTS on Douyin. To replace any line, record it and save it as:

```
public/assets/audio/shorts/<video>/recorded/<beat-id>.mp3
```

Beat IDs are `hook-a`, `hook-b`, `fix-…`, `test`, `answer`, `cta` (see `src/shorts/library.ts`).
Then run `npm run shorts:voice -- --short=<video>` and `npm run shorts:render -- --short=<video>`.

## 5. Commands

```bash
npm run shorts:voice -- --all            # plan (free); add --generate to make the AI voice
npm run shorts:render -- --all           # render every short (or --short=<id> --variant=A)
npm run metrics:report                   # data report from planning/douyin-metrics.json
```
