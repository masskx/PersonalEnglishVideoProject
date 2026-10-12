import {existsSync, readFileSync} from 'node:fs';
import path from 'node:path';
import {buildMemeVocabConfig} from '../../src/meme-vocab/config';
import {defaultMemeVocabInput} from '../../src/meme-vocab/content';

const required = ['HookScene', 'MemeImageScene', 'WordRevealScene', 'ExampleScene', 'QuizScene', 'KineticCaption', 'KenBurnsImage', 'PunchZoom', 'ShakeEffect', 'ProgressBar', 'SafeArea', 'SubtitleLayer'];
const componentSource = readFileSync(path.resolve(process.cwd(), 'src/meme-vocab/components.tsx'), 'utf8');
const missing = required.filter((name) => !componentSource.includes(`export const ${name}`));
const config = buildMemeVocabConfig(defaultMemeVocabInput());
if (missing.length > 0) throw new Error(`Missing short-video components: ${missing.join(', ')}`);
if (!existsSync(path.resolve(process.cwd(), 'references/jimeng-image-guidelines.md'))) throw new Error('Jimeng guidelines are missing');
if (config.storyboard.scenes.length !== 5) throw new Error('Short storyboard must contain five scenes');
if (componentSource.includes('setTimeout')) throw new Error('Animation code must not use setTimeout');
console.log('lint passed: short-video components, guidelines, scene count, and frame-only animation checks.');

