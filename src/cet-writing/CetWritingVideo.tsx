import React from 'react';
import {AbsoluteFill, Audio, Img, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {smoothProgress} from '../replica/smoothMotion';
import {REPLICA_THEME, SOFT_BLUE, SOFT_ORANGE, paperStyle} from '../replica/theme';
import {sentences as s, WRITER_ART, type WritingTimeline, type WritingPanel} from './lesson';
import timelineJson from './timeline.json';

export const writingTimeline = timelineJson as WritingTimeline;
// 全栏目统一纸面配色（见 src/replica/theme.ts）。
const C={blue:REPLICA_THEME.primary,orange:REPLICA_THEME.accent,ink:'#142544',muted:'#697590',line:'#DEE4F0',paper:SOFT_BLUE};
const family='"Microsoft YaHei", "微软雅黑", Arial, sans-serif';
const english='Arial, "Microsoft YaHei", sans-serif';
const box=(left:number,top:number,width:number):React.CSSProperties=>({position:'absolute',left,top,width});

const Reveal:React.FC<{frame:number;delay?:number;anchor?:boolean;children:React.ReactNode;style?:React.CSSProperties}>=({frame,delay=0,anchor=false,children,style})=>{
  const p=smoothProgress(frame,delay,16);
  return <div style={{...style,opacity:anchor?1:p,transform:`translateY(${16*(1-p)}px)`}}>{children}</div>;
};
const Em=({children}:{children:React.ReactNode})=><span style={{color:C.orange,boxShadow:'inset 0 -9px #FFF0E4'}}>{children}</span>;
const Big=({children,size=62}:{children:React.ReactNode;size?:number})=><div style={{fontFamily:english,fontSize:size,fontWeight:700,lineHeight:1.48,color:C.ink}}>{children}</div>;
const Chip=({children}:{children:React.ReactNode})=><span style={{display:'inline-block',padding:'10px 20px',borderRadius:10,color:C.orange,background:SOFT_ORANGE,fontSize:27,fontWeight:700}}>{children}</span>;

const Margin=({frame,panel}:{frame:number;note:string;panel:WritingPanel})=> ['weak','claim','reason','example','answer'].includes(panel)?<Reveal frame={frame} delay={10} style={box(1450,430,360)}><Img src={staticFile(WRITER_ART)} style={{width:360,height:300,objectFit:'contain'}}/></Reveal>:null;

const Body=({panel,frame,note,countdown}:{panel:WritingPanel;frame:number;note:string;countdown:number})=>{
  if(['exam','trap','transfer','check'].includes(panel)){
    const content:Record<string,{title:string;lines:string[];hint:string}>={
      exam:{title:'先看题目要你做什么',lines:['解释好处 → 具体好处 + 作用过程 + 例子','提出建议 → 具体建议 + 理由 + 做法'],hint:'先回应任务，再展开内容。'},
      trap:{title:'别把“换词”当成“解释”',lines:['Reading is important. Reading is beneficial.','阅读 → 观察作者组织观点 → 学会论证'],hint:'追问：读的过程中，究竟学到了什么？'},
      transfer:{title:'运动减压：把例子写具体',lines:['为作业感到焦虑时','在校园散步十分钟，再回来继续写'],hint:'场景 + 行动，支持“运动帮助管理压力”。'},
      check:{title:'写完，问自己三个问题',lines:['好处具体吗？','原因解释了过程吗？','例子支持同一个观点吗？'],hint:'三句是练习骨架；实际写作要服从题目和字数要求。'},
    };
    const item=content[panel];
    return <Reveal frame={frame} style={box(110,220,1660)}><div style={{fontSize:76,fontWeight:800,color:C.blue}}>{item.title}</div><div style={{marginTop:65}}>{item.lines.map((line,i)=><Reveal key={line} frame={frame} delay={12+i*12}><div style={{fontSize:panel==='trap'?45:49,lineHeight:1.7,padding:'18px 28px',marginBottom:18,background:C.paper,borderRadius:16,color:panel==='trap'&&i===0?C.muted:C.ink}}>{line}</div></Reveal>)}</div><Reveal frame={frame} delay={42}><div style={{fontSize:34,color:C.orange,marginTop:40}}>{item.hint}</div></Reveal></Reveal>;
  }
  if(panel==='hook')return <>
    <div style={{...box(110,210,1270),fontSize:98,lineHeight:1.34,fontWeight:850,color:C.blue}}>四级作文<br/>只会写 <span style={{color:C.orange}}>very important?</span></div>
    <Reveal frame={frame} delay={14} style={box(115,560,1190)}><div style={{fontSize:45,color:C.muted}}>一句“很重要”，怎么往下写？</div></Reveal>
    <Reveal frame={frame} delay={30} style={box(115,695,1260)}><div style={{fontSize:59,fontWeight:800,color:C.blue}}>观点 <span style={{color:C.orange}}>→</span> 原因 <span style={{color:C.orange}}>→</span> 例子</div></Reveal>
    <Img src={staticFile(WRITER_ART)} style={{...box(1280,360,570),height:480,objectFit:'contain'}}/>
  </>;
  if(panel==='task')return <Reveal anchor frame={frame} style={box(110,230,1680)}>
    <Chip>原创模拟题 · 主体段训练</Chip>
    <div style={{fontSize:78,fontWeight:800,lineHeight:1.4,marginTop:35,color:C.blue}}>大学生为什么应该经常阅读？</div>
    <div style={{fontFamily:english,fontSize:49,marginTop:26,color:C.muted}}>Why should college students read regularly?</div>
    <div style={{display:'flex',gap:24,marginTop:80,alignItems:'center'}}><div style={{fontSize:40}}>本期只解决一个问题：</div><div style={{fontSize:49,fontWeight:800,color:C.orange}}>写出“阅读有益”的理由。</div></div>
    <div style={{fontSize:29,color:C.muted,marginTop:35}}>先练好一段论证，再组织整篇文章。</div>
  </Reveal>;
  if(panel==='weak'||panel==='claim')return <>
    <div style={{...box(110,220,1260),fontSize:29,color:C.muted}}>先看这句常见开头</div>
    <div style={{...box(110,282,1260),fontFamily:english,fontSize:panel==='weak'?78:78-31*smoothProgress(frame,0,18),color:panel==='weak'?C.ink:C.muted,fontWeight:700}}>{s.weak}
      <div style={{position:'absolute',left:0,top:'54%',width:panel==='weak'?0:570,height:3,background:C.orange,transform:`scaleX(${smoothProgress(frame,3,18)})`,transformOrigin:'left'}}/>
    </div>
    {panel==='weak'?<Reveal frame={frame} delay={18} style={box(110,490,1230)}><div style={{fontSize:66,fontWeight:800,color:C.orange}}>重要在哪里？对谁有用？</div><div style={{fontSize:38,color:C.muted,marginTop:34}}>缺少的是具体信息，不是高级词汇。</div></Reveal>:<Reveal frame={frame} delay={8} style={box(110,410,1260)}><Chip>观点写具体</Chip><div style={{marginTop:28}}><Big>Reading regularly can help <Em>college students</Em> become <Em>better writers.</Em></Big></div><div style={{fontSize:32,color:C.muted,marginTop:30}}>经常阅读 → 大学生 → 提升写作</div></Reveal>}
    <Margin frame={frame} note={note} panel={panel}/>
  </>;
  if(panel==='reason')return <>
    <Reveal anchor frame={frame} style={box(110,218,1260)}><div style={{fontSize:28,color:C.muted}}>前一句：阅读可以帮助大学生提升写作。</div><div style={{fontSize:69,fontWeight:800,color:C.blue,marginTop:30}}>为什么能帮助写作？</div></Reveal>
    <Reveal frame={frame} delay={6} style={box(110,407,1260)}><Big><Em>By studying how authors organise ideas,</Em> students can learn to build clearer arguments.</Big></Reveal>
    <Reveal frame={frame} delay={20} style={box(110,740,1260)}><div style={{fontSize:37,padding:'22px 26px',background:C.paper,borderRadius:12,color:C.blue}}>By doing ... <span style={{color:C.orange}}>→</span> ... can ... <span style={{fontSize:28,color:C.muted}}>　方式 → 结果</span></div></Reveal>
    <Margin frame={frame} note={note} panel={panel}/>
  </>;
  if(panel==='example')return <>
    <Reveal anchor frame={frame} style={box(110,210,1260)}><Chip>例子落到行动</Chip><div style={{fontSize:66,fontWeight:800,marginTop:20,color:C.blue}}>读完之后，具体做什么？</div></Reveal>
    <Reveal frame={frame} delay={8} style={box(110,395,1260)}><Big size={56}><Em>For example,</Em> after reading a well-structured article, they can practise using <Em>a topic sentence and supporting details</Em> in their own essays.</Big></Reveal>
    <Margin frame={frame} note={note} panel={panel}/>
  </>;
  if(panel==='paragraph')return <Reveal anchor frame={frame} style={box(110,205,1680)}>
    <div style={{fontSize:61,fontWeight:800,color:C.blue,marginBottom:30}}>三句，连成一段有依据的论证。</div>
    {[['01 观点',s.claim],['02 原因',s.reason],['03 例子',s.example]].map(([label,text],i)=><div key={label} style={{display:'flex',gap:28,padding:'25px 0',borderTop:`1px solid ${C.line}`,opacity:smoothProgress(frame,i*4,15)}}><span style={{fontSize:26,minWidth:125,fontWeight:800,color:C.orange,paddingTop:10}}>{label}</span><div style={{fontFamily:english,fontSize:43,lineHeight:1.45,fontWeight:600,color:C.ink}}>{text}</div></div>)}
    <div style={{fontSize:27,color:C.muted,marginTop:16}}>主体段示例 · 不是完整范文 · 结构可迁移，内容要贴题</div>
  </Reveal>;
  if(panel==='practice'||panel==='answer')return <>
    <Reveal anchor frame={frame} style={box(110,210,1280)}><Chip>{panel==='practice'?'轮到你了 / 补一句原因':'一种参考写法 / 答案不唯一'}</Chip><div style={{marginTop:30,fontFamily:english,fontSize:panel==='practice'?59:59-22*smoothProgress(frame,0,18),fontWeight:700,lineHeight:1.5,color:panel==='practice'?C.ink:C.muted}}>{s.practice}</div></Reveal>
    <Reveal frame={frame} delay={8} style={box(110,465,1260)}>{panel==='practice'?<><div style={{fontFamily:english,fontSize:59,color:C.orange,fontWeight:700,lineHeight:1.65}}>By ____________,<br/>they can ____________.</div><div style={{fontSize:33,color:C.muted,marginTop:25}}>填具体方式，再填合理结果。</div></>:<><Big size={59}><Em>By taking a short walk after class,</Em> they can relax and concentrate better on their studies.</Big><div style={{fontSize:30,color:C.muted,marginTop:25}}>方式：课后散步　→　结果：放松、更专注</div></>}</Reveal>
    <Margin frame={frame} note={note} panel={panel}/>
    {countdown>0&&<div style={{...box(1530,680,200),fontSize:86,fontWeight:800,color:C.orange,textAlign:'center'}}>{countdown}</div>}
  </>;
  return <>
    <div style={{...box(110,220,1500),fontSize:81,fontWeight:850,color:C.blue}}>把下一段，写出来。</div>
    <Reveal frame={frame} delay={8} style={box(115,405,1180)}>{[['观点','写具体'],['原因','讲过程'],['例子','有行动']].map(([a,b],i)=><div key={a} style={{display:'flex',gap:34,alignItems:'baseline',marginBottom:35,fontSize:58,fontWeight:800,opacity:smoothProgress(frame,i*5,16)}}><span style={{color:C.orange}}>0{i+1}</span><span>{a}</span><span style={{fontSize:41,color:C.muted}}>{b}</span></div>)}</Reveal>
    <Img src={staticFile(WRITER_ART)} style={{...box(1180,355,650),height:490,objectFit:'contain'}}/>
    <div style={{...box(115,830,1500),fontSize:30,color:C.muted}}>练习：以“运动减压”为观点，再补一个具体例子。</div>
  </>;
};

export const CetWritingVideo:React.FC=()=>{
  const frame=useCurrentFrame();
  const cues=writingTimeline.cues;
  const index=Math.max(0,cues.findIndex(c=>frame>=c.from&&frame<c.from+c.frames));
  const cue=cues[index]; let first=index;
  while(first>0&&cues[first-1].panel===cue.panel)first--;
  const panelFrame=frame-cues[first].from;
  let last=index; while(last+1<cues.length&&cues[last+1].panel===cue.panel)last++;
  const panelEnd=cues[last].from+cues[last].frames;
  const enter=smoothProgress(panelFrame,0,12),leave=smoothProgress(frame,panelEnd-10,9);
  const countdown=cue.pauseAfter&&frame>=cue.from+cue.audioFrames?Math.max(0,Math.ceil((cue.from+cue.frames-frame)/30)):0;
  return <AbsoluteFill style={{...paperStyle(),fontFamily:family,color:C.ink,overflow:'hidden'}}>
    <div style={{...box(100,56,900),display:'flex',gap:22,alignItems:'center',fontSize:27,fontWeight:800}}><span style={{background:C.blue,color:'white',padding:'10px 16px',borderRadius:11}}>小黑英语</span><span style={{color:C.blue}}>四级写作 · 把观点展开</span></div>
    <div style={{...box(110,147,1700),height:2,background:C.line}}><div style={{height:3,width:`${frame/(writingTimeline.totalFrames-1)*100}%`,background:C.orange}}/></div>
    <AbsoluteFill style={{opacity:enter*(1-leave),transform:`translateY(${12*(1-enter)-8*leave}px)`}}><Body panel={cue.panel} frame={panelFrame} note={cue.note} countdown={countdown}/></AbsoluteFill>
    <div style={{position:'absolute',bottom:48,left:110,width:1700,fontSize:33,lineHeight:1.45,textAlign:'center',color:C.blue,opacity:0.25+0.75*smoothProgress(frame,cue.from,5)}}>{cue.caption}</div>
    <Audio src={staticFile('assets/music/root-word-series-bgm.mp3')} loop volume={f=>0.045*Math.min(smoothProgress(f,0,30),1-smoothProgress(f,writingTimeline.totalFrames-45,44))}/>
    {cues.map(c=><Sequence key={c.id} from={c.from} durationInFrames={c.audioFrames}><Audio src={staticFile(c.src)} volume={0.72}/></Sequence>)}
  </AbsoluteFill>;
};

export const CetWritingCover:React.FC<{landscape?:boolean}>=({landscape=false})=>{
  const w=landscape?1200:1080;
  return <AbsoluteFill style={{...paperStyle(),fontFamily:family,color:C.blue,padding:landscape?'64px 70px':'96px 80px'}}>
    <div style={{fontSize:landscape?28:38,fontWeight:800,letterSpacing:2}}>小黑英语 / 四级写作</div>
    <div style={{marginTop:landscape?65:100,fontSize:landscape?84:105,fontWeight:850,lineHeight:1.28}}>只会写<br/><span style={{fontFamily:english,color:C.orange,fontSize:landscape?81:96}}>very important?</span></div>
    <div style={{fontSize:landscape?38:47,fontWeight:800,marginTop:landscape?40:65}}>观点 → 原因 → 例子</div>
    <Img src={staticFile(WRITER_ART)} style={{position:'absolute',left:landscape?620:110,top:landscape?410:780,width:landscape?530:850,height:landscape?400:700,objectFit:'contain'}}/>
    <div style={{position:'absolute',left:landscape?70:80,bottom:landscape?60:95,width:w-160,fontSize:landscape?26:35,color:C.muted}}>从一句空话，到一段论证</div>
  </AbsoluteFill>;
};
