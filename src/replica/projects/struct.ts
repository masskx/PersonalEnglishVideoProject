import audioManifestJson from '../structAudioManifest.json';
import {STRUCT_NEGATIVE_PROMPT,structIllustrationPrompts} from '../structIllustrationPrompts';
import {structStoryboard} from '../structStoryboard';
import {SERIES_BACKGROUND_MUSIC} from '../seriesAudio';
import {STRUCT_CONTINUOUS_STAGE} from '../continuousStageData';
import type {ReplicaAudioManifest} from '../ReplicaVideo';
import type {ReplicaProjectDefinition} from '../projectTypes';

export const structProject:ReplicaProjectDefinition={
  slug:'struct',compositionId:'StructReplica',title:'struct = build / 建造 词根讲解',
  storyboard:structStoryboard,audioManifest:audioManifestJson as ReplicaAudioManifest,
  backgroundMusic:SERIES_BACKGROUND_MUSIC,visualRenderer:'continuous',continuousStage:STRUCT_CONTINUOUS_STAGE,
  paths:{audioManifestFile:'src/replica/structAudioManifest.json',publicAudioDir:'public/assets/audio/replica/struct',
    greenSourceDir:'assets/green-screen/struct',alphaAssetDir:'public/assets/replica/struct',
    outputVideo:'outputs/struct/struct.mp4',outputCover:'outputs/struct/cover.png',
    outputLandscapeCover:'outputs/struct/cover-landscape.png',outputDouyinCopy:'outputs/struct/douyin-copy.md'},
  cover:{seriesLabel:'小黑拆词根',root:'STRUCT',englishMeaning:'BUILD',chineseMeaning:'建造；搭建',
    hook:'记住橙色积木，一次拿下 8 个单词',
    words:['construct','construction','structure','instruct','instruction','reconstruct','destruct','obstruct'],
    illustrationPath:'assets/replica/struct/00_build_hook.png',illustrationPosition:'50% 50%',illustrationFit:'contain',illustrationScale:1.08},
  quality:{maxPlaybackRate:1.16,warnPlaybackRate:1.12,audioSilence:{thresholdDb:-45,minimumDurationSec:1.2}},
  tts:{model:'cosyvoice-v3-flash',voice:'longanhuan',rate:1.14,pitch:1,volume:65,useInstruction:false},
  image:{model:'doubao-seedream-4-0-250828',size:'2K',chromaKey:'#00FF00',negativePrompt:STRUCT_NEGATIVE_PROMPT},
  illustrations:structIllustrationPrompts,
};
