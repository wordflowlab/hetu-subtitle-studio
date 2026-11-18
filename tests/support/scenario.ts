import {createHash} from "node:crypto";
import {newProject} from "../../src/domain/model.ts";
export const original="林溪在雨港邮局等信。\n她把旧钥匙放进信封。\n\n第二天，她决定出发。\n";
export const sha=(v:string|Uint8Array)=>createHash("sha256").update(v).digest("hex");
export const sourceRef={kind:"document",work_ref:{workspace_id:"workspace_test",kind:"novel",object_id:"novel_test"},document_id:"doc_11111111-1111-4111-8111-111111111111",revision_id:"rev_11111111-1111-4111-8111-111111111111",sha256:sha(original)};
export const range={source_index:0,byte_start:0,byte_end:Buffer.byteLength(original),quote:original};
export const base=(r:any,key:string)=>({object_id:r.object.object_id,expected_revision:r.object.revision,expected_sha256:r.sha256,operation_key:key});
export const selection=(r:any)=>({object_id:r.object.object_id,revision:r.object.revision});
export function wav(value=6000,frames=800,rate=8000){const b=Buffer.alloc(44+frames*2);b.write('RIFF');b.writeUInt32LE(b.length-8,4);b.write('WAVEfmt ',8);b.writeUInt32LE(16,16);b.writeUInt16LE(1,20);b.writeUInt16LE(1,22);b.writeUInt32LE(rate,24);b.writeUInt32LE(rate*2,28);b.writeUInt16LE(2,32);b.writeUInt16LE(16,34);b.write('data',36);b.writeUInt32LE(frames*2,40);for(let n=0;n<frames;n++)b.writeInt16LE(value,44+n*2);return b;}

export function scenario(_work:any=sourceRef.work_ref):any {const p={...newProject("雨港来信"),...{
  "tracks": [
    {
      "id": "zh",
      "title": "中文对白",
      "language": "zh-CN",
      "source_track_id": null
    },
    {
      "id": "en",
      "title": "英文译文",
      "language": "en",
      "source_track_id": "zh"
    }
  ],
  "cues": [
    {
      "id": "zh-one",
      "track_id": "zh",
      "start_ms": 100,
      "end_ms": 1900,
      "text": "这封信，为什么没有署名？",
      "speaker": "林溪",
      "source_cue_ids": [],
      "alignment": "manual"
    },
    {
      "id": "zh-two",
      "track_id": "zh",
      "start_ms": 2200,
      "end_ms": 3900,
      "text": "信封里还有一把旧钥匙。",
      "speaker": "叙述",
      "source_cue_ids": [],
      "alignment": "manual"
    },
    {
      "id": "en-one",
      "track_id": "en",
      "start_ms": 100,
      "end_ms": 1900,
      "text": "Why is this letter unsigned?",
      "speaker": "Lin",
      "source_cue_ids": [
        "zh-one"
      ],
      "alignment": "manual"
    },
    {
      "id": "en-two",
      "track_id": "en",
      "start_ms": 2200,
      "end_ms": 3900,
      "text": "An old key lies in the envelope.",
      "speaker": "Narrator",
      "source_cue_ids": [
        "zh-two"
      ],
      "alignment": "estimated"
    }
  ],
  "notes": []
}};
return p;}
