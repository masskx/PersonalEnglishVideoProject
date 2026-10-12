import {narrationToCaptions} from './captionUtils';
import type {ReplicaImageLayer,ReplicaRadialLayer,ReplicaScene,ReplicaStoryboard,ReplicaTableLayer,ReplicaTextLayer} from './types';

export const FORM_ASSETS={
  hook:'assets/replica/form/00_shape_hook.png',formation:'assets/replica/form/01_formation_result.png',
  inform:'assets/replica/form/02_inform_mind.png',reform:'assets/replica/form/03_reform_again.png',
  transform:'assets/replica/form/04_transform_change.png',conform:'assets/replica/form/05_conform_same.png',
  deform:'assets/replica/form/06_deform_bad_shape.png',uniform:'assets/replica/form/07_uniform_one_shape.png',
  formula:'assets/replica/form/08_formula_mold.png',
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
      text({id:`${id}-word`,from:0.05,duration:hold(duration,0.05),enter:'pop',enterDuration:0.42,exit:'fade',exitDuration:0.2,x:85,y:95,width:900,fontSize:prefix.length+suffix.length>7?84:100,fontWeight:800,runs:[{text:prefix,color:'primary'},{text:'form',color:'accent'},{text:suffix,color:'primary'}]}),
      text({id:`${id}-formula`,from:0.72,duration:hold(duration,0.72),enter:'wipe-up',enterDuration:0.34,exit:'fade',exitDuration:0.2,x:100,y:285,width:805,fontSize:42,fontWeight:760,runs:[{text:formula,color:'primary'}]}),
      image({id:`${id}-image`,src:asset,from:0.3,duration:hold(duration,0.3),enter:'slide-left',enterDuration:0.46,exit:'fade',exitDuration:0.2,x:880,y:95,width:850,height:660,fit:'contain'}),
      text({id:`${id}-meaning`,from:4,duration:hold(duration,4),enter:'pop',enterDuration:0.36,exit:'fade',exitDuration:0.2,x:115,y:510,width:720,fontSize:56,fontWeight:800,align:'center',runs:[{text:meaning,color:'accent'}]}),
    ],transitionOut:WHITE_FADE};
};

const scenes:ReplicaScene[]=[
  {id:'shape-hook',start:0,duration:8,narration:'词根 form，核心是 shape：形状、形成。想象小黑手里的橙色模具，东西经过它，就有了形。',
   captions:narrationToCaptions('词根 form，核心是 shape：形状、形成。想象小黑手里的橙色模具，东西经过它，就有了形。',8),sfx:[{at:0.15,name:'pop',volume:0.17}],layers:[
    text({id:'hook-root',from:0.05,duration:7.6,enter:'pop',enterDuration:0.44,x:110,y:130,width:680,fontSize:160,fontWeight:800,align:'center',runs:[{text:'FORM',color:'accent'}]}),
    text({id:'hook-shape',from:0.7,duration:6.9,enter:'rise',enterDuration:0.34,x:160,y:340,width:580,fontSize:72,fontWeight:800,align:'center',runs:[{text:'= SHAPE',color:'primary'}]}),
    text({id:'hook-cn',from:1.2,duration:6.4,enter:'wipe-up',enterDuration:0.34,x:150,y:500,width:600,fontSize:62,fontWeight:780,align:'center',runs:[{text:'形状；形成',color:'primary'}]}),
    image({id:'hook-image',src:FORM_ASSETS.hook,from:0.3,duration:7.3,enter:'slide-left',enterDuration:0.5,x:800,y:80,width:960,height:720,fit:'contain'}),
  ],transitionOut:WHITE_FADE},
  {id:'shape-map',start:8,duration:10,narration:'记忆时只问：这个形怎么做出来？形成结果、放进头脑、重新塑形、彻底变形、变得一致，或把形弄坏。前后缀一清楚，词义就顺了。',
   captions:narrationToCaptions('记忆时只问：这个形怎么做出来？形成结果、放进头脑、重新塑形、彻底变形、变得一致，或把形弄坏。前后缀一清楚，词义就顺了。',10),sfx:[{at:0.15,name:'scribble',volume:0.15}],layers:[
    text({id:'map-title',from:0.05,duration:9.6,enter:'rise',enterDuration:0.38,x:220,y:55,width:1480,fontSize:62,fontWeight:800,align:'center',runs:[{text:'看清“怎么塑形”，就能还原词义',color:'primary'}]}),
    radial({id:'map-radial',from:0.55,duration:9,enter:'pop',enterDuration:0.46,x:130,y:170,width:1660,height:640,center:[{text:'FORM',color:'accent',weight:800,size:82},{text:'\n形状；形成',color:'primary',weight:760,size:46}],items:[
      {text:'-ation  结果',angle:205,color:'primary'},{text:'in-  放进',angle:150,color:'primary'},{text:'re-  重新',angle:95,color:'primary'},
      {text:'trans-  改变',angle:25,color:'primary'},{text:'con-  一致',angle:335,color:'primary'},{text:'de-  破坏',angle:270,color:'primary'},
    ],radiusX:600,radiusY:245}),
  ],transitionOut:WHITE_FADE},
  wordScene({id:'formation-result',start:18,suffix:'ation',formula:'form 形成 + -ation 结果',meaning:'形成；构成',asset:FORM_ASSETS.formation,narration:'formation 是 form 加名词后缀 ation，表示形成的过程或结果。零散部件被小黑摆成稳定结构，就是形成、构成。'}),
  wordScene({id:'inform-put-in',start:26.5,prefix:'in',formula:'in- 进入 + form 形成认识',meaning:'通知；告知',asset:FORM_ASSETS.inform,narration:'inform 的 in 是进入。把信息放进头脑，让认识形成，所以 inform 就是通知、告知；重点是让对方知道。'}),
  wordScene({id:'reform-shape-again',start:35,prefix:'re',formula:'re- 重新 + form 塑形',meaning:'改革；改造',asset:FORM_ASSETS.reform,narration:'reform 的 re 是重新。旧形状不合适，就拆开再塑一次，因此它表示改革、改造，制度和旧结构都能 reform。'}),
  wordScene({id:'transform-change-shape',start:43.5,prefix:'trans',formula:'trans- 转变 + form 形状',meaning:'使转变；变形',asset:FORM_ASSETS.transform,narration:'transform 是让形状跨到另一种状态。圆的进去，方的出来，外形或性质发生明显改变，所以它表示使转变、使变形。'}),
  wordScene({id:'conform-same-shape',start:52,prefix:'con',formula:'con- 共同 + form 形状',meaning:'遵从；符合',asset:FORM_ASSETS.conform,narration:'conform 的 con 有共同、一起的感觉。把自己压进同一个模具，变得和标准一致，所以表示遵从、符合，常和 to 连用。'}),
  wordScene({id:'deform-ruin-shape',start:60.5,prefix:'de',formula:'de- 向坏处 + form 形状',meaning:'使变形；损坏形状',asset:FORM_ASSETS.deform,narration:'deform 是把原来的好形状弄坏。圆球被压歪，材料受力后发生变形，都可以用 deform；它通常带有损坏或异常的意味。'}),
  wordScene({id:'uniform-one-shape',start:69,prefix:'uni',formula:'uni- 一个 + form 形制',meaning:'统一的；制服',asset:FORM_ASSETS.uniform,narration:'uniform 的 uni 是一个。大家采用同一种形制，就是统一的；穿在身上的统一样式，就是制服。一个模具，做出同样的外形。'}),
  wordScene({id:'formula-fixed-method',start:77.5,suffix:'ula',formula:'form 形成 + -ula 小型结果',meaning:'公式；配方',asset:FORM_ASSETS.formula,narration:'formula 原本指固定形成某种结果的方法。数学里是公式，制作东西时是配方：按同一套步骤放进材料，就能重复得到相同结果。'}),
  {id:'example-sentences',start:86,duration:10,narration:'放进句子：The team formed a circle，队伍围成了圆。Please inform me，请通知我。Technology transformed the city，科技改变了城市。',
   captions:narrationToCaptions('放进句子：The team formed a circle，队伍围成了圆。Please inform me，请通知我。Technology transformed the city，科技改变了城市。',10),sfx:[{at:0.12,name:'scribble',volume:0.15}],layers:[
    text({id:'examples-title',from:0.05,duration:9.6,enter:'rise',enterDuration:0.36,x:260,y:60,width:1400,fontSize:64,fontWeight:800,align:'center',runs:[{text:'把“形状 / 形成”放回句子',color:'primary'}]}),
    text({id:'ex1',from:0.8,duration:8.9,enter:'typewriter',enterDuration:0.4,x:150,y:210,width:1620,fontSize:42,fontWeight:700,typewriterCharsPerSec:22,runs:[{text:'The team ',color:'primary'},{text:'formed',color:'accent'},{text:' a circle.  队伍围成了圆。',color:'primary'}]}),
    text({id:'ex2',from:3,duration:6.7,enter:'typewriter',enterDuration:0.4,x:150,y:345,width:1620,fontSize:42,fontWeight:700,typewriterCharsPerSec:22,runs:[{text:'Please ',color:'primary'},{text:'inform',color:'accent'},{text:' me.  请通知我。',color:'primary'}]}),
    text({id:'ex3',from:5.2,duration:4.5,enter:'typewriter',enterDuration:0.4,x:150,y:480,width:1620,fontSize:42,fontWeight:700,typewriterCharsPerSec:22,runs:[{text:'Technology ',color:'primary'},{text:'transformed',color:'accent'},{text:' the city.  科技改变了城市。',color:'primary'}]}),
    text({id:'ex4',from:7.4,duration:2.3,enter:'typewriter',enterDuration:0.4,x:150,y:615,width:1620,fontSize:42,fontWeight:700,typewriterCharsPerSec:22,runs:[{text:'This ',color:'primary'},{text:'conforms',color:'accent'},{text:' to the rule.  这符合规定。',color:'primary'}]}),
  ],transitionOut:WHITE_FADE},
  {id:'final-summary',start:96,duration:16,narration:'收口：form 就是形状、形成。formation 形成，inform 告知，reform 改革，transform 转变，conform 符合，deform 使变形，uniform 统一的或制服，formula 公式或配方。记住橙色模具，看到 form 就先找形。',
   captions:narrationToCaptions('收口：form 就是形状、形成。formation 形成，inform 告知，reform 改革，transform 转变，conform 符合，deform 使变形，uniform 统一的或制服，formula 公式或配方。记住橙色模具，看到 form 就先找形。',15.2),sfx:[{at:0.12,name:'stamp',volume:0.17}],layers:[
    text({id:'summary-title',from:0.05,duration:15.1,enter:'rise',enterDuration:0.38,x:250,y:38,width:1420,align:'center',fontSize:64,fontWeight:800,runs:[{text:'form = ',color:'primary'},{text:'shape / 形状；形成',color:'accent'}]}),
    table({id:'summary-table',from:0.35,duration:14.7,enter:'rise',enterDuration:0.42,x:115,y:125,width:1690,height:675,columns:1,rowFromStep:0.42,compact:true,variant:'open',partInMeaning:true,wordFontSize:36,phoneticFontSize:22,meaningFontSize:30,wordColumnFraction:0.38,rows:[
      {word:'formation',phonetic:'/fɔːˈmeɪʃn/',part:'n.',meaning:'形成的过程或结果 → 形成；构成',accent:'form'},
      {word:'inform',phonetic:'/ɪnˈfɔːm/',part:'v.',meaning:'让认识在头脑中形成 → 通知；告知',accent:'form'},
      {word:'reform',phonetic:'/rɪˈfɔːm/',part:'v./n.',meaning:'重新塑形 → 改革；改造',accent:'form'},
      {word:'transform',phonetic:'/trænsˈfɔːm/',part:'v.',meaning:'改变形状或性质 → 转变；变形',accent:'form'},
      {word:'conform',phonetic:'/kənˈfɔːm/',part:'v.',meaning:'变成共同形制 → 遵从；符合',accent:'form'},
      {word:'deform',phonetic:'/dɪˈfɔːm/',part:'v.',meaning:'破坏原有形状 → 使变形',accent:'form'},
      {word:'uniform',phonetic:'/ˈjuːnɪfɔːm/',part:'adj./n.',meaning:'同一种形制 → 统一的；制服',accent:'form'},
      {word:'formula',phonetic:'/ˈfɔːmjələ/',part:'n.',meaning:'固定形成结果的方法 → 公式；配方',accent:'form'},
    ]}),
  ]},
];
export const formStoryboard:ReplicaStoryboard={id:'form',duration:112,fadeToBlackSec:0.7,fadeEndOpacity:0.7,scenes};
