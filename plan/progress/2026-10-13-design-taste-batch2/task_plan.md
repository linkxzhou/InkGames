# Task Plan: design-taste 第二批（封面与战国地图）

## Goal

从含 PR #27 的 main 修复 design-taste 问题 6、3、9：三张封面回到左空右墨的本类构图并锁色板，战国地图标注间距 ≥28px、字 14px `#3a3a3a`，河岸 `#6e6e6c` 2px、海岸 `#141414`，手机保留都城和当前场景标签。横幅保持 12:5（2400×1000）与四边渐隐。

## Next Step

提交并开指向 main 的 PR。

## Current Phase

Phase 4

## Phases

### Phase 1: Requirements & Discovery

- [x] 问题 6 在 `pian-zhiguo/renwu/zhanchang`（800×1000），不是已合格的 12:5 横幅
- [x] 治国封面左右相关 0.94；人物封面龙有眉眼；战场封面有粉红
- [x] 地图河线在锁色板时被抗锯齿吃淡；海岸没有 `#141414` 描边
- [x] 标注目前 12/13px，没有 28px 碰撞让位
- **Status:** complete

### Phase 2: Covers

- [x] 按 §5.1 重出三张卡片图，锁色板，朱砂 < 10%
- [x] 横幅文件与四边渐隐遮罩保持不动；横幅预留比例改为 2400×1000
- **Status:** complete

### Phase 3: Map

- [x] 河岸与海岸在锁色板之后用实色描边
- [x] 标注 14px `#3a3a3a`，间距 ≥28px，挤不下只留都城和当前场景
- [x] 手机保留都城和当前场景标签
- **Status:** complete

### Phase 4: Verify

- [x] 1440 与 390 前后对比截图
- [x] `./build.sh check` 与 `node video/tools/validate.mjs` 通过
- **Status:** complete
