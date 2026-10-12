import audioManifestJson from '../ruptAudioManifest.json';
import {RUPT_NEGATIVE_PROMPT,ruptIllustrationPrompts} from '../ruptIllustrationPrompts';
import {ruptStoryboard} from '../ruptStoryboard';
import {SERIES_BACKGROUND_MUSIC} from '../seriesAudio';
import {RUPT_CONTINUOUS_STAGE} from '../continuousStageData';
import type {ReplicaAudioManifest} from '../ReplicaVideo';
import type {ReplicaProjectDefinition} from '../projectTypes';

export const ruptProject:ReplicaProjectDefinition={
  slug:'rupt',compositionId:'RuptReplica',title:'rupt = break / 破裂，打断',
  storyboard:ruptStoryboard,audioManifest:audioManifestJson as ReplicaAudioManifest,
  backgroundMusic:SERIES_BACKGROUND_MUSIC,visualRenderer:'continuous',continuousStage:RUPT_CONTINUOUS_STAGE,
  paths:{audioManifestFile:'src/replica/ruptAudioManifest.json',publicAudioDir:'public/assets/audio/replica/rupt',
    greenSourceDir:'assets/green-screen/rupt',alphaAssetDir:'public/assets/replica/rupt',
    outputVideo:'outputs/rupt/rupt.mp4',outputCover:'outputs/rupt/cover.png',
    outputLandscapeCover:'outputs/rupt/cover-landscape.png',outputDouyinCopy:'outputs/rupt/douyin-copy.md'},
  cover:{seriesLabel:'小黑拆词根',root:'RUPT',englishMeaning:'BREAK',chineseMeaning:'破裂；打断',
    hook:'一句话被切断，8 个 break 动作',words:['rupture','interrupt','disrupt','erupt','corrupt','bankrupt','abrupt','incorruptible'],
    illustrationPath:'assets/replica/rupt/00_rupt_hook.png',illustrationPosition:'50% 50%',illustrationFit:'contain',illustrationScale:1.05},
  quality:{maxPlaybackRate:1.16,warnPlaybackRate:1.12,audioSilence:{thresholdDb:-45,minimumDurationSec:1.2}},
  tts:{model:'cosyvoice-v3-flash',voice:'longanhuan',rate:1.14,pitch:1,volume:65,useInstruction:false},
  image:{model:'doubao-seedream-4-0-250828',size:'2K',chromaKey:'#00FF00',negativePrompt:RUPT_NEGATIVE_PROMPT},
  illustrations:ruptIllustrationPrompts,
};
