# 卡脖子指数微信小程序

一个用于观察 AI/半导体供应链瓶颈的微信小程序 MVP。首版聚焦半导体设备、EDA/IP、HBM、先进封装、光模块、电力/液冷等方向，输出研究信号与风险提示，不构成投资建议。

## 功能

- 指数总览：综合 chokepoint score、四维压力、今日关注。
- 细分板块：按供应链环节查看瓶颈描述和相关标的。
- 标的详情：展示评分拆解、证据等级、风险标签和观察理由。
- 可配置数据源：默认本地示例；可在 `miniprogram/config/dataSource.ts` 配置远程 JSON URL，失败自动回退本地。

## 开发

1. 使用微信开发者工具打开本目录。
2. 确认 AppID 和本地设置后编译预览。
3. 如需远程数据，把 `dataSourceConfig.remoteUrl` 设置为 HTTPS JSON 地址，并在微信后台配置 request 合法域名。

## 远程数据最小结构

远程 JSON 需包含：`asOf`、`sourceName`、`indexScore`、`summary`、`pillars`、`sectors`、`companies`、`watchlist`。
