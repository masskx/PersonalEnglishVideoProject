# Background Music Contract

Use one audible, upbeat instrumental master across every white-canvas Xiaohei English video unless
the user requests a theme-specific score. These videos are primarily published on Douyin: music should
add forward motion and a recognizable short motif while remaining below narration. Music never
supplies teaching content and never fills a narration defect.

## Default generation prompt

```text
Create an original instrumental background track for a polished Douyin educational video about English word roots. Bright, upbeat, intelligent and lightly playful. Use crisp marimba or wooden plucks, short pizzicato, light electric piano, rounded bass and clean compact percussion. 104-112 BPM. Introduce the beat within the first second and write a memorable four-bar motif with a small variation every eight bars. Keep the arrangement clean enough for continuous Chinese narration and English word reading. Stable energy, no dramatic build, no emotional climax, no sudden transitions. Make the ending easy to loop. Instrumental only: no vocals, spoken words, choir, vocal chops, whistling or lyrics.
```

Negative prompt:

```text
vocals, singing, spoken words, rap, choir, lyrics, vocal chops, whistling, busy lead melody, heavy drums, trap hi-hats, EDM drop, rock guitars, cinematic trailer, orchestral climax, suspense, sadness, epic emotion, aggressive bass, sharp cymbals, sudden silence, risers, impacts, glitch, nursery music, comedy soundtrack, corporate jingle, watermark, audio tag
```

## Source and placement

- Prefer a 180-240 second seamless stereo MP3 or WAV at 48 kHz. Keep original downloads under
  `assets/background-music/minimax/candidates/`, review notes under `reviews/`, and accepted source
  masters under `accepted/` before copying the runtime master.
- Store the accepted master at `public/assets/music/root-word-series-bgm.mp3` and use it as the
  default for root-word, four-episode, and CET videos unless a newer approved MiniMax track is selected.
- Do not silently substitute a random local track or generate music unless the user asked for
  generation. If the required source is absent, report the exact path and stop rendering.
- Check that the source is instrumental, decodable, free from audible generator tags, and safe at
  the loop boundary. Keep provenance/licensing notes if the chosen service provides them.

## Mix policy

- Place music once at the composition level; never restart it per scene.
- Set the final level from measured source loudness instead of assuming a quiet multiplier. For a
  normally mastered source, start near `0.18`; narration-ducked level starts near `0.11`.
- Duck attack about `0.25s`, release about `0.55s`.
- Whole-program fade-in `1.2s`, fade-out `2.0s`.
- Use an absolute-frame volume curve across loops.
- Preserve narration boundary fades and meaningful SFX. Music is the lowest-priority audio layer.
- Reject final peak above `-1 dBFS`, speech masking, audible pumping, excessive bass, loop clicks,
  or music that disappears on ordinary phone speakers. Listen to a narration-heavy 20-second mix
  on phone-size speakers and headphones. If the music can only be detected on headphones, it fails.

For an approved exact-frame MP4 that only needs the standardized music backfilled, render the
complete audio mix through Remotion and stream-copy the accepted video stream during muxing. Never
use ffmpeg `-shortest` for this operation: equal nominal audio/video durations can still make it
drop the final video frame. Treat the video frame count as authoritative, omit `-shortest`, and run
the full exact-frame media verifier on the resulting MP4.

When background music is present, do not rely on full-mix silence detection to prove narration
coverage. Validate narration timing separately from the scene manifest and retain any narrow,
reference-matched pause windows in project quality configuration.
