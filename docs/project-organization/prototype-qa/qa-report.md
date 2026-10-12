# meme_vocab_short QA

Status: **PASS_WITH_WARNINGS**

- Word: interrupt
- Duration: 18.067s
- Errors: 0
- Warnings: 2

## Scene proportions

- interrupt-hook: 1.767s (9.8%)
- interrupt-meeting: 3.133s (17.3%)
- interrupt-reveal: 4.367s (24.2%)
- interrupt-usage: 3.267s (18.1%)
- interrupt-quiz: 5.533s (30.6%)

## Automatic checks
- WARN: placeholder assets require replacement: interrupt-hook, interrupt-meeting, interrupt-reveal, interrupt-usage, interrupt-quiz
- WARN: render is low-resolution draft: 540x960
- PASS: duration 15-28s
- PASS: Hook starts at frame 0
- PASS: no still visual exceeds 3 seconds
- PASS: single-screen text heuristic
- PASS: word, phonetic and meaning consistency
- PASS: ending interaction question
- PASS: quiz answer gating
- PASS: 1080x1920 vertical canvas
- PASS: example sentence exists
- PASS: background music path
- PASS: narration/composition duration within 2 frames
- PASS: core word reveal is not earlier than TTS start
- PASS: rendered video stream
- PASS: rendered audio stream
- PASS: audio/video duration bound
- PASS: media/composition duration within 2 frames
- PASS: no continuous silence >= 1.5s
- PASS: sampled black-frame scan

## Manual checklist
- [ ] Replace every PLACEHOLDER ASSET with the intended Jimeng image
- [ ] Generate and listen to TTS voiceover against the storyboard
- [ ] Review subtitle size, lower Douyin UI occlusion, and first 2 seconds on a phone
- [ ] Human-check the interrupt/disrupt meaning boundary and naturalness of the example sentence
