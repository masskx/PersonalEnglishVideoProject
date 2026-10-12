import {narrationToCaptions} from './captionUtils';
import type {ReplicaImageLayer,ReplicaScene,ReplicaStoryboard,ReplicaTableLayer,ReplicaTextLayer} from './types';

type KeyposeSet = readonly [string,string,string];
export const CRED_ASSETS = {
  credible:['assets/replica/cred-v2/credible-before.png','assets/replica/cred-v2/credible-change.png','assets/replica/cred-v2/credible-result.png'] as KeyposeSet,
  credibility:['assets/replica/cred-v2/credibility-before.png','assets/replica/cred-v2/credibility-change.png','assets/replica/cred-v2/credibility-result.png'] as KeyposeSet,
  credulous:['assets/replica/cred-v2/credulous-before.png','assets/replica/cred-v2/credulous-change.png','assets/replica/cred-v2/credulous-result.png'] as KeyposeSet,
  incredulous:['assets/replica/cred-v2/incredulous-before.png','assets/replica/cred-v2/incredulous-change.png','assets/replica/cred-v2/incredulous-result.png'] as KeyposeSet,
  incredible:['assets/replica/cred-v2/incredible-before.png','assets/replica/cred-v2/incredible-change.png','assets/replica/cred-v2/incredible-result.png'] as KeyposeSet,
  credit:['assets/replica/cred-v2/credit-before.png','assets/replica/cred-v2/credit-change.png','assets/replica/cred-v2/credit-result.png'] as KeyposeSet,
  creditable:['assets/replica/cred-v2/creditable-before.png','assets/replica/cred-v2/creditable-change.png','assets/replica/cred-v2/creditable-result.png'] as KeyposeSet,
  discredit:['assets/replica/cred-v2/discredit-before.png','assets/replica/cred-v2/discredit-change.png','assets/replica/cred-v2/discredit-result.png'] as KeyposeSet,
} as const;

const text=(layer:Omit<ReplicaTextLayer,'kind'>):ReplicaTextLayer=>({kind:'text',...layer});
const image=(layer:Omit<ReplicaImageLayer,'kind'>):ReplicaImageLayer=>({kind:'image',...layer});
const table=(layer:Omit<ReplicaTableLayer,'kind'>):ReplicaTableLayer=>({kind:'table',...layer});
const hold=(duration:number,from:number,tail=0.22)=>Math.max(0.12,duration-from-tail);
const WHITE_FADE={type:'white-fade' as const,duration:0.12};

const poseLayers=(id:string,poses:KeyposeSet,duration:number,x=1010,y=115,width=790,height=650,contentScale=1.14):ReplicaImageLayer[]=>{
  const first=2.25,second=4.1;
  return [
    image({id:`${id}-before`,src:poses[0],from:0,duration:first,enter:'none',exit:'none',x,y,width,height,fit:'contain',contentScale}),
    image({id:`${id}-change`,src:poses[1],from:first,duration:second-first,enter:'none',exit:'none',x,y,width,height,fit:'contain',contentScale}),
    image({id:`${id}-result`,src:poses[2],from:second,duration:duration-second,enter:'none',exit:'none',x,y,width,height,fit:'contain',contentScale}),
  ];
};

const addScene=(scenes:ReplicaScene[],input:Omit<ReplicaScene,'start'>)=>{
  const start=scenes.length?scenes[scenes.length-1].start+scenes[scenes.length-1].duration:0;
  scenes.push({...input,start});
};

const wordScene=(args:{id:string;duration:number;narration:string;word:string;prefix?:string;root?:string;suffix?:string;formula:string;meaning:string;poses:KeyposeSet;layout?:'left'|'right'|'hero';sfx?:ReplicaScene['sfx']}):Omit<ReplicaScene,'start'>=>{
  const {id,duration,narration,word,prefix='',root='cred',suffix='',formula,meaning,poses,layout='left',sfx}=args;
  if(layout==='hero') return {id,duration,narration,captions:narrationToCaptions(narration,duration),sfx,transitionOut:WHITE_FADE,layers:[
    text({id:`${id}-word`,from:0.05,duration:hold(duration,0.05),enter:'smooth-rise',enterDuration:0.4,exit:'smooth-out',exitDuration:0.2,x:130,y:50,width:1660,fontSize:word.length>11?68:86,fontWeight:840,align:'center',runs:[{text:prefix,color:'primary'},{text:root,color:'accent'},{text:suffix,color:'primary'}],runMotion:'assemble'}),
    text({id:`${id}-formula`,from:0.7,duration:hold(duration,0.7),enter:'smooth-reveal',enterDuration:0.32,exit:'smooth-out',exitDuration:0.2,x:310,y:165,width:1300,fontSize:35,fontWeight:740,align:'center',runs:[{text:formula,color:'primary'}]}),
    ...poseLayers(id,poses,duration,425,215,1070,590,1.2),
    text({id:`${id}-meaning`,from:4.0,duration:hold(duration,4.0),enter:'smooth-rise',enterDuration:0.34,exit:'smooth-out',exitDuration:0.2,x:410,y:765,width:1100,fontSize:43,fontWeight:820,align:'center',runs:[{text:meaning,color:'accent'}]}),
  ]};
  const textX=layout==='left'?95:980,artX=layout==='left'?995:55;
  return {id,duration,narration,captions:narrationToCaptions(narration,duration),sfx,transitionOut:WHITE_FADE,layers:[
    text({id:`${id}-word`,from:0.05,duration:hold(duration,0.05),enter:'smooth-rise',enterDuration:0.45,exit:'smooth-out',exitDuration:0.2,x:textX,y:125,width:830,fontSize:word.length>11?70:88,fontWeight:820,runs:[{text:prefix,color:'primary'},{text:root,color:'accent'},{text:suffix,color:'primary'}],runMotion:'assemble'}),
    text({id:`${id}-formula`,from:0.85,duration:hold(duration,0.85),enter:'smooth-slide',enterDuration:0.34,exit:'smooth-out',exitDuration:0.2,x:textX+8,y:295,width:790,fontSize:36,fontWeight:740,runs:[{text:formula,color:'primary'}]}),
    ...poseLayers(id,poses,duration,artX,105,835,675,1.17),
    text({id:`${id}-meaning`,from:3.95,duration:hold(duration,3.95),enter:'smooth-reveal',enterDuration:0.34,exit:'smooth-out',exitDuration:0.2,x:textX-12,y:515,width:825,fontSize:46,fontWeight:800,align:'center',runs:[{text:meaning,color:'accent'}]}),
  ]};
};

const scenes:ReplicaScene[]=[];
const hookNarration='“5 分钟英语满分。”这话 credible 吗？信它的人，会不会太 credulous？两个词长得像，意思可差远了。';
addScene(scenes,{id:'cred-hook',duration:8.5,narration:hookNarration,captions:narrationToCaptions(hookNarration,8.5),sfx:[{at:0.12,name:'pop',volume:0.15},{at:2.8,name:'whoosh',volume:0.12}],transitionOut:WHITE_FADE,layers:[
  text({id:'hook-question',from:0.05,duration:8.15,enter:'smooth-rise',enterDuration:0.4,exit:'smooth-out',exitDuration:0.2,x:90,y:115,width:890,fontSize:70,fontWeight:820,runs:[{text:'credible',color:'accent'},{text:' 还是 ',color:'primary'},{text:'credulous',color:'accent'}]}),
  text({id:'hook-claim',from:0.85,duration:7.3,enter:'smooth-reveal',enterDuration:0.38,x:120,y:315,width:830,fontSize:46,fontWeight:760,runs:[{text:'“5 分钟拿下英语满分”',color:'primary'}]}),
  text({id:'hook-prompt',from:2.1,duration:6.05,enter:'smooth-slide',enterDuration:0.35,x:120,y:475,width:830,fontSize:42,fontWeight:720,runs:[{text:'可信的说法？还是轻信的人？',color:'accent'}]}),
  image({id:'hook-claim-art',src:CRED_ASSETS.credible[1],from:0.1,duration:2.7,enter:'smooth-slide',enterDuration:0.35,x:1030,y:105,width:800,height:670,fit:'contain',contentScale:1.32}),
  image({id:'hook-reaction-art',src:CRED_ASSETS.credulous[2],from:2.8,duration:5.4,enter:'smooth-rise',enterDuration:0.3,x:1030,y:105,width:800,height:670,fit:'contain',contentScale:1.32}),
]});
const rootNarration='cred 这条线索，连着 believe 和 trust，也就是相信、信任。接下来加上不同词尾，看它怎样落进具体场景。';
addScene(scenes,{id:'cred-root-map',duration:9.2,narration:rootNarration,captions:narrationToCaptions(rootNarration,9.2),sfx:[{at:0.2,name:'scribble',volume:0.12}],transitionOut:WHITE_FADE,layers:[
  text({id:'root-main',from:0.05,duration:8.95,enter:'smooth-rise',enterDuration:0.4,x:140,y:90,width:800,fontSize:106,fontWeight:850,align:'center',runs:[{text:'CRED',color:'accent'}]}),
  text({id:'root-meaning',from:0.65,duration:8.3,enter:'smooth-slide',enterDuration:0.35,x:120,y:285,width:830,fontSize:54,fontWeight:800,align:'center',runs:[{text:'BELIEVE · TRUST',color:'primary'}]}),
  text({id:'root-cn',from:1.2,duration:7.75,enter:'smooth-reveal',enterDuration:0.4,x:125,y:425,width:820,fontSize:48,fontWeight:760,align:'center',runs:[{text:'相信 · 信任',color:'accent'}]}),
  image({id:'root-xiaohei',src:CRED_ASSETS.credible[2],from:0.2,duration:8.75,enter:'smooth-slide',enterDuration:0.45,x:1020,y:95,width:820,height:690,fit:'contain',contentScale:1.25}),
]});
addScene(scenes,wordScene({id:'credible-word',duration:8.8,narration:'credible 说的是“有根据，听着可信”。比如 credible evidence，证据能对得上，才让人愿意信。',word:'credible',root:'cred',suffix:'ible',formula:'cred + -ible：能够被相信的',meaning:'可信的；有根据的',poses:CRED_ASSETS.credible,sfx:[{at:0.12,name:'whoosh',volume:0.11},{at:4.2,name:'stamp',volume:0.12}]}));
addScene(scenes,wordScene({id:'credibility-word',duration:8.5,narration:'credible 换成名词，就是 credibility，可信度。A source loses credibility，说的是这个来源越来越靠不住。',word:'credibility',root:'credibility',formula:'credible → credibility：可信度',meaning:'可信度；可靠性',poses:CRED_ASSETS.credibility,layout:'right'}));
addScene(scenes,wordScene({id:'credulous-word',duration:8.8,narration:'credulous 用来形容人。别人说什么都点头，很容易上当，就是 credulous，语气里常带一点提醒。',word:'credulous',root:'cred',suffix:'ulous',formula:'cred + -ulous：容易相信的',meaning:'轻信的；易上当的',poses:CRED_ASSETS.credulous,layout:'hero',sfx:[{at:0.14,name:'pop',volume:0.11},{at:4.2,name:'whoosh',volume:0.1}]}));
addScene(scenes,wordScene({id:'incredulous-word',duration:9,narration:'incredulous 是听完以后满脸怀疑：“真的假的？”它写的是人的反应，常见搭配是 an incredulous look。',word:'incredulous',prefix:'in',root:'cred',suffix:'ulous',formula:'in- + credulous：不愿轻信；表示怀疑',meaning:'不相信的；表示怀疑的',poses:CRED_ASSETS.incredulous,layout:'right'}));
addScene(scenes,wordScene({id:'incredible-word',duration:8.7,narration:'incredible 放在消息、经历或成绩前面，意思是难以置信，口语里也能表示“太惊人了”。',word:'incredible',prefix:'in',root:'cred',suffix:'ible',formula:'in- + credible：难以相信的',meaning:'难以置信的；惊人的',poses:CRED_ASSETS.incredible,layout:'hero'}));
addScene(scenes,wordScene({id:'credit-word',duration:10,narration:'credit 也带着信任。give someone credit，是认可他的功劳；金融里的 credit，是别人愿意先把信用交给你。',word:'credit',root:'credit',formula:'cred → credit：信任；认可；信用',meaning:'认可；信用；赊借',poses:CRED_ASSETS.credit,layout:'left'}));
addScene(scenes,wordScene({id:'creditable-word',duration:8.2,narration:'creditable 很容易看成 credible。A creditable result 说的是成绩值得肯定，表现相当不错。',word:'creditable',prefix:'',root:'credit',suffix:'able',formula:'credit + -able：值得给予肯定的',meaning:'值得称赞的；相当不错的',poses:CRED_ASSETS.creditable,layout:'right'}));
addScene(scenes,wordScene({id:'discredit-word',duration:8.7,narration:'discredit 是把信誉打下来。新证据足够有力，就可能 discredit an old theory，让旧理论站不住。',word:'discredit',prefix:'dis',root:'credit',suffix:'',formula:'dis- + credit：削弱信任或名声',meaning:'使失去信誉；损害可信度',poses:CRED_ASSETS.discredit,layout:'hero'}));
const familyMapNarration='八个词分四组：credible 和 credibility 讲可信；credulous 和 incredulous 看人信不信；incredible 是惊人，creditable 是值得肯定；credit 给信用，discredit 拆信誉。';
addScene(scenes,{id:'word-family-map',duration:15.8,narration:familyMapNarration,captions:narrationToCaptions(familyMapNarration,15.8),transitionOut:WHITE_FADE,layers:[
  text({id:'map-title',from:0.05,duration:14.55,enter:'smooth-rise',enterDuration:0.38,x:160,y:40,width:1600,fontSize:58,fontWeight:820,align:'center',runs:[{text:'同一个 cred，词尾和语境分方向',color:'primary'}]}),
  text({id:'family-row-1',from:0.7,duration:13.8,enter:'smooth-reveal',enterDuration:0.35,x:90,y:190,width:1300,fontSize:42,fontWeight:780,runs:[{text:'credible / credibility',color:'primary'},{text:'  →  ',color:'primary'},{text:'可信的 / 可信度',color:'accent'}]}),
  text({id:'family-row-2',from:2.45,duration:12.0,enter:'smooth-reveal',enterDuration:0.35,x:90,y:335,width:1300,fontSize:42,fontWeight:780,runs:[{text:'credulous / incredulous',color:'primary'},{text:'  →  ',color:'primary'},{text:'轻信的 / 表示怀疑',color:'accent'}]}),
  text({id:'family-row-3',from:4.3,duration:10.1,enter:'smooth-reveal',enterDuration:0.35,x:90,y:480,width:1300,fontSize:42,fontWeight:780,runs:[{text:'incredible / creditable',color:'primary'},{text:'  →  ',color:'primary'},{text:'难以置信 / 值得称赞',color:'accent'}]}),
  text({id:'family-row-4',from:6.1,duration:8.25,enter:'smooth-reveal',enterDuration:0.35,x:90,y:625,width:1300,fontSize:42,fontWeight:780,runs:[{text:'credit / discredit',color:'primary'},{text:'  →  ',color:'primary'},{text:'认可、信用 / 损害信誉',color:'accent'}]}),
  image({id:'map-trust',src:CRED_ASSETS.credible[2],from:0.15,duration:14.4,enter:'smooth-slide',enterDuration:0.35,x:1420,y:115,width:410,height:300,fit:'contain',contentScale:1.4}),
  image({id:'map-doubt',src:CRED_ASSETS.incredulous[2],from:2.35,duration:12.2,enter:'smooth-rise',enterDuration:0.3,x:1420,y:320,width:410,height:300,fit:'contain',contentScale:1.4}),
  image({id:'map-award',src:CRED_ASSETS.creditable[2],from:4.15,duration:10.4,enter:'smooth-rise',enterDuration:0.3,x:1420,y:525,width:410,height:300,fit:'contain',contentScale:1.4}),
]});
const examplesNarration='把词放进搭配里。credible evidence，是可信的证据。a credulous reader，是容易信谣言的读者。an incredulous look，是一脸“我不信”。a creditable recovery，是一次值得肯定的逆转。';
addScene(scenes,{id:'examples-in-context',duration:15.8,narration:examplesNarration,captions:narrationToCaptions(examplesNarration,15.8),sfx:[{at:0.18,name:'scribble',volume:0.1}],transitionOut:WHITE_FADE,layers:[
  text({id:'examples-title',from:0.05,duration:15.5,enter:'smooth-rise',enterDuration:0.38,x:190,y:35,width:1550,fontSize:60,fontWeight:820,align:'center',runs:[{text:'换成搭配，词义就落地了',color:'primary'}]}),
  text({id:'example-1',from:0.75,duration:14.75,enter:'smooth-reveal',enterDuration:0.34,x:100,y:160,width:1320,fontSize:35,fontWeight:740,runs:[{text:'The report contains ',color:'primary'},{text:'credible evidence.',color:'accent'},{text:'  报告包含可信的证据。',color:'primary'}]}),
  text({id:'example-2',from:3.45,duration:12.0,enter:'smooth-reveal',enterDuration:0.34,x:100,y:300,width:1320,fontSize:35,fontWeight:740,runs:[{text:'A ',color:'primary'},{text:'credulous',color:'accent'},{text:' reader forwarded the rumor.  一个轻信的读者转发了谣言。',color:'primary'}]}),
  text({id:'example-3',from:6.3,duration:9.1,enter:'smooth-reveal',enterDuration:0.34,x:100,y:440,width:1320,fontSize:35,fontWeight:740,runs:[{text:'Mina gave an ',color:'primary'},{text:'incredulous',color:'accent'},{text:' look.  米娜露出怀疑的神情。',color:'primary'}]}),
  text({id:'example-4',from:9.1,duration:6.25,enter:'smooth-reveal',enterDuration:0.34,x:100,y:580,width:1320,fontSize:35,fontWeight:740,runs:[{text:'Their team made a ',color:'primary'},{text:'creditable',color:'accent'},{text:' recovery.  队伍完成了值得肯定的反弹。',color:'primary'}]}),
  text({id:'examples-distinction',from:12.5,duration:2.85,enter:'smooth-reveal',enterDuration:0.34,x:100,y:740,width:1320,fontSize:31,fontWeight:740,align:'center',runs:[{text:'credible：可信  ·  creditable：值得称赞',color:'accent'}]}),
  image({id:'example-art-1',src:CRED_ASSETS.credible[2],from:0.3,duration:3.2,enter:'smooth-slide',enterDuration:0.3,x:1430,y:220,width:430,height:500,fit:'contain',contentScale:1.5}),
  image({id:'example-art-2',src:CRED_ASSETS.credulous[2],from:3.5,duration:3.1,enter:'smooth-rise',enterDuration:0.28,x:1430,y:220,width:430,height:500,fit:'contain',contentScale:1.5}),
  image({id:'example-art-3',src:CRED_ASSETS.incredulous[2],from:6.6,duration:3.1,enter:'smooth-rise',enterDuration:0.28,x:1430,y:220,width:430,height:500,fit:'contain',contentScale:1.5}),
  image({id:'example-art-4',src:CRED_ASSETS.creditable[2],from:9.7,duration:5.75,enter:'smooth-rise',enterDuration:0.28,x:1430,y:220,width:430,height:500,fit:'contain',contentScale:1.5}),
]});
const contrastNarration='做题时先看它修饰谁。evidence、source、explanation 这类信息，常跟 credible。reader、buyer、person 这类人，太容易相信就用 credulous。';
addScene(scenes,{id:'credible-vs-credulous',duration:12.6,narration:contrastNarration,captions:narrationToCaptions(contrastNarration,12.6),transitionOut:WHITE_FADE,layers:[
  text({id:'contrast-title',from:0.05,duration:12.3,enter:'smooth-rise',enterDuration:0.38,x:180,y:45,width:1550,fontSize:62,fontWeight:820,align:'center',runs:[{text:'credible 修饰信息，credulous 描写人',color:'primary'}]}),
  text({id:'contrast-left',from:0.7,duration:11.5,enter:'smooth-slide',enterDuration:0.38,x:95,y:225,width:800,fontSize:46,fontWeight:800,align:'center',runs:[{text:'credible evidence',color:'accent'},{text:'\n可信的证据',color:'primary'}]}),
  text({id:'contrast-right',from:1.2,duration:11.0,enter:'smooth-slide',enterDuration:0.38,x:1025,y:225,width:800,fontSize:46,fontWeight:800,align:'center',runs:[{text:'a credulous reader',color:'accent'},{text:'\n一个轻信的读者',color:'primary'}]}),
  image({id:'contrast-trusted',src:CRED_ASSETS.credible[2],from:1.5,duration:10.7,enter:'none',exit:'none',x:150,y:420,width:680,height:420,fit:'contain',contentScale:1.25}),
  image({id:'contrast-gullible',src:CRED_ASSETS.credulous[2],from:1.5,duration:10.7,enter:'none',exit:'none',x:1080,y:420,width:680,height:420,fit:'contain',contentScale:1.25}),
]});
const practiceNarration='三题快速判断。第一句有独立记录支持，report 可信，填 credible。第二句 shopper 什么都信，填 credulous。第三句 Mina 听到离谱价格后满脸怀疑，填 incredulous。';
addScene(scenes,{id:'practice',duration:15.7,narration:practiceNarration,captions:narrationToCaptions(practiceNarration,15.7),sfx:[{at:0.2,name:'pop',volume:0.1},{at:6.1,name:'stamp',volume:0.12}],transitionOut:WHITE_FADE,layers:[
  text({id:'practice-title',from:0.05,duration:15.4,enter:'smooth-rise',enterDuration:0.38,x:240,y:35,width:1450,fontSize:61,fontWeight:820,align:'center',runs:[{text:'小练习：看空格修饰谁',color:'primary'}]}),
  text({id:'practice-q1',from:0.65,duration:14.65,enter:'smooth-reveal',enterDuration:0.34,x:90,y:170,width:1710,fontSize:39,fontWeight:760,runs:[{text:'The report is supported by independent records, so it is ',color:'primary'},{text:'____.',color:'accent'}]}),
  text({id:'practice-q2',from:5.2,duration:10.05,enter:'smooth-reveal',enterDuration:0.34,x:90,y:330,width:1710,fontSize:39,fontWeight:760,runs:[{text:'A shopper believed every promise. The shopper was ',color:'primary'},{text:'____.',color:'accent'}]}),
  text({id:'practice-q3',from:10.0,duration:5.2,enter:'smooth-reveal',enterDuration:0.34,x:90,y:490,width:1710,fontSize:39,fontWeight:760,runs:[{text:'Mina looked ',color:'primary'},{text:'____',color:'accent'},{text:' after hearing an unbelievable price.',color:'primary'}]}),
  text({id:'practice-options',from:13.0,duration:2.2,enter:'smooth-slide',enterDuration:0.32,x:180,y:640,width:1220,fontSize:37,fontWeight:780,align:'center',runs:[{text:'答案依次：credible · credulous · incredulous',color:'accent'}]}),
  image({id:'practice-art-1',src:CRED_ASSETS.credible[2],from:0.35,duration:5.0,enter:'smooth-slide',enterDuration:0.3,x:1440,y:650,width:390,height:320,fit:'contain',contentScale:1.5}),
  image({id:'practice-art-2',src:CRED_ASSETS.credulous[2],from:5.35,duration:4.8,enter:'smooth-rise',enterDuration:0.28,x:1440,y:650,width:390,height:320,fit:'contain',contentScale:1.5}),
  image({id:'practice-art-3',src:CRED_ASSETS.incredulous[2],from:10.15,duration:5.15,enter:'smooth-rise',enterDuration:0.28,x:1440,y:650,width:390,height:320,fit:'contain',contentScale:1.5}),
]});
const answerNarration='这组三个词，落点很稳：信息有根据，用 credible；人太容易信，用 credulous；人听完表示怀疑，用 incredulous。做题先找它修饰的名词。';
addScene(scenes,{id:'practice-explanation',duration:11.8,narration:answerNarration,captions:narrationToCaptions(answerNarration,11.8),transitionOut:WHITE_FADE,layers:[
  text({id:'answer-title',from:0.05,duration:11.55,enter:'smooth-rise',enterDuration:0.38,x:200,y:50,width:1520,fontSize:60,fontWeight:820,align:'center',runs:[{text:'先判语境，再判词尾',color:'primary'}]}),
  text({id:'answer-credible',from:0.7,duration:10.75,enter:'smooth-reveal',enterDuration:0.34,x:125,y:210,width:940,fontSize:41,fontWeight:780,runs:[{text:'说法/证据 ',color:'primary'},{text:'→ credible',color:'accent'}]}),
  text({id:'answer-credulous',from:2.7,duration:8.75,enter:'smooth-reveal',enterDuration:0.34,x:125,y:355,width:940,fontSize:41,fontWeight:780,runs:[{text:'容易相信的人 ',color:'primary'},{text:'→ credulous',color:'accent'}]}),
  text({id:'answer-incredulous',from:4.7,duration:6.75,enter:'smooth-reveal',enterDuration:0.34,x:125,y:500,width:940,fontSize:41,fontWeight:780,runs:[{text:'不相信/表示怀疑 ',color:'primary'},{text:'→ incredulous',color:'accent'}]}),
  image({id:'answer-art-1',src:CRED_ASSETS.credible[2],from:0.25,duration:3.6,enter:'smooth-slide',enterDuration:0.3,x:1120,y:210,width:680,height:570,fit:'contain',contentScale:1.32}),
  image({id:'answer-art-2',src:CRED_ASSETS.credulous[2],from:3.85,duration:3.3,enter:'smooth-rise',enterDuration:0.28,x:1120,y:210,width:680,height:570,fit:'contain',contentScale:1.32}),
  image({id:'answer-art-3',src:CRED_ASSETS.incredulous[2],from:7.15,duration:4.35,enter:'smooth-rise',enterDuration:0.28,x:1120,y:210,width:680,height:570,fit:'contain',contentScale:1.32}),
]});
const summaryNarration='最后过一遍：credible 可信，credibility 可信度；credulous 轻信，incredulous 怀疑；incredible 惊人；credit 是认可或信用，creditable 值得称赞，discredit 损害信誉。看到 cred，先想到相信，再看词尾和它修饰谁。';
addScene(scenes,{id:'cred-summary',duration:18.5,narration:summaryNarration,captions:narrationToCaptions(summaryNarration,18.5),sfx:[{at:0.2,name:'pop',volume:0.1}],transitionOut:WHITE_FADE,layers:[
  text({id:'summary-root',from:0.05,duration:16.95,enter:'smooth-rise',enterDuration:0.38,x:70,y:45,width:740,fontSize:86,fontWeight:840,align:'center',runs:[{text:'CRED',color:'accent'}]}),
  text({id:'summary-meaning',from:0.75,duration:16.2,enter:'smooth-slide',enterDuration:0.34,x:80,y:170,width:720,fontSize:42,fontWeight:780,align:'center',runs:[{text:'BELIEVE · TRUST',color:'primary'}]}),
  table({id:'summary-rows',from:1.1,duration:15.8,enter:'smooth-reveal',enterDuration:0.38,x:75,y:275,width:930,height:590,rows:[
    {word:'credible',meaning:'可信的',accent:'orange'},
    {word:'credibility',meaning:'可信度'},
    {word:'credulous',meaning:'轻信的'},
    {word:'incredulous',meaning:'表示不相信的'},
    {word:'incredible',meaning:'难以置信；惊人'},
    {word:'credit',meaning:'认可；信用'},
    {word:'creditable',meaning:'值得称赞的'},
    {word:'discredit',meaning:'损害信誉'},
  ],rowFromStep:0.45,wordFontSize:28,meaningFontSize:27,wordColumnFraction:0.5,compact:true}),
  image({id:'summary-art-1',src:CRED_ASSETS.credible[2],from:0.2,duration:4.1,enter:'smooth-slide',enterDuration:0.3,x:1115,y:230,width:720,height:610,fit:'contain',contentScale:1.32}),
  image({id:'summary-art-2',src:CRED_ASSETS.incredulous[2],from:4.3,duration:4.0,enter:'smooth-rise',enterDuration:0.28,x:1115,y:230,width:720,height:610,fit:'contain',contentScale:1.32}),
  image({id:'summary-art-3',src:CRED_ASSETS.creditable[2],from:8.3,duration:4.0,enter:'smooth-rise',enterDuration:0.28,x:1115,y:230,width:720,height:610,fit:'contain',contentScale:1.32}),
  image({id:'summary-art-4',src:CRED_ASSETS.discredit[2],from:12.3,duration:6.0,enter:'smooth-rise',enterDuration:0.28,x:1115,y:230,width:720,height:610,fit:'contain',contentScale:1.32}),
]});

export const credStoryboard:ReplicaStoryboard={id:'cred',duration:scenes[scenes.length-1].start+scenes[scenes.length-1].duration,fadeToBlackSec:0.7,fadeEndOpacity:0.82,scenes};
