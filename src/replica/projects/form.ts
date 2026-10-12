import audioManifestJson from '../formAudioManifest.json';
import {FORM_NEGATIVE_PROMPT,formIllustrationPrompts} from '../formIllustrationPrompts';
import {formStoryboard} from '../formStoryboard';
import {SERIES_BACKGROUND_MUSIC} from '../seriesAudio';
import {FORM_CONTINUOUS_STAGE} from '../continuousStageData';
import type {ReplicaAudioManifest} from '../ReplicaVideo';
import type {ReplicaProjectDefinition} from '../projectTypes';

export const formProject:ReplicaProjectDefinition={
  slug:'form',compositionId:'FormReplica',title:'form = shape / 形状，形成 词根讲解',
  storyboard:formStoryboard,audioManifest:audioManifestJson as ReplicaAudioManifest,
  backgroundMusic:SERIES_BACKGROUND_MUSIC,visualRenderer:'continuous',continuousStage:FORM_CONTINUOUS_STAGE,
  paths:{audioManifestFile:'src/replica/formAudioManifest.json',publicAudioDir:'public/assets/audio/replica/form',
    greenSourceDir:'assets/green-screen/form',alphaAssetDir:'public/assets/replica/form',
    outputVideo:'outputs/form/form.mp4',outputCover:'outputs/form/cover.png',
    outputLandscapeCover:'outputs/form/cover-landscape.png',outputDouyinCopy:'outputs/form/douyin-copy.md'},
  cover:{seriesLabel:'小黑拆词根',root:'FORM',englishMeaning:'SHAPE',chineseMeaning:'形状；形成',
    hook:'记住橙色模具，一次拿下 8 个单词',
    words:['formation','inform','reform','transform','conform','deform','uniform','formula'],
    illustrationPath:'assets/replica/form/00_shape_hook.png',illustrationPosition:'50% 50%',illustrationFit:'contain',illustrationScale:1.1},
  quality:{maxPlaybackRate:1.16,warnPlaybackRate:1.12,audioSilence:{thresholdDb:-45,minimumDurationSec:1.2}},
  tts:{model:'cosyvoice-v3-flash',voice:'longanhuan',rate:1.14,pitch:1,volume:65,useInstruction:false},
  image:{model:'doubao-seedream-4-0-250828',size:'2K',chromaKey:'#00FF00',negativePrompt:FORM_NEGATIVE_PROMPT},
  illustrations:formIllustrationPrompts,
};
