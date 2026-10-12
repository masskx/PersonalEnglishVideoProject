# Xiaohei English: Douyin Growth Playbook (English)

Written 2026-10-12 for the channel owner, who reads English. The rest of the repository stays in
Chinese because the production agents and on-screen text are Chinese. This file explains what was
changed to raise play counts, how to publish, and how product promotion is prepared. Nothing here
guarantees a result. These are the main levers that drive Douyin distribution, applied to this
project.

## 1. Why play counts were stuck: what the audit found

| Problem | Evidence in the repo | Why it hurts on Douyin |
| --- | --- | --- |
| **Landscape only** | Every episode renders at 1920×1080. | In the vertical feed a 16:9 video fills about a third of the screen. Viewers see a thin strip and swipe away. Low 3–5 s retention means the algorithm stops pushing the video. |
| **Text too small on phones** | Subtitles are 38px on a 1080px-tall frame. Shown inside a phone feed, that is about 7–8pt, unreadable without tapping full-screen. | People watch muted or half-attentive. If they can't read the word, they don't stay. |
| **Long single video** | 2–3.5 minutes per episode. | New accounts get small first-wave tests. Long videos have low completion rates, and completion is a key ranking signal. |
| **Weak first frame** | Frame 0 of the landscape cut is a small heading in a corner, and the art fades in later. | The first frame decides the swipe. It should show the topic and Xiaohei at full size immediately. |
| **No follow, save or product hooks** | The ending fades to black with no call to action. | Saves and follows are strong signals. A black ending also breaks Douyin's auto-loop replay. |
| **Soft frames** | `remotion.config.ts` used the default JPEG quality (80) for intermediate frames. | Adds ringing noise around thin ink lines and text, which Douyin's re-encode makes worse. |
| **Subtitle bug** | The caption splitter cut every 34 characters, sometimes mid-word ("thousands of v"). | Looks sloppy and confuses learners. |

## 2. What was built

### Vertical 9:16 version of every episode (no new art needed)

`src/replica/vertical/` re-flows any existing episode into a phone-first 1080×1920 layout. It reuses
the same narration, Xiaohei images, music and timing.

- **Layout**: text is restacked into one centered column and Xiaohei is enlarged below it. Captions
  are re-cut into short one-line phrases at 54px, with English words tinted blue.
- **Douyin's on-screen buttons**: everything stays inside Douyin's safe area. The top tabs, right-side
  like/comment buttons and the bottom caption overlay never cover content.
- **Branding and first frame**: a persistent series header ("小黑拆词根" + root = meaning) means
  someone who lands mid-video still knows the topic. Frame 0 already shows the hook text and Xiaohei.
- **Word counter**: "第 3 / 8 个" in the corner creates a reason to keep watching to the end.
- **End card**: "收藏这一页，考前翻出来复习" (save this page) plus "关注小黑拆词根" (follow). The
  white ending loops cleanly into the replay.
- **Teaser cut** (about 40 s): hook + root overview + first two words, then a tail card saying "还有 6
  个词在完整版 → 主页合集". Use it to reach new viewers.
- **Review card PNG**: a clean, cropped image of the summary page. You can use it as a Xiaohongshu
  image, a fan-group handout, or a lead magnet.
- **Encoding**: CRF 16, x264 `slow`, JPEG frames at quality 95.

### One config file for growth and promotion

`planning/growth-promotion.json` holds the series and collection name, all calls to action, hashtag
sets, the product list and the lead-magnet switch. To change the wording on every future video,
edit this file; no code changes are needed.

### Better publish copy

`npm run replica:copy -- --project=<slug>` now also writes:

- a Douyin vertical section (which file to upload, cover, collection);
- teaser title and body text;
- hashtags that mix reach tags (#英语学习 #四六级), one rotating exam tag (#英语四级 / #英语六级 /
  #大学英语 / #考研英语), topic tags and the root tag;
- review-card and lead-magnet instructions.

### Xiaohongshu image carousels (added later the same day)

The owner found the lecture-style videos unappealing for Xiaohongshu. Xiaohongshu users skim covers
and save practical notes, so each episode now also gets a 3:4 carousel. Run
`npm run xhs:cards -- --project=<slug>`; output goes to `outputs/<episode>/xiaohongshu/` (cover,
one card per word, summary, self-test, follow card, plus `xhs-note.md`). See
`docs/LOCAL-CODEX-QUICKSTART-EN.md`.

## 3. Commands

```powershell
# One episode: full vertical + teaser + review card (about 4–5 minutes)
npm run vertical:render -- --project=ten-tain

# Every registered root-word episode (run overnight)
npm run vertical:render:all

# Quick layout check without rendering video
npm run vertical:stills -- --project=pon-pos

# Regenerate publish copy after rendering (adds the vertical/teaser sections)
npm run replica:copy -- --project=ten-tain
```

Output goes to `outputs/<episode>/vertical/`: `<slug>-vertical.mp4`, `<slug>-teaser.mp4`,
`review-card.png`, `vertical-report.json` and `review/*-contact-sheet.jpg`.

The cloud session rendered **ten-tain, pon-pos, cred and duc-duct** (the four newest episodes made to
the current visual standard) and sent the files to you as chat attachments. Its network policy
blocks Git LFS uploads, so those binaries are **not** in the repository. To put them in
`outputs/<episode>/vertical/` on your PC, run the command above (about 4–5 minutes per episode), then
regenerate the publish copy.

## 4. How to publish

1. **Post the vertical full version on Douyin**, not the landscape one. Use `cover.png` (3:4) as the
   cover so the profile grid looks consistent.
2. **Add every episode to one collection (合集)**: 「小黑拆词根｜四六级词根动画」. Collections drive
   binge-watching and profile visits.
3. **Pin the suggested comment** right after posting and reply to the first few comments within the
   first hour. Early interaction matters most.
4. **Post the teaser** either a day before (as a trailer) or 2–3 days after the full version, to pull
   new viewers into the collection.
5. **Old episodes get a second life**: the 9 already-published landscape episodes can be re-posted as
   vertical versions. They are a different format, so they reach a different audience.
6. **Keep a steady cadence.** Three posts a week (for example full / teaser / full) is more useful than
   bursts.
7. **Rotate the three title options.** If a video stalls in the first 24 h, the next upload of a
   similar topic should try a different angle (question vs. contrast vs. exam use).

## 5. What to measure (7-day window)

Record per video: plays, 5-second retention, completion rate, saves, profile visits, new followers,
and the concrete difficulties people mention in comments. Read the numbers like this:

- **Low 5 s retention** → the hook or first frame is the problem. Try a different opening question.
- **Good retention but few saves** → strengthen the summary page and the "收藏" call to action.
- **Many saves but few follows** → make the series and the next topic more visible.

Compare formats on the same topics before drawing conclusions; one viral or flat video proves little.

## 6. Product promotion: prepared, not switched on

The repository's own plan (`docs/账号内容与资料产品规划.md`) names the first product: **小黑词根复习与自测**
(root-word review & self-test sheet). The groundwork is in place.

- `products` in `planning/growth-promotion.json` lists it as `planned`. When you set `status` to
  `live` and fill in `link`, every regenerated publish copy adds a soft mention for matching
  episodes.
- `cta.leadMagnet` is **off** by default. Turning it on adds "评论「词卡」领取" to the pinned comment.
  Each episode's `review-card.png` is the asset you send.
- Suggested sequence: build trust with free review cards → measure saves and DM requests → only then
  sell the full review & self-test pack.
- **Douyin rules**: never put WeChat IDs, QR codes or external links in videos, captions or comments.
  Off-platform redirection gets videos throttled. Deliver through DMs, fan groups, or Douyin's own
  shop window (橱窗) once you qualify.

## 7. Limits and what still needs a human

- **No new artwork.** This session could not run the built-in `image_gen` model the project uses for
  new art, so no new illustrations were generated. The vertical versions reuse each episode's
  approved images.
- **Older episodes.** press, reg, fer, bouba-kiki and others were made before the current visual
  standard. Their vertical versions are usable but plainer (smaller tables, dropped arrows). The four
  newest episodes look best.
- **Listening check.** Watch and listen to each vertical file on a phone (speaker and headphones)
  before posting, as the project rules require. The background music level was not changed.
- **Not published.** Nothing was published or uploaded anywhere. Publishing stays your decision.
