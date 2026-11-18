> 本研究属于[河图字幕工坊](../../README.md)，全局信息见根README。

# 研究结论与采纳边界

研究日期：2026-11-18。逐个GitHub仓库克隆作为research base，固定提交、文件摘要与许可证元数据见[sources](sources.json)，公开产品页面见[saas](saas.json)。未运行上游、未安装其插件或调用模型。

subtitle.js文档明确只有部分WebVTT支持；时间解析源码接受较宽的位数。Subtitle Edit公开文档区分STYLE、voice span和实际浏览器播放。河图选择严格毫秒时间、保留导入原件、明确损失和实际媒体审阅，不将基础ASS转换宣称完整样式往返。

定向核对：[subtitleedit/subtitleedit / docs/features/webvtt-styles.md](https://github.com/subtitleedit/subtitleedit/blob/a91a109730573720e2c37453b0a7e7debd65a317/docs/features/webvtt-styles.md)，SHA-256 `5710b993d5c1ca920bd4a7c64fee14afca5e60ead05660064e466fd1a8b9587e`。其他文件的摘要记录表示已取得固定字节，不自动表示已完整审计其功能。

实际识别、翻译、配音和烧录由作者选择的外部Agent工具完成。本包不伪造逐字时间，不把估计对齐标为人工核准。v1读取SRT、VTT及ASS基础Dialogue；样式、特效、定位与格式控制可能损失，预览明确报告，不声称完整ASS往返。

WorldAnvil公开页面返回403，未据此记录产品能力；其余公开页只说明页面展示的产品机制，未验证登录态、付费功能或质量主张。源码未从这些外部项目复制；公式、标准概念与独立实现分别标明。宿主SDK、Radix及运行依赖的实际许可随包保留。
