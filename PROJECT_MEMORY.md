# 2026-09-29 当前制作基准

用户确认以最新验收的 `ten-tain` 成片作为项目后续制作方向，视觉动作参考 `mit/miss`：
所有栏目统一使用内置 `image_gen` 栅格生图、纯白小黑画面、语义关键姿态、丝滑帧动画、
可听见但压低的纯音乐、词根封面母版和整片预览闸门。词根、四集系列和四六级写作/阅读/翻译
可以改变教学内容和分镜顺序，但不能另起旧版生图、PPT 卡片、低规格封面或只看抽帧的链路。
跨会话入口见 [当前视频制作基准](docs/当前制作基准.md)。下面的日期条目是历史记录，不覆盖
这条最新基准。

# 2026-09-13 最新偏好

所有栏目默认丝滑动效；完整视频超过两分钟，围绕一个可运用的应试知识点，含练习与讲评；去掉导航式脚注和制作调试小字。交付从根目录 00-打开工作台.html 进入，成片、双封面和文案在首屏找到。详见 AGENTS.md。

# Root-word video replica memory

## 当前长期偏好：自主选题与去重（2026-09-12）

用户未指定题目时，智能体自行寻找未制作过的主题，查重后直接完成视频，不要求用户
提供或确认普通选题；指定题目时按指定内容执行，重复题保留旧版另做版本。
此偏好跨会话、跨智能体生效。执行入口见 AGENTS.md，详细规则见
docs/选题与自动制作规则.md，历史主题见 planning/topic-history.json。
台账须结合真实注册表、草稿、试片与日志核对并持续更新。

## 2026-07-29 — FORM production complete

- 完成 `form = shape / 形状；形成` 白底小黑词根视频：112 秒、12 场、八词 formation / inform / reform / transform / conform / deform / uniform / formula。
- 采用“橙色模具”记忆钩子与通用连续舞台；每个词显式编码构词、词义、动作时点和左右布局，结尾为 0.7 秒、70% 部分压暗。
- 9 张最终插图均为 2848×1600 RGBA，残绿 0%；多轮拒绝/重做地面线、伪数字、额外人物、语义不成立和裁切候选。
- 配音首轮出现最高 1.551×，压缩到门禁内；正式验证又发现 inform/reform 的 1.682s/1.865s 旁白空档，补充有效讲解并重配，最终零长静音缺口。
- Iconfont 定向检索超时且无逐项商用许可证明，记录零采用；支持性图形全部由代码绘制。
- 最终验证：3360 帧、112 秒时间轴、1920×1080、30fps、H.264/AAC、峰值 -2.98 dBFS；白底、字幕安全区、媒体全解码、70% 尾部压暗、双封面与内容 QA 通过。
- 无逐帧权威样片，使用 Press 系列样片完成 16 对风格对比；全部成片、封面、发布文案、报告、对比与抽帧位于 `outputs/form/`，release 为 draft。

This file is the durable project handoff. Append a dated entry for every material change. Keep
`edit/project.md` as the per-render log; do not replace either file with chat-only context.

## 2026-07-20 - Baseline and scope

- Target set: the four videos under `样片/`: `press`, `reg`, `fer`, and Bouba/Kiki.
- Locked visual requirements: 1920x1080, 30fps CFR, pure `#FFFFFF` background, system Microsoft
  YaHei, deep blue `#041FA0`, orange `#E85810`, cute isolated illustrations, and code-authored
  SVG arrows/icons. Generated raster art uses a flat green source and local chroma removal.
- User permits redrawing missing illustrations and asked to preserve/configure the ending darkening.
- No source/sample files are deleted until every replica has passed comparison and the final import
  scan.

## 2026-07-20 - Press golden sample

- Implemented the reusable Remotion replica engine under `src/replica/`.
- `edit/preview.mp4`: 1920x1080, 30fps, 5180 video frames, 172.666667s video, AAC audio,
  0.5s fade to fully black.
- 16 scenes, 119 layers, 16 narration clips, six SFX types, and 11 transparent illustrations
  pass the current validation and asset QA gates.
- Representative boundary/contact-sheet evidence is under `edit/verify/`.

## 2026-07-20 - Sample analysis

- Wrote detailed beat maps for `reg`, `fer`, and Bouba/Kiki under `edit/reference-analysis/`.
- ASR service was unavailable with the configured key, so the analyses use media probes, sampled
  frames, embedded captions, and silence boundaries. This limitation is recorded, not hidden.
- Measured endings: `reg` about 0.6s to black; `fer` partial darkening near 0.8 opacity; Bouba/Kiki
  102.30s with final empty-background RGB about 68 (black overlay opacity about 0.733).
- Bouba/Kiki evidence is in `edit/verify/bouba-reference/`.

## 2026-07-20 - Skill and engine hardening

- Created `C:\Users\msskx\.codex\skills\build-root-word-video` with a validated `SKILL.md`,
  config schema, visual style, quality gates, templates, and `scripts/compare_videos.py`.
- Skill Creator validation passes. A minimal-context forward test for an unseen `spect` root
  produced a coherent explicit configuration plan without modifying the repository.
- Added project-level `reference` and `quality` metadata, configurable `fadeEndOpacity`, and
  whole-scene `white-fade`, `zoom`, and `swirl` transitions to the shared renderer.
- Press typecheck and validation still pass after these changes.

## 2026-07-20 - Xiaohei style constraint added

- User requires every drawing to use the local Ian Xiaohei illustration system at
  `ian-xiaohei-illustrations-main/ian-xiaohei-illustrations-main/ian-xiaohei-illustrations`.
- Read the source Skill and its style DNA, IP, composition, prompt, and QA references. Binding
  traits are black wobbly hand-drawn linework, pure white space, sparse orange/red/blue marks, and
  a black Xiaohei with white dot eyes performing the core action. Cute colored-cartoon candidates
  are rejected.
- Two initial Seedream retries showed that the model could create green-screen frames or
  oversized subjects. The generation script now rejects those assets and auto-fits oversized RGBA
  subjects; all new prompts are being regenerated under the Xiaohei constraint.

## Current work

- Added `scripts/replica/verifyRender.ts` and `npm run replica:render:verify`. It checks final
  H.264/AAC media structure, exact frame count, 30fps CFR, white-corner/fade pixels, and audio
  maximum level. The golden press render passes: 5180 frames and about -3.00 dBFS.
- `fer` configuration is complete: 13 scenes, 122 layers, 13 green-screen prompts, 4081 frames,
  swirl/zoom recap, and `0.6s / 0.8` partial ending. Assets, narration, render, and paired sample
  comparison remain outstanding.
- `reg` and Bouba/Kiki project modules are being authored; assets, narration, renders, and paired
  sample comparisons are still outstanding.
- Bouba/Kiki configuration is next after the shared project patterns are proven.
- Do not mark this project complete or delete candidates until all three new videos are rendered,
  listened to, frame-compared, and logged here.

## 2026-07-21 - Four-video replica set completed

- Finished the three remaining registered projects: `reg` (15 scenes, 82 layers, 9
  illustrations), `fer` (13 scenes, 117 layers, 13 illustrations), and `bouba-kiki` (11 scenes,
  102 layers, 12 illustrations). The existing `press` golden project remains 16 scenes and 119
  layers.
- Generated and visually reviewed all 34 new transparent raster illustrations. Every new file is
  2848x1600 RGBA, has transparent corner bands, passes coverage limits, and measures `0.000%`
  visible green residual. Rejected model signatures, text, logos, green floors, frames, and
  commercial-cartoon variants. `reg/08_buick_regal.png` is a code-drawn, logo-free car fallback.
- Hardened chroma removal to clear the outer 7% band and pale anti-aliased green. Image prompts
  now describe the Xiaohei visual DNA without sending the artist name to the model, preventing
  generated signature text.
- Corrected Bouba/Kiki `sp` family narration to match the two visible word lists, regenerated only
  that scene's voice, and selectively used `fit: 'cover'` for central opening shapes so the 16:9
  transparent source canvases read at the sampled scale without changing the global image rule.
- Final outputs pass `typecheck`, project validation, asset QA, and render media verification:
  `reg` = 3100 frames / 103.333333s / -3.00 dBFS / final RGB 0; `fer` = 4081 frames /
  136.033333s / -3.00 dBFS / final RGB 51; Bouba/Kiki = 3069 frames / 102.300000s /
  -2.90 dBFS / final RGB 68. All are H.264 1920x1080 CFR 30fps with AAC stereo 48kHz.
- Generated 12-pair same-time sample/candidate contact sheets for all four episodes under
  `edit/verify/comparisons/`. Review confirms matching teaching order, sampled summaries,
  white-canvas hierarchy, blue/orange emphasis, semantic arrows/icons, and ending behavior. The
  deliberate visual deviation is replacing the samples' mixed colored illustrations with the
  user-required Xiaohei black-line system; missing branded detail is replaced by a logo-free
  metaphor as authorized by the redraw permission.
- Updated and revalidated `C:\Users\msskx\.codex\skills\build-root-word-video`. New reusable
  rules cover model-written signatures, outer green rims, code fallbacks for brand objects,
  selective transparent-canvas cover fitting, and list/table narration parity. Validation passes
  with Python UTF-8 mode.

## Current work - final audit only

- Final MP4s and paired comparisons are complete. Run one import/manifest/static-path scan,
  remove only candidates proven unreferenced, rerun typecheck/validation as appropriate, and log
  the cleanup evidence before declaring the project closed.

## 2026-07-21 - Final audit closed

- Static reference audit found exactly 100 runtime files and 100 unique runtime references across
  `src`: unreferenced runtime files = 0, missing runtime files = 0. The registry contains all four
  projects. No production file was deleted; green technical sources, accepted alpha assets,
  manifests, final MP4s, and verification evidence are intentionally retained.
- Final `typecheck` exits 0. All four project validators pass: press 16/119/11, reg 15/82/9,
  fer 13/117/13, Bouba/Kiki 11/102/12 (scenes/layers/illustrations). All 45 declared raster
  assets pass with 0.000% visible green residual.
- Remaining playback-rate messages are review warnings within the accepted 1.16x ceiling:
  press 1.158/1.148, reg 1.142/1.152, Bouba/Kiki 1.134. They are not gate failures.
- The requested four-video replica set is complete. There is no outstanding material request.

## 2026-07-21 - Post-audit narration coverage correction

- A full-stream silence comparison disproved the earlier completion claim: the old replicas had
  multiple candidate-only gaps, including roughly ten-second holes in `fer`, while the target
  samples had continuous effective narration at the same times. No noise or unrelated music was
  added. Nineteen short teaching scripts were expanded, regenerated scene by scene, and paired
  with automatically segmented Microsoft YaHei captions; five boundary clips received a final
  timing pass.
- All regenerated narration remains within the `1.16x` playback-rate gate. The final silence
  scan uses `-45 dB / 1.2s`: `press`, `reg`, and `fer` have zero long-silence windows;
  Bouba/Kiki has only `63.375-64.674s`, corresponding to the sample's deliberate
  `62.78-64.33s` sp-to-sn teaching pause.
- `replica:render:verify` now performs full video/audio decode with `-xerror`, reports long
  silences, rejects candidate-only gaps, and supports narrow project-level reference-matched
  allow-windows. Final reports pass: press 5180 frames / -2.90 dBFS, reg 3100 / -3.00 dBFS,
  fer 4081 / -2.90 dBFS, Bouba/Kiki 3069 / -2.90 dBFS.
- Full-video Watch sampling reviewed 84 representative frames across the four outputs; scene
  detection correctly fell back to uniform sampling for the white/static teaching layout. Final
  targeted caption frames at press 145s, fer 52s/134s, and Bouba/Kiki 73s/100s show correct
  wrapping, safe-area placement, and no subject/table collision.
- Runtime reference scan after the last render found exactly 100 files and 100 unique references,
  with zero missing and zero unused. The production `edit/verify/` tree now contains only four
  render reports, four comparison contact-sheet packages, and five final spot frames.
- The first broad-delete attempt was stopped by the safety gate. 582 proven-unused intermediate,
  duplicate, draft, and rejected files (140,814,882 bytes) were moved to a dated reversible
  quarantine, reviewed by category, then permanently deleted after explicit approval. The empty
  quarantine parent was removed. Final outputs, runtime assets, accepted green sources,
  comparison packages, spot frames, and render reports were outside the deletion scope.
- Updated `build-root-word-video` Skill with narration-coverage/silence parity, full-decode, and
  Windows Chinese-path UTF-8 rules. `quick_validate.py` passes with `PYTHONUTF8=1`.

## 2026-07-21 - Project structure consolidation

- Consolidated all delivery material under `outputs/<slug>/`. Final videos now live at
  `outputs/press/press.mp4`, `outputs/reg/reg.mp4`, `outputs/fer/fer.mp4`, and
  `outputs/bouba-kiki/bouba-kiki.mp4`; each folder also owns its current render report,
  comparison contact sheet, spot checks, reference analysis where available, and README.
- Moved reproducible green-screen sources to `assets/green-screen/<slug>/` and the production
  log to `docs/production-log.md`. Updated project configs, prompt specs, render/still scripts,
  the reusable Skill, package commands, and root documentation to use the new paths.
- After explicit permanent-delete confirmation, removed the retired `RootWordTemplate` source
  and scripts, legacy `out`/old `outputs`/archive trees, old continue/press assets, analysis
  frames, the duplicate Xiaohei repository under `tools`, and empty leftovers. The retained
  Xiaohei source, reference samples, accepted runtime assets, narration, SFX, and green sources
  remain intact.
- Replaced stale comparison metadata that pointed into `edit/` with clean project-relative JSON;
  retained the reviewed 12-timepoint contact sheets and removed indexes that referenced deleted
  intermediate frame files.
- Made `replica:render:verify` work with Remotion's bundled compact ffmpeg: PNG-pipe corner
  sampling replaces rawvideo muxing, PCM/WAV peak measurement replaces `volumedetect`, and the
  script automatically resolves the bundled Windows executables.
- Final gates pass after cleanup: TypeScript, four project validators, all 45 alpha-asset checks,
  four registered Remotion compositions, JSON parsing, and media verification. Media results are
  press 5180 frames / -2.93 dBFS, reg 3100 / -2.96 dBFS, fer 4081 / -2.94 dBFS, and
  Bouba/Kiki 3069 / -2.90 dBFS. Runtime audit: 100 static files = 100 unique references, plus
  six dynamically selected SFX with zero unused files.

## 2026-07-21 - Ject episode completed

- Added and registered `ject`: 11 scenes, 65 layers, seven Xiaohei illustrations, 11 narration
  clips, 105.000 seconds, and 3150 frames. The teaching map is `ject = throw`, with `re` back,
  `pro` forward, `in` into, `ob` against, and `sub` under, covering `reject`, `project`, `inject`,
  `object`, and `subject` plus the relevant noun/verb stress shifts and five example sentences.
- No exact local sample was supplied. `outputs/ject/comparison/` therefore documents style-series
  alignment against the reviewed `press` video and explicitly does not claim shot/timing parity.
  Midpoint and boundary sheets, encoded-MP4 spot frames, a beat map, and the media report all live
  under `outputs/ject/`.
- Generated, cut out, and visually reviewed all seven 2848x1600 RGBA assets; each reports 0.000%
  visible green. Three model attempts for the `reject` scene failed on labels, glossy language, or
  inset bars, so the accepted source is a code-drawn green plate passed through the standard
  cutout path. Rejected evidence is isolated at `assets/archive/ject-rejected/` and is not runtime.
- The first render's full-stream scan found six candidate-only boundary silences. Expanded only
  the relevant teaching narration, regenerated those clips, kept all playback rates at or below
  1.16x, and eliminated every unexplained `-45 dB / 1.2s` silence window.
- Hardened `assetVerifier.ts` with continuous inset horizontal/vertical band detection. The final
  2.5% thickness gate rejects the 8.81% letterbox failure without rejecting valid broad Xiaohei
  compositions; all five registered projects' assets pass after calibration.
- Final `outputs/ject/ject.mp4` is 1920x1080 H.264/AAC CFR 30fps with exact 3150 frames, -2.96
  dBFS peak, zero unexplained long silences, pure-white sampled canvas, and a 0.6-second fade to
  full black. Full media decode and every project/type/assets/composition gate pass.
- Final static audit is 118 runtime files = 118 unique references, zero missing, zero unused;
  six dynamically selected SFX are all referenced. The updated `build-root-word-video` Skill also
  passes `quick_validate.py` in UTF-8 mode.

## 2026-07-21 - Unified cover system prototyped

- Added a single reusable 1080x1440 `RootWordCover` React/Remotion composition. New episode cover
  content is data-driven through each project's `cover` metadata; per-video bespoke layouts are
  prohibited so the series remains visually stable.
- Exported the first approval candidate to `outputs/ject/cover.png`. It reuses the accepted Ject
  throw-action cutout in the fixed middle-right illustration zone and code-renders all Microsoft
  YaHei typography, root highlighting, border, brand mark, arrow, pills, and footer.
- Added `npm run replica:cover -- --project=<slug>` and documented that every future video ships
  with `outputs/<slug>/cover.png`. A dedicated Jimeng/Seedream illustration is generated only when
  the video's accepted art cannot express the core action.
- Updated the root README, output README, standard future prompt, Ject README, production log, and
  `build-root-word-video` Skill/config/style/quality/template sources. Existing Press, Reg, Fer,
  and Bouba/Kiki covers stay untouched until the user approves the Ject prototype.
- Added `replica:cover:verify`; Ject passes as an opaque RGB24 1080x1440 PNG with four exact white
  corner samples and five configured words. A 270x360 thumbnail review confirms the primary root,
  meanings, action silhouette, and word family remain readable.

## 2026-07-21 - Approved cover system backfilled

- User approved the Ject cover layout. Generated matching covers for Press, Reg, Fer, and
  Bouba/Kiki, so all five current videos now contain `cover.png`, `cover-report.json`, and a
  270x360 `cover-thumbnail-review.png` in their own `outputs/<slug>/` directory.
- Reused accepted runtime art only: Press button, Reg ruler, Fer carrying box, Bouba/Kiki thinking
  shapes, and the existing Ject throw action. No additional image-generation call or unreviewed
  raster asset was required.
- The first Press and Reg cards exposed a long-word wrap/footer collision. Fixed it generically by
  deriving chip type size, padding, and gap from total configured word length. Both now keep all
  five words on one readable row at full size and 25% scale.
- Extended cover data with optional eyebrow, family label, per-chip highlights, image fit, and
  bounded scale. This lets sound-symbolism episodes use the same fixed layout instead of creating
  a bespoke cover component.
- All five automated cover reports pass: opaque RGB24 PNG, 1080x1440, four exact-white corners,
  five configured entries, present accepted illustration. Full-size and thumbnail visual reviews
  pass for hierarchy, clipping, collision, and series consistency.
- Final regression passes TypeScript, all five project validators, all five cover gates, JSON
  parsing, Remotion registration, and Skill validation. Runtime assets remain 118/118 referenced,
  with zero missing and zero unused.

## 2026-07-22 - AI background music standardized

- Added project-specific AI music prompts in `docs/BACKGROUND_MUSIC_PROMPTS.md`: one recommended
  paper-and-pluck study bed plus warm acoustic, minimal modern, and playful sound-symbolism
  alternatives, all instrumental, sparse, narration-safe, 180 seconds, and loopable.
- All five registered projects now inherit `SERIES_BACKGROUND_MUSIC` from
  `src/replica/seriesAudio.ts`. The renderer uses one composition-level looping track at
  `assets/music/root-word-series-bgm.mp3`, base volume `0.10`, narration-ducked volume `0.045`,
  `0.25s / 0.55s` attack/release, and `1.2s / 2.0s` whole-program fades.
- Draft and final rendering intentionally fail fast if
  `public/assets/music/root-word-series-bgm.mp3` is absent; validation only warns so non-render
  production work remains available. This prevents accidental delivery of a music-free version.
- Final media verification now records the music source/configuration and separately calculates
  narration-only coverage gaps, preventing continuous music from masking a voice clip that ends
  too early. Existing peak, AAC stereo 48kHz, full-decode, and mix-silence checks remain.
- Updated and validated `C:\Users\msskx\.codex\skills\build-root-word-video`, including a dedicated
  background-music contract, schema/template changes, quality gates, render-stop rule, and repaired
  Chinese UI metadata. An isolated forward test recovered the intended workflow without parent
  context.
- TypeScript and all five validators pass. The music master has not yet been supplied, so existing
  MP4s are unchanged pre-music deliveries and new renders remain correctly blocked until the user
  places the generated file at the required path.

## 2026-07-22 - Generated background music adopted

- Audited all three MP3 files supplied in `bg/` and selected the 543.373-second
  `bg_no-watermark.mp3`: stereo 44.1 kHz / 256 kbps, about -17.9 LUFS, no detected long silence,
  and long enough for every current episode without an audible loop. Source files were preserved.
- Installed the byte-identical accepted master at
  `public/assets/music/root-word-series-bgm.mp3`; SHA-256 is
  `976DA5811B83EBE2B418D0484D948D8AF19CAF8CBE14C82F542CB59BCFAA37E2`.
- All five final videos now contain the shared narration-ducked music mix. Exact verified results
  are Press 5180 frames / -2.75 dBFS, Reg 3100 / -2.91 dBFS, Fer 4081 / -2.91 dBFS,
  Bouba/Kiki 3069 / -2.84 dBFS, and Ject 3150 / -2.88 dBFS; all retain AAC stereo 48 kHz and zero
  unexplained long-silence windows.
- Press, Reg, Fer, and Bouba/Kiki kept their accepted H.264 streams unchanged while their
  Remotion-generated final audio was muxed in; Ject was fully re-rendered. Never use ffmpeg
  `-shortest` for this exact-frame backfill: it dropped Ject's final frame despite nominally equal
  durations. Let the video stream define output length and always recheck exact frame count.
- The regenerable draft/WAV intermediates are not delivery files. Final videos, reports, the
  accepted runtime master, and every original `bg/` source remain authoritative.

## 2026-07-22 - Ject continuous-stage motion upgrade

- Replaced Ject's page-by-page visual mounting with one persistent 105-second stage while keeping
  all eleven narration/caption/SFX scenes, shared BGM, 3150-frame duration, cover, teaching order,
  and 1920x1080/30fps delivery unchanged. Press, Reg, Fer, and Bouba/Kiki remain on the accepted
  generic renderer.
- The shared `ject`, direction system, camera container, word-family progress, and white stage now
  survive chapter changes. Prefixes use an exclusive six-frame handoff so outgoing/incoming
  morphemes cannot form false words. Supporting chapters overlap 8-16 frames without returning to
  the old near-empty white boundary frames.
- Added frame-only reusable motion helpers and typed `WordScene` data. The five word chapters now
  encode semantic phases and align their climax to the existing hit/whoosh/press cue at frame 96,
  81, 80, 87, and 83 respectively.
- Added `replica:render:hq` and explicit final H.264 CRF 18, yuv420p, AAC 192 kbps flags. The new
  final is 37,539,091 bytes and verifies as exact 3150-frame H.264 1920x1080 CFR 30fps plus AAC
  stereo 48kHz, -2.90 dBFS peak, zero coverage gaps, zero long silences, white pre-fade canvas,
  and an 18-frame fade to full black.
- Reviewed four rounds of source boundary/action stills and nine final encoded-MP4 frames. Final
  evidence is `outputs/ject/final-spot-checks/contact-sheet.png`; the strict report is
  `outputs/ject/render-report.json`.
- Updated and validated the reusable `build-root-word-video` Skill with the conditional
  continuous-stage workflow and anti-overlap quality gates. No project lint or unit-test script is
  currently configured; TypeScript, configuration, assets, compositions, draft/full rendering,
  full decode, media/audio gates, cover validation, and Skill validation all pass.

## 2026-07-22 - Dual covers and synchronized Douyin copy

- Every registered video now declares four co-located delivery paths: final MP4, 1080x1440
  `cover.png`, 1920x1080 `cover-landscape.png`, and UTF-8 `douyin-copy.md`.
- Added one shared landscape Remotion cover component. It reflows the vertical card grammar for
  16:9 and reuses the accepted episode illustration; it is never produced by stretching or
  cropping the vertical file.
- Final guarded video rendering now generates both covers, verifies their dimensions/white canvas,
  and generates the publish copy before completion. Project validation rejects missing delivery
  path configuration or artifacts configured outside the MP4 directory.
- Generated both new artifacts for Ject, Press, Reg, Fer, and Bouba/Kiki. Visual review caught and
  fixed a landscape arrow/section-label collision before acceptance. Both ordinary root-word and
  sound-symbolism copy were read back and checked for topic-appropriate wording.
- Updated the reusable Skill workflow, schema, visual contract, quality gates, UI metadata, and
  completion evidence so future episodes require the same synchronized delivery package.

## 2026-07-22 - Port episode

- Added `port` as a sixth registered root-word project. The finished storyboard is 112.500s /
  3375 frames / 30fps with a continuous generic stage, 12 scenes, 57 layers, and a 0.600s fade
  to full black. No sample was supplied; series grammar follows the accepted Ject/Press family.
- Teaching decision: `port = carry` (携带、运输). Prefix route map is `im/in` in, `ex` out,
  `trans` across, `sup/sub` under, `re` back, `de` away; `portable` and `porter` use `-able`
  and `-er` as productive suffix cues. Summary rows and order are explicit in the storyboard.
- Generated 9 transparent assets. Seedream candidates for `import`, `transport`, `portable`,
  `porter`, and `deport` were visually rejected for heavy scenery, ground lines, shading, crop,
  or inset-like artifacts. `transport`/`deport` use a repository-owned code-drawn fallback
  green plate; the generic image generator now shrinks only oversized subjects, not tiny ones.
  All assets pass 2848×1600 RGBA, corner/edge, coverage, and 0.000% green residual QA.
- Audio was regenerated with the shared CosyVoice configuration. Five clips were initially above
  the playback gate; the scene durations were lengthened to 112.5s so all required playback rates
  remain ≤1.16×. The music master is present at `public/assets/music/root-word-series-bgm.mp3`
  and is mixed continuously with narration ducking.
- Draft review evidence is under `outputs/port/review-stills/`, with an asset contact sheet at
  `outputs/port/asset-contact-sheet.png`. The midpoint/boundary sheets show no pre-fade black,
  white-flash gap, or later-word reveal. Formal render and media report values are appended after
  the final encoded file completes.
- Final render evidence now passes: `outputs/port/port.mp4` is 3375 frames / 112.500s H.264
  `yuvj420p` plus AAC stereo 48kHz, peak -2.86 dBFS, complete decode, 0 narration coverage gaps,
  0 unexplained long silences, and white/fade pixel samples `(255,255,255) → (0,0,0)`. Both
  1080×1440 and 1920×1080 covers, deterministic copy, comparison findings, and encoded spot-check
  contact sheet are co-located under `outputs/port/`.

## 2026-07-22 - Spect episode

- Added `spect` as the seventh registered root-word project. The finished storyboard is 117.900s /
  3537 frames / 30fps with a continuous generic stage, 12 scenes, 56 layers, and a 0.500s fade to
  full black. The requested eight-word family is `inspect, respect, suspect, expect, prospect,
  spectator, spectacle, retrospect`.
- Teaching decision: `spect = look` (看、观察). The memory system treats the prefix as the lens
  direction (`in` inside, `re` back, `sus` under, `ex` out, `pro` forward, `retro` backward) and
  the suffix as the watcher/scene (`-ator`, `-acle`). `sus-` and `respect` are explicitly framed
  as historical/semantic memory hooks rather than mechanical modern translations.
- Generated 9 transparent assets. Six Seedream plates were accepted; duplicate-character,
  question-glyph, and arrow-mark candidates for respect/suspect/expect were replaced by compact
  repository-owned code-drawn plates and reprocessed through the same chroma-removal path. All
  assets pass 2848×1600 RGBA, corner/edge, coverage, and 0.000% green residual QA.
- Voice uses the shared CosyVoice configuration. The map and several long word explanations were
  given extra hold time so every required playback rate stays ≤1.16×; validation leaves only
  near-limit warnings. The continuous series BGM is present and ducked under narration.
- Draft midpoint/boundary review caught missing `spectator`/`spectacle` suffixes in the main title;
  encoded review then caught the false `exspect` display. The helper now supports a spelling stem,
  so `expect` renders correctly as `ex + pect` with the omitted `s` noted; final MP4 checks show
  all complete spellings.
  Final evidence is under `outputs/spect/review-stills/`, `outputs/spect/final-encoded-checks/`,
  and `outputs/spect/comparison/`.
- Final `outputs/spect/spect.mp4` passes full decode and media gates: 3537 frames / 117.900s,
  H.264 `yuvj420p`, AAC stereo 48kHz, peak -2.86 dBFS, zero narration coverage gaps, zero
  unexplained long silences, white-to-black pixel samples, both cover gates, deterministic copy,
  and project/type/assets/composition validation. The comparison package uses press for style and
  ending parity, while documenting the intentional content and duration difference.

## 2026-07-22 - Vis / Vid episode

- Registered `vis-vid`: 12 scenes, 54 layers, 118.500 seconds / 3555 frames, continuous renderer,
  shared music, and a 0.500-second fade to full black.
- Corrected user shorthand `-vidt` to `vid`; the teaching system uses `vis / vid = see` and
  the explicit family `vision, visible, video, visual, evidence, evident, visit, revise`.
  `evidence` is labeled as a historical mnemonic rather than mechanical segmentation.
- Rejected generated ground lines, realistic commercial objects, inset panels, and opaque bands.
  All 9 final assets pass 2848×1600 RGBA QA with 0.000% green.
- The initial verifier caught a 1.372-second narration gap in `visible`. Its audio was
  force-regenerated to 10.083 seconds and fitted at 1.120×. Reviewed warnings at 1.120× and
  1.149× remain below the 1.16× ceiling.
- Final `outputs/vis-vid/vis-vid.mp4` passes 3555-frame exactness, H.264 1920×1080 CFR 30 fps,
  AAC stereo 48 kHz, -2.79 dBFS peak, full decode, zero narration gaps, zero long silences,
  white-to-black samples, both covers, copy, encoded contact sheet, and 14-pair Press comparison.

## 2026-07-23 - Semantic motion v2 pilot

- User approved the proposed anti-static production upgrade and requested the latest episode be
  rebuilt first, with skill changes deferred until after viewing and approval.
- Added optional typed semantic choreography to the shared continuous-stage definition:
  `actionAt`, named semantic action, camera direction, optional image target, and strength.
  This is backward compatible; projects without `scenePlans` keep the established motion path.
- `vis-vid` is the pilot. Its twelve scenes now use explicit focus/compare/form/enter/play/scan/
  proof/clarify/approach/revisit/cascade/gather behaviors instead of relying only on one coarse
  left/right/in/out label per scene.
- The shared renderer now provides deterministic anticipation, travel/contact, climax,
  damping/settle, illustration breathing, content-led camera drift, staggered text emphasis, and
  code-drawn semantic focus/path overlays. No CSS animation, timer, clock, or randomness was
  introduced.
- Evidence: typecheck and project validation pass; 9/9 existing cutouts still pass asset QA;
  `outputs/vis-vid/review-stills/actions-v2/` contains anticipation/climax/settle samples.
  The rebuilt `outputs/vis-vid/vis-vid.mp4` passes 3555-frame exactness, H.264 1920×1080 CFR 30fps,
  AAC stereo 48kHz, -2.79 dBFS peak, full decode, zero narration gaps, zero unexplained long
  silences, white/fade pixel checks, both cover gates, and deterministic copy generation.
- Do not update `build-root-word-video` yet. First obtain user approval of this rebuilt episode,
  then refine any requested motion and only afterward codify the accepted system in the skill.

### 2026-07-23 user-review revision

- User requested three concrete changes before approval: assemble words from root plus affixes,
  vary the repeated left-text/right-art composition, and remove unexplained arrows/icons.
- Added typed `wordBuild` and `layout` data to semantic scene plans. All eight `vis-vid` word
  chapters now assemble the orange root with independently moving blue prefix/suffix fragments.
  Alternating chapters mirror the full teaching layout while preserving captions outside the
  camera transform.
- Tightened visual handoff timing so layout flips do not create a dense two-page crossfade.
  Removed generic directional arrows from non-directional overlays. Retained only semantically
  justified focus/scan brackets; deliberately did not add an icon library because no chapter
  needed a second icon vocabulary beyond the accepted Xiaohei illustration.
- Evidence: `review-stills/assembly-layout-v3/` shows assembly phases and alternating layouts;
  `review-stills/boundary-focus-v3/` shows the revised handoffs and mirrored focus targeting.
  The prior candidate remains recoverable as `vis-vid-v2-semantic.mp4`.
- Current `vis-vid.mp4` passes typecheck and formal render verification at 3555 frames,
  1920×1080 CFR 30fps, AAC stereo 48kHz, -2.79 dBFS peak, zero narration gaps, zero unexplained
  long silences, and the expected white-to-black ending. Skill changes remain deferred until
  user approval.

### 2026-07-23 collision-safe layout and Iconfont library

- User requested a further layout pass guaranteeing that moving art never covers text, and asked
  Codex to inspect the already-open Iconfont site and seed a reusable local icon library.
- Generic word chapters now mount art in explicit left/right safe boxes instead of translating
  the original 1040px image canvas across the stage. Safe boxes are separated from the text zone
  even at the largest semantic travel keyframe. Per-scene `imageFit` and `imageScale` preserve
  readable subject size without cropping meaningful extremities.
- Reviewed every word chapter at its action peak. Evidence is stored under
  `outputs/vis-vid/review-stills/safe-zones-v4/`, `safe-zones-v4-cover/`, and
  `safe-zones-v4-final/`. The final vision and visible frames keep full silhouettes, generous
  separation, and large readable titles.
- Direct browser inspection confirmed Iconfont search cards contain original SVG path data.
  Created `public/assets/icons/iconfont-core/` with four seed SVGs plus `manifest.json` and usage
  rules. Every entry records Iconfont ID/hash/source. The library is reference-only until each
  author/license is verified; no icon was inserted into this episode merely to create motion.
- Preserved the previous render as `vis-vid-v3-morpheme-layout.mp4`. The current
  `outputs/vis-vid/vis-vid.mp4` passes typecheck and render verification: 3555 frames,
  1920×1080 CFR 30fps, AAC stereo 48kHz, -2.79 dBFS peak, zero narration gaps, zero long
  silences, and correct white/fade samples. Skill changes remain deferred pending user approval.

### 2026-07-23 user approval and skill finalization

- User approved the final collision-safe `vis-vid` render.
- Updated the global `build-root-word-video` skill plus `visual-style.md`, `config-schema.md`, and
  `quality-gates.md`. The accepted semantic stage is now the default for new unsampled episodes;
  exact frame-accurate replicas still follow their reference.
- Future episodes must encode explicit semantic climax times, prefix/root/suffix assembly,
  multiple compatible chapter layouts, transformed hard safe zones, and per-scene image
  fit/scale. Arrows and icons require semantic justification; external icons require provenance
  and license state before published use.
- Completion audit passed: current project typecheck succeeds, `vis-vid` validates at 12 scenes /
  118.500 seconds, and the encoded MP4 verifies at 3555 frames with -2.79 dBFS peak, zero narration
  gaps, zero unexplained long silences, and expected white/fade samples.

### Iconfont access policy

- For future new videos, inspect the user's existing signed-in Iconfont browser session when
  suitable icons would materially clarify a teaching beat.
- Select icons only when they have a clear semantic purpose and compatible visual style. Record
  source, stable ID/hash, modifications, author/collection, and license status before published
  use.
- Never store Iconfont usernames, phone numbers, passwords, session tokens, cookies, or other
  credentials in this repository, project memory, skill files, logs, manifests, or generated
  artifacts. If the browser is signed out, ask the user to complete sign-in in the browser.

## 2026-07-23 - aud = hear

- Added the `aud` project with 12 scenes / 112.200 seconds and the exact requested family:
  `audio, audience, audit, audible, audition, auditorium, inaudible, audiobook`.
- The core mnemonic is a sound receiver: Xiaohei raises an oversized ear/listening horn and
  catches sound. `audit` is labeled as a historical “listen, then check” memory route.
- The ending follows the supplied Press sample: 0.500-second fade to opacity 1 / full black.
- Nine final cutouts are 2848×1600 RGBA and pass 0.000% residual-green QA. Rejected/regenerated
  audit artwork containing ledger text/check marks and inaudible artwork with ambiguous sound
  blocking. The final inaudible action places the cushion between sound and listener.
- Initial encoded verification exposed narration-only gaps in four scenes. Expanded and
  regenerated only those clips. Final project has zero narration coverage gaps and zero
  unexplained long silences; no BGM/noise workaround or allowed silence window was added.
- Final `outputs/aud/aud.mp4` is 3366 frames, 112.200 seconds, H.264 1920×1080 CFR 30 fps with
  AAC audio, -2.83 dBFS peak, complete decode, white program samples, and a 15-frame full-black
  tail. Typecheck, validation, 9/9 asset QA, both cover gates, and deterministic copy pass.
- Evidence is unified under `outputs/aud/`: README, beat map, asset sheet, midpoint stills,
  render report, both covers, publish copy, and a 16-pair explicit-time Press comparison.
- Comparison conclusion: palette, Microsoft YaHei hierarchy, whitespace, captions, reveal order,
  Xiaohei action grammar, and ending match the series. Different topic, 8-word duration, and
  hearing-specific actions are intentional content-driven deviations.
## 2026-07-24 — Landscape covers standardized for Xiaohongshu

- The series landscape cover is now a native 4:3 Xiaohongshu card at 1200x900, replacing the old
  1920x1080 16:9 cover. `cover.png` remains 1080x1440; video delivery remains 1920x1080.
- The shared Remotion composition and the cover verifier are the single authorities for this
  format. Future `npm run replica:cover` runs produce 1200x900 landscape files, and verification
  rejects any other landscape dimensions.
- All nine existing horizontal covers were rerendered in place and passed opaque-PNG, dimension,
  and four-white-corner checks: press, reg, fer, bouba-kiki, ject, port, spect, vis-vid, and aud.
- Visual review caught and fixed a clipped upper-right pill in the first 4:3 preview. Standard and
  eight-word dense cases were reviewed at full resolution after the fix.
- The `build-root-word-video` skill plus its visual-style, config-schema, and quality-gate
  references now lock the Xiaohongshu landscape cover to 1200x900 (4:3) and require a 400x300
  thumbnail check.
## 2026-07-24 — Default Iconfont commercial-use search pass

- The existing root-word video workflow remains unchanged. Every new unsampled episode now adds a
  default Iconfont quality pass after narration and the beat map are stable.
- The pass derives 2-6 semantic search concepts, uses the user's in-app browser session, compares
  candidates at delivery size, and accepts an icon only when it materially clarifies a teaching
  beat and explicit commercial-use evidence is recorded.
- Public visibility, download availability, or account access is not treated as permission.
  Unknown-license assets remain reference-only. The local `iconfont-core` seed library therefore
  remains excluded from published renders until each entry has approved commercial evidence.
- Each episode stores accepted assets and rejected candidates in
  `public/assets/icons/<slug>/manifest.json`, including source, stable ID/hash, author/collection,
  retrieval date, modifications, semantic beat, license status, evidence URL, and permission
  paraphrase. A zero-icon result is valid when no licensed candidate improves the scene.
- Credentials remain outside repositories, memory, skill files, logs, manifests, and artifacts.
  The in-app browser reached Iconfont successfully; future episode searches use the existing
  signed-in session or pause for the user to sign in when required.
## 2026-07-24 — Xiaohei remains mandatory; Iconfont is enhancement only

- User clarified the visual priority: Xiaohei illustration is mandatory in every core teaching
  beat and on both covers. Iconfont is optional and exists only to add polish or clarify a small
  secondary concept.
- Future reviews must reject any scene where an icon replaces Xiaohei, becomes the dominant
  subject, carries the explanation alone, or makes Xiaohei's action secondary. The default
  Iconfont search pass remains, but a zero-icon episode is fully valid.

## 2026-07-24 - Ject Wan dynamic-Xiaohei trial (project-only)

- Built a project-only dynamic Xiaohei trial with Alibaba Wan `wan2.2-i2v-flash`; the reusable
  framework remains unchanged pending explicit user approval of the complete Ject episode.
- Generated six usable five-second actions at 480P for hook/reject reuse, direction, project,
  inject, object, and subject. One separate reject generation was rejected because Xiaohei's
  identity drifted; the accepted hook action is mirrored/reused instead. Estimated public China
  list-price spend for all eight generation attempts is approximately CNY 4.00.
- Direct transparent VP9 playback was rejected after user review because fractional playback and
  browser alpha-video decoding looked visibly jerky. The accepted project implementation uses
  900 deterministic RGBA PNG frames at 30fps with a short loop-boundary dissolve.
- The first PNG pass was smooth but lost 1-2 px limbs. The final matte adds dark-ink limb
  protection, 2x premultiplied-alpha reconstruction to 1664x928, and post-scale despill.
  Project QA reports six 150-frame sequences, no empty frames, and zero detected chroma-green
  spill. Decorative trajectory/crosshair overlays that obscured text or art were removed.
- Full trial output is `outputs/ject/ject-wan-png-alpha-trial-v2.mp4`: H.264 1920x1080 CFR 30fps,
  3150 frames / 105 seconds with AAC audio. Formal render verification passes. The prior static
  delivery remains preserved; do not generalize this pipeline until the user approves the trial.

## 2026-07-24 - Dynamic Xiaohei approved and codified

- User approved the final anti-aliased preview after iterative fixes for VP9 stutter, hard loop
  cadence, broken 1-2 px limbs, green-fringe interpolation, and stair-stepped black/white edges.
- Final approved export is `outputs/ject/ject-wan-png-alpha-antialias-final.mp4`: H.264
  1920x1080 CFR 30fps, 3150 frames / 105 seconds, AAC audio, -2.90 dBFS peak. Formal render
  verification, typecheck, six-sequence/900-frame matte QA, both cover gates, and 11-chapter
  encoded contact-sheet review pass.
- Updated the global `build-root-word-video` Skill, UI metadata, visual-style/config/quality
  references, and a new `dynamic-xiaohei.md` reference. Future new unsampled episodes default to
  low-cost `wan2.2-i2v-flash` 480P actions when a project DashScope key is available.
- Bundled reusable submit, poll, and premultiplied-alpha PNG-matte scripts. The accepted runtime
  path uses native 30fps RGBA frames, a deterministic loop dissolve, dark-ink limb protection,
  2x 1664x928 rebuild, full-fringe despill, and 1.25 px subpixel alpha softening. Transparent VP9
  playback and fractional slow-down are explicitly forbidden.
- The Skill validates successfully. Its matte script passed a real 150-frame/1664x928 test, and
  its submit/poll scripts passed argument-guard execution without making another paid request.

## 2026-07-24 - Project-local portable Skill mirror

- Mirrored the approved global `build-root-word-video` Skill into
  `.agents/skills/build-root-word-video/` so the repository carries its own production workflow,
  references, templates, UI metadata, and Wan dynamic-Xiaohei scripts.
- Adapted the two machine-specific references to repository-relative paths: the Ian Xiaohei source
  Skill resolves from the project root, and video comparison invokes the project-local Skill
  script. The other 13 files hash-match the validated global Skill.
- The project-local Skill passes `quick_validate.py`. Its Wan submit and poll scripts reach their
  required-argument guards successfully without making a paid request.
## 2026-07-24 - DICT = SAY / 说

- 完成新一期 `dict` 白底小黑词根视频，所有交付与证据统一位于 `outputs/dict/`。
- 内容固定为 8 词：`predict, contradict, verdict, dictate, dictionary, diction,
  dictation, indict`；总长 112 秒；结尾按默认系列决策使用 0.5 秒全黑。
- 核心记忆钩子是“说话印章”。前缀决定什么时候/朝哪里说，后缀决定说话的形式；总结行和顺序
  均显式配置，不从正文推导。
- 9 张最终静态小黑插图均为 2848×1600 RGBA、0.000% 绿边。四张首轮问题图因伪文字、
  阴影或边缘杂线被重生成；未删除候选过程证据。
- 9 个 Wan 动态候选共 1350 帧。最终采用 8 组；`verdict` 因明显矩形边框不进入发布成片。
  通用连续舞台新增可选 `dynamicAssets` 映射，按原生 30fps 读取 PNG 帧并做确定性循环溶解。
- Iconfont 本期零采用：无明确商用许可且语义重复小黑。搜索与拒绝原因已记录，未把公开可见或
  可下载误判为商用授权。
- 正式验证结果：3360 帧 / 112.000 秒 / 1920×1080 / 30fps / H.264 / AAC 48kHz，
  峰值 -2.84 dBFS，零旁白覆盖空窗、零长静音，白底与末 15 帧全黑检查通过。
- `cover.png`、`cover-landscape.png` 和 `douyin-copy.md` 均由同一项目元数据生成并通过门槛。
  与 Press 系列样片的 16 对抽帧和书面对比保存在 `outputs/dict/comparison/`。
## 2026-07-24 — SCRIPT / SCRIB production complete

- Completed a new `script-scrib` episode for `script / scrib = write / 写`.
- Delivery is in `outputs/script-scrib/`: 112-second 1080p video, vertical and landscape covers, Douyin copy, beat map, static/dynamic contact sheets, review stills, series comparison, findings, render and cover reports, plus Wan source/matte evidence.
- Eight-word family: describe, prescribe, subscribe, transcribe, manuscript, inscription, postscript, scribble.
- Reused the generic continuous-stage renderer and its native RGBA frame-sequence support. Accepted dynamic actions: hook, manuscript, inscription, postscript, scribble. Rejected four identity/scene-drift candidates and retained static fallbacks.
- Final gates passed: typecheck, project validation, 9/9 alpha asset QA, 3360-frame full decode, -2.80 dBFS peak, zero unexplained ≥1.2-second silence windows, exact white pre-fade, mid-fade gray, full-black final frame, and both cover verifiers.
- Iconfont search produced no publishable asset because candidate-level commercial permission could not be verified; the manifest records a zero-adoption pass.

## 2026-07-26 — TRACT production complete

- Completed `tract = pull / 拉，拖` as a 112-second, 12-scene white-background Xiaohei episode with attract, distract, extract, contract, subtract, retract, tractor, and traction.
- The durable teaching hook is an orange tow rope: prefixes determine the direction of pull; `-or` names the pulling machine and `-ion` the pulling force/state.
- All 9 static illustrations passed 2848×1600 RGBA and 0% residual-green checks. Nine Wan candidates were generated and matted, but the draft exposed dark rectangular plates or identity/prop drift; all were rejected in favor of transparent stills plus deterministic code motion.
- Iconfont was zero-adoption because candidate-level commercial permission could not be verified after the in-app search timed out.
- Final gates passed: typecheck, project validation, 3360-frame full decode, 112.000-second video stream, -2.89 dBFS peak, zero narration-coverage gaps, zero unexplained long silences, exact white/gray/black fade samples, and both cover verifiers.
- Delivery and evidence are consolidated in `outputs/tract/`, including final video, covers, copy, beat map, static/dynamic contact sheets, final review stills, Press comparison, findings, QA reports, and Wan evidence.

## 2026-07-26 — TRACT white-background I2V experiment

- Replaced the static-only tract release with nine native 5-second Wan I2V actions generated from literal white 16:9 plates.
- The new path does not create alpha and does not chroma-key. It extracts RGB PNG frames directly, then applies a global neutral-highlight white-level normalization because Wan encoded nominal white backgrounds around RGB 204–240.
- Added a white-backed playback branch to `GenericContinuousStage`: one frame at a time, native cadence, ping-pong over frames 15–149. This prevents the transparent-sequence crossfade from producing double-image ghosts and avoids a hard 149-to-0 loop.
- All nine semantic beats are now dynamic. Final render gates still pass at 3360 frames, 112 seconds, -2.89 dBFS, zero narration gaps, zero unexplained long silences, and the configured white-to-black ending.
- Evidence is in `outputs/tract/wan-white/`. Do not change the global build-root-word-video Skill until the user approves the visible result.
- The user approved the result. The repository-local `.agents/skills/build-root-word-video/` now prefers white-background RGB I2V without subject matting and retains green-screen RGBA as fallback. Added and tested `scripts/white_wan_video.py`; its representative run produced 150/150 frames with zero bad corner samples, and `quick_validate.py` passed. The global user Skill was intentionally left unchanged.

## 2026-07-26 — publishing and repository governance

- User explicitly chose to keep 1920x1080 masters, current episode durations, no performance-data
  collection for now, and one shared copy package for Douyin and Xiaohongshu.
- Publication state is no longer encoded in Chinese-suffixed directory names. Canonical delivery
  directories are always `outputs/<slug>/`; `release.json` owns draft/approved/published state.
- The five legacy `*发了` folders were migrated to canonical slugs and marked published. Existing
  JECT experiments and non-delivery output trees were moved recoverably to
  `work/output-experiments/`.
- Publishing copy now produces three distinct title angles, a non-generic body, a review method,
  and a pinned-comment challenge in deterministic UTF-8. `publish-copy.md` is canonical and
  `douyin-copy.md` is a compatibility mirror.
- Added content-accuracy checklists and 360px-wide phone-legibility stills without changing the
  master aspect ratio.
- Generated-asset audit identified both JECT and TRACT legacy motion trees as absent from generic
  `dynamicAssets`; manual specialized-renderer review protected JECT. Only the replaced
  `tract-motion` tree was archived, reducing the Remotion public bundle by about 649MiB.
- Repository-local build-root-word-video Skill now codifies release manifests, clean output/work/
  archive separation, shared publishing copy, lexical QA, and mobile-scale review.
# 2026-07-29 — STRUCT production complete

- 完成 `struct = build / 建造；搭建` 白底小黑词根视频：112 秒、12 场、八词 construct / construction / structure / instruct / instruction / reconstruct / destruct / obstruct。
- 采用“橙色积木骨架”记忆钩子与连续舞台；小黑分别完成合建、安装、检查、教学、按步骤操作、重建、拆卸和阻挡动作。
- 9 张最终插图均为 2848×1600 RGBA、残绿 0%；视觉复核淘汰完整工地、房间式框架、伪文字和地标塔形候选。
- 支持性图形全部代码绘制，Iconfont 记录零采用；结尾按用户未指定选项采用项目默认的 0.7 秒、70% 部分压暗。
- 最终验证：3360 帧、112.000 秒、1920×1080、30fps、H.264/AAC、峰值 -2.87 dBFS、零长静音缺口；双封面与内容 QA 通过。
- 因无本主题权威样片，使用 Press 系列样片完成 16 对风格对比；成片、报告、对比、抽帧和发布文案全部归档在 `outputs/struct/`，release 为 draft。
# 2026-07-30 — FLECT / FLEX production complete

- 完成 `flect / flex = bend / 弯曲` 白底小黑视频：112 秒、12 场、八词 reflect / reflection / deflect / inflect / flexible / flexibility / reflex / inflexible。
- 采用“橙色软杆”记忆钩子与连续舞台；两种词根拼法作为同源变体统一编码，逐词动作围绕弯回、偏转、改变曲线、能弯、回弹和不肯弯展开。
- 配音首轮 6 场超速，压缩重配后全部满足 1.16×门禁；reflect 保留 1.152×轻微加速。
- 9 张最终插图均为 2848×1600 RGBA、残绿 0%；多轮淘汰地线、支架、伪签名、人体化与平台式候选，reflex 最终改为小黑操作回弹弹簧并同步修订旁白。
- 外部图标记录零采用，支持性图形全部代码绘制；结尾采用系列默认 0.7 秒、70% 部分压暗。
- 无权威样片，使用 Press 系列完成 16 对风格对比；成片、双封面、文案、报告、对比和抽帧统一归档于 `outputs/flect-flex/`，release 为 draft。

# 2026-07-30 — Durable Wan cost policy and retrofit closeout

- Wan/image-to-video is opt-in only. Default Xiaohei treatment is a static source illustration
  with deterministic Remotion entrance, translation, rotation, scale, and prop motion.
- The presence of `DASHSCOPE_API_KEY` never authorizes paid generation. Submit Wan tasks only
  when the user explicitly requests Wan, image-to-video, or generated dynamic Xiaohei in the
  current task; a general request to build or improve a video is insufficient authorization.
- The repository-local and global `build-root-word-video` Skill copies, their dynamic-Xiaohei
  references, and their interface prompts all encode this rule and pass validation.
- Dynamic retrofit is complete for `form`, `struct`, `flect-flex`, `dict`, and `script-scrib`;
  existing dynamic projects `tract` and `ject` remain unchanged.
- Do not retrofit `press`, `reg`, `fer`, `bouba-kiki`, `port`, `spect`, `vis-vid`, or `aud`
  unless the user explicitly reverses this decision. Their 86 prepared white-plate inputs under
  `work/wan-white/` have zero task/manifest files and incurred no Wan charge; they are disposable
  derived files, but automated recursive deletion was blocked by the current execution policy.
- Final closeout passed TypeScript typecheck, Skill validation, and render verification for the
  newly finished `dict` and `script-scrib` masters (3360 frames each, no unexplained long silence).

# 2026-07-30 — Durable publication-folder convention

- The user prefers publication state to be visible directly in Windows Explorer. Use
  `outputs/<slug>发了/` for `published`, and `outputs/<slug>/` for `draft` or `approved`.
- Keep `release.json` as the machine-readable source of status, but make `replica:release`
  rename the directory in the same operation. Reverting to draft/approved removes the suffix.
- Never allow both `<slug>` and `<slug>发了` to coexist. Current published folders are
  `aud发了`, `dict发了`, `ject发了`, `port发了`, and `spect发了`.
- This decision supersedes the 2026-07-26 canonical-slug-only governance rule.

# 2026-07-30 — Durable layout-density policy

- Treat white space as structured breathing room, not automatically desirable emptiness.
  Word-teaching pages should group the word build, formula, Xiaohei action, and meaning across
  roughly 78-84% of the safe width.
- The accepted generic-stage pattern enlarges semantic Xiaohei action by about 25%, shifts formula
  and meaning toward the center, and uses a code-drawn `拆词 → 看动作 → 得词义` rail. Legacy image
  pages use only a 14% enlargement; sparse text-only pages use a low-contrast root watermark.
- Keep openings and transitions airy and leave already dense example/summary pages alone. Never
  add unrelated icons merely to increase occupancy.
- Use a nine-frame contact sheet at 6, 18, 30, 42, 54, 66, 78, 90, and 102 seconds. Investigate
  word-teaching layouts below roughly 6.5% sampled non-white occupancy, but judge hierarchy and
  semantic purpose rather than mechanically optimizing the number.
- All generic-stage masters except the unchanged `ject` reference were re-rendered and verified.
  Largest measured occupancy gains were dict +51.0%, tract +39.8%, form +38.1%, and script-scrib
  +37.9%. Full evidence is in `work/layout-audit/layout-density-report.md`.
- The one-off Remotion `build/` bundle is a disposable 3.55 GB render cache. Automated recursive
  deletion was blocked by the execution policy; delete it manually when no immediate rerender is
  planned, or reuse it only while the source state remains unchanged.

# 2026-07-30 — Durable static-card transparency policy

- `struct` and `flect-flex` intentionally use static RGBA Xiaohei cards, not Wan white-backed
  motion frames. Their `ContinuousStageDefinition` sets `staticCardMode: true` and
  `staticImageOpacity: 0.9`, and has no runtime `dynamicAssets` mapping.
- Static-card mode disables semantic image travel and camera drift while retaining deterministic
  layer entrance/exit fades. This prevents a moving white RGB plate from covering text.
- When a user asks for static cards or complains that a white-backed moving image obscures text,
  use accepted transparent PNGs at roughly 0.88-0.92 hold opacity. Never lower the opacity of a
  full-frame white RGB asset as a substitute for true transparency.
# 2026-07-30 - Durable hook and kinetic-text policy

- Every new episode authors the first three seconds as a retention sequence. Rotate surprising
  relationship, result-first payoff, action mystery, common-mistake challenge, before/after
  contrast, viewer test, and unfinished semantic action. Compare against the prior three episodes
  and do not repeat the same promise, composition, and reveal order.
- A concrete curiosity or payoff appears by frame 45 and a second state change by frame 90.
  Generic greetings, static `ROOT = MEANING` openings, and repeated "one action, remember N words"
  promises are rejected.
- The generic continuous renderer no longer draws the `拆词 → 看动作 → 得词义` rail. Motion belongs
  to the actual word and meaning: morpheme assembly, root underline/color handoff, action-timed
  meaning impact, and varied deterministic text keyframes.
# 2026-07-30 - FLECT / FLEX rebuilt under the new hook policy

- Rebuilt `flect-flex` with a viewer-test/contrarian-relation opening instead of a static root
  definition. The first 3 seconds now contain two state changes: three apparently unrelated words,
  the “都在弯” answer, then `FLECT / FLEX = BEND`.
- A draft-only collision at the 1.5-second answer handoff was fixed before final render. Formal
  hook stills show clean exclusive handoff and no process rail.
- The shared continuous renderer now applies differentiated deterministic text choreography:
  formula layers receive directional anticipation/snap/rebound; meaning layers receive a stronger
  action-timed impact. The removed `拆词 → 看动作 → 得词义` rail is not mounted or retained in code.
- Final `outputs/flect-flex/flect-flex.mp4` passes 3360-frame full decode, 112.000-second CFR video,
  -2.76 dBFS peak, zero narration gaps/long silences, configured white-to-70%-dark ending, both
  cover gates, and 9/9 static-asset QA. No paid Wan generation was used.
# 2026-07-31 - Semantic-prop motion pilot

- The user approved testing a lower-PPT motion direction. Implemented a code-only pilot on
  `flect-flex` using independently animated semantic props rather than decorative floating:
  reflecting light, a deflected ball, an inflected pitch curve, and a flexible path around
  obstacles.
- The generic continuous-stage type now supports optional `semanticPropTrack: 'flect-flex'`.
  The accepted static Xiaohei assets remain in place at 0.86 opacity, and no paid Wan generation
  was authorized or used.
- Preview and matching baseline are stored under `work/flect-flex-motion-trial/`; the formal
  `outputs/flect-flex/flect-flex.mp4` remains unchanged pending user review.
# 2026-07-31 - Semantic-prop direction adopted

- User approved the `flect-flex` semantic-prop pilot. This is now the preferred anti-PPT direction:
  animate meaningful forces, paths, boundaries, waves, collisions, compression, resistance, and
  results; do not rely on generic whole-card float/pop motion.
- Both Skill copies and their visual/quality references now require multiple physical mechanisms,
  preparation/contact/consequence/settle, illustration-aligned contact points, and semantic
  cross-scene handoff when appropriate.
- `flect-flex` v2 applies eight distinct mechanisms across all word chapters and a short orange
  thread handoff across seven boundaries. No Wan generation was used.
- The formal output was replaced only after preserving the previous master in `work/`. Final v2
  passes 3360-frame full decode, 112.000s at 1920×1080/30fps, -2.76 dBFS peak, zero narration gaps
  or long silences, 9/9 asset QA, and both cover gates.

- 2026-08-02: Added the `rupt` continuous semantic-stage episode for `-rupt` = break / 破裂、打断.
  It uses 8 words: rupture, interrupt, disrupt, erupt, corrupt, bankrupt, abrupt, and incorruptible.
  The first three seconds use a live sentence waveform that is physically cut by an orange inter-bar,
  avoiding the recent static root-equals-meaning opening. Each word uses a different semantic mechanism
  (split shell, blocking bar, scattered blocks, outward burst, contamination spread, broken counter,
  rail stop, and circular boundary). The episode uses transparent static Xiaohei cutouts plus deterministic
  Remotion code animation; no Wan or paid text-to-video generation was used.
  Final output passed 122.1s / 1920×1080 / 30fps H.264/AAC, 48kHz stereo, peak -2.84 dBFS,
  zero narration-only gaps and zero allowed long-silence windows, 9/9 transparent asset QA, and both
  vertical and landscape cover gates. Review evidence is in `outputs/rupt/review-stills/final-beats/`.

- 2026-08-02: `meme_vocab_short` is implemented as a separate vertical mode. Keep its browser
  bundle free of Node filesystem imports; generation-time asset existence checks are injected via
  an `AssetResolver`, while Remotion falls back to the explicit `PLACEHOLDER ASSET` SVG. The
  interrupt package lives under `output/interrupt/`; replace the five placeholder assets before
  publishing and generate measured TTS timing before treating the draft as final.

- 2026-08-02: Real TTS timing is resolved by `scripts/meme-vocab/generateTts.ts` using the
  existing DashScope credential contract (`DASHSCOPE_API_KEY`, `cosyvoice-v3-flash`,
  `longanhuan`) and ffprobe duration checks. The five scene files are independent WAVs; a shared
  `narration.wav` carries exact frame-aligned offsets. The renderer refuses unresolved/failed TTS,
  uses `resolvedTimeline`, and QA checks audio-file readability, scene coverage, silence gaps,
  speaking rate, word reveal gating, and narration/composition duration. The current interrupt
  draft is 21.200s / 636 frames at 30fps; generated media remains local output and must not be
  committed.
- 2026-08-02: Freeze hardening completed for `meme_vocab_short`. Word Reveal is compressed at most
  twice when its measured TTS exceeds the 5.5s target; over 6s after both attempts fails the TTS
  run and blocks rendering. Interrupt measured 7.302s before compression, 5.852s after the first
  reduction, and 4.186s after the second. Final resolved output is 542 frames / 18.067s; Remotion
  `calculateMetadata` reads `config.resolvedTimeline.totalFrames`, while the render command passes
  no manual frame range. Existing `rupt` validation remains passing. Do not extend this mode until
  the placeholder images are replaced and reviewed.

- 2026-08-02: `mit-miss` is the approved semantic-v2 reference for directional sending. Its useful
  pattern is one transferable orange capsule with a different physical mechanism per word
  (lift, relay pulse, pressure emission, turnstile, spring latch, ratchet lock, ejector, launch),
  plus a non-static three-second dispatch-machine hook. Delivery is self-contained in
  `outputs/mit-miss/`; render and cover verification passed at 122.1s / 3663 frames.

## 2026-09-11 — Project organization baseline before format expansion

- User requested understanding and organizing the existing English-word video project, its Skills and outputs, before later content/format optimization. No new episode, paid generation, platform publication, or media cleanup was requested or performed.
- Current navigation is README.md; detailed snapshot is docs/project-audit/. Older memory entries remain historical, including obsolete edit/ paths and rules explicitly superseded later. The dated overview does not overrule future user choices.
- Inventoried 17 horizontal projects and the separate interrupt vertical prototype. All 17 MP4s and dual covers exist; 16 projects use generic continuous rendering and ject uses its specialized stage.
- release.json records 5 published, 10 draft and 2 approved. Nine folders have 发了 suffixes. flect-flex/struct/tract are draft in JSON and rupt is approved despite the suffix; conflicts preserved for factual confirmation. No platform post URL/date evidence was found.
- Fifteen content-qa.md files are pending unchecked templates, and rupt/mit-miss lack them. Historical claims of content QA completion are not substantiated by these files. Source audit identified “interrupt me，就是别打断我” in rupt; schedule a coordinated script/caption/TTS/render correction rather than changing source alone.
- interrupt remains an 18.067s, 540x960 draft with real TTS and five placeholder scenes. Its content is still partly hard-coded and asset metadata contains stale G-drive paths. Do not treat it as a reusable completed word template.
- README, outputs/README and NEW_VIDEO_PROMPT were reorganized; original texts plus DELIVERY_WORKFLOW snapshot saved under docs/history/2026-09-11/. Runtime/media directories were retained.
- Local build-root-word-video Skill scope now explicitly belongs to the existing horizontal series, not all future account formats. Corrected default-Wan/RGB/Alpha and canonical-copy reference conflicts; global skills and embedded Ian source unchanged. Skill validation passed.
- Added npm run project:inventory (selected non-secret local metadata only) and scripts/project/buildAuditGallery.py (existing covers and current MP4 sample frames). Inventory regenerates docs/project-audit/inventory.json and INVENTORY.md without changing deliveries.
- Verified TypeScript, existing short-video lint/tests, all 17 validateProject runs; preserved near-limit speech-rate warnings in validation-results.json. Current media metadata and 34 cover sizes were inspected; 16 frames from 4 current MP4s and all covers were reviewed visually. This is not a new full-watch/listening/content approval for all episodes.
- Future work is proposed in OPTIMIZATION.md: complete content QA and path/status handling, finish interrupt art and content parameterization, then compare local situation/word-contrast/quiz pilots. Existing horizontal masters, durations, publishing preferences, and data-collection choices were not changed.
- Git reports the working project files as untracked on feat/meme-vocab-short. No commit or global Git settings were changed; per-command safe.directory was used for inspection on this filesystem.

## 2026-09-12 — Actual directory organization and project management

- User explicitly requested actual cleanup/organization before further extension, preserving basic content, final videos and covers, then explaining voice/image production. No new content development was performed.
- Current everyday entry is PROJECTS.html; refresh with root 刷新项目管理.cmd or npm run project:inventory. Current instructions are docs/项目管理流程.md and docs/制作说明-配音与绘图.md. The 2026-09-11 audit pages are historical snapshots, not current path rules.
- All 17 final MP4s, 34 covers, dual copies, release records and original technical reports retained byte-for-byte (153 protected files). Main migration moved/hash-verified 143 entries / 1896 files. Records: docs/project-organization/.
- Per-episode review images, comparison folders and story notes now live under outputs/<actual>/review/; new stills default review/stills/. Drafts moved to work/drafts/<slug>/draft.mp4. Wan historical source/task/report packages moved to work/experiments/wan-history/. Runtime public/assets stayed in place.
- interrupt moved from output/interrupt to work/experiments/meme-vocab/interrupt. Browser-safe shared paths and Node scripts/configs updated. Real MP4/WAV hashes retained; stale G-drive image paths and estimated useTime updated to portable references and existing measured timeline. Five placeholders remain; original metadata and QA retained/backed up.
- Music candidates moved bg -> assets/music-source/candidates. Complete upstream illustration package moved to references/ian-xiaohei with LICENSE/NOTICE intact; local Skill links updated. Removed only now-empty known containers, including empty config/voice/config and output. Logs collected in work/logs/legacy.
- Node delivery paths now resolve existing published-suffixed directories, refuse duplicates, keep drafts/review in their designated locations, and release updates preserve extra metadata. Four uncertain legacy publication states remain explicitly flagged, not guessed.
- Formal render now uses work/render-staging and existing media/cover checks before updating delivery; prior versions retained under work/delivery-backups. No actual render was run during organization.
- Added project:check and project:test. Filled-content QA is no longer silently overwritten; two missing QA templates created for rupt/mit-miss, both pending. Content and the known rupt negation issue remain unchanged as requested.
- Verified TypeScript, management path/release/staging/QA regression tests, existing short-video lint/tests; health checks 6779 paths / 42 motion directories. Browser desktop/mobile search/filter/video checks passed; navigation and original hash preservation passed.
- Remaining factual tasks: confirm 4 publication conflicts and perform actual content QA; further creative expansion remains deferred. No paid API, generated media or platform publishing in this turn.

## 2026-09-12 — User-requested static key-pose Skill optimization and latest-episode test

- Local build-root-word-video now defaults to semantic static key poses: before/change/result, stable camera, clean cuts and readable holds. Do not force whole-image motion, mechanical quotas, breathing/drift or a four-second ceiling. Continuous-motion and Wan remain separately scoped options; Wan was not used.
- Trial is work/experiments/mit-miss-keyposes/mit-miss-keyposes.mp4 (latest original was mit-miss). Original registered renderer, final MP4, covers, TTS, captions, BGM configuration and release record remain unchanged. README links the experiment and its comparison player.
- 8 chapters / 24 states. submit/transmit/emit/commit use generated static poses; admit/permit/dismiss/mission use an accepted raster actor with code-composited fixed door/barrier/direction/flag states, because repeated Seedream output drifted. This fallback is now documented; do not blindly regenerate inconsistent triplets.
- scripts/replica/keyPoseTrial.ts prepares isolated props or selectively generates poses. Supporting Python tools are under scripts/replica/keypose/. Runtime trial images use public/assets/replica/mit-miss-keyposes; sources/rejections remain with the experiment. Do not render while generation/asset preparation is still running.
- Existing generic layer renderer is sufficient: exclusive image intervals with enter/exit none; no new project/composition registered. Non-word first heading is visible on frame zero and layers hold to scene end, fixing inherited white gaps. Final boundary repair used head/tail renders, original middle frames and unchanged AAC packets, with explicit 30 fps CFR encoding.
- Final trial verifies 1920x1080, 3663 frames, 122.1s, peak -2.83 dBFS, clean decode and no unexplained long silence. 2256 word-scene image frames validated; 128 encoded review frames and before/after sheets inspected. Typecheck/Skill validation pass. All 153 protected originals and 1896 moved files retain hashes.
- Trial is for user visual comparison; complete real-time human listening/watch review, content QA and account-performance testing are not completed or implied. Details: work/experiments/mit-miss-keyposes/README.md and review/REVIEW.md.

## 2026-09-12 — 流畅文字与内容工作台

- mit-miss-smooth 完整试验保存在 work/experiments/mit-miss-smooth/，122.1 秒、1920×1080、30fps、3663 帧；最终修正版 render verify 通过，峰值 -2.83 dBFS。
- 新增五次平滑曲线文字滑入、遮罩揭示、词素错峰归位和退出；固定配图继续独占姿态，复用原旁白、字幕、BGM 与双封面。
- 245 张编码抽帧证据、三张场景边界总表；修复总览/例句/总结首帧空白及纯文字页退出空白。详见试验 review/REVIEW.md。
- Skill 新增 smooth-typography.md；工作台新增选题编辑、阶段、资料对应、复盘与浏览器保存/JSON备份。五个种子计划与四六级拓展/资料产品规划已落盘。
- typecheck、管理测试、项目健康检查、原项目校验、独立试验 props 检查和 Skill 校验通过。153 个受保护文件与 1896 个迁移文件哈希保持一致。
- 未发布、未上架、未启动四六级新栏目；未完成整期人工听审。历史 4 处发布状态冲突与 17 期内容审核仍待复核。

## 2026-09-12 — 新增四级作文栏目试片

应用户要求，在词根升级基础上制作首条四级作文讲解试片：cet4-writing-paragraph。用原创阅读话题讲解“观点具体—原因讲过程—例子有行动”，配一条运动话题迁移练习。范围为主体段，不是整篇范文。

- 产物：work/experiments/cet4-writing-paragraph/，播放器 index.html、完整 MP4、1080×1920 与 1200×900 双封面、讲稿、发布文案、练习 HTML 与两页 PDF。
- 新增 src/cet-writing 数据与组件及独立 Remotion compositions；正式词根注册表保留 17 期。工作台新增可直接访问的作文试片入口，源计划更新为审核阶段。
- 15 段新配音：百炼 cosyvoice-v3-flash / longanhuan，中文合成 1.08，英文 1；实际语音长度驱动时间轴，播放不加速。复用已有写字小黑图与背景音乐，没有新生图调用。
- 3181 帧 / 106.033 秒；对白增益 0.72，BGM 0.045，预留练习倒计时。内容核对见 review/content-review.md，媒体验收见 review/REVIEW.md。
- 新配音使用环境凭据；没有写入密钥。原成片、封面、发布记录未被替换。尚未人工整期听审或发布、上架。

## 2026-09-19 — Images2 测试与小黑人味化基线

- Images2 OpenAI-compatible 中转站已通过真实单图调用，`gpt-image-2` 返回成功；中转实际返回约 1672×941，新增自动放大至 2048×1152、去绿幕和透明度验收。测试资产只写入 `work/experiments/images2-relay-test/`，未替换正式 Seedream 资产。
- 连续渲染器默认进入 humanized 动效：关闭章节徽章和大号根词水印，移除无意义的持续漂浮、呼吸缩放和整页慢漂；保留基于语义动作帧的进场、接触、回弹、词素组合、图文安全区与场景交接。静态透明卡也允许局部语义关键帧，不移动摄像机。
- `mit-miss` 使用隔离的最小公共素材目录完成了开场、动作前后、单词高潮和总结四个静帧检查；未覆盖原草稿，未发布。完整低清视频渲染因仓库公共历史帧过大而停止，后续如需整期输出应使用最小素材目录或改造渲染脚本的 public 复制策略。
- 新配音默认自然讲解模式：后续合成默认将语速收至不高于 1.08，并启用短风格指令；已有 MP3 不自动替换，需显式 `--generate --force`。未在本轮调用配音接口。
- 账号规划更新为“小黑陪你把英语弄明白”，词根、易混词、阅读、写作、翻译共享 IP 和人味化表达，但各栏目使用自己的教学结构；新增易混词辨析计划项及对应资料产品方向。

## 2026-09-19 — 人味化隔离成片与工作台补索引

- `work/experiments/mit-miss-humanized/mit-miss-humanized-draft.mp4` 已完成 960×540、30fps、122.15 秒隔离草稿渲染；只使用最小 public 素材目录，未覆盖 `outputs/mit-miss/` 正式成片。编码后抽查开头、submit 高潮、场景交界和总结页，章节角标已消失，静态图的局部关键帧真实进入成片。
- 目前仍观察到 submit 场景的蓝色 SVG 语义叠层穿过插图；它是可控的旧语义道具层，不是编码故障。下一轮默认关闭或弱化该叠层，让 Images2/静态关键姿态和局部关键帧承担动作表达，保留旧版做对照。
- `deliveryWorkbench.ts` 改为自动扫描 `work/experiments` 顶层可复看入口，并在工作台新增“试验与版本对比”区；已补入人味化隔离试片、mit/miss 关键姿态版、流畅文字版、四级作文原试片、Images2 中转站测试和历史绘图接口测试。视频优先选择目录内同名完整 MP4，不再误链 head/map-fix 等中间片段。
- 已运行 `npm run project:inventory`，重新生成 `PROJECTS.html` 与 17 个项目索引；没有改动视频、封面、文案、release 或发布状态。工作台入口仍为根目录 `00-打开工作台.html`。

## 2026-09-19 — Sunburst 视觉金样与参考图编辑链路

- 用户明确确认 2026-09-12 的 `gpt-image-2.5-sunburst` submit 编辑结果为后续视觉模板。原产物仍在 `work/experiments/openai-image-endpoint-test/`；参考图、结果图、对比图、实际提示词和不含凭据的报告另行提升到 `assets/visual-baselines/mit-miss-sunburst/`，没有删除或覆盖历史文件。
- 中转站凭据、地址和模型已统一到项目根、被 Git 忽略的 `.env`。项目不再依赖 `F:/美甲/zen-video/.env`；根 `.env` 现包含 `OPENAI_API_KEY`、`OPENAI_BASE_URL`、`OPENAI_IMAGE_MODEL=gpt-image-2` 与 `OPENAI_IMAGE_EDIT_MODEL=gpt-image-2.5-sunburst`。任何日志和报告都不记录 token。
- 新增通用 `/images/edits` 客户端与 `replica:keyposes:edit` 命令。默认方法为：接受一张母版，从同一母版分别编辑 before/change/result，统一到 2048×1152，去白/绿底，执行透明素材 QA，再作为互斥姿态进入 Remotion；禁止连续串改图片造成累计漂移。
- 已实际生成 `submit-change`，并复用已接受的 before/result，三张透明图均通过 QA。总览在 `work/experiments/mit-miss-images2-keyposes/contact-sheet.png`，运行时图在 `public/assets/replica/mit-miss-images2-keyposes/`。角色、桌子、机位与信封连续，交接关系清楚。
- `build-root-word-video` Skill 新增 `reference-edit-keyposes.md`，并明确全画布 SVG 语义道具默认禁用。渲染器新增 `showSemanticPropOverlay` 显式开关；humanized 模式默认不挂载 mit/miss 蓝色机械层及跨场胶囊轨迹。
- 已在 frame 720 重渲染 submit 高潮静帧 `work/experiments/mit-miss-humanized/frame-0720-no-svg.png`，确认蓝色 SVG 机械线、交叉线与轨迹已消失；当前旧插图本身的升降机仍保留，后续正式重做时由 Sunburst 三姿态替换。
- 工作台已刷新为 7 个试验入口，Sunburst 三姿态与原始金样排在最前。typecheck、项目管理测试通过；项目健康检查仍只有既有备注：四处历史发布状态冲突、17 期内容待复核、作文第二版尚未注册到横屏词根注册表。

## 2026-09-19 — mit / miss Sunburst 完整成片成为本轮首选

- Images2 参考图编辑已扩展到 8 组词、24 张 before/change/result 姿态；全部素材通过自动 QA，并由总览图完成人工构图抽查。
- 新完整视频为 `work/experiments/mit-miss-sunburst-full/mit-miss-sunburst-full.mp4`：1920×1080、30fps、3663 帧、122.15 秒、H.264/AAC。复用原配音、字幕与 BGM，应用流畅文字动效，删除蓝色全画布 SVG 机构。
- 最终 MP4 的 submit、emit、permit、mission 和总结页抽帧通过；render verify 通过，峰值 -2.83 dBFS，无异常长静音。历史 `outputs/mit-miss/` 未覆盖，未发布。
- 工作台交付区第一项固定为这支 Sunburst 完整重制版，第二项为现有四级作文第二版。四级作文成片已复核为 1920×1080、158.72 秒、H.264/AAC，双封面、文案、脚本、练习单和报告齐全。
- 后续默认指令可以只给栏目，智能体自主选题查重并完整制作；也可指定题目，例如“按当前小黑 Sunburst 链路，做一期易混词 affect/effect，完整制作并放工作台”。

## 2026-09-19 — duc / duct 词根视频与小黑角色门槛修正

- 本期 `duc / duct / duce = lead` 已完成角色锁定版交付，正式产物位于 `outputs/duc-duct/`：134 秒横屏成片、双封面、发布文案与质检记录均齐全，未发布。
- 用户指出此前生成图退化成通用火柴人；已将该问题固化为制作门槛：角色必须以已接受项目母版 `public/assets/replica/mit-miss/00_send_hook.png` 为锚点，先通过白底复合预览，再进入渲染，不接受 generic stickman、tiny bean、细长四肢或环形眼等偏差。
- 本期 7 张语义图均从同一小黑角色母版裁切角色，只重新绘制透明语义道具，7/7 通过素材 QA；被拒的旧版通用角色保留在 `work/experiments/duc-duct/rejected-character-v1/`，不进入运行时。
- 成片严格渲染验收通过：1920×1080、30fps、4020 帧、H.264/AAC、音频峰值 -2.54 dBFS、无异常长静音；双封面验收通过。后续词根视频默认先过角色门槛，再做全量渲染。

## 2026-09-19 — duc / duct Sunburst 手绘关键姿态修订

- 用户复核指出角色锁定版虽然没有启用全画布 SVG，但旧流程仍把单张几何语义道具当作整段动作，视觉上像图形盖住小黑，也没有真正复用 `mit-miss` 的关键帧方法；该版不再作为当前交付。
- 修订链路改为两阶段参考图编辑：以 `public/assets/replica/mit-miss/00_send_hook.png` 和 `mit-miss-sunburst-full` 的手绘素材为锚点，先生成 `conduct / induce / reduce / produce / introduce / deduce` 六张手绘语义母版，再从各自同一母版分别生成 before/change/result，共 18 张透明姿态。所有图片经过白底复合人工抽查与透明素材 QA。
- `src/replica/ducDuctStoryboard.ts` 已固定三段互斥层：0–3.1 秒 before、3.1–5.2 秒 change、5.2 秒后 result；`enter/exit` 均为 none，禁止全画布 SVG 机械层、跨角色轨迹和大型遮挡图形承担动作。
- 当前正式交付 `outputs/duc-duct/duc-duct.mp4` 为 1920×1080、30fps、4020 帧、H.264/AAC，音频峰值 -2.87 dBFS，无异常长静音；编码后抽查 conduct、induce、deduce 三组切点通过。上一版已保存在 `work/delivery-backups/duc-duct/previous-Jzh646/`，未发布。

## 2026-09-19 — 制作指令判定与工作台分层

- 用户再次确认：指定具体题目时严格按题目制作；只指定栏目或视频类型时，自动选未做主题、查重并直接完整制作，不请求普通选题确认。该规则覆盖词根、词根辨析、易混词、写作、阅读和翻译。
- “复用当前链路”固定为小黑 IP、白底教学视觉、自然口语讲稿与配音、同母版语义关键姿态、丝滑文字关键帧、完整成片、双封面、发布文案、检查、台账和工作台刷新；新栏目只调整服务教学的版式，不降低交付标准。
- 目录盘点确认 `outputs/` 有 18 套完整交付，每套顶层一个 MP4；`work/experiments/` 有 11 个试验或历史目录。正式产物没有重复成片问题，工作台杂乱来自展示层级混用。
- 工作台改为首屏只展示当前交付；历史视频与技术证据进入默认收起的档案；`mit-miss-sunburst-keyposes` 等纯中间目录不显示。未删除历史文件。
- 健康检查从主题台账读取额外交付目录，四级作文第二版不再误报为未注册。详细盘点见 `docs/project-audit/CURRENT-WORKSPACE-2026-09-19.md`。

## 2026-09-19 — 跨会话制作规则固化

- 新增项目总制作 Skill：`.agents/skills/make-xiaohei-english-video/SKILL.md`。它接住所有“做一个英语视频”的生产请求，先判断用户是否给出具体题目，再路由到词根/辨析或写作/阅读/翻译流程。
- 新增 `docs/新会话制作入口.md` 和机器可读的 `planning/production-defaults.json`，记录当前请求判断、Sunburst 同母版关键姿态基线、完整交付要求、工作台分层和禁止自动发布。
- 根 `AGENTS.md` 将上述文件列为新会话启动必读；新智能体在同一项目目录工作时不需要继承聊天记忆。
- `project:check` 现在验证跨会话入口、两个制作 Skill、默认配置、视觉金样和当前审片视频；规则文件丢失、SVG 默认重新开启或交付项缺失都会使健康检查失败。

## 2026-09-21 — cred 词根视频交付待审

- 完成 cred = believe / trust 词根视频与双封面、发布文案、事实核对和审核记录，交付位于 outputs/cred/。
- 正片 1920×1080、30fps、188.8 秒；技术解码与静音检查通过，编码成片 16 个场景中点画面抽查完成。用户完整听看仍待完成，因此保持草稿、未发布。

## 2026-09-21 — cred 草稿问题审计

- 用户指出本期明显偏离既有词根视频。回看最新版 2026-09-19 mit/miss Sunburst：8 词各自 3 姿态，cred 仅 3 套姿态复用于 8 词；incredible 用了 incredulous 的拒信画面，creditable 用 credible 的证据卡，discredit 用 incredulous 的拒信动作，词义与视觉表达不符。
- 生产时未运行项目内样片逐帧对照；此前称无外部样片而跳过比较，忽略了本地最新版样片。TTS instruction 参数返回 HTTP 400 后采用标准合成，但没有逐段人工听审。成片只通过媒体技术检查，不应计作语义审核通过。
- 项目 Skill 是流程说明；当前命令链分段执行，无全链路批处理或语义映射 fail-closed 门槛；关键姿态工具按计划清单串行运行。本期计划仅有 3 组姿态。详细结论与返工条件见 outputs/cred/review/AUDIT-2026-09-21.md。release 保持 draft，未发布；工作台默认项已恢复为最新已接受的 mit/miss 样片。

## 2026-09-21 — cred v2 返工与制作链路修复

- v2 已为八个词分别绑定 24 张独立 before/change/result 图。最终视频为 196.8 秒、1920×1080、30fps；完整解码、峰值、静音、旁白覆盖、双封面、32 个编码姿态切点和 360px/16 场移动缩图检查通过。与最新已接受的 mit/miss 做了 16 点共同时间对照，并注明此抽样不能代表节奏对齐。
- 返工原因与可复用检查见 `outputs/cred/review/REWORK-2026-09-21.md`、`AUDIT-2026-09-21.md` 和 `SAMPLE-COMPARISON-NOTES.md`。完整边界巡检及整片听审尚待完成，release 保持 `draft`。
- 项目链路已增加词到姿态/总结行预检及渲染拦截、带文案与音色指纹的 TTS 缓存、严格 instruction、图片批次重试并发、旁白覆盖预检、最小引用素材暂存和编码 MP4 切点审查。CRED 渲染素材由整库约 3.37 GiB 降到 45 个文件/30.1 MiB。
- 这次失败说明 Skill 文字步骤不能替代可执行质量门；未来项目以机器可检验项 fail closed，并把完整人工观看/听审作为独立终审状态，不能由“渲染/解码通过”推断成片已审。
# 2026-09-28 ten / tain 配图返工

- 首版 `ten-tain` 的运行时目录误放了 `mit/miss`、`duc/duct` 等旧期姿态，导致成片沿用旧配图；问题已确认不是剪辑时间轴，而是素材来源映射。
- 返工版将运行时素材隔离到 `public/assets/replica/ten-tain-v2/`，按八个词各自生成 before/change/result 三态，共 24 张。旧素材只保留在归档，不再进入本期渲染 bundle。
- 产物 `outputs/ten-tain/ten-tain.mp4` 已重渲染，24/24 资产、来源扫描、preflight、媒体解码和双封面验证通过；完整手机外放与耳机听审仍由用户在发布前完成。
- 制作链路新增 episode-local provenance 规则和代码闸门；未来每次英语视频制作先加载总制作路由 Skill，再加载对应栏目 Skill，运行时跨期素材会在渲染前失败。
## 2026-09-28 — ten / tain v3 生图模型返工

- 用户指出上一轮 v2/v3 草稿仍偏离最新 `mit/miss`：人物和道具漂移、伪文字、重复角色，且代码绘制兜底看起来像 SVG。先停止渲染，保留失败候选与代码试验到 `work/experiments/`。
- 以 `public/assets/replica/mit-miss-images2-keyposes/submit-result.png` 作为风格和角色参考，使用 Codex 内置 `image_gen`（gpt-image-2）重新生成十/tain 八个词的 24 张透明位图；每个词独立 before / change / result，不使用运行时 SVG 或代码形状。
- 新素材统一为白底留白、单一黑色小黑、手绘纹理、橙蓝灰局部道具和清楚的因果动作；全部安装到 `public/assets/replica/ten-tain-v3/`，24/24 资产 QA 通过。连续阶段沿用 `mit/miss` 的静态卡片、文字组装与关键帧切换。
- 正式成片重新渲染到 `outputs/ten-tain/ten-tain.mp4`：1920×1080、30fps、4404 帧、146.8 秒；render verify 和双封面 verify 通过。未发布，仍等待用户手机外放、耳机与整片观看。
- 制作 Skill 新增 provider 失败/伪文字/样式漂移拦截和失败素材归档规则；后续除非用户明确接受，不得用代码绘制冒充生图模型结果。

## 2026-09-29 整片预览与文字溢出闸门

- `outputs/ten-tain/review/full-preview/` 保存每秒抽帧联系页、低清整片和布局报告；正式渲染完成后自动生成，用户可在工作台或 Codex 面板连续预览全片。
- 复盘发现 `GenericContinuousStage` 的旧版 text-right 兼容位移同时作用于已在右栏的新 storyboard 和 `MorphWordBuild`，造成单词溢出；现已按 layer.x 判断，仅旧左栏层平移。ten / tain 已重渲染并通过 layout gate。
- 三项长期固定规则：内置 `image_gen` 位图、`mit/miss` 风格锚点和同镜头 before/change/result；hook→词根动作→例句/练习→总结的基本套路；smooth rise/reveal/slide、morpheme assembly、语义三态切换和 white-fade 的确定性动画。

## 2026-09-29 六级阅读成片

- 新增 `outputs/cet6-reading-location-paraphrase/`，主题为“六级阅读：先定位，再认同义替换”。这是按栏目自动选出的未制作题目，使用原创六级风格练习，未冒充真题。
- 成片为 1920×1080、30fps、4943 帧、约 164.82 秒；14 段旁白，覆盖题型、关键词、定位、同义改写、干扰项、迁移练习和四步检查。5 张本期专属内置 `image_gen` 栅格插图与词根封面母版双封面已就位。
- 已生成 `index.html` 播放页、`script.md`、`publish-copy.md`、`worksheet.html`、`content-qa.md`、`review/REVIEW.md` 和 `review/full-preview/`。整片预览共 165 张每秒联系页，自动布局检查为空，代表性联系页未发现文字溢出。
- 台账 `planning/topic-history.json` 已登记为 `produced`，内容计划 `cet-reading` 已进入“审核”；`release.json` 保持 `draft`，未发布。发布前仍需完整观看并用手机外放和耳机确认旁白优先。

## 2026-09-30 pon / pos 词根视频

- 按“只给栏目时自动选未制作主题”的规则选择 `pon / pos = put / place`，完成 compose、expose、impose、propose、oppose、dispose、deposit 七词教学。
- 本期采用内置 `image_gen` 与 episode-local 运行时素材，21 张 before/change/result 透明位图全部通过素材 QA；小黑角色以已接受锚点为参考，运行时不跨期复用旧图。
- 正式交付在 `outputs/pon-pos/`：168.45 秒、1920×1080、30fps；配音、渲染、媒体验证、双封面、内容 QA、手机抽帧、关键姿态切点和整片预览均已落盘，工作台已刷新。
- `content-qa.md` 记录了 Cambridge Dictionary 与 Etymonline 核对结果，并明确“放置方向”只是记忆桥梁；`release.json` 仍为 draft，未发布。项目校验的唯一新增提醒是背景音乐在手机外放上可能偏轻，发布前需按规则用手机外放与耳机试听。


## 2026-10-12 — 抖音竖屏、预告与推广配置

- 用户（读英文、不读中文）反馈粉丝和播放卡住，要求优化仓库以提升抖音播放并便于以后推广资料。对话改用英文；仓库文档、讲稿与画面文字仍用中文。
- 诊断：全部成片为 1920×1080 横屏，在抖音竖屏推荐流只占约三分之一屏；字幕 38px，手机内约 7–8pt；首帧小标题偏角落、插图晚进；结尾黑场且无收藏/关注引导；`remotion.config.ts` 中间帧为默认 JPEG 80；`narrationToCaptions` 每 34 字硬切，会切断英文单词（如 “thousands of v”）。
- 新增 `src/replica/vertical/`：同一 storyboard、配音、插图重排为 1080×1920。文字按原 y 顺序居中堆叠并放大，小黑插图在文字下方放大且裁在自身区域内，表格改为单列原生排版，箭头丢弃；字幕按旁白重切为单行短句、英文标蓝；顶部常驻系列名和“词根 = 释义”，词章节显示“第 n / N 个”；全片结尾 4.5 秒显示收藏/关注行动号召，不压黑以便循环。预告 = 钩子 + 词根总览 + 前两个不同的词 + “还有 N 个词在完整版”尾卡。
- 新命令：`npm run vertical:render -- --project=<slug>`（完整版、预告、复习卡、报告、联系图）、`vertical:render:all`、`vertical:stills`；`project:test` 增加竖屏版式回归（21 期 265 场安全区、字幕不切词、预告结构）。
- 新配置 `planning/growth-promotion.json`：系列/合集名、行动号召、话题标签、资料产品（首个为规划中的「小黑词根复习与自测」）与领取开关（默认关闭）。`douyinCopy.ts` 据此生成竖屏、预告与复习卡说明，并只在竖屏文件存在时写入。
- 已渲染 ten-tain、pon-pos、cred、duc-duct 四期竖屏完整版、预告与复习卡，位于各自交付目录 `vertical/`；均未发布，发布前仍需手机外放与耳机完整听看。英文说明见 `docs/growth-playbook-EN.md`。
