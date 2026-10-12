# Bouba/Kiki reference analysis

- Reference: `样片/video_用“波巴奇奇”记语音象征的发音组..._0.mp4`
- Media: 1920x1080, H.264 High, yuv420p BT.709 limited, 102.300000s; nominal 30fps,
  average 28610/1023, 2861 source frames; AAC HE-AACv2 44.1kHz stereo, 102.259s.
- Replica target: 1920x1080, 30fps CFR, 3069 frames, pure white canvas.
- Ending: background remains white through about 101.5s. It measures RGB 203 at 102.0s and RGB
  68 at 102.25s/final. Use about `fadeToBlackSec: 0.4`, `fadeEndOpacity: 0.733`.
- Evidence: `edit/verify/bouba-reference/` contains 2s frames, contact sheets, key frames, and final
  pixel samples.

## Beat map

| Time | Content and visual order |
| --- | --- |
| 0.0-7.0 | Present alien words `Bouba` and `Kiki`; reveal round cream creature and sharp purple creature; ask which name belongs to which. |
| 7.0-18.1 | Show the classic experiment/classroom choice; most people map Bouba to round and Kiki to spiky. |
| 18.1-26.5 | Compare round/soft versus sharp/spiky features; explain that sound and felt form are linked. |
| 26.5-38.0 | Title `Sound Symbolism / 语音象征`; introduce sound families and historical speaker group; reveal `cr- sp- sn- sl- gl-`. |
| 38.0-53.3 | `cr- = 破碎感`; cracked-glass illustration and explicit word list with orange `cr`. |
| 53.3-64.36 | `sp- = 飞溅；喷涌`; splash illustration and explicit word list. |
| 64.36-75.85 | `sn- = 鼻子；鼻腔发出的声音`; nose/sneeze figure and explicit word list. |
| 75.85-86.68 | `sl- = 滑动`; skating/sliding figure and explicit word list. |
| 86.68-96.98 | `gl- = 光亮`; diamond/glow visual and explicit word list. |
| 96.98-101.9 | Ancient-to-modern speaker callback, then `Sound Symbolism / 语音象征` outro and goodbye. |
| 101.9-102.3 | Partial final darkening to RGB about 68 on an empty background. |

## Word lists visible in the reference

- `cr-`: crack, crash, crush, crumble, crumple, crackle.
- `sp-`: spurt, spew, spread, spray, sprinkle, sprout.
- `sn-`: sniff, sneeze, snore, snort, snout, snuffle.
- `sl-`: slide, slip, slime, slither, sled.
- `gl-`: glow, gleam, glitter, glimmer, glisten, glare.

Store each row, phonetic, part of speech, and Chinese meaning explicitly after confirming the
sample frame; do not generate the lists from a dictionary at render time.

## Assets and motion

Required cutouts include the round Bouba character, sharp Kiki character, thinking figure,
experiment classroom, speaking/feeling pair, historical speakers, cracked glass, water splash,
nose/sneeze figure, sliding skater, diamond/light, and modern speaker group. Generate character
art only when existing assets cannot match. Draw the experiment shape cards, circular sound-
symbolism arrows, prefix labels, list pointers, and emphasis marks in code. Reveal word lists one
row at a time; keep the root cluster orange and definitions blue.
