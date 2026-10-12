import {readFileSync,writeFileSync} from 'node:fs';
import {createRequire} from 'node:module';
const root='C:/Users/lenovo/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/';
const require=createRequire(import.meta.url);
const canvas=require(root+'@napi-rs/canvas');
Object.assign(globalThis,{DOMMatrix:canvas.DOMMatrix,ImageData:canvas.ImageData,Path2D:canvas.Path2D});
const pdfjs=await import('file:///'+root+'pdfjs-dist/legacy/build/pdf.mjs');
const base='work/experiments/cet4-writing-paragraph/';
const pdf=await pdfjs.getDocument({data:new Uint8Array(readFileSync(base+'worksheet.pdf')),useSystemFonts:true}).promise;
const pages=[];
for(let i=1;i<=pdf.numPages;i++){
  const page=await pdf.getPage(i),viewport=page.getViewport({scale:1.3});
  const surface=canvas.createCanvas(Math.ceil(viewport.width),Math.ceil(viewport.height));
  await page.render({canvasContext:surface.getContext('2d'),viewport}).promise;
  writeFileSync(base+`review/worksheet-${i}.png`,surface.toBuffer('image/png'));
  const text=(await page.getTextContent()).items.map(item=>item.str??'').join(' ');
  pages.push({page:i,text});
}
writeFileSync(base+'review/worksheet-pages.json',JSON.stringify(pages,null,2));
console.log('PDF pages:',pdf.numPages);
