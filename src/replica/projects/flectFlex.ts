import audioManifestJson from '../flectFlexAudioManifest.json';
import {FLECT_FLEX_NEGATIVE_PROMPT,flectFlexIllustrationPrompts} from '../flectFlexIllustrationPrompts';
import {flectFlexStoryboard} from '../flectFlexStoryboard';
import {SERIES_BACKGROUND_MUSIC} from '../seriesAudio';
import {FLECT_FLEX_CONTINUOUS_STAGE} from '../continuousStageData';
import type {ReplicaAudioManifest} from '../ReplicaVideo';
import type {ReplicaProjectDefinition} from '../projectTypes';

export const flectFlexProject:ReplicaProjectDefinition={
  slug:'flect-flex',compositionId:'FlectFlexReplica',title:'flect / flex = bend / 弯曲词根讲解',
  storyboard:flectFlexStoryboard,audioManifest:audioManifestJson as ReplicaAudioManifest,
  backgroundMusic:SERIES_BACKGROUND_MUSIC,visualRenderer:'continuous',continuousStage:FLECT_FLEX_CONTINUOUS_STAGE,
  paths:{audioManifestFile:'src/replica/flectFlexAudioManifest.json',publicAudioDir:'public/assets/audio/replica/flect-flex',
    greenSourceDir:'assets/green-screen/flect-flex',alphaAssetDir:'public/assets/replica/flect-flex',
    outputVideo:'outputs/flect-flex/flect-flex.mp4',outputCover:'outputs/flect-flex/cover.png',
    outputLandscapeCover:'outputs/flect-flex/cover-landscape.png',outputDouyinCopy:'outputs/flect-flex/douyin-copy.md'},
  cover:{seriesLabel:'小黑拆词根',root:'FLECT / FLEX',englishMeaning:'BEND',chineseMeaning:'弯曲；使转向',
    hook:'reflect 和 reflex，为什么都在“弯”？',
    words:['reflect','reflection','deflect','inflect','flexible','flexibility','reflex','inflexible'],
    illustrationPath:'assets/replica/flect-flex/00_bend_hook.png',illustrationPosition:'50% 50%',illustrationFit:'contain',illustrationScale:1.08},
  quality:{maxPlaybackRate:1.16,warnPlaybackRate:1.12,audioSilence:{thresholdDb:-45,minimumDurationSec:1.2}},
  tts:{model:'cosyvoice-v3-flash',voice:'longanhuan',rate:1.14,pitch:1,volume:65,useInstruction:false},
  image:{model:'doubao-seedream-4-0-250828',size:'2K',chromaKey:'#00FF00',negativePrompt:FLECT_FLEX_NEGATIVE_PROMPT},
  illustrations:flectFlexIllustrationPrompts,
};
