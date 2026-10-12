# SOURCE: CBDB 中国历代人物传记资料库（SQLite 版）

- 项目：https://projects.iq.harvard.edu/cbdb ，SQLite 发布仓库 https://github.com/cbdb-project/cbdb_sqlite（233★，2026-10-12）
- 文件：`cbdb_20261010.zip`（139,431,708 字节，解压后是 `cbdb_20261010.sqlite3`，587 MB）
- 下载地址：https://huggingface.co/datasets/cbdb/cbdb-sqlite/resolve/main/history/cbdb_202610/cbdb_20261010.zip （来自 latest.json）
- latest.json 里给的 sqlite sha256：`b43de31b298546ad8605ab52cd78d2a70d7b946abc01bf0d4efd18dd7853782d`
- 许可证：**CC BY-NC-SA 4.0**（数据；数据库 schema 另有版权；中国大陆的商业授权由中文在线 ChineseAll.com 独家持有）。
  - **不能商业使用**。如果 InkGames 有商业变现，就不能直接使用或再分发 CBDB 数据；引用具体事实（例如生卒年）没有问题，但不要批量导出到产品中。
  - **必须 gitignore**，不要提交进项目仓库。
- 下载日期：2026-10-12
- 用法：`unzip cbdb_20261010.zip`，然后用 `../../skills/_bonus__kltng__humanities-skills/cbdb-local/scripts/cbdb_query.py` 查询；也可以用在线 API（cbdb-api skill）
- 覆盖：65.6 万多名人物，公元前 7 世纪到 19 世纪，有生卒年、籍贯、官职、亲属、社会关系、科举记录；唐宋以后最密集，先秦很少
