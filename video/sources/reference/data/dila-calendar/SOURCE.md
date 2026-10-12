# SOURCE: 年号/历日换算（DILA 时间规范资料库 + kltng/calendar_converter 的 SQLite 版）

1. `calendar.db`（14.4 MB SQLite）
   - 来源：https://github.com/kltng/calendar_converter/raw/main/data/calendar.db
   - Commit SHA：`42c85b1a8520c520b786b706217e3683f4aab2cc`，Stars：2（2026-10-12）
   - 许可证：代码 MIT；数据来自 DILA，按 **CC BY-SA 3.0** 对待
   - 表：dynasty, dynasty_name, emperor, emperor_name, era, era_name, month, period, day_comment；约公元前 220 年到 1912 年（中国部分）
   - 查询：`../../skills/_bonus__kltng__humanities-skills/cjk-calendar/scripts/calendar_converter.py`（把 db 放到脚本期望的位置，或修改路径）
2. `dila-authority_time/`（约 14 MB SQL）
   - 来源：https://github.com/DILA-edu/Authority-Databases （12★），Commit `a8272f74ad016d8db067669cd6d87b44abba865a`，目录 `authority_time/`
   - 许可证：**CC BY-SA 3.0 Unported**（COPYING.rst）
   - 法鼓文理学院（DILA）时间规范资料库：中/日/韩年号、朔闰，是上面 calendar.db 的上游数据
- 下载日期：2026-10-12
- 注意：上游自己说明，置闰、改元的边界在不同史料之间可能不一致，关键日期请回到原典核对。
