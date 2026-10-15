# Posting and daily data: Douyin and Xiaohongshu (English guide)

Every video is a 20–30 s vertical short. **Post the same video on Douyin and Xiaohongshu.** I keep
making them; you post them and send me the numbers, and I adjust the next ones from the data.

## 1. What is in each folder

One video per folder: `outputs/shorts/<video>/`

| File | Use |
| --- | --- |
| `<video>.mp4` | The video (1080×1920), the same file for both platforms |
| `cover-douyin-vertical.png` | Douyin vertical cover (9:16). Everything important sits in the middle 3:4, so the desktop uploader's crop keeps it whole |
| `cover-douyin-landscape.png` | Douyin horizontal cover (4:3) |
| `cover-xiaohongshu.png` | Xiaohongshu cover (3:4) |
| `publish.md` | Douyin title, Xiaohongshu title (20 characters or fewer), body text, hashtags, pinned comment |
| `release.json`, `review/` | Status (stays draft) and my review files; nothing to post |

Posting order is the order in `src/shorts/library.ts`. The opening style ("hook") rotates from one
video to the next, with no A/B tests:

1. challenge question
2. common mistake
3. contrast
4. result first
5. back to 1

After a few rounds, the data shows which openings work best for your audience.

## 2. How to post

- One video a day at a fixed time (for example 12:00 or 20:00), on both platforms.
- Douyin: upload the video. Set the vertical cover to `cover-douyin-vertical.png` and the horizontal
  cover to `cover-douyin-landscape.png`. Use the Douyin title, body and tags from `publish.md`. Right
  after publishing, post the pinned comment yourself and pin it (it reveals the quiz answer).
- Xiaohongshu: upload the same video, set the cover to `cover-xiaohongshu.png`, use the Xiaohongshu
  title, and post the same comment as the first comment.
- On both platforms, turn on the AI-generated content label (the voice and drawings are AI-made).
- Collections, account bio and calls to action: `planning/growth-promotion.json` → `douyinShorts`.
- Never post WeChat IDs, QR codes, external links, or promises about scores.

## 3. What numbers to send me (daily)

**Douyin** (抖音创作者中心 → 作品数据), per video:

| Chinese label | Field | Example |
| --- | --- | --- |
| 播放量 | `views` | 1532 |
| 完播率 | `completionRate` (%) | 28.4 |
| 平均播放时长 | `avgWatchSeconds` (s) | 14.2 |
| 2s跳出率 | `bounce2s` (%) | 41.0 |
| 5s完播率 | `finish5s` (%) | 52.3 |
| 点赞 / 评论 / 收藏 / 分享 | `likes` / `comments` / `saves` / `shares` | 37 / 5 / 21 / 3 |
| 涨粉 / 新增粉丝 | `follows` | 4 |

**Xiaohongshu** (创作中心 → 笔记数据), per video: 观看 (views), 完播率 if shown, 平均观看时长,
点赞, 收藏, 评论, 分享, 涨粉.

Screenshots are fine. Or one line per video and platform:

```
2026-10-16 include-exclude 抖音: 播放 1532, 完播 28.4%, 均播 14.2s, 2s跳出 41%, 5s完播 52.3%, 赞 37, 评 5, 藏 21, 转 3, 粉 4
2026-10-16 include-exclude 小红书: 观看 860, 均播 12s, 赞 25, 藏 30, 评 3, 粉 6
```

**Most useful extra:** a screenshot of the retention curve (作品分析 → 观看分析 / 观众留存, the line
showing how many viewers remain at each second). It shows exactly where people swipe away, so I can
fix that second instead of guessing. Please also include 平均播放时长 and 5s完播率. They were missing
from the first screenshot.

Also tell me anything unusual: a video was throttled or flagged, it suddenly got pushed, or comments
asked for a topic.

I record everything in `planning/douyin-metrics.json` and run `npm run metrics:report`. The report
shows per-100-view rates per video and platform, and averages by hook type.

## 4. How I read the numbers

| Number | What it tells us | Working target |
| --- | --- | --- |
| 2s exit rate | Is the first frame and first sentence strong enough? | under 30% |
| 5s finish rate | Does the hook pay off quickly? | over 60% |
| Completion rate | Does the body hold until the answer? | over 30% |
| Saves per 100 views | Is it useful enough to keep? | over 1.5 |
| Follows per 1,000 views | Does it make people want more? | over 5 |

These are working targets for 20–30 s study videos, not official platform numbers.

## 5. Optional: your own voice

A real voice usually beats AI voice. To replace any line, record it and save it as:

```
public/assets/audio/shorts/<video>/recorded/<line-id>.mp3
```

Line IDs are `hook`, `fix-…`, `test`, `answer` (see `src/shorts/library.ts`). Then run
`npm run shorts:voice -- --short=<video>` and `npm run shorts:render -- --short=<video>`.
