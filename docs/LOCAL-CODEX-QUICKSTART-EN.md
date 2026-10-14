# Local Codex Quickstart (English)

For the channel owner, working on a Windows PC with Codex. Codex reads `AGENTS.md` automatically, so
the production rules, the topic-selection rules, the Xiaohei style and the key rules apply in every
Codex session without you repeating them.

## 1. One-time setup

```powershell
git clone https://github.com/masskx/PersonalEnglishVideoProject.git
cd PersonalEnglishVideoProject
git lfs install
git lfs pull          # downloads videos, images and audio (about 4 GB; was 7.4 GB before the cleanup)
npm ci
copy .env.example .env
notepad .env          # paste your NEW keys here (rotate the ones shared in chat)
npm run hooks:install # blocks any commit that contains a key
npm run keys:check    # shows which keys are set and which services are reachable
npm run project:test  # all checks should pass
```

`.env` is gitignored. Never paste keys into Codex chat; Codex reads them from `.env`.

If Codex reports that it cannot reach DashScope or the image relay, allow network access for that
Codex session in Codex's sandbox / approval settings. Codex blocks network by default.

## 1b. Every time you start work

```powershell
git pull
git lfs pull
npm run keys:check
```

Then just type your request to Codex (section 2). Codex reads `AGENTS.md` → `docs/当前制作基准.md` →
`docs/新会话制作入口.md` on its own; these three files hold the rules, the quality bar and the exact command
order.

## 1c. How the repository is organised (after the 2026-10-13 cleanup)

| Folder | What it is |
| --- | --- |
| `outputs/<episode>/` | Finished deliveries. A `发了` suffix means "already posted" |
| `src/replica/` | Root-word episodes (registry, storyboards, vertical and Xiaohongshu layouts) |
| `src/cet-writing/`, `src/cet-translation/`, `src/cet6-reading/` | CET-4/6 method lessons |
| `scripts/` | Voice, image, render, cover, post-text and check commands |
| `public/assets/` | Art, audio and music the renderer uses, one folder per episode |
| `assets/`, `references/` | Source art, the accepted Xiaohei style anchors |
| `planning/` | Defaults, topic ledger, growth/CTA settings |
| `docs/` | Rules (Chinese) and these English guides |
| `work/` | Local scratch only: render staging, drafts, rejected images. Not in git; safe to empty |

Old archives, audit reports, early trials and retired methods (Jimeng/Seedream images, Wan image-to-video
"dynamic Xiaohei", the meme-vocab prototype) were deleted so Codex cannot pick them up by mistake. Git
history still has them if you ever need to look back.

## 2. What to type into Codex

Full prompt cookbook, resuming work and tips: [CODEX-PROMPT-GUIDE-EN.md](CODEX-PROMPT-GUIDE-EN.md).

The rules are written in Chinese, so short Chinese prompts work best. Meanings in brackets.

| You type | What happens |
| --- | --- |
| `做一条视频` (make a video) | Codex picks an unused topic and makes a 30–40 s vertical short with the next hook type in the rotation |
| `做一条考研词汇视频` / `做一条六级作文视频` / `做一条词根视频` | Same, in the direction you name (graduate-entrance-exam vocabulary, CET-6 writing, root words…) |
| `做一条 affect / effect 的视频` (a video on affect / effect) | Same, for the exact topic you name |
| `把 include-exclude 的封面改大字` (change a cover) | Edits the script or cover and runs `npm run shorts:render -- --short=include-exclude --covers-only` |
| `做一期 spect 长讲解` (a long lesson on "spect") | Only when you ask: the 2–3 minute long-lesson pipeline |

## 3. What you get for each video

One video per folder, posted to **both Douyin and Xiaohongshu**:

```text
outputs/shorts/<video>/
  <video>.mp4                    the video (1080×1920, 30–40 s)
  cover-douyin-vertical.png      Douyin vertical cover (9:16; content inside the middle 3:4)
  cover-douyin-landscape.png     Douyin horizontal cover (4:3)
  cover-xiaohongshu.png          Xiaohongshu cover (3:4)
  publish.md                     Douyin and Xiaohongshu titles, body, tags, pinned comment
  release.json, review/          status (draft) and review files
```

Xiaohongshu image cards are no longer made (since 2026-10-14). Posting steps and the daily numbers to
send: [DOUYIN-DATA-EN.md](DOUYIN-DATA-EN.md).

## 4. Hooks rotate

Each new video uses the next opening style in a fixed rotation, with no A/B tests:

1. challenge question
2. common mistake
3. contrast
4. result first

After a few rounds, the daily numbers show which style works best.

## 5. Before you post

- Watch or flip through everything on your phone; listen to videos on the speaker and on headphones.
- Nothing is published automatically. `release.json` stays `draft` until you post and update it.
- Don't put WeChat IDs, QR codes or outside links in images, captions or comments.

## 6. Keys and safety (summary)

The full rules are in `README.md` → "API keys". Short version: keys live only in `.env`. The
pre-commit hook and `npm run project:test` scan for keys. If a key ever leaks, revoke it at the
provider right away.
