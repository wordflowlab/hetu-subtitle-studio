# 河图字幕工坊

> 将固定媒体、双语字幕、时间对齐与审阅意见组织为可接续工程，交付SRT、VTT及ASS。

## 简介

字幕工坊是独立TypeScript／React河图插件。外部Agent通过河图稳定CLI/MCP发现并调用，作者在工作面阅读、比较、反馈；作品正文和正式决定由宿主管理。

## 快速上手

安装河图插件中心提供的固定运行包，再向当前Agent说明本次作品与目标。先发现当前安装版能力，再读取包内`hetu-subtitle-studio`方法和已有工程。

读取固定媒体与已有字幕→预览格式和转换损失→导入或维护明确时间→双语条目关联→实际播放检查→按固定条目反馈及返工→导出并复核SRT/VTT/ASS。

## 开发

Node.js 25，固定依赖见`package-lock.json`。

```bash
npm ci
npm run build
npm run check
npm run test:unit
npm run test:machine
npm run test:ui
npm run package
```

机器与界面验收使用`acceptance-lock.json`固定的正式宿主；完整步骤见[开发与发布](docs/07-开发发布与维护.md)。

## 边界

实际识别、翻译、配音和烧录由作者选择的外部Agent工具完成。本包不伪造逐字时间，不把估计对齐标为人工核准。v1读取SRT、VTT及ASS基础Dialogue；样式、特效、定位与格式控制可能损失，预览明确报告，不声称完整ASS往返。

## 文档

[功能清单](CAPABILITIES.md) · [产品与开发文档](docs/README.md) · [验收记录](docs/08-实施计划与验收记录.md)。
