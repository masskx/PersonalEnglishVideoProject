---
name: build-root-word-video
description: Build, reproduce, or maintain the existing 1920x1080 white-background Xiaohei English root-word and sound-symbolism video series, including narration, Remotion motion, two cover formats, publish copy, and quality review. Use for another episode or a scoped change within this series. Project audits and account-level format exploration may consult its conventions without starting production or applying this series layout to new formats.
---

# Build Root Word Video

## Scope and project navigation

This skill defines the established horizontal Xiaohei word-learning series. Its 16:9 master,
white canvas, character, typography, cover grammar, and teaching sequence are series conventions;
they do not constrain every future column or format on the creator's account. Honor the user's
requested task stage. For inventory, organization, or format exploration, inspect and document
the project without automatically generating assets, rendering an episode, or publishing.

Start with the repository [README](../../../README.md) and
[project overview](../../../docs/project-audit/OPTIMIZATION.md). The
[skill inventory and boundaries](../../../docs/project-audit/SKILLS.md) explains the local build
skill, embedded illustration source, external helpers, and what can change in later experiments.
Apply sample-matching instructions when an authoritative sample exists; for an original episode,
use its explicit storyboard and beat map as the timing/content authority.

## Series production purpose

Create a complete project, not a static word card. Treat a supplied sample as the authority for
story order and timing. Otherwise preserve the established series language while designing the
episode from the supplied root information.

All raster illustrations must follow the project-local Ian Xiaohei source skill at
`ian-xiaohei-illustrations-main/ian-xiaohei-illustrations-main/ian-xiaohei-illustrations`,
resolved from the repository root.
Read its `SKILL.md` and relevant references before writing prompts. Require pure white/minimal
black wobbly hand-drawn linework, sparse orange/red/blue annotation, and a solid-black Xiaohei
with white dot eyes and thin legs performing the core action. Reject commercial colored cartoon,
mascot, children's-book, 3D, and PPT illustration language.

Xiaohei is mandatory, not optional decoration. Every core teaching beat and every cover must use
Xiaohei as the primary semantic actor. Iconfont assets are secondary embellishments only: they may
clarify a small concept, state, object, or direction, but may never replace Xiaohei, become the
dominant subject, or reduce Xiaohei's readable action.

## Load the right references

- Read `references/visual-style.md` before authoring any scene or illustration prompt.
- Read `references/config-schema.md` before adding a project or changing the render engine.
- Read `references/background-music.md` before selecting, replacing, mixing, or reviewing music.
- Read `references/iconfont.md` before searching, downloading, adapting, or publishing an external
  icon.
- Read `references/dynamic-xiaohei.md` before generating, matting, looping, or reviewing dynamic
  Xiaohei footage.
- Read `references/whiteboard-hand-drawing.md` when the user asks for a hand-drawn, whiteboard,
  pen-cursor, or “hand holding a pen” reveal on existing raster illustration layers.
- Read `references/quality-gates.md` before generating assets, rendering, comparing, or cleaning.
- Copy from `assets/` only when a new project does not already have an equivalent local pattern.

## Workflow

1. Inspect the repository, `docs/production-log.md`, available media, existing illustrations, SFX,
   the shared background-music master, and registered replica projects. Preserve unrelated and
   user-authored files.
2. Probe every supplied sample with `ffprobe`. Extract readable frames at scene boundaries and
   major beats. Build a beat map containing timing, narration idea, visible wording, layer order,
   illustration, SVG/icon, transition, caption, summary membership, and ending behavior.
3. State a concise production strategy and honor any choices already confirmed by the user. Ask
   only for a genuinely unavailable branded or identity-critical asset. Redraw ordinary missing
   illustrations through the configured image endpoint without interrupting the workflow.
4. Add one project module under `src/replica/projects/`, one storyboard, one audio manifest, and
   one illustration-prompt module. Register it in `src/replica/projects/registry.ts`. Add the
   episode's `cover` metadata plus `paths.outputCover`, `paths.outputLandscapeCover`, and
   `paths.outputDouyinCopy` in the same project module. Keep all four delivery artifacts beside
   one another under `outputs/<slug>/`. Inherit the
   shared `SERIES_BACKGROUND_MUSIC` configuration unless the user explicitly requests a different
   episode score. Keep all paths and sampled exceptions in the project configuration.
5. Author narration and captions scene by scene. Keep the explanation teachable at normal speed,
   then place each visual reveal against the spoken beat. Never infer the final summary from the
   body; encode its rows and order explicitly.
6. Reuse existing assets first. For a missing illustration, generate an isolated subject on
   `#00FF00`, remove chroma in code, and verify the transparent PNG. Draw readable labels,
   arrows, rules, braces, tables, and small icons in code rather than baking them into images.
   For every new unsampled episode, derive a short semantic-icon search list from the approved
   narration and inspect Iconfont through the user's in-app browser session. Select only icons
   that materially improve a teaching beat, match the series line language, and have explicit
   commercial-use evidence. Record rejected searches as well as accepted assets in the episode
   icon manifest. This search is a default quality pass, but it does not require inserting an icon.
   Xiaohei remains mandatory and visually dominant whether an icon is accepted or not. Use an
   accepted icon only as a small supporting layer around the Xiaohei action or teaching diagram.
   Do not put the artist/style name in the model-facing prompt: models may render it as a
   signature. Describe the visual DNA instead. If a branded or mechanically precise subject
   repeatedly produces logos, writing, or bad crops, replace it with a code-drawn, logo-free
   silhouette unless identity is essential and the user supplies an authorized source.
   Reject inset letterbox bars or internal frames even when all four outer corners are
   transparent. Scan near-edge row/column occupancy and review every cutout composited on white.
   Use static Xiaohei illustrations by default, adding only deterministic Remotion transforms
   such as entrance, translation, rotation, scale, and prop motion. The presence of
   `DASHSCOPE_API_KEY` never authorizes paid generation. Run Wan image-to-video only when the user
   explicitly requests Wan, image-to-video, or generated dynamic Xiaohei for the current task.
   When explicitly authorized, first approve the static pose, composite it onto a literal white
   16:9 plate, then generate one native-speed five-second
   `wan2.2-i2v-flash` 480P clip per unique semantic action. Prefer direct RGB frames plus neutral
   white-level normalization; do not matte a clip whose background can remain white. Use the
   green-plate premultiplied-alpha pipeline only when white-background generation repeatedly
   produces an unrecoverable tint, texture, shadow, or scene. Never stretch or fractionally slow
   a clip, and never feed transparent VP9 directly to Remotion.
   Reuse/mirror only when the action remains semantically correct. Keep covers as a strong static
   frame from the accepted episode art.
   When a user requests the hand-drawn whiteboard treatment, use the scoped raster-layer workflow
   in `references/whiteboard-hand-drawing.md`. Preserve the existing storyboard, TTS, captions,
   BGM, and semantic Xiaohei composition; do not replace the whole episode with a generic filter.
7. Generate voice and inspect required playback rates before rendering. Shorten narration or
   extend the scene when the configured rate gate is exceeded. Also compare the reference and
   candidate with the same `silencedetect` threshold: a decodable short clip can still leave an
   unfaithful multi-second hole after narration ends. Expand the teaching explanation and
   regenerate that scene instead of hiding the gap with noise or background music. Encode any
   deliberate reference-matched pause as a narrow, documented allow-window. Mix the shared music
   as one continuous, loopable bed with conservative level, narration ducking, and whole-program
   fades; do not restart it at scene boundaries.
8. Validate, render a draft, inspect every boundary and major reveal, then render the full output.
   Every draft and final render must contain the configured background music. If its file is
   absent, stop with the exact required `public/` path rather than silently exporting without it.
   Render `outputs/<slug>/cover.png` and `outputs/<slug>/cover-landscape.png` from the shared React
   cover components during the same production run. The landscape design must reflow the same
   visual hierarchy for Xiaohongshu's 4:3 landscape format at 1200x900; never stretch or
   center-crop the vertical card. Generate
   `outputs/<slug>/publish-copy.md` from the same typed project metadata so the title, core mnemonic,
   word list, call to action, and hashtags cannot drift from the episode. Reuse an accepted episode
   illustration in the fixed art zone; generate a new Xiaohei theme cutout only when no existing
   action asset explains the episode.
9. Run `scripts/compare_videos.py` against the exact sample. Review the paired frames in writing,
   fix unexplained differences, and repeat. Update this skill when a repeated failure exposes a
   missing rule or configuration field.
10. Append scene/render detail to `docs/production-log.md` and append every material decision, measured
    result, comparison finding, cleanup action, and outstanding item to root `PROJECT_MEMORY.md`.
    Delete files only after every requested episode passes all gates and an import/manifest/path
    scan proves those files unused.
11. Make publication state visible in directory names while retaining `release.json` as the
    machine-readable record. Use `outputs/<slug>/` for `draft` and `approved`, and rename it to
    `outputs/<slug>发了/` for `published`. Changing a published project back to `draft` or
    `approved` must restore `outputs/<slug>/`. Never keep both forms for one project.
12. Keep `outputs/` limited to delivery files and direct acceptance evidence. Move experiments,
    source clips, discarded generations, and one-off previews to gitignored `work/`; move
    recoverable superseded assets to `archive/`. Before moving a large generated asset out of
    `public/`, scan both generic project data and specialized renderers for references and write
    an asset-audit report. Do not trust a generic dynamic-assets scan for specialized stages.

## Continuous semantic stage

Use this branch by default for a new episode that has no authoritative frame-accurate sample.
For an existing episode, use it when the user asks to remove PPT/page-turn behavior. Exact sample
replication remains authoritative: do not replace a sampled visual grammar merely because the
continuous stage is more elaborate.

1. Preserve narration, captions, teaching order, aspect ratio, FPS, and accepted duration. Keep
   scene records as the audio/caption timing authority, but separate those tracks from visual
   mounting so the visual stage can remain alive for the full composition.
2. Add a typed project renderer selector instead of branching on a composition ID. Mount one
   episode stage for the whole video and keep the root, coordinate system, camera container, and
   progress context persistent. A project-specific stage may remain specialized, but its motion
   helpers and word-scene data must be reusable and typed.
3. Design the first three seconds before writing the rest of the storyboard. Choose one hook
   mechanism that fits the episode: a surprising word relationship, result-first payoff, visual
   action mystery, common-mistake challenge, rapid before/after contrast, direct viewer test, or
   an unfinished semantic action. Reveal a concrete curiosity or payoff by frame 45 and create a
   second visual or verbal turn by frame 90. Do not open with a generic greeting, a static
   `ROOT = MEANING` card, or the repeated promise "one action, remember N words." Record the hook
   type and exact 0-3 second beat in the beat map. Compare it with the previous three episodes and
   change the mechanism when it repeats.
3. Model repeated word chapters as data containing word, prefix, root, suffix, meaning, direction,
   layout, absolute start frame, duration, semantic action frame, illustration, image fit/scale,
   and example. Do not copy five nearly identical page components.
4. Make the illustration perform the meaning in phases. Require anticipation, travel/contact,
   semantic climax, damping/settle, explanation reveal, readable hold, and a directional handoff.
   For example: reject approaches/collides/returns; project receives rear propulsion and travels
   forward; inject crosses a visible boundary; object meets an opposing barrier; subject stays
   beneath a descending upper layer.
5. Drive every value from the Remotion frame. Centralize clamped interpolation, restrained
   springs, stagger, entrance/exit, deterministic micro-motion, camera drift, word highlight, and
   directional transition helpers. No CSS transitions/animations, timers, real-time clocks, or
   random values.
6. Overlap adjacent visual ideas by about 8-16 frames, but keep only the shared root and a small
   number of guiding layers strong in that interval. Prefix replacement is an exclusive handoff:
   never allow outgoing and incoming prefixes to combine into a false word such as `preject` or
   `pinject`. Reject dense double illustrations and near-white boundary frames alike. When a
   generic layer renderer has its own enter/exit lifecycle, outer Sequence overlap is not enough:
   sample the actual child-layer opacity, freeze the outgoing scene at its last clearly visible
   frame when needed, and keep it present until the incoming layer is visibly established.
7. Review boundary `-3/+3` frames, every semantic action frame, the completed map, examples,
   summary, pre-fade, and final frame. A continuous root alone is not sufficient if the rest of
   the boundary is empty, while two complete chapters crossfading is too dense.
8. Keep camera movement content-led and small: typically 8-25px translation and 1-3% chapter
   scale change. Continuous object float is limited to about 3-8px and breathing to 0.5-1.5%.
   Keep captions outside the camera transform.
9. Assemble a derived word instead of revealing it as one finished block. Establish the orange
   root first, bring a prefix from the left and a suffix from the right, settle the true spelling,
   then draw a short root-colored baseline. Store the exact fragments and assembly onset in typed
   scene data; never infer a spelling split at render time.
10. Vary repeated word composition intentionally. Alternate text-left/art-right and
    art-left/text-right when the content permits, and use a centered/map/example layout for
    structurally different beats. Do not alternate mechanically when direction or the sample
    requires a stable side.
11. Give text and art separate hard safe zones. Size the art box for the largest anticipation,
    travel, climax, and settle transform, not only the resting image. Use `contain` for wide
    relationships and `cover` only for a centered subject whose extremities survive the crop.
    A smaller complete illustration is better than a large illustration covering a word.
12. Treat white space as structured breathing room, not unused canvas. On a word-teaching page,
    group the word build, formula, Xiaohei action, and meaning into one readable composition that
    occupies roughly 78-84% of the safe width. Scale the semantic Xiaohei action approximately
    1.25-1.45 times above legacy sparse layouts when edge review remains clean. Do not use a
    persistent `拆词 → 看动作 → 得词义` rail or any equivalent process label. Put motion into the
    actual word, morpheme, meaning, and semantic action instead. For a legacy text-only teaching
    page, reinforce the root with a low-contrast semantic
    watermark instead of adding unrelated decoration. Keep openings and transitions airy; do not
    inflate already dense example or summary pages.
13. Give important text its own semantic keyframes. Stagger prefix/root/suffix assembly; let the
    completed word settle with a short root-colored underline; give the meaning a distinct
    impact/recoil timed to the action climax; and use a restrained wipe, mask, color handoff, or
    character-level cascade for one genuinely important phrase. Avoid applying the same pop,
    bounce, or fly-in to every text layer. Every effect must preserve a readable hold and must be
    deterministic from the Remotion frame.
14. Treat semantic props as the default anti-PPT motion layer. Separate the meaningful object,
    path, force, boundary, light ray, waveform, spring, or result from the static Xiaohei card and
    animate it through preparation, contact, consequence, and settle. Use at least three distinct
    physical mechanisms across a multi-word episode; do not repeat "draw a path and move a dot"
    for every chapter. Keep Xiaohei as the primary actor and align every prop contact point to the
    accepted illustration. When adjacent chapters share a meaningful orange object or line, carry
    it through the boundary or transform its role instead of fading the entire page to white.
15. Run the default Iconfont search pass for each new unsampled episode after the narration and
    beat map are stable. Do not manufacture motion with unexplained arrows or decorative icons.
    An arrow must encode a
    spoken direction or causal relationship. An icon must clarify a concept or state while
    Xiaohei remains the primary semantic actor. Icons may not substitute for Xiaohei, lead the
    composition, or become the only visual explanation. Prefer morpheme assembly, camera focus,
    or a code-drawn diagram when those already carry the supporting meaning. Read the local
    Iconfont manifest and license status before reuse; never
    treat public search visibility, download availability, or account access as permission for
    published use. Unknown-license candidates remain reference-only and must not appear in the
    render.

## Repository commands

Run these from the target repository root, replacing `<slug>`:

```powershell
npm run typecheck
npm run replica:voice -- --project=<slug>
npm run replica:voice -- --project=<slug> --generate
npm run replica:images -- --project=<slug>
npm run replica:images -- --project=<slug> --generate
npm run replica:assets:verify -- --project=<slug>
npm run replica:validate -- --project=<slug>
npm run replica:render -- --project=<slug> --draft
npm run replica:render -- --project=<slug>
npm run replica:render:verify -- --project=<slug>
npm run replica:cover -- --project=<slug>
npm run replica:cover:verify -- --project=<slug>
npm run replica:copy -- --project=<slug>
npm run replica:release -- --project=<slug> --status=approved
npm run replica:content:qa -- --project=<slug>
npm run replica:stills -- --project=<slug> --mode=mobile
```

For dynamic Xiaohei, copy/adapt the bundled `scripts/wan_i2v_submit.ts`,
`scripts/wan_i2v_poll.ts`, and `scripts/white_wan_video.py` into the target repository. Use
`scripts/key_wan_video.py` only for the documented green-screen fallback. Follow
`references/dynamic-xiaohei.md`; keep the API key only in the project `.env`.

Do not call generation endpoints during the dry-run commands. Use `--scene=<id>` for one voice
scene and `--only=<id[,id...]>` for selected illustrations when iterating.

Create a paired frame set after rendering:

```powershell
python ".agents\skills\build-root-word-video\scripts\compare_videos.py" `
  --reference "样片\reference.mp4" `
  --candidate "outputs\<slug>\<slug>.mp4" `
  --out "outputs\<slug>\comparison" `
  --count 16
```

Use `--times 0,5.5,17.7,...` when the beat map has authoritative timestamps. Review
`contact-sheet.png`, `index.tsv`, and `comparison.json`; add written findings to the project log.

On Windows, set `$env:PYTHONUTF8='1'` before running Watch or Python/ffmpeg helpers against paths
containing Chinese characters. Without it, subprocess output may be decoded as GBK and fail even
when ffmpeg itself can open the file.

## Non-negotiable series invariants

- Use a literal `#FFFFFF` canvas in every scene.
- Resolve system `Microsoft YaHei` first and set letter spacing to zero.
- Use deep blue `#041FA0` and teaching orange `#E85810` as information colors.
- Reveal independent information serially and hold the completed idea long enough to read.
- Keep captions above the lower safe edge and above every final table row.
- Use transparent PNG for generated illustrations and code SVG for arrows and small symbols.
- Require Xiaohei as the primary semantic actor in every core teaching beat and on both covers.
  Iconfont assets are optional supporting details only; reject any frame where an icon replaces,
  visually overpowers, or makes Xiaohei's action secondary.
- Default to static Xiaohei source illustrations plus code-driven Remotion motion. Do not submit
  Wan jobs merely because credentials are available, and do not infer paid-generation permission
  from a general request to build or improve a video. Only after an explicit current-task request
  for Wan/image-to-video/generated dynamic Xiaohei, use native-speed frame sequences in the core
  teaching beats. Prefer white-background RGB generation without
  subject matting. Reject gray/tinted plates, slow-motion stretching, double-image dissolves,
  hard loop cuts, broken thin limbs, generated shadows, and identity or prop drift.
- When the user asks for a static-card treatment or reports white-backed images covering text,
  remove that episode's dynamic frame mappings and render the accepted RGBA PNGs instead. Use a
  project-level static-card mode: keep image hold opacity around 0.88-0.92, disable semantic image
  travel and camera drift, and retain only layer/card entrance and exit fades. The transparent
  background must reveal underlying text; never solve this case by lowering the opacity of a
  full-frame white RGB image.
- Keep scene times contiguous and use 30 fps CFR at 1920x1080.
- Configure both final-fade duration and final black-overlay opacity per project. Do not assume the
  last frame is fully black: `press` and `reg` reach black, while `fer` and Bouba/Kiki do not.
- Keep narration boundary fades and apply captions after all visual layers.
- Use `public/assets/music/root-word-series-bgm.mp3` as the shared default music master. Loop it
  across the full composition, fade it in/out at the program boundaries, and duck it while
  narration is active. Background music never substitutes for missing narration coverage.
- Treat narration, SFX, and music as a single controlled mix. Keep the final peak at or below
  `-1 dBFS`, reject speech masking and obvious loop clicks, and listen on both speakers and
  headphones before acceptance.
- Deliver two opaque PNG covers with every new video: `cover.png` at 1080x1440 and
  `cover-landscape.png` at 1200x900 (4:3, Xiaohongshu landscape). Preserve the shared card grammar: pure white canvas, rounded
  deep-blue keyline, upper-left Xiaohei series mark, upper-right orange series pill, oversized root
  and meaning, a semantic Xiaohei action, highlighted word family, and quiet footer. Reflow these
  zones for landscape; do not crop or stretch the vertical output. All cover text is code-rendered
  Microsoft YaHei; do not bake titles into generated art.
- Deliver `publish-copy.md` beside the MP4 and covers, and optionally mirror it to legacy
  `douyin-copy.md`. It is one shared Douyin/Xiaohongshu text package, not two drifting copies.
  It must be deterministic UTF-8 Markdown with three materially different title angles, one
  paste-ready publish block, the episode's exact core meaning and word
  family, a restrained call to action, relevant hashtags, and a suggested pinned comment. Do not
  dump the transcript, invent learning claims, mention internal production details, or use generic
  copy that contradicts a sound-symbolism episode.
- Generate `content-qa.md` for every episode. Treat mnemonic decomposition and historical
  etymology as separate fields and leave the episode unapproved until modern meaning, spelling
  changes, examples, and at least one dictionary plus one etymology source are checked.
- Generate feed-size mobile review stills even though the master remains 1920x1080. Inspect the
  360px-wide result for text size, caption crowding, art occlusion, and summary-row readability.
- Generate a nine-frame layout contact sheet across the episode and compare non-white occupancy
  against the previous version or the `ject` density reference. Investigate word-teaching pages
  below roughly 6.5% sampled non-white occupancy; do not chase the number when the remaining
  white space has clear hierarchy or action purpose.
- Never present an output before checking the full-resolution render with sound and muted.

## Completion evidence

Require all automated gates, a full watch, paired sample frames, written mismatch findings, an
audible but subordinate background-music mix, and a clean project log. A successful render alone
is not completion. A contact sheet without analysis is not comparison. Do not clean the repository
while any requested replica remains unverified.
Keep every final video, `cover.png`, `cover-landscape.png`, `publish-copy.md`, `release.json`, and
direct evidence together under `outputs/<slug>/` or, when published, `outputs/<slug>发了/`; do not
recreate legacy `edit/` or `out/` delivery trees.
