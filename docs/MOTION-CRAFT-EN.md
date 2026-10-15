# Motion and sound craft (learned from awesome-ai-motion)

[guanmo-ai/awesome-ai-motion](https://github.com/guanmo-ai/awesome-ai-motion) is a gallery of 838
motion pieces made by AI-written code. 114 of them include the creator's public prompt. The most-saved
ones (a seamless UI morph loop, a beat-synced product ad, the MakerMap product journey and several
character-led explainers) all use the same small set of production principles. This page lists the
ones that fit our paper-and-Xiaohei shorts, where they live in the code, and what we chose not to copy.

The Chinese rule text that every agent session reads is in `AGENTS.md` and `docs/当前制作基准.md`
(section "动效与声音工艺"). This page is the English summary for you.

## What changed in our shorts

| Principle from the reference prompts | What our shorts do now |
| --- | --- |
| Every frame is a pure function of time | All motion is computed from the Remotion frame number, with no timers or carried state |
| Springs everywhere, a tiny overshoot at most, no bouncy easing | `settle()` is a closed-form spring with about 0.2% overshoot. It drives panel morphs, cards and options |
| "One shape, never cut", no dead time | The light-blue art panel stays on screen and morphs between beats. Before this, every beat change showed one blank paper frame |
| Content enters after its container starts moving and leaves before the next move | The old headline slides up and out (frames 0–6), then the new one rises in from frame 5 behind a mask |
| Zoom so each state fills the frame | The panel is 660 px tall (470 px with an example card) and subtitles moved down. The lower safe area is no longer empty |
| Short, clean swaps, no cross-fades | Pose changes are hard cuts with a tiny settle. When the panel opens or closes, the art is cropped like a blind. Xiaohei is never semi-transparent or shrunk |
| One beat file drives both picture and sound | `shortMoments()` sets the frame of each on-screen event. `shortEvents()` places the sound effects from the same table |
| Place each sound by its measured peak, not its file start | The renderer measures each SFX's peak, levels it and starts it early so the peak hits the event. The source SFX peaked at only −26 to −37 dBFS and played at 0.35 volume, so they were effectively silent |
| Loudness-normalize the master (−14 LUFS) | Two-pass loudnorm to −14 LUFS, true peak ≤ −1.5 dBTP. Music sits at 0.07 under speech and 0.10 in gaps |
| Check one frame per beat before trusting the full render | `review/beats-sheet.jpg` shows four frames around every beat change. A blank-frame gate stops the render if a frame near a change is almost empty paper |

Measured on `include-exclude` (same script, same voice, before and after):

- Blank frames at beat changes: before, frames 131, 265, 409, 411 and 549. After, none.
- Loudness: before, −17.6 LUFS (true peak −3.7 dB). After, −14.0 LUFS (true peak −1.2 dB).
- Xiaohei: before, he faded to grey during transitions. After, he is always solid black.

## What we chose not to copy

- **Snapping cuts to the music's beat grid.** Our pace is set by the narration. Forcing every cut onto a
  beat would add over half a second of dead air per beat and break the 20–30 s target.
- **60 fps with sub-frame motion blur.** It doubles render time and adds little to flat paper motion.
- **Seamless loops where the last frame equals the first.** Our last frame is the answer, so jumping back
  to the hook question would confuse viewers.
- **Their visual style:** particles, glows, camera shake, neon, 3D. The paper palette and Xiaohei stay.

## Continuing in Claude Code (local or cloud)

Nothing extra is needed. Every session reads `AGENTS.md` first, and the rules, gates and tests are all
in the repository. For a new short, ask as usual ("make a short about …"). The agent then:

1. appends the script to `src/shorts/library.ts`;
2. runs `npm run shorts:voice -- --short=<id> --generate --prune`;
3. runs `npm run shorts:render -- --short=<id>`. This applies all of the craft above, normalizes the
   loudness, and fails if any beat change shows a blank frame;
4. checks `review/contact-sheet.jpg`, `review/beats-sheet.jpg`, the three covers and `review/report.json`
   (loudness and blank-frame results);
5. runs `npm run project:test`. It checks that the SFX come from the shared event table, that every beat
   change has a transition sound, and that the options are on screen before the countdown.

In a cloud session, install dependencies with `npm ci --force`. The plain `npm ci` stops on the
Windows-only Remotion compositor package; `--force` installs the Linux one alongside it.
Run `git lfs pull` too, so the art and audio files are real files and not pointers.
