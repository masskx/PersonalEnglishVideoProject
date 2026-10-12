import audioManifestJson from '../credAudioManifest.json';
import {CRED_NEGATIVE_PROMPT} from '../credIllustrationPrompts';
import {credStoryboard} from '../credStoryboard';
import {SERIES_BACKGROUND_MUSIC} from '../seriesAudio';
import type {ReplicaAudioManifest} from '../ReplicaVideo';
import type {ReplicaProjectDefinition} from '../projectTypes';

export const credProject:ReplicaProjectDefinition={
  slug:'cred',compositionId:'CredReplica',title:'cred = believe / trust 词根讲解',
  keyposePlan:'planning/cred-keyposes-v2.json',
  storyboard:credStoryboard,audioManifest:audioManifestJson as ReplicaAudioManifest,
  backgroundMusic:SERIES_BACKGROUND_MUSIC,visualRenderer:'default',
  paths:{audioManifestFile:'src/replica/credAudioManifest.json',publicAudioDir:'public/assets/audio/replica/cred',
    greenSourceDir:'assets/green-screen/cred',alphaAssetDir:'public/assets/replica/cred',
    outputVideo:'outputs/cred/cred.mp4',outputCover:'outputs/cred/cover.png',
    outputLandscapeCover:'outputs/cred/cover-landscape.png',outputDouyinCopy:'outputs/cred/douyin-copy.md'},
  cover:{seriesLabel:'小黑拆词根',root:'CRED',englishMeaning:'BELIEVE · TRUST',chineseMeaning:'相信 · 信任',
    hook:'credible 还是 credulous？',words:['credible','credibility','credulous','incredulous','incredible','credit','creditable','discredit'],
    wordHighlights:['cred','cred','cred','cred','cred','cred','credit','credit'],familyLabel:'相信与信任词族',
    illustrationPath:'assets/replica/cred-v2/credible-result.png',illustrationPosition:'50% 50%',illustrationFit:'contain',illustrationScale:1.05},
  publishCopy:{
    titles:['credible 和 credulous，差的可不止一个词尾','一条“5 分钟满分”的帖子，能分清 4 个 CRED 词','CRED 词族里，最容易用错的是这两个'],
    opening:'“5 分钟拿下英语满分。”看到这句话，你会说它 credible，还是说相信它的人 credulous？这期从这个小陷阱讲起，把八个 CRED 词放回具体场景。',
    takeaway:'视频里有证据卡、拒绝动作、奖章和反证。看完暂停在总结页，试着用画面说出每个词的意思。',
    prompt:'你最容易混 credible、credulous、incredible 还是 incredulous？',
    pinnedComment:'留一个 CRED 词和你的例句，我帮你看搭配自然不自然。',
  },
  quality:{maxPlaybackRate:1.16,warnPlaybackRate:1.12,audioSilence:{thresholdDb:-45,minimumDurationSec:1.2}},
  tts:{model:'cosyvoice-v3-flash',voice:'longanhuan',rate:1.08,pitch:1,volume:65,useInstruction:true,
    instruction:'你正在进行科普知识推广，你说话的情感是neutral。'},
  image:{model:'gpt-image-2.5-sunburst',size:'1536x864',chromaKey:'#00FF00',negativePrompt:CRED_NEGATIVE_PROMPT},
  illustrations:[],
};
