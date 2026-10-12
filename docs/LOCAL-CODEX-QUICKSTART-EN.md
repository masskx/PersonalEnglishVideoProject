# Local Codex Quickstart (English)

For the channel owner, working on a Windows PC with Codex. Codex reads `AGENTS.md` automatically, so
the production rules, the topic-selection rules, the Xiaohei style and the key rules apply in every
Codex session without you repeating them.

## 1. One-time setup

```powershell
git clone https://github.com/masskx/PersonalEnglishVideoProject.git
cd PersonalEnglishVideoProject
git lfs install
git lfs pull          # downloads videos, images and audio (about 7 GB)
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

## 2. What to type into Codex

The rules are written in Chinese, so short Chinese prompts work best. Meanings in brackets.

| You type | What happens |
| --- | --- |
| `做一个词根视频` (make a root-word video) | Codex picks an unused root, then writes the script, generates voice and new Xiaohei art, and renders everything |
| `做一期 spect 词根` (make a "spect" episode) | Same, for the root you name (old versions are kept) |
| `做一个易混词视频` (make a confusing-words video) | Picks an unused word pair |
| `给 ten-tain 生成小红书图文` (Xiaohongshu cards for ten-tain) | Runs `npm run xhs:cards -- --project=ten-tain` |
| `把 pon-pos 做成竖屏` (vertical version of pon-pos) | Runs `npm run vertical:render -- --project=pon-pos` |

To make a finished episode in one go, Codex can run
`npm run replica:produce -- --project=<slug> --stage=deliver`. The deliver stage renders the landscape
master, the Douyin vertical version, the teaser, the review card and the Xiaohongshu cards, then
writes the post text.

## 3. What you get for each episode

```text
outputs/<episode>/
  <episode>.mp4                 landscape master (Bilibili, Xigua)
  cover.png, cover-landscape.png
  publish-copy.md               Douyin / shared post text
  vertical/<episode>-vertical.mp4   Douyin full version (9:16)
  vertical/<episode>-teaser.mp4     ~40 s teaser
  vertical/review-card.png
  xiaohongshu/01-cover.png …        Xiaohongshu carousel (3:4, 1080×1440)
  xiaohongshu/xhs-note.md           Xiaohongshu title options, body, tags
```

Open `00-打开工作台.html` (the workbench) in the repository root to browse everything.

## 4. Xiaohongshu: what the cards are built for

Xiaohongshu users browse a two-column feed of covers and save useful notes. They are less likely to
watch a long lecture video. So for Xiaohongshu the project now makes an **image carousel**:

1. **Cover:** the root in huge type, the meaning with a highlighter mark, Xiaohei, all the words, and a
   "建议收藏" (worth saving) ribbon.
2. **One card per word:** the word with its root highlighted, the word-part formula, a big meaning,
   Xiaohei's action and an example sentence.
3. **One-page summary:** the card people save.
4. **Self-test:** prompts comments ("先别往回翻").
5. **Follow card:** follow prompt plus a comment prompt.

Post the images in file-name order and use one of the titles in `xhs-note.md`; Xiaohongshu allows
20 characters, and the note flags any title that is too long. To change the wording, colours of the
CTA or tags for every future note, edit the `xiaohongshu` section of `planning/growth-promotion.json`.

## 5. Before you post

- Watch or flip through everything on your phone; listen to videos on the speaker and on headphones.
- Nothing is published automatically. `release.json` stays `draft` until you post and update it.
- Don't put WeChat IDs, QR codes or outside links in images, captions or comments.

## 6. Keys and safety (summary)

The full rules are in `README.md` → "API keys". Short version: keys live only in `.env`. The
pre-commit hook and `npm run project:test` scan for keys. If a key ever leaks, revoke it at the
provider right away.
