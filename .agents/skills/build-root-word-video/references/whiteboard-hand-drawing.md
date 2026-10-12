# Whiteboard hand-drawing treatment for raster illustrations

Use this mode only when the episode or user explicitly asks for a whiteboard reveal, hand-drawn
image treatment, or a visible hand holding a pen. It is an optional treatment for existing raster
illustration layers. It does not replace the Remotion story stage, narration, captions, BGM,
covers, or summary layout.

The implementation reference is the adapter [codex-whiteboard-video-skill](https://github.com/gnipbao/codex-whiteboard-video-skill);
the renderer is [whiteboard-video-engine](https://github.com/gnipbao/whiteboard-video-engine). Treat
the adapter and renderer as separate concerns. Verify that the renderer is callable before using
it; do not silently substitute an unrelated image filter when it is unavailable.

## Default decision and scope

- Start with a non-destructive pilot under `work/whiteboard-pilot/`. Do not overwrite `src/`,
  `public/`, or approved files under `outputs/` until the user accepts the visual result.
- Keep the existing episode's scene order, durations, 1920×1080 canvas, 30fps cadence, TTS,
  captions, SFX, BGM ducking, final fade, and Xiaohei-led semantic action.
- Apply the effect only inside the storyboard's image/art box. Never put an opaque whiteboard clip
  over the full composition, captions, word formula, examples, or summary table.
- Use the effect for teaching illustrations; do not automatically apply it to covers, icons, code
  SVGs, or text layers.
- Render one clip per unique illustration and reuse it only when the same source, crop, and timing
  remain semantically correct.

## Source preparation

Whiteboard rendering expects an opaque white RGB plate for this workflow. Transparent PNGs must be
composited onto literal `(255,255,255)` before rendering. Passing an RGBA source without preparing
the plate can make transparent pixels appear black in the extracted line art or final fill.

Use the prepared white plate as both the raster drawing input and `--source-image` when the source
already contains the final colored illustration. Keep the original transparent PNG unchanged for
the normal Remotion path and for covers.

## Tested pen-hand preset

Start from this project-tested preset, then adjust only after reviewing a contact sheet:

```text
render-image <white-plate.png> \
  -o <clip.mp4> \
  --duration <image-layer-duration> \
  --fps 30 --width 960 --height 540 \
  --source-image <white-plate.png> \
  --source-fit exact \
  --color-fill contour-wipe \
  --tail-color 1.2 \
  --stroke-detail rich \
  --hand asian \
  --hand-scale 0.72
```

The `asian` hand is the default accepted pen cursor for this series. `0.72` keeps the hand
visible while preventing it from covering the Xiaohei action; review a range around `0.65..0.85`
when the art scale or drawing path changes. Use `stroke-detail=balanced` for very dense mechanical
linework if `rich` creates distracting noise. Keep `source-fit=exact` unless the storyboard's art
box explicitly requires another fit.

The hand should be visible while the line art is being drawn, follow the active stroke, and then
leave enough of the completed color illustration on screen for the narration to land. A hand that
is absent, frozen away from the stroke, oversized, or still covering the completed semantic action
fails this mode.

## Timeline integration

For a first pilot, render the existing full Remotion episode and replace only its image regions with
the whiteboard clips. Preserve the original mixed audio stream so the test measures the visual
treatment inside the real TTS/BGM timing. Use explicit scene-local start/end times and the exact
`contain` art-box geometry from the storyboard; do not guess positions from the visible subject.

When integrating inside Remotion, mount the whiteboard clip or frame sequence as the image layer,
keep semantic props and arrows at their intentional z-order, and keep captions above all visual
layers. An opaque white plate may mask an underlying prop inside the art box, so inspect whether
the prop belongs above the whiteboard layer before accepting the composite.

## Review gates

Before showing the user a full version, complete all of these checks:

- Inspect contact-sheet frames at the start, mid-line drawing, color-fill, completed hold, and each
  scene boundary. Confirm the hand is visibly holding a pen and the art remains in its safe zone.
- Confirm the source plate and quiet interior points are literal white; reject black, gray, tinted,
  textured, or boxed backgrounds. Reject any baked title or text in the raster art.
- Check that the hand and drawing do not cross the word, formula, meaning, caption, example, or
  summary zones. Verify both text-left/art-right and art-left/text-right scenes.
- Probe the full candidate: 1920×1080, constant 30fps, H.264, exact expected frame count, and a
  decodable audio stream. Retain AAC stereo at 48kHz when the existing project uses it.
- Decode with `-xerror`, check the final peak remains at or below `-1 dBFS`, and verify that TTS
  coverage and continuous BGM are unchanged. A successful visual render without the original audio
  mix is not an accepted pilot.
- Watch once with sound and once muted. Reject early reveals, white rectangles over text, hand
  disappearance before the semantic action, black flashes, loop seams, or a completed image that
  has no readable hold.

Keep the pilot, prepared plates, whiteboard clips, overlay scripts, contact sheets, and review notes
under `work/whiteboard-pilot/`. Promote the effect into formal project assets only after the user
accepts the pilot and the normal project validation/render gates pass.
