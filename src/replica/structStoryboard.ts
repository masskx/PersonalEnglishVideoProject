import {narrationToCaptions} from './captionUtils';
import type {ReplicaImageLayer,ReplicaRadialLayer,ReplicaScene,ReplicaStoryboard,ReplicaTableLayer,ReplicaTextLayer} from './types';

export const STRUCT_ASSETS={
  hook:'assets/replica/struct/00_build_hook.png',construct:'assets/replica/struct/01_construct_together.png',
  construction:'assets/replica/struct/02_construction_process.png',structure:'assets/replica/struct/03_structure_result.png',
  instruct:'assets/replica/struct/04_instruct_build_mind.png',instruction:'assets/replica/struct/05_instruction_steps.png',
  reconstruct:'assets/replica/struct/06_reconstruct_again.png',destruct:'assets/replica/struct/07_destruct_take_down.png',
  obstruct:'assets/replica/struct/08_obstruct_block_build.png',
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
    sfx:[{at:0.12,name:'whoosh',volume:0.15},{at:3.7,name:'pop',volume:0.13}],layers:[
      text({id:`${id}-word`,from:0.05,duration:hold(duration,0.05),enter:'pop',enterDuration:0.42,exit:'fade',exitDuration:0.2,x:85,y:95,width:900,fontSize:prefix.length+suffix.length>8?80:96,fontWeight:800,runs:[{text:prefix,color:'primary'},{text:'struct',color:'accent'},{text:suffix,color:'primary'}]}),
      text({id:`${id}-formula`,from:0.72,duration:hold(duration,0.72),enter:'wipe-up',enterDuration:0.34,exit:'fade',exitDuration:0.2,x:100,y:285,width:805,fontSize:42,fontWeight:760,runs:[{text:formula,color:'primary'}]}),
      image({id:`${id}-image`,src:asset,from:0.3,duration:hold(duration,0.3),enter:'slide-left',enterDuration:0.46,exit:'fade',exitDuration:0.2,x:880,y:95,width:850,height:660,fit:'contain'}),
      text({id:`${id}-meaning`,from:4,duration:hold(duration,4),enter:'pop',enterDuration:0.36,exit:'fade',exitDuration:0.2,x:115,y:510,width:720,fontSize:54,fontWeight:800,align:'center',runs:[{text:meaning,color:'accent'}]}),
    ],transitionOut:WHITE_FADE};
};

const scenes:ReplicaScene[]=[
  {id:'build-hook',start:0,duration:8,narration:'词根 struct，核心是 build：建造、搭起来。想象小黑拿着橙色积木，把零件一块块接成稳定结构。',
   captions:narrationToCaptions('词根 struct，核心是 build：建造、搭起来。想象小黑拿着橙色积木，把零件一块块接成稳定结构。',8),sfx:[{at:0.15,name:'pop',volume:0.17}],layers:[
    text({id:'hook-root',from:0.05,duration:7.6,enter:'pop',enterDuration:0.44,x:90,y:130,width:720,fontSize:150,fontWeight:800,align:'center',runs:[{text:'STRUCT',color:'accent'}]}),
    text({id:'hook-build',from:0.7,duration:6.9,enter:'rise',enterDuration:0.34,x:150,y:340,width:600,fontSize:72,fontWeight:800,align:'center',runs:[{text:'= BUILD',color:'primary'}]}),
    text({id:'hook-cn',from:1.2,duration:6.4,enter:'wipe-up',enterDuration:0.34,x:150,y:500,width:600,fontSize:62,fontWeight:780,align:'center',runs:[{text:'建造；搭建',color:'primary'}]}),
    image({id:'hook-image',src:STRUCT_ASSETS.hook,from:0.3,duration:7.3,enter:'slide-left',enterDuration:0.5,x:800,y:80,width:960,height:720,fit:'contain'}),
  ],transitionOut:WHITE_FADE},
  {id:'build-map',start:8,duration:10,narration:'看到 struct，就问结构怎么处理：一起搭、搭成结果、把认识建进头脑、重新建造、拆掉，或者挡住。方向一清楚，词义就顺了。',
   captions:narrationToCaptions('看到 struct，就问结构怎么处理：一起搭、搭成结果、把认识建进头脑、重新建造、拆掉，或者挡住。方向一清楚，词义就顺了。',10),sfx:[{at:0.15,name:'scribble',volume:0.15}],layers:[
    text({id:'map-title',from:0.05,duration:9.6,enter:'rise',enterDuration:0.38,x:220,y:55,width:1480,fontSize:62,fontWeight:800,align:'center',runs:[{text:'先看“怎么搭”，再还原词义',color:'primary'}]}),
    radial({id:'map-radial',from:0.55,duration:9,enter:'pop',enterDuration:0.46,x:130,y:170,width:1660,height:640,center:[{text:'STRUCT',color:'accent',weight:800,size:78},{text:'\n建造；搭建',color:'primary',weight:760,size:46}],items:[
      {text:'con-  一起',angle:205,color:'primary'},{text:'-ion  过程',angle:150,color:'primary'},{text:'-ure  结果',angle:95,color:'primary'},
      {text:'in-  放进',angle:25,color:'primary'},{text:'re-  重新',angle:335,color:'primary'},{text:'de-  拆掉',angle:270,color:'primary'},
    ],radiusX:600,radiusY:245}),
  ],transitionOut:WHITE_FADE},
  wordScene({id:'construct-build-together',start:18,prefix:'con',formula:'con- 一起 + struct 建造',meaning:'建造；构筑',asset:STRUCT_ASSETS.construct,narration:'construct 的 con 是共同、一起。把分散材料接到一起，搭出完整结构，所以它表示建造、构筑，也可以指构成一个观点。'}),
  wordScene({id:'construction-building-process',start:26.5,prefix:'con',suffix:'ion',formula:'construct 建造 + -ion 过程',meaning:'建造；建筑工程',asset:STRUCT_ASSETS.construction,narration:'construction 是建造这个动作的过程或结果。吊起横梁、搭起框架，就是施工和建造；也可以指建筑工程。'}),
  wordScene({id:'structure-built-result',start:35,suffix:'ure',formula:'struct 建造 + -ure 结果',meaning:'结构；构造',asset:STRUCT_ASSETS.structure,narration:'structure 是搭出来并能站住的结果。各部分如何连接、彼此怎样支撑，就是结构或构造。文章也有自己的 structure。'}),
  wordScene({id:'instruct-build-mind',start:43.5,prefix:'in',formula:'in- 放进 + struct 建造',meaning:'指导；教授',asset:STRUCT_ASSETS.instruct,narration:'instruct 的 in 是放进去。把知识按顺序搭进别人的头脑，让理解形成，所以 instruct 表示指导、教授。'}),
  wordScene({id:'instruction-guidance',start:52,prefix:'in',suffix:'ion',formula:'instruct 指导 + -ion 内容',meaning:'指示；说明',asset:STRUCT_ASSETS.instruction,narration:'instruction 是指导的内容或一次指令。照着几个步骤把东西搭好，就是说明、指示；复数 instructions 常指操作说明。'}),
  wordScene({id:'reconstruct-build-again',start:60.5,prefix:'recon',formula:'re- 重新 + construct 建造',meaning:'重建；重现',asset:STRUCT_ASSETS.reconstruct,narration:'reconstruct 的 re 是重新。旧结构坏了，把零件收回来再搭一次，就是重建；根据证据还原经过，也叫 reconstruct。'}),
  wordScene({id:'destruct-take-apart',start:69,prefix:'de',formula:'de- 拆下 + struct 结构',meaning:'破坏；拆毁',asset:STRUCT_ASSETS.destruct,narration:'destruct 是把已经搭好的结构拆掉或破坏。抽走关键连接，整体就散开；自毁装置里的 self-destruct 就是自己销毁。'}),
  wordScene({id:'obstruct-block-building',start:77.5,prefix:'ob',formula:'ob- 挡在前面 + struct 建造',meaning:'阻碍；堵塞',asset:STRUCT_ASSETS.obstruct,narration:'obstruct 的 ob 是挡在前面。大块东西卡住结构入口，让材料进不去，所以它表示阻碍、妨碍或堵塞。'}),
  {id:'example-sentences',start:86,duration:10,narration:'放进句子：They constructed a bridge，他们建了一座桥。Follow the instructions，按照说明操作。We reconstructed the scene，我们还原了现场。',
   captions:narrationToCaptions('放进句子：They constructed a bridge，他们建了一座桥。Follow the instructions，按照说明操作。We reconstructed the scene，我们还原了现场。',10),sfx:[{at:0.12,name:'scribble',volume:0.15}],layers:[
    text({id:'examples-title',from:0.05,duration:9.6,enter:'rise',enterDuration:0.36,x:260,y:60,width:1400,fontSize:64,fontWeight:800,align:'center',runs:[{text:'把“建造 / 搭建”放回句子',color:'primary'}]}),
    text({id:'ex1',from:0.8,duration:8.9,enter:'typewriter',enterDuration:0.4,x:150,y:230,width:1620,fontSize:42,fontWeight:700,typewriterCharsPerSec:22,runs:[{text:'They ',color:'primary'},{text:'constructed',color:'accent'},{text:' a bridge.  他们建了一座桥。',color:'primary'}]}),
    text({id:'ex2',from:3.5,duration:6.2,enter:'typewriter',enterDuration:0.4,x:150,y:390,width:1620,fontSize:42,fontWeight:700,typewriterCharsPerSec:22,runs:[{text:'Follow the ',color:'primary'},{text:'instructions',color:'accent'},{text:'.  按照说明操作。',color:'primary'}]}),
    text({id:'ex3',from:6.2,duration:3.5,enter:'typewriter',enterDuration:0.4,x:150,y:550,width:1620,fontSize:42,fontWeight:700,typewriterCharsPerSec:22,runs:[{text:'We ',color:'primary'},{text:'reconstructed',color:'accent'},{text:' the scene.  我们还原了现场。',color:'primary'}]}),
  ],transitionOut:WHITE_FADE},
  {id:'final-summary',start:96,duration:16,narration:'收口：struct 就是 build，建造。construct 建造，construction 工程，structure 结构，instruct 指导，instruction 指示，reconstruct 重建，destruct 拆毁，obstruct 阻碍。记住橙色积木，看到 struct 就先找怎么搭。',
   captions:narrationToCaptions('收口：struct 就是 build，建造。construct 建造，construction 工程，structure 结构，instruct 指导，instruction 指示，reconstruct 重建，destruct 拆毁，obstruct 阻碍。记住橙色积木，看到 struct 就先找怎么搭。',15.2),sfx:[{at:0.12,name:'stamp',volume:0.17}],layers:[
    text({id:'summary-title',from:0.05,duration:15.1,enter:'rise',enterDuration:0.38,x:250,y:38,width:1420,align:'center',fontSize:64,fontWeight:800,runs:[{text:'struct = ',color:'primary'},{text:'build / 建造；搭建',color:'accent'}]}),
    table({id:'summary-table',from:0.35,duration:14.7,enter:'rise',enterDuration:0.42,x:115,y:125,width:1690,height:675,columns:1,rowFromStep:0.42,compact:true,variant:'open',partInMeaning:true,wordFontSize:36,phoneticFontSize:22,meaningFontSize:30,wordColumnFraction:0.38,rows:[
      {word:'construct',phonetic:'/kənˈstrʌkt/',part:'v.',meaning:'一起搭建 → 建造；构筑',accent:'struct'},
      {word:'construction',phonetic:'/kənˈstrʌkʃn/',part:'n.',meaning:'建造的过程或工程 → 建造；施工',accent:'struct'},
      {word:'structure',phonetic:'/ˈstrʌktʃə/',part:'n.',meaning:'搭成并能站住的结果 → 结构；构造',accent:'struct'},
      {word:'instruct',phonetic:'/ɪnˈstrʌkt/',part:'v.',meaning:'把认识搭进头脑 → 指导；教授',accent:'struct'},
      {word:'instruction',phonetic:'/ɪnˈstrʌkʃn/',part:'n.',meaning:'指导的内容 → 指示；说明',accent:'struct'},
      {word:'reconstruct',phonetic:'/ˌriːkənˈstrʌkt/',part:'v.',meaning:'重新搭建 → 重建；重现',accent:'struct'},
      {word:'destruct',phonetic:'/dɪˈstrʌkt/',part:'v.',meaning:'拆掉结构 → 破坏；拆毁',accent:'struct'},
      {word:'obstruct',phonetic:'/əbˈstrʌkt/',part:'v.',meaning:'挡住结构通路 → 阻碍；堵塞',accent:'struct'},
    ]}),
  ]},
];
export const structStoryboard:ReplicaStoryboard={id:'struct',duration:112,fadeToBlackSec:0.7,fadeEndOpacity:0.7,scenes};
