# Background Music Contract

Use one restrained instrumental master across the white-canvas Xiaohei root-word series unless the
user requests a theme-specific score. Music supports continuity and curiosity; it never supplies
teaching content and never fills a narration defect.

## Default generation prompt

```text
Create an original instrumental background track for a clean, minimalist educational video series about English word roots. Warm, curious, intelligent, and lightly playful, like ideas being sketched on white paper. Use soft felt piano, muted marimba or wooden plucks, very light brushed percussion, subtle pizzicato accents, and a gentle rounded bass. Keep the arrangement sparse with plenty of breathing room for continuous Chinese narration. 86 BPM, steady and unobtrusive, no dramatic build, no emotional climax, no sudden transitions. The melody should be simple, original, and easy to ignore while listening to speech. Produce a seamless 180-second loop with a clean beginning and ending. Instrumental only, no vocals, no spoken words, no choir, no lyrics.
```

Negative prompt:

```text
vocals, singing, spoken words, rap, choir, lyrics, vocal chops, catchy pop hook, busy melody, heavy drums, trap hi-hats, EDM drop, rock guitars, cinematic trailer, orchestral climax, suspense, sadness, epic emotion, aggressive bass, sharp cymbals, sudden silence, risers, impacts, glitch, nursery music, comedy soundtrack, corporate jingle, watermark, audio tag
```

## Source and placement

- Prefer a 180-second seamless stereo MP3 at 48 kHz / 320 kbps.
- Store the accepted master at `public/assets/music/root-word-series-bgm.mp3`.
- Do not silently substitute a random local track or generate music unless the user asked for
  generation. If the required source is absent, report the exact path and stop rendering.
- Check that the source is instrumental, decodable, free from audible generator tags, and safe at
  the loop boundary. Keep provenance/licensing notes if the chosen service provides them.

## Mix policy

- Place music once at the composition level; never restart it per scene.
- Default level `0.10`; narration-ducked level `0.045`.
- Duck attack about `0.25s`, release about `0.55s`.
- Whole-program fade-in `1.2s`, fade-out `2.0s`.
- Use an absolute-frame volume curve across loops.
- Preserve narration boundary fades and meaningful SFX. Music is the lowest-priority audio layer.
- Reject final peak above `-1 dBFS`, speech masking, audible pumping, excessive bass, loop clicks,
  or music that disappears completely on ordinary speakers.

For an approved exact-frame MP4 that only needs the standardized music backfilled, render the
complete audio mix through Remotion and stream-copy the accepted video stream during muxing. Never
use ffmpeg `-shortest` for this operation: equal nominal audio/video durations can still make it
drop the final video frame. Treat the video frame count as authoritative, omit `-shortest`, and run
the full exact-frame media verifier on the resulting MP4.

When background music is present, do not rely on full-mix silence detection to prove narration
coverage. Validate narration timing separately from the scene manifest and retain any narrow,
reference-matched pause windows in project quality configuration.
