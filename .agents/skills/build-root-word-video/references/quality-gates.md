# Quality Gates

Do not call a root-word video complete because it renders. Pass every applicable automated gate
and the sample-alignment review below. Record commands, measured values, and comparison artifacts
in the project log.

## 1. Source and configuration gate

- Identify the exact target sample and probe its width, height, frame rate, stream duration,
  codec, and final-darkening interval before authoring.
- If the user did not attach a sample, select the latest locally accepted full-series sample; a
  newer accepted experiment supersedes an older formal output for visual comparison.
- Create an explicit beat map from the sample: scene boundary, spoken idea, visible text,
  illustration, icon/arrow, entry order, exit, and expected hold.
- Create one typed word-to-visual row per target word, with unique word/scene ID, current meaning,
  example, causal Xiaohei action, three pose paths and one explicit summary row. Closely contrasted
  words must not share a pose set. Store the sampled summary rows and order explicitly. Do not
  generate the summary by collecting only a subset of body words or by inference at render time.
- Run `npm run replica:preflight -- --project=<slug> --plan-only` before image/TTS generation.
  After generating poses, compositing on white and recording human visual approval, run the full
  `npm run replica:preflight -- --project=<slug>`. Fail closed on a missing word, reused pose path,
  missing summary coverage, incomplete three-state timing, unverified asset or absent review mark.
- Confirm every scene has a unique ID, positive duration, non-empty narration, captions, and
  layers wholly inside its scene.
- Require scenes to be contiguous: no overlap and no unintended gap. Require the final scene end
  to equal the storyboard duration within `0.002s`.
- Set `fadeToBlackSec` explicitly in `0..1.5s` and `fadeEndOpacity` in `0..1`, including zero
  values when darkening is disabled.

Run from the repository root:

```powershell
npm run typecheck
npm run replica:validate -- --project=<slug>
```

Both commands must exit `0`. Treat warnings as review items, not noise.

## 2. Narration and SFX gate

- Require one decodable narration file and one manifest entry per scene; reject unknown manifest
  IDs and paths outside `public/`.
- Use the instruction syntax supported by the configured provider/model/voice. Provider rejection
  must surface as a hard error by default; do not silently remove the instruction and retry.
  Cache identity includes both normalized narration and the full voice/profile settings so changed
  text or delivery parameters cannot reuse an old MP3.
- Require the probed clip duration to match its manifest within `0.08s`.
- Fit narration naturally. Reject a required playback rate above `1.16x`; manually review rates
  above `1.12x`. Prefer editing narration or extending the scene over speeding speech.
- Listen to every scene boundary. Reject clipped syllables, doubled starts, abrupt tails,
  synthetic mispronunciation, incorrect stress, and an audio cut hidden by the visual fade.
- For list/table scenes, compare narration tokens against every visible row in order after the
  final wording edit. Regenerate only the affected scene audio and re-probe its duration; an old
  narration clip that still decodes is not evidence that the visible list and speech agree.
- Keep speech intelligible over SFX. Trigger SFX on the visual action, not merely at scene start.
- Require the configured background-music file to exist under `public/` before any draft or final
  render. The default shared path is `public/assets/music/root-word-series-bgm.mp3`. Reject vocals,
  spoken samples, audio tags, abrupt endings, obvious loop clicks, heavy bass, sharp percussion,
  busy lead melody, or any arrangement that competes with Chinese narration.
- Prefer one original 180-second seamless instrumental master for the whole series. Keep it as one
  continuous timeline-level track rather than restarting it per scene. The established mix starts
  at `0.10`, ducks to `0.045` under narration, uses about `0.25s` attack / `0.55s` release, and
  applies `1.2s` program fade-in / `2.0s` fade-out. Change these only after a listening review.
- Verify narration-only coverage from the manifest and scene timing even when background music is
  present. Music makes a full-mix silence scan unable to reveal early-ending narration, so every
  candidate-only gap of at least the configured threshold remains a failure unless it matches a
  documented reference pause.
- Decode the final mix and reject NaN samples, dropouts, channel loss, or clipping. Target a true
  or sample peak at or below `-1 dBFS`; the accepted `press` mix peaks at about `-2.95 dBFS`.
- Scan the target sample and final mix with the same silence threshold and minimum duration, and
  separately inspect narration-only scheduled coverage whenever music is present. A
  recommended teaching-video gate is `silencedetect=n=-45dB:d=1.2`. Reject every candidate-only
  long silence. Permit a pause only when the sample has a corresponding pause and the project
  records a tight time window plus its teaching reason. Do not add white noise or unrelated music
  merely to make silence detection pass; repair narration coverage at the scene level.
- Require AAC stereo at `48 kHz` in the final MP4 unless a delivery platform explicitly requires
  another audio format.

## 3. Transparent illustration gate

Run:

```powershell
npm run replica:assets:verify -- --project=<slug>
```

Every declared illustration must pass all current deterministic limits:

| Check | Pass condition |
| --- | --- |
| File format | PNG, 8-bit RGBA, color type 6 |
| Resolution | at least `1920x1080` |
| Aspect ratio | 16:9 within `1.5%` |
| Four corner alpha | each `<= 8` |
| Four 16x16 corner patches | each at least `97%` transparent at alpha `<= 8` |
| Visible subject coverage | `1.5%..65%` of pixels |
| Visible green residual | `<= 0.15%` of visible pixels |

Use `0.15%` only as the rejection ceiling; target `0.000%` residual, as achieved by the golden
`press` assets. Inspect every cutout at 100% and 200% on white. Reject green halos, gray matte,
missing interior holes, clipped extremities, semi-transparent text, or a surviving background
rectangle even if the numeric check passes.

Also reject model-written signatures, style names, account IDs, sequence numbers, logos, and
license-plate text. Inspect the outer 7% band for pale-green floors, white/green rims, and faint
rectangular plates; deterministic corner transparency alone may miss them.

Also scan the inner-edge zones just inside the cleared outer band. Reject wide opaque horizontal
or vertical strips, letterbox bars, inset frames, and dark panels even when all four corners are
transparent. A model can place a full-width bar roughly 8%-15% from an edge and still pass a
corner-only check; combine row/column occupancy with a white-composite review.

## 3a. Xiaohei style gate

- Read the local Ian Xiaohei source references before reviewing prompts or assets.
- Select an already accepted project Xiaohei image and the local Ian examples as visual anchors;
  text-only prompts and generic black-bean/stick-figure generations are not sufficient evidence
  of style fidelity. Review the actual candidate, not only its prompt or filename.
- Require Xiaohei in every core teaching beat and on both covers. Xiaohei must remain the primary
  semantic actor after all icons, diagrams, labels, and effects are composited.
- Every raster illustration must visibly use the black solid Xiaohei with white dot eyes and thin
  legs/arms as the semantic actor. Reject an image where Xiaohei is only a decorative bystander.
- Require wobbly black hand-drawn linework, pure white final background, at least 35% quiet space,
  and restrained orange/red/blue marks. Reject colored commercial cartoons, cute mascot poses,
  children's illustration, 3D/photorealism, PPT-like grids, scene frames, or scenic backgrounds.
- Before TTS generation, final scene timing, or rendering, inspect the full pose contact sheet and
  each full-resolution pose composited on pure white at 100% and 200%. Compare body proportions,
  solid silhouette, white dot eyes, limbs, expression, and line character to the accepted anchor.
  Then inspect the actual lesson composition and a phone-size still. Alpha/resolution/coverage
  checks are technical gates only; their pass cannot promote a visually wrong character or an
  obscuring composition to accepted status.
- For a physical root-word action, require distinct `before / change / result` stills derived from
  one accepted composition unless the concept has no honest causal transition. Keep scene camera
  and Xiaohei scale stable; mount states as exclusive intervals rather than moving one full image.
  Keep semantic props local and subordinate. A large raster geometry can be as obscuring as an SVG:
  remove any panel, plate, trajectory, or mechanism that covers Xiaohei or visually dominates the
  semantic action. Small code-drawn labels/rules and a spoken-direction arrow are allowed only as
  supporting layers, never as the action demonstration itself.
- Check that one image communicates one action/structure and has no baked title or long text. Keep
  labels as code-rendered text so typography remains Microsoft YaHei.

## 3b. Dynamic Xiaohei gate

Wan / image-to-video generation is retired. Existing `*-motion` frame sequences may be re-rendered
as they are (150 frames per referenced directory, checked by `npm run project:check`); new episodes
use static key poses and Remotion keyframes.

## 4. Typography and safe-area gate

- Verify `C:\Windows\Fonts\msyh.ttc` and the needed weight file exist before rendering.
- Confirm the browser resolves `Microsoft YaHei` / `微软雅黑`; reject a fallback-rendered output.
- Inspect at least one frame containing Chinese, English, and phonetics at final resolution.
- Require `letter-spacing: 0`, clean glyph edges, correct punctuation, correct phonetics, and the
  same intentional line breaks as the storyboard.
- Keep essential content inside `x=88..1832` and below `y=54`. Reject clipping at every frame,
  not only at the layer's settled pose.
- Keep captions within the same left/right safe bounds and `34px` above the bottom. Use the
  established `38px`, weight `600`, line-height `1.45` treatment unless the reference proves a
  project-specific exception.
- Reject captions longer than two lines, orphaned punctuation, text/image collisions, overlap
  with summary rows, and any caption whose final words disappear before narration ends.

## 5. Animation and timing gate

- Verify each reveal against narration at frame level. Target key visual onset within `0.20s`
  (`6` frames) of the corresponding spoken cue unless the sample deliberately anticipates it.
- Reject a frame that exposes a later definition, answer, derived word, or summary row before its
  spoken beat.
- Keep entry durations within `8-18` frames and exits within `6-10` frames unless a sampled event
  provides clear contrary evidence.
- Require a settled readable hold of at least `12` frames for supporting information, `18` frames
  for a key word/meaning, and `45` frames for a completed summary, unless the target sample is
  measurably shorter.
- Check arrow draw direction, arrowhead appearance, pop overshoot, typewriter completion, table
  row order, and layer z-order. Reject any animation that changes neighboring layout.
- For each discrete root-action pose group, review every state and each encoded MP4 cut at `-1/+1`
  frames. Confirm the states are mutually exclusive, visible in narration order, and not replaced by
  translation/rotation of one still; verify the composited character remains unobscured.
- Inspect the frame before and after every scene boundary. Reject one-frame flashes, stale layers,
  duplicated captions, dense crossfades, and unintended blank gaps.
- Permit white fades between ideas. Reject colored transition plates and every black frame before
  the configured final fade.

## 6. Render and media gate

Render through the guarded command:

```powershell
npm run replica:render -- --project=<slug>
```

The guarded render, cover, and review-still entry points build an isolated `public/` tree from the
project's audio, BGM, SFX, visible image layers, continuous-frame directories and cover artwork.
Keep this set scoped to the current episode; do not copy the repository's complete historical media
tree. Missing referenced assets must fail with their exact path before browser rendering begins.

Then probe the output. Require:

```powershell
npm run replica:render:verify -- --project=<slug>
```

| Property | Pass condition |
| --- | --- |
| Dimensions | exactly `1920x1080` |
| Frame rate | constant `30/1` |
| Video frames | exactly `round(storyboard.duration * 30)` |
| Video duration | exactly `frame_count / 30`, within probe rounding |
| Video codec | H.264 |
| Pixel format | 4:2:0 (`yuv420p` or full-range `yuvj420p`) |
| Audio codec | AAC, stereo, `48000 Hz` |
| Container tail | no unexplained tail; AAC padding up to about `0.10s` beyond video is acceptable |
| Full decode | video and audio streams decode from start to end with `-xerror` |
| Narration coverage | no gap >= configured threshold outside documented reference-matched allow-windows |
| Background music | configured source present, continuous/loop-safe, ducked under speech, no audible click |
| Full-mix long silence | none outside documented reference-matched allow-windows |

The golden `press` evidence is `5180` video frames, `172.666667s` video duration, and
`172.714667s` container duration. Do not copy those values to another project; calculate its
expected frame count from its storyboard.

Reject duplicate/dropped frame cadence, corrupt packets, an absent stream, a blank video stream,
or a render that silently used draft half-resolution settings.

### Static key-pose gate

For the default static-image mode, apply `key-pose-storytelling.md`: verify distinct causal
states, identity and object continuity, narration-triggered cuts, stable art/text zones and
readable results. Static holds longer than four seconds are allowed when explanation needs
them. Run `npm run replica:keyposes:review -- --project=<slug>` after rendering to extract the
encoded MP4 frame immediately before and after each planned word-pose cut and build full-size and
mobile contact sheets; inspect those pairs on the actual MP4, not only on source PNGs. The optional
`replica:stills -- --project=<slug> --keypose-cuts` is an earlier source-timeline preview. Motion
quantity and mechanism counts are not gates.

### Optional continuous-stage upgrade gate

For an explicitly selected continuous-motion episode, also require all of
the following:

- The shared root/background coordinate/camera stage is mounted once across the composition;
  narration, captions, SFX, and BGM keep their original scene timing.
- Extract boundary frames at `-3`, `-1`, `+1`, and `+3`. Reject a near-empty white bridge, a
  one-frame root jump, two complete dense tableaux, a doubled prefix, or a false combined word.
- Extract each semantic action at anticipation, contact/climax, and settle. Require the motion to
  encode the direction/relationship rather than merely moving text into place.
- For semantic-prop motion, inspect preparation, contact, consequence, and settle separately.
  Reject a ray, ball, spring, path, waveform, or force arrow whose contact point floats away from
  Xiaohei's hand/prop, crosses teaching text, or repeats the same motion template without a
  different physical meaning. Inspect every used cross-scene prop handoff at boundary `-3/+3`; do not add mechanisms
  to meet a numerical quota.
- Confirm every chapter has preparation, prefix/keyword reveal, semantic action, climax,
  explanation and a readable result. Add a directional handoff only when meaningful.
  Judge holds by comprehension and narration, not an arbitrary four-second ceiling.
- For every derived word, extract root-anchor, affix-travel, assembled, and settled frames.
  Require the exact configured prefix/root/suffix, correct final spelling, exclusive fragment
  handoff, and a readable completed-word hold.
- Require at least two intentional chapter compositions in a multi-word unsampled episode unless
  semantic direction makes variation misleading. Reject a sequence that repeats the same
  text-left/art-right card for every word.
- At anticipation, climax, and settle, prove that visible art and its transformed box remain
  outside the word, formula, meaning, note, example, and caption zones. Check both left/right
  layouts. Reject cropped semantic extremities and any collision hidden by transparent padding.
- Inventory every arrow and icon. For each, record the spoken direction, causal relationship,
  object, or state it clarifies. Remove items with no semantic justification.
- Require a completed Iconfont search pass for every new unsampled episode. The pass may accept
  zero icons, but the episode manifest or production log must record search terms, candidates,
  license findings, and the reason each accepted or rejected candidate improves or fails the
  teaching beat.
- Reject any accepted icon that replaces Xiaohei, dominates the frame, carries the entire semantic
  explanation alone, or reduces the legibility of Xiaohei's action. Iconfont is a bonus layer,
  never a completion requirement or primary illustration source.
- For external icon assets, require a manifest containing source URL, stable ID/hash, retrieval
  date, modifications, semantic beat, author/collection, license status, evidence URL, and a short
  permission paraphrase. Only explicit commercial-use approval with satisfied conditions may enter
  a published render. Unknown-license icons must remain reference-only.
- Search the continuous renderer and motion utilities for CSS transitions/animations, timers,
  requestAnimationFrame, real-time clocks, and randomness. All motion must be a deterministic
  function of the Remotion frame.
- Verify the encoded final MP4 at the action frames and final fade, not only source-render stills.

## 7. White-background and ending gate

- Render lossless stills from the first beat, a quiet background region in every scene, every
  boundary, the pre-fade frame, mid-fade frame, and final frame.
- Require source-render background pixels to equal RGB `(255,255,255)` exactly. For decoded H.264,
  allow at most one code value of compression variance only when the lossless still proves the
  source is `#FFFFFF`; reject any tint, texture, or gray cast.
- Check all four corners and several empty interior points, not just an average-whiteness score.
- When fade duration or end opacity is zero, require no dark overlay. Otherwise require a
  monotonic black overlay beginning at exactly the configured frame and a final empty-background
  value within two RGB code values of `255 * (1 - fadeEndOpacity)` after H.264 decoding.
- Reject a black flash, early dimming, or narration continuing audibly after the frame is black.

## 8. Sample-frame comparison gate

Compare the replica with the latest accepted target sample, not only with `press` or an older formal
output.

1. Extract paired frames at every scene start, each major reveal, the completed tableau, every
   scene boundary (`-1` and `+1` frame), summary start/completion, pre-fade, mid-fade, and final
   frame.
2. Build same-size side-by-side contact sheets with timestamps and scene/beat IDs.
3. Compare event order, wording, line breaks, palette, subject identity/pose/direction, bounding
   boxes, arrow geometry, icon presence, table membership/order, white space, and transition state.
4. Target major-object center positions within `3%` of canvas dimensions and apparent scale
   within `10%` of the reference, unless a documented improvement is approved by the user.
5. Target scene boundaries and reveal events within `0.20s`; require the total visual duration and
   sampled final fade to match within one frame after frame-rate normalization.

A comparison passes only when every unexplained mismatch is fixed or recorded as an explicit,
user-approved deviation. A contact sheet without written findings is evidence collection, not a
passed comparison.

## 9. Final review and cleanup gate

- Watch the full final-resolution MP4 once with sound and once muted. During the sound pass, check
  both speakers and headphones for speech masking, loop seams, pumping, excessive bass, and music
  that is effectively inaudible. The muted pass exposes
  pacing, early reveals, weak holds, and transition flashes.
- Re-run typecheck, project validation, asset QA, media probe, audio peak check, background pixel
  checks, and sample comparison after the last edit.
- Keep the project log, final MP4, manifests, used source assets, transparent assets, comparison
  frames/contact sheets, and the commands/results needed to reproduce approval.
- Keep root `PROJECT_MEMORY.md` current with every material activity and final cleanup evidence;
  use `docs/production-log.md` for per-render technical detail.
- Do not delete candidate or legacy files until all requested sample replicas pass comparison.
  Before cleanup, scan imports, manifests, static paths, scripts, and project registrations; delete
  only files proven unreferenced, then rerun every gate.
- When irreversible deletion is not explicitly approved, move proven-unused files into a dated
  archive outside `outputs/` with a manifest. Keep final outputs and runtime paths outside that archive,
  and report that the archive may be deleted after the user accepts the deliverables.

## 10. Cover card and publish-copy gate

- Run `npm run replica:cover -- --project=<slug>` and
  `npm run replica:cover:verify -- --project=<slug>` after accepted episode art exists.
- Require opaque PNGs at exactly 1080x1440 and 1200x900, each with four pure-white corner pixels
  and no alpha-dependent page background. Keep all essential elements inside the shared rounded
  keyline. The landscape image must be a real reflow, not a stretched or cropped vertical card.
- Confirm Microsoft YaHei is used for every Chinese and English text run. Require the exact
  episode root, core English meaning, core Chinese meaning, hook, and configured word-family list.
- Inspect both full-resolution images plus 270x360 and 400x300 thumbnails. Reject clipped art,
  crowded or tiny word chips, unintended line wraps, illegible root highlighting, arrows crossing
  labels, and a theme illustration whose semantic action cannot be recognized at thumbnail size.
- Reject any word-family row or wrapped chip that touches the footer. When long words exceed the
  row, use the shared density adaptation before allowing a second row; keep at least a clear text
  line of vertical separation from the footer.
- Keep the action illustration in the shared middle-right zone and text/code graphics in their
  fixed zones. A new episode may change content and art positioning, but not invent a new layout.
- Store the accepted covers beside the MP4 as `outputs/<slug>/cover.png` and
  `outputs/<slug>/cover-landscape.png`. Require both cover reports to pass.
- Run `npm run replica:copy -- --project=<slug>` and require
  `outputs/<slug>/publish-copy.md` as the canonical shared Douyin/Xiaohongshu text package;
  `douyin-copy.md` is an optional compatibility mirror with the same content. Read the generated
  Markdown and confirm that its title, core
  meaning, word list, and topic type match the project configuration exactly. Require one
  paste-ready body, relevant hashtags, and a pinned-comment suggestion. Reject transcript dumps,
  fabricated learning claims, internal production notes, and root-specific direction language in
  a sound-symbolism episode.
- A video without both accepted covers and its reviewed publish copy is not a complete new-series
  delivery.
