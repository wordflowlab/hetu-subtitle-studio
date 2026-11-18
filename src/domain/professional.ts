import {canonical,requireValue as need} from '../../vendor/project-store.ts';
import {artifact,hash} from './artifact.ts';
import {parseSubtitles,encodeSubtitles} from './formats.ts';
const find=(rows:any[],id:string,label:string)=>{const v=rows.find(x=>x.id===id);need(v,label+'不存在。');return v;};
export const cueDigest=(cue:any)=>hash(canonical(cue));
export function validateTransition(next:any,previous:any){for(const record of previous.imports)need(next.imports.some((v:any)=>v.track_id===record.track_id&&canonical(v)===canonical(record)),'导入原件与转换损失必须保留；不能删除或替换历史原件。');}
export function validateDomain(p:any){
 need(new Set(p.imports.map((v:any)=>v.track_id)).size===p.imports.length,'导入轨历史ID重复。');
 for(const record of p.imports){const parsed=parseSubtitles(record,record.format);need(canonical(parsed.losses)===canonical(record.losses),'转换损失须与固定原件解析结果一致。');}
 for(const track of p.tracks){if(track.source_track_id!==null)find(p.tracks,track.source_track_id,'源字幕轨');const seen=new Set<string>();let current=track;while(current.source_track_id!==null){need(!seen.has(current.id),'字幕源轨依赖成环。');seen.add(current.id);current=find(p.tracks,current.source_track_id,'源字幕轨');}}
 for(const cue of p.cues){need(cue.start_ms<cue.end_ms,'字幕结束须晚于开始。');need(!/[\u0000\r]/.test(cue.text),'字幕使用LF且不能包含空字节。');const track=find(p.tracks,cue.track_id,'字幕轨');need(new Set(cue.source_cue_ids).size===cue.source_cue_ids.length,'源字幕关联重复。');for(const id of cue.source_cue_ids){const source=find(p.cues,id,'源字幕');need(track.source_track_id!==null&&source.track_id===track.source_track_id,'字幕关联不属于声明源轨。');}}
 for(const n of p.notes){find(p.cues,n.cue_id,'意见字幕');need(n.status!=='resolved'||n.resolution.trim(),'解决意见须说明结果。');}
}
export function checkSubtitles(p:any){
 const findings:any[]=[];const segmenter=new Intl.Segmenter('zh',{granularity:'grapheme'});
 for(const track of p.tracks){const cues=p.cues.filter((c:any)=>c.track_id===track.id).sort((a:any,b:any)=>a.start_ms-b.start_ms||a.end_ms-b.end_ms);let latest:any;
  for(const cue of cues){const lines=cue.text.split('\n'),count=[...segmenter.segment(cue.text.replace(/\s/g,''))].length,cps=count/((cue.end_ms-cue.start_ms)/1000);const add=(kind:string,details:any)=>findings.push({cue_id:cue.id,track_id:track.id,kind,...details});
   if(cps>p.reading.max_cps)add('reading_speed',{cps:Number(cps.toFixed(2)),maximum:p.reading.max_cps});
   if(lines.length>p.reading.max_lines)add('line_count',{lines:lines.length,maximum:p.reading.max_lines});
   if(lines.some((line:string)=>[...segmenter.segment(line)].length>p.reading.max_chars_per_line))add('line_length',{maximum:p.reading.max_chars_per_line});
   if(p.media.duration_ms!==null&&cue.end_ms>p.media.duration_ms)add('after_declared_duration',{end_ms:cue.end_ms,duration_ms:p.media.duration_ms});
   if(cue.alignment==='estimated')add('estimated_alignment',{});
   if(latest){const gap=cue.start_ms-latest.end_ms;if(gap<0&&!p.reading.allow_overlap)add('overlap',{with_cue_id:latest.id,overlap_ms:-gap});else if(gap>=0&&gap<p.reading.minimum_gap_ms)add('short_gap',{with_cue_id:latest.id,gap_ms:gap});}
   if(!latest||cue.end_ms>latest.end_ms)latest=cue;
  }
 }
 return {tracks:p.tracks.length,cues:p.cues.length,findings,unaligned_translation_ids:p.cues.filter((c:any)=>find(p.tracks,c.track_id,'字幕轨').source_track_id!==null&&!c.source_cue_ids.length).map((c:any)=>c.id),stale_note_ids:p.notes.filter((n:any)=>cueDigest(find(p.cues,n.cue_id,'字幕'))!==n.cue_sha256).map((n:any)=>n.id),duration_basis:p.media.duration_ms===null?'unknown':'author_declared',note:'阅读速度按非空白字素／秒计算，不等于理解能力；声明时长和估计对齐需要实际媒体核对。'};
}
export async function checkSources(p:any,s:any[],_request:any){if(p.media.asset_source_index!==null)need(s[p.media.asset_source_index]?.source_ref?.kind==='asset','播放媒体须为当前作品固定素材。');}
export async function pureAction(a:string,i:any){if(a==='preview_import')return parseSubtitles(i.file,i.format);}
export async function writeProfessional(a:string,p:any,_s:any[],i:any,_request:any){
 if(a==='import_subtitles'){need(!p.tracks.some((t:any)=>t.id===i.track.id)&&!p.imports.some((v:any)=>v.track_id===i.track.id),'导入使用未曾使用的新轨ID，不能覆盖已有字幕或原件。');const parsed=parseSubtitles(i.file,i.format);const cues=parsed.cues.map((c:any,n:number)=>({...c,id:i.track.id+'-'+(n+1),track_id:i.track.id,source_cue_ids:[],alignment:'imported'}));need(cues.every((c:any)=>!p.cues.some((old:any)=>old.id===c.id)),'导入字幕ID与已有条目冲突。');p.tracks.push(i.track);p.cues.push(...cues);p.imports.push({...i.file,format:i.format,track_id:i.track.id,losses:parsed.losses});return;}
 if(a==='shift_track'){find(p.tracks,i.track_id,'字幕轨');const shifted=p.cues.filter((c:any)=>c.track_id===i.track_id).map((c:any)=>({...c,start_ms:c.start_ms+i.offset_ms,end_ms:c.end_ms+i.offset_ms}));need(shifted.every((c:any)=>c.start_ms>=0&&c.end_ms<=86400000),'平移后时间越界，整轨未保存。');for(const c of shifted)p.cues[p.cues.findIndex((v:any)=>v.id===c.id)]=c;return;}
 need(false,'未知专业写动作。');
}
export async function readProfessional(a:string,p:any,_s:any[],i:any,_request:any):Promise<any>{
 if(a==='preview_import')return parseSubtitles(i.file,i.format);
 if(a==='check_subtitles')return checkSubtitles(p);
 if(a==='cue_digest'){const cue=find(p.cues,i.cue_id,'字幕');return {cue_id:cue.id,cue_sha256:cueDigest(cue)};}
 if(a==='locate_time'){find(p.tracks,i.track_id,'字幕轨');return {time_ms:i.time_ms,cues:p.cues.filter((c:any)=>c.track_id===i.track_id&&c.start_ms<=i.time_ms&&c.end_ms>i.time_ms)};}
 if(a==='export_subtitles'){const track=find(p.tracks,i.track_id,'字幕轨'),cues=p.cues.filter((c:any)=>c.track_id===track.id);need(cues.length>0,'此轨尚无字幕，不能导出空文件。');const encoded=encodeSubtitles(cues,i.format);return {...artifact(encoded.content,'字幕.'+i.format,({srt:'application/x-subrip',vtt:'text/vtt',ass:'text/x-ssa'} as any)[i.format],i),losses:encoded.losses,track_id:track.id};}
}
export function summaries(p:any){return [{title:'字幕轨',lines:p.tracks.map((t:any)=>`${t.title}（${t.language}）${t.source_track_id===null?'原文':'译文'}`)},{title:'字幕内容',lines:[...p.cues].sort((a,b)=>a.start_ms-b.start_ms).map((c:any)=>`${c.start_ms}–${c.end_ms}ms ${c.speaker}：${c.text}`)},{title:'字幕意见',lines:p.notes.map((n:any)=>n.comment)}];}
