export const config = {
  "fields": {
    "track": "tracks",
    "cue": "cues",
    "note": "notes"
  },
  "defaults": {
    "imports": [],
    "tracks": [],
    "cues": [],
    "notes": [],
    "media": {
      "asset_source_index": null,
      "duration_ms": null
    },
    "reading": {
      "max_cps": 20,
      "max_lines": 2,
      "max_chars_per_line": 24,
      "minimum_gap_ms": 80,
      "allow_overlap": false
    }
  },
  "tabs": [
    "字幕与播放",
    "双语对齐",
    "时间与阅读检查",
    "区间意见",
    "接续创作"
  ]
} as const;
