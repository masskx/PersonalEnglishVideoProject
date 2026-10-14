# Making Episodes with Codex: Workflow and Prompt Guide (English)

This guide is for the channel owner. It explains how to keep producing episodes in the same Xiaohei
style with local Codex, how to resume unfinished work, and how to write prompts that get good results.
Set up the repository first with [LOCAL-CODEX-QUICKSTART-EN.md](LOCAL-CODEX-QUICKSTART-EN.md).

## 1. How Codex knows "the style"

You don't need to describe the style in every prompt. Codex reads these files from the repository:

| File | What it fixes |
| --- | --- |
| `AGENTS.md` | All standing rules: topic selection, production chain, Xiaohei quality bar, the 30–40 s short format (one video for Douyin and Xiaohongshu, three covers, rotating hooks), key safety |
| `docs/当前制作基准.md` | The visual baseline: the Xiaohongshu-card paper palette (warm dotted paper, soft-blue art panel, yellow highlighter), solid-black Xiaohei with white-dot eyes, before/change/result poses, smooth text motion, music level |
| `.agents/skills/make-xiaohei-english-video/` and `build-root-word-video/` | Step-by-step production recipes |
| `planning/production-defaults.json` | Machine-readable defaults (sizes, gates, deliverables) |
| `planning/growth-promotion.json` | Calls to action, account bio, collections, cover ribbon, products |
| `planning/topic-history.json` | Every topic already made, so Codex doesn't repeat one |

**The rule of thumb:** if you want a change to stick for every future episode, ask Codex to write it into
`AGENTS.md` (and the config file if relevant). If you only say it in chat, the next session forgets it.

## 2. Start every session the same way

Paste this first. It makes Codex load the rules and check your keys before doing anything:

```text
先读 AGENTS.md、docs/当前制作基准.md 和 docs/新会话制作入口.md，运行 npm run keys:check，
然后用三五句话告诉我：现在能调用哪些服务、最近一期做到哪一步。先不要开始制作。
```
*(Read the rules, check the keys, tell me which services work and where the latest episode stands. Don't start producing yet.)*

## 3. Prompts by goal

Codex works best with short Chinese prompts, because the rules and on-screen text are Chinese. Each
block below can be pasted as is; replace the parts in `<>`.

The default product is a **30–40 s vertical short** that you post to both Douyin and Xiaohongshu.
Content can be anything in English learning: CET-4/6, graduate-entrance-exam English (考研), root words,
confusable words, grammar, everyday usage.

### A. New short, Codex picks the topic

```text
做一条视频。按 AGENTS.md 第 7 节：查重选题，钩子类型用 nextHookType()，脚本追加到 src/shorts/library.ts，
配音、渲染，最后告诉我 outputs/shorts/ 下的文件夹名，并把三张封面给我看。
```
*(Make a short: pick an unused topic, use the next hook type, voice, render, show me the folder and the three covers.)*

### B. A direction or exact topic you choose

```text
做一条考研词汇视频：<abandon / desert 的区别>。
```
```text
做一条四级作文视频：<开头怎么写观点句>。用原创例句，不要冒充真题。
```

### C. Several at once (a week of posts)

```text
连续做 5 条视频：四六级词汇、六级作文、考研词汇、词根各至少一条，钩子按轮换。每条做完都跑 project:test。
```

### D. A long lesson (only when you want one)

```text
做一期 <spect> 词根长讲解，2–3 分钟，按 AGENTS.md 第 3 节长讲解链路，最后跑 deliver。
```

### E. Fix one thing without redoing everything

```text
只改 <include-exclude>：封面标题再大一号，重新出三张封面（shorts:render --covers-only），视频不用重渲染。
```
```text
<include-exclude> 的第二拍旁白改得更口语一点，只重配这一拍，然后重新渲染这一条。
```

### F. Resume unfinished work

```text
继续上次没做完的视频。看 src/shorts/library.ts 末尾和 git status，从中断的那一步继续；已通过检查的配音和图片不要重做。
```

### G. Change the style for all future videos

```text
以后封面角标改成“考前必看”。写进 planning/growth-promotion.json 和 AGENTS.md，然后重新出 <include-exclude> 的封面给我看。
```

### H. Check before posting (no new production)

```text
检查 outputs/shorts/ 下每个文件夹是否齐全：一个视频、三张封面、publish.md。只检查，不要开始制作。
```

### I. Log the daily numbers

```text
记录今天的数据（截图/文字在下面），写进 planning/douyin-metrics.json，跑 npm run metrics:report，告诉我哪种钩子更好、下一条该怎么改。
```

### J. Save the work to GitHub

```text
把这期的改动提交到一个新分支并推送，提交前确认 npm run project:test 和 secrets:scan 都通过，然后开一个 PR。
```

## 4. Writing good prompts

1. **Say the column, and either the topic or "自选" (you choose).** For example `做一个词根视频`, `做一期 spect 词根`, `做一期六级阅读`.
2. **Say the scope.** A new short, several shorts, a long lesson, only covers, or only a fix?
3. **Name what must not change.** For example `只改这一期`, `已通过的素材不要重做`, `不要改讲稿`.
4. **Ask to see before the expensive step.** For example `生图前先给我看讲稿和词图映射表`
   (show me the script and word-to-picture plan before generating images). Voice and images cost money.
5. **One goal per prompt.** Finish and check one thing, then ask for the next.
6. **Refer to videos by their folder name** (`include-exclude`, `concession-sentence`).
7. **Make good feedback permanent:** `把这条写进 AGENTS.md`.

## 5. A typical production day

1. Start the session (section 2).
2. Ask for a new short (A–C). Approve the script before images if you asked for that.
3. Open `outputs/shorts/<video>/`: one video, three covers, `publish.md`.
4. Watch it **on your phone** with the speaker and with headphones, and check the covers.
5. Ask for any fixes (E).
6. Post the same video on Douyin (vertical + horizontal cover) and Xiaohongshu (3:4 cover), using the
   titles in `publish.md`. Codex never posts for you.
7. The next day, send the numbers (I) so the following videos improve.

## 6. Saving money and time

- `npm run shorts:voice -- --short=<video>` without `--generate` only lists the missing voice lines. No paid calls.
- Voice and image generation happen only for the video you are making, with limited retries.
- `npm run shorts:render -- --short=<video> --covers-only` re-makes just the three covers in seconds.
- `npm run vertical:stills -- --project=<slug>` checks the phone layout in about a minute, without rendering video.

## 7. When something goes wrong

| Problem | What to tell Codex / do |
| --- | --- |
| "Missing DASHSCOPE_API_KEY" | Check `.env` exists and has the key; run `npm run keys:check` |
| `Pacing:` error from `replica:validate` (the picture stays still too long) | Say `按节奏闸门的提示，在那段旁白里加画面层（例句、释义、搭配、对比），不要放宽阈值。` (Add on-screen beats where the gate points; don't loosen the limits.) |
| The new episode looks plainer than ten-tain | Check that Codex copied `src/replica/projects/cludClus.ts` (not an older episode) and that `replica:validate` passed |
| Codex can't reach the API | Allow network access in Codex's sandbox settings for that session |
| Images or audio are tiny text files | Run `git lfs pull` (they are LFS pointers until downloaded) |
| Render can't find Chrome | Install Google Chrome, or set `REMOTION_BROWSER_EXECUTABLE` to its path |
| ffmpeg / ffprobe not found | Run `npm ci` again (Remotion ships them), or set `FFMPEG_PATH` / `FFPROBE_PATH` |
| Codex wants to use an old method (Wan video, Seedream, SVG drawings) | Say `按 AGENTS.md 第 9 节，不要恢复已停用路线。` (Follow AGENTS.md section 9; don't revive retired methods.) |
| `work/` is getting big | Delete it. It is local scratch and not in git |
| A key ended up in a file | Stop. The pre-commit hook should block it; revoke the key at the provider |
