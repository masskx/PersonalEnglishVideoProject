import audioManifestJson from '../mitMissAudioManifest.json';
import {MIT_MISS_NEGATIVE_PROMPT,mitMissIllustrationPrompts} from '../mitMissIllustrationPrompts';
import {mitMissStoryboard} from '../mitMissStoryboard';
import {SERIES_BACKGROUND_MUSIC} from '../seriesAudio';
import {MIT_MISS_CONTINUOUS_STAGE} from '../continuousStageData';
import type {ReplicaAudioManifest} from '../ReplicaVideo';
import type {ReplicaProjectDefinition} from '../projectTypes';

export const mitMissProject:ReplicaProjectDefinition={
  slug:'mit-miss',compositionId:'MitMissReplica',title:'mit / miss = send / 发送',
  storyboard:mitMissStoryboard,audioManifest:audioManifestJson as ReplicaAudioManifest,
  backgroundMusic:SERIES_BACKGROUND_MUSIC,visualRenderer:'continuous',continuousStage:MIT_MISS_CONTINUOUS_STAGE,
  paths:{audioManifestFile:'src/replica/mitMissAudioManifest.json',publicAudioDir:'public/assets/audio/replica/mit-miss',
    greenSourceDir:'assets/green-screen/mit-miss',alphaAssetDir:'public/assets/replica/mit-miss',
    outputVideo:'outputs/mit-miss/mit-miss.mp4',outputCover:'outputs/mit-miss/cover.png',
    outputLandscapeCover:'outputs/mit-miss/cover-landscape.png',outputDouyinCopy:'outputs/mit-miss/douyin-copy.md'},
  cover:{seriesLabel:'小黑拆词根',root:'MIT / MISS',englishMeaning:'SEND',chineseMeaning:'发送',
    hook:'一枚胶囊，8 种发送方向',words:['submit','transmit','emit','admit','permit','commit','dismiss','mission'],
    wordHighlights:['mit','mit','mit','mit','mit','mit','miss','miss'],
    illustrationPath:'assets/replica/mit-miss/00_send_hook.png',illustrationPosition:'50% 50%',illustrationFit:'contain',illustrationScale:1.04},
  quality:{maxPlaybackRate:1.16,warnPlaybackRate:1.12,audioSilence:{thresholdDb:-45,minimumDurationSec:1.2}},
  tts:{model:'cosyvoice-v3-flash',voice:'longanhuan',rate:1.14,pitch:1,volume:65,useInstruction:false},
  image:{model:'doubao-seedream-4-0-250828',size:'2K',chromaKey:'#00FF00',negativePrompt:MIT_MISS_NEGATIVE_PROMPT},
  illustrations:mitMissIllustrationPrompts,
};
