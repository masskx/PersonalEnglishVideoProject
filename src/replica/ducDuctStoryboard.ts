import {narrationToCaptions} from './captionUtils';
import type {ReplicaImageLayer,ReplicaRadialLayer,ReplicaScene,ReplicaStoryboard,ReplicaTableLayer,ReplicaTextLayer} from './types';

type KeyposeSet = readonly [string, string, string];

export const DUC_DUCT_ASSETS={
  hook:'assets/replica/duc-duct/00_lead_hook.png',
  conduct:['assets/replica/duc-duct-handdrawn-keyposes/conduct-before.png','assets/replica/duc-duct-handdrawn-keyposes/conduct-change.png','assets/replica/duc-duct-handdrawn-keyposes/conduct-result.png'] as KeyposeSet,
  induce:['assets/replica/duc-duct-handdrawn-keyposes/induce-before.png','assets/replica/duc-duct-handdrawn-keyposes/induce-change.png','assets/replica/duc-duct-handdrawn-keyposes/induce-result.png'] as KeyposeSet,
  reduce:['assets/replica/duc-duct-handdrawn-keyposes/reduce-before.png','assets/replica/duc-duct-handdrawn-keyposes/reduce-change.png','assets/replica/duc-duct-handdrawn-keyposes/reduce-result.png'] as KeyposeSet,
  produce:['assets/replica/duc-duct-handdrawn-keyposes/produce-before.png','assets/replica/duc-duct-handdrawn-keyposes/produce-change.png','assets/replica/duc-duct-handdrawn-keyposes/produce-result.png'] as KeyposeSet,
  introduce:['assets/replica/duc-duct-handdrawn-keyposes/introduce-before.png','assets/replica/duc-duct-handdrawn-keyposes/introduce-change.png','assets/replica/duc-duct-handdrawn-keyposes/introduce-result.png'] as KeyposeSet,
  deduce:['assets/replica/duc-duct-handdrawn-keyposes/deduce-before.png','assets/replica/duc-duct-handdrawn-keyposes/deduce-change.png','assets/replica/duc-duct-handdrawn-keyposes/deduce-result.png'] as KeyposeSet,
} as const;

const text=(layer:Omit<ReplicaTextLayer,'kind'>):ReplicaTextLayer=>({kind:'text',...layer});
const image=(layer:Omit<ReplicaImageLayer,'kind'>):ReplicaImageLayer=>({kind:'image',...layer});
const radial=(layer:Omit<ReplicaRadialLayer,'kind'>):ReplicaRadialLayer=>({kind:'radial',...layer});
const table=(layer:Omit<ReplicaTableLayer,'kind'>):ReplicaTableLayer=>({kind:'table',...layer});
const hold=(d:number,f:number,t=0.2)=>Number(Math.max(0.12,d-f-t).toFixed(3));
const WHITE_FADE={type:'white-fade' as const,duration:0.16};

const keyposeLayers=(id:string,poses:KeyposeSet,x:number,y:number,width:number,height:number,duration:number):ReplicaImageLayer[]=>{
  const beforeEnd=3.1;
  const changeEnd=5.2;
  return [
    image({id:`${id}-pose-1`,src:poses[0],from:0,duration:beforeEnd,enter:'none',exit:'none',x,y,width,height,fit:'contain'}),
    image({id:`${id}-pose-2`,src:poses[1],from:beforeEnd,duration:changeEnd-beforeEnd,enter:'none',exit:'none',x,y,width,height,fit:'contain'}),
    image({id:`${id}-pose-3`,src:poses[2],from:changeEnd,duration:duration-changeEnd,enter:'none',exit:'none',x,y,width,height,fit:'contain'}),
  ];
};

const wordScene=({id,start,narration,prefix='',root='duce',suffix='',formula,meaning,poses,layout='text-left',duration=9.5}:{id:string;start:number;narration:string;prefix?:string;root?:string;suffix?:string;formula:string;meaning:string;poses:KeyposeSet;layout?:'text-left'|'text-right';duration?:number}):ReplicaScene=>{
  const textX=layout==='text-left'?100:970;
  const artX=layout==='text-left'?930:85;
  return {id,start,duration,narration,captions:narrationToCaptions(narration,duration),
    sfx:[{at:0.12,name:'whoosh',volume:0.14},{at:4.1,name:'pop',volume:0.13}],
    layers:[
      text({id:`${id}-word`,from:0.05,duration:hold(duration,0.05),enter:'smooth-rise',enterDuration:0.46,exit:'smooth-out',exitDuration:0.2,x:textX,y:95,width:820,fontSize:prefix.length+suffix.length>5?86:102,fontWeight:800,runs:[{text:prefix,color:'primary'},{text:root,color:'accent'},{text:suffix,color:'primary'}],runMotion:'assemble'}),
      text({id:`${id}-formula`,from:0.72,duration:hold(duration,0.72),enter:'smooth-slide',enterDuration:0.34,exit:'smooth-out',exitDuration:0.2,x:textX+10,y:285,width:790,fontSize:40,fontWeight:760,runs:[{text:formula,color:'primary'}]}),
      ...keyposeLayers(`${id}`,poses,artX,90,820,660,duration),
      text({id:`${id}-meaning`,from:4.15,duration:hold(duration,4.15),enter:'smooth-reveal',enterDuration:0.36,exit:'smooth-out',exitDuration:0.2,x:textX-15,y:515,width:820,fontSize:52,fontWeight:800,align:'center',runs:[{text:meaning,color:'accent'}]}),
    ],transitionOut:WHITE_FADE};
};

const scenes:ReplicaScene[]=[
  {id:'lead-hook',start:0,duration:10,narration:'今天不背一串散词。看到 duc 或 duct，先想一个小黑在带路：核心就是 lead，带领、引导。问题是，它到底把什么带到哪里？答案藏在前缀里。',
   captions:narrationToCaptions('今天不背一串散词。看到 duc 或 duct，先想一个小黑在带路：核心就是 lead，带领、引导。问题是，它到底把什么带到哪里？答案藏在前缀里。',10),
   sfx:[{at:0.14,name:'pop',volume:0.17},{at:2.6,name:'whoosh',volume:0.16}],layers:[
    text({id:'hook-root',from:0.05,duration:9.55,enter:'pop',enterDuration:0.44,x:65,y:145,width:760,fontSize:106,fontWeight:800,align:'center',runs:[{text:'DUC / DUCT',color:'accent'}]}),
    text({id:'hook-meaning',from:0.65,duration:8.95,enter:'smooth-slide',enterDuration:0.34,x:125,y:355,width:640,fontSize:72,fontWeight:800,align:'center',runs:[{text:'= LEAD',color:'primary'}]}),
    text({id:'hook-cn',from:1.1,duration:8.5,enter:'smooth-reveal',enterDuration:0.34,x:125,y:500,width:640,fontSize:58,fontWeight:780,align:'center',runs:[{text:'带领 · 引导',color:'primary'}]}),
    image({id:'hook-image',src:DUC_DUCT_ASSETS.hook,from:0.25,duration:9.25,enter:'smooth-slide',enterDuration:0.5,x:770,y:70,width:1000,height:740,fit:'contain'}),
  ],transitionOut:WHITE_FADE},
  {id:'direction-map',start:10,duration:12,narration:'先看前缀这张方向牌：con- 是一起，in- 是进入，re- 是回去，pro- 是向前，intro- 是向里，de- 是向下或从事实得到。前缀决定带领的方向，再猜整词。',
   captions:narrationToCaptions('先看前缀这张方向牌：con- 是一起，in- 是进入，re- 是回去，pro- 是向前，intro- 是向里，de- 是向下或从事实得到。前缀决定带领的方向，再猜整词。',12),
   sfx:[{at:0.15,name:'scribble',volume:0.15}],layers:[
    text({id:'map-title',from:0.05,duration:11.6,enter:'smooth-rise',enterDuration:0.38,x:190,y:50,width:1540,fontSize:60,fontWeight:800,align:'center',runs:[{text:'先看“带到哪里”，再猜整词',color:'primary'}]}),
    radial({id:'map-radial',from:0.6,duration:11,enter:'pop',enterDuration:0.46,x:115,y:155,width:1690,height:690,center:[{text:'DUC / DUCT',color:'accent',weight:800,size:78},{text:'\nlead · 带领',color:'primary',weight:760,size:43}],items:[
      {text:'con-  一起',angle:205,color:'primary'},{text:'in-  进入',angle:165,color:'primary'},{text:'re-  回去',angle:120,color:'primary'},
      {text:'pro-  向前',angle:40,color:'primary'},{text:'intro-  向里',angle:0,color:'primary'},{text:'de-  向下/从',angle:315,color:'primary'},
    ],radiusX:610,radiusY:255}),
  ],transitionOut:WHITE_FADE},
  wordScene({id:'conduct-together',start:22,prefix:'con',root:'duct',formula:'con- 一起 + duct 带领',meaning:'主持；开展',poses:DUC_DUCT_ASSETS.conduct,layout:'text-left',narration:'conduct 里 con 是一起，duct 是带领。把一群人带在同一个活动里，就是 conduct a meeting 或 conduct an experiment，表示主持、开展。'}),
  wordScene({id:'induce-in',start:31.5,prefix:'in',formula:'in- 进入 + duce 带领',meaning:'促使；导致',poses:DUC_DUCT_ASSETS.induce,layout:'text-right',narration:'induce 是把某个结果带进来，所以常见意思是促使、导致。广告可能 induce people to buy；医生也可能 induce labor。'}),
  wordScene({id:'reduce-back',start:41,prefix:'re',formula:'re- 回 + duce 带领',meaning:'减少；降低',poses:DUC_DUCT_ASSETS.reduce,layout:'text-left',narration:'reduce 的 re 是回。把数量带回到更小的范围，所以就是减少、降低。Reduce screen time，就是把屏幕时间降下来。'}),
  wordScene({id:'produce-forth',start:50.5,prefix:'pro',formula:'pro- 向前 + duce 带领',meaning:'生产；产生',poses:DUC_DUCT_ASSETS.produce,layout:'text-right',narration:'produce 的 pro 是向前，把东西带出来、送到前面，所以是生产、产生。A farm produces food；a machine produces heat。'}),
  wordScene({id:'introduce-inward',start:60,prefix:'intro',formula:'intro- 向里 + duce 带领',meaning:'介绍；引入',poses:DUC_DUCT_ASSETS.introduce,layout:'text-left',duration:10.5,narration:'introduce 比 induce 多了 intro，强调带到里面、带入新场合。把一个人带进认识圈，就是 introduce someone；把观点带进文章，也可以 introduce an idea。'}),
  wordScene({id:'deduce-down',start:70.5,prefix:'de',formula:'de- 向下/从 + duce 带领',meaning:'推断；演绎出',poses:DUC_DUCT_ASSETS.deduce,layout:'text-right',narration:'deduce 的 de 是向下、从某些事实往下带出结论。看到证据，顺着线索推到结论，就是 deduce；它不是凭感觉猜。'}),
  {id:'example-sentences',start:80,duration:20,narration:'把六个方向放回句子里。The teacher conducted an experiment，老师开展了实验。The medicine induced sleep，药物诱发了睡眠。We reduced the cost，我们降低了成本。The factory produces batteries，工厂生产电池。I introduced a new method，我介绍了一种新方法。From these facts, we deduced the cause，根据这些事实，我们推断出了原因。',
   captions:narrationToCaptions('把六个方向放回句子里。The teacher conducted an experiment，老师开展了实验。The medicine induced sleep，药物诱发了睡眠。We reduced the cost，我们降低了成本。The factory produces batteries，工厂生产电池。I introduced a new method，我介绍了一种新方法。From these facts, we deduced the cause，根据这些事实，我们推断出了原因。',20),
   sfx:[{at:0.12,name:'scribble',volume:0.15}],layers:[
    text({id:'examples-title',from:0.05,duration:13.55,enter:'smooth-rise',enterDuration:0.36,x:250,y:45,width:1420,fontSize:62,fontWeight:800,align:'center',runs:[{text:'把“带领方向”放回句子',color:'primary'}]}),
    text({id:'ex1',from:0.8,duration:12.5,enter:'typewriter',enterDuration:0.4,x:120,y:185,width:1680,fontSize:37,fontWeight:700,typewriterCharsPerSec:24,runs:[{text:'The teacher ',color:'primary'},{text:'conducted',color:'accent'},{text:' an experiment.  老师开展了实验。',color:'primary'}]}),
    text({id:'ex2',from:2.8,duration:10.5,enter:'typewriter',enterDuration:0.4,x:120,y:300,width:1680,fontSize:37,fontWeight:700,typewriterCharsPerSec:24,runs:[{text:'The medicine ',color:'primary'},{text:'induced',color:'accent'},{text:' sleep.  药物诱发了睡眠。',color:'primary'}]}),
    text({id:'ex3',from:4.8,duration:8.6,enter:'typewriter',enterDuration:0.4,x:120,y:415,width:1680,fontSize:37,fontWeight:700,typewriterCharsPerSec:24,runs:[{text:'We ',color:'primary'},{text:'reduced',color:'accent'},{text:' the cost.  我们降低了成本。',color:'primary'}]}),
    text({id:'ex4',from:6.8,duration:6.6,enter:'typewriter',enterDuration:0.4,x:120,y:530,width:1680,fontSize:37,fontWeight:700,typewriterCharsPerSec:24,runs:[{text:'The factory ',color:'primary'},{text:'produces',color:'accent'},{text:' batteries.  工厂生产电池。',color:'primary'}]}),
    text({id:'ex5',from:8.8,duration:4.7,enter:'typewriter',enterDuration:0.4,x:120,y:645,width:1680,fontSize:37,fontWeight:700,typewriterCharsPerSec:24,runs:[{text:'I ',color:'primary'},{text:'introduced',color:'accent'},{text:' a new method.  我介绍了新方法。',color:'primary'}]}),
    text({id:'ex6',from:10.8,duration:2.7,enter:'typewriter',enterDuration:0.4,x:120,y:760,width:1680,fontSize:37,fontWeight:700,typewriterCharsPerSec:24,runs:[{text:'We ',color:'primary'},{text:'deduced',color:'accent'},{text:' the cause.  我们推断出了原因。',color:'primary'}]}),
  ],transitionOut:WHITE_FADE},
  {id:'practice',start:100,duration:16,narration:'小练习。The new evidence ____ us to change our plan。这里填 induce 还是 deduce？先停三秒。答案是 induce，因为证据促使我们改变，是把结果带进来。再看：From the data, we ____ that sales had fallen。这里选 deduced，因为是从数据推到结论。',
   captions:narrationToCaptions('小练习。The new evidence ____ us to change our plan。这里填 induce 还是 deduce？先停三秒。答案是 induce，因为证据促使我们改变，是把结果带进来。再看：From the data, we ____ that sales had fallen。这里选 deduced，因为是从数据推到结论。',16),
   sfx:[{at:0.14,name:'pop',volume:0.14},{at:8.6,name:'stamp',volume:0.16}],layers:[
    text({id:'practice-title',from:0.05,duration:14.5,enter:'smooth-rise',enterDuration:0.36,x:260,y:55,width:1400,fontSize:62,fontWeight:800,align:'center',runs:[{text:'小练习：先看“带到哪里”',color:'primary'}]}),
    text({id:'practice-q1',from:0.8,duration:7.1,enter:'smooth-reveal',enterDuration:0.4,x:145,y:205,width:1630,fontSize:47,fontWeight:760,align:'center',runs:[{text:'The new evidence  ',color:'primary'},{text:'____',color:'accent'},{text:'  us to change our plan.',color:'primary'}]}),
    text({id:'practice-hint1',from:2.3,duration:5.7,enter:'smooth-slide',enterDuration:0.34,x:300,y:335,width:1320,fontSize:38,fontWeight:700,align:'center',runs:[{text:'induce 还是  deduce？',color:'primary'}]}),
    text({id:'practice-a1',from:7.8,duration:6.2,enter:'smooth-reveal',enterDuration:0.36,x:155,y:470,width:1610,fontSize:45,fontWeight:800,align:'center',runs:[{text:'答案：',color:'primary'},{text:'induce',color:'accent'},{text:' = 把结果带进来',color:'primary'}]}),
    text({id:'practice-q2',from:9.4,duration:4.5,enter:'smooth-reveal',enterDuration:0.36,x:145,y:610,width:1630,fontSize:42,fontWeight:760,align:'center',runs:[{text:'From the data, we ',color:'primary'},{text:'deduced',color:'accent'},{text:' the cause.',color:'primary'}]}),
  ],transitionOut:WHITE_FADE},
  {id:'final-summary',start:116,duration:18,narration:'最后收口：duc、duct、duce 都可以先想 lead，带领、引导。conduct 是一起带领，induce 是带进结果，reduce 是带回到更小，produce 是向前带出，introduce 是带进新场合，deduce 是从事实带出结论。不要死背整词，先看前缀指向。',
   captions:narrationToCaptions('最后收口：duc、duct、duce 都可以先想 lead，带领、引导。conduct 是一起带领，induce 是带进结果，reduce 是带回到更小，produce 是向前带出，introduce 是带进新场合，deduce 是从事实带出结论。不要死背整词，先看前缀指向。',17.45),
   sfx:[{at:0.12,name:'stamp',volume:0.17}],layers:[
    text({id:'summary-title',from:0.05,duration:17.45,enter:'smooth-rise',enterDuration:0.38,x:220,y:32,width:1480,align:'center',fontSize:61,fontWeight:800,runs:[{text:'duc / duct = ',color:'primary'},{text:'lead / 带领，引导',color:'accent'}]}),
    table({id:'summary-table',from:0.35,duration:17.35,enter:'smooth-rise',enterDuration:0.42,x:105,y:120,width:1710,height:760,columns:1,rowFromStep:0.33,compact:true,variant:'open',partInMeaning:true,wordFontSize:34,phoneticFontSize:20,meaningFontSize:29,wordColumnFraction:0.35,rows:[
      {word:'conduct',phonetic:'/kənˈdʌkt/',part:'v.',meaning:'一起带领 → 主持；开展',accent:'duct'},
      {word:'induce',phonetic:'/ɪnˈduːs/',part:'v.',meaning:'带进结果 → 促使；导致',accent:'duce'},
      {word:'reduce',phonetic:'/rɪˈduːs/',part:'v.',meaning:'带回更小范围 → 减少；降低',accent:'duce'},
      {word:'produce',phonetic:'/prəˈduːs/',part:'v.',meaning:'向前带出 → 生产；产生',accent:'duce'},
      {word:'introduce',phonetic:'/ˌɪntrəˈduːs/',part:'v.',meaning:'带进新场合 → 介绍；引入',accent:'duce'},
      {word:'deduce',phonetic:'/dɪˈduːs/',part:'v.',meaning:'从事实带出结论 → 推断',accent:'duce'},
    ]}),
  ]},
];

export const ducDuctStoryboard:ReplicaStoryboard={id:'duc-duct',duration:134,fadeToBlackSec:0.5,fadeEndOpacity:1,scenes};
