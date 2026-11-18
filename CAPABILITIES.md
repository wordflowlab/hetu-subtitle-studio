# 字幕工坊功能清单

本包拥有专业能力；宿主拥有正文、来源与作者决定。

| 动作 | 用途 | 必填参数 | 效果 |
| --- | --- | --- | --- |
| list_projects | 查找专业工程 |  | read |
| get_project | 读取固定专业工程 | object_id | read |
| save_project | 保存专业工程 | expected_revision, expected_sha256, operation_key, content | managed_write |
| put_track | 维护字幕轨 | object_id, expected_revision, expected_sha256, operation_key, track | managed_write |
| remove_track | 移除字幕轨 | object_id, expected_revision, expected_sha256, operation_key, track_id | managed_write |
| put_cue | 维护字幕条目 | object_id, expected_revision, expected_sha256, operation_key, cue | managed_write |
| remove_cue | 移除字幕条目 | object_id, expected_revision, expected_sha256, operation_key, cue_id | managed_write |
| put_note | 维护字幕意见 | object_id, expected_revision, expected_sha256, operation_key, note | managed_write |
| remove_note | 移除字幕意见 | object_id, expected_revision, expected_sha256, operation_key, note_id | managed_write |
| preview_import | 预览字幕转换与损失 | file, format | read |
| import_subtitles | 导入固定字幕轨 | object_id, expected_revision, expected_sha256, operation_key, file, format, track | managed_write |
| check_subtitles | 检查时间与阅读负担 | object_id | read |
| export_subtitles | 导出固定字幕文件 | object_id, track_id, format | read |
| shift_track | 平移字幕轨 | object_id, expected_revision, expected_sha256, operation_key, track_id, offset_ms | managed_write |
| locate_time | 定位时刻字幕 | object_id, time_ms, track_id | read |
| cue_digest | 读取字幕固定摘要 | object_id, cue_id | read |
| get_source | 读取固定来源 | object_id, source_index | read |
| get_basis | 读取固定专业依据 | object_id, basis_index | read |
| compare_versions | 比较固定修订 | object_id, from_revision, to_revision | read |
| export_project | 导出固定专业报告 | object_id, format | read |
| build_context | 准备有界创作上下文 | object_id, goal, max_chars | read |
| create_handoff | 准备精确AI交接 | object_id, goal | read |
| get_operation | 回读原操作 | operation_key | read |

默认流程、边界及验收见 [docs](docs/README.md)。
