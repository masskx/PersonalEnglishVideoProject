import {narrationToCaptions} from './captionUtils';
import type {ReplicaImageLayer,ReplicaRadialLayer,ReplicaScene,ReplicaStoryboard,ReplicaTableLayer,ReplicaTextLayer} from './types';

export const TRACT_ASSETS={
  hook:'assets/replica/tract/00_pull_hook.png',attract:'assets/replica/tract/01_attract_toward.png',
  distract:'assets/replica/tract/02_distract_apart.png',extract:'assets/replica/tract/03_extract_out.png',
  contract:'assets/replica/tract/04_contract_together.png',subtract:'assets/replica/tract/05_subtract_away.png',
  retract:'assets/replica/tract/06_retract_back.png',tractor:'assets/replica/tract/07_tractor_machine.png',
  traction:'assets/replica/tract/08_traction_grip.png',
} as const;
const text=(layer:Omit<ReplicaTextLayer,'kind'>):ReplicaTextLayer=>({kind:'text',...layer});
const image=(layer:Omit<ReplicaImageLayer,'kind'>):ReplicaImageLayer=>({kind:'image',...layer});
const radial=(layer:Omit<ReplicaRadialLayer,'kind'>):ReplicaRadialLayer=>({kind:'radial',...layer});
const table=(layer:Omit<ReplicaTableLayer,'kind'>):ReplicaTableLayer=>({kind:'table',...layer});
const hold=(d:number,f:number,t=0.2)=>Number(Math.max(0.12,d-f-t).toFixed(3));
const WHITE_FADE={type:'white-fade' as const,duration:0.16};

const wordScene=({id,start,narration,prefix='',suffix='',formula,meaning,asset}:{id:string;start:number;narration:string;prefix?:string;suffix?:string;formula:string;meaning:string;asset:string;}):ReplicaScene=>{
  const duration=8.5;
  return {id,start,duration,narration,captions:narrationToCaptions(narration,duration),
    sfx:[{at:0.12,name:'whoosh',volume:0.15},{at:3.7,name:'pop',volume:0.13}],
    layers:[
      text({id:`${id}-word`,from:0.05,duration:hold(duration,0.05),enter:'pop',enterDuration:0.42,exit:'fade',exitDuration:0.2,x:85,y:95,width:900,fontSize:prefix.length+suffix.length>6?88:104,fontWeight:800,runs:[{text:prefix,color:'primary'},{text:'tract',color:'accent'},{text:suffix,color:'primary'}]}),
      text({id:`${id}-formula`,from:0.72,duration:hold(duration,0.72),enter:'wipe-up',enterDuration:0.34,exit:'fade',exitDuration:0.2,x:100,y:285,width:805,fontSize:42,fontWeight:760,runs:[{text:formula,color:'primary'}]}),
      image({id:`${id}-image`,src:asset,from:0.3,duration:hold(duration,0.3),enter:'slide-left',enterDuration:0.46,exit:'fade',exitDuration:0.2,x:880,y:95,width:850,height:660,fit:'contain'}),
      text({id:`${id}-meaning`,from:4,duration:hold(duration,4),enter:'pop',enterDuration:0.36,exit:'fade',exitDuration:0.2,x:115,y:510,width:720,fontSize:56,fontWeight:800,align:'center',runs:[{text:meaning,color:'accent'}]}),
    ],transitionOut:WHITE_FADE};
};

const scenes:ReplicaScene[]=[
  {id:'pull-hook',start:0,duration:8,narration:'今天记词根 tract，核心就是 pull，拉、拖。把它想成小黑手里的牵引绳：绳子往哪拉，词义就往哪走。',
   captions:narrationToCaptions('今天记词根 tract，核心就是 pull，拉、拖。把它想成小黑手里的牵引绳：绳子往哪拉，词义就往哪走。',8),
   sfx:[{at:0.15,name:'pop',volume:0.17},{at:2.2,name:'whoosh',volume:0.17}],layers:[
    text({id:'hook-root',from:0.05,duration:7.6,enter:'pop',enterDuration:0.44,x:110,y:150,width:680,fontSize:160,fontWeight:800,align:'center',runs:[{text:'TRACT',color:'accent'}]}),
    text({id:'hook-pull',from:0.7,duration:6.9,enter:'rise',enterDuration:0.34,x:180,y:360,width:540,fontSize:76,fontWeight:800,align:'center',runs:[{text:'= PULL',color:'primary'}]}),
    text({id:'hook-cn',from:1.2,duration:6.4,enter:'wipe-up',enterDuration:0.34,x:180,y:505,width:540,fontSize:66,fontWeight:780,align:'center',runs:[{text:'拉，拖',color:'primary'}]}),
    image({id:'hook-image',src:TRACT_ASSETS.hook,from:0.3,duration:7.3,enter:'slide-left',enterDuration:0.5,x:800,y:80,width:960,height:720,fit:'contain'}),
  ],transitionOut:WHITE_FADE},
  {id:'pull-map',start:8,duration:10,narration:'接下来只看拉的方向：拉向自己、拉开、向外拉、拉到一起、从下面拉走、再拉回来。前缀就是绳子的方向牌，顺着方向就能猜词义。',
   captions:narrationToCaptions('接下来只看拉的方向：拉向自己、拉开、向外拉、拉到一起、从下面拉走、再拉回来。前缀就是绳子的方向牌，顺着方向就能猜词义。',10),
   sfx:[{at:0.15,name:'scribble',volume:0.15}],layers:[
    text({id:'map-title',from:0.05,duration:9.6,enter:'rise',enterDuration:0.38,x:220,y:55,width:1480,fontSize:62,fontWeight:800,align:'center',runs:[{text:'先找“往哪里拉”，再还原词义',color:'primary'}]}),
    radial({id:'map-radial',from:0.55,duration:9,enter:'pop',enterDuration:0.46,x:130,y:170,width:1660,height:640,center:[{text:'TRACT',color:'accent',weight:800,size:82},{text:'\n拉，拖',color:'primary',weight:760,size:46}],items:[
      {text:'at-  向',angle:205,color:'primary'},{text:'dis-  分开',angle:150,color:'primary'},{text:'ex-  向外',angle:95,color:'primary'},
      {text:'con-  一起',angle:25,color:'primary'},{text:'sub-  从下面',angle:335,color:'primary'},{text:'re-  回来',angle:270,color:'primary'},
    ],radiusX:600,radiusY:245}),
  ],transitionOut:WHITE_FADE},
  wordScene({id:'attract-pull-toward',start:18,prefix:'at',formula:'at- 向 + tract 拉',meaning:'吸引；引起',asset:TRACT_ASSETS.attract,narration:'attract 是把人或注意力拉向自己，所以表示吸引、引起。磁铁把小铁块拉过来，就是最直观的画面。'}),
  wordScene({id:'distract-pull-apart',start:26.5,prefix:'dis',formula:'dis- 分开 + tract 拉',meaning:'使分心；转移注意',asset:TRACT_ASSETS.distract,narration:'distract 的 dis 是分开。注意力被几根绳子拉向别处，人就分心了，所以它表示使分心、转移注意。'}),
  wordScene({id:'extract-pull-out',start:35,prefix:'ex',formula:'ex- 向外 + tract 拉',meaning:'提取；拔出',asset:TRACT_ASSETS.extract,narration:'extract 的 ex 是向外。把核心从里面拉出来，就是提取；把牙或异物拔出来，也可以用 extract。'}),
  wordScene({id:'contract-pull-together',start:43.5,prefix:'con',formula:'con- 一起 + tract 拉',meaning:'收缩；合同',asset:TRACT_ASSETS.contract,narration:'contract 的 con 是一起。两端被拉到一起，物体就收缩；双方被条款拉到一起，contract 也表示合同。'}),
  wordScene({id:'subtract-pull-away',start:52,prefix:'sub',formula:'sub- 从下面 + tract 拉',meaning:'减去；扣除',asset:TRACT_ASSETS.subtract,narration:'subtract 可以想成从一堆东西下面拉走一份，剩下的数量就少了，所以它表示减去、扣除，在算式里很常见。'}),
  wordScene({id:'retract-pull-back',start:60.5,prefix:'re',formula:'re- 回 + tract 拉',meaning:'缩回；撤回',asset:TRACT_ASSETS.retract,narration:'retract 的 re 是回来。把伸出去的东西重新拉回来，就是缩回；把公开说过的话收回来，就是撤回，机械结构里也很常见。'}),
  wordScene({id:'tractor-pulling-machine',start:69,suffix:'or',formula:'tract 拉 + -or 执行者',meaning:'拖拉机；牵引车',asset:TRACT_ASSETS.tractor,narration:'tractor 是专门执行拉拽的机器。它在前面提供动力、拖着重物向前走，所以是拖拉机或牵引车。'}),
  wordScene({id:'traction-pulling-force',start:77.5,suffix:'ion',formula:'tract 拉 + -ion 状态/作用',meaning:'牵引力；附着力',asset:TRACT_ASSETS.traction,narration:'traction 是拉的作用或抓住地面的力量，所以表示牵引力、附着力。鞋底不打滑，就是有足够 traction。'}),
  {id:'example-sentences',start:86,duration:10,narration:'Bright colors attract attention，亮色吸引注意。Noise distracts me，噪声让我分心。They extracted the data，他们提取了数据。The muscle contracts，肌肉收缩。',
   captions:narrationToCaptions('Bright colors attract attention，亮色吸引注意。Noise distracts me，噪声让我分心。They extracted the data，他们提取了数据。The muscle contracts，肌肉收缩。',10),
   sfx:[{at:0.12,name:'scribble',volume:0.15}],layers:[
    text({id:'examples-title',from:0.05,duration:9.6,enter:'rise',enterDuration:0.36,x:260,y:60,width:1400,fontSize:64,fontWeight:800,align:'center',runs:[{text:'把“拉”放回句子',color:'primary'}]}),
    text({id:'ex1',from:0.8,duration:8.9,enter:'typewriter',enterDuration:0.4,x:150,y:210,width:1620,fontSize:42,fontWeight:700,typewriterCharsPerSec:22,runs:[{text:'Bright colors ',color:'primary'},{text:'attract',color:'accent'},{text:' attention.  亮色吸引注意。',color:'primary'}]}),
    text({id:'ex2',from:3,duration:6.7,enter:'typewriter',enterDuration:0.4,x:150,y:345,width:1620,fontSize:42,fontWeight:700,typewriterCharsPerSec:22,runs:[{text:'Noise ',color:'primary'},{text:'distracts',color:'accent'},{text:' me.  噪声让我分心。',color:'primary'}]}),
    text({id:'ex3',from:5.2,duration:4.5,enter:'typewriter',enterDuration:0.4,x:150,y:480,width:1620,fontSize:42,fontWeight:700,typewriterCharsPerSec:22,runs:[{text:'They ',color:'primary'},{text:'extracted',color:'accent'},{text:' the data.  他们提取了数据。',color:'primary'}]}),
    text({id:'ex4',from:7.4,duration:2.3,enter:'typewriter',enterDuration:0.4,x:150,y:615,width:1620,fontSize:42,fontWeight:700,typewriterCharsPerSec:22,runs:[{text:'The muscle ',color:'primary'},{text:'contracts',color:'accent'},{text:'.  肌肉收缩。',color:'primary'}]}),
  ],transitionOut:WHITE_FADE},
  {id:'final-summary',start:96,duration:16,narration:'最后收口：tract 就是拉、拖。attract 吸引，distract 分心，extract 提取，contract 收缩或合同，subtract 减去，retract 缩回，tractor 拖拉机，traction 牵引力。记住橙色牵引绳，这组词就串起来了。',
   captions:narrationToCaptions('最后收口：tract 就是拉、拖。attract 吸引，distract 分心，extract 提取，contract 收缩或合同，subtract 减去，retract 缩回，tractor 拖拉机，traction 牵引力。记住橙色牵引绳，这组词就串起来了。',15.45),
   sfx:[{at:0.12,name:'stamp',volume:0.17}],layers:[
    text({id:'summary-title',from:0.05,duration:14.95,enter:'rise',enterDuration:0.38,x:250,y:38,width:1420,align:'center',fontSize:64,fontWeight:800,runs:[{text:'tract = ',color:'primary'},{text:'pull / 拉，拖',color:'accent'}]}),
    table({id:'summary-table',from:0.35,duration:14.65,enter:'rise',enterDuration:0.42,x:115,y:125,width:1690,height:675,columns:1,rowFromStep:0.42,compact:true,variant:'open',partInMeaning:true,wordFontSize:36,phoneticFontSize:22,meaningFontSize:30,wordColumnFraction:0.38,rows:[
      {word:'attract',phonetic:'/əˈtrækt/',part:'v.',meaning:'向自己拉 → 吸引；引起',accent:'tract'},
      {word:'distract',phonetic:'/dɪˈstrækt/',part:'v.',meaning:'把注意力拉开 → 使分心',accent:'tract'},
      {word:'extract',phonetic:'/ɪkˈstrækt/',part:'v.',meaning:'向外拉出 → 提取；拔出',accent:'tract'},
      {word:'contract',phonetic:'/kənˈtrækt/',part:'v./n.',meaning:'拉到一起 → 收缩；合同',accent:'tract'},
      {word:'subtract',phonetic:'/səbˈtrækt/',part:'v.',meaning:'从下面拉走 → 减去；扣除',accent:'tract'},
      {word:'retract',phonetic:'/rɪˈtrækt/',part:'v.',meaning:'往回拉 → 缩回；撤回',accent:'tract'},
      {word:'tractor',phonetic:'/ˈtræktə/',part:'n.',meaning:'执行拉拽的机器 → 拖拉机',accent:'tract'},
      {word:'traction',phonetic:'/ˈtrækʃn/',part:'n.',meaning:'拉的作用 → 牵引力；附着力',accent:'tract'},
    ]}),
  ]},
];
export const tractStoryboard:ReplicaStoryboard={id:'tract',duration:112,fadeToBlackSec:0.5,fadeEndOpacity:1,scenes};
