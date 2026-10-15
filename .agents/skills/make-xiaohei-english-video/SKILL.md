---
name: make-xiaohei-english-video
description: Make or resume an English-learning video in this Xiaohei project (default a 20–30 s vertical short posted to both Douyin and Xiaohongshu), including autonomous topic selection when the user names only a direction such as CET-4/6, graduate-entrance-exam English, root words, confusing words, writing, reading, or translation. Use for production requests; do not trigger for discussion, inventory, or rule recording alone.
---

# Make Xiaohei English Video

This is the project-wide production router. It exists so a new agent can recover the user's defaults
without relying on conversation memory. Before using a column-specific recipe, load
`docs/当前制作基准.md`; that file is the single visual and delivery baseline for every column.

Every request to make an English video must begin by loading this router and then the column skill
named in the next section. Do not build a shortcut card or an improvised timeline from chat context;
the router, the column skill, the project plan, and the latest accepted sample are the production
source of truth. When a render exposes a repeatable failure, record the fix in the relevant skill
and default config so later episodes inherit it automatically.

Before production, read `docs/当前制作基准.md`, the repository-root `AGENTS.md`, `docs/选题与自动制作规则.md`,
`docs/新会话制作入口.md`, and `planning/production-defaults.json`.

## Decide the request

- If the user supplies a concrete topic, root, word pair, question, or source material, make that
  requested subject. If it already exists, preserve the old version and make a new version.
- If the user supplies only a column or video type, autonomously choose a suitable unused topic,
  cross-check the topic ledger, the registry, `outputs/` and local `work/` drafts, register it as in progress,
  and continue to a complete deliverable. Do not ask the user to choose an ordinary topic.
- Discussion, auditing, rule recording, or asking what could be made does not itself authorize a
  new production run.

## Route the format

- For root-word, root comparison, vocabulary-family, sound-symbolism, or confusing-word episodes,
  read and follow `../build-root-word-video/SKILL.md` plus the relevant references. Use the current
  accepted same-anchor reference-edit key-pose workflow when new continuous poses are needed.
  Before generating voice or rendering a root-word episode, author a checked word-to-meaning/action/
  pose/summary map and run its plan-only preflight; after white-background visual review, run the full
  preflight. Keep an isolated render bundle limited to that episode's referenced public assets.
- For writing, reading, and translation, retain the complete current baseline: the same generated
  raster imagegen style, white Xiaohei teaching canvas, natural spoken explanation, semantic key
  poses, smooth frame-driven typography, audible ducked music, shared covers, and whole-video
  preview gate. Design a column-specific teaching storyboard only where the lesson requires it;
  do not create a lower-spec or unrelated visual pipeline.

## Episode-local visual provenance

- Runtime illustration sources are episode-local. Before rendering, scan every storyboard image
  layer and every keypose plan state source. If a runtime path resolves to another episode's
  `public/assets/replica/<slug>` directory, fail the build. A previous pose may be used as a
  generation or identity reference, never as the runtime source for the new episode.
- Record `assetDir`, `generationMethod`, `referenceAnchor`, and `runtimeSourceScan` in the
  keypose plan. The white-background contact sheet must label the current episode slug and be
  reviewed before the full preflight. Delete superseded runtime assets or move them to local `work/` (gitignored),
  not in the active episode directory.
- For new raster illustrations, use the built-in `image_gen` model by default; do not replace a
  requested generated image with SVG, canvas, or code-drawn geometry.
- When an image provider fails or returns prompt leakage, board layouts, duplicate figures, or style drift,
  keep the failed files in `work/experiments/` and retry or switch to the built-in image_gen route.
  Do not substitute SVG, canvas, or code-drawn geometry for a requested generated illustration. The
  visual gate is the white-background contact sheet and
  the rendered boundary stills, not the provider response or a successful file write.

## Locked visual, structure, and motion contract

All columns inherit the current production baseline: generated raster imagegen art, the warm dotted-paper teaching canvas (src/replica/theme.ts), solid-black Xiaohei
with white dot eyes and wobbly ink contours, sparse orange/red/blue accents, and an episode-local
bitmap asset directory. Use a concrete hook, an explained visual action, readable examples or practice,
and a summary that closes the teaching loop. Keep text and art in separate safe zones, vary the
composition with teaching intent, and preserve breathing room. Use deterministic smooth rise/reveal/
slide, morpheme assembly, semantic before/change/result cuts, readable holds, and soft scene fades.
Do not replace generated art with SVG placeholders, repeat one PPT-like card, add perpetual drift, or
use decoration that makes Xiaohei's action secondary.

Every final delivery has a whole-video visual gate. Run `npm run replica:full-preview -- --project=<slug>`
after the final render. Open the generated `full-preview.mp4` and inspect the entire timeline plus all
contact-sheet pages. Confirm safe margins, no text overflow, no accidental large blank regions, balanced
text/art scale, clean scene transitions, and readable phone-size captions. The command fails on estimated
storyboard text overflow and writes `full-preview-report.json`; fix and re-render before treating the
episode as reviewed. Midpoint stills alone are not sufficient evidence.

## Required completion

Default deliverable (a short, see below): source check, script appended to `src/shorts/library.ts`,
narration, `shorts:render` output in `outputs/shorts/<id>/` — one video, three covers, `publish.md`,
`release.json`, `review/` — contact-sheet and cover review, `project:test`. Do not publish or message
others.

For a long lesson (only when the user asks for one): research/source checking, script, narration,
visuals, Remotion timing, full MP4, vertical full version, two covers, publish copy, appropriate
worksheet or review evidence, media QA, topic-ledger update, production log, and workbench refresh.
Xiaohongshu image cards and teasers are retired (2026-10-14).

Treat prose instructions as production guidance, not proof that content-to-visual mapping passed.
If a hard gate can be represented as project data, run the project preflight before expensive
generation and fail closed when scene bindings or summary coverage are incomplete.

Keep the workbench first screen for current deliverables. Put superseded renders, endpoint tests,
pose sheets, and assembly intermediates in local `work/` (gitignored), never in `outputs/`.

Do not revive rules from dated audit snapshots or historical production notes. Those records explain
how an old episode was made; they do not override the current production baseline.

## Shorts: the default format for Douyin and Xiaohongshu (since 2026-10-14)

- Content spans all English learning: CET-4/6, graduate-entrance-exam English (考研), root words,
  confusable words, grammar and everyday usage. Put the label in the script's `category`.
- The default video is a native 20–30 s vertical short. The same file is posted to Douyin and
  Xiaohongshu. Structure (v2, since 2026-10-15): one point, a 0–2 s hook (narration 4.5 s or less),
  one or two teaching beats, a pause-and-answer test with a 2 s countdown, and the answer as the
  ending. The answer line ends with the save prompt and the answer beat carries the save/follow
  ribbon; there is no separate closing beat. Reason: the first posted short (35 s, v1) finished at
  2.29% with a 56.5% two-second exit. Voice clips are trimmed of leading/trailing silence. No "today we
  learn" or channel-name openings; frame 0 shows the big headline and Xiaohei with no fade-in.
- Hooks rotate and there are no A/B tests. Library order is posting order, and short #i uses
  `HOOK_ROTATION[i % 4]`: challenge → mistake → contrast → result first. Append new shorts at the end
  with `nextHookType()`. The regression test enforces the rotation.
- Scripts live in `src/shorts/library.ts` (hook, body, `publish` with a Douyin title of 30 chars or
  less and an `xhsTitle` of 20 chars or less, tags, pinned comment). They reuse the source episode's
  art. Use `arts` for before/change/result pose switches inside a beat, and `example` for a sentence
  the narration says, so it appears on screen at the same time.
- Commands: `npm run shorts:voice -- --short=<id> --generate --prune` →
  `npm run shorts:render -- --short=<id>`. Output is one folder per video, `outputs/shorts/<id>/`:
  - `<id>.mp4`
  - `cover-douyin-vertical.png` (1080×1920; content kept inside the middle 3:4)
  - `cover-douyin-landscape.png` (1440×1080, 4:3)
  - `cover-xiaohongshu.png` (1080×1440, 3:4)
  - `publish.md`, `release.json`, `review/`
- Daily data from the owner (Douyin and Xiaohongshu) goes into `planning/douyin-metrics.json`.
  `npm run metrics:report` groups results by hook type and platform (see `docs/DOUYIN-DATA-EN.md`).
- Posted shorts are kept in the library as `version: 1` (or their version at posting) and archived in
  `outputs/shorts/<id>发了/` with `release.json` recording the publish time; never re-render them.
- Xiaohongshu image cards are retired. Never produce them unless the owner asks again.

## Motion and sound craft for shorts (since 2026-10-15, learned from awesome-ai-motion)

Distilled from the public prompts in `guanmo-ai/awesome-ai-motion`; the full table is in
`docs/当前制作基准.md` ("动效与声音工艺") and the owner's guide is `docs/MOTION-CRAFT-EN.md`.

- Every style is a pure function of the frame. Use `settle()` (closed-form spring, ~0.2% overshoot) for
  entrances and morphs; no bounce, drift, particles, glows or shake.
- One shape never cuts: the light-blue art panel persists across beats and springs between layouts
  (`panelRect()`); it closes for the test and reopens for the answer. No beat change may show empty paper.
- Content enters after its container starts moving and leaves before the next move: headlines exit
  upward (frames 0–6) and the new one rises in from frame 5 inside a mask.
- Pose changes are hard cuts with a 1.025→1 settle. When the panel opens/closes the art is cropped like
  a blind, never scaled down and never semi-transparent.
- One timing table drives picture and sound: `shortMoments()` gives each event's frame; `shortEvents()`
  turns them into SFX. The render measures each SFX's peak, normalizes its level and starts it early so
  the peak lands on the event.
- Audio is loudness-normalized to -14 LUFS / -1.5 dBTP (two-pass, video copied). Music 0.07 under
  speech, 0.10 in gaps.
- Review: `review/beats-sheet.jpg` shows four frames per beat around each change; the blank-frame gate
  fails the render when a frame near a change has under 4% ink. Fix the transition, never the threshold.
- Rejected on purpose: snapping cuts to the music beat grid (narration sets the pace), 60 fps subframe
  motion blur (little gain on flat paper motion), first-frame = last-frame loops (the ending is the answer).

## Long-lesson vertical version (only when a long lesson is requested)

- After the landscape master passes its gates, `replica:produce --stage=deliver` runs
  `vertical:render -- --project=<slug> --cut=full` to produce `vertical/<slug>-vertical.mp4`, then
  regenerates the publish copy. Teasers and review cards are retired.
- The vertical renderer (`src/replica/vertical/`) re-flows the same storyboard, narration and episode
  art into a 1080×1920 phone layout. It never regenerates art or changes the script. Check the
  contact sheets: hook and Xiaohei visible on frame 0, content and captions inside Douyin's safe area,
  no split English words, white loop-friendly ending.
- Calls to action, collection name, hashtags, products and lead-magnet switches live in
  `planning/growth-promotion.json`. Never add purchase or giveaway prompts for products that are not
  live, and never place WeChat IDs, QR codes or external links anywhere.
- The owner reads English, not Chinese: talk to the owner in English (see
  `docs/growth-playbook-EN.md`); keep repository docs, scripts and on-screen text in Chinese.

## Narration-first background music

- Background music must remain below the narration. A memorable beat is useful only when every
  spoken consonant and English word stays easy to hear on phone speakers.
- Do not run the music bed at one fixed level through the whole video. Duck it during every narrated
  cue and raise it only slightly in genuine pauses or transitions, with short attack and release ramps.
- For the current MiniMax series master, start around `0.07–0.08` under narration and no higher than
  about `0.10` in genuine pauses. The source master is quiet, so lower values fail the audibility
  gate on ordinary phones. Treat these as starting points; lower them when the melody draws attention
  away from speech, then recheck the mix instead of leaving the track inaudible.
- Before delivery, check at least one dense Chinese passage and one English passage at ordinary phone
  volume. If music masks words or competes for attention, reduce the bed and re-render the full mix.
  A valid audio file, acceptable peak level, or absence of silence does not prove the balance is good.

## Series cover system

- Every delivered video, regardless of column, uses the approved root-word cover template and its
  landscape companion: `RootWordCover` at 1080×1440 and `RootWordLandscapeCover` at 1200×900.
- Keep the complete visual grammar: blue rounded frame, Xiaohei brand mark, orange pill, eyebrow,
  large primary title, orange motion arrow, right-side semantic illustration, orange hook strip,
  bottom family pills, and series footer. Change only the content mapped into those slots.
- Do not make a simplified white title card or invent a column-specific cover canvas. If a column is
  not a word family, map its skill, method, or sentence structure into the same slots and use a
  relevant Xiaohei illustration in the hero area.
- Cover QA must check both dimensions, the frame and brand mark, readable hook, hero illustration,
  bottom pill row, and mobile-size legibility before the cover is accepted.
