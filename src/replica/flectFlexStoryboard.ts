import {narrationToCaptions} from './captionUtils';
import type {ReplicaImageLayer,ReplicaRadialLayer,ReplicaScene,ReplicaStoryboard,ReplicaTableLayer,ReplicaTextLayer} from './types';

export const FLECT_FLEX_ASSETS={
  hook:'assets/replica/flect-flex/00_bend_hook.png',reflect:'assets/replica/flect-flex/01_reflect_bend_back.png',
  reflection:'assets/replica/flect-flex/02_reflection_return_image.png',deflect:'assets/replica/flect-flex/03_deflect_turn_aside.png',
  inflect:'assets/replica/flect-flex/04_inflect_bend_voice.png',flexible:'assets/replica/flect-flex/05_flexible_easy_bend.png',
  flexibility:'assets/replica/flect-flex/06_flexibility_many_shapes.png',reflex:'assets/replica/flect-flex/07_reflex_bend_back_fast.png',
  inflexible:'assets/replica/flect-flex/08_inflexible_wont_bend.png',
} as const;
const text=(layer:Omit<ReplicaTextLayer,'kind'>):ReplicaTextLayer=>({kind:'text',...layer});
const image=(layer:Omit<ReplicaImageLayer,'kind'>):ReplicaImageLayer=>({kind:'image',...layer});
const radial=(layer:Omit<ReplicaRadialLayer,'kind'>):ReplicaRadialLayer=>({kind:'radial',...layer});
const table=(layer:Omit<ReplicaTableLayer,'kind'>):ReplicaTableLayer=>({kind:'table',...layer});
const hold=(d:number,f:number,t=0.2)=>Number(Math.max(0.12,d-f-t).toFixed(3));
const WHITE_FADE={type:'white-fade' as const,duration:0.16};
const wordScene=({id,start,narration,prefix='',root='flect',suffix='',formula,meaning,asset}:{id:string;start:number;narration:string;prefix?:string;root?:string;suffix?:string;formula:string;meaning:string;asset:string;}):ReplicaScene=>{
  const duration=8.5;
  return {id,start,duration,narration,captions:narrationToCaptions(narration,duration),
    sfx:[{at:0.12,name:'whoosh',volume:0.15},{at:3.7,name:'pop',volume:0.13}],layers:[
      text({id:`${id}-word`,from:0.05,duration:hold(duration,0.05),enter:'pop',enterDuration:0.42,exit:'fade',exitDuration:0.2,x:85,y:95,width:900,fontSize:prefix.length+suffix.length>8?78:94,fontWeight:800,runs:[{text:prefix,color:'primary'},{text:root,color:'accent'},{text:suffix,color:'primary'}]}),
      text({id:`${id}-formula`,from:0.72,duration:hold(duration,0.72),enter:'wipe-up',enterDuration:0.34,exit:'fade',exitDuration:0.2,x:100,y:285,width:805,fontSize:42,fontWeight:760,runs:[{text:formula,color:'primary'}]}),
      image({id:`${id}-image`,src:asset,from:0.3,duration:hold(duration,0.3),enter:'slide-left',enterDuration:0.46,exit:'fade',exitDuration:0.2,x:880,y:95,width:850,height:660,fit:'contain'}),
      text({id:`${id}-meaning`,from:4,duration:hold(duration,4),enter:'pop',enterDuration:0.36,exit:'fade',exitDuration:0.2,x:115,y:510,width:720,fontSize:54,fontWeight:800,align:'center',runs:[{text:meaning,color:'accent'}]}),
    ],transitionOut:WHITE_FADE};
};

const scenes:ReplicaScene[]=[
  {id:'bend-hook',start:0,duration:8,narration:'reflect、flexible、reflex，共同点是什么？都在弯。flect 和 flex 就是 bend。软杆怎么弯，词义就怎么转。',
   captions:narrationToCaptions('reflect、flexible、reflex，共同点是什么？都在弯。flect 和 flex 就是 bend。软杆怎么弯，词义就怎么转。',8),sfx:[{at:0.12,name:'whoosh',volume:0.14},{at:0.62,name:'pop',volume:0.15},{at:1.65,name:'press',volume:0.18},{at:2.55,name:'scribble',volume:0.13}],layers:[
    text({id:'hook-test-reflect',from:0.03,duration:1.45,enter:'slide-right',enterDuration:0.24,exit:'fade',exitDuration:0.16,x:95,y:115,width:620,fontSize:78,fontWeight:820,align:'center',runs:[{text:'re',color:'primary'},{text:'flect',color:'accent'}]}),
    text({id:'hook-test-flexible',from:0.26,duration:1.22,enter:'pop',enterDuration:0.26,exit:'fade',exitDuration:0.16,x:95,y:275,width:620,fontSize:78,fontWeight:820,align:'center',runs:[{text:'flex',color:'accent'},{text:'ible',color:'primary'}]}),
    text({id:'hook-test-reflex',from:0.52,duration:0.96,enter:'slide-left',enterDuration:0.24,exit:'fade',exitDuration:0.16,x:95,y:435,width:620,fontSize:78,fontWeight:820,align:'center',runs:[{text:'re',color:'primary'},{text:'flex',color:'accent'}]}),
    text({id:'hook-question',from:0.82,duration:0.82,enter:'wipe-up',enterDuration:0.26,exit:'fade',exitDuration:0.15,x:820,y:112,width:875,fontSize:58,fontWeight:800,align:'center',runs:[{text:'它们共同在做什么？',color:'primary'}]}),
    image({id:'hook-image',src:FLECT_FLEX_ASSETS.hook,from:0.12,duration:7.48,enter:'slide-left',enterDuration:0.38,x:850,y:150,width:900,height:640,fit:'contain'}),
    text({id:'hook-result',from:1.48,duration:6.12,enter:'pop',enterDuration:0.24,x:115,y:130,width:700,fontSize:104,fontWeight:850,align:'center',runs:[{text:'都在“弯”',color:'accent'}]}),
    text({id:'hook-root',from:2.18,duration:5.42,enter:'rise',enterDuration:0.3,x:80,y:330,width:770,fontSize:92,fontWeight:820,align:'center',runs:[{text:'FLECT / FLEX',color:'accent'}]}),
    text({id:'hook-bend',from:2.62,duration:4.98,enter:'wipe-up',enterDuration:0.28,x:150,y:500,width:630,fontSize:66,fontWeight:820,align:'center',runs:[{text:'= BEND  弯曲 / 转向',color:'primary'}]}),
  ],transitionOut:WHITE_FADE},
  {id:'bend-map',start:8,duration:10,narration:'flect 和 flex 来自同一个弯曲动作。看到单词，先判断方向：是弯回、弯开、改变曲线、能够弯，还是不肯弯。',
   captions:narrationToCaptions('flect 和 flex 来自同一个弯曲动作。看到单词，先判断方向：是弯回、弯开、改变曲线、能够弯，还是不肯弯。',10),sfx:[{at:0.15,name:'scribble',volume:0.15}],layers:[
    text({id:'map-title',from:0.05,duration:9.6,enter:'rise',enterDuration:0.38,x:220,y:55,width:1480,fontSize:62,fontWeight:800,align:'center',runs:[{text:'同一根软杆，两种拼法',color:'primary'}]}),
    radial({id:'map-radial',from:0.55,duration:9,enter:'pop',enterDuration:0.46,x:130,y:170,width:1660,height:640,center:[{text:'FLECT / FLEX',color:'accent',weight:800,size:72},{text:'\n弯曲；转向',color:'primary',weight:760,size:46}],items:[
      {text:'re-  弯回',angle:205,color:'primary'},{text:'de-  弯开',angle:150,color:'primary'},{text:'in-  改变曲线',angle:95,color:'primary'},
      {text:'-ible  能弯',angle:25,color:'primary'},{text:'-ibility  能力',angle:335,color:'primary'},{text:'in-  不肯弯',angle:270,color:'primary'},
    ],radiusX:600,radiusY:245}),
  ],transitionOut:WHITE_FADE},
  wordScene({id:'reflect-bend-back',start:18,prefix:'re',formula:'re- 回 + flect 弯',meaning:'反射；反映；思考',asset:FLECT_FLEX_ASSETS.reflect,narration:'reflect 的 re 是回。光碰到镜面后弯回，就是反射；事物把特征呈现回来，就是反映。想法折回来再看一遍，也表示思考。'}),
  wordScene({id:'reflection-returned-image',start:26.5,prefix:'re',suffix:'ion',formula:'reflect 反射 + -ion 结果',meaning:'反射；倒影；反思',asset:FLECT_FLEX_ASSETS.reflection,narration:'reflection 是弯回之后形成的结果。镜子里的倒影、光的反射，都叫 reflection；把经历折回内心重新审视，也就是反思。'}),
  wordScene({id:'deflect-turn-aside',start:35,prefix:'de',formula:'de- 离开 + flect 弯',meaning:'使偏转；转移',asset:FLECT_FLEX_ASSETS.deflect,narration:'deflect 的 de 表示离开原方向。球撞上挡板后转到一边，就是使偏转；把问题引向别处，也可以用 deflect。'}),
  wordScene({id:'inflect-bend-voice',start:43.5,prefix:'in',formula:'in- 使进入变化 + flect 弯',meaning:'改变语调；使屈折',asset:FLECT_FLEX_ASSETS.inflect,narration:'inflect 是让曲线发生变化。说话时让声音高低向上或向下弯，就是改变语调；语法里也可指词形屈折。'}),
  wordScene({id:'flexible-easy-bend',start:52,root:'flex',suffix:'ible',formula:'flex 弯 + -ible 能够',meaning:'柔韧的；灵活的',asset:FLECT_FLEX_ASSETS.flexible,narration:'flexible 是能够弯。材料绕过障碍又不断，就是柔韧；计划能随情况调整，也叫灵活。能弯的关键是能适应。'}),
  wordScene({id:'flexibility-many-bends',start:60.5,root:'flex',suffix:'ibility',formula:'flexible 灵活 + -ity 性质',meaning:'灵活性；柔韧性',asset:FLECT_FLEX_ASSETS.flexibility,narration:'flexibility 是 flexible 对应的性质。身体能做不同幅度的弯曲，是柔韧性；方法能随条件改变路径，是灵活性。'}),
  wordScene({id:'reflex-fast-return',start:69,prefix:'re',root:'flex',formula:'re- 回 + flex 弯',meaning:'反射动作；本能反应',asset:FLECT_FLEX_ASSETS.reflex,narration:'reflex 是迅速弯回来的动作。像弹簧被压弯后立刻弹回，身体不经思考自动反应，就是反射动作或本能反应。'}),
  wordScene({id:'inflexible-wont-bend',start:77.5,prefix:'in',root:'flex',suffix:'ible',formula:'in- 不 + flexible 能弯的',meaning:'不灵活的；僵化的',asset:FLECT_FLEX_ASSETS.inflexible,narration:'inflexible 前面的 in 表示不。粗杆怎么用力都不弯，就是僵硬；规则完全不能调整，也表示不灵活、僵化。'}),
  {id:'example-sentences',start:86,duration:10,narration:'放进句子：The mirror reflects light，镜子反射光。We need a flexible plan，我们需要灵活的计划。He deflected the question，他把问题岔开了。',
   captions:narrationToCaptions('放进句子：The mirror reflects light，镜子反射光。We need a flexible plan，我们需要灵活的计划。He deflected the question，他把问题岔开了。',10),sfx:[{at:0.12,name:'scribble',volume:0.15}],layers:[
    text({id:'examples-title',from:0.05,duration:9.6,enter:'rise',enterDuration:0.36,x:260,y:60,width:1400,fontSize:64,fontWeight:800,align:'center',runs:[{text:'把“弯曲 / 转向”放回句子',color:'primary'}]}),
    text({id:'ex1',from:0.8,duration:8.9,enter:'typewriter',enterDuration:0.4,x:150,y:230,width:1620,fontSize:42,fontWeight:700,typewriterCharsPerSec:22,runs:[{text:'The mirror ',color:'primary'},{text:'reflects',color:'accent'},{text:' light.  镜子反射光。',color:'primary'}]}),
    text({id:'ex2',from:3.5,duration:6.2,enter:'typewriter',enterDuration:0.4,x:150,y:390,width:1620,fontSize:42,fontWeight:700,typewriterCharsPerSec:22,runs:[{text:'We need a ',color:'primary'},{text:'flexible',color:'accent'},{text:' plan.  我们需要灵活的计划。',color:'primary'}]}),
    text({id:'ex3',from:6.2,duration:3.5,enter:'typewriter',enterDuration:0.4,x:150,y:550,width:1620,fontSize:42,fontWeight:700,typewriterCharsPerSec:22,runs:[{text:'He ',color:'primary'},{text:'deflected',color:'accent'},{text:' the question.  他把问题岔开了。',color:'primary'}]}),
  ],transitionOut:WHITE_FADE},
  {id:'final-summary',start:96,duration:16,narration:'收口：flect 和 flex 都是 bend，弯曲。reflect 弯回，reflection 反射结果，deflect 弯开，inflect 改变曲线，flexible 能弯，flexibility 灵活性，reflex 自动弯回，inflexible 不肯弯。记住小黑手里的橙色软杆。',
   captions:narrationToCaptions('收口：flect 和 flex 都是 bend，弯曲。reflect 弯回，reflection 反射结果，deflect 弯开，inflect 改变曲线，flexible 能弯，flexibility 灵活性，reflex 自动弯回，inflexible 不肯弯。记住小黑手里的橙色软杆。',15.2),sfx:[{at:0.12,name:'stamp',volume:0.17}],layers:[
    text({id:'summary-title',from:0.05,duration:15.1,enter:'rise',enterDuration:0.38,x:250,y:38,width:1420,align:'center',fontSize:64,fontWeight:800,runs:[{text:'flect / flex = ',color:'primary'},{text:'bend / 弯曲',color:'accent'}]}),
    table({id:'summary-table',from:0.35,duration:14.7,enter:'rise',enterDuration:0.42,x:115,y:125,width:1690,height:675,columns:1,rowFromStep:0.42,compact:true,variant:'open',partInMeaning:true,wordFontSize:36,phoneticFontSize:22,meaningFontSize:30,wordColumnFraction:0.38,rows:[
      {word:'reflect',phonetic:'/rɪˈflekt/',part:'v.',meaning:'弯回光线或想法 → 反射；反映；思考',accent:'flect'},
      {word:'reflection',phonetic:'/rɪˈflekʃn/',part:'n.',meaning:'弯回形成的结果 → 反射；倒影；反思',accent:'flect'},
      {word:'deflect',phonetic:'/dɪˈflekt/',part:'v.',meaning:'弯离原方向 → 使偏转；转移',accent:'flect'},
      {word:'inflect',phonetic:'/ɪnˈflekt/',part:'v.',meaning:'使曲线发生变化 → 改变语调；使屈折',accent:'flect'},
      {word:'flexible',phonetic:'/ˈfleksəbl/',part:'adj.',meaning:'能够弯并适应 → 柔韧的；灵活的',accent:'flex'},
      {word:'flexibility',phonetic:'/ˌfleksəˈbɪləti/',part:'n.',meaning:'能弯、能调整的性质 → 灵活性；柔韧性',accent:'flex'},
      {word:'reflex',phonetic:'/ˈriːfleks/',part:'n.',meaning:'自动弯回的动作 → 反射动作；本能反应',accent:'flex'},
      {word:'inflexible',phonetic:'/ɪnˈfleksəbl/',part:'adj.',meaning:'不能弯或调整 → 不灵活的；僵化的',accent:'flex'},
    ]}),
  ]},
];

export const flectFlexStoryboard:ReplicaStoryboard={id:'flect-flex',duration:112,fadeToBlackSec:0.7,fadeEndOpacity:0.7,scenes};
