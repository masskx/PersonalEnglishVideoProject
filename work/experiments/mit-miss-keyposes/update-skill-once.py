from pathlib import Path
import re

root = Path('.agents/skills/build-root-word-video')
p = root / 'SKILL.md'
s = p.read_text(encoding='utf-8')
s = s.replace('including narration, Remotion motion, two cover formats', 'including narration, semantic static key poses, Remotion timing, two cover formats')
s = s.replace('- Read `references/visual-style.md`', '- Read `references/key-pose-storytelling.md` for the default static-image storytelling mode.\n- Read `references/visual-style.md`', 1)
s = s.replace('Use static Xiaohei illustrations by default, adding only deterministic Remotion transforms\n   such as entrance, translation, rotation, scale, and prop motion.', 'Use semantic static key poses by default: before, meaningful change, and result, with\n   a fixed camera and readable holds. Follow `references/key-pose-storytelling.md`; do not\n   manufacture movement by translating, rotating, or bouncing a whole illustration.')
s = s.replace('Use this branch by default for a new episode that has no authoritative frame-accurate sample.\nFor an existing episode, use it when the user asks to remove PPT/page-turn behavior.', 'This is an optional continuous-motion branch, used when continuous trajectories materially\nexplain the lesson or the user requests this treatment. Static key-pose storytelling is the\ndefault for new episodes and static-image improvements. A request to improve pacing alone\ndoes not require a continuous stage.')
s = s.replace('Require anticipation, travel/contact,\n   semantic climax, damping/settle, explanation reveal, readable hold, and a directional handoff.', 'Choose the phases needed by the actual mechanism: preparation, contact/change, result,\n   explanation and readable hold. Do not add damping or a directional handoff without a cause.')
s = s.replace('deterministic micro-motion, camera drift, word highlight, and', 'word highlight and')
s = re.sub(r'8\. Keep camera movement content-led.*?(?=9\. Assemble)', '8. Default to a fixed camera and stable settled poses. Move the camera only when it reveals\n   relevant spatial information. Do not add float, breathing or drift to avoid stillness.\n', s, flags=re.S)
s = s.replace('impact/recoil timed to the action climax', 'quiet reveal timed to the meaning-bearing action')
s = re.sub(r'14\. Treat semantic props as the default anti-PPT motion layer\..*?(?=15\. Run)', '14. Use code-driven semantic props only when their continuous trajectory clarifies the lesson.\n    Otherwise show distinct static states with clean cuts. There is no mechanism-count quota.\n    Keep Xiaohei as the actor, and reject decorative dots, springs and forced prop handoffs.\n', s, flags=re.S)
s = s.replace('Default to static Xiaohei source illustrations plus code-driven Remotion motion.', 'Default to static Xiaohei key poses with frame-driven cuts and readable holds.')
p.write_text(s, encoding='utf-8')
p = root / 'references/visual-style.md'
s = p.read_text(encoding='utf-8')
s = s.replace('on the semantic climax with its own restrained recoil', 'on the semantic change with a quiet reveal')
s = re.sub(r'- Prefer independently animated semantic props.*?(?=- A shared root)', '- Default to semantic key poses with a fixed camera, clean cuts and readable holds; see\n  `key-pose-storytelling.md`. No float, breathing, bounce or camera drift merely to keep a\n  static image moving. Optional code props must explain a genuine continuous relationship,\n  with correct contact geometry; there is no quota for physical mechanisms.\n', s, flags=re.S)
s = s.replace('Default to accepted static Xiaohei illustrations with deterministic Remotion motion.', 'Default to accepted static Xiaohei key poses with deterministic Remotion timing.')
p.write_text(s, encoding='utf-8')
p = root / 'references/quality-gates.md'
s = p.read_text(encoding='utf-8')
s = s.replace('### Continuous-stage upgrade gate', '### Static key-pose gate\n\nFor the default static-image mode, apply `key-pose-storytelling.md`: verify distinct causal\nstates, identity and object continuity, narration-triggered cuts, stable art/text zones and\nreadable results. Static holds longer than four seconds are allowed when explanation needs\nthem. Inspect each cut at -1/+1 frames. Motion quantity and mechanism counts are not gates.\n\n### Optional continuous-stage upgrade gate')
s = s.replace('For a new unsampled continuous-stage episode or a requested anti-PPT upgrade', 'For an explicitly selected continuous-motion episode')
s = s.replace('Require at least three distinct mechanisms across a multi-word\n  anti-PPT upgrade and inspect every cross-scene prop handoff at boundary `-3/+3`.', 'Inspect every used cross-scene prop handoff at boundary `-3/+3`; do not add mechanisms\n  to meet a numerical quota.')
s = s.replace('explanation, restrained settled motion, and a directional handoff. Reject any unexplained\n  perfectly static hold longer than about four seconds.', 'explanation and a readable result. Add a directional handoff only when meaningful.\n  Judge holds by comprehension and narration, not an arbitrary four-second ceiling.')
p.write_text(s, encoding='utf-8')
p = root / 'references/config-schema.md'
s = p.read_text(encoding='utf-8')
s += '\n## Static key-pose scenes (default for new static-image work)\n\nUse the existing typed `ReplicaImageLayer` with separate `src`, scene-local `from` and\n`duration` for each pose; set `enter` and `exit` to `none`. Keep one stable art box per group,\nwith adjacent frame-quantized half-open intervals. Select the existing default layer renderer\nthrough props for an isolated trial. Preserve the registered original renderer and audio.\nKeep the pose plan and narration triggers beside experiment props; see\n`key-pose-storytelling.md`. This mode does not require a new renderer or continuous prop engine.\n'
p.write_text(s, encoding='utf-8')
p = root / 'agents/openai.yaml'
s = p.read_text(encoding='utf-8').replace('静态小黑词根视频、双封面、混音与发布文案','小黑关键姿态叙事、词根视频、双封面与混音').replace('静态小黑与代码动画','静态小黑关键姿态、清楚切换与阅读停留')
p.write_text(s, encoding='utf-8')
print('Updated skill entrypoint, visual style, QA, schema and UI prompt.')
