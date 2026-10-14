# AI 背景音乐生成提示词

本系列是暖白纸面、小黑线稿、中文旁白主导的英语词根教学视频。背景音乐只负责提供轻微节奏和
亲和力，不能抢旁白、不能制造情绪大片感，也不能让观众误以为进入广告或儿童动画。

## 首选提示词：纸笔感轻节奏

建议先生成这一版，最适合 `press / reg / fer / ject / Bouba-Kiki` 共用：

```text
Create an original instrumental background track for a clean, minimalist educational video series about English word roots. Warm, curious, intelligent, and lightly playful, like ideas being sketched on white paper. Use soft felt piano, muted marimba or wooden plucks, very light brushed percussion, subtle pizzicato accents, and a gentle rounded bass. Keep the arrangement sparse with plenty of breathing room for continuous Chinese narration. 86 BPM, steady and unobtrusive, no dramatic build, no emotional climax, no sudden transitions. The melody should be simple, original, and easy to ignore while listening to speech. Produce a seamless 180-second loop with a clean beginning and ending. Instrumental only, no vocals, no spoken words, no choir, no lyrics.
```

## 备选 A：更温暖、更有陪伴感

```text
Original instrumental music for a friendly English-learning explainer on a warm off-white paper canvas. Warm acoustic study mood, calm and optimistic, with soft felt piano, gentle nylon guitar harmonics, tiny wooden percussion, quiet hand claps used very sparingly, and a smooth soft bass. Minimal arrangement, restrained dynamics, and generous space for a clear Chinese voice-over. 82 BPM. No catchy lead melody, no dramatic chord changes, no cinematic swell. Seamless 180-second loop, consistent energy from start to finish. No vocals, no speech, no lyrics, no choir.
```

## 备选 B：更现代、更适合结构化拆词

```text
Create a minimal modern instrumental bed for short educational motion graphics explaining English roots, prefixes, and word families. Precise but friendly, clean and curious. Use soft synth plucks, muted mallets, subtle ticking percussion, a very light electronic pulse, and warm rounded bass. Keep the high frequencies soft and the rhythm simple so it never competes with narration or sound effects. 90 BPM, stable energy, no drops, no risers, no trailer impacts, no dramatic build. Seamless 180-second loop. Instrumental only with no vocals, no spoken samples, and no lyrics.
```

## 备选 C：更俏皮，适合语音象征主题

```text
Original playful but restrained instrumental background music for an educational animation about how sounds suggest shapes and meanings. Use soft marimba, muted pizzicato strings, rounded woodblocks, tiny bubble-like synth plucks, and a gentle bass pulse. Curious, clever, deadpan, and slightly whimsical rather than childish. Keep the texture sparse under continuous Chinese narration, with no sharp percussion and no busy melody. 88 BPM, even pacing, no dramatic changes. Seamless 180-second loop. No vocals, no speech, no lyrics, no cartoon sound effects.
```

## 统一负面提示词

如果生成平台支持 Negative Prompt，可单独粘贴：

```text
vocals, singing, spoken words, rap, choir, lyrics, vocal chops, catchy pop hook, busy melody, heavy drums, trap hi-hats, EDM drop, rock guitars, cinematic trailer, orchestral climax, suspense, sadness, epic emotion, aggressive bass, sharp cymbals, sudden silence, risers, impacts, glitch, children’s nursery music, comedy soundtrack, corporate advertising jingle, watermark, audio tag
```

## 导出与放置

- 首选时长：`180 秒`；必须可无缝循环。
- 首选格式：高质量 MP3，立体声，`48 kHz`，建议 `320 kbps`。
- 文件名必须是：`root-word-series-bgm.mp3`。
- 放到：`public/assets/music/root-word-series-bgm.mp3`。
- 不要自行把音乐提前压得很小；项目会自动以 `0.10` 基础音量混入，旁白期间降到
  `0.045`，并自动做 `1.2 秒`淡入、`2 秒`淡出以及旁白闪避。

文件就位后，所有 `npm run replica:render` 草稿与正式渲染都会自动带上背景音乐。缺少该
文件时渲染会明确停止，避免导出无背景音乐的漏版。
