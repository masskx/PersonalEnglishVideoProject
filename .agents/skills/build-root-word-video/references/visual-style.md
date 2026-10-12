# Visual Style Contract

Use this contract for every project video. Treat the latest accepted project sample as the authority
for scene order, timing, wording, illustration subject, and summary membership. Root-word episodes use
the recipe below directly; CET and other columns adapt the teaching sequence while keeping these
visual invariants.

## Canvas and palette

- Render at `1920x1080`, `30 fps`, square pixels, 16:9.
- Set every canvas and scene background explicitly to pure `#FFFFFF`. Do not use off-white,
  gradients, paper texture, vignettes, colored bands, or a gray page.
- Use `#041FA0` as the dominant teaching color: roots, words, headings, arrows, captions, and
  primary outlines.
- Use `#E85810` sparingly for the morpheme or semantic fragment currently being explained,
  action emphasis, and the one relationship the viewer should notice next.
- Use `#111111` only where the sample needs neutral body copy, `#6673A7` for secondary text,
  and `#AAB2D4` for quiet rules or table lines.
- Keep large areas white. Color is an information signal, not decoration.

## Typography

- Use the installed system family `Microsoft YaHei` / `微软雅黑` for all English, Chinese,
  phonetics, captions, and tables. Do not substitute PingFang, SimHei, Arial, or a generic
  sans-serif when Microsoft YaHei is available.
- Use the same family for example sentences. A monospace fallback may follow it in CSS, but
  Microsoft YaHei must resolve first.
- Set `letter-spacing: 0`. Do not condense, stretch, italicize, outline, or add a heavy shadow.
- Preserve the sample's hierarchy rather than applying one size everywhere. Typical ranges:
  root/title `88-128px`, headword `58-106px`, explanation `38-52px`, table text `25-40px`,
  caption `38px`.
- Highlight fragments with separate styled runs so only the intended prefix, root, suffix, or
  action turns orange. Do not color an entire sentence orange.
- Reproduce line breaks deliberately. Never shrink text so far that it loses the sample's visual
  weight; instead adjust the line break, width, or composition.

## Layout and reading order

- Keep all essential content inside `x=88..1832` and below the `54px` top safe inset.
- Reserve the lower caption band. Place captions `34px` above the bottom edge; keep diagrams,
  arrows, and illustrations from competing with that text.
- Prefer one dominant word or semantic bridge per beat. Build the frame around that focus with
  generous white space.
- Follow the sample's visual grammar: word/root first, meaning next, illustration or example
  after it, then arrows and supporting labels. Do not reveal the finished diagram at once.
- Use explicit scene data for all visible words and the final summary. Never infer a summary
  from every word mentioned in narration. For example, the `reg` sample explains `region` but
  intentionally omits it from the summary; preserve that omission and the sampled row order.
- Use a two-column summary only when the sample does. Keep rules thin, cells unboxed, and rows
  dense enough to scan without turning the page into a dashboard.

## Illustration language (Ian Xiaohei)

Use the project-local source skill at
`references/ian-xiaohei/ian-xiaohei-illustrations`,
resolved from the repository root.
Read its `style-dna.md`, `xiaohei-ip.md`, `prompt-template.md`, and `qa-checklist.md` before
authoring a prompt. Every raster illustration must contain a solid-black Xiaohei with white dot
eyes, thin legs/occasional thin arms, a blank serious expression, and a core action that explains
the word. Keep black wobbly line sketch dominant; use orange for a main path, red for a key
problem/result, and blue only for a secondary state. Keep at least 35% quiet white space and make
the subject about 40-60% of the canvas. Xiaohei is a deadpan worker, never a cute mascot.

- Prefer existing project artwork that already matches the current sample and Xiaohei DNA. Generate
  missing subjects with the built-in `image_gen` raster model and keep the episode-local bitmap in
  `public/assets/replica/<slug>/`. A transparent or flat-color source plate is an implementation
  detail only when the configured image workflow requires it; it is never the visual style shown to
  the viewer.
- Never include `Ian Xiaohei`, an artist name, an account name, a style number, or similar
  attribution in the text sent to the image model. Models can turn those tokens into visible
  signatures. Express the DNA as a solid-black deadpan worker, white dot eyes, thin limbs,
  sparse wobbly product-sketch lines, and restrained orange/red/blue accents.
- If a source plate is used, chroma cleanup must clear the outer 7% safe band, remove pale-green and
  anti-aliased green fringes as well as exact `#00FF00`, and preserve intentional white holes such as
  the eyes. Inspect the final white-background composite; a successful removal alone is not approval.
- Never place a white rectangular crop around an illustration.
- Match the sample's readable silhouette and restrained detail through Xiaohei's strange product-
  sketch language. Avoid glossy 3D, photographic stock aesthetics, children's-book cuteness,
  busy scenery, and large drop shadows.
- Preserve meaningful direction and pose. A character pushing left, an object being compressed,
  or a ruler pointing to a word is semantic content, not interchangeable decoration.
- Allow a project-specific exception for a recognizable real object or brand shown by the
  sample, such as Buick Regal. Match recognizability and framing without changing the shared
  white-canvas typography system.
- For a non-identity-critical brand example, prefer a code-drawn, logo-free object after repeated
  model failures. Never accept generated badges, model names, license plates, or watermarks just
  to preserve superficial realism.
- Generated RGBA files may retain a 16:9 transparent canvas. In near-square layout boxes, set
  `fit: 'cover'` selectively when the central subject becomes too small, and inspect the settled
  frame to prove that no semantic extremity is cropped. Do not change the global image fit.

## SVG arrows and small icons

- Draw arrows, rules, brackets, quote marks, sparks, hearts, speech marks, checks, impact marks,
  newspapers, printers, books, and boxes in code as SVG. Do not ask the image model to render
  them.
- Use curved, slightly hand-drawn paths rather than generic UI chevrons. Keep strokes primarily
  deep blue and use orange only for the active relationship.
- Animate arrow paths with a stroke draw, then reveal the arrowhead. Make arrow direction match
  the spoken semantic relationship.
- Keep icons small and supportive. Use them to punctuate a reveal or clarify an action; do not
  scatter unrelated decorations across empty space.
- Give each icon a stable box so a pop animation cannot move adjacent text or alter layout.
- Reject an arrow whose direction is not named by the narration or required by the semantic
  action. Do not draw a generic sweep across a character merely to create a keyframe.
- Reject icons used only to occupy white space. A semantic Xiaohei action is the primary visual
  language; a clean icon may support a named object, state, tool, or focus target.
- When using a downloaded icon library, preserve source URL, icon ID/hash, author/collection when
  available, retrieval date, modifications, and license status in a machine-readable manifest.
  Keep unknown-license assets reference-only until reviewed. Normalize accepted icons to the
  series palette and line weight rather than mixing unrelated visual systems.

## Motion grammar

- Treat the first three seconds as a retention sequence, not a title card. Show a concrete
  curiosity, conflict, question, or payoff by frame 45 and change the visual state again by frame
  90. Rotate hook mechanisms across episodes; reject three consecutive episodes with the same
  spoken promise, composition, or reveal order.
- Reveal information serially in narration order. Start each layer near the word or phrase that
  introduces it; do not expose later answers early.
- In a derived-word chapter, keep the root identifiable through its accent color, then assemble
  the exact prefix and suffix with small, purposeful offsets. Preserve lexical order and final
  letter spacing. The completed spelling must be correct at every settled frame;
  do not let fragments overlap into a false intermediate word.
- Keep entry motion compact. The established engine clamps entries to `8-18` frames and exits to
  `6-10` frames at 30 fps.
- For new smooth-text work, use `smooth-typography.md`: smooth-rise, smooth-slide,
  smooth-reveal, smooth-out, and opt-in morpheme assembly. The table below documents
  legacy motion behavior retained for reproducing existing projects:

  | Motion | Established behavior | Best use |
  | --- | --- | --- |
  | `fade` | about 10 frames | quiet supporting copy |
  | `rise` | about 14 frames, `22px` upward settle | headings and explanations |
  | `pop` | about 16 frames, scale `0.72 -> 1` with soft overshoot | cute icons and key objects |
  | `wipe-up` | about 14 frames | short definitions or labels |
  | `slide-left/right` | about 15 frames over `34px` | comparison or directional ideas |
  | `typewriter` | usually `17-21 chars/s` | English examples and derivations |
  | `draw` | about 18 frames | arrows and connector paths |

- Let every completed reveal remain readable. Hold ordinary supporting information for at least
  `12` frames, key words/meanings for at least `18` frames, and a completed summary for at least
  `45` frames unless the reference clearly moves faster.
- Use sound effects only on meaningful visual actions: impact, press/stamp, whoosh, pop, or
  scribble. Keep them subordinate to narration.
- Never show a persistent `拆词 → 看动作 → 得词义` process rail. Animate the actual learning content:
  morphemes assemble, the root receives a short underline or color handoff, and the meaning lands
  on the semantic change with a quiet reveal. Vary the emphasis treatment between
  scenes instead of putting the same pop preset on every line.
- Default to semantic key poses with a fixed camera, clean cuts and readable holds; see
  `key-pose-storytelling.md`. No float, breathing, bounce or camera drift merely to keep a
  static image moving. Optional code props must explain a genuine continuous relationship,
  with correct contact geometry; there is no quota for physical mechanisms.
- A shared root may persist through many chapters while its prefix, coordinate direction,
  semantic action, explanation, and camera focus change. Crossfade supporting chapters over
  8-16 frames, but hand off prefixes exclusively so two morphemes never overlap into a false word.

### Dynamic Xiaohei motion

- Default to accepted static Xiaohei key poses with deterministic Remotion timing. Generate
  Wan actions only when the user explicitly requests Wan, image-to-video, or generated dynamic
  Xiaohei for the current task; an available credential does not authorize generation. Keep exact
  replicas sample-authoritative. Follow `dynamic-xiaohei.md` for this opt-in branch.
- Generate locked-camera five-second native-speed actions. Prefer literal-white RGB PNG frames
  with neutral white-level normalization and no subject matte. Render one frame at a time; use
  the documented single-frame ping-pong or one action plus still holds for longer chapters.
  Do not slow 150 frames across a longer chapter or dissolve two opaque white frames.
- Use green-screen RGBA only when repeated white-background attempts cannot pass the white-plate
  and semantic-action gates. For that fallback, use premultiplied-alpha scaling and the approved
  short loop-boundary dissolve or a single action plus still holds.
- Preserve the solid-black body, white dot eyes, thin complete limbs, deadpan identity, semantic
  direction, and prop relationship across every frame. Reject character drift even when motion is
  fluid.
- Keep code-drawn arrows and effects off the illustration unless they encode a narrated
  relationship. Remove crosshairs, trajectories, borders, or sweep lines that cover Xiaohei or
  text merely to add activity.
- Inspect 100% and 200% white-background frames or composites. For RGBA fallback, also inspect
  alpha-only views and use a soft subpixel matte. Reject broken limbs, hard stair steps,
  green/cyan halos, gray fringes, tinted plates, or blur.

## Repeated chapter composition and collision safety

- Do not default every chapter to text-left/art-right. Use at least two compatible compositions
  across a multi-word episode: text-left/art-right, art-left/text-right, centered semantic action,
  root map, or full-width examples/summary.
- Composition variation must preserve reading order. Keep the assembled word and formula together
  in one teaching zone and the semantic illustration in a separate art zone.
- Treat those zones as hard bounds. Include the maximum configured semantic translation, scale,
  rotation, and camera drift when proving separation. Transparent pixels do not excuse an image
  element or visible subject crossing into title, formula, meaning, example, or caption space.
- For mirrored chapters, remount the image in a new fixed art box; do not translate a broad
  16:9 image canvas across the page and hope its transparent area prevents collision.
- Review anticipation, climax, and settle frames for every layout variant. If a `cover` fit crops
  a hand, tool, path, boundary, or Xiaohei extremity, switch to `contain` and apply only a
  restrained local scale that still fits the hard zone.

## Transitions and ending

- Build scene transitions from short layer fades into the same pure-white canvas. A restrained
  near-blank white beat is acceptable; colored wipes, black flashes, 3D transitions, and page
  turns are not part of this style.
- Keep cuts invisible by aligning outgoing and incoming white backgrounds. Do not crossfade two
  dense diagrams on top of each other.
- Configure the final darkening per project with `fadeToBlackSec` and `fadeEndOpacity`. Use a
  zero duration or zero opacity to disable it; otherwise fade a black full-frame overlay only at
  the end. Duration is `0-1.5s` and opacity is `0-1`.
- Preserve the sampled tail when replicating a sample. The golden `press` project uses `0.5s`;
  `reg` is approximately `0.6s`; both reach opacity `1`. The `fer` and Bouba/Kiki samples end at
  partial darkening and must keep their measured opacity. Do not introduce black anywhere else.

## Unified Douyin cover cards

- Export `outputs/<slug>/cover.png` at exactly 1080x1440. Keep the background literal `#FFFFFF`
  and use the same Microsoft YaHei, `#041FA0`, and `#E85810` palette as the episode.
- Preserve the shared front-end component and its fixed regions: series mark at upper left,
  outlined series pill at upper right, oversized root/meaning in the upper half, Xiaohei action
  in the middle-right illustration zone, word-family chips near the bottom, and the quiet footer.
- Highlight the shared root inside each word in orange. Keep the rest deep blue. Prefer one row;
  wrap deliberately when the list or words are long rather than shrinking below thumbnail size.
  For a five-item family with long words, first reduce chip padding, gap, and type only to the
  established dense size; never let a wrapped chip collide with the footer. Inspect the actual
  270x360 export rather than assuming flex wrapping is safe.
- Reuse the episode's strongest accepted raster action illustration. Generate a separate built-in
  `image_gen` image only if no existing asset expresses the core action, and pass it through the same
  Xiaohei, composition, transparency, and no-baked-text gates.
- Judge the cover at full size and at 25% scale. The root, English meaning, Chinese meaning, and
  Xiaohei silhouette must remain immediately recognizable in the thumbnail. Do not add gradients,
  texture, drop shadows, scenic backgrounds, or dense explanatory copy.
- Also export `outputs/<slug>/cover-landscape.png` at exactly 1200x900 (4:3). This is the
  Xiaohongshu landscape cover, not a 16:9 video still. Reflow the same hierarchy
  into a left teaching column, a right semantic-action illustration zone, and a full-width word
  family/footer band. Keep the same keyline, palette, typography, and content; never stretch the
  vertical card or crop it to 16:9.
- Inspect the landscape result at full size and at 400x300. Reject title/art collisions, chips
  touching the footer, arrows crossing section labels, illustration extremities leaving the
  keyline, or a root and meaning that become secondary to empty space.

## Fidelity rule

Match the sample before applying aesthetic preference. A clean frame that changes the sampled
story order, omits a cute icon, replaces a semantic arrow, changes the summary list, or reveals
content early is not a faithful replica.
