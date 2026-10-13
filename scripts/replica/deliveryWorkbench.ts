import {existsSync, readdirSync, readFileSync, statSync} from 'node:fs';
import type {DashboardProject} from './projectDashboard';

const esc=(s:unknown)=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!));
const webPath=(value:string)=>value.split('/').map(encodeURIComponent).join('/');

type ExperimentEntry = {
  slug: string;
  title: string;
  description: string;
  directory: string;
  video?: string;
  page?: string;
  readme?: string;
  report?: string;
  preview?: string;
};

// work/ 是本机临时目录（不进 git）；这里只把本机试验收进默认折叠的档案，不在首屏冒充交付。

const fileIfExists=(directory:string, file:string)=>existsSync(`${directory}/${file}`)?file:undefined;

function scanExperiments(): ExperimentEntry[] {
  const root='work/experiments';
  if(!existsSync(root))return [];
  return readdirSync(root, {withFileTypes:true}).filter(entry=>entry.isDirectory()).flatMap(entry=>{
    const slug=entry.name;
    const directory=`${root}/${slug}`;
    const files=readdirSync(directory).filter(file=>{
      try{return statSync(`${directory}/${file}`).isFile();}catch{return false;}
    });
    const videos=files.filter(file=>file.toLowerCase().endsWith('.mp4')).sort();
    const page=fileIfExists(directory, 'compare.html') ?? fileIfExists(directory, 'index.html');
    const readme=fileIfExists(directory, 'README.md');
    const report=fileIfExists(directory, 'report.json') ?? fileIfExists(directory, 'render-report.json') ?? fileIfExists(directory, 'generation-plan.json');
    const preview=fileIfExists(directory, 'contact-sheet.png') ?? fileIfExists(directory, 'preview-sheet.jpg') ?? fileIfExists(directory, 'comparison.jpg') ?? fileIfExists(directory, 'cover-landscape.png') ?? fileIfExists(directory, '00_send_hook-alpha.png');
    if(!videos.length && !page && !readme && !report && !preview)return [];
    const video=files.includes(`${slug}.mp4`)?`${slug}.mp4`:videos[0];
    return [{
      slug,
      title:slug,
      description:'本机 work/experiments 中的试验材料（不进 git）。',
      directory,
      video, page, readme, report, preview,
    }];
  }).sort((a,b)=>a.slug.localeCompare(b.slug));
}

function buildExperimentWorkbench(): string {
  const entries=scanExperiments();
  if(!entries.length)return '';
  const renderCards=(group:ExperimentEntry[])=>group.map(entry=>{
    const href=(file:string)=>webPath(`${entry.directory}/${file}`);
    const actions=[
      entry.video?`<a href="${href(entry.video)}" target="_blank" rel="noopener">播放视频</a>`:'',
      entry.page?`<a href="${href(entry.page)}" target="_blank" rel="noopener">打开对比/播放页</a>`:'',
      entry.preview?`<a href="${href(entry.preview)}" target="_blank" rel="noopener">查看预览</a>`:'',
      entry.readme?`<a href="${href(entry.readme)}" target="_blank" rel="noopener">说明</a>`:'',
      entry.report?`<a href="${href(entry.report)}" target="_blank" rel="noopener">报告</a>`:'',
    ].filter(Boolean).join('');
    return `<article class="experiment-card"><div class="experiment-card-top"><span class="experiment-kind">${entry.video?'视频试片':'素材/接口试验'}</span><code>${esc(entry.slug)}</code></div><h3>${esc(entry.title)}</h3><p>${esc(entry.description)}</p><div class="experiment-links">${actions}</div><div class="experiment-path">${esc(entry.directory)}/</div></article>`;
  }).join('');
  const historical=entries.filter(entry=>Boolean(entry.video));
  const evidence=entries.filter(entry=>!entry.video);
  return `<details class="experiments experiment-archive" aria-label="历史与技术档案"><summary><span><span class="eyebrow">默认收起</span><strong>历史版本与技术档案</strong><small>旧试片、绘图证据和接口测试；日常发布不需要进入</small></span><span class="experiment-count">${entries.length} 个入口</span></summary>${historical.length?`<div class="experiment-group"><h3>可播放的历史版本</h3><div class="experiment-grid">${renderCards(historical)}</div></div>`:''}${evidence.length?`<div class="experiment-group"><h3>素材与技术证据</h3><div class="experiment-grid">${renderCards(evidence)}</div></div>`:''}</details>`;
}

export const readyPublishCopy=(source:string)=>{
  const section=(heading:string)=>source.match(new RegExp('^## '+heading+'\\s*\\n([\\s\\S]*?)(?=^## |$(?![\\s\\S]))','m'))?.[1]?.trim();
  const title=section('推荐标题'),body=section('可直接发布');
  if(title&&body)return `${title}\n\n${body}`;
  return source.replace(/^# /,'').trim();
};
export function buildDeliveryWorkbench(projects:readonly DashboardProject[]){
  const history=JSON.parse(readFileSync('planning/topic-history.json','utf8')) as {topics:Array<{id:string;title:string;artifacts:string[];versions:Array<{id:string;directory?:string;artifacts?:string[]}>}>};
  const additional=history.topics.filter(t=>!projects.some(p=>p.slug===t.id)).flatMap(t=>{
    const versions=[...t.versions].reverse();
    const candidates=[...versions.flatMap(v=>v.artifacts??(v.directory?[`${v.directory}/${t.id}.mp4`]:[])),...t.artifacts];
    const video=candidates.find(a=>a.startsWith('outputs/')&&a.endsWith('.mp4')&&existsSync(a));
    if(!video)return [];
    return [{id:video.split('/').pop()!.replace(/\.mp4$/,''),title:t.title+' · 最新版',dir:video.slice(0,video.lastIndexOf('/'))}];
  }).reverse();
  const registered=projects.map(p=>({id:p.slug,title:p.title,dir:p.directory}));
  const candidates=[...registered,...additional].filter(p=>existsSync(`${p.dir}/${p.id}.mp4`));
  const latest=[...candidates].sort((a,b)=>statSync(`${b.dir}/${b.id}.mp4`).mtimeMs-statSync(`${a.dir}/${a.id}.mp4`).mtimeMs)[0];
  const featured=latest?[{...latest,title:`${latest.title.replace(/ · 最新版$/, '')}（当前交付）`}]:[];
  const entries=[...featured,...candidates.filter(p=>p.id!==latest?.id),...registered.filter(p=>!candidates.some(c=>c.id===p.id))];
  const data=entries.map(p=>({...p,copy:existsSync(`${p.dir}/publish-copy.md`)?readyPublishCopy(readFileSync(`${p.dir}/publish-copy.md`,'utf8')):'本期暂无发布文案。',files:Object.fromEntries([`${p.id}.mp4`,'cover.png','cover-landscape.png','worksheet.pdf','index.html',`vertical/${p.id}-vertical.mp4`,`vertical/${p.id}-teaser.mp4`,'vertical/review-card.png'].map(f=>[f,existsSync(`${p.dir}/${f}`)]))}));
  const json=JSON.stringify(data).replace(/</g,'\\u003c');
  return `<style>
  #delivery{margin:28px 0;background:#fff;border:1px solid #dbe3ed;border-radius:18px;padding:28px}#delivery h2{font-size:28px;margin:8px 0}#delivery p{font-size:14px;line-height:1.8;color:#637387}.delivery-layout{display:grid;grid-template-columns:1.3fr 1fr;gap:26px;margin-top:20px}.delivery-layout video{aspect-ratio:16/9;border-radius:12px;background:#edf2f8}.delivery-choice{width:100%;padding:14px;border:1px solid #ced9e9;border-radius:10px;margin:12px 0;font:inherit}.delivery-files{display:flex;gap:10px;flex-wrap:wrap;margin:14px 0}.delivery-files a,#copy-caption{display:inline-block;padding:11px 15px;background:#153ca0;border:0;border-radius:8px;color:#fff;font:inherit;font-size:13px;cursor:pointer}#delivery textarea{width:100%;min-height:235px;resize:vertical;padding:16px;border:1px solid #d6deeb;border-radius:10px;font:14px/1.8 'Microsoft YaHei',sans-serif;color:#243e61}.delivery-covers{display:flex;gap:15px}.delivery-covers img{height:145px;max-width:48%;object-fit:contain;background:#f4f7fb;border:1px solid #e4eaf2;border-radius:8px}.delivery-path{overflow-wrap:anywhere;font-size:12px!important}.publish-sites{display:flex;gap:20px;flex-wrap:wrap;margin-top:12px}.publish-sites a{font-size:14px}#delivery-status{font-size:12px;color:#536880}#delivery h3{font-size:17px;margin:12px 0}.delivery-help{padding:15px 20px;border-radius:10px;background:#f4f7fc;margin-top:22px}@media(max-width:850px){.delivery-layout{grid-template-columns:1fr}#delivery{padding:18px}}
  #delivery{margin:28px 0;background:#fff;border:1px solid #dbe3ed;border-radius:18px;padding:28px}#delivery h2{font-size:28px;margin:8px 0}#delivery p{font-size:14px;line-height:1.8;color:#637387}.delivery-layout{display:grid;grid-template-columns:1.3fr 1fr;gap:26px;margin-top:20px}.delivery-layout video{aspect-ratio:16/9;border-radius:12px;background:#edf2f8}.delivery-choice{width:100%;padding:14px;border:1px solid #ced9e9;border-radius:10px;margin:12px 0;font:inherit}.delivery-files{display:flex;gap:10px;flex-wrap:wrap;margin:14px 0}.delivery-files a,#copy-caption{display:inline-block;padding:11px 15px;background:#153ca0;border:0;border-radius:8px;color:#fff;font:inherit;font-size:13px;cursor:pointer}#delivery textarea{width:100%;min-height:235px;resize:vertical;padding:16px;border:1px solid #d6deeb;border-radius:10px;font:14px/1.8 'Microsoft YaHei',sans-serif;color:#243e61}.delivery-covers{display:flex;gap:15px}.delivery-covers img{height:145px;max-width:48%;object-fit:contain;background:#f4f7fb;border:1px solid #e4eaf2;border-radius:8px}.delivery-path{overflow-wrap:anywhere;font-size:12px!important}.publish-sites{display:flex;gap:20px;flex-wrap:wrap;margin-top:12px}.publish-sites a{font-size:14px}#delivery-status{font-size:12px;color:#536880}#delivery h3{font-size:17px;margin:12px 0}.delivery-help{padding:15px 20px;border-radius:10px;background:#f4f7fc;margin-top:22px}.experiments{margin:28px 0;padding:0;background:#fff;border:1px solid #dbe3ed;border-radius:18px}.experiment-archive summary{display:flex;justify-content:space-between;align-items:center;gap:20px;padding:22px 28px;cursor:pointer;list-style:none}.experiment-archive summary::-webkit-details-marker{display:none}.experiment-archive summary strong{display:block;font-size:19px;color:#19365b;margin-top:5px}.experiment-archive summary small{display:block;color:#718198;margin-top:5px}.experiment-archive[open] summary{border-bottom:1px solid #e4eaf2}.experiment-group{padding:8px 28px 24px}.experiment-group>h3{font-size:16px;color:#415a77;margin:16px 0 0}.experiment-count{font-size:12px;color:#637387;white-space:nowrap}.experiment-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px;margin-top:16px}.experiment-card{border:1px solid #e0e6ef;border-radius:12px;padding:17px;background:#fbfcfe}.experiment-card-top{display:flex;justify-content:space-between;gap:10px;color:#718198;font-size:11px}.experiment-kind{color:#ba5619}.experiment-card h3{font-size:16px;line-height:1.45;margin:13px 0 7px;color:#19365b}.experiment-card p{font-size:12px;line-height:1.8;color:#637387;min-height:43px;margin:0 0 12px}.experiment-links{display:flex;flex-wrap:wrap;gap:8px}.experiment-links a{padding:7px 9px;border-radius:6px;background:#edf2fa;font-size:11px}.experiment-path{font-size:10px;color:#8c98a7;overflow-wrap:anywhere;margin-top:12px}@media(max-width:850px){.delivery-layout{grid-template-columns:1fr}.experiment-grid{grid-template-columns:1fr 1fr}.experiment-archive summary{align-items:flex-start}.experiment-count{display:block;margin-top:8px}}@media(max-width:470px){#delivery{padding:18px}.experiment-grid{grid-template-columns:1fr}.experiment-archive summary,.experiment-group{padding-left:18px;padding-right:18px}}
  </style><section id="delivery" aria-label="视频发布材料"><div class="eyebrow">从这里开始</div><h2>拿到成片，准备发布</h2><p>选一期 → 保存视频和封面 → 复制文案 → 去平台上传。无需寻找程序文件。</p>
  <label for="delivery-select">选择作品</label><select class="delivery-choice" id="delivery-select">${entries.map((p,i)=>`<option value="${i}">${esc(p.title)}</option>`).join('')}</select>
  <div class="delivery-layout"><div><h3>1. 播放 / 保存成片原文件</h3><video id="delivery-video" controls preload="metadata"></video><div id="delivery-video-links" class="delivery-files"></div><p class="delivery-path" id="delivery-path"></p><h3>2. 取两种封面</h3><div class="delivery-covers" id="delivery-covers"></div><div class="delivery-files" id="delivery-cover-links"></div></div>
  <div><h3>3. 复制标题、正文与话题</h3><textarea id="delivery-copy" readonly aria-label="发布文案"></textarea><div class="delivery-files"><button id="copy-caption">复制全部文案</button><span id="delivery-copy-link"></span></div><p role="status" id="delivery-status">发布前先完整看一遍，确认内容和封面。</p><h3>4. 进入平台投稿</h3><div class="publish-sites"><a href="https://creator.douyin.com/" target="_blank" rel="noopener">抖音创作者中心 ↗</a><a href="https://creator.xiaohongshu.com/" target="_blank" rel="noopener">小红书创作服务 ↗</a><a href="https://member.bilibili.com/platform/upload/video/frame" target="_blank" rel="noopener">B站投稿 ↗</a></div><p>登录自己的账号，上传 MP4、设置封面，再粘贴文案。本工作台提供材料与入口，发布由你在平台完成。</p><div id="delivery-extras" class="delivery-files"></div></div></div>
  <div class="delivery-help"><strong>文件夹只需要记住两个位置</strong><p><b>outputs</b>：每期交付的视频、封面和文案。<br><b>vertical / xiaohongshu</b>：每期交付目录里的抖音竖屏与小红书图文。src / scripts / public 是制作程序与素材，work 只放临时文件，日常发布不用进入。</p></div></section>${buildExperimentWorkbench()}
  <script>(()=>{const items=${json},q=s=>document.querySelector(s);const link=(container,path,label,download=false)=>{const a=document.createElement('a');a.href=path.split('/').map(encodeURIComponent).join('/');a.textContent=label;if(download)a.download=path.split('/').pop();else{a.target='_blank';a.rel='noopener'}q(container).append(a)};
  function render(){const p=items[Number(q('#delivery-select').value)];if(!p)return;for(const id of ['#delivery-video-links','#delivery-cover-links','#delivery-copy-link','#delivery-extras','#delivery-covers'])q(id).replaceChildren();const v=q('#delivery-video');v.pause();if(p.files[p.id+'.mp4']){v.src=p.dir+'/'+p.id+'.mp4';link('#delivery-video-links',v.getAttribute('src'),'保存 MP4 原文件',true);link('#delivery-video-links',v.getAttribute('src'),'单独打开视频')}else v.removeAttribute('src');v.poster=p.dir+'/cover-landscape.png';v.load();q('#delivery-path').textContent='文件位置：'+p.dir+'/';q('#delivery-copy').value=p.copy;link('#delivery-copy-link',p.dir+'/publish-copy.md','文案文件');for(const [file,label] of [['cover.png','竖封面'],['cover-landscape.png','横封面']]){if(!p.files[file])continue;const image=document.createElement('img');image.src=p.dir+'/'+file;image.alt=label;q('#delivery-covers').append(image);link('#delivery-cover-links',p.dir+'/'+file,'保存'+label,true)}if(p.files['vertical/'+p.id+'-vertical.mp4'])link('#delivery-video-links',p.dir+'/vertical/'+p.id+'-vertical.mp4','抖音竖屏完整版（主推）',true);if(p.files['vertical/'+p.id+'-teaser.mp4'])link('#delivery-video-links',p.dir+'/vertical/'+p.id+'-teaser.mp4','竖屏预告短片',true);if(p.files['vertical/review-card.png'])link('#delivery-extras',p.dir+'/vertical/review-card.png','复习卡图片',true);if(p.files['worksheet.pdf'])link('#delivery-extras',p.dir+'/worksheet.pdf','配套练习 PDF',true);if(p.files['index.html'])link('#delivery-extras',p.dir+'/index.html','章节播放与资料');q('#delivery-status').textContent='已切换材料；发布前完整试看，文件成套不代表内容已经审核。'}
  q('#delivery-select').onchange=render;q('#copy-caption').onclick=async()=>{const t=q('#delivery-copy');try{if(!navigator.clipboard)throw Error();await navigator.clipboard.writeText(t.value);q('#delivery-status').textContent='文案已复制，可以粘贴到投稿页面。'}catch{t.focus();t.select();q('#delivery-status').textContent='文案已选中，请按 Ctrl+C 复制。'}};render();})();</script>`;
}
