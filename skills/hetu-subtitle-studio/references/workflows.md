# 专业流程

读取固定媒体与已有字幕→预览格式和转换损失→导入或维护明确时间→双语条目关联→实际播放检查→按固定条目反馈及返工→导出并复核SRT/VTT/ASS。

## 导入与原件

读取固定媒体和已有工程。preview_import使用完整inline文件字节及SHA-256，先核对格式、条目和losses，再用import_subtitles保存新轨。imports保留原件、摘要和转换损失，不得通过save_project删掉或替换历史。导入轨ID不复用，未知结果查原键。

首版支持SRT／WebVTT及基础ASS Dialogue；STYLE、voice、定位、特效及ASS覆盖标记按实际losses说明，不能说完整样式往返。没有识别结果时可请外部工具准备，不编造逐字时间。

## 对齐与检查

put_track声明语言与source_track_id；put_cue明确整数毫秒和source_cue_ids，允许一对多或多对一。manual表示手工声明，imported表示文件时间，estimated仍需实际核对；不把生成稿的估计时间伪装成已听审。

check_subtitles检查重叠、间隔、行数、行长、字素阅读速度、声明时长及stale意见；locate_time使用[start_ms,end_ms)定位。用cue_digest固定反馈目标，再put_note保存意见。shift_track只平移选定轨，边界失败整轨不保存；源轨和译轨是否一起移动由作者目标明确决定。

## 播放、导出与接续

实际打开媒体，完整播放并核对文本、对白及时间。export_subtitles按srt／vtt／ass分块读取，校验完整摘要；ASS百分之一秒精度及控制符转换会产生losses。再回读新工程与固定导出文件。识别、翻译、配音或烧录仍由外部工具执行，费用和内容外发单独决定。

## 版本与恢复

固定来源、专业依据、CAS和原键；删除当前记录不删除旧修订。列表完整分页回读，部分阅读如实声明。通用查找、比较、导出与交接见[操作地图](operations.md)，参数仍以当前安装版Schema为准。
