import {narrationToCaptions} from './captionUtils';
import type {ReplicaImageLayer,ReplicaScene,ReplicaStoryboard,ReplicaTableLayer,ReplicaTextLayer} from './types';

export const RUPT_ASSETS={
  hook:'assets/replica/rupt/00_rupt_hook.png',
  rupture:'assets/replica/rupt/01_rupture_break_open.png',
  interrupt:'assets/replica/rupt/02_interrupt_break_in.png',
  disrupt:'assets/replica/rupt/03_disrupt_break_apart.png',
  erupt:'assets/replica/rupt/04_erupt_break_out.png',
  corrupt:'assets/replica/rupt/05_corrupt_break_down.png',
  bankrupt:'assets/replica/rupt/06_bankrupt_break_the_bank.png',
  abrupt:'assets/replica/rupt/07_abrupt_break_off.png',
  incorruptible:'assets/replica/rupt/08_incorruptible_not_broken.png',
} as const;

const text=(layer:Omit<ReplicaTextLayer,'kind'>):ReplicaTextLayer=>({kind:'text',...layer});
const image=(layer:Omit<ReplicaImageLayer,'kind'>):ReplicaImageLayer=>({kind:'image',...layer});
const table=(layer:Omit<ReplicaTableLayer,'kind'>):ReplicaTableLayer=>({kind:'table',...layer});
const hold=(d:number,f:number,t=0.2)=>Number(Math.max(0.12,d-f-t).toFixed(3));
const WHITE_FADE={type:'white-fade' as const,duration:0.14};

const wordScene=({id,start,narration,prefix='',root='rupt',suffix='',formula,meaning,asset,layout='left'}:{id:string;start:number;narration:string;prefix?:string;root?:string;suffix?:string;formula:string;meaning:string;asset:string;layout?:'left'|'right'}):ReplicaScene=>{
  const duration=9.4;
  // ContinuousStage applies the text-right handoff itself; keep the authored text
  // zone anchored at the left so its layout transform lands inside the safe area.
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

const hookNarration='正在说话，为什么会被突然切断？看清楚：inter 插进中间，整条线断了。rupt 的核心不是一个静态意思，而是 break——破裂，打断。';
const mapNarration='rupt 的方向不同，结果就不同：break open 是裂开，break in 是插入打断，break apart 是打乱，break out 是爆发，break down 是破坏，break off 是突然断开。';

const scenes:ReplicaScene[]=[
  {id:'rupt-hook',start:0,duration:9,narration:hookNarration,captions:narrationToCaptions(hookNarration,9),sfx:[{at:0.18,name:'scribble',volume:0.12},{at:1.8,name:'hit',volume:0.18},{at:2.65,name:'pop',volume:0.12}],layers:[
    text({id:'hook-sentence',from:0.04,duration:8.45,enter:'typewriter',enterDuration:0.55,x:70,y:150,width:760,fontSize:54,fontWeight:760,typewriterCharsPerSec:24,runs:[{text:'I was saying...',color:'primary'}]}),
    text({id:'hook-cut',from:0.9,duration:7.85,enter:'slide-right',enterDuration:0.26,x:100,y:350,width:720,fontSize:82,fontWeight:840,align:'center',runs:[{text:'被谁切断了？',color:'accent'}]}),
    image({id:'hook-image',src:RUPT_ASSETS.hook,from:0.15,duration:8.45,enter:'slide-left',enterDuration:0.42,x:900,y:140,width:900,height:640,fit:'contain'}),
    text({id:'hook-root',from:2.5,duration:6.15,enter:'wipe-up',enterDuration:0.3,x:120,y:545,width:700,fontSize:70,fontWeight:820,align:'center',runs:[{text:'rupt = break',color:'primary'}]}),
  ],transitionOut:WHITE_FADE},
  {id:'rupt-map',start:9,duration:11.2,narration:mapNarration,captions:narrationToCaptions(mapNarration,11.2),sfx:[{at:0.15,name:'scribble',volume:0.13}],layers:[
    text({id:'map-title',from:0.05,duration:10.7,enter:'rise',enterDuration:0.34,x:180,y:60,width:1560,fontSize:62,fontWeight:820,align:'center',runs:[{text:'同一个 rupt，断裂方向不同',color:'primary'}]}),
    text({id:'map-core',from:0.55,duration:10.35,enter:'pop',enterDuration:0.34,x:650,y:180,width:620,fontSize:84,fontWeight:850,align:'center',runs:[{text:'BREAK',color:'accent'}]}),
    text({id:'map-a',from:1.35,duration:9.5,enter:'slide-left',enterDuration:0.28,x:110,y:370,width:470,fontSize:42,fontWeight:760,align:'center',runs:[{text:'open / 裂开',color:'primary'}]}),
    text({id:'map-b',from:1.65,duration:9.2,enter:'slide-right',enterDuration:0.28,x:1350,y:370,width:470,fontSize:42,fontWeight:760,align:'center',runs:[{text:'in / 打断',color:'primary'}]}),
    text({id:'map-c',from:2.2,duration:8.65,enter:'wipe-up',enterDuration:0.28,x:250,y:560,width:500,fontSize:42,fontWeight:760,align:'center',runs:[{text:'apart / 打乱',color:'primary'}]}),
    text({id:'map-d',from:2.55,duration:8.3,enter:'wipe-up',enterDuration:0.28,x:1170,y:560,width:500,fontSize:42,fontWeight:760,align:'center',runs:[{text:'out / 爆发',color:'primary'}]}),
    text({id:'map-e',from:3.0,duration:7.85,enter:'pop',enterDuration:0.28,x:685,y:650,width:550,fontSize:42,fontWeight:760,align:'center',runs:[{text:'down / 破坏',color:'accent'}]}),
  ],transitionOut:WHITE_FADE},
  wordScene({id:'rupture-break-open',start:20.2,narration:'rupture 就是突然裂开。rupt 加上名词后缀 ure，指裂开的动作或结果：管道 rupture 是破裂，关系 rupture 也可以说关系破裂。',formula:'rupt + -ure = 裂开的动作 / 结果',meaning:'破裂；破裂处；关系破裂',asset:RUPT_ASSETS.rupture}),
  wordScene({id:'interrupt-break-in',start:29.6,prefix:'inter',narration:'interrupt 里的 inter 是在中间。一个声音插进正在进行的事情，把它从中间打断，就是 interrupt。interrupt me，就是别打断我。',formula:'inter- 中间 + rupt 打断 = 插进中间',meaning:'打断；插话；中断',asset:RUPT_ASSETS.interrupt,layout:'right'}),
  wordScene({id:'disrupt-break-apart',start:39,prefix:'dis',narration:'dis 表示分开、拆散。把原本有序的计划、系统或队伍打散，事情被搅乱，就是 disrupt。它不是普通变化，而是把原来的秩序拆开。',formula:'dis- 分开 + rupt 破裂 = 打散秩序',meaning:'扰乱；打乱；破坏',asset:RUPT_ASSETS.disrupt}),
  wordScene({id:'erupt-break-out',start:48.4,prefix:'e',narration:'erupt 可以理解成 e、也就是 ex，向外，加上 rupt：从里面破出来。火山 erupt 是喷发，情绪 erupt 也可以是爆发。',formula:'e- / ex- 向外 + rupt = 向外冲破',meaning:'喷发；爆发',asset:RUPT_ASSETS.erupt,layout:'right'}),
  wordScene({id:'corrupt-break-down',start:57.8,prefix:'cor',narration:'corrupt 里的 cor 来自 together，一起；但东西一旦被破坏、被弄坏，原本的状态就坏掉了。人品坏掉，就是腐败。',formula:'cor- 一起 + rupt 破坏 = 状态坏掉',meaning:'腐败的；损坏的；使腐败',asset:RUPT_ASSETS.corrupt}),
  wordScene({id:'bankrupt-break-the-bank',start:67.2,prefix:'bank',narration:'bankrupt 是一个很形象的历史画面：银行的柜台破掉，钱和信用一起塌下去。bankrupt 就是破产的，也可以说使某人破产。',formula:'bank + rupt = 钱袋子破掉',meaning:'破产的；使破产',asset:RUPT_ASSETS.bankrupt,layout:'right'}),
  wordScene({id:'abrupt-break-off',start:76.6,prefix:'ab',narration:'ab 表示离开、脱离。话题还没铺垫就突然断掉，像被掰开离开原轨道，就是 abrupt：突然的、生硬的。',formula:'ab- 离开 + rupt 断开 = 突然中断',meaning:'突然的；唐突的；生硬的',asset:RUPT_ASSETS.abrupt}),
  wordScene({id:'incorruptible-not-broken',start:86,prefix:'in',root:'corrupt',suffix:'ible',narration:'最后看 incorruptible：in 是否定，-ible 是能够。不能被 corrupt，不能被破坏、收买或弄脏，就是 incorruptible：清白不变质的。',formula:'in- 不 + corrupt 破坏 + -ible 能够 = 不能被腐化',meaning:'不腐败的；清白的；不变质的',asset:RUPT_ASSETS.incorruptible,layout:'right'}),
  {id:'example-sentences',start:95.4,duration:9.5,narration:'放进句子里：The pipe ruptured，管道破裂了。Please don\'t interrupt me，请不要打断我。The volcano erupted，火山喷发了。',captions:narrationToCaptions('放进句子里：The pipe ruptured，管道破裂了。Please don\'t interrupt me，请不要打断我。The volcano erupted，火山喷发了。',9.5),sfx:[{at:0.16,name:'scribble',volume:0.13}],layers:[
    text({id:'examples-title',from:0.04,duration:9.0,enter:'rise',enterDuration:0.32,x:250,y:58,width:1420,fontSize:62,fontWeight:820,align:'center',runs:[{text:'把“破裂 / 打断”放进句子',color:'primary'}]}),
    text({id:'ex1',from:0.8,duration:8.55,enter:'typewriter',enterDuration:0.42,x:150,y:230,width:1620,fontSize:42,fontWeight:720,typewriterCharsPerSec:23,runs:[{text:'The pipe ',color:'primary'},{text:'ruptured',color:'accent'},{text:'.  管道破裂了。',color:'primary'}]}),
    text({id:'ex2',from:3.15,duration:6.25,enter:'typewriter',enterDuration:0.42,x:150,y:400,width:1620,fontSize:42,fontWeight:720,typewriterCharsPerSec:23,runs:[{text:"Please don't ",color:'primary'},{text:'interrupt',color:'accent'},{text:' me.  请不要打断我。',color:'primary'}]}),
    text({id:'ex3',from:5.55,duration:3.7,enter:'typewriter',enterDuration:0.42,x:150,y:570,width:1620,fontSize:42,fontWeight:720,typewriterCharsPerSec:23,runs:[{text:'The volcano ',color:'primary'},{text:'erupted',color:'accent'},{text:'.  火山喷发了。',color:'primary'}]}),
  ],transitionOut:WHITE_FADE},
  {id:'final-summary',start:104.9,duration:17.2,narration:'收口：rupt 就是 break，破裂或打断。rupture 是裂开，interrupt 是插进中间打断，disrupt 是打乱，erupt 是向外爆发，corrupt 是破坏到变质，bankrupt 是钱袋子破掉，abrupt 是突然断开，incorruptible 则是不能被腐化。',captions:narrationToCaptions('收口：rupt 就是 break，破裂或打断。rupture 是裂开，interrupt 是插进中间打断，disrupt 是打乱，erupt 是向外爆发，corrupt 是破坏到变质，bankrupt 是钱袋子破掉，abrupt 是突然断开，incorruptible 则是不能被腐化。',17.2),sfx:[{at:0.14,name:'stamp',volume:0.16}],layers:[
    text({id:'summary-title',from:0.05,duration:16.8,enter:'rise',enterDuration:0.36,x:240,y:35,width:1440,fontSize:64,fontWeight:820,align:'center',runs:[{text:'rupt = ',color:'primary'},{text:'break / 破裂，打断',color:'accent'}]}),
    table({id:'summary-table',from:0.4,duration:16.6,enter:'rise',enterDuration:0.42,x:110,y:130,width:1700,height:700,columns:1,rowFromStep:0.4,compact:true,variant:'open',partInMeaning:true,wordFontSize:34,phoneticFontSize:20,meaningFontSize:29,wordColumnFraction:0.37,rows:[
      {word:'rupture',part:'n./v.',meaning:'裂开、破裂；破裂结果',accent:'rupt'},
      {word:'interrupt',part:'v.',meaning:'inter- 插进中间 → 打断',accent:'rupt'},
      {word:'disrupt',part:'v.',meaning:'dis- 拆散 → 扰乱、打乱',accent:'rupt'},
      {word:'erupt',part:'v.',meaning:'向外冲破 → 喷发、爆发',accent:'rupt'},
      {word:'corrupt',part:'adj./v.',meaning:'破坏到变质 → 腐败、损坏',accent:'rupt'},
      {word:'bankrupt',part:'adj./v.',meaning:'钱袋子破掉 → 破产',accent:'rupt'},
      {word:'abrupt',part:'adj.',meaning:'突然断开 → 突然、唐突',accent:'rupt'},
      {word:'incorruptible',part:'adj.',meaning:'不能被腐化 → 清白、不变质',accent:'rupt'},
    ]}),
  ]},
];

export const ruptStoryboard:ReplicaStoryboard={id:'rupt',duration:122.1,fadeToBlackSec:0.7,fadeEndOpacity:0.72,scenes};
