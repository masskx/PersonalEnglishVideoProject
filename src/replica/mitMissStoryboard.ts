import {narrationToCaptions} from './captionUtils';
import type {ReplicaImageLayer,ReplicaScene,ReplicaStoryboard,ReplicaTableLayer,ReplicaTextLayer} from './types';

export const MIT_MISS_ASSETS={
  hook:'assets/replica/mit-miss/00_send_hook.png',
  submit:'assets/replica/mit-miss/01_submit_send_up.png',
  transmit:'assets/replica/mit-miss/02_transmit_send_across.png',
  emit:'assets/replica/mit-miss/03_emit_send_out.png',
  admit:'assets/replica/mit-miss/04_admit_send_in.png',
  permit:'assets/replica/mit-miss/05_permit_send_through.png',
  commit:'assets/replica/mit-miss/06_commit_send_over.png',
  dismiss:'assets/replica/mit-miss/07_dismiss_send_away.png',
  mission:'assets/replica/mit-miss/08_mission_sent_task.png',
} as const;

const text=(layer:Omit<ReplicaTextLayer,'kind'>):ReplicaTextLayer=>({kind:'text',...layer});
const image=(layer:Omit<ReplicaImageLayer,'kind'>):ReplicaImageLayer=>({kind:'image',...layer});
const table=(layer:Omit<ReplicaTableLayer,'kind'>):ReplicaTableLayer=>({kind:'table',...layer});
const hold=(d:number,f:number,t=0.2)=>Number(Math.max(0.12,d-f-t).toFixed(3));
const WHITE_FADE={type:'white-fade' as const,duration:0.14};

const wordScene=({id,start,narration,prefix='',root='mit',suffix='',formula,meaning,asset,layout='left'}:{id:string;start:number;narration:string;prefix?:string;root?:string;suffix?:string;formula:string;meaning:string;asset:string;layout?:'left'|'right'}):ReplicaScene=>{
  const duration=9.4;
  const textX=90;
  const imageX=layout==='left'?1010:55;
  return {id,start,duration,narration,captions:narrationToCaptions(narration,duration),
    sfx:[{at:0.12,name:'whoosh',volume:0.14},{at:3.7,name:'hit',volume:0.15}],layers:[
      text({id:`${id}-word`,from:0.05,duration:hold(duration,0.05),enter:'rise',enterDuration:0.32,exit:'fade',exitDuration:0.2,x:textX,y:95,width:850,fontSize:prefix.length+suffix.length>7?78:94,fontWeight:820,runs:[{text:prefix,color:'primary'},{text:root,color:'accent'},{text:suffix,color:'primary'}]}),
      text({id:`${id}-formula`,from:0.72,duration:hold(duration,0.72),enter:'wipe-up',enterDuration:0.34,exit:'fade',exitDuration:0.2,x:textX+12,y:290,width:820,fontSize:40,fontWeight:760,runs:[{text:formula,color:'primary'}]}),
      image({id:`${id}-image`,src:asset,from:0.3,duration:hold(duration,0.3),enter:layout==='left'?'slide-left':'slide-right',enterDuration:0.42,exit:'fade',exitDuration:0.2,x:imageX,y:120,width:850,height:620,fit:'contain'}),
      text({id:`${id}-meaning`,from:4.02,duration:hold(duration,4.02),enter:'pop',enterDuration:0.34,exit:'fade',exitDuration:0.2,x:textX-5,y:535,width:850,fontSize:50,fontWeight:820,align:'center',runs:[{text:meaning,color:'accent'}]}),
    ],transitionOut:WHITE_FADE};
};

const hookNarration='一枚发送胶囊进了机器，却不知道会被送到哪里。送上去、送出去、送进来，都藏着同一个动作：mit 和 miss，send，发送。';
const mapNarration='mit 常在动词里，miss 常在名词变化里。前缀决定方向：sub 递交，trans 横跨，e 向外，ad 向里，per 通过，dis 送走。';

const scenes:ReplicaScene[]=[
  {id:'send-hook',start:0,duration:9,narration:hookNarration,captions:narrationToCaptions(hookNarration,9),sfx:[{at:0.18,name:'whoosh',volume:0.14},{at:1.45,name:'pop',volume:0.13},{at:2.7,name:'stamp',volume:0.15}],layers:[
    text({id:'hook-question',from:0.2,duration:8.3,enter:'wipe-up',enterDuration:0.34,x:80,y:135,width:780,fontSize:66,fontWeight:840,align:'center',runs:[{text:'它会被送到哪里？',color:'primary'}]}),
    text({id:'hook-directions',from:1.1,duration:7.55,enter:'slide-right',enterDuration:0.28,x:105,y:345,width:720,fontSize:48,fontWeight:790,align:'center',runs:[{text:'送上去　送出去　送进来',color:'accent'}]}),
    image({id:'hook-image',src:MIT_MISS_ASSETS.hook,from:0.08,duration:8.55,enter:'slide-left',enterDuration:0.42,x:900,y:120,width:900,height:650,fit:'contain'}),
    text({id:'hook-root',from:2.55,duration:6.1,enter:'rise',enterDuration:0.3,x:120,y:545,width:700,fontSize:70,fontWeight:840,align:'center',runs:[{text:'mit / miss → send',color:'primary'}]}),
  ],transitionOut:WHITE_FADE},
  {id:'send-map',start:9,duration:11.2,narration:mapNarration,captions:narrationToCaptions(mapNarration,11.2),sfx:[{at:0.15,name:'scribble',volume:0.13}],layers:[
    text({id:'map-title',from:0.05,duration:10.7,enter:'rise',enterDuration:0.34,x:180,y:60,width:1560,fontSize:62,fontWeight:820,align:'center',runs:[{text:'同一个 SEND，前缀决定发送方向',color:'primary'}]}),
    text({id:'map-core',from:0.55,duration:10.35,enter:'pop',enterDuration:0.34,x:620,y:180,width:680,fontSize:80,fontWeight:850,align:'center',runs:[{text:'MIT / MISS',color:'accent'}]}),
    image({id:'map-image',src:MIT_MISS_ASSETS.hook,from:0.85,duration:10.05,enter:'pop',enterDuration:0.36,x:710,y:300,width:500,height:300,fit:'contain',opacity:0.78}),
    text({id:'map-a',from:1.3,duration:9.55,enter:'slide-left',enterDuration:0.28,x:105,y:365,width:500,fontSize:42,fontWeight:760,align:'center',runs:[{text:'sub / 递交上去',color:'primary'}]}),
    text({id:'map-b',from:1.65,duration:9.2,enter:'slide-right',enterDuration:0.28,x:1315,y:365,width:500,fontSize:42,fontWeight:760,align:'center',runs:[{text:'trans / 横跨传送',color:'primary'}]}),
    text({id:'map-c',from:2.1,duration:8.75,enter:'wipe-up',enterDuration:0.28,x:170,y:555,width:520,fontSize:42,fontWeight:760,align:'center',runs:[{text:'e / 向外发出',color:'primary'}]}),
    text({id:'map-d',from:2.45,duration:8.4,enter:'wipe-up',enterDuration:0.28,x:1230,y:555,width:520,fontSize:42,fontWeight:760,align:'center',runs:[{text:'ad / 送进来',color:'primary'}]}),
    text({id:'map-e',from:2.9,duration:7.95,enter:'pop',enterDuration:0.28,x:685,y:650,width:550,fontSize:42,fontWeight:760,align:'center',runs:[{text:'per / 允许通过',color:'accent'}]}),
  ],transitionOut:WHITE_FADE},
  wordScene({id:'submit-send-up',start:20.2,prefix:'sub',narration:'submit 里的 sub 有在下面的感觉。把文件递到上级手里，正式送交，就是 submit。作业、申请和报告都能 submit。',formula:'sub- 在下面 + mit 发送 = 向上递交',meaning:'提交；呈交；屈服',asset:MIT_MISS_ASSETS.submit}),
  wordScene({id:'transmit-send-across',start:29.6,prefix:'trans',narration:'trans 表示横跨、穿越。把信号、消息或疾病从这一端送到另一端，就是 transmit。它强调内容跨过距离或媒介，被传送过去。',formula:'trans- 横跨 + mit 发送 = 传送过去',meaning:'传输；传播；传送',asset:MIT_MISS_ASSETS.transmit,layout:'right'}),
  wordScene({id:'emit-send-out',start:39,prefix:'e',narration:'emit 里的 e 是 ex 的变体，表示向外。光、热、声音或气体从源头送出来，就是 emit，发出或排放。',formula:'e- / ex- 向外 + mit = 发出来',meaning:'发出；排放；散发',asset:MIT_MISS_ASSETS.emit}),
  wordScene({id:'admit-send-in',start:48.4,prefix:'ad',narration:'ad 表示朝向。把一个人送进门里、允许他进入，就是 admit。后来它也表示承认：让一个事实进入自己的判断，不再把它挡在外面。',formula:'ad- 朝向 + mit 发送 = 允许进入',meaning:'允许进入；承认',asset:MIT_MISS_ASSETS.admit,layout:'right'}),
  wordScene({id:'permit-send-through',start:57.8,prefix:'per',narration:'per 表示穿过、通过。让某件事被送过关卡，不再拦住，就是 permit。它既可以是动词允许，也可以是名词许可证。',formula:'per- 穿过 + mit 发送 = 放行通过',meaning:'允许；许可；许可证',asset:MIT_MISS_ASSETS.permit}),
  wordScene({id:'commit-send-over',start:67.2,prefix:'com',narration:'commit 里的 com 表示一起、完全。把时间、资源或自己正式交给一件事，像送进不能反悔的卡槽，就是 commit，作出承诺。',formula:'com- 一起 / 完全 + mit = 正式交付',meaning:'承诺；投入；犯下',asset:MIT_MISS_ASSETS.commit,layout:'right'}),
  wordScene({id:'dismiss-send-away',start:76.6,prefix:'dis',root:'miss',narration:'到了 dismiss，mit 变成了 miss。dis 表示分开、离开。把人从面前送走，会议结束让大家散开，就是 dismiss，也可以表示不再考虑一个观点。',formula:'dis- 分开 + miss 发送 = 送走',meaning:'解散；遣散；不予考虑',asset:MIT_MISS_ASSETS.dismiss}),
  wordScene({id:'mission-sent-task',start:86,root:'miss',suffix:'ion',narration:'mission 里的 miss 仍然来自 send，加上名词后缀 ion。一个人被派出去完成的任务，就是 mission。先有被发送的动作，后来才有使命和任务。',formula:'miss 发送 + -ion 名词 = 被派出的任务',meaning:'任务；使命；派遣',asset:MIT_MISS_ASSETS.mission,layout:'right'}),
  {id:'example-sentences',start:95.4,duration:9.5,narration:'放进句子里：Please submit the form，请提交表格。The tower transmits signals，信号塔传输信号。They admitted the mistake，他们承认了错误。',captions:narrationToCaptions('放进句子里：Please submit the form，请提交表格。The tower transmits signals，信号塔传输信号。They admitted the mistake，他们承认了错误。',9.5),sfx:[{at:0.16,name:'scribble',volume:0.13}],layers:[
    text({id:'examples-title',from:0.04,duration:9.0,enter:'rise',enterDuration:0.32,x:250,y:58,width:1420,fontSize:62,fontWeight:820,align:'center',runs:[{text:'把“发送方向”放进句子',color:'primary'}]}),
    text({id:'ex1',from:0.8,duration:8.55,enter:'typewriter',enterDuration:0.42,x:150,y:230,width:1620,fontSize:42,fontWeight:720,typewriterCharsPerSec:23,runs:[{text:'Please ',color:'primary'},{text:'submit',color:'accent'},{text:' the form.  请提交表格。',color:'primary'}]}),
    text({id:'ex2',from:3.15,duration:6.25,enter:'typewriter',enterDuration:0.42,x:150,y:400,width:1620,fontSize:42,fontWeight:720,typewriterCharsPerSec:23,runs:[{text:'The tower ',color:'primary'},{text:'transmits',color:'accent'},{text:' signals.  信号塔传输信号。',color:'primary'}]}),
    text({id:'ex3',from:5.55,duration:3.7,enter:'typewriter',enterDuration:0.42,x:150,y:570,width:1620,fontSize:42,fontWeight:720,typewriterCharsPerSec:23,runs:[{text:'They ',color:'primary'},{text:'admitted',color:'accent'},{text:' the mistake.  他们承认了错误。',color:'primary'}]}),
  ],transitionOut:WHITE_FADE},
  {id:'final-summary',start:104.9,duration:17.2,narration:'收口：mit 和 miss 都是 send，发送。submit 是递交上去，transmit 是横跨传送，emit 是向外发出，admit 是允许进入，permit 是放行通过，commit 是正式交付，dismiss 是送走解散，mission 是被派出的任务。',captions:narrationToCaptions('收口：mit 和 miss 都是 send，发送。submit 是递交上去，transmit 是横跨传送，emit 是向外发出，admit 是允许进入，permit 是放行通过，commit 是正式交付，dismiss 是送走解散，mission 是被派出的任务。',17.2),sfx:[{at:0.14,name:'stamp',volume:0.16}],layers:[
    text({id:'summary-title',from:0.05,duration:16.8,enter:'rise',enterDuration:0.36,x:240,y:35,width:1440,fontSize:64,fontWeight:820,align:'center',runs:[{text:'mit / miss = ',color:'primary'},{text:'send / 发送',color:'accent'}]}),
    table({id:'summary-table',from:0.4,duration:16.6,enter:'rise',enterDuration:0.42,x:110,y:130,width:1700,height:700,columns:1,rowFromStep:0.4,compact:true,variant:'open',partInMeaning:true,wordFontSize:34,phoneticFontSize:20,meaningFontSize:29,wordColumnFraction:0.37,rows:[
      {word:'submit',part:'v.',meaning:'sub- 递到上级 → 提交、呈交',accent:'mit'},
      {word:'transmit',part:'v.',meaning:'trans- 横跨 → 传输、传播',accent:'mit'},
      {word:'emit',part:'v.',meaning:'e- 向外 → 发出、排放',accent:'mit'},
      {word:'admit',part:'v.',meaning:'ad- 朝向里面 → 允许进入、承认',accent:'mit'},
      {word:'permit',part:'v./n.',meaning:'per- 通过 → 允许、许可证',accent:'mit'},
      {word:'commit',part:'v.',meaning:'com- 完全交付 → 承诺、投入',accent:'mit'},
      {word:'dismiss',part:'v.',meaning:'dis- 送开 → 解散、遣散',accent:'miss'},
      {word:'mission',part:'n.',meaning:'被派出去 → 任务、使命',accent:'miss'},
    ]}),
  ]},
];

export const mitMissStoryboard:ReplicaStoryboard={id:'mit-miss',duration:122.1,fadeToBlackSec:0.7,fadeEndOpacity:0.72,scenes};
