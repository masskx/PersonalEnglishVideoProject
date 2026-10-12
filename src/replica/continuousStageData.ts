import type {ContinuousStageDefinition} from './projectTypes';

export const PRESS_CONTINUOUS_STAGE: ContinuousStageDefinition = {
  root: 'press',
  meaning: 'press down',
  sceneMotion: {
    hook: 'press',
    'word-family-preview': 'out',
    'press-core-action': 'press',
    'printing-media-bridge': 'right',
    'press-semantic-radial': 'out',
    pressure: 'press',
    impress: 'in',
    express: 'out',
    depress: 'down',
    suppress: 'down',
    repress: 'left',
    compress: 'in',
    oppress: 'impact',
    'derived-nouns': 'right',
    'root-callback': 'press',
    'final-summary-table': 'still',
  },
};

export const REG_CONTINUOUS_STAGE: ContinuousStageDefinition = {
  root: 'reg',
  meaning: 'straight / rule',
  sceneMotion: {
    'ruler-straight': 'right',
    'rules-one-direction': 'right',
    'ruler-governor-bridge': 'right',
    'reg-root-branches': 'out',
    regulate: 'right',
    'regulate-examples': 'right',
    regulation: 'still',
    regent: 'down',
    regime: 'in',
    region: 'out',
    regal: 'right',
    'regal-royal': 'right',
    'reign-spelling-change': 'right',
    'root-callback': 'left',
    'final-summary': 'still',
  },
};

export const FER_CONTINUOUS_STAGE: ContinuousStageDefinition = {
  root: 'fer',
  meaning: 'carry',
  sceneMotion: {
    'ferry-memory-hook': 'right',
    'carry-to-fer': 'right',
    'prefix-family-preview': 'out',
    'transfer-across-carry': 'right',
    'offer-toward-you': 'left',
    'prefer-before-carry': 'left',
    'refer-bring-back': 'left',
    'defer-back-or-yield': 'down',
    'confer-together-give': 'in',
    'fer-to-ference-nouns': 'right',
    'ferry-recap': 'right',
    'carry-recap': 'right',
    'dual-summary': 'still',
  },
};

export const BOUBA_KIKI_CONTINUOUS_STAGE: ContinuousStageDefinition = {
  root: 'sound symbolism',
  meaning: 'sound has shape',
  sceneMotion: {
    'question-characters': 'in',
    'experiment-classroom': 'right',
    'sound-symbolism-explanation': 'in',
    'family-preview': 'out',
    'cr-family': 'impact',
    'sp-family': 'out',
    'sn-family': 'in',
    'sl-family': 'left',
    'gl-family': 'up',
    'historical-modern-recap': 'right',
    'outro-fade': 'still',
  },
};

export const PORT_CONTINUOUS_STAGE: ContinuousStageDefinition = {
  root: 'port',
  meaning: 'carry / transport',
  sceneMotion: {
    'carry-hook': 'right',
    'route-machine': 'out',
    'import-carry-in': 'in',
    'export-carry-out': 'out',
    'transport-carry-across': 'right',
    'support-carry-under': 'up',
    'report-carry-back': 'left',
    'portable-able-to-carry': 'right',
    'porter-person-who-carries': 'right',
    'deport-carry-away': 'out',
    'example-sentences': 'right',
    'final-summary': 'still',
  },
};

export const SPECT_CONTINUOUS_STAGE: ContinuousStageDefinition = {
  root: 'spect',
  meaning: 'look / see',
  sceneMotion: {
    'look-hook': 'in',
    'viewfinder-map': 'out',
    'inspect-look-inside': 'in',
    'respect-look-back': 'left',
    'suspect-look-under': 'up',
    'expect-look-out': 'out',
    'prospect-look-forward': 'right',
    'spectator-person-watching': 'still',
    'spectacle-thing-seen': 'impact',
    'retrospect-look-backwards': 'left',
    'example-sentences': 'right',
    'final-summary': 'still',
  },
};

export const VIS_VID_CONTINUOUS_STAGE: ContinuousStageDefinition = {
  root: 'vis / vid', meaning: 'see', sceneMotion: {
    'see-hook':'in','two-form-map':'out','vision-image-seen':'right','visible-able-seen':'out',
    'video-i-see':'right','visual-related-seeing':'in','evidence-seen-proof':'in',
    'evident-clearly-seen':'impact','visit-go-see':'right','revise-see-again':'left',
    'example-sentences':'right','final-summary':'still',
  },
  scenePlans: {
    'see-hook': {actionAt: 2.1, action: 'focus', camera: 'in', strength: 1.05},
    'two-form-map': {actionAt: 6.0, action: 'compare', camera: 'out'},
    'vision-image-seen': {actionAt: 3.7, action: 'form-image', camera: 'in', layout: 'text-right', imageFit: 'contain', imageScale: 1.2, wordBuild: {layerId: 'vision-image-seenw', prefix: '', root: 'vis', suffix: 'ion', at: 0.28}},
    'visible-able-seen': {actionAt: 3.7, action: 'enter-view', camera: 'right', layout: 'text-left', imageFit: 'contain', imageScale: 1.18, wordBuild: {layerId: 'visible-able-seenw', prefix: '', root: 'vis', suffix: 'ible', at: 0.28}},
    'video-i-see': {actionAt: 3.5, action: 'play', camera: 'right', layout: 'text-right', imageFit: 'cover', wordBuild: {layerId: 'video-i-seew', prefix: '', root: 'vid', suffix: 'eo', at: 0.28}},
    'visual-related-seeing': {actionAt: 3.6, action: 'scan', camera: 'in', layout: 'text-left', imageFit: 'cover', wordBuild: {layerId: 'visual-related-seeingw', prefix: '', root: 'vis', suffix: 'ual', at: 0.28}},
    'evidence-seen-proof': {actionAt: 4.2, action: 'present-proof', camera: 'left', strength: 1.08, layout: 'text-right', wordBuild: {layerId: 'evidence-seen-proofw', prefix: 'e', root: 'vid', suffix: 'ence', at: 0.28}},
    'evident-clearly-seen': {actionAt: 3.8, action: 'clarify', camera: 'in', layout: 'text-left', wordBuild: {layerId: 'evident-clearly-seenw', prefix: 'e', root: 'vid', suffix: 'ent', at: 0.28}},
    'visit-go-see': {actionAt: 3.4, action: 'approach', camera: 'right', layout: 'text-right', imageFit: 'cover', wordBuild: {layerId: 'visit-go-seew', prefix: '', root: 'vis', suffix: 'it', at: 0.28}},
    'revise-see-again': {actionAt: 4.1, action: 'revisit', camera: 'left', strength: 1.08, layout: 'text-left', imageFit: 'cover', wordBuild: {layerId: 'revise-see-againw', prefix: 're', root: 'vis', suffix: 'e', at: 0.28}},
    'example-sentences': {actionAt: 5.4, action: 'cascade', camera: 'none'},
    'final-summary': {actionAt: 7.0, action: 'gather', camera: 'out'},
  },
};

export const AUD_CONTINUOUS_STAGE: ContinuousStageDefinition = {
  root: 'aud', meaning: 'hear', sceneMotion: {
    'hear-hook': 'in', 'ear-map': 'out', 'audio-sound': 'right', 'audience-listeners': 'in',
    'audit-hear-check': 'in', 'audible-able-heard': 'right', 'audition-try-hearing': 'right',
    'auditorium-hearing-place': 'out', 'inaudible-not-heard': 'impact',
    'audiobook-heard-book': 'left', 'example-sentences': 'right', 'final-summary': 'still',
  },
  scenePlans: {
    'hear-hook': {actionAt: 2.1, action: 'focus', camera: 'in', strength: 1.05},
    'ear-map': {actionAt: 4.5, action: 'compare', camera: 'out'},
    'audio-sound': {actionAt: 3.4, action: 'play', camera: 'right', layout: 'text-left', wordBuild: {layerId: 'audio-sound-word', prefix: '', root: 'aud', suffix: 'io', at: 0.28}},
    'audience-listeners': {actionAt: 3.6, action: 'focus', camera: 'in', layout: 'text-right', wordBuild: {layerId: 'audience-listeners-word', prefix: '', root: 'aud', suffix: 'ience', at: 0.28}},
    'audit-hear-check': {actionAt: 4.0, action: 'present-proof', camera: 'left', layout: 'text-left', wordBuild: {layerId: 'audit-hear-check-word', prefix: '', root: 'aud', suffix: 'it', at: 0.28}},
    'audible-able-heard': {actionAt: 3.5, action: 'enter-view', camera: 'right', layout: 'text-right', wordBuild: {layerId: 'audible-able-heard-word', prefix: '', root: 'aud', suffix: 'ible', at: 0.28}},
    'audition-try-hearing': {actionAt: 3.8, action: 'play', camera: 'in', layout: 'text-left', wordBuild: {layerId: 'audition-try-hearing-word', prefix: '', root: 'aud', suffix: 'ition', at: 0.28}},
    'auditorium-hearing-place': {actionAt: 3.9, action: 'gather', camera: 'out', layout: 'text-right', wordBuild: {layerId: 'auditorium-hearing-place-word', prefix: '', root: 'aud', suffix: 'itorium', at: 0.28}},
    'inaudible-not-heard': {actionAt: 3.6, action: 'clarify', camera: 'in', layout: 'text-left', wordBuild: {layerId: 'inaudible-not-heard-word', prefix: 'in', root: 'aud', suffix: 'ible', at: 0.28}},
    'audiobook-heard-book': {actionAt: 3.5, action: 'play', camera: 'left', layout: 'text-right', wordBuild: {layerId: 'audiobook-heard-book-word', prefix: '', root: 'aud', suffix: 'iobook', at: 0.28}},
    'example-sentences': {actionAt: 5.0, action: 'cascade', camera: 'none'},
    'final-summary': {actionAt: 6.8, action: 'gather', camera: 'out'},
  },
};

export const DICT_CONTINUOUS_STAGE: ContinuousStageDefinition = {
  root: 'dict', meaning: 'say', sceneMotion: {
    'say-hook': 'out', 'speech-map': 'out', 'predict-before-say': 'right',
    'contradict-opposite-say': 'impact', 'verdict-true-say': 'down',
    'dictate-command-say': 'right', 'dictionary-word-book': 'in',
    'diction-word-choice': 'in', 'dictation-hear-write': 'right',
    'indict-formal-charge': 'impact', 'example-sentences': 'right', 'final-summary': 'still',
  },
  scenePlans: {
    'say-hook': {actionAt: 2.2, action: 'form-image', camera: 'in', strength: 1.05},
    'speech-map': {actionAt: 4.8, action: 'compare', camera: 'out'},
    'predict-before-say': {actionAt: 3.7, action: 'approach', camera: 'right', layout: 'text-left', wordBuild: {layerId: 'predict-before-say-word', prefix: 'pre', root: 'dict', suffix: '', at: 0.28}},
    'contradict-opposite-say': {actionAt: 4.0, action: 'clarify', camera: 'in', layout: 'text-right', wordBuild: {layerId: 'contradict-opposite-say-word', prefix: 'contra', root: 'dict', suffix: '', at: 0.28}},
    'verdict-true-say': {actionAt: 3.8, action: 'present-proof', camera: 'in', layout: 'text-left', wordBuild: {layerId: 'verdict-true-say-word', prefix: 'ver', root: 'dict', suffix: '', at: 0.28}},
    'dictate-command-say': {actionAt: 3.7, action: 'play', camera: 'right', layout: 'text-right', wordBuild: {layerId: 'dictate-command-say-word', prefix: '', root: 'dict', suffix: 'ate', at: 0.28}},
    'dictionary-word-book': {actionAt: 3.8, action: 'gather', camera: 'out', layout: 'text-left', wordBuild: {layerId: 'dictionary-word-book-word', prefix: '', root: 'dict', suffix: 'ionary', at: 0.28}},
    'diction-word-choice': {actionAt: 3.6, action: 'focus', camera: 'in', layout: 'text-right', wordBuild: {layerId: 'diction-word-choice-word', prefix: '', root: 'dict', suffix: 'ion', at: 0.28}},
    'dictation-hear-write': {actionAt: 3.8, action: 'form-image', camera: 'right', layout: 'text-left', wordBuild: {layerId: 'dictation-hear-write-word', prefix: '', root: 'dict', suffix: 'ation', at: 0.28}},
    'indict-formal-charge': {actionAt: 4.0, action: 'present-proof', camera: 'in', layout: 'text-right', wordBuild: {layerId: 'indict-formal-charge-word', prefix: 'in', root: 'dict', suffix: '', at: 0.28}},
    'example-sentences': {actionAt: 5.0, action: 'cascade', camera: 'none'},
    'final-summary': {actionAt: 7.0, action: 'gather', camera: 'out'},
  },
  dynamicAssets: {
    'say-hook': 'assets/replica/dict-motion/frames/hook',
    'predict-before-say': 'assets/replica/dict-motion/frames/predict',
    'contradict-opposite-say': 'assets/replica/dict-motion/frames/contradict',
    'verdict-true-say': 'assets/replica/dict-white-motion/frames/verdict-true-say',
    'dictate-command-say': 'assets/replica/dict-motion/frames/dictate',
    'dictionary-word-book': 'assets/replica/dict-motion/frames/dictionary',
    'diction-word-choice': 'assets/replica/dict-motion/frames/diction',
    'dictation-hear-write': 'assets/replica/dict-motion/frames/dictation',
    'indict-formal-charge': 'assets/replica/dict-motion/frames/indict',
  },
};

export const SCRIPT_SCRIB_CONTINUOUS_STAGE: ContinuousStageDefinition = {
  root: 'script / scrib', meaning: 'write', sceneMotion: {
    'write-hook': 'right', 'writing-map': 'out', 'describe-write-out': 'right',
    'prescribe-write-before': 'right', 'subscribe-write-under': 'down',
    'transcribe-write-across': 'right', 'manuscript-handwritten': 'right',
    'inscription-write-into': 'impact', 'postscript-write-after': 'down',
    'scribble-write-messily': 'out', 'example-sentences': 'right', 'final-summary': 'still',
  },
  scenePlans: {
    'write-hook': {actionAt: 2.2, action: 'form-image', camera: 'right', strength: 1.05},
    'writing-map': {actionAt: 4.8, action: 'compare', camera: 'out'},
    'describe-write-out': {actionAt: 3.7, action: 'form-image', camera: 'right', layout: 'text-left', wordBuild: {layerId: 'describe-write-out-word', prefix: 'de', root: 'scrib', suffix: 'e', at: 0.28}},
    'prescribe-write-before': {actionAt: 3.8, action: 'present-proof', camera: 'right', layout: 'text-right', wordBuild: {layerId: 'prescribe-write-before-word', prefix: 'pre', root: 'scrib', suffix: 'e', at: 0.28}},
    'subscribe-write-under': {actionAt: 3.7, action: 'approach', camera: 'in', layout: 'text-left', wordBuild: {layerId: 'subscribe-write-under-word', prefix: 'sub', root: 'scrib', suffix: 'e', at: 0.28}},
    'transcribe-write-across': {actionAt: 3.8, action: 'play', camera: 'right', layout: 'text-right', wordBuild: {layerId: 'transcribe-write-across-word', prefix: 'tran', root: 'scrib', suffix: 'e', at: 0.28}},
    'manuscript-handwritten': {actionAt: 3.7, action: 'form-image', camera: 'right', layout: 'text-left', wordBuild: {layerId: 'manuscript-handwritten-word', prefix: 'manu', root: 'script', suffix: '', at: 0.28}},
    'inscription-write-into': {actionAt: 3.9, action: 'present-proof', camera: 'in', layout: 'text-right', wordBuild: {layerId: 'inscription-write-into-word', prefix: 'in', root: 'script', suffix: 'ion', at: 0.28}},
    'postscript-write-after': {actionAt: 3.7, action: 'approach', camera: 'out', layout: 'text-left', wordBuild: {layerId: 'postscript-write-after-word', prefix: 'post', root: 'script', suffix: '', at: 0.28}},
    'scribble-write-messily': {actionAt: 3.6, action: 'clarify', camera: 'out', layout: 'text-right', wordBuild: {layerId: 'scribble-write-messily-word', prefix: '', root: 'scrib', suffix: 'ble', at: 0.28}},
    'example-sentences': {actionAt: 5.0, action: 'cascade', camera: 'none'},
    'final-summary': {actionAt: 7.0, action: 'gather', camera: 'out'},
  },
  dynamicAssets: {
    'write-hook': 'assets/replica/script-scrib-motion/frames/hook',
    'describe-write-out': 'assets/replica/script-scrib-white-motion/frames/describe-write-out',
    'prescribe-write-before': 'assets/replica/script-scrib-white-motion/frames/prescribe-write-before',
    'subscribe-write-under': 'assets/replica/script-scrib-white-motion/frames/subscribe-write-under',
    'transcribe-write-across': 'assets/replica/script-scrib-white-motion/frames/transcribe-write-across',
    'manuscript-handwritten': 'assets/replica/script-scrib-motion/frames/manuscript',
    'inscription-write-into': 'assets/replica/script-scrib-motion/frames/inscription',
    'postscript-write-after': 'assets/replica/script-scrib-motion/frames/postscript',
    'scribble-write-messily': 'assets/replica/script-scrib-motion/frames/scribble',
  },
};

export const TRACT_CONTINUOUS_STAGE:ContinuousStageDefinition={
  root:'tract',meaning:'pull',sceneMotion:{
    'pull-hook':'left','pull-map':'out','attract-pull-toward':'in','distract-pull-apart':'out',
    'extract-pull-out':'out','contract-pull-together':'in','subtract-pull-away':'down',
    'retract-pull-back':'left','tractor-pulling-machine':'right','traction-pulling-force':'impact',
    'example-sentences':'right','final-summary':'still',
  },
  scenePlans:{
    'pull-hook':{actionAt:2.2,action:'approach',camera:'in',strength:1.05},
    'pull-map':{actionAt:4.8,action:'compare',camera:'out'},
    'attract-pull-toward':{actionAt:3.7,action:'approach',camera:'in',layout:'text-left',wordBuild:{layerId:'attract-pull-toward-word',prefix:'at',root:'tract',suffix:'',at:0.28}},
    'distract-pull-apart':{actionAt:3.8,action:'clarify',camera:'out',layout:'text-right',wordBuild:{layerId:'distract-pull-apart-word',prefix:'dis',root:'tract',suffix:'',at:0.28}},
    'extract-pull-out':{actionAt:3.8,action:'present-proof',camera:'right',layout:'text-left',wordBuild:{layerId:'extract-pull-out-word',prefix:'ex',root:'tract',suffix:'',at:0.28}},
    'contract-pull-together':{actionAt:3.8,action:'gather',camera:'in',layout:'text-right',wordBuild:{layerId:'contract-pull-together-word',prefix:'con',root:'tract',suffix:'',at:0.28}},
    'subtract-pull-away':{actionAt:3.7,action:'clarify',camera:'out',layout:'text-left',wordBuild:{layerId:'subtract-pull-away-word',prefix:'sub',root:'tract',suffix:'',at:0.28}},
    'retract-pull-back':{actionAt:3.7,action:'revisit',camera:'left',layout:'text-right',wordBuild:{layerId:'retract-pull-back-word',prefix:'re',root:'tract',suffix:'',at:0.28}},
    'tractor-pulling-machine':{actionAt:3.7,action:'play',camera:'right',layout:'text-left',wordBuild:{layerId:'tractor-pulling-machine-word',prefix:'',root:'tract',suffix:'or',at:0.28}},
    'traction-pulling-force':{actionAt:3.8,action:'focus',camera:'in',layout:'text-right',wordBuild:{layerId:'traction-pulling-force-word',prefix:'',root:'tract',suffix:'ion',at:0.28}},
    'example-sentences':{actionAt:5,action:'cascade',camera:'none'},'final-summary':{actionAt:7,action:'gather',camera:'out'},
  },
  dynamicAssets:{
    'pull-hook':'assets/replica/tract-white-motion/frames/hook',
    'attract-pull-toward':'assets/replica/tract-white-motion/frames/attract',
    'distract-pull-apart':'assets/replica/tract-white-motion/frames/distract',
    'extract-pull-out':'assets/replica/tract-white-motion/frames/extract',
    'contract-pull-together':'assets/replica/tract-white-motion/frames/contract',
    'subtract-pull-away':'assets/replica/tract-white-motion/frames/subtract',
    'retract-pull-back':'assets/replica/tract-white-motion/frames/retract',
    'tractor-pulling-machine':'assets/replica/tract-white-motion/frames/tractor',
    'traction-pulling-force':'assets/replica/tract-white-motion/frames/traction',
  },
};

export const FORM_CONTINUOUS_STAGE:ContinuousStageDefinition={
  root:'form',meaning:'shape',sceneMotion:{
    'shape-hook':'press','shape-map':'out','formation-result':'in','inform-put-in':'in',
    'reform-shape-again':'left','transform-change-shape':'impact','conform-same-shape':'in',
    'deform-ruin-shape':'impact','uniform-one-shape':'in','formula-fixed-method':'press',
    'example-sentences':'right','final-summary':'still',
  },
  scenePlans:{
    'shape-hook':{actionAt:2.2,action:'form-image',camera:'in',strength:1.05},
    'shape-map':{actionAt:4.8,action:'compare',camera:'out'},
    'formation-result':{actionAt:3.7,action:'gather',camera:'in',layout:'text-left',wordBuild:{layerId:'formation-result-word',prefix:'',root:'form',suffix:'ation',at:0.28}},
    'inform-put-in':{actionAt:3.8,action:'enter-view',camera:'right',layout:'text-right',wordBuild:{layerId:'inform-put-in-word',prefix:'in',root:'form',suffix:'',at:0.28}},
    'reform-shape-again':{actionAt:3.8,action:'revisit',camera:'left',layout:'text-left',wordBuild:{layerId:'reform-shape-again-word',prefix:'re',root:'form',suffix:'',at:0.28}},
    'transform-change-shape':{actionAt:3.8,action:'form-image',camera:'in',layout:'text-right',wordBuild:{layerId:'transform-change-shape-word',prefix:'trans',root:'form',suffix:'',at:0.28}},
    'conform-same-shape':{actionAt:3.7,action:'compare',camera:'out',layout:'text-left',wordBuild:{layerId:'conform-same-shape-word',prefix:'con',root:'form',suffix:'',at:0.28}},
    'deform-ruin-shape':{actionAt:3.7,action:'clarify',camera:'in',layout:'text-right',wordBuild:{layerId:'deform-ruin-shape-word',prefix:'de',root:'form',suffix:'',at:0.28}},
    'uniform-one-shape':{actionAt:3.7,action:'gather',camera:'out',layout:'text-left',wordBuild:{layerId:'uniform-one-shape-word',prefix:'uni',root:'form',suffix:'',at:0.28}},
    'formula-fixed-method':{actionAt:3.8,action:'present-proof',camera:'right',layout:'text-right',wordBuild:{layerId:'formula-fixed-method-word',prefix:'',root:'form',suffix:'ula',at:0.28}},
    'example-sentences':{actionAt:5,action:'cascade',camera:'none'},'final-summary':{actionAt:7,action:'gather',camera:'out'},
  },
  dynamicAssets:{
    'shape-hook':'assets/replica/form-white-motion/frames/shape-hook',
    'formation-result':'assets/replica/form-white-motion/frames/formation-result',
    'inform-put-in':'assets/replica/form-white-motion/frames/inform-put-in',
    'reform-shape-again':'assets/replica/form-white-motion/frames/reform-shape-again',
    'transform-change-shape':'assets/replica/form-white-motion/frames/transform-change-shape',
    'conform-same-shape':'assets/replica/form-white-motion/frames/conform-same-shape',
    'deform-ruin-shape':'assets/replica/form-white-motion/frames/deform-ruin-shape',
    'uniform-one-shape':'assets/replica/form-white-motion/frames/uniform-one-shape',
    'formula-fixed-method':'assets/replica/form-white-motion/frames/formula-fixed-method',
  },
};

export const STRUCT_CONTINUOUS_STAGE:ContinuousStageDefinition={
  staticCardMode:true,staticImageOpacity:0.9,
  root:'struct',meaning:'build',sceneMotion:{
    'build-hook':'in','build-map':'out','construct-build-together':'in','construction-building-process':'up',
    'structure-built-result':'still','instruct-build-mind':'in','instruction-guidance':'right',
    'reconstruct-build-again':'left','destruct-take-apart':'impact','obstruct-block-building':'press',
    'example-sentences':'right','final-summary':'still',
  },
  scenePlans:{
    'build-hook':{actionAt:2.2,action:'gather',camera:'in',strength:1.05},
    'build-map':{actionAt:4.8,action:'compare',camera:'out'},
    'construct-build-together':{actionAt:3.7,action:'gather',camera:'in',layout:'text-left',wordBuild:{layerId:'construct-build-together-word',prefix:'con',root:'struct',suffix:'',at:0.28}},
    'construction-building-process':{actionAt:3.7,action:'form-image',camera:'right',layout:'text-right',wordBuild:{layerId:'construction-building-process-word',prefix:'con',root:'struct',suffix:'ion',at:0.28}},
    'structure-built-result':{actionAt:3.7,action:'present-proof',camera:'in',layout:'text-left',wordBuild:{layerId:'structure-built-result-word',prefix:'',root:'struct',suffix:'ure',at:0.28}},
    'instruct-build-mind':{actionAt:3.8,action:'enter-view',camera:'right',layout:'text-right',wordBuild:{layerId:'instruct-build-mind-word',prefix:'in',root:'struct',suffix:'',at:0.28}},
    'instruction-guidance':{actionAt:3.7,action:'cascade',camera:'out',layout:'text-left',wordBuild:{layerId:'instruction-guidance-word',prefix:'in',root:'struct',suffix:'ion',at:0.28}},
    'reconstruct-build-again':{actionAt:3.7,action:'revisit',camera:'left',layout:'text-right',wordBuild:{layerId:'reconstruct-build-again-word',prefix:'recon',root:'struct',suffix:'',at:0.28}},
    'destruct-take-apart':{actionAt:3.7,action:'clarify',camera:'out',layout:'text-left',wordBuild:{layerId:'destruct-take-apart-word',prefix:'de',root:'struct',suffix:'',at:0.28}},
    'obstruct-block-building':{actionAt:3.8,action:'clarify',camera:'in',layout:'text-right',wordBuild:{layerId:'obstruct-block-building-word',prefix:'ob',root:'struct',suffix:'',at:0.28}},
    'example-sentences':{actionAt:5,action:'cascade',camera:'none'},'final-summary':{actionAt:7,action:'gather',camera:'out'},
  },
};

export const FLECT_FLEX_CONTINUOUS_STAGE:ContinuousStageDefinition={
  staticCardMode:true,staticImageOpacity:0.86,semanticPropTrack:'flect-flex',
  root:'flect / flex',meaning:'bend',sceneMotion:{
    'bend-hook':'press','bend-map':'out','reflect-bend-back':'left','reflection-returned-image':'left',
    'deflect-turn-aside':'right','inflect-bend-voice':'up','flexible-easy-bend':'in',
    'flexibility-many-bends':'out','reflex-fast-return':'up','inflexible-wont-bend':'impact',
    'example-sentences':'right','final-summary':'still',
  },
  scenePlans:{
    'bend-hook':{actionAt:1.65,action:'form-image',camera:'in',strength:1.08},
    'bend-map':{actionAt:4.8,action:'compare',camera:'out'},
    'reflect-bend-back':{actionAt:3.7,action:'revisit',camera:'left',layout:'text-left',wordBuild:{layerId:'reflect-bend-back-word',prefix:'re',root:'flect',suffix:'',at:0.28}},
    'reflection-returned-image':{actionAt:3.7,action:'form-image',camera:'in',layout:'text-right',wordBuild:{layerId:'reflection-returned-image-word',prefix:'re',root:'flect',suffix:'ion',at:0.28}},
    'deflect-turn-aside':{actionAt:3.8,action:'clarify',camera:'right',layout:'text-left',wordBuild:{layerId:'deflect-turn-aside-word',prefix:'de',root:'flect',suffix:'',at:0.28}},
    'inflect-bend-voice':{actionAt:3.7,action:'form-image',camera:'in',layout:'text-right',wordBuild:{layerId:'inflect-bend-voice-word',prefix:'in',root:'flect',suffix:'',at:0.28}},
    'flexible-easy-bend':{actionAt:3.7,action:'approach',camera:'in',layout:'text-left',wordBuild:{layerId:'flexible-easy-bend-word',prefix:'',root:'flex',suffix:'ible',at:0.28}},
    'flexibility-many-bends':{actionAt:3.8,action:'cascade',camera:'out',layout:'text-right',wordBuild:{layerId:'flexibility-many-bends-word',prefix:'',root:'flex',suffix:'ibility',at:0.28}},
    'reflex-fast-return':{actionAt:3.6,action:'clarify',camera:'in',layout:'text-left',wordBuild:{layerId:'reflex-fast-return-word',prefix:'re',root:'flex',suffix:'',at:0.28}},
    'inflexible-wont-bend':{actionAt:3.8,action:'clarify',camera:'in',layout:'text-right',wordBuild:{layerId:'inflexible-wont-bend-word',prefix:'in',root:'flex',suffix:'ible',at:0.28}},
    'example-sentences':{actionAt:5,action:'cascade',camera:'none'},'final-summary':{actionAt:7,action:'gather',camera:'out'},
  },
};

export const RUPT_CONTINUOUS_STAGE:ContinuousStageDefinition={
  staticCardMode:true,staticImageOpacity:0.9,semanticPropTrack:'rupt',
  root:'rupt',meaning:'break / 破裂，打断',sceneMotion:{
    'rupt-hook':'impact','rupt-map':'out','rupture-break-open':'impact','interrupt-break-in':'right',
    'disrupt-break-apart':'out','erupt-break-out':'up','corrupt-break-down':'impact',
    'bankrupt-break-the-bank':'down','abrupt-break-off':'left','incorruptible-not-broken':'press',
    'example-sentences':'right','final-summary':'still',
  },
  scenePlans:{
    'rupt-hook':{actionAt:1.8,action:'clarify',camera:'in',strength:1.06},
    'rupt-map':{actionAt:4.2,action:'compare',camera:'out'},
    'rupture-break-open':{actionAt:3.7,action:'clarify',camera:'in',layout:'text-left',wordBuild:{layerId:'rupture-break-open-word',prefix:'',root:'rupt',suffix:'ure',at:0.28}},
    'interrupt-break-in':{actionAt:3.7,action:'enter-view',camera:'right',layout:'text-right',wordBuild:{layerId:'interrupt-break-in-word',prefix:'inter',root:'rupt',suffix:'',at:0.28}},
    'disrupt-break-apart':{actionAt:3.8,action:'clarify',camera:'out',layout:'text-left',wordBuild:{layerId:'disrupt-break-apart-word',prefix:'dis',root:'rupt',suffix:'',at:0.28}},
    'erupt-break-out':{actionAt:3.7,action:'form-image',camera:'in',layout:'text-right',wordBuild:{layerId:'erupt-break-out-word',prefix:'e',root:'rupt',suffix:'',at:0.28}},
    'corrupt-break-down':{actionAt:3.8,action:'present-proof',camera:'in',layout:'text-left',wordBuild:{layerId:'corrupt-break-down-word',prefix:'cor',root:'rupt',suffix:'',at:0.28}},
    'bankrupt-break-the-bank':{actionAt:3.8,action:'clarify',camera:'right',layout:'text-right',wordBuild:{layerId:'bankrupt-break-the-bank-word',prefix:'bank',root:'rupt',suffix:'',at:0.28}},
    'abrupt-break-off':{actionAt:3.7,action:'revisit',camera:'left',layout:'text-left',wordBuild:{layerId:'abrupt-break-off-word',prefix:'ab',root:'rupt',suffix:'',at:0.28}},
    'incorruptible-not-broken':{actionAt:3.8,action:'focus',camera:'in',layout:'text-right',wordBuild:{layerId:'incorruptible-not-broken-word',prefix:'in',root:'corrupt',suffix:'ible',at:0.28}},
    'example-sentences':{actionAt:5.2,action:'cascade',camera:'none'},
    'final-summary':{actionAt:7.2,action:'gather',camera:'out'},
  },
};

export const MIT_MISS_CONTINUOUS_STAGE:ContinuousStageDefinition={
  staticCardMode:true,staticImageOpacity:0.9,semanticPropTrack:'mit-miss',showSemanticPropOverlay:false,
  root:'mit / miss',meaning:'send / 发送',sceneMotion:{
    'send-hook':'in','send-map':'out','submit-send-up':'up','transmit-send-across':'right',
    'emit-send-out':'out','admit-send-in':'in','permit-send-through':'right',
    'commit-send-over':'press','dismiss-send-away':'left','mission-sent-task':'up',
    'example-sentences':'right','final-summary':'still',
  },
  scenePlans:{
    'send-hook':{actionAt:1.45,action:'enter-view',camera:'in',strength:1.05},
    'send-map':{actionAt:4.2,action:'compare',camera:'out'},
    'submit-send-up':{actionAt:3.7,action:'present-proof',camera:'in',layout:'text-left',wordBuild:{layerId:'submit-send-up-word',prefix:'sub',root:'mit',suffix:'',at:0.28}},
    'transmit-send-across':{actionAt:3.7,action:'enter-view',camera:'right',layout:'text-right',wordBuild:{layerId:'transmit-send-across-word',prefix:'trans',root:'mit',suffix:'',at:0.28}},
    'emit-send-out':{actionAt:3.7,action:'form-image',camera:'out',layout:'text-left',wordBuild:{layerId:'emit-send-out-word',prefix:'e',root:'mit',suffix:'',at:0.28}},
    'admit-send-in':{actionAt:3.7,action:'approach',camera:'in',layout:'text-right',wordBuild:{layerId:'admit-send-in-word',prefix:'ad',root:'mit',suffix:'',at:0.28}},
    'permit-send-through':{actionAt:3.8,action:'clarify',camera:'right',layout:'text-left',wordBuild:{layerId:'permit-send-through-word',prefix:'per',root:'mit',suffix:'',at:0.28}},
    'commit-send-over':{actionAt:3.8,action:'present-proof',camera:'in',layout:'text-right',wordBuild:{layerId:'commit-send-over-word',prefix:'com',root:'mit',suffix:'',at:0.28}},
    'dismiss-send-away':{actionAt:3.7,action:'revisit',camera:'left',layout:'text-left',wordBuild:{layerId:'dismiss-send-away-word',prefix:'dis',root:'miss',suffix:'',at:0.28}},
    'mission-sent-task':{actionAt:3.8,action:'gather',camera:'out',layout:'text-right',wordBuild:{layerId:'mission-sent-task-word',prefix:'',root:'miss',suffix:'ion',at:0.28}},
    'example-sentences':{actionAt:5.2,action:'cascade',camera:'none'},
    'final-summary':{actionAt:7.2,action:'gather',camera:'out'},
  },
};

export const TEN_TAIN_CONTINUOUS_STAGE:ContinuousStageDefinition={
  staticCardMode:true,staticImageOpacity:0.9,showSemanticPropOverlay:false,
  root:'ten / tain',meaning:'hold / keep',sceneMotion:{
    'ten-tain-hook':'in','ten-tain-root-map':'out','retain-word':'up','contain-word':'right',
    'maintain-word':'in','obtain-word':'right','detain-word':'press','sustain-word':'up',
    'entertain-word':'right','abstain-word':'left','ten-tain-family-map':'out','practice':'in',
    'practice-answer':'right','ten-tain-summary':'still',
  },
  scenePlans:{
    'ten-tain-hook':{actionAt:1.45,action:'enter-view',camera:'in',strength:1.05},
    'ten-tain-root-map':{actionAt:4.2,action:'compare',camera:'out'},
    'retain-word':{actionAt:3.7,action:'present-proof',camera:'in',layout:'text-left',wordBuild:{layerId:'retain-word-word',prefix:'re',root:'tain',suffix:'',at:0.28}},
    'contain-word':{actionAt:3.7,action:'enter-view',camera:'right',layout:'text-right',wordBuild:{layerId:'contain-word-word',prefix:'con',root:'tain',suffix:'',at:0.28}},
    'maintain-word':{actionAt:3.7,action:'form-image',camera:'in',layout:'text-left',wordBuild:{layerId:'maintain-word-word',prefix:'main',root:'tain',suffix:'',at:0.28}},
    'obtain-word':{actionAt:3.7,action:'approach',camera:'right',layout:'text-right',wordBuild:{layerId:'obtain-word-word',prefix:'ob',root:'tain',suffix:'',at:0.28}},
    'detain-word':{actionAt:3.8,action:'clarify',camera:'in',layout:'text-left',wordBuild:{layerId:'detain-word-word',prefix:'de',root:'tain',suffix:'',at:0.28}},
    'sustain-word':{actionAt:3.7,action:'present-proof',camera:'in',layout:'text-right',wordBuild:{layerId:'sustain-word-word',prefix:'sus',root:'tain',suffix:'',at:0.28}},
    'entertain-word':{actionAt:3.7,action:'play',camera:'right',layout:'text-left',wordBuild:{layerId:'entertain-word-word',prefix:'enter',root:'tain',suffix:'',at:0.28}},
    'abstain-word':{actionAt:3.7,action:'clarify',camera:'out',layout:'text-right',wordBuild:{layerId:'abstain-word-word',prefix:'abs',root:'tain',suffix:'',at:0.28}},
    'ten-tain-family-map':{actionAt:4.2,action:'compare',camera:'out'},
    'practice':{actionAt:5.0,action:'focus',camera:'in'},
    'practice-answer':{actionAt:5.4,action:'present-proof',camera:'right'},
    'ten-tain-summary':{actionAt:7.2,action:'gather',camera:'out'},
  },
};
