import audioManifestJson from '../ducDuctAudioManifest.json';
import {DUC_DUCT_NEGATIVE_PROMPT,ducDuctIllustrationPrompts} from '../ducDuctIllustrationPrompts';
import {ducDuctStoryboard} from '../ducDuctStoryboard';
import {SERIES_BACKGROUND_MUSIC} from '../seriesAudio';
import type {ReplicaAudioManifest} from '../ReplicaVideo';
import type {ReplicaProjectDefinition} from '../projectTypes';

export const ducDuctProject:ReplicaProjectDefinition={
  slug:'duc-duct',compositionId:'DucDuctReplica',title:'duc / duct = lead / 带领，引导 词根讲解',
  storyboard:ducDuctStoryboard,audioManifest:audioManifestJson as ReplicaAudioManifest,
  backgroundMusic:SERIES_BACKGROUND_MUSIC,visualRenderer:'default',
  paths:{audioManifestFile:'src/replica/ducDuctAudioManifest.json',publicAudioDir:'public/assets/audio/replica/duc-duct',
    greenSourceDir:'assets/green-screen/duc-duct',alphaAssetDir:'public/assets/replica/duc-duct',
    outputVideo:'outputs/duc-duct/duc-duct.mp4',outputCover:'outputs/duc-duct/cover.png',
    outputLandscapeCover:'outputs/duc-duct/cover-landscape.png',outputDouyinCopy:'outputs/duc-duct/douyin-copy.md'},
  cover:{seriesLabel:'小黑拆词根',root:'DUC / DUCT',englishMeaning:'LEAD',chineseMeaning:'带领，引导',
    hook:'前缀换方向，六个高频词串起来',words:['conduct','induce','reduce','produce','introduce','deduce'],
    familyLabel:'带领方向词族',illustrationPath:'assets/replica/duc-duct/00_lead_hook.png',illustrationPosition:'50% 50%',illustrationFit:'contain',illustrationScale:1.08},
  quality:{maxPlaybackRate:1.16,warnPlaybackRate:1.12,audioSilence:{thresholdDb:-45,minimumDurationSec:1.2}},
  tts:{model:'cosyvoice-v3-flash',voice:'longanhuan',rate:1.08,pitch:1,volume:65,useInstruction:true},
  image:{model:'gpt-image-2',size:'2K',chromaKey:'#00FF00',negativePrompt:DUC_DUCT_NEGATIVE_PROMPT},
  illustrations:ducDuctIllustrationPrompts,
};
