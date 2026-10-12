# reg reference analysis

- Reference: `样片/video_这么多带reg的单词怎么记住啊？..._0.mp4`
- Media: 1920x1080, H.264, 103.333333s, nominal 30fps VFR source, AAC 44.1kHz stereo.
- Replica target: 30fps CFR, 3100 frames, pure white canvas.
- Palette: deep blue around `#032A9D`, orange around `#EA5914`; use series values
  `#041FA0` and `#E85810`.
- Ending: darkening begins around 102.667s, reaches black around 103.267s; use
  `fadeToBlackSec: 0.6`, `fadeEndOpacity: 1`.

## Beat map

| Time | Content and visual order |
| --- | --- |
| 0.0-5.9 | `ruler` as a ruler: character, ruler, orange straight line, directional arrow. |
| 5.9-12.1 | Rules sign, queued people, `ONE DIRECTION`; rule/management keeps movement aligned. |
| 12.1-17.7 | Ruler, rules/manager comparison; `ruler` also means ruler/manager; thumbs-up bridge. |
| 17.7-21.3 | Center `-reg-`; reveal original meaning `直`. |
| 21.3-29.7 | Three blue drawn branches to `规则 / 管理 / 统治`. |
| 29.7-38.3 | `regulate = reg + ulate`; traffic officer illustration; meanings reveal serially. |
| 38.3-43.6 | `regulate traffic`, then `regulate body temperature`. |
| 43.6-50.5 | `regulation`; noun meaning, then regulations/rules. |
| 50.5-60.6 | `regent = reg + ent`; court/regent illustration and pointer. |
| 60.6-66.0 | `regime`; circular governance-system illustration. |
| 66.0-70.7 | `region`; bounded map and `REGION` flag. |
| 70.7-78.8 | `regal`; royal court, then Buick Regal car crossfade. |
| 78.8-86.6 | `regal` versus `royal`; common ancestor and French spelling change. |
| 86.6-92.5 | `regin -> reign` text morph/crossfade; rule/in-office-period meaning. |
| 92.5-99.4 | Root callback with ruler, straight line, and the three semantic branches. |
| 99.4-102.733 | Explicit two-column summary and goodbye. |
| 102.733-103.333 | Fade to black. |

## Explicit summary

Left: `regulate`, `regulation`, `regent`, `regime`.

Right: `regal`, `royal`, `reign`.

The body explains `region`, but the reference intentionally omits it from the summary. Preserve
that exception; do not derive summary rows automatically.

## Assets and transitions

Create isolated cutouts for ruler character, rules/queue, thumbs-up, traffic scene, regent court,
governance ring, region map, royal court, and Buick Regal. Draw ruler ticks, straight/branching
arrows, pointers, system arrows, map boundary, flag label, and table rules in code. Use restrained
white fades, rise/pop reveals, arrow drawing, and a text crossfade for `regin -> reign`.
