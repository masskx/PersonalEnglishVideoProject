---
name: build-root-word-video
description: Build, reproduce, or maintain the 1920x1080 white-background Xiaohei English video style, with root-word teaching as its primary recipe. Use for root words, vocabulary families, confusing words, or a scoped change within this project. The visual, audio, cover, and whole-video review contract is shared by every column; only the teaching storyboard changes for CET and other formats.
---

# Build Root Word Video

## Audio priority

Narration is always the foreground. Follow the project router Skill's narration-first music rule:
duck the MiniMax bed during every spoken cue, use only a modest lift in pauses, and re-render whenever
the melody masks Chinese consonants or English words. Do not accept a mix only because peak and silence
checks pass.

## Shared cover template

The root-word cover is the project-wide cover system. Other columns use the same `RootWordCover` and
`RootWordLandscapeCover` composition, dimensions, border, brand mark, arrow, hero-art area, hook strip,
family pills, and footer. Only the mapped content and semantic illustration change; simplified title
cards are not valid delivered covers.

## Scope and project navigation

Read the repository-root `AGENTS.md` and `docs/选题与自动制作规则.md` before selecting a topic.
The user has authorized autonomous topic selection: a request may specify only a column or video
type, such as root-word, root comparison, confusing words, CET writing, reading, or translation.
When it does not identify a concrete topic, find a suitable unused topic, cross-check
`planning/topic-history.json` and actual project history, then produce the full deliverable without
asking the user to choose or approve an ordinary topic. Reuse the current accepted production
chain and quality gates; do not downgrade an underspecified request into a simple card or PPT.
An explicitly supplied topic takes precedence even if already used; preserve the old version.
Register the selected topic before production and update its artifacts afterward. This rule persists
across agents and sessions; it does not turn discussion or project audits into production requests.

This skill defines the current project visual baseline through the root-word recipe. Its white canvas,
character, typography, cover grammar, music policy, animation quality, and whole-video review gate
are shared by every future column. CET writing, reading, translation, and the four-episode series may
change the teaching sequence and composition when that improves comprehension, but they must keep the
same imagegen style, Xiaohei identity, motion restraint, sound balance, cover family, and final preview
gate. For inventory, organization, or format exploration, inspect and document the project without
automatically generating assets, rendering an episode, or publishing.

Start with the repository [AGENTS.md](../../../AGENTS.md) and
[新会话制作入口](../../../docs/新会话制作入口.md); they list the current rules, commands and folders.
Apply sample-matching instructions when an authoritative sample exists; for an original episode,
use its explicit storyboard and beat map as the timing/content authority.

## Current repository management paths

Use `PROJECTS.html` as the local project library and `npm run project:inventory` to refresh it.
See `docs/项目管理流程.md` for the current organization. Keep final MP4, both covers and publish
copy beside the release record. Node production commands use `scripts/replica/deliveryPaths.ts`
to resolve an existing `outputs/<slug>发了/` folder; never recreate a second canonical folder.
Drafts belong in `work/drafts/<slug>/draft.mp4`; review evidence belongs under the episode's
`review/` directory and new review stills under `review/stills/`. Experiments and discarded
generations stay in the gitignored scratch folder `work/`, while runtime assets remain in `public/`. Do not infer publication
from conflicting legacy labels. Preserve filled content QA documents unless explicitly rebuilding.
The workbench first screen is for current delivery artifacts. Historical renders, endpoint tests,
pose evidence and assembly intermediates belong under a collapsed archive and must not compete with
the current video in the main delivery selector.

## Current user defaults (2026-09-29 baseline)

Apply the all-column defaults in root AGENTS.md: complete videos exceed 120 seconds unless
explicitly requested otherwise; teach one usable exam-focused point with application and practice.
Smooth frame-driven text entrances, exits and semantic key poses are always the default.
Keep production/debug labels, top-right step navigation and redundant margin notes out of the video.
Deliver the current version under outputs and expose video, both covers and copy at the workbench entry.

The Douyin pacing update confirmed on 2026-09-22 also applies: use a slightly faster, brighter
rhythm; keep background music clearly audible on ordinary phone speakers; avoid a sequence of
repeated text-and-picture cards; enlarge and crop semantic art deliberately; and give hook,
practice and recap beats meaningful visual changes. Generate at least two anchor-composition
candidates for a new major semantic beat when image generation is requested, approve the stronger
one, then derive its before/change/result poses from that same anchor. More generated images help
only when they add a teaching beat or improve composition; do not scatter filler.

Narration and publish copy must sound like a teacher speaking about the concrete example on screen.
Prefer short observations, questions and actions. Remove reusable AI-sounding scaffolds such as
`不是……而是……`, `别再……`, `先别……`, `抓住……立刻……`, and `一个动作串起……` unless a specific
lesson genuinely requires that exact contrast. Read the complete Chinese aloud before TTS and run
the editorial-style lint; a successful media render does not excuse canned copy.

## Locked visual contract (2026-09-29)

These three rules are fixed for every new root-word episode and every rework of an existing one:

1. **Generated image style.** New semantic art is generated raster imagery from the built-in
   `image_gen` model, using the accepted `mit/miss` episode as the visual anchor: pure white field,
   one solid-black Xiaohei with white dot eyes, thin black limbs, calm readable pose, wobbly ink
   contours, and only sparse orange/red/blue teaching accents. Generate an anchor composition first,
   then derive the same-camera `before / change / result` poses. Do not ship SVG, vector stand-ins,
   text baked into art, glossy 3D, stock cartoon, duplicate figures, or a different character style.
   Keep the generated bitmap episode-local under `public/assets/replica/<slug>/`; references are for
   generation only.
2. **Basic teaching pattern.** Open with a concrete hook in 1.5 seconds, establish the root and its
   core action, build each word from explicit morphemes, show the word-specific semantic action,
   explain one natural example, add a short retrieval/practice beat, and close with a summary that
   covers every taught word. Alternate text-left/art-right, art-left/text-right, and a centered or
   map composition when teaching value supports it. Treat white space as planned breathing room and
   keep the combined text/art composition inside the canvas safe area; never let a repeated card grid
   or a giant illustration turn the episode into a PPT.
3. **Animation.** Use deterministic frame-driven motion: smooth rise/reveal/slide for entry,
   staggered morpheme assembly, restrained semantic image travel or a before/change/result cut at the
   spoken action, a short settle hold, and a soft white-fade between scenes. Every important phrase
   gets enough still time to read. Do not add perpetual drift, random bounce, camera shake, full-canvas
   SVG mechanisms, or identical pop effects on every layer. Animation must clarify the teaching action,
   not compensate for weak artwork or empty layout.

### Final whole-video preview gate

After the final MP4 and media verification, always run:

```powershell
npm run replica:full-preview -- --project=<slug>
```

This creates `outputs/<slug>/review/full-preview/full-preview.mp4`, a one-second timeline contact
sheet set, and `full-preview-report.json`. Open the preview MP4 and inspect the entire episode, then
scan every contact-sheet page at feed size. Check text against all four safe margins, punctuation and
Chinese line breaks, caption crowding, image/text balance, intentional breathing room, scene cuts,
before/change/result continuity, and any frame that becomes a large empty white field. The script runs
the storyboard text safe-area gate and fails on an estimated text overflow; the human full-watch gate
still decides whether spacing and hierarchy look right. If anything overflows, leaves an accidental
blank region, or loses hierarchy, fix the storyboard/layout and re-render before marking the episode
reviewed. Do not accept a render because a few midpoint stills look clean.

## Series production purpose

Create a complete project, not a static word card. Treat a supplied sample as the authority for
story order and timing. Otherwise preserve the established series language while designing the
episode from the supplied root information.

All raster illustrations must follow the project-local Ian Xiaohei source skill at
`references/ian-xiaohei/ian-xiaohei-illustrations`,
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

- Read `references/key-pose-storytelling.md` for the default static-image storytelling mode.
- Read `references/reference-edit-keyposes.md` when producing new Xiaohei poses through the
  configured Images2 relay or when continuity between poses matters.
- Read `references/smooth-typography.md` for smooth text entrances, exits, morpheme assembly,
  Jianying-style motion requests, and the boundary between this series and later CET columns.
- Read `references/visual-style.md` before authoring any scene or illustration prompt.
- Read `references/config-schema.md` before adding a project or changing the render engine.
- Read `references/background-music.md` before selecting, replacing, mixing, or reviewing music.
- Read `references/iconfont.md` before searching, downloading, adapting, or publishing an external
  icon.
- Read `references/whiteboard-hand-drawing.md` when the user asks for a hand-drawn, whiteboard,
  pen-cursor, or “hand holding a pen” reveal on existing raster illustration layers.
- Read `references/quality-gates.md` before generating assets, rendering, comparing, or cleaning.
- Copy from `assets/` only when a new project does not already have an equivalent local pattern.

## Workflow

1. Inspect the repository, `docs/production-log.md`, available media, existing illustrations, SFX,
   the shared background-music master, and registered replica projects. Preserve unrelated and
   user-authored files.
2. Probe the latest locally accepted sample for this series with `ffprobe`, even when the user did
   not attach one. Do not select an older formal output when a newer accepted full sample exists.
   Extract readable frames at scene boundaries and major beats. Build a beat map containing timing,
   narration idea, visible wording, layer order,
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
   then place each visual reveal against the spoken beat. Before image or TTS generation, write one
   typed coverage row per taught word: word and scene id, modern meaning, spoken example, causal
   action, the three pose paths, and its explicit summary row. Closely contrasted words must have
   visibly different actions. Never infer the final summary from the body; encode every taught word
   and its row order explicitly. Run `replica:preflight --plan-only` before generation so missing,
   duplicate, or cross-bound word mappings stop early.
   Before TTS, run the editorial-style lint on narration and generated publish copy. Rewrite
   formulaic contrast pairs, generic promises and repeated opening templates into scene-specific
   spoken Chinese. Do not preserve a sentence merely because it is grammatically correct.
6. When a new raster illustration is required, use the built-in `image_gen` model by default and
   keep the generated output as a bitmap asset. Use the project CLI/provider only when the user
   explicitly requests that route or the built-in tool is unavailable and the user confirms the
   fallback. Reuse existing assets first. For a new multi-pose action, use the accepted reference-edit
   workflow in `references/reference-edit-keyposes.md`: approve one anchor composition, derive
   meaningful change/result states through `/images/edits`, then normalize, remove the plate and
   verify each transparent PNG. Independent text-to-image calls are not the default for a pose
   sequence because they drift in identity and geometry. For a missing one-off illustration,
   generate an isolated subject on `#00FF00`, remove chroma in code, and verify the transparent PNG. Draw readable labels,
   arrows, rules, braces, tables, and small icons in code rather than baking them into images.
   If the image provider is unavailable, overdue, or returns a board, pseudo-text, duplicate
   characters, or a visibly different Xiaohei, stop treating those files as approved. Preserve the
   failed generation under `work/experiments/`, then retry the built-in image_gen route or stop for
   user input. Do not replace a requested generated illustration with SVG, canvas, or code-drawn
   geometry. Never ship a provider failure or a prompt-only QA pass as the visual approval.
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
   Use semantic static key poses by default: for a physical root-word action, show `before`,
   `change`, and `result` as three distinct states derived from one accepted source composition;
   omit a state only when the meaning has no honest causal transition to show. Follow
   `references/reference-edit-keyposes.md` and `references/key-pose-storytelling.md`. Before
   generating TTS, freezing scene timings, or rendering, inspect every candidate pose against an
   accepted Xiaohei image on pure white. A text prompt, transparent-PNG report, or model label such
   as “accepted” is not visual approval. Check body proportions, solid-black silhouette, white dot
   eyes, limbs, expression, line character, scale, and whether Xiaohei remains the unmistakable
   primary actor; reject stick-figure drift or style drift before it reaches the timeline.
   Mount the three poses as mutually exclusive stills with a stable camera and readable holds;
   do not manufacture movement by translating, rotating, or bouncing a whole illustration. Keep
   semantic props hand-drawn, local, and subordinate: no oversized geometric/SVG-like plate,
   mechanical layer, or trajectory may dominate or obscure Xiaohei. Small code-drawn labels, rules,
   and a necessary local direction arrow remain allowed, but they are not a substitute for the
   semantic pose change. The presence of
   `DASHSCOPE_API_KEY` never authorizes paid generation. Run Wan image-to-video only when the user
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
   After generation, build a white-background contact sheet and inspect the approved character,
   each word's three states, and every contrasted pair. Mark the plan visually approved only after
   that human review, then run `npm run replica:preflight -- --project=<slug>`; the render validator
   must fail closed if coverage, files, timings, or review status are incomplete.
   Runtime sources are fail-closed episode-local assets. The active keypose `assetDir` must contain
   every image layer source and every state `source`; a prior episode directory is allowed only as
   a generation reference. Add the plan's `assetProvenance` fields (`assetDir`, generation method,
   reference anchor, and runtime source scan), run a source-directory scan before rendering, and
   record an empty `reusedRuntimeSources` list for a clean episode. Generate all three states for
   each word from one approved anchor and local prop continuity; do not rename old files and call
   that a new asset set.
   For Douyin visual impact, inspect the visible alpha subject bounds rather than trusting the 16:9
   PNG box. Adjust art crop and scale so the semantic actor reads at phone size and the completed
   composition occupies about 78-84% of safe width. Use at least three intentional composition
   patterns across a multi-word episode. Hook, example, practice and recap scenes must not fall
   back to one tiny reused figure beside a text list; stage several semantically correct poses or
   make a dedicated support illustration when the teaching beat changes.
7. Generate voice and inspect required playback rates before rendering. Use the exact instruction
   syntax supported by the configured model and voice. Audio cache entries must match both current
   narration and voice profile; an instruction error is a hard failure unless a person explicitly
   opts into the documented fallback. Shorten narration or
   extend the scene when the configured rate gate is exceeded. Also compare the reference and
   candidate with the same `silencedetect` threshold: a decodable short clip can still leave an
   unfaithful multi-second hole after narration ends. Expand the teaching explanation and
   regenerate that scene instead of hiding the gap with noise or background music. Encode any
   deliberate reference-matched pause as a narrow, documented allow-window. Mix the shared music
   as one continuous, loopable bed with conservative level, narration ducking, and whole-program
   fades; do not restart it at scene boundaries.
8. Validate, render a draft, inspect every boundary and major reveal, then render the full output.
   The render, cover, and review-still commands automatically stage only the public files referenced
   by this project; use an explicit `--public-dir` only for a deliberate external asset fixture.
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
    source clips, discarded generations, and one-off previews to gitignored `work/`; delete
    superseded assets (git history keeps them; there is no archive folder). Before moving a large generated asset out of
    `public/`, scan both generic project data and specialized renderers for references and write
    an asset-audit report. Do not trust a generic dynamic-assets scan for specialized stages.

## Continuous semantic stage

This is an optional continuous-motion branch, used when continuous trajectories materially
explain the lesson or the user requests this treatment. Static key-pose storytelling is the
default for new episodes and static-image improvements. A request to improve pacing alone
does not require a continuous stage. Exact sample
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
4. Make the illustration perform the meaning in phases. Choose the phases needed by the actual mechanism: preparation, contact/change, result,
   explanation and readable hold. Do not add damping or a directional handoff without a cause.
   For example: reject approaches/collides/returns; project receives rear propulsion and travels
   forward; inject crosses a visible boundary; object meets an opposing barrier; subject stays
   beneath a descending upper layer.
5. Drive every value from the Remotion frame. Centralize clamped interpolation, restrained
   springs, stagger, entrance/exit, word highlight and
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
8. Default to a fixed camera and stable settled poses. Move the camera only when it reveals
   relevant spatial information. Do not add float, breathing or drift to avoid stillness.
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
    quiet reveal timed to the meaning-bearing action; and use a restrained wipe, mask, color handoff, or
    character-level cascade for one genuinely important phrase. Avoid applying the same pop,
    bounce, or fly-in to every text layer. Every effect must preserve a readable hold and must be
    deterministic from the Remotion frame.
14. Use code-driven semantic props only when their continuous trajectory clarifies the lesson.
    Otherwise show distinct static states with clean cuts. There is no mechanism-count quota.
    Keep Xiaohei as the actor, and reject decorative dots, springs and forced prop handoffs.
    Full-canvas SVG prop overlays are disabled by default. Never layer a large SVG mechanism over
    accepted reference-edit art merely to make the frame feel active; use the raster pose change,
    restrained local keyframes and text timing instead.
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
npm run replica:preflight -- --project=<slug> --plan-only
npm run replica:keyposes:edit -- --plan=planning/<slug>-keyposes.json
npm run replica:keyposes:edit -- --plan=planning/<slug>-keyposes.json --generate --concurrency=2
npm run replica:preflight -- --project=<slug>
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
npm run replica:stills -- --project=<slug> --keypose-cuts
npm run replica:keyposes:review -- --project=<slug>
npm run replica:full-preview -- --project=<slug>
```

Wan / image-to-video dynamic Xiaohei is retired (2026-10-13). Existing frame sequences under
`public/assets/replica/*-motion/` still render for their episodes, but new episodes use static
before/change/result key poses with Remotion keyframes.

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
- Default to static Xiaohei key poses with frame-driven cuts and readable holds. Do not submit
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
  automatically assembled 360px-wide contact sheet for text size, caption crowding, art occlusion,
  and summary-row readability.
- Generate a nine-frame layout contact sheet across the episode and compare non-white occupancy
  against the previous version or the `ject` density reference. Investigate word-teaching pages
  below roughly 6.5% sampled non-white occupancy; do not chase the number when the remaining
  white space has clear hierarchy or action purpose.
- Before production acceptance, check the full-resolution render with sound and muted. A requested
  review trial may be delivered with its completed checks and any outstanding listening/watch
  review stated explicitly; do not label that trial approved.

## Unified production entry after visual approval

After the white-background character review passes, prefer the unified production entry so the
remaining commands cannot be skipped accidentally:

```bash
npm run replica:produce -- --project=<slug> --stage=assemble
npm run replica:produce -- --project=<slug> --stage=deliver
```

`assemble` runs the approved-asset preflight, refreshes stale narration, and validates the project.
After preview and still review, `deliver` repeats the gates, renders the HQ video, covers and copy,
verifies the media, automatically builds the full-video preview gate, keeps release status at draft,
and refreshes the workbench. Any failure stops the chain. Image generation, the white-background human
review, and the full-watch preview remain explicit gates and may not be skipped by this command.

## Production acceptance evidence

Require all automated gates, a full watch, paired sample frames, written mismatch findings, an
audible but subordinate background-music mix, and a clean project log. A successful render alone
is not completion. A contact sheet without analysis is not comparison. Do not clean the repository
while any requested replica remains unverified.
Keep every final video, `cover.png`, `cover-landscape.png`, `publish-copy.md`, `release.json`, and
direct evidence together under `outputs/<slug>/` or, when published, `outputs/<slug>发了/`; do not
recreate legacy `edit/` or `out/` delivery trees.
