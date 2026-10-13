# Making Episodes with Codex: Workflow and Prompt Guide (English)

This guide is for the channel owner. It explains how to keep producing episodes in the same Xiaohei
style with local Codex, how to resume unfinished work, and how to write prompts that get good results.
Set up the repository first with [LOCAL-CODEX-QUICKSTART-EN.md](LOCAL-CODEX-QUICKSTART-EN.md).

## 1. How Codex knows "the style"

You don't need to describe the style in every prompt. Codex reads these files from the repository:

| File | What it fixes |
| --- | --- |
| `AGENTS.md` | All standing rules: topic selection, production chain, Xiaohei quality bar, Douyin vertical, Xiaohongshu cards, key safety |
| `docs/当前制作基准.md` | The visual baseline: white canvas, solid-black Xiaohei with white-dot eyes, before/change/result poses, smooth text motion, music level |
| `.agents/skills/make-xiaohei-english-video/` and `build-root-word-video/` | Step-by-step production recipes |
| `planning/production-defaults.json` | Machine-readable defaults (sizes, gates, deliverables) |
| `planning/growth-promotion.json` | Calls to action, hashtags, Xiaohongshu titles and tags, products |
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

### A. New root-word episode, Codex picks the topic

```text
做一个词根视频。按 AGENTS.md 的完整链路制作：查重选题、登记台账、讲稿、配音、小黑生图和白底复核、
渲染、整片预览。最后运行 npm run replica:produce -- --project=<新期名> --stage=deliver，
告诉我交付目录和需要我手机检查的地方。
```
*(Make a root-word video with the full chain; finish with the deliver stage and tell me where the files are.)*

### B. A root you choose

```text
做一期 <struct> 词根视频，6 到 8 个四六级高频词，每个词有自己的 before/change/result 小黑动作，
最后有一道小练习。完成后同样跑 deliver。
```

### C. Confusing words

```text
做一个易混词视频：<affect / effect>。先用一个具体场景让人选错，再讲区别和替换测试，最后一道自测题。
```

### D. CET-4 / CET-6 lesson (writing, reading, translation)

```text
做一期<四级翻译>视频，主题：<定语从句怎么翻>。用原创模拟题，不要冒充真题。
参照 src/cet-translation 的结构新建一期：lesson.ts、视频组件、src/<新目录>/xhs.ts 小红书 deck，
并把 deck 加到 src/replica/xhs/methodDecks.ts。至少生成 3 张不同的小黑插图。
完成后渲染视频、双封面、练习单，并运行 npm run xhs:cards -- --project=<新期名>。
```
*(Make a CET translation lesson on relative clauses with an original practice item; copy the existing CET lesson structure, including the Xiaohongshu deck; at least 3 different Xiaohei images.)*

The three existing CET lessons are good templates:
- `src/cet-writing`: weak sentence → claim → reason → example → practice
- `src/cet-translation`: find the main clause → add modifiers → natural collocations → reassemble
- `src/cet6-reading`: question type → keywords → locate evidence → paraphrase → eliminate distractors

### E. Only Xiaohongshu cards, or only the Douyin vertical version

```text
给 <cred> 生成小红书图文卡，检查 xhs-note.md 的标题都在 20 字以内，然后把联系图给我看。
```
```text
把 <pon-pos> 做成抖音竖屏完整版和预告，跑 npm run vertical:render -- --project=<pon-pos>，看联系图有没有文字溢出。
```

### F. Fix one thing without redoing everything

```text
只改 <ten-tain> 这一期：第 <5> 张小红书卡的例句字太小，调大并重新出这一期的卡片。不要改其他期。
```
```text
<pon-pos> 讲稿第 3 段改得更口语一点，只重新生成这一段的配音，然后重新渲染这一期。
```

### G. Resume unfinished work

```text
继续制作 <期名>。先看 planning/topic-history.json 和 docs/production-log.md 里它的状态，
从中断的那一步继续；已经通过检查的配音和图片不要重做。
```
*(Continue episode X from where it stopped; don't regenerate assets that already passed.)*

If you don't know the name, ask: `列出 topic-history.json 里状态是 in_progress 的期数。`

### H. Change the style for all future episodes

```text
以后小红书封面的标题再大一号，收藏条改成“考前必看”。把这条写进 AGENTS.md 的小红书段落和
planning/growth-promotion.json，然后用 <ten-tain> 重新出一次卡片给我看效果。
```

### I. Check before posting (no new production)

```text
检查 <ten-tain> 的交付是否齐全：横屏、竖屏、预告、复习卡、小红书卡片、双封面、文案。
列出缺什么和需要我人工确认的地方。只检查，不要开始制作。
```

### J. Save the work to GitHub

```text
把这期的改动提交到一个新分支并推送，提交前确认 npm run project:test 和 secrets:scan 都通过，然后开一个 PR。
```

## 4. Writing good prompts

1. **Say the column, and either the topic or "自选" (you choose).** For example `做一个词根视频`, `做一期 spect 词根`, `做一期六级阅读`.
2. **Say the scope.** Which outputs do you want: full production, only cards, only vertical, or only a fix?
3. **Name what must not change.** For example `只改这一期`, `已通过的素材不要重做`, `不要改讲稿`.
4. **Ask to see before the expensive step.** For example `生图前先给我看讲稿和词图映射表`
   (show me the script and word-to-picture plan before generating images). Voice and images cost money.
5. **One goal per prompt.** Finish and check one thing, then ask for the next.
6. **Refer to episodes by their folder name** (`ten-tain`, `cet4-translation-main-clause`).
7. **Make good feedback permanent:** `把这条写进 AGENTS.md`.

## 5. A typical production day

1. Start the session (section 2).
2. Ask for a new episode (A–D). Approve the script before images if you asked for that.
3. Codex finishes with the deliver stage. Open `00-打开工作台.html` or the episode folder.
4. Watch and flip through everything **on your phone**: video with speaker and headphones, cards at
   phone size, and the title character count.
5. Ask for any fixes (F).
6. Post: the Douyin vertical version on Douyin, the card carousel on Xiaohongshu, the landscape
   master on Bilibili. Codex never posts for you.
7. A week later, record plays, saves and follows, and tell Codex what worked so it can update
   `AGENTS.md` for the next episodes.

## 6. Saving money and time

- `npm run replica:produce -- --project=<slug> --stage=plan` runs only the planning checks. No paid calls.
- Voice and image generation happen only for the episode you are making, with limited retries.
- `npm run vertical:stills -- --project=<slug>` checks the phone layout in about a minute, without rendering video.

## 7. When something goes wrong

| Problem | What to tell Codex / do |
| --- | --- |
| "Missing DASHSCOPE_API_KEY" | Check `.env` exists and has the key; run `npm run keys:check` |
| Codex can't reach the API | Allow network access in Codex's sandbox settings for that session |
| Images or audio are tiny text files | Run `git lfs pull` (they are LFS pointers until downloaded) |
| Render can't find Chrome | Install Google Chrome, or set `REMOTION_BROWSER_EXECUTABLE` to its path |
| ffmpeg / ffprobe not found | Run `npm ci` again (Remotion ships them), or set `FFMPEG_PATH` / `FFPROBE_PATH` |
| Codex wants to use an old method (Wan video, Seedream, SVG drawings) | Say `按 AGENTS.md 第 9 节，不要恢复已停用路线。` (Follow AGENTS.md section 9; don't revive retired methods.) |
| `work/` is getting big | Delete it. It is local scratch and not in git |
| A key ended up in a file | Stop. The pre-commit hook should block it; revoke the key at the provider |
