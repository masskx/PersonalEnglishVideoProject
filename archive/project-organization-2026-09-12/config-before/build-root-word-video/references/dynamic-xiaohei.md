# Dynamic Xiaohei with Wan I2V

This is an opt-in paid branch. Do not submit Wan tasks unless the user explicitly requests Wan,
image-to-video, or generated dynamic Xiaohei for the current task. An available API key is not
authorization to spend. Otherwise keep Xiaohei static at the source level and use deterministic
Remotion transforms for economical motion.

## Preferred path: white-background RGB, no subject matte

Use this path first for the white-canvas series.

1. Composite the approved static Xiaohei pose onto a literal `#FFFFFF` 16:9 plate. Keep the
   semantic action centered inside the final art safe zone with ample white padding.
2. Require a locked camera, one continuous five-second native-speed action, exact character and
   prop counts, and a perfectly uniform white background throughout. Explicitly forbid floors,
   shadows, gradients, vignette, texture, borders, panels, camera movement, fades, text, and logos.
3. Poll the Wan source MP4, then run `scripts/white_wan_video.py`. It extracts exactly 150 RGB PNG
   frames at 30fps and 1664×928, maps only near-neutral highlights to literal white, forces a
   narrow safe border to white, and writes a QA report. This is full-frame white-level
   normalization, not foreground segmentation; it must not create Alpha.
4. Inspect frames 0, 74, and 149 plus anticipation, climax, settle, and the encoded render.
   Reject gray/tinted rectangles, scenic backgrounds, generated shadows, identity drift, extra
   limbs, missing/added props, logos, and text.
5. Render one RGB frame at a time. Do not reuse the transparent-sequence two-frame loop dissolve:
   two opaque white plates at partial opacity create a visible double image. Prefer a native
   single-frame ping-pong sequence over frames 15–149 when a scene outlasts five seconds. Do not
   stretch time and do not hard-cut frame 149 to frame 0.

Example:

```powershell
python .agents/skills/build-root-word-video/scripts/white_wan_video.py `
  --input outputs/<slug>/wan-white/<id>.source.mp4 `
  --frames-dir public/assets/replica/<slug>-white-motion/frames/<id> `
  --report outputs/<slug>/wan-white/<id>.white-report.json
```

Use the green-screen RGBA branch below only when repeated white-background attempts cannot pass
the white-plate and semantic-action gates.

Keep exact sample replication sample-authoritative. A static cover remains valid. Dynamic
Xiaohei teaching beats are required only when the user explicitly opts into this paid branch.

## Green-screen fallback: cost-controlled generation

The following generation and matting steps apply only after the preferred white-background path
cannot pass review. Both branches require the same explicit current-task opt-in.

1. Lock narration, beat map, action direction, and art safe zones before spending generation
   credits.
2. Start from an accepted transparent Xiaohei illustration composited onto a literal `#00FF00`
   16:9 plate. Use large green padding, no floor, shadow, scenery, text, logo, frame, gradient, or
   green subject detail.
3. Generate one five-second clip per unique core action with `wan2.2-i2v-flash`, `480P`,
   `duration: 5`, `prompt_extend: false`, and `watermark: false`. Use 720P only after a 480P trial
   proves that source resolution—not matting—is the visible limitation.
4. Keep the camera locked. Prompt only the semantic body/prop motion and forbid camera movement,
   scene changes, deformation, flicker, blur, extra characters, writing, and background changes.
5. Reuse a clip only when the action remains semantically correct. Mirroring is allowed for a
   reversible left/right direction; never reuse an inject, collide, or under/over action merely to
   save cost.
6. Save the task manifest, source hash, model, resolution, seed, prompt, task ID, status, and local
   source MP4. Never store the API key in a manifest, log, Skill, prompt, or artifact. Read it from
   a project `.env` that is listed in `.gitignore`.

At current China list pricing, a 480P five-second flash clip is roughly CNY 0.50. Treat this as an
estimate and verify current official pricing before quoting or budgeting.

## Green-screen fallback: matting and frame delivery

Do not feed a transparent VP9 WebM directly to Remotion. Browser alpha-video decoding and
fractional playback can stutter. Use deterministic PNG frame sequences:

1. Detect green components connected to the outer image boundary. Preserve enclosed pale/green
   regions as subject interiors instead of punching holes through eyes or props.
2. Protect Xiaohei's dark 1–2 px limbs with a restrained dark-ink support mask. Use a soft
   subpixel alpha edge; a hard binary support produces visible stair steps.
3. Despill every pixel with nonzero alpha, including the Gaussian fringe—not only the hard
   foreground mask.
4. Upscale 2x with premultiplied alpha. Resize premultiplied RGB and alpha separately, unpremultiply
   only after resizing, apply a restrained `~1.25 px` alpha softening at the 2x size, then despill
   again. Straight-RGBA resizing can interpolate invisible green RGB back into a visible halo.
5. Export exactly 150 RGBA PNGs for each five-second 30fps clip. Preserve a source MP4 and a JSON
   matte report beside the generation evidence.
6. In Remotion, choose the PNG by composition frame. Keep native 30fps motion. Do not stretch a
   150-frame clip to fill a longer scene.
7. Loop with a short deterministic dissolve: use frames `15..134`, then crossfade
   `135..149` into `0..14`, and continue at `15`. This yields a smooth 135-frame cycle without a
   hard `149 -> 0` cut. If the action cannot tolerate a dissolve, place one native-speed action
   at the narrated beat and hold an accepted still before/after instead.

Use the bundled scripts as starting points:

```powershell
tsx scripts/wan_i2v_submit.ts --input=<green.png> --id=<scene-id> `
  --prompt="<locked-camera semantic motion>" --out-dir=outputs/<slug>-wan
tsx scripts/wan_i2v_poll.ts --manifest=outputs/<slug>-wan/<scene-id>.task.json
python scripts/key_wan_video.py --input=outputs/<slug>-wan/<scene-id>.source.mp4 `
  --frames-only --frames-dir=public/assets/replica/<slug>-motion/frames/<scene-id> `
  --output-scale=2 --report=outputs/<slug>-wan/<scene-id>.matte.json
```

Copy the scripts into the target repository or adapt existing equivalents. Keep credentials
project-local.

## Dynamic-motion QA

Reject the sequence unless all conditions pass:

- Exactly 150 readable PNGs at 1664x928: RGB without alpha for the preferred white-background
  path, or RGBA after the documented 2x rebuild for the green-screen fallback.
- No empty frame and no unexplained frozen run.
- Xiaohei identity, white dot eyes, thin limbs, action direction, and prop relationship remain
  stable across the full clip.
- No green plate, green/cyan halo, gray matte, white rectangle, clipped extremity, broken limb,
  generated text, logo, signature, extra character, or scene/camera change.
- Review 100% and 200% white-background frames or composites. For the RGBA fallback, also inspect
  alpha-only views for missing limbs and holes.
- Inspect the encoded MP4, not only source PNGs, at loop seam, action climax, and settled frames.
- Keep Xiaohei the primary semantic actor. Icons and code diagrams remain secondary.

Record accepted and rejected generations, estimated cost, frame QA, user feedback, and final
render evidence in the project log. Do not generalize a new matting rule until an actual episode
has passed user review.
