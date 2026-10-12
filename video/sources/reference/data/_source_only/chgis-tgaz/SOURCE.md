# SOURCE（只有说明，没有下载数据）: CHGIS 中国历史地理信息系统 / TGAZ 历史地名辞典

- **为什么不下载**：CHGIS V6 的许可证是 "free for academic research, no commercial use, resale, or redistribution permitted"（https://chgis.fas.harvard.edu/data/chgis/v6/）。**禁止再分发**，所以不放进打包文件。
- 获取方式：
  1. 在线 API（推荐，不落地数据）：TGAZ https://chgis.hudci.org/tgw/ ，例如 `https://chgis.hudci.org/tgaz/placename?n=长安&yr=-200&fmt=json`；对应的 skill 是 `skills/_bonus__kltng__humanities-skills/chgis-tgaz`
  2. 本地 SQLite（228 MB，82,117 个地名，公元前 763 年到 1911 年）：`git lfs install && git clone https://github.com/kltng/tgaz-sqlite`（仓库没有许可证；数据受 CHGIS 条款约束），用 `skills/_bonus__kltng__humanities-skills/tgaz-sqlite/scripts/query_tgaz.py` 查询
  3. GIS 图层原始数据：Harvard Dataverse https://dataverse.harvard.edu/dataverse/chgis_v6 （需要同意 EULA）
- 引用格式："CHGIS, Version: 6. (c) Fairbank Center for Chinese Studies of Harvard University and the Center for Historical Geographical Studies at Fudan University, 2016."
- 本地有了数据也要放在 gitignore 目录里。
