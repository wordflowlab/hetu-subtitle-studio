import {requireValue as need} from '../../vendor/project-store.ts';
import {fileBytes} from './artifact.ts';
export type Subtitle={start_ms:number;end_ms:number;text:string;speaker:string};
export function timestamp(text:string,ass=false){
 const match=ass?/^(\d{1,2}):(\d{2}):(\d{2})\.(\d{2})$/.exec(text):/^(?:(\d{2,}):)?(\d{2}):(\d{2})[.,](\d{3})$/.exec(text);
 need(match,'时间戳格式无效：'+text);const h=Number(match[1]??0),m=Number(match[2]),s=Number(match[3]),fraction=Number(match[4])*(ass?10:1);need(m<60&&s<60,'时间戳分秒超出范围。');const value=((h*60+m)*60+s)*1000+fraction;need(Number.isSafeInteger(value)&&value<=86400000,'时间戳超过24小时预算。');return value;
}
export function formatTime(ms:number,format:string){need(Number.isInteger(ms)&&ms>=0&&ms<=86400000,'时间戳必须为预算内整数毫秒。');const h=Math.floor(ms/3600000),m=Math.floor(ms/60000)%60,s=Math.floor(ms/1000)%60,pad=(v:number,n=2)=>String(v).padStart(n,'0');return format==='ass'?`${h}:${pad(m)}:${pad(s)}.${pad(Math.floor(ms%1000/10))}`:`${pad(h)}:${pad(m)}:${pad(s)}${format==='srt'?',':'.'}${pad(ms%1000,3)}`;}
export function parseSubtitles(file:any,format:string){
 const bytes=fileBytes(file),text=new TextDecoder('utf-8',{fatal:true}).decode(bytes).replace(/^\uFEFF/,'').replace(/\r\n?/g,'\n');need(!text.includes('\u0000'),'字幕不能包含空字节。');
 const cues:Subtitle[]=[],losses=new Set<string>();
 if(format==='ass'){
  losses.add('ASS样式、特效、定位及覆盖标记转换为纯文本，不保留原排版。');let events=false,fields:string[]=[];
  for(const line of text.split('\n')){
   if(/^\[/.test(line)){events=line.trim().toLowerCase()==='[events]';continue;}
   if(!events)continue;
   if(/^Format:/i.test(line)){fields=line.slice(line.indexOf(':')+1).split(',').map(x=>x.trim().toLowerCase());need(fields.at(-1)==='text'&&['start','end'].every(k=>fields.includes(k)),'ASS事件字段缺少时间或Text末项。');continue;}
   if(!/^Dialogue:/i.test(line))continue;
   need(fields.length>0,'ASS缺少事件Format。');const values=line.slice(line.indexOf(':')+1).trimStart().split(',');need(values.length>=fields.length,'ASS事件字段不足。');const at=fields.length-1;values[at]=values.slice(at).join(',');
   const get=(name:string)=>values[fields.indexOf(name)]??'';cues.push({start_ms:timestamp(get('start'),true),end_ms:timestamp(get('end'),true),text:get('text').replace(/\{[^}]*\}/g,'').replace(/\\[Nn]/g,'\n').replace(/\\h/g,'\u00a0'),speaker:get('name')});
  }
 }else{
  need(format==='srt'||format==='vtt','未知字幕格式。');if(format==='vtt')need(/^WEBVTT(?:[ \t].*)?(?:\n|$)/.test(text),'缺少WEBVTT文件头。');
  const body=format==='vtt'?text.replace(/^WEBVTT[^\n]*(?:\n|$)/,''):text;
  for(const block of body.split(/\n[ \t]*\n/).filter(v=>v.trim())){
   const lines=block.replace(/^\n+|\n+$/g,'').split('\n');if(format==='vtt'&&/^(NOTE|STYLE|REGION)(?:\s|$)/.test(lines[0])){losses.add('WebVTT注释、样式和区域配置未导入。');continue;}
   const at=lines.findIndex(line=>line.includes('-->'));need(at===0||at===1,'字幕条目缺少明确时间行。');const match=/^\s*(\S+)\s+-->\s+(\S+)(.*)$/.exec(lines[at]);need(match,'字幕时间行无效。');if(match[3].trim())losses.add('WebVTT／SRT时间行的定位或附加设置未导入。');
   let content=lines.slice(at+1).join('\n');if(/<[^>]*>/.test(content))losses.add('文本标记以原文保留；预览按文本显示，不执行HTML。');if(format==='vtt')content=content.replace(/&(amp|lt|gt|nbsp|lrm|rlm);/g,(_all,key)=>({amp:'&',lt:'<',gt:'>',nbsp:'\u00a0',lrm:'\u200e',rlm:'\u200f'} as any)[key]);cues.push({start_ms:timestamp(match[1]),end_ms:timestamp(match[2]),text:content,speaker:''});
  }
 }
 need(cues.length>0&&cues.length<=1000,'字幕为空或超过1000条预算。');for(const cue of cues)need(cue.start_ms<cue.end_ms&&cue.text.trim().length>0,'字幕时间倒置或内容为空。');
 return {format,filename:file.filename,file_sha256:file.sha256,cues,losses:[...losses],imported:false};
}
export function encodeSubtitles(cues:Subtitle[],format:string){
 const ordered=[...cues].sort((a,b)=>a.start_ms-b.start_ms||a.end_ms-b.end_ms),losses=new Set<string>();
 const plain=(text:string)=>{need(!text.includes('\u0000'),'字幕不能包含空字节。');return text.replace(/\r\n?/g,'\n');};
 if(format==='ass'){
  const rows=ordered.map(c=>{if(/[\\{}]/.test(c.text))losses.add('ASS控制符以全角字符表示，避免被解释为排版或绘图命令。');if(c.start_ms%10||c.end_ms%10)losses.add('ASS百分之一秒精度：开始向下取整、结束向上取整。');const body=plain(c.text).replace(/\\/g,'＼').replace(/\{/g,'｛').replace(/\}/g,'｝').replace(/\n/g,'\\N');const speaker=c.speaker.replace(/[,\r\n]/g,' ');return `Dialogue: 0,${formatTime(c.start_ms,'ass')},${formatTime(Math.min(86400000,Math.ceil(c.end_ms/10)*10),'ass')},Default,${speaker},0,0,0,,${body}`;});
  return {content:'[Script Info]\nScriptType: v4.00+\nPlayResX: 1920\nPlayResY: 1080\n\n[V4+ Styles]\nFormat: Name,Fontname,Fontsize,PrimaryColour,SecondaryColour,OutlineColour,BackColour,Bold,Italic,Underline,StrikeOut,ScaleX,ScaleY,Spacing,Angle,BorderStyle,Outline,Shadow,Alignment,MarginL,MarginR,MarginV,Encoding\nStyle: Default,Arial,48,&H00FFFFFF,&H000000FF,&H00000000,&H00000000,0,0,0,0,100,100,0,0,1,2,0,2,40,40,40,1\n\n[Events]\nFormat: Layer,Start,End,Style,Name,MarginL,MarginR,MarginV,Effect,Text\n'+rows.join('\n')+'\n',losses:[...losses]};
 }
 need(format==='srt'||format==='vtt','未知字幕导出格式。');
 const rows=ordered.map((c,index)=>{let body=plain(c.text);if(format==='vtt')body=body.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');if(/\n\s*\n/.test(body)){body=body.replace(/\n\s*\n/g,'\n');losses.add('条目内空白段合并为单换行，避免被解析为新字幕块。');}return `${index+1}\n${formatTime(c.start_ms,format)} --> ${formatTime(c.end_ms,format)}\n${body}`;});
 return {content:(format==='vtt'?'WEBVTT\n\n':'')+rows.join('\n\n')+'\n',losses:[...losses]};
}
