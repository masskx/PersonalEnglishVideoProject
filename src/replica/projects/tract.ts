import audioManifestJson from '../tractAudioManifest.json';
import {TRACT_NEGATIVE_PROMPT,tractIllustrationPrompts} from '../tractIllustrationPrompts';
import {tractStoryboard} from '../tractStoryboard';
import {SERIES_BACKGROUND_MUSIC} from '../seriesAudio';
import {TRACT_CONTINUOUS_STAGE} from '../continuousStageData';
import type {ReplicaAudioManifest} from '../ReplicaVideo';
import type {ReplicaProjectDefinition} from '../projectTypes';

export const tractProject:ReplicaProjectDefinition={
  slug:'tract',compositionId:'TractReplica',title:'tract = pull / 拉，拖 词根讲解',
  storyboard:tractStoryboard,audioManifest:audioManifestJson as ReplicaAudioManifest,
  backgroundMusic:SERIES_BACKGROUND_MUSIC,visualRenderer:'continuous',continuousStage:TRACT_CONTINUOUS_STAGE,
  paths:{audioManifestFile:'src/replica/tractAudioManifest.json',publicAudioDir:'public/assets/audio/replica/tract',
    greenSourceDir:'assets/green-screen/tract',alphaAssetDir:'public/assets/replica/tract',
    outputVideo:'outputs/tract/tract.mp4',outputCover:'outputs/tract/cover.png',
    outputLandscapeCover:'outputs/tract/cover-landscape.png',outputDouyinCopy:'outputs/tract/douyin-copy.md'},
  cover:{seriesLabel:'小黑拆词根',root:'TRACT',englishMeaning:'PULL',chineseMeaning:'拉，拖',
    hook:'顺着牵引绳的方向，记住 8 个单词',
    words:['attract','distract','extract','contract','subtract','retract','tractor','traction'],
    illustrationPath:'assets/replica/tract/00_pull_hook.png',illustrationPosition:'50% 50%',illustrationFit:'contain',illustrationScale:1.1},
  quality:{maxPlaybackRate:1.16,warnPlaybackRate:1.12,audioSilence:{thresholdDb:-45,minimumDurationSec:1.2}},
  tts:{model:'cosyvoice-v3-flash',voice:'longanhuan',rate:1.14,pitch:1,volume:65,useInstruction:false},
  image:{model:'doubao-seedream-4-0-250828',size:'2K',chromaKey:'#00FF00',negativePrompt:TRACT_NEGATIVE_PROMPT},
  illustrations:tractIllustrationPrompts,
};
