# 2026-07-29 — FORM = SHAPE / 形状；形成

- 新增 `form` 项目：12 场、112 秒、30fps、1920×1080；八词为 formation、inform、reform、transform、conform、deform、uniform、formula。
- 记忆钩子为“橙色模具”：`form` 表示形状/形成，前缀控制塑形方向，后缀表示结果或方法。
- 生成 9 张 2848×1600 RGBA 小黑动作插图。多轮重做并拒绝地面线、伪文字/数字、额外人物和语义不成立版本；最终 9/9 残绿 0%。
- 首轮旁白最高需 1.551×；压缩文案后全部低于 1.16×。正式门禁首次发现 inform/reform 尾部 1.682s/1.865s 空档，补写解释并重配后归零。
- Iconfont 搜索“形状 / 模具 / 变形”；应用内页面超时且无法核验逐项商用许可，零采用。
- 正式成片 3360 帧，112.000s 时间轴，H.264/AAC，峰值 -2.98 dBFS；白底与 0.7 秒、70% 部分压暗通过，零允许长静音窗口。
- 双封面通过：1080×1440 与 1200×900，均不透明、四角纯白、8 词完整。
- 无权威样片，使用 Press 系列样片做 16 对风格校准；书面结论与抽帧位于 `outputs/form/`，release 状态为 draft。

# Press Replica Project

## Session 1 - 2026-07-20

**Strategy:** Rebuild the 172.667-second press sample as a separate Remotion composition while preserving the existing word generator. Match the reference with an exact white canvas, Microsoft YaHei typography, deep-blue/orange hierarchy, sequential information reveals, hand-drawn SVG arrows and icons, typewriter examples, restrained white fades, and a two-column summary table.

**Decisions:** Start with press as the golden reference. Missing illustrations may be redrawn through the existing Jimeng/Huoshan image endpoint on a flat green background and converted to alpha locally. Keep the reference video's final fade to black unless the user explicitly changes that choice.

**Reasoning log:** The current 57-second card template cannot express the reference's 172-second sequence of semantic bridges and micro-beats, so the new replica uses timed visual layers rather than one static image and caption per scene.

**Outstanding:** Implement the replica composition, author the complete storyboard, generate or clean illustration assets, synthesize aligned narration, render, and verify against reference frames.

## Session 2 - 2026-07-20

**Strategy:** Finish `press` as the golden implementation before generalizing. Preserve the sample's white canvas, Microsoft YaHei typography, blue/orange hierarchy, sequential reveals, SVG arrows and icons, bottom captions, and final 0.5-second fade to black.

**Decisions:** Use the existing Jimeng-style press illustrations as the high-fidelity source, pass them through a deterministic white-cutout -> pure-green -> alpha pipeline, and keep all arrows/icons authored in code. Play short narration at natural speed with a reading hold; accelerate only clips that exceed the visual window. Gate required playback above 1.16x.

**Verification:** `PressReplica` renders at 1920x1080, 30 fps, 5180 frames, and 172.666667 video seconds. The final `edit/preview.mp4` contains H.264 video plus AAC stereo audio. All 16 narration clips and six SFX types decode, 11/11 RGBA illustrations pass transparent-corner/coverage/green-residual QA, audio has no clipped samples in the draft mix, the first frame is pure white, and the final frame is pure black.

**Artifacts:** `edit/preview.mp4` is the reviewed press preview. Representative frames and boundary sheets are under `edit/verify/`.

**Outstanding:** Generalize the press implementation into a root-word configuration schema and reusable builder, create and validate the Codex Skill, generate the `reg`, `fer`, and Bouba/Kiki replicas through that Skill, compare them with the reference videos, iterate the Skill, and only then remove verified-unused files.

## Session 3 - 2026-07-21

**Outputs:** `edit/reg/preview.mp4`, `edit/fer/preview.mp4`, and
`edit/bouba-kiki/preview.mp4` are the final full-resolution renders. Press remains
`edit/preview.mp4`.

**Reg:** 15 scenes, 82 layers, 9 transparent illustrations, 3100 frames, 103.333333 video
seconds. End fade is 18 frames to full black. Media report:
`edit/verify/reg-render-report.json`; decoded peak is -3.00 dBFS.

**Fer:** 13 scenes, 117 layers, 13 transparent illustrations, 4081 frames, 136.033333 video
seconds. The sampled swirl/zoom recaps and full 10-row final table are retained. End fade is 18
frames to opacity 0.8, decoded final empty pixel RGB 51. Media report:
`edit/verify/fer-render-report.json`; decoded peak is -3.00 dBFS.

**Bouba/Kiki:** 11 scenes, 102 layers, 12 transparent illustrations, 3069 frames, 102.300000
video seconds. The final `sp` scene voice explicitly matches `spring, spark, splash, spit, spill`
and `spurt, spew, spread, spray, sprinkle, sprout`. Opening/experiment central illustrations use
selective cover fitting after settled-frame review. End fade is 12 frames to opacity 0.733,
decoded final empty pixel RGB 68. Media report:
`edit/verify/bouba-kiki-render-report.json`; decoded peak is -2.90 dBFS.

**Illustration QA:** All 34 new declared files pass 2848x1600 RGBA, corner transparency,
coverage, and 0.000% green residual. Contact sheets and individual white composites are under
`edit/verify/`. A logo-free code car replaces repeatedly rejected generated Buick imagery.

**Comparison:** `edit/verify/comparisons/{press,reg,fer,bouba-kiki}/contact-sheet.png` contains
12 same-time sample/candidate pairs per episode, with probe JSON and per-frame indexes beside it.
The replicas preserve story order, word membership/order, visual hierarchy, white space, arrows,
tables, and sampled endings. The documented intentional difference is the user-required unified
Xiaohei black-line illustration language instead of the samples' mixed colored cartoon sources.

**Skill feedback:** Added rules for not sending artist names to image models, removing pale-green
outer rims, using logo-free code fallbacks, selectively covering 16:9 transparent canvases in
square boxes, and rechecking table narration after wording edits. `quick_validate.py` passes in
UTF-8 mode.

**Outstanding:** Final reference/import/static-path audit and removal of only proven-unreferenced
candidate files, followed by a last validation pass.

## Session 4 - 2026-07-21 final audit

**Reference scan:** 100 runtime files, 100 static references, zero unreferenced, zero missing.
All four replica modules remain registered. No deletion was appropriate; reproducible green
sources and verification artifacts are retained deliberately.

**Last gates:** TypeScript typecheck passed. Four project validators and four asset QA runs passed;
all 45 declared raster assets report 0.000% visible green. Previously generated media reports for
all four final MP4s remain valid because no render source changed after their formal renders.

**Status:** Complete; no outstanding work.

## Session 5 - 2026-07-21 audio-coverage correction and final close

**Why the prior close was reopened:** Media structure and peak checks had passed, but a full
`silencedetect=n=-45dB:d=1.2` comparison showed the candidate narration ended too early in many
long visual scenes. Samples had effective audio in those windows. The largest mismatch was in
`fer`, where several explanatory scenes left about 9–10 seconds without narration.

**Correction:** Expanded 19 scene scripts around prefix direction, semantic action, examples,
and memory callbacks. Generated synchronized caption cues from punctuation/length, regenerated
only changed scene audio, and held every required playback rate at or below 1.16x. A final five
clip pass removed remaining candidate-only boundary gaps.

**Final audio coverage:** Press 0 unexplained long silences; Reg 0; Fer 0; Bouba/Kiki one allowed
window at 63.375–64.674s, matching the sample's sp-to-sn pause at approximately 62.78–64.33s.
The renderer now stores this exception in project quality configuration instead of treating it as
an undocumented anomaly.

**Final media evidence:** `replica:render:verify` now includes complete video/audio decode,
H.264/AAC/CFR/frame-count checks, white/fade pixels, peak level, and long-silence analysis. Final
reports pass for 5180 / 3100 / 4081 / 3069 frames respectively. Peaks are -2.90, -3.00, -2.90,
and -2.90 dBFS. All four files also passed independent rawvideo/PCM full decode.

**Visual evidence:** The 12-pair comparison packages remain valid because only narration and
caption text changed. New final spot frames at press 145s, fer 52s/134s, and Bouba/Kiki 73s/100s
confirm readable one-line captions above the lower safe edge, pure white canvas, and no overlap
with the Xiaohei subject or summary tables.

**Cleanup:** Runtime scan found 100/100 referenced files, zero missing and zero unused. Moved 582
non-runtime drafts, duplicate voice/cutout copies, rejected green candidates, Watch frames, and
superseded verification artifacts into a dated quarantine (140,814,882 bytes), then permanently
deleted it after explicit approval. Production verification retains only render reports, final
spot frames, and the four sample/candidate comparison packages.

**Status:** All four requested replicas are now genuinely closed under the strengthened gates.

## Session 6 - 2026-07-21 clean project handoff

**Structure:** The sole delivery root is now `outputs/`, with one folder per registered video.
Each folder contains the final MP4 and its own verification evidence. Green technical sources
live under `assets/green-screen/`; runtime audio, transparent PNGs, and SFX remain under
`public/assets/`; reusable source lives under `src/replica/` and `scripts/replica/`.

**Permanent cleanup:** After the user explicitly confirmed the exact destructive scope, removed
legacy outputs and archives, analysis frames, the retired RootWordTemplate implementation and
generation scripts, old continue/press assets, the duplicate style repository, and empty residual
folders. No active runtime reference or accepted source asset was in the deletion set.

**Metadata repair:** Preserved the reviewed 12-point contact sheets, rewrote comparison JSON with
current relative paths, and removed stale TSV indexes whose intermediate frames had already been
retired. All output JSON files parse successfully.

**Portable media gate:** Adapted `replica:render:verify` to Remotion's bundled compact ffmpeg and
auto-detect its executables on Windows. Final reports pass: press 5180 frames / -2.93 dBFS, reg
3100 / -2.96 dBFS, fer 4081 / -2.94 dBFS, Bouba/Kiki 3069 / -2.90 dBFS. Full video/audio decode,
white/fade pixels, codec/CFR/frame counts, long-silence rules, and peak limits all pass.

**Final audit:** TypeScript passes; all four validators and all 45 illustration checks pass; the
Remotion bundle exposes only the four intended compositions. Static runtime audit reports 100
files / 100 references / zero missing / zero unused, plus six dynamically referenced SFX / zero
unused. No legacy `edit`, `out`, `archive`, `_legacy_outputs`, `analysis_frames`, or `tools` tree
remains.

**Status:** Clean handoff complete. Future briefs should use `docs/NEW_VIDEO_PROMPT.md` and place
all delivery artifacts in `outputs/<slug>/`.

## Session 7 - 2026-07-21 ject production

**Brief and design:** Added a new `ject = throw` episode without a shot-matched reference. The
105.000-second program contains 11 scenes, 65 visual layers, 11 narration clips, and seven
transparent illustrations. Its memory system treats `ject` as a throwing machine and assigns the
prefixes five directions: `re` back, `pro` forward, `in` into, `ob` against, and `sub` under. The
required words are `reject`, `project`, `inject`, `object`, and `subject`; the program also teaches
the noun/verb stress shift for `project`, `object`, and `subject` and closes with five checked
example sentences.

**Visual production:** All frames retain the series' pure-white canvas, Microsoft YaHei type,
`#041FA0` teaching blue, and `#E85810` emphasis orange. Xiaohei performs each semantic action while
arrows, direction labels, cards, stress marks, recap tables, and transitions are code-rendered.
Seven 2848x1600 RGBA illustrations pass transparency, coverage, corner, band, and green-residual
checks; every accepted image reports 0.000% green. The generated `reject` asset was rejected three
times for pseudo labels, glossy treatment, and inset black bars. A logo-free code-drawn green
technical plate was passed through the same chroma-removal pipeline instead. Rejected evidence is
retained outside runtime under `assets/archive/ject-rejected/`.

**Audio correction:** The first formal render exposed six candidate-only silence windows at scene
boundaries. The affected teaching scripts were expanded with meaningful prefix callbacks and
examples, then regenerated rather than padded with noise. All final playback rates remain within
the 1.16x ceiling. The final `-45 dB / 1.2s` scan reports zero unexplained long-silence windows.

**Review and comparison:** Midpoint and transition-boundary sheets were source-rendered under
`outputs/ject/review-stills/`; 13 targeted frames were independently decoded from the final MP4
under `outputs/ject/spot-checks/`. Because no exact sample was supplied, the paired comparison
against `press` validates established-series white space, hierarchy, typography, palette,
Xiaohei action language, and ending treatment only; it does not claim scene or timing replication.
The comparison contact sheet and written decision record are under `outputs/ject/comparison/`.

**Strengthened gate:** A failed generated image revealed that corner transparency alone could miss
inset letterbox bars. Asset QA now scans interior edge zones for continuous horizontal or vertical
bands, using a 2.5% thickness limit. Calibration rejects the 8.81%-high failure while preserving
valid wide Xiaohei compositions whose actual continuous marks measure below 0.88%.

**Final delivery:** `outputs/ject/ject.mp4` is H.264/AAC, 1920x1080, CFR 30fps, exactly 3150
frames, with AAC stereo 48kHz audio at -2.96 dBFS. The 0.6-second ending reaches full black. Full
video/audio decode, white/fade pixels, codec, duration, frame count, audio peak, and silence gates
all pass. TypeScript, project validation, all five project asset suites, Remotion composition
registration, output JSON parsing, and Skill validation also pass. Runtime audit reports 118
static files / 118 references / zero missing / zero unused, plus six dynamic SFX / zero unused.

**Status:** Ject delivery complete; no material or authorization request remains.

## Session 8 - 2026-07-21 unified cover prototype

**Prototype:** Added a reusable 1080x1440 React/Remotion `RootWordCover` composition and project-
level cover metadata. The first approval candidate is `outputs/ject/cover.png`. It uses the fixed
white/blue rounded card, series mark, orange category pill, oversized root/meaning hierarchy,
middle-right Xiaohei action zone, highlighted word-family chips, and quiet footer.

**Asset decision:** Reused the already accepted `ject/00_throw_hook.png` rather than spending a
generation call or introducing a second visual interpretation. Future episodes may generate one
dedicated Jimeng/Seedream Xiaohei cutout only when their accepted video illustrations do not
communicate the cover's core action.

**Workflow:** Added `npm run replica:cover -- --project=<slug>`, `paths.outputCover`, and `cover`
configuration. Updated the reusable Skill, its schema/style/quality references and project
template, the root README, delivery README, standard new-video prompt, and the Ject README. The
other four covers remain intentionally ungenerated until the user approves the prototype.

**Cover gate:** Added `replica:cover:verify`. The accepted prototype is an opaque RGB24 PNG at
exactly 1080x1440 with four sampled pure-white corners and five configured words. The independently
resized 270x360 review remains readable and is stored as `cover-thumbnail-review.png`; deterministic
results are stored in `cover-report.json`.

## Session 9 - 2026-07-21 approved cover backfill

**Approval:** The user approved the Ject prototype without layout changes. Backfilled the same
shared component for `press`, `reg`, `fer`, and `bouba-kiki`; no dedicated per-video component or
new Jimeng generation was introduced.

**Cover content:** Press uses the accepted press-button action with `PRESS / PRESS DOWN / 按、压`;
Reg uses the ruler action with `REG / STRAIGHT-RULE / 直、规则`; Fer uses the carrying-box action
with `FER / CARRY / 携带、搬运`; Bouba/Kiki uses the thinking-between-shapes action with
`BOUBA KIKI / SOUND SHAPE / 声音也有形状`. Each card contains five representative words or sound
groups and stays within the established white, blue, orange, Microsoft YaHei system.

**Iteration:** The first Press and Reg renders wrapped their fifth long word onto a second row and
collided with the footer. The shared component now derives chip font, padding, and gap from total
word length, keeping all five on one line. Sound-symbolism cards can override the eyebrow,
family label, and per-chip highlighted fragment while preserving every fixed layout zone.

**Gates:** All five covers pass as opaque RGB24 PNG files at exactly 1080x1440 with four exact
white corner samples and five configured entries. All five independently rendered 270x360
thumbnails retain readable primary title, meaning, Xiaohei silhouette, and word/group row.
Each output directory now contains `cover.png`, `cover-report.json`, and
`cover-thumbnail-review.png` beside its existing MP4 and video evidence.

**Final regression:** TypeScript, all five project validators, all five cover verifiers, output
JSON parsing, and Skill validation pass. Remotion exposes the one shared `RootWordCover` still
plus the five existing video compositions. Runtime media audit remains 118 files / 118 references
with zero missing and zero unused; the cover backfill introduced no duplicate runtime asset.

## Session 10 - 2026-07-22 AI background-music pipeline

**Music brief:** Added `docs/BACKGROUND_MUSIC_PROMPTS.md` with one recommended and three alternate
English prompts tailored to the white-canvas Xiaohei teaching style, plus a shared negative prompt,
180-second seamless-loop target, and exact delivery filename. The recommended direction uses
sparse felt piano, muted wooden plucks, brushed percussion, subtle pizzicato, and rounded bass at
86 BPM, with no vocals or dramatic build.

**Engine:** Added required project-level `backgroundMusic` configuration shared by all five
registered episodes. Remotion now places one continuous looping track at the composition level,
uses absolute-frame volume automation, fades the program in/out, and ducks from `0.10` to `0.045`
while narration is active with `0.25s` attack / `0.55s` release. The track does not restart at
scene boundaries.

**Guardrails:** Draft and final render commands now stop before export when
`public/assets/music/root-word-series-bgm.mp3` is missing. Project validation remains usable while
the user is generating the track and emits an explicit warning. Final verification records the
music configuration and independently checks narration schedule gaps so a continuous music bed
cannot hide an early-ending voice clip.

**Skill:** Updated `build-root-word-video`, its project template, configuration schema, quality
gates, and a new background-music reference. Repaired the Skill's previously garbled UI metadata.
`quick_validate.py` passes, and an isolated forward test correctly inferred the exact music path,
missing-file stop behavior, shared mix values, and narration-only coverage requirement.

**Regression:** TypeScript and all five project validators pass. Each validator reports the
expected missing-music warning because the user has not supplied the generated master yet. A
guarded Ject draft-render test stops at the exact expected path without creating or overwriting an
output. Existing MP4s were not re-rendered and remain the pre-music versions until the master is
provided.

## Session 11 - 2026-07-22 generated music adoption and final backfill

**Source selection:** Audited the three generated MP3 files under `bg/` and selected
`bg_no-watermark.mp3`, the 543.373-second stereo 44.1 kHz / 256 kbps master. It is long enough to
cover the 172.667-second Press episode without looping, contains no detected long silence, and
measures about -17.9 LUFS / 6.4 LU LRA / 0.0 dBTP before the conservative series mix. The original
files remain untouched. The accepted source and runtime copy share SHA-256
`976DA5811B83EBE2B418D0484D948D8AF19CAF8CBE14C82F542CB59BCFAA37E2`.

**Runtime adoption:** Copied the accepted master to
`public/assets/music/root-word-series-bgm.mp3`. All five project validators then passed without a
missing-music warning. The existing composition-level automation applies the shared 0.10 base /
0.045 narration-ducked mix, attack/release, and whole-program fades to every episode.

**Backfill:** Ject received a full Remotion final render. Press, Reg, Fer, and Bouba/Kiki received
the identical Remotion-generated final audio mix while their previously accepted H.264 streams
were preserved byte-for-byte through stream-copy muxing. An initial Ject mux attempt using ffmpeg
`-shortest` dropped the last video frame; verification caught the defect, the file was replaced by
the full render, and the backfill procedure now explicitly forbids `-shortest` for exact-frame
deliveries.

**Final verification:** All five final MP4 files pass full media verification with AAC stereo
48 kHz audio and exact frame counts: Press 5180 / -2.75 dBFS, Reg 3100 / -2.91 dBFS, Fer 4081 /
-2.91 dBFS, Bouba/Kiki 3069 / -2.84 dBFS, and Ject 3150 / -2.88 dBFS. Each report records zero
unexplained long-silence windows. The host deletion policy retained the temporary WAV mixes and
Ject draft; these files are regenerable intermediates and are explicitly excluded from delivery.
# Session 12 - 2026-07-22 Ject continuous-stage quality upgrade

## Pre-change audit

- The registered `JectReplica` composition is correctly configured at 1920x1080, 30 fps,
  105.000 seconds / 3150 frames. Its eleven contiguous narration scenes and existing BGM/SFX
  assets are complete and remain the timing authority for this upgrade.
- The visual implementation is nevertheless page-based: every scene owns a full white
  `ReplicaLayerRenderer`, every layer is unmounted at the boundary, and ten scene tails apply the
  same 0.16-second white fade. Existing boundary-review JPEGs are only about 3.8 KB each and show
  near-empty white frames, proving that the viewer repeatedly loses the stage between ideas.
- `ject`, the direction system, characters, and illustration field are recreated in each scene.
  The five word scenes repeat nearly identical title/formula/image/arrow/meaning layouts and the
  same pop/rise/slide/fade cadence. The static art communicates the noun, but reject contact and
  rebound, project propulsion, inject boundary crossing, object blocking, and subject downward
  pressure are not expressed as multi-phase frame-driven actions.
- Most layers settle early and then remain perfectly still until the common fade. There is no
  restrained camera follow, persistent coordinate space, shared-element prefix replacement, or
  directional handoff into the next chapter. SFX cues exist at useful semantic beats, but the
  visual actions are not explicitly keyed to those hit/press/whoosh frames.
- Animation constants and absolute layout coordinates are repeated throughout the storyboard.
  The generic renderer is deterministic and correctly clamps its current interpolations, but it
  does not provide reusable continuous-stage motion primitives or a data model for semantic word
  actions.
- The repository has an empty/unusable `.git` directory, so there is no working Git index for a
  clean/dirty diff. Existing files are being preserved and edits are restricted to the Ject
  rendering path, shared types/configuration, render settings, logs, and the reusable Skill.

## Upgrade strategy

- Preserve the eleven scene timings, narration files, captions, BGM, SFX, 3150-frame duration,
  palette, type, illustrations, and teaching order.
- Add one long-lived Ject stage with a shared root, prefix morph, direction coordinate system,
  restrained virtual camera, semantic action overlays, and overlapping 8-16-frame handoffs.
- Keep default rendering unchanged for Press, Reg, Fer, and Bouba/Kiki. Select the continuous
  renderer through typed project metadata so the new pattern can be reused by later root-word
  episodes without project-ID conditionals.

## Implementation and acceptance

- Added a typed continuous-renderer selector and one composition-long `JectContinuousStage`.
  Narration, captions, SFX, BGM, scene timing, and final fade remain on the original eleven-scene
  timeline; only visual mounting changed. Other registered projects still use the generic layer
  renderer.
- Added centralized deterministic motion helpers for clamped interpolation, soft/overshoot
  springs, stagger, entrance/exit, directional overlap, float, breathing, highlight, and camera
  drift. Static searches found no CSS transition/animation, timer, requestAnimationFrame,
  real-time clock, or randomness in the new stage path.
- Added typed Ject word-scene data with exact absolute frames and semantic SFX/action frames.
  Reject now anticipates/contact-compresses/rebounds; project receives a rear push and forward
  trail; inject crosses a dashed container boundary with deformation; object hits a barrier and
  dampens; subject remains below a descending plate.
- Boundary review iterated three times. The first pass exposed sparse visual preludes; the second
  kept outgoing chapters too strong and produced dense double tableaux and false prefix blends;
  the accepted pass pre-rolls incoming art while handing prefixes off exclusively. Reviewed
  source stills live under `outputs/ject/review-stills/continuous-v1` through
  `continuous-v4-prefix-handoffs`.
- Added explicit H.264 CRF 18 / yuv420p / AAC 192 kbps flags and the
  `npm run replica:render:hq -- --project=ject` command. Both a 3150-frame half-scale draft and a
  full 1920x1080 render completed without runtime errors.
- Final `outputs/ject/ject.mp4` passes full decode and media QA: H.264 1920x1080, yuvj420p,
  CFR 30 fps, exactly 3150 frames / 105.000 seconds, AAC stereo 48 kHz, -2.90 dBFS peak, pure
  white pre-fade background, 18-frame fade to black, zero narration coverage gaps, and zero long
  silences. Encoded-MP4 action/map/example/summary/fade frames were reviewed in
  `outputs/ject/final-spot-checks/contact-sheet.png` and match the source-render stills.
- Final gates exit 0: typecheck, project validation, seven-asset QA, composition enumeration,
  cover verification, guarded draft render, guarded full render, render verification, and Skill
  `quick_validate.py`. No lint or unit-test script exists in `package.json`; the available static,
  render, decode, asset, audio, and frame-review gates were used instead.
- Updated `build-root-word-video` with a conditional continuous-stage workflow, typed renderer and
  word-scene schema guidance, deterministic micro-motion exception, semantic action requirements,
  boundary/prefix overlap checks, and encoded-final-frame review. The Skill remains valid.

# Session 13 - 2026-07-22 continuous-stage second-pass and series rollout

## Findings and refinements

- A 33-frame Ject audit sampled the entrance, midpoint, and exit of every chapter. It exposed two
  remaining sources of mechanical motion: chapter-level scale compounded with illustration scale,
  and a periodic camera drift that continued through text-heavy stress, examples, and summary
  scenes. Chapter scale was removed, drift now tapers to zero for reading scenes, and periodic
  float/breathing motion now uses two incommensurate frame periods.
- The Ject summary previously relied on an endlessly floating final line. It now uses a single
  left-to-right completion stroke, preserving visual change without a conspicuous loop. The final
  encoded twelve-point contact sheet is in `outputs/ject/round2-final-audit/`.
- The first generic boundary render revealed a white-flash bug: scene overlap existed at the React
  level, but the outgoing layer lifecycle had already faded and the incoming layer was still at
  local frame zero. The accepted handoff freezes the outgoing scene at its last visible frame,
  holds it through the first four frames of the new narration beat, and transfers over twelve
  frames. All series boundaries were rerendered after this fix.
- SFX gain is now capped at 0.34 while preserving cue timing. This removes the 0.48-0.52 Press
  transient outliers without changing narration, BGM ducking, or sound-file content.

## Series implementation

- Added a reusable `GenericContinuousStage` plus typed, data-only semantic motion metadata for
  Press, Reg, Fer, and Bouba/Kiki. Each project preserves its original narration, captions,
  teaching order, composition duration, and 1920x1080/30 fps format.
- Project motions are meaning-driven rather than template-driven: Press uses press/in/out/down/
  return/impact; Reg uses straight/right/branch/governance motion; Fer uses across/toward/back/
  down/together; Bouba/Kiki uses impact/spray/inward/slide/upward light. Illustration action uses a
  deterministic anticipation-contact-settle profile and never CSS animation, timers, real time,
  or randomness.
- The persistent root badge, outgoing-frame hold, direction-aware scene translation, and
  composition-long mounting place words, characters, prefixes, and direction in one shared stage.
  Static per-project content and layer timing remain the source of truth.
- Action-frame and hold-frame scans are cached by scene. Only active/overlapping scenes mount
  layers, avoiding a full-storyboard layer render on every frame. Continuous-stage metadata is now
  validated for missing or unknown scene ids.

## Verification

- Representative 31-frame transition clips were rendered for all five compositions; each clip has
  31 unique frame hashes out of 31 and decodes at 30 fps. Midpoint, end-boundary, and post-boundary
  contact sheets are stored in each project's `round2-*` output folders.
- Full HQ renders completed for all projects using H.264 CRF 18, yuv420p, and AAC 192 kbps. Final
  verification passed with exact frame counts and no unexplained long silence: Ject 3150 / 105.00s
  / -2.90 dBFS; Press 5180 / 172.67s / -2.79 dBFS; Reg 3100 / 103.33s / -2.88 dBFS; Fer 4081 /
  136.03s / -2.84 dBFS; Bouba/Kiki 3069 / 102.30s / -2.85 dBFS.
- TypeScript, composition enumeration, project validation, illustration QA, short transition
  renders, full renders, full decode, pixel sampling, audio peak, and silence gates all pass. The
  repository still has no configured lint or unit-test script; validation covers the available
  static and render-specific gates.

# Session 14 - 2026-07-22 synchronized covers and Douyin publish copy

## Delivery workflow

- Added a shared `RootWordLandscapeCover` Remotion still at 1920x1080. It reflows the established
  cover system into a left teaching column, right semantic illustration, and full-width word
  family/footer band instead of cropping or stretching the 1080x1440 card.
- Added typed `outputLandscapeCover` and `outputDouyinCopy` paths to every project. Validation now
  requires the MP4, both covers, and Markdown copy to share one output directory.
- `replica:cover` renders both orientations by default and supports orientation-specific output
  overrides. `replica:cover:verify` checks both opaque PNGs, exact dimensions, pure-white corners,
  configured content metadata, and writes separate vertical and landscape reports.
- Added deterministic `replica:copy`. It writes a recommended title, paste-ready body, exact core
  mnemonic and word list, CTA, hashtags, and pinned-comment suggestion from project metadata.
  Sound-symbolism copy uses pronunciation/shape language instead of root-direction wording.
- A non-draft `replica:render` now automatically renders and verifies both covers and writes the
  Douyin copy beside the requested final MP4 before reporting the delivery package complete.

## Existing series rollout and QA

- Generated `cover-landscape.png` and `douyin-copy.md` for Ject, Press, Reg, Fer, and Bouba/Kiki;
  existing accepted final MP4s remain unchanged.
- Full-size five-cover review found the first landscape arrow crossing the word-family label. The
  shared component was corrected and all five landscape covers were rerendered. Ject was visually
  rechecked after the fix; the label, arrow, chips, illustration, and footer have clear separation.
- TypeScript and composition enumeration pass; both cover compositions register as 1080x1440 and
  1920x1080 stills. All five double-cover machine checks and all five project validators pass.
  Existing near-limit narration playback-rate warnings remain review items and are unrelated to
  this delivery change. Remotion bundling prints a cache snapshot warning but rendering succeeds.

## 2026-07-22 - Port production

**Brief and teaching strategy:** Built a new no-reference episode for `port = carry` with a
112.500-second target. The memory hook is one deadpan Xiaohei moving a load; prefixes become
routes: `im/in` in, `ex` out, `trans` across, `sup/sub` under, `re` back, `de` away, while
`-able` means able to be carried and `-er` names the carrier. The explicit eight-word family is
`import, export, transport, support, report, portable, porter, deport`.

**Visual production:** Added typed Port project, storyboard, audio manifest, continuous-stage
motion data, cover metadata, publish-copy metadata, and nine illustration prompts. Seven assets
were accepted from the configured Seedream endpoint. White-background review rejected heavy
architecture, ground-line, glossy/cropped candidates for `import`, `transport`, `portable`,
`porter`, and `deport`; `transport` and `deport` were replaced by sparse code-drawn green-plate
fallbacks and passed through the same chroma-removal pipeline. All nine final RGBA assets are
2848×1600 and report 0.000% visible green residual.

**Storyboard/audio:** 12 contiguous scenes, 57 layers, 3375 frames, 0.600-second full-black
ending. Five initial clips exceeded the 1.16× playback gate; scene holds were extended before
acceptance rather than hiding the gap with music. Final project validation reports only five
documented near-limit warnings (1.121–1.138×), all below the hard ceiling. The shared
`root-word-series-bgm.mp3` is mixed once at composition level with standard ducking/fades.

**Review evidence:** Draft midpoint and boundary stills show ordered word reveals, readable
Microsoft YaHei Chinese/English, pure-white quiet space, continuous root badge, code arrows,
examples, summary table, and monotonic final darkening. No user reference was supplied, so the
comparison package uses an existing series sample only for white-canvas grammar and ending style.

**Final media:** `outputs/port/port.mp4` is H.264 `yuvj420p`, 3375 frames / 112.500s, AAC stereo
48kHz, 112.554667s container tail, peak -2.86 dBFS. `replica:render:verify` reports full video/
audio decode, four white/fade pixel samples, zero narration gaps, zero long silences, and the
configured continuous music source. Both opaque covers and generated Douyin copy pass their gates.

## 2026-07-22 - Spect production

**Brief and teaching strategy:** Built the requested `spect = look / 看、观察` episode against the
local `outputs/press/press.mp4` sample. The memory hook is one Xiaohei observation lens: prefixes
turn the lens in, back, under, out, forward, or backward; `-ator` names the watcher and `-acle`
names the thing worth seeing. The eight required words are `inspect, respect, suspect, expect,
prospect, spectator, spectacle, retrospect`. The 172.667-second reference grammar was condensed
to 117.900 seconds to honor the 90–120-second target, with a 0.500-second full-black ending.

**Visual/audio production:** Added typed Spect project, 12-scene storyboard, continuous-stage
motion data, audio manifest, cover metadata, publish copy, and nine illustration prompts. Six
Seedream assets were accepted after white-composite review. `respect`, `suspect`, and `expect`
model candidates were rejected for a duplicate character, question-mark glyph, and arrow-like
marks; repository-owned code-drawn green plates replaced them and passed the same chroma-removal
pipeline. All nine final RGBA assets are 2848×1600 with 0.000% visible green. CosyVoice narration
uses the shared series music and remains at or below the 1.16× playback ceiling.

**Review and gates:** Midpoint and boundary sheets exposed and fixed the missing `-ator`/`-acle`
title suffixes; encoded review then caught and corrected the false `exspect` spelling by rendering
the historical spelling variant as `ex + pect` with the omitted `s` noted. Final checks contain
24 encoded-MP4 frames; the press
comparison package contains 16 same-timepoint pairs and explicitly records the intentional theme/
duration differences. `replica:render:verify` passes with 3537 frames, H.264 `yuvj420p`, AAC stereo
48kHz, peak -2.86 dBFS, full audio/video decode, zero narration coverage gaps, zero unexplained
long silences, pure-white samples before the fade, and black final frame. Both opaque covers,
deterministic Douyin copy, project validation, typecheck, and 9/9 asset checks pass.

## 2026-07-22 - Vis / Vid production

Corrected the supplied `-vidt` spelling to `vis / vid` and built a 118.500-second `see / 看见`
episode for `vision, visible, video, visual, evidence, evident, visit, revise`. The hook treats
`vid` as seeing in action and `vis` as the resulting visual/image; `evidence` is explicitly a
historical mnemonic, not a productive modern split.

Added a typed project, 12 scenes, continuous-stage data, 12 CosyVoice clips, cover/copy metadata,
and nine Xiaohei prompts. Candidates with a ground line, realistic orange, inset panel, or opaque
bands were rejected; safe accepted series actions replaced repeated failures. All 9 cutouts are
2848×1600 RGBA with 0.000% green. The first verifier exposed a 1.372-second narration gap in
`visible`; its line was expanded and force-regenerated to 10.083 seconds / 1.120×.

Midpoint, boundary, encoded, and 14-pair Press comparison sheets pass visual review. Final
`outputs/vis-vid/vis-vid.mp4` is 3555 frames / 118.500s, H.264 1920×1080 CFR 30 fps, AAC stereo
48 kHz, peak -2.79 dBFS, full decode, zero narration gaps, zero unexplained long silences, and a
15-frame full-black fade. Both covers, copy, typecheck, validation, and asset QA pass.

## 2026-07-23 - Vis / Vid semantic-motion rebuild

Rebuilt the latest `vis-vid` episode after the generic continuous renderer was judged too close
to a sequence of lightly moving cards. The shared project schema now supports optional
scene-local semantic plans containing an explicit narration-aligned action time, named action,
camera direction, target image, and strength. Existing projects retain their previous fallback
motion behavior; the skill itself was deliberately not changed pending user approval.

The `vis-vid` plan now assigns twelve distinct chapter behaviors: focus, compare, image formation,
entering the field of view, playback, scan, presenting proof, clarification, approach, revisit,
sentence cascade, and summary gathering. The generic stage renders deterministic anticipation,
travel/contact, semantic climax, damping/settle, restrained breathing, 20px-class camera motion,
staggered text emphasis, and code-drawn focus/path overlays from Remotion frames only.

Typecheck, project validation, and 9/9 illustration QA pass. Action review stills at anticipation,
climax, and settle are stored under `outputs/vis-vid/review-stills/actions-v2/`; midpoint and
boundary evidence remains under the same review tree. The rebuilt final MP4 passes exact media
verification at 3555 frames / 118.500s, H.264 1920×1080 CFR 30fps, AAC stereo 48kHz, peak
-2.79 dBFS, complete decode, zero narration gaps, zero unexplained long silences, pure-white
program frames, and the configured 15-frame fade to black. Both covers and deterministic publish
copy were regenerated and verified.

### User-review revision: morpheme assembly and layout variation

After review feedback, replaced whole-word title entrances in all eight word chapters with typed
morpheme assembly. The orange root appears as the anchor; prefixes travel from the left and
suffixes from the right, settle into the complete spelling, and finish with a short root-colored
baseline. The animation is configured per scene (`layerId`, prefix, root, suffix, onset) rather
than inferred from arbitrary substrings.

Word chapters now alternate text-left/image-right and image-left/text-right compositions.
Transition timing was tightened so the old chapter recedes before the new root assembly becomes
strong, avoiding dense double tableaux when the layout flips. Removed the generic arrows from
evidence, visit, revise, and other action scenes; movement is carried by the illustration itself.
Only semantically justified focus/scan brackets remain, and no external icon library was added
because its visual language would conflict with the existing Xiaohei linework.

Review evidence is under `outputs/vis-vid/review-stills/assembly-layout-v3/` and
`outputs/vis-vid/review-stills/boundary-focus-v3/`. The previous semantic-motion candidate is
preserved as `outputs/vis-vid/vis-vid-v2-semantic.mp4`. The current `vis-vid.mp4` again passes
typecheck and render verification: 3555 exact frames, four white/fade pixel samples, peak
-2.79 dBFS, zero narration gaps, and zero unexplained long-silence windows.

### User-review revision: collision-safe art zones and Iconfont seed library

Replaced the mirrored chapter's broad translated image canvas with explicit, non-overlapping
teaching zones. Text remains inside its side of the composition while every word-scene image is
mounted in a dedicated left or right art box. The boxes account for the largest semantic travel
keyframe, not only the settled frame. Wide relationship illustrations use `contain`; selected
single-subject actions use `cover`; vision/visible use contained art with a restrained local scale
so no semantic extremity is cropped. Review evidence at every word-scene action peak is under
`outputs/vis-vid/review-stills/safe-zones-v4*/`.

Inspected the user-opened Iconfont site and confirmed that public search results expose original
SVG path data. Created `public/assets/icons/iconfont-core/` with four normalized seed assets:
eye outline, solid eye, closed eye, and focus target. `manifest.json` records the Iconfont ID,
SVG hash, search URL, retrieval date, and normalization note. Because the result page did not
surface author/license terms, the library is explicitly marked reference-only until each source
license is reviewed; none of these assets was forced into the current episode.

The prior candidate is preserved as `vis-vid-v3-morpheme-layout.mp4`. The current collision-safe
`vis-vid.mp4` passes typecheck and formal media verification at 3555 frames, H.264 1920×1080
CFR 30fps, AAC stereo 48kHz, peak -2.79 dBFS, four expected white/fade samples, zero narration
gaps, and zero unexplained long-silence windows.

### User approval and skill codification

The user approved the collision-safe semantic-motion render. Codified the accepted production
system in the global `build-root-word-video` skill and its visual-style, config-schema, and
quality-gates references. New unsampled episodes now default to a continuous semantic stage,
while exact replicas remain sample-authoritative. The skill now requires typed narration-aligned
semantic actions, morpheme assembly, intentional layout variation, transformed text/art safe
zones, semantic justification for arrows/icons, and source/license manifests for external icon
assets. Final project typecheck, validation, and encoded render verification all pass.

## 2026-07-23 - aud production

Built a new 112.200-second `aud = hear / 听` episode for `audio, audience, audit, audible,
audition, auditorium, inaudible, audiobook`, using `outputs/press/press.mp4` as the series
style/ending reference rather than a frame-accurate content template. The mnemonic makes `aud`
a sound receiver; `audit` is explicitly taught through the historical “hear an account, then
check it” route rather than as a modern mechanical split.

Added a typed project, 12-scene storyboard, continuous-stage semantic plans, morpheme assembly,
12 CosyVoice clips, nine Xiaohei prompts, cover metadata, and deterministic Douyin copy. Rejected
the first audit asset for generated ledger writing/check marks and the first inaudible asset for
an unclear blocking direction; both were regenerated. All 9 final 2848×1600 RGBA cutouts pass
with 0.000% green.

The first encoded verifier found four 1.264–1.969-second narration-only gaps hidden by the music
bed. The affected `audio`, `audition`, `inaudible`, and `audiobook` lines were expanded and
regenerated; no noise or BGM masking exception was used. Final validation passes at 12 scenes /
112.200 seconds. The MP4 passes exact 3366-frame verification, H.264 1920×1080 CFR 30 fps,
AAC audio, -2.83 dBFS peak, complete decode, zero narration gaps, zero unexplained long silences,
pure-white program samples, and a 15-frame full-black ending.

Both opaque covers pass their size/white-corner/content gates, and the deterministic publish copy
was reviewed. Midpoint evidence, asset sheet, beat map, and 16-pair Press comparison are stored
under `outputs/aud/`. Written comparison finds the palette, typography, whitespace, caption band,
reveal order, Xiaohei action grammar, and ending faithful; topic, duration, and semantic actions
are intentional new-episode differences.
## 2026-07-24 — Xiaohongshu 4:3 landscape-cover migration

- Reworked the shared `RootWordLandscapeCover` composition from 1920x1080 (16:9) to 1200x900
  (4:3), with native reflow of the header, teaching hierarchy, action-art zone, mnemonic hook,
  word-family chips, and footer. The vertical 1080x1440 cover remains unchanged.
- Updated deterministic cover verification so landscape outputs must be opaque 1200x900 PNGs
  with four pure-white corners.
- Rerendered every existing landscape delivery: Press, Reg, Fer, Bouba/Kiki, Ject, Port, Spect,
  Vis/Vid, and Aud. All 9/9 landscape reports pass the new 1200x900 gate.
- Full-resolution review covered a standard five-word card and the eight-word Vis/Vid and Port
  density cases. The first preview exposed a clipped upper-right pill; the shared header was
  reflowed and rerendered before acceptance. The final cards retain readable title/art separation,
  one-line word chips, clear footer separation, and the 4:3 format label.
- `npm run typecheck` exits 0 after the migration. The reusable skill contract, configuration
  reference, visual-style reference, and quality gate now specify 1200x900 Xiaohongshu landscape
  covers and 400x300 thumbnail review.
## 2026-07-24 — Iconfont search added as a default quality pass

- Preserved the established narration, illustration, motion, render, cover, and comparison
  workflow.
- Added a default post-beat-map Iconfont search for every new unsampled episode. It derives a small
  semantic query list, reviews visual suitability at delivery size, and may accept zero icons.
- Added an explicit commercial-use gate and episode manifest schema. Published icons now require
  recorded author/collection, source, ID/hash, retrieval date, modifications, semantic purpose,
  license state, evidence URL, and permission paraphrase. Reference-only assets cannot render.
- Confirmed that the in-app browser can reach Iconfont. No unrelated icon was downloaded because
  this update has no new episode topic; actual search terms must come from the finalized script.

## 2026-07-24 - Ject Wan dynamic-Xiaohei experiment

- Used the existing project-secret DashScope credential with the lowest-cost acceptable
  `wan2.2-i2v-flash` 480P configuration: five-second silent clips, no watermark, and no prompt
  extension. No credential was copied into source, logs, manifests, or memory.
- Created six accepted semantic actions and rejected one identity-drifted reject clip. The hook
  clip is safely mirrored for reject, avoiding another paid generation. Including two hook tests,
  public list-price cost is estimated at about CNY 4.00 for eight five-second generations.
- Green-plate compositing plus connected-boundary matting preserved enclosed pale details. User
  review rejected direct VP9-alpha playback for stutter, then rejected the first PNG matte for
  broken fine limbs. The final project path is deterministic 30fps RGBA PNG playback with a
  0.5-second loop dissolve, dark-ink limb recovery, 2x premultiplied-alpha scaling, and full-alpha
  despill.
- `scripts/verify_ject_motion_frames.py` verifies all 900 final frames: six 150-frame sequences,
  consistent 1664x928 RGBA dimensions, zero empty frames, sufficient temporal changes, and zero
  detected chroma-key-like green spill. All sequences pass.
- Removed the nonessential direction-system arrows, crosshair circle, trajectory marks, and image
  border after they visibly crossed text and Xiaohei. Semantic map connections remain only in the
  dedicated recap map.
- Final project-only trial: `outputs/ject/ject-wan-png-alpha-trial-v2.mp4`. Formal verification
  passes at 3150 frames, H.264 1920x1080 CFR 30fps, AAC audio, 105 seconds, -2.90 dBFS peak, four
  expected white samples, zero narration gaps, and zero unexplained long-silence windows. The
  old static delivery was not overwritten, and framework codification remains gated on user
  approval.

## 2026-07-24 - Approved anti-aliased Ject export and Skill rollout

- User accepted the 1920x1080 anti-alias preview. Rebuilt all six sequences / 900 frames with
  soft dark-ink support and 1.25 px post-upscale alpha softening while preserving thin limbs and
  zero detected chroma-green spill.
- Exported `outputs/ject/ject-wan-png-alpha-antialias-final.mp4` and retained all earlier trial
  files as iteration evidence. Final media verification passes at 3150 frames, H.264 1920x1080
  CFR 30fps, AAC audio, 105 seconds, -2.90 dBFS peak, four expected white samples, zero narration
  gaps, and zero unexplained long-silence windows. Both covers and publish copy also pass.
- Reviewed 11 encoded chapter midpoints in
  `outputs/ject/ject-wan-png-alpha-antialias-final-contact.jpg`; Xiaohei remains visible in every
  core chapter, text/art zones are clean, and only the dedicated recap map retains semantic
  connector lines.
- Codified the accepted production path in the global `build-root-word-video` Skill:
  `references/dynamic-xiaohei.md`, updated visual/config/quality contracts, and bundled
  `wan_i2v_submit.ts`, `wan_i2v_poll.ts`, and `key_wan_video.py`. Skill validation passes; the
  matte script passed a real 150-frame test at 1664x928, and the network scripts passed local
  argument guards without incurring another generation charge.

## 2026-07-24 - Portable project Skill

- Added `.agents/skills/build-root-word-video/` as a complete repository-local mirror of the
  approved global Skill: `SKILL.md`, `agents/openai.yaml`, three templates, six references, and
  four scripts.
- Replaced the global/machine absolute references in the local copy with repository-relative Ian
  Xiaohei and comparison-script paths. All remaining files hash-match the global source.
- Project-local Skill validation passes, and both Wan network scripts pass no-cost argument-guard
  execution.
## 2026-07-24 - dict = say / 说

- 新增 `dict` 无样片连续舞台项目，12 场景 / 112.000 秒，显式讲解
  `predict, contradict, verdict, dictate, dictionary, diction, dictation, indict`。
- 记忆钩子为“说话印章”：小黑把说出口的话压成可执行的文字；8 个词义章节交替使用左右文本/动作区，
  词根、前缀、后缀由代码拼装，结尾采用 0.500 秒全黑。
- 首轮配音多段需要 1.20–1.41x，删去重复解释后全部低于 1.16x；最终仅
  `dictation` 1.125x、例句 1.123x 进入人工复核区。首轮成片检查又发现 4 个由配乐掩盖的
  1.551–3.182 秒旁白尾部空窗，补写受影响文案并重生成，最终零空窗、零长静音。
- 生成 9 张 2848×1600 RGBA 小黑插图。人工白底审图拒绝首轮钩子伪印章文字、
  `verdict`/`dictation` 地面阴影和 `diction` 边缘杂线，定向重生成后 9/9 通过，
  残余绿边均为 0.000%。
- Iconfont 搜索“说话”返回 529 个候选，但缺乏可核验的单图商用许可且与小黑动作重复；
  后续聚焦检索响应不稳定。本期零采用，结果记录在 `public/assets/icons/dict/manifest.json`。
- 使用 Wan `wan2.2-i2v-flash` 480P 生成 9 个五秒锁镜头动作，抠为 9×150 张
  1664×928 RGBA 帧。`verdict` 动态片段因矩形边框淘汰并回退静态代码动画，其余 8 组
  以原生 30fps 和 15 帧循环溶解进入成片。估算生成成本约 CNY 4.50。
- 最终 `outputs/dict/dict.mp4` 通过精确媒体门槛：3360 帧、1920×1080 CFR 30fps、
  H.264 yuvj420p、AAC 双声道 48kHz、112.000 秒视频、完整解码、峰值 -2.84 dBFS、
  零旁白空窗、零未解释长静音、纯白节目背景、末 15 帧单调压暗至全黑。
- 双封面 1080×1440 与 1200×900 均通过不透明 PNG、白角、尺寸和 8 词内容门槛。
  使用 Press 样片在 16 个显式安全时间点完成系列对比；色彩、字体、留白、字幕带、动作语法和
  结尾一致，主题、时长和语义动作是本期有意差异。
## 2026-07-24 — script-scrib

- 新增 `script-scrib` 词根视频：`script / scrib = write / 写`，112 秒，12 场景，8 个词。
- 选词：describe、prescribe、subscribe、transcribe、manuscript、inscription、postscript、scribble。
- 配音：CosyVoice `longanhuan`；最高播放倍率 1.079，最终总结 1.033。补写并重生 subscribe、postscript、scribble，消除超过 1.2 秒的旁白尾部空档。
- 静帧：Seedream 生成 9 张绿幕源，三轮定向返工后 9/9 透明资产通过 2848×1600、残绿 0%、安全边界检查。
- 动态：Wan 2.2 I2V 生成 9 组 480P / 5 秒 / 150 帧动作。接入 hook、manuscript、inscription、postscript、scribble；describe、prescribe、subscribe、transcribe 因黑边、表情漂移或额外肢体被拒绝并回退静帧。
- Iconfont：查询“写字”（663 个结果）与“签字”；没有候选级明确商用许可，零采用。证据记录于 `public/assets/icons/script-scrib/manifest.json`。
- 渲染：1920×1080、30 fps、3360 帧、H.264 + AAC，时长 112 秒，峰值 -2.80 dBFS，无未解释长静音。
- 结尾：最后 15 帧从白单调压暗到全黑；采样帧 3344=`255`、3352=`127`、3359=`0`。
- 封面：1080×1440 与 1200×900 均通过不透明、纯白四角、8 词完整性检查。
- 对比：无主题专属样片，使用 `press` 作为系列风格基准，输出 7 组并排抽帧与书面对比结论。
- 交付目录：`outputs/script-scrib/`。

## 2026-07-26 — tract

- 新增 `tract = pull / 拉，拖` 白底小黑视频：112 秒、12 场景、8 词，结尾 0.5 秒全黑。
- 选词：attract、distract、extract、contract、subtract、retract、tractor、traction；记忆钩子为“橙色牵引绳的方向”。
- 9/9 静态透明插图通过 2848×1600、残绿 0% 检查。生成并抠像 9 条 Wan 动态候选，但因试渲染出现深色矩形底板或身份/道具漂移，最终全部拒绝并使用静图代码动画。
- Iconfont 检索未取得可逐项核验的商用授权信息，零采用；箭头、方向图、文字、表格和总结页全部代码绘制。
- 首轮终检发现 3 处超过 1.2 秒的旁白尾部空窗，补写并重配后播放倍率为 1.019、1.051、1.103，最终零覆盖空窗。
- 正式成片通过：3360 帧、1920×1080、30fps、H.264 + AAC、112 秒、完整解码、峰值 -2.89 dBFS、零未解释长静音；末帧全黑。
- 双封面通过 1080×1440 / 1200×900、不透明、纯白四角和 8 词完整性检查。Press 系列样片 7 组抽帧对比已归档。
- 交付目录：`outputs/tract/`。

### 2026-07-26 白底动态图优化

- 针对正式版没有接入图生视频的问题，新增 9 条纯白背景 Wan I2V 动作，覆盖钩子及全部 8 个词。
- 不使用绿幕或 Alpha 抠像：源 MP4 直接抽取 1664×928 RGB 帧；对模型输出的 204–240 浅灰背景做全帧中性高光白场校正。
- 初次草稿发现透明序列播放器的双帧溶解会让白底素材出现短暂重影；对白底素材改用 15–149 帧原速往返单帧播放，消除双影和硬循环切口。
- 正式成片重新渲染并通过 3360 帧完整解码、纯白背景采样、零旁白空窗、零未解释长静音和 -2.89 dBFS 峰值门槛。
- 白底实验源片、输入图、接入前后审图表和说明统一保存在 `outputs/tract/wan-white/`。待用户观看确认后再决定是否固化进 Skill。
- 用户验收通过后，项目内 `.agents/skills/build-root-word-video/` 已将白底 RGB 图生视频设为优先路径，绿幕 Alpha 抠像改为回退；新增 `scripts/white_wan_video.py`，并补充白场、单帧往返播放和最终成片检查门槛。脚本实测 150/150 帧、四角纯白，Skill 结构校验通过。
- 2026-07-26：完成发布与工程治理改造。将 `spect发了 / port发了 / ject发了 / aud发了 / dict发了`
  迁回固定 slug 目录，并用 `release.json` 标记为 `published`；原 `outputs/ject` 试验树及其他
  Wan/预览/废弃目录可恢复地移入 `work/output-experiments/`。
- 发布文案改为抖音、小红书共用的 `publish-copy.md`：每期包含痛点、收益、悬念三个标题角度，
  差异化正文、复习方法和置顶互动题；同时修复旧生成器的中文 UTF-8 乱码，并镜像更新
  `douyin-copy.md` 以兼容旧流程。
- 新增 `replica:release`、`replica:content:qa`、`replica:assets:audit`、
  `replica:wan:white` 和 360px 手机可读性抽帧模式。`replica:render:hq` 现在使用 CRF 15
  和单并发，不再与普通渲染命令等价。
- 资源扫描确认 `tract-motion` 已被 `tract-white-motion` 完全替代，约 649MiB 旧绿幕帧已移入
  `archive/generated-assets/`；专用渲染器仍使用的 `ject-motion` 保持原位。`outputs/` 仅保留
  12 个正式主题目录。
# 2026-07-29 — STRUCT = BUILD / 建造；搭建

- 新增 `struct` 项目：12 场、112 秒、30fps、1920×1080；八词为 construct、construction、structure、instruct、instruction、reconstruct、destruct、obstruct。
- 记忆钩子为“橙色积木骨架”：`struct` 表示建造/搭建，前缀决定如何处理结构，后缀表示过程、结果或内容。
- 生成并视觉复核 9 张 2848×1600 RGBA 小黑动作插图；退回并重做完整工地、房间式大框/伪文字、地标塔形候选，最终 9/9 残绿 0%。
- 图标检索记录为零采用；结构箭头、构词地图、例句强调和总结表均由代码绘制。
- 正式成片为 3360 帧、112.000s 时间轴、H.264/AAC、峰值 -2.87 dBFS，0 个允许长静音窗口；结尾 0.7 秒部分压暗至 70%。
- 双封面通过：1080×1440 与 1200×900，均不透明、四角纯白、八词完整。
- 无主题权威样片，使用 Press 系列样片完成 16 对风格校准；报告、对比、抽帧和发布文案均位于 `outputs/struct/`，release 状态为 draft。
# 2026-07-30 — FLECT / FLEX = BEND / 弯曲

- 新增 `flect-flex` 项目：12 场、112 秒、30fps、1920×1080；八词为 reflect、reflection、deflect、inflect、flexible、flexibility、reflex、inflexible。
- 记忆钩子为“橙色软杆”：`flect / flex` 是同源变体，弯曲方向与能否弯曲共同决定词义。
- 配音首轮 6 场超过 1.16×语速门禁；压缩并重配后全部进入门禁，reflect 为 1.152×的可接受轻微加速。
- 生成并多轮视觉复核 9 张 2848×1600 RGBA 小黑动作插图；淘汰地面线、镜架、盾牌支架、插头式杂物、伪签名、人体化角色和平台式 reflex 版本，最终 9/9 残绿 0%。
- Iconfont 定向项为“弯曲 / 反射 / 柔韧”，因无完整逐项商用许可链路而零采用；箭头、关系图与总结表全部代码绘制。
- 正式成片 3360 帧、112.000s 时间轴、H.264/AAC，结尾 0.7 秒部分压暗至 70%；双封面为 1080×1440 与 1200×900。
- 无本主题权威样片，使用 Press 系列样片完成 16 对风格校准；交付、报告、对比与抽帧均位于 `outputs/flect-flex/`，release 为 draft。

# 2026-07-30 — Wan 动态补救终止与成本规则收尾

- 按用户最新决定停止后续 Wan 补救，不再为既有静态视频提交图生视频任务。
- 本轮已完成并重新渲染的动态项目为 `form`、`struct`、`flect-flex`、`dict`、
  `script-scrib`；此前已完成动态接入的 `tract` 与 `ject` 保持不变。
- `press`、`reg`、`fer`、`bouba-kiki`、`port`、`spect`、`vis-vid`、`aud`
  保持静态小黑，不再补做 Wan。
- 上述 8 个未补做项目只生成过 86 个本地白底输入/辅助文件，任务或清单文件为 0，
  没有提交 Wan、没有新增模型费用。目录位于 `work/wan-white/<slug>/`；递归删除被当前
  执行环境安全策略拦截，已标记为可再生、可安全手动删除。
- 项目内与全局 `build-root-word-video` Skill 均改为：默认静态小黑源图配合 Remotion
  确定性动画；API Key 的存在不构成付费授权；只有用户在当前任务明确指定 Wan、
  图生视频或生成式动态小黑时才允许提交任务。
- 收尾验证通过：TypeScript typecheck 成功；`dict` 与 `script-scrib` 均为 3360 帧、
  零异常长静音；项目与全局 Skill 均通过 `quick_validate.py`。

# 2026-07-30 — 发布状态改回文件夹名直观标识

- 按用户偏好恢复文件夹名标识：`draft` / `approved` 使用 `outputs/<slug>/`，
  `published` 使用 `outputs/<slug>发了/`；`release.json` 继续保留作机器可读记录。
- 已根据现有发布清单将 `aud`、`dict`、`ject`、`port`、`spect` 重命名为带“发了”
  后缀的目录，其余项目保持标准 slug，因而可在资源管理器中一眼区分。
- `replica:release` 已同步改造：设为 `published` 时自动加“发了”，退回 `draft` 或
  `approved` 时自动移除；若同一项目两种目录同时存在则停止并报错，避免分叉。
- `docs/DELIVERY_WORKFLOW.md`、项目 Skill 与全局 Skill 已同步更新。

# 2026-07-30 — 全系列画面留白优化

- 对 15 条正式成片统一抽取 6–102 秒的 9 个时间点，确认多数逐词页存在主体偏小、
  左右信息孤立和下半区无功能空白；`ject` 的动作框、方向线和持续结构最佳，设为密度基准。
- 公共连续舞台改造：新式逐词页的小黑动作安全区扩大约 25%，构词、公式和义项向中部
  收拢，并加入代码绘制的“拆词 → 看动作 → 得词义”教学轨道。
- 旧式插图页只放大现有插图 14%；旧式纯文字页轻微放大文字，并以低对比词根水印强化
  语义。开场、转场、例句和总结页不机械填满。
- 重渲染除密度基准 `ject` 外的 14 条成片；已发布的 `aud、dict、port、spect` 直接写回
  各自“发了”目录，没有生成重复标准目录。
- 14 条新版成片全部通过完整解码、帧数、音频峰值和长静音检查。九帧非白像素占比提升：
  `dict +51.0%`、`tract +39.8%`、`form +38.1%`、`script-scrib +37.9%`，
  其余新式项目约 +31%–33%，旧式项目按保守策略提升 +6.6%–19%。
- 改版前后接触表、统计和书面结论位于 `work/layout-audit/`；项目与全局 Skill 已增加
  结构化留白、动作尺寸和九帧占用审查规则。
- 批量渲染产生一次性 `build/` bundle 缓存约 3.55 GB；精确路径已核对，但当前执行环境
  阻止递归删除。该目录不是交付物、可安全手动删除，也可在近期继续渲染时暂时复用。

# 2026-07-30 — STRUCT 与 FLECT/FLEX 静态半透明卡片重制

- 按用户要求将 `struct`、`flect-flex` 从 Wan 白底动态帧改回静态卡片；删除两项目运行时
  `dynamicAssets` 映射，不新增或提交任何 Wan 任务。
- 两项目改用已验收的 2848×1600 RGBA PNG，9/9 Alpha 素材通过残绿 0% 检查。静态图片
  持有不透明度设为 0.90，使小黑轻微半透明，而透明背景继续透出文字。
- 新增类型化 `staticCardMode` / `staticImageOpacity`：静态卡片模式关闭语义图片位移与镜头
  漂移，只保留图层自身淡入淡出，从根源上避免白底图片运动时覆盖文字。
- 两条正式成片重新渲染；均为 3360 帧，`struct` 峰值 -2.87 dBFS、`flect-flex`
  峰值 -2.76 dBFS，均无异常长静音。最终九宫格位于 `work/static-card-review/final/`。
# 2026-07-30 — FLECT / FLEX retention-hook and kinetic-text rebuild

- Rebuilt the existing `flect-flex` episode under the updated global and repository-local
  `build-root-word-video` Skill. No Wan/image-to-video task was submitted; the accepted transparent
  static Xiaohei assets remain the semantic actors.
- Replaced the static `FLECT / FLEX = BEND` opening with a viewer-test hook: `reflect`,
  `flexible`, and `reflex` enter in staggered order; the answer “都在弯” lands at 1.48s; the root
  appears at 2.18s; and the complete meaning is visible by 3.0s.
- The first draft exposed a short text collision at the answer handoff. Shortened the three test
  word holds and question hold so they exit over 1.48–1.64s before the answer/root tableau settles.
- Removed the generic `拆词 → 看动作 → 得词义` rail from the shared continuous renderer. Formula
  text now uses anticipation/directional snap/rebound while meaning text receives a stronger,
  separately timed semantic impact. Morpheme assembly and the root underline remain intact.
- Regenerated only `bend-hook` narration. The accepted source is 8.829s and renders at 1.104×
  inside the 8.0s scene, below the 1.16× maximum.
- Final verification: 3360 frames, 112.000s H.264 1920×1080 CFR 30fps; AAC stereo 48kHz;
  full video/audio decode; peak -2.76 dBFS; zero narration gaps; zero unexplained long silence;
  white pre-fade, RGB 76 final partial-dark frame; 9/9 static assets passed; both covers passed.
- Final hook sheet: `work/flect-flex-redo/hook-final-contact-sheet.png`; full nine-frame review:
  `work/flect-flex-redo/final-nine-frame.png`; Press style comparison and written findings:
  `outputs/flect-flex/comparison-redo/` and `outputs/flect-flex/comparison-findings.md`.
# 2026-07-31 — FLECT / FLEX semantic-prop motion trial

- Built a non-destructive 43.533s motion trial for the four-scene sequence `reflect → deflect →
  inflect → flexible`. The existing 112s delivery MP4 remains untouched.
- Added typed `semanticPropTrack: 'flect-flex'` configuration to the continuous stage and a
  reusable SVG semantic-prop overlay. Static transparent Xiaohei remains the primary actor; no
  Wan task or paid generation was used.
- `reflect` now draws an outbound ray, reveals the mirror contact, then bends the ray back with a
  moving endpoint. `deflect` moves a ball into a barrier and redirects it along a new path.
  `inflect` draws a changing pitch curve with a moving cursor. `flexible` draws a soft path around
  two obstacles and moves a bead along the bend.
- Trial output: `work/flect-flex-motion-trial/flect-flex-motion-trial.mp4`. Matching old-render
  baseline: `work/flect-flex-motion-trial/flect-flex-baseline.mp4`. Motion contact sheet:
  `work/flect-flex-motion-trial/motion-contact-sheet.png`.
- Both preview MP4s fully decode. Trial media is H.264/AAC, 960×540, 30fps, 1306 video frames,
  43.533333s video, and 48kHz stereo audio. The half-resolution preview is for visual direction
  approval only; it is not a replacement delivery master.
# 2026-07-31 — FLECT / FLEX semantic-stage v2 accepted direction

- User approved the semantic-prop motion pilot and set it as the durable anti-PPT direction.
  Updated both global and repository-local Skills plus visual-style and quality-gate references:
  semantic props now require preparation/contact/consequence/settle, at least three distinct
  physical mechanisms per multi-word episode, illustration-aligned contact points, and meaningful
  cross-scene handoff when possible.
- Extended the `flect-flex` typed `semanticPropTrack` from four to all eight word chapters:
  reflected ray, reflection echo/ripples, deflected ball collision, inflected pitch wave,
  flexible obstacle path, flexibility shape changes, reflex spring compression/rebound, and
  inflexible force/resistance.
- Added a 28-frame orange semantic-thread handoff at seven adjacent word boundaries. Draft
  boundary contact sheet confirms no teaching-text/caption collision, false spelling, double
  prefix, dense tableau overlap, or blank white page.
- Preserved the prior formal MP4 as
  `work/flect-flex-semantic-v2/flect-flex-before-semantic-v2.mp4`, then replaced the draft delivery
  with the verified v2 master. No Wan tasks or paid generation were used.
- Final gates pass: TypeScript, 12-scene project validation, 9/9 RGBA assets at 0% green residual,
  3360-frame full H.264/AAC decode, 1920×1080 CFR 30fps, 112.000s video, -2.76 dBFS peak, zero
  narration gaps, zero unexplained long silence, both opaque cover gates, white-to-70%-dark ending.
- Direct evidence: `outputs/flect-flex/semantic-v2-before-after.png`,
  `outputs/flect-flex/semantic-v2-findings.md`, plus draft action/boundary sheets under
  `work/flect-flex-semantic-v2/`.

# 2026-08-02 - RUPT continuous semantic stage

- Built new `rupt` episode under the continuous-stage direction with an unfinished semantic-action
  hook: a live waveform is cut by an orange inter-bar in the first three seconds, then the frame
  reveals `rupt = break`.
- Selected eight related teaching words: `rupture`, `interrupt`, `disrupt`, `erupt`, `corrupt`,
  `bankrupt`, `abrupt`, and `incorruptible`.
- Added typed `semanticPropTrack: 'rupt'` with distinct code-driven mechanisms: split shell,
  between-bar interruption, scattered block order, outward burst, contamination spread, broken
  bank counter, abrupt rail stop, and a circular no-corruption boundary.
- Generated nine transparent Xiaohei assets. All passed RGBA/coverage/green-residual QA; `erupt`
  and `incorruptible` were regenerated after draft inspection removed floor marks and an oversized
  rectangular boundary. No Wan or image-to-video generation was used.
- Draft review fixed a right-layout text collision and a `don’ t` typography spacing issue. Final
  audio review found and repaired one hidden 2.216s narration gap in `disrupt` before the final
  render.
- Final delivery: `outputs/rupt/rupt.mp4`, 122.1s, 3663 frames, 1920x1080 CFR 30fps, H.264/AAC,
  48kHz stereo, max peak `-2.84 dBFS`, zero narration-only gaps, zero allowed long-silence windows.
  Both cover gates pass. Formal keyframes are under `outputs/rupt/review-stills/final-beats/`.
- External Iconfont assets were not inserted; code-drawn props were clearer and the episode manifest
  records the rejected optional pass.

- 2026-08-02: Added the independent `meme_vocab_short` vertical pipeline on branch
  `feat/meme-vocab-short`. The `interrupt` example now emits three distinct hooks, a five-part
  storyboard, Jimeng prompts, an asset manifest, publish copy, JSON config, and an explicit
  placeholder-backed 1080x1920 Remotion Composition. The low-resolution draft rendered 22.0s at
  540x960 with BGM and passed structural/media QA with warnings for five assets that still need
  real Jimeng replacement images and for the draft resolution. The existing long `replica` path
  remains registered and `rupt` validation still passes.

- 2026-08-02: Upgraded `meme_vocab_short` to real DashScope TTS timing. The interrupt package now
  generates five independent WAV segments, records source leading/trailing silence, trims only
  TTS padding from playback copies, builds a frame-quantized resolved timeline, and mixes a
  deterministic narration WAV with planned scene gaps and quiz thinking time. The measured
  interrupt timeline is 21.200s / 636 frames; low-resolution output is
  `output/interrupt/final-with-tts.mp4`. Audio/media QA passes with only placeholder-image and
  draft-resolution warnings.
- 2026-08-02: Freeze hardening completed. Word Reveal TTS compression reduced the interrupt segment
  from 7.302s to 4.186s after two copy reductions; the final resolved timeline is 18.067s / 542
  frames. `MemeVocabShort` now uses Remotion `calculateMetadata` from the runtime
  `resolvedTimeline.totalFrames`; the production renderer passes nested `{config}` props and no
  longer supplies a manual end-frame range. The 540x960 render is `output/interrupt/final-with-tts.mp4`;
  media/composition duration delta is within two frames. QA passes with only placeholder-image and
  low-resolution-draft warnings. No further feature work is planned for this mode.

- 2026-08-02: Completed the `mit-miss` semantic-v2 root-word episode. The 122.1s / 3663-frame
  production teaches submit, transmit, emit, admit, permit, commit, dismiss, and mission through
  eight distinct send-direction mechanisms. A rotary dispatch hook reveals the root after 2.55s;
  orange capsules bridge adjacent scenes. The corrected draft was reviewed at 37 hook, climax,
  boundary, and ending frames. Final render, both covers, copy, voice segments, BGM, transparent
  art, reports, and review stills are archived under `outputs/mit-miss/`. All type, asset, timeline,
  cover, and render checks passed; no paid video-generation service was used.

## 2026-09-11 — Inventory and organization (no media production)

- Rebuilt project/delivery navigation; added docs/project-audit with inventory, architecture, Skills, artifact audit and optimization proposal. Prior entry documents retained in docs/history/2026-09-11/.
- Added read-only inventory refresh and existing-media thumbnail helper. Created a 17-cover overview and 16 decoded sample frames across press/flect-flex/rupt/mit-miss, with exact sources/timestamps in visual-index.json.
- Typecheck, existing short-video lint/test, and all 17 replica:validate commands passed. Speech-rate warnings are retained in docs/project-audit/validation-results.json; no new content or full audio approval is claimed.
- Corrected local Skill scope and contradictory references; metadata validation passed. No original video, cover, source, audio, experiment, or release record changed, and no generation endpoint was called.

## 2026-09-12 — Directory organization; no new media render

Moved 143 entries / 1896 files with SHA-256 verification and preserved 153 protected delivery files. See docs/project-organization/RESULTS.md and migration/preservation records. Current navigation PROJECTS.html, per-episode README, and docs/项目管理流程.md supersede old path instructions.
Drafts now work/drafts; review evidence now episode review/; original interrupt and Wan trials in work/experiments. Runtime public media retained. Delivery resolver, release metadata preservation, staged formal render/previous-version backup, and non-overwriting content QA are tested. No video or audio content changed; no generation interface invoked.

## 2026-09-12 — MIT/MISS semantic key-pose trial

Updated the local build Skill, visual rules, QA gates, schema and UI prompt to default to causal static key poses with readable holds. Removed forced physical-mechanism counts, obligatory float/drift and the four-second stillness ceiling. Added references/key-pose-storytelling.md, including a fixed-layer fallback after repeated generation drift.

Latest original selected by MP4 modification time: mit-miss. Full trial: work/experiments/mit-miss-keyposes/mit-miss-keyposes.mp4; navigation, comparison player, covers, source prompts and review evidence live beside it. Eight word chapters use 24 states. Four groups use Seedream pose generations; four groups reuse an accepted raster actor with deterministic static relationship layouts after generated identity/geometry failures. No Wan or new TTS. Narration, captions, original BGM and duration preserved; old unmatched SFX removed in the trial only.

Validated 2256 exclusive image-frame intervals; extracted/reviewed 128 encoded frames and original comparisons. Fixed inherited non-word end gaps by holding layers through scene ends, re-rendering head/tail and preserving audio packets. Final technical validation: 1920x1080, 30/1 CFR and average rate, 3663 frames, 122.1s, peak -2.83 dBFS, full decode passes, no unexplained long silence. Typecheck and Skill metadata validation pass. All 153 protected originals and 1896 migrated payloads still match saved hashes. Full human listening/watch review and content QA are not claimed; no release status changed.

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


## 2026-09-13 · 新人交付入口与作文第二版

新增根目录 00-打开工作台.html 和 00-新手先看.txt；工作台前置成片下载、双封面、可复制文案和三平台投稿入口，计划管理折叠。作文第二版另存 outputs/cet4-writing-paragraph-v2，原试片与源码快照保留。新增考场应用、换词陷阱、迁移例子与自检，19 段配音共 158.67 秒；删除右上步骤导航与侧栏批注。长期标准同步 AGENTS、规则文档、Skill 和项目记忆。检查结果见新版 review/REVIEW.md。

## 2026-09-19 — Images2 与人味化动效基线

- Images2 中转站真实单图测试成功，模型为 `gpt-image-2`；Windows 使用 `curl.exe` 规避 Node 直连超时。接口返回约 1672×941，新增低分辨率自动放大到 2048×1152，再执行去绿幕和透明素材 QA。测试报告及图片保存在 `work/experiments/images2-relay-test/`。
- `GenericContinuousStage` 默认使用 humanized motion profile：删除无语义的 float/breathing 与整页 flow，保留动作帧附近的 anticipation/contact/settle、词素组装、局部图像位移、文字轻微响应和白底安全区。章节 badge 与 legacy root watermark 改为显式 opt-in。
- 使用 `mit-miss` 的最小公共素材目录渲染了 4 个关键静帧，确认开场动态、submit 动作高潮、总结首批行和原有文字安全区。完整草稿渲染没有覆盖原文件；因全量 `public/` 含历史动效帧导致复制量超过 2GB，整期隔离草稿未继续执行。
- `generateVoice.ts` 新增 natural delivery 默认：后续新合成默认速率不高于 1.08，并发送真人讲解风格指令；既有音频保留，未调用 TTS 接口。

## 2026-09-19 — 人味化隔离成片与工作台补索引

- `mit-miss-humanized-draft.mp4` 在最小 public 目录下完成隔离渲染，960×540、30fps、122.15 秒；抽查编码后开头、submit 动作、场景边界和总结页，确认局部关键帧已进入实际 MP4，正式 `outputs/mit-miss/` 未覆盖。
- submit 场景仍保留蓝色 SVG 语义叠层，已记录为下一轮的明确改动点：humanized 默认应关闭或弱化整屏穿插的语义道具，让静态语义图和局部关键帧承担动作；旧叠层版本继续保留用于比较。
- 工作台生成器新增 `work/experiments` 自动索引，只展示视频、对比页、预览、README 和报告；当前工作台已显示 6 个试验入口，解决关键姿态版、流畅版、人味化隔离试片和绘图测试“磁盘有但首页不可见”的问题。`npm run project:inventory` 已通过，17 个正式项目与 4 个历史状态冲突保持原样。

## 2026-09-19 — Sunburst 参考图编辑链路固化

- 确认 `work/experiments/openai-image-endpoint-test/` 中 2026-09-12 的 `gpt-image-2.5-sunburst` `/v1/images/edits` 结果为用户认可的视觉金样；复制一套稳定基线到 `assets/visual-baselines/mit-miss-sunburst/`，原试验保留。
- 中转站 key、base URL、文生图模型和编辑模型统一到项目根 `.env`；`.env` 已被 Git 忽略，日志/报告未输出 token。`/v1/models` 实测仍列出 `gpt-image-2` 与 `gpt-image-2.5-sunburst`。
- 新增 `editOpenAICompatibleImage`、`generateReferenceKeyPoses.ts`、npm 命令 `replica:keyposes:edit` 与示例计划。实际执行一次 Sunburst 编辑，生成 submit 交接中状态；before/change/result 三张图归一化为 2048×1152 透明 PNG，素材 QA 3/3 通过。
- Skill 新增参考图编辑规则：同一母版分别编辑姿态、禁止累计串改、局部关键帧取代整屏 SVG。渲染器的全画布语义道具改为显式 opt-in；mit/miss humanized 配置明确关闭蓝色机械叠层。
- 重渲染 mit/miss frame 720 验证：旧蓝色 SVG 机械线和跨图轨迹不再出现；保留的升降机属于旧 raster 插图本身，待正式重做时替换为 Sunburst before/change/result。
- 工作台刷新后显示 7 个试验入口，新增 Sunburst 三姿态和原始金样。typecheck、项目管理回归测试通过；健康检查保持既有 PASS_WITH_NOTES。

## 2026-09-19 — duc / duct 角色锁定版完整制作

- 用户反馈早期词根图偏成通用火柴人，暂停沿用该角色并将旧版保留在 `work/experiments/duc-duct/rejected-character-v1/`；新增 `docs/小黑角色验收规则.md`，把小黑母版、白底复合预览和拒绝条件固化进制作链路。
- 选题为 `duc / duct / duce = lead`，制作 11 个场景、134 秒完整教学视频。7 张语义图均从已接受的 `mit-miss` 小黑母版裁切角色，再用透明层绘制方向、路径、门、车和卡片等道具，未重新生成角色。
- 角色锁定素材 7/7 通过自动素材 QA；`npm run typecheck`、项目校验、成片严格渲染检查和双封面检查通过。最终成片为 1920×1080、30fps、4020 帧，音频峰值 -2.54 dBFS，无异常长静音。
- 首次完整高分辨率渲染已完成但尾部留下 2.211 秒被 BGM 掩盖的旁白覆盖间隙；随后一次重渲染在接近完成时退出。保留已完成高分辨率渲染，按精确帧边界裁到 134 秒并重建末尾逐帧淡出，最终严格验收通过。
- 交付到 `outputs/duc-duct/`，台账、项目记忆与工作台已同步；未自动发布或上架。

## 2026-09-19 — mit / miss Sunburst 完整重制版

- 将参考图编辑计划扩展到 submit、transmit、emit、admit、permit、commit、dismiss、mission 全部 8 组；每组从固定母版生成 before/change/result，24 张透明素材均通过自动素材 QA，并生成总览图。
- 关键姿态装配脚本和丝滑文字脚本支持自定义素材集与输出目录；新链路可以在不覆盖旧版的前提下复用原旁白、字幕、BGM、双封面和节奏。
- 完整成片保存在 `work/experiments/mit-miss-sunburst-full/mit-miss-sunburst-full.mp4`：1920×1080、30fps、3663 帧、122.15 秒、H.264/AAC。render verify 通过，峰值 -2.83 dBFS，无异常长静音。
- 最终 MP4 多段抽帧确认蓝色 SVG 机构不再出现，Sunburst 小黑动作、丝滑文字和字幕均进入成片。新版已置于根工作台交付区首项；历史 `outputs/mit-miss/` 未覆盖，未发布。
- 复核现有四级作文第二版：`outputs/cet4-writing-paragraph-v2/cet4-writing-paragraph.mp4` 为 158.72 秒、1920×1080、H.264/AAC 完整成片，双封面、文案、脚本、练习单和检查报告齐全。

## 2026-09-19 — duc / duct Sunburst 手绘关键姿态修订

- 用户指出 `duc / duct` 首版虽然锁定了小黑角色，但仍沿用“单张大语义道具”的旧流程，视觉效果像 SVG 图形压过角色，且没有真正实现 `mit-miss` 的 before/change/result 关键帧。
- 先生成 6 张手绘语义母版，再从同一母版分别编辑 18 张透明姿态；失败候选与旧单姿态版保留在 `work/experiments/` 和 `work/delivery-backups/`，没有覆盖历史证据。
- `ducDuctStoryboard.ts` 改为每个词三张固定机位、固定尺寸、互斥静态图片层，切点为 3.1 秒和 5.2 秒，图片层不做进出场插值；全画布 SVG 语义层没有接入。白底复合总览为 `outputs/duc-duct/review/handdrawn-keypose-contact-sheet.jpg`。
- 正式版重新渲染完成：`outputs/duc-duct/duc-duct.mp4`，1920×1080、30fps、4020 帧、H.264/AAC、音频峰值 -2.87 dBFS、0 个异常长静音窗口；双封面和文案生成、视频与封面验证通过。未自动发布。

## 2026-09-21 — cred = believe / trust 词根完整制作

- 查重后选定未制作的 cred，完成 credible / credulous / incredulous / incredible 辨析及 credit 词族迁移讲解；事实核对与词源助记边界记录在 outputs/cred/content-qa.md。
- 以已接受的小黑角色参考生成并复核 9 张 before/change/result 关键姿态；修正移动端复习页后重渲染。成片为 outputs/cred/cred.mp4：1920×1080、30fps、5664 帧、188.8 秒，完整解码通过，峰值 -2.75 dBFS，无异常长静音或旁白间隙。
- 双封面、发布文案和检查记录已齐全；首次刷新将本期置为默认项，后续对照审计发现词图错配后，已恢复最新已接受的 mit/miss 样片为默认项，cred 仍以草稿留在项目列表。编码成片 16 个场景中点画面已抽查，完整人工视听复核仍待完成；状态保持草稿，未发布。TTS instruction 参数返回 HTTP 400，按现有回退路径使用同一音色标准合成。

## 2026-09-21 — cred 对照审计：当前草稿不通过语义画面审核

- 更正本期首轮审核：此前“没有提供外部对照样片，因此未做对照复刻”遗漏了项目内最新样片。2026-09-19 的 work/experiments/mit-miss-sunburst-full/mit-miss-sunburst-full.mp4 是应采用的系列对照；此前未按 Skill 第 9 步运行逐帧样片对比。
- 对照抽帧及源码检查发现，最新 mit/miss 为 8 个词各自一套三态（24 张）；cred 只做 3 套（9 张），将 credible 姿态复用给 credibility/credit/creditable、将 incredulous 姿态复用给 incredible/discredit。incredible 与 incredulous 是本期重点辨析，画面却相同，语义冲突；creditable 与 discredit 也缺少各自匹配的视觉表达。联系表和分析见 outputs/cred/review/AUDIT-2026-09-21.md。
- 本期音频的 instruction 参数曾返回 HTTP 400 并回退到标准合成；未完成逐段人工听审。编码、解码和静音结果只代表技术通过，不代表本期整体质量合格。release 保持 draft，不发布；选题计划退回制作阶段等待返工。
- 根因：制作 Skill 是逐步规程，不是全链路批处理器；各 CLI 命令互相独立，姿态生成按清单串行处理，而且没有自动词义—画面映射检查。此次我把提示词/素材QA和成片技术验收误当成足够的完成证据，漏执行样片对照和逐词语义复核。

## 2026-09-21 — cred v2 返工与制作链路拦截

- 返工版将 credible、credibility、credulous、incredulous、incredible、credit、creditable、discredit 八个词分别绑定唯一 before/change/result 姿态，共 24 张；最终 MP4 16 场、196.8 秒、1920×1080、30fps、5904 帧，完整音视频解码通过，峰值 -2.79 dBFS，异常长静音与旁白覆盖空档均为 0。
- 对最终编码 MP4 的 32 个姿态切点前后帧、360px 下 16 场移动缩图及最新已接受的 mit/miss 样片 16 点共同区间接触表完成复核。样片对照按绝对共同时间取点，记录了时长差异，不冒称章节节奏一一对应；完整边界巡检和整片听审仍待完成。
- 自动化拦截包括逐词唯一画面与总结覆盖预检、素材评审未通过禁止渲染、TTS 文案/Profile 指纹失效重合成、拒绝静默去掉 instruction、图片编辑有限重试/并发续跑、旁白覆盖空档渲染前预测、按本片引用清单暂存 public 素材、最终 MP4 姿态切点提取。
- 成片渲染从复制全项目 3.37 GiB public 缩至 45 个文件、30.1 MiB；无需重做无关历史素材。项目校验、预检与 TypeScript 类型检查通过；配音和语义画面问题不再被媒体技术通过掩盖。
- 最新产物位于 outputs/cred/，release 维持 draft，未发布。返工与样片方法见 outputs/cred/review/REWORK-2026-09-21.md 和 SAMPLE-COMPARISON-NOTES.md；旧 v1 与审计证据继续保留。

## 2026-09-22 — cred v3 抖音节奏、视觉与音乐返工

- 全部 16 段旁白改写为更自然的口语并重新合成，删除通用 AI 套话；成片从 196.8 秒收紧为 178.6 秒。新增编辑风格硬门禁，拦截“不是……而是……”“别再……”“先别……”等高频模板。
- 词汇页由机械左右交替改为左、右、居中主视觉三种构图；图片层支持静态主体缩放。词族、例句、练习、答案和总结页改为多张语义图随讲解切换，画面层从 89 增至 102。
- 在 MiniMax 中国站 Music-3.0 生成 4 个纯音乐候选并下载到 `assets/background-music/minimax/candidates/`。机器初筛采用约 112.3 BPM 的 v1，做成 630 秒交叉淡化母版并接入系列运行时；旧 BGM 已备份。
- 修复“有音乐文件但听不见”的混音问题：旧源平均约 -20.4 dB，旁白下 0.045 导致估算约 -47 dB；新版母版平均约 -19.4 dB，旁白下 0.11 估算约 -38.6 dB。项目校验新增背景音乐可听度门禁。
- 新版 MP4 为 1920×1080、30fps、5358 帧；最终媒体校验通过，峰值 -2.33 dBFS，无超限长静音；双封面和项目专属发布文案已更新。release 保持 draft，未自动发布，完整手机外放与耳机听审待完成。

## 2026-09-22 — 四级翻译：先找主干，再处理修饰

- 核对选题台账和实际产物后，采用内容计划中尚未制作的四级翻译题目；示范句与志愿活动迁移句均为原创，参考译法明确不唯一。
- 完成 18 段自然口语旁白、174.63 秒时间轴、4 张新小黑语义插图、丝滑文字关键帧、系列 MiniMax 欢快纯音乐、双封面、发布文案和分层翻译练习 PDF。
- 画面覆盖拆主干、博物馆语义、两个并列好处和志愿活动迁移；重复角色的失败候选未进入运行时素材。编码抽帧总览保存在 `outputs/cet4-translation-main-clause/review/contact-sheet.jpg`。
- 正式成片为 1920×1080、30fps、5239 帧、H.264/AAC；用户试听后反馈背景音乐过大，已把固定 0.11 改为动态压低：人声段 0.035，停顿和转场最高 0.06，并加入短攻防过渡。重渲染后完整解码通过，峰值 -5.0 dBFS、整片约 -19.8 LUFS，无异常长静音。旁白优先规则已写入项目总制作 Skill、词根制作 Skill 和默认配置。当前保持草稿，未发布；整片人工观看与手机外放/耳机听审待完成。

## 2026-09-23 — 四级翻译封面对齐词根母版

- 用户指出原四级翻译封面过于简单；保留旧版于 `outputs/cet4-translation-main-clause/review/cover-history/`，新版改用正式 `RootWordCover` / `RootWordLandscapeCover` 组件。
- 新版保留词根封面的完整视觉语法：蓝色圆角框、小黑品牌位、橙色栏目胶囊、眉题、主标题、箭头、右侧语义图、钩子条、底部胶囊和系列页脚；仅替换为 CET4 翻译内容。
- 项目总制作 Skill、词根制作 Skill 和机器默认配置已增加“全栏目统一词根封面母版”规则；TypeScript 检查、封面渲染和移动端抽查通过。

## 2026-09-28 — ten / tain 词根视频制作中

- 查核选题台账、注册项目、成片、草稿和试验目录后，选定尚未制作的 `ten / tain = hold / keep`；先登记为 `in_progress`，避免后续自动选题重复占用。
- 完成 14 场、约 146.8 秒的自然口语讲稿和 CosyVoice 配音，覆盖 retain、contain、maintain、obtain、detain、sustain、entertain、abstain 八个词，并加入词族归类、选择题和答案讲评。
- 八个目标词各自绑定独立的 before / change / result 三张小黑关键姿态；预检与项目校验通过，草稿抽帧已检查开场、词汇页、练习页和总结页。
- 沿用共享 MiniMax 纯音乐和旁白自动 ducking；根据当前音源电平把系列默认混音从 `0.06 / 0.035` 调整为 `0.08 / 0.07`，仍保持旁白优先，校验只保留“手机外放可能偏轻”提醒。
- 正式成片已交付至 `outputs/ten-tain/`：1920×1080、30fps、4404 帧、146.8 秒；峰值 -2.72 dBFS；render verify、双封面 verify 和代表性抽帧通过。台账已改为 `produced`，工作台已刷新到本期；未发布。

## 2026-09-28 — ten / tain 配图返工：跨期复用修正

- 复核最新成片后确认首版运行时素材目录虽命名为 `ten-tain`，实际映射了 `mit/miss` 与 `duc/duct` 的旧期姿态；这解释了视频中出现旧配图的问题。首版视频与旧素材均保留在 delivery backup 和 `work/experiments/ten-tain-v1-legacy-assets/`。
- 新增 `src/replica/tenTainIllustrationPrompts.ts`，按八个词各生成 before / change / result 三态，共 24 张本期专属素材，写入 `public/assets/replica/ten-tain-v2/`；中转站短暂失败和两张边缘带 QA 失败均按续跑规则处理，最终 24/24 通过透明底、主体占比、绿色残留和边缘带检查。
- 更新 storyboard、封面 illustrationPath 和 keypose plan 到 `ten-tain-v2`，完成 plan-only/full preflight、草片抽帧和正式 146.8 秒成片重渲染；最终 MP4 1920×1080、30fps、4404 帧、峰值 -2.72 dBFS、完整解码通过，双封面验证通过。
- 在总制作 Skill、词根 Skill、默认配置和 `wordVisualCoverage.ts` 加入运行时素材来源闸门：旧图可作为生成参考，不能作为新片运行时来源；计划必须记录 asset provenance，跨期路径会在渲染前失败。后续所有英语视频请求继续先加载项目总制作 Skill，再按栏目加载对应 Skill。
## 2026-09-28 — ten / tain v3 生图模型返工

- 用户指出上一轮 v2/v3 草稿仍偏离最新 `mit/miss`：人物和道具漂移、伪文字、重复角色，且代码绘制兜底看起来像 SVG。先停止渲染，保留失败候选与代码试验到 `work/experiments/`。
- 以 `public/assets/replica/mit-miss-images2-keyposes/submit-result.png` 作为风格和角色参考，使用 Codex 内置 `image_gen`（gpt-image-2）重新生成十/tain 八个词的 24 张透明位图；每个词独立 before / change / result，不使用运行时 SVG 或代码形状。
- 新素材统一为白底留白、单一黑色小黑、手绘纹理、橙蓝灰局部道具和清楚的因果动作；全部安装到 `public/assets/replica/ten-tain-v3/`，24/24 资产 QA 通过。连续阶段沿用 `mit/miss` 的静态卡片、文字组装与关键帧切换。
- 正式成片重新渲染到 `outputs/ten-tain/ten-tain.mp4`：1920×1080、30fps、4404 帧、146.8 秒；render verify 和双封面 verify 通过。未发布，仍等待用户手机外放、耳机与整片观看。
- 制作 Skill 新增 provider 失败/伪文字/样式漂移拦截和失败素材归档规则；后续除非用户明确接受，不得用代码绘制冒充生图模型结果。

## 2026-09-29 — 整片预览闸门与文字溢出修复

- 用户反馈最新词根片存在画面文字溢出。整片每秒抽帧预览确认：连续舞台同时对新式右栏文字和 `MorphWordBuild` 叠加旧版 760px 位移，导致 contain、obtain、sustain、abstain 等词只露出一部分。
- 修正 `GenericContinuousStage`：只有仍在左栏的旧 storyboard 才应用兼容位移，已放在右栏的文字和组装词不再重复平移；ten / tain 正式片重新渲染，右栏词页全词可见。
- 新增 `replica:full-preview`：生成可连续观看的低清整片、每秒时间轴联系页和 `full-preview-report.json`；自动检查文字画布/安全区布局，人工检查整条时间轴的溢出、大片空白、图文比例、关键帧切换和手机可读性。
- 已将生图风格、基本教学套路、动画规则和最终整片预览闸门固定进总制作 Skill、词根 Skill、AGENTS、默认配置和新会话入口。Skill 校验与 TypeScript 检查通过；当前仍未发布，手机外放/耳机终审待用户完成。

## 2026-09-29 — 统一当前成片基准，停用旧制作路线

- 用户确认最新 `ten / tain` 成片的视觉、节奏、留白和动画作为后续项目基准；`mit / miss`
  Sunburst 继续作为同母版动作锚点。
- 新增 `docs/当前制作基准.md`，覆盖所有英语视频：词根、四集系列、词汇辨析以及四六级
  写作、阅读、翻译。栏目只可调整教学内容和叙事顺序，不能另起低规格视觉链路。
- 将内置 `image_gen` 栅格生图、白底小黑、before/change/result、帧驱动动画、纯音乐混音、
  词根封面母版和整片预览写入跨会话入口、总 Skill、词根 Skill、默认配置和绘图说明。
- 旧 Seedream/即梦默认生图、SVG 主插画、重复 PPT 卡片、持续漂浮、只看抽帧和单独的 CET
  低规格流程均标记为停用；历史产物和审计文档保留，但不再具有制作规则优先级。
- `project:check` 现在会检查当前制作基准文件和默认配置指向；TypeScript、Skill 校验和项目
  健康检查通过。

## 2026-09-29 — 六级阅读：先定位，再认同义替换

- 用户只指定“六级视频”，按长期入口自动查核台账、内容计划、正式输出、草稿、试验目录和制作记录，选择尚未制作的 `cet-reading` 主题：定位句与同义替换；本期聚焦主旨题，并使用原创六级风格练习，不冒充真题。
- 完成 14 段自然口语旁白与实测时间轴，最终 4943 帧、约 164.82 秒；内容覆盖题型判断、关键词、原文定位、同义改写、干扰项排除、迁移练习和四步检查。
- 使用内置 `image_gen` 生成 5 张本期专属栅格位图，统一白底小黑、橙蓝手绘语义道具和 `mit / miss`、`ten / tain` 当前风格；运行时只引用 episode-local public bundle。
- 正式产物位于 `outputs/cet6-reading-location-paraphrase/`：1920×1080 成片、词根封面母版的竖/横双封面、讲稿、发布文案、练习单、内容 QA 和验收记录均已生成。
- `replica:full-preview` 已生成低清整片与每秒联系页，共 165 张抽帧；layoutIssues、layoutErrors、layoutWarnings 均为空，代表性页面未发现文字溢出。当前保持 draft，未发布；完整人工观看、手机外放和耳机听审待完成。
- 选题已登记到 `planning/topic-history.json`，内容计划已从“选题”更新为“审核”；后续 Agent 仍从项目入口和台账读取同一生产链路。

## 2026-09-30 — pon / pos 词根视频交付

- 用户只指定“词根视频”，按入口规则核对台账、注册表、outputs、work/drafts、work/experiments 和制作记录后，自动选择未制作的 `pon / pos = put / place`；本期覆盖 compose、expose、impose、propose、oppose、dispose、deposit。
- 完成 14 场自然口语旁白与 168.45 秒时间轴；CosyVoice v3 flash / longanhuan 配音严格保留 instruction，音频清单写入 `src/replica/ponPosAudioManifest.json`。
- 使用内置 `image_gen`，以已接受小黑风格锚点生成本期专属 21 张透明位图；每个词独立绑定 before / change / result，21/21 通过 2048×1152、透明边缘、主体占比和绿色残留检查。锚点中的绿色伪影已拒绝并修订，未进入运行时。
- 正式产物位于 `outputs/pon-pos/`：1920×1080、30fps、5054 帧、约 168.45 秒；render verify 通过，峰值 -2.75 dBFS，0 个允许的长静音窗口；双封面、发布文案、内容 QA、手机 14 场抽帧、28 个关键姿态切点和 `replica:full-preview` 全片预览均已生成。
- 内容 QA 已核对 Cambridge Dictionary 与 Etymonline，并明确 pon / pos / posit 与前缀方向是记忆桥梁，不把简化拆分冒充严格词源。与最新 `ten / tain` 接受样片完成 16 点接触表对照，确认白底留白、三姿态动作、构图变化和节奏属于同一制作基准。
- 台账已更新为 `produced`，工作台已刷新；`release.json` 保持 `draft`，未发布。项目校验仅保留既有背景音乐偏轻提醒，发布前仍需手机外放与耳机听审。


## 2026-10-12 抖音竖屏交付与增长配置

- 新增竖屏重排渲染器 `src/replica/vertical/` 与 `scripts/replica/renderVertical.ts`，复用横屏期配音和插图，不重新生图、不改讲稿。编码 CRF 16、x264 slow、JPEG 帧质量 95；全局 `remotion.config.ts` 同步改为 JPEG 95。
- 交付目录新增 `vertical/<slug>-vertical.mp4`、`vertical/<slug>-teaser.mp4`、`vertical/review-card.png`、`vertical-report.json` 与 `vertical/review/*-contact-sheet.jpg`；工作台交付区增加竖屏完整版、预告和复习卡入口。
- 推广与行动号召统一由 `planning/growth-promotion.json` 配置；资料未上架、领取未开启时不出现购买或领取引导，不放站外联系方式。

## 2026-10-12 小红书图文卡与本地 Codex

- 新增 `npm run xhs:cards`（`scripts/replica/renderXhsCards.ts`、`src/replica/xhs/`）：1080×1440 图文卡与 `xhs-note.md`，只复用本期素材，独立 public 目录渲染。
- `replica:produce --stage=deliver` 串联横屏、竖屏、小红书卡片和文案；新增 `scripts/replica/xhsCards.test.ts` 并入 `project:test`。
