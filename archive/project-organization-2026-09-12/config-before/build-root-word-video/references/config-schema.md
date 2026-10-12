# Replica Project Configuration

Use TypeScript project modules so paths, storyboard data, prompts, and runtime settings remain
type-checked. Keep exact replication data in the project; keep renderer behavior generic.

## Project module

Create `src/replica/projects/<slug>.ts` exporting one `ReplicaProjectDefinition`:

```ts
export const exampleProject: ReplicaProjectDefinition = {
  slug: 'example',
  compositionId: 'ExampleReplica',
  title: 'example explainer replica',
  reference: {
    videoPath: 'sample/example.mp4',
    durationSec: 90,
  },
  storyboard: exampleStoryboard,
  audioManifest: audioManifestJson as ReplicaAudioManifest,
  backgroundMusic: SERIES_BACKGROUND_MUSIC,
  visualRenderer: 'default', // or a typed episode continuous-stage renderer
  paths: {
    audioManifestFile: 'src/replica/exampleAudioManifest.json',
    publicAudioDir: 'public/assets/audio/replica/example',
    greenSourceDir: 'assets/green-screen/example',
    alphaAssetDir: 'public/assets/replica/example',
    outputVideo: 'outputs/example/example.mp4',
    outputCover: 'outputs/example/cover.png',
    outputLandscapeCover: 'outputs/example/cover-landscape.png',
    outputDouyinCopy: 'outputs/example/publish-copy.md',
  },
  cover: {
    seriesLabel: '小黑拆词根',
    eyebrow: '词根就是一个动作', // sound-symbolism projects may override this
    root: 'SPECT',
    englishMeaning: 'LOOK',
    chineseMeaning: '看',
    hook: '一个动作，记住 5 个单词',
    words: ['inspect', 'respect', 'suspect', 'prospect', 'spectator'],
    familyLabel: '这一串，一起记', // sound-symbolism projects may override this
    wordHighlights: undefined, // optional per-chip fragments when there is no shared root
    illustrationPath: 'assets/replica/example/00_hook.png',
    illustrationPosition: '50% 50%',
    illustrationFit: 'cover',
    illustrationScale: 1.12,
  },
  quality: {maxPlaybackRate: 1.16, warnPlaybackRate: 1.12},
  tts: {
    model: 'cosyvoice-v3-flash',
    voice: 'longanhuan',
    rate: 1.14,
    pitch: 1,
    volume: 65,
    useInstruction: false,
  },
  image: {
    model: 'doubao-seedream-4-0-250828',
    size: '2K',
    chromaKey: '#00FF00',
    negativePrompt,
  },
  illustrations,
};
```

Use forward slashes in paths stored in configuration. Keep generated audio under `public/` so
Remotion can resolve it with `staticFile()`.

Every newly produced episode must define `cover`, `paths.outputCover`,
`paths.outputLandscapeCover`, and `paths.outputDouyinCopy`. All three paths must resolve beside
`paths.outputVideo`. The shared `RootWordCover` and `RootWordLandscapeCover` compositions own the
1080x1440 vertical and 1200x900 4:3 landscape layouts; project data only supplies the root, English/Chinese core meaning,
short hook, word list, accepted transparent illustration, and an optional fixed-zone object
position. Do not create per-episode cover components and do not derive the landscape cover by
cropping or stretching the vertical file.
For a sound-symbolism episode, use `familyLabel` and same-length `wordHighlights` to adapt the
copy and colored fragments without changing the component. `illustrationFit`, position, and a
scale in `0.7..1.5` may correct transparent-canvas framing; they do not authorize moving the art
zone itself.

Generate `publish-copy.md` deterministically from the same project metadata and optionally mirror
it to legacy `douyin-copy.md`. The shared Douyin/Xiaohongshu copy artifact is UTF-8 Markdown and
contains three title angles, a recommended title, a paste-ready body, the exact configured root or
sound-symbolism concept, the exact cover word list, a call to action, relevant hashtags, and a
suggested pinned comment. Do not store episode-specific publish copy inside the shared generator.

## Storyboard

Represent time in seconds and use 30 fps only at render boundaries:

```ts
type ReplicaStoryboard = {
  id: string;
  duration: number;
  fadeToBlackSec: number;
  fadeEndOpacity?: number; // 0..1; default 1 for backward compatibility
  scenes: ReplicaScene[];
};

type ReplicaScene = {
  id: string;
  start: number;
  duration: number;
  narration: string;
  layers: ReplicaLayer[];
  captions: ReplicaCaptionCue[];
  sfx?: ReplicaSfxCue[];
  transitionOut?: {
    type: 'none' | 'white-fade' | 'swirl' | 'zoom';
    duration: number;
    strength?: number;
  };
};
```

Require adjacent scene boundaries to match within `0.002s`. Set the last scene end exactly to the
storyboard duration. Reserve the final darkening interval inside the last scene.

## Layers

Use the lowest-level `layers` array as an intentional precision escape hatch. Supported families:

- `text`: explicit colored runs, font size, weight, line height, alignment, white-space behavior,
  optional typewriter speed.
- `image`: transparent PNG path, contain/cover behavior, object position, opacity.
- `arrow`: SVG path and viewBox, stroke, dash, arrowhead, draw animation.
- `icon`: a code-drawn symbol registered in `ReplicaIconName` and `IconSvg`.
- `table`: explicit rows, columns, row reveal step, compact mode.
- `radial`: one center concept, explicit items and angles, radii.

Every layer has `id`, `from`, optional `duration`, entry/exit motion, stable `x/y/width/height`,
optional `zIndex`, and optional rotation. Values below 2 for motion duration are seconds; larger
values are frames. Do not place sample-specific logic in the renderer when a layer can express it.

## Content-level metadata

Keep higher-level teaching metadata beside the storyboard when it prevents accidental drift:

```ts
const content = {
  root: {display: '-reg-', coreMeaning: '直', branches: ['规则', '管理', '统治']},
  mnemonic: {word: 'ruler', senses: ['直尺', '统治者']},
  words: [{id: 'region', includeInSummary: false}],
  summary: {rowOrder: ['regulate', 'regulation', 'regent', 'regime', 'regal', 'royal', 'reign']},
};
```

Use explicit styled runs for every word. Substring auto-highlighting is insufficient for spelling
changes such as `regin -> reign` and `-fer- -> -ference-`.

## Audio and images

- Require one manifest entry named after every scene ID.
- Measure actual audio duration with `ffprobe`; do not hand-enter an estimate.
- Calculate the final-scene narration target after subtracting `fadeToBlackSec`.
- Let `quality.maxPlaybackRate` and `quality.warnPlaybackRate` control validation.
- Require a project-level `backgroundMusic` configuration. The established shared default is:

  ```ts
  {
    src: 'assets/music/root-word-series-bgm.mp3',
    volume: 0.10,
    duckedVolume: 0.045,
    fadeInSec: 1.2,
    fadeOutSec: 2.0,
    duckAttackSec: 0.25,
    duckReleaseSec: 0.55,
    loop: true,
  }
  ```

  Store the file under `public/`, keep the music continuous across scene boundaries, and use the
  absolute composition frame for the volume curve so loop restarts do not repeat the fade.
- Give every illustration a stable ID, PNG filename, purpose, subject, and complete prompt.
- Keep labels, letters, numbers, logos, arrows, and diagrams out of generation prompts.

For a dynamic-Xiaohei episode, keep motion settings and evidence typed or project-local:

```ts
type DynamicXiaoheiAsset = {
  id: string;
  semanticAction: string;
  greenInput: string;
  sourceVideo: string;
  framesDir: string;
  model: 'wan2.2-i2v-flash';
  resolution: '480P' | '720P' | '1080P';
  durationSec: 5;
  fps: 30;
  frameCount: 150;
  loopMode: 'dissolve' | 'single-action-hold';
  mirror?: boolean;
  taskManifest: string;
  matteReport: string;
};
```

Default to 480P, five seconds, prompt extension off, and no watermark. Store
`DASHSCOPE_API_KEY` only in a gitignored project `.env`. A scene renderer must select frames from
`framesDir` by composition frame at native speed; it must not depend on browser alpha-video
seeking or fractional playback.

## Registry and composition

Import the project in `src/replica/projects/registry.ts` and add it to `replicaProjects`. The root
composition list must derive width, height, fps, duration, props, and output identity from the
registered project or the shared 1920x1080/30 defaults. Never add a second bespoke render entry.

For a new unsampled episode or an explicitly requested anti-PPT upgrade, add a typed
`visualRenderer` discriminator to the project definition and pass it through the registered
composition props. The default generic layer renderer remains available for exact replicas and
legacy projects. A continuous renderer must keep narration, SFX, captions, and music on the
existing scene timeline while mounting its visual stage once for the whole composition. Do not
select the renderer by checking `storyboard.id` or composition ID.

Keep repeated semantic chapters in typed frame data, for example:

```ts
type WordScene = {
  word: string;
  prefix: string;
  root: string;
  suffix: string;
  meaning: string;
  direction: 'back' | 'forward' | 'inside' | 'opposite' | 'under';
  layout: 'text-left' | 'text-right';
  startFrame: number;
  durationInFrames: number;
  actionFrame: number;
  image: string;
  imageFit: 'contain' | 'cover';
  imageScale?: number;
  example?: string;
};
```

The action frame should match the narration keyword or meaningful SFX within one or two frames.
Keep seconds in the existing storyboard and frames in continuous-stage motion data; verify that
the two representations resolve to the same absolute boundaries at the composition FPS.

For a generic semantic stage, keep chapter-specific motion in typed project data rather than
hard-coded component branches:

```ts
type ContinuousScenePlan = {
  actionAt: number; // scene-local seconds, aligned to narration
  action:
    | 'focus' | 'compare' | 'form-image' | 'enter-view'
    | 'play' | 'scan' | 'present-proof' | 'clarify'
    | 'approach' | 'revisit' | 'cascade' | 'gather';
  camera?: 'left' | 'right' | 'in' | 'out' | 'none';
  layout?: 'text-left' | 'text-right';
  imageFit?: 'contain' | 'cover';
  imageScale?: number;
  strength?: number;
  wordBuild?: {
    layerId: string;
    prefix: string;
    root: string;
    suffix: string;
    at: number;
  };
};
```

`ContinuousStageDefinition` may additionally set:

```ts
{
  staticCardMode?: boolean;
  staticImageOpacity?: number; // normally 0.88..0.92
}
```

Use these fields when an episode must use static transparent cards. Remove its `dynamicAssets`
mapping, render RGBA PNGs, disable semantic image travel and camera drift, and preserve only
layer/card entrance and exit fades. Do not place a white-backed RGB image above text and attempt
to fix the obstruction by lowering whole-frame opacity.

The renderer may supply reusable motion primitives for these actions, but the project must own
the action selection, climax time, exact morphemes, layout, and art treatment. Apply text/art
safe-zone coordinates in the renderer or typed layout data. Never mirror a chapter by translating
the original full-width transparent image canvas into the text region.
