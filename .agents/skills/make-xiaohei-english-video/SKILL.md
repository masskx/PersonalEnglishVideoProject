---
name: make-xiaohei-english-video
description: Make or resume an English-learning video in this Xiaohei project, including autonomous topic selection when the user names only a column such as root words, confusing words, CET writing, reading, or translation. Use for production requests; do not trigger for discussion, inventory, or rule recording alone.
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

Unless the user explicitly narrows the task, complete research/source checking, script, narration,
visuals, Remotion timing, full MP4, vertical full/teaser/review card, two covers, publish copy, appropriate worksheet or review
evidence, media QA, topic-ledger update, production log, and workbench refresh. Do not publish or
message others.

Treat prose instructions as production guidance, not proof that content-to-visual mapping passed.
If a hard gate can be represented as project data, run the project preflight before expensive
generation and fail closed when scene bindings or summary coverage are incomplete.

Keep the workbench first screen for current deliverables. Put superseded renders, endpoint tests,
pose sheets, and assembly intermediates in local `work/` (gitignored), never in `outputs/`.

Do not revive rules from dated audit snapshots or historical production notes. Those records explain
how an old episode was made; they do not override the current production baseline.

## Douyin shorts (main Douyin format since 2026-10-14)

- The main Douyin format is a native 30–40 s vertical short: one point, a 0–2 s hook (mistake,
  challenge, contrast or result first), one or two teaching beats, a pause-and-answer test with a
  3 s countdown, the answer, then one line asking viewers to save and follow. No "today we learn" or
  channel-name openings; frame 0 shows the big headline and Xiaohei with no fade-in.
- Scripts live in `src/shorts/library.ts` (A/B hooks, shared body, title/body/tags/pinned comment).
  They reuse the source episode's art. Use `arts` for before/change/result pose switches inside a
  beat, and `example` for a sentence the narration says, so it appears on screen at the same time.
- Commands: `npm run shorts:voice -- --short=<id> [--generate]` → `npm run shorts:render -- --short=<id>`.
  Output: `outputs/<episode>/douyin-shorts/`. Daily data from the owner goes into
  `planning/douyin-metrics.json`; `npm run metrics:report` compares hooks (see `docs/DOUYIN-DATA-EN.md`).
  The next round keeps the stronger hook type and rewrites the weakest part.
- The full-length vertical below stays as the long version for collections.

## Douyin vertical delivery (default since 2026-10-12)

- Douyin's feed is vertical; a 16:9 upload fills about a third of the phone screen. After the
  landscape master passes its gates, run `npm run vertical:render -- --project=<slug>` to produce
  `vertical/<slug>-vertical.mp4`, a ~40 s `vertical/<slug>-teaser.mp4`, and `vertical/review-card.png`
  in the episode's delivery folder, then regenerate the publish copy.
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
