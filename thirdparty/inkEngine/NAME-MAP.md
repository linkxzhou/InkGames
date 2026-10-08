# inkField → InkEngine 标识符映射表

由 tools/names.js（顶层）与 tools/localnames.js（局部）生成。
原始混淆器使用**一张全局字典**（原名 → `_jNNN`），所以同一个 `_jNNN` 在所有函数里都对应同一个原名。

- 顶层标识符：458 个（保留 303，UI 空桩 30，随 UI 移除 125）
- 局部标识符：已恢复 265 个混淆名（字典 250 条 + getElementById 启发式）；其余 `_jNNN` 局部名未能可靠恢复，保持原样。

## 顶层

| 混淆名 | 新名 | 类别 | 状态 | 说明 |
|---|---|---|---|---|
| `_j0` | `RandomCheckpointDebugger` | 调试 | 保留 | random() 调用计数检查点调试器（录制 vs 回放） |
| `_j1` | `loadShaderFromSources` | 引擎 | 保留 | 优先从内联 SHADER_SOURCES 创建 shader，否则 loadShader |
| `_j2` | `buildColorTable` | 引擎 | 保留 | 由 COLOR_PALETTE 生成 id→{name,rgb,channel} |
| `_j3` | `colorChannelsOf` | 引擎 | 保留 | rgb 主通道分类 |
| `_j4` | `genGlslColorConsts` | 调试 | 已移除 | 构建期：生成 GLSL 颜色常量（运行时不用） |
| `_j5` | `genGlslColorBranches` | 调试 | 已移除 | 构建期：生成 GLSL if/else 颜色链（运行时不用） |
| `_j6` | `listColors` | 引擎 | 保留 |  |
| `_j7` | `getColorById` | 引擎 | 保留 |  |
| `_j8` | `getColorByName` | 引擎 | 保留 |  |
| `_j9` | `generatePaperTexture` | 引擎 | 保留 | 生成纸纹（P2D createGraphics） |
| `_j10` | `createPaperStampTile` | 引擎 | 保留 | 纸纹印章小块（推测） |
| `_j11` | `createBugShape` | 引擎 | 保留 | 按 shapeType 生成蟲咬形状 |
| `_j12` | `bugShapeCluster` | 引擎 | 保留 |  |
| `_j13` | `bugShapeBlob` | 引擎 | 保留 |  |
| `_j14` | `bugShapeStrip` | 引擎 | 保留 |  |
| `_j15` | `bugShapeLightning` | 引擎 | 保留 |  |
| `_j16` | `bugShapeLightningAlt` | 引擎 | 保留 |  |
| `_j17` | `drawBugShape` | 引擎 | 保留 |  |
| `_j18` | `scanBugBites` | 引擎 | 保留 | 扫描画面深色像素生成蟲咬点（GPU 读回） |
| `_j19` | `scanBugBitesRandom` | 引擎 | 保留 | 随机位置蟲咬 |
| `_j20` | `updateBugTextures` | 引擎 | 保留 | 蟲咬 data/mask 纹理 |
| `_j21` | `applyMetallicPass` | 引擎 | 保留 | metallic.frag 后处理 |
| `_j22` | `dashedLine` | 引擎 | 保留 |  |
| `_j23` | `drawGridOverlay` | 引擎 | 保留 | 笔尖周围网格叠加 |
| `_j24` | `drawPathPointsTo` | 引擎 | 保留 | 把路径点画到 buffer（pathToggle） |
| `_j25` | `drawMaskOutline` | 引擎 | 保留 |  |
| `_j26` | `cameraReturnHome` | 引擎 | 保留 | EasyCam 回弹到初始位置 |
| `_j27` | `initEasyCam` | 引擎 | 保留 |  |
| `_j28` | `setUniformCached` | 引擎 | 保留 |  |
| `_j29` | `refreshRectCache` | 引擎 | 保留 |  |
| `_j30` | `runFeedbackPass` | 引擎 | 保留 | feedback.frag：写 pingPong 再拷回 |
| `_j31` | `regeneratePaperTexture` | 引擎 | 保留 |  |
| `_j32` | `refreshBackgroundBuffers` | 引擎 | 保留 |  |
| `_j33` | `initBlurBuffers` | 引擎 | 保留 |  |
| `_j34` | `pressureMedian3` | 引擎 | 保留 | 压感 3 点中值滤波 |
| `_j35` | `perfMonitorTick` | 调试 | 空桩(UI) |  |
| `_j36` | `perfMonitorReport` | 调试 | 空桩(UI) |  |
| `_j37` | `updateLayerZ` | 引擎 | 保留 | 4 层 z 偏移动画 |
| `_j38` | `copyBufferInto` | UI | 已移除 | testMode 用 |
| `_j39` | `commitStroke` | 引擎 | 保留 | 把当前笔编码进 finalBuffer/typeMap/oldBuffer 并清空草稿 |
| `_j40` | `commitIfPending` | 引擎 | 保留 |  |
| `_j41` | `collectFutureStrokes` | 引擎 | 保留 |  |
| `_j42` | `drawFuturePathPreview` | 引擎 | 保留 |  |
| `_j43` | `drawScreenText` | 引擎 | 保留 |  |
| `_j44` | `drawStrokeDividers` | 引擎 | 保留 |  |
| `_j45` | `drawStrokeHighlight` | 引擎 | 保留 |  |
| `_j46` | `wrapText` | 引擎 | 保留 |  |
| `_j47` | `updateReferenceImageSize` | UI | 空桩(UI) |  |
| `_j48` | `isPointOverUI` | UI | 空桩(UI) |  |
| `_j49` | `lastStrokeBoundsNormalized` | 引擎 | 保留 |  |
| `_j50` | `startFlowEffect` | 引擎 | 保留 |  |
| `_j51` | `stopFlowEffect` | 引擎 | 保留 |  |
| `_j52` | `updateFlowEffect` | 引擎 | 保留 |  |
| `_j53` | `replayFlowEffect` | 引擎 | 保留 |  |
| `_j54` | `setInkStroke` | 引擎 | 保留 |  |
| `_j55` | `setInkFill` | 引擎 | 保留 |  |
| `_j56` | `drawBranch` | 引擎 | 保留 | 画一条飞白分叉 |
| `_j57` | `drawSprayDots` | 引擎 | 保留 | 喷点 |
| `_j58` | `drawBrushStroke` | 引擎 | 保留 | 毛笔主笔刷（弹簧阻尼+分叉） |
| `_j59` | `drawDryBrush` | 引擎 | 保留 | 枯笔/Pen |
| `_j60` | `inkJitter` | 引擎 | 保留 |  |
| `_j61` | `drawMarker` | 引擎 | 保留 | 麦克笔 |
| `_j62` | `buildFlyBranchConfig` | 引擎 | 保留 |  |
| `_j63` | `resetFlyBrushCaches` | 引擎 | 保留 |  |
| `_j64` | `drawGothic` | 引擎 | 保留 | Gothic/喷漆 |
| `_j65` | `drawFlyBrush` | 引擎 | 保留 | 刷笔/Fly |
| `_j66` | `isBuild` | UI | 已移除 |  |
| `_j67` | `uiCacheElements` | UI | 已移除 |  |
| `_j68` | `uiGetPanel` | UI | 已移除 |  |
| `_j69` | `uiOverlayDragStart` | UI | 已移除 |  |
| `_j70` | `uiOverlayDragMove` | UI | 已移除 |  |
| `_j71` | `uiOverlayDragEnd` | UI | 已移除 |  |
| `_j72` | `uiClampPanel` | UI | 已移除 |  |
| `_j73` | `uiOverlayShow` | UI | 已移除 |  |
| `_j74` | `uiOverlayToggle` | UI | 已移除 |  |
| `_j75` | `uiOverlayApplyPos` | UI | 已移除 |  |
| `_j76` | `uiControlDragStart` | UI | 已移除 |  |
| `_j77` | `uiControlDragMove` | UI | 已移除 |  |
| `_j78` | `uiControlDragEnd` | UI | 已移除 |  |
| `_j79` | `uiControlApplyPos` | UI | 已移除 |  |
| `_j80` | `uiEffectDragStart` | UI | 已移除 |  |
| `_j81` | `uiEffectDragMove` | UI | 已移除 |  |
| `_j82` | `uiEffectDragEnd` | UI | 已移除 |  |
| `_j83` | `uiEffectApplyPos` | UI | 已移除 |  |
| `_j84` | `uiFlowDragStart` | UI | 已移除 |  |
| `_j85` | `uiFlowDragMove` | UI | 已移除 |  |
| `_j86` | `uiFlowDragEnd` | UI | 已移除 |  |
| `_j87` | `uiFlowApplyPos` | UI | 已移除 |  |
| `_j88` | `uiMaskDragStart` | UI | 已移除 |  |
| `_j89` | `uiMaskDragMove` | UI | 已移除 |  |
| `_j90` | `uiMaskDragEnd` | UI | 已移除 |  |
| `_j91` | `uiMaskApplyPos` | UI | 已移除 |  |
| `_j92` | `uiMaskToolButtons` | UI | 已移除 |  |
| `_j93` | `uiMaskStatus` | UI | 空桩(UI) |  |
| `_j94` | `uiControlPanelEl` | UI | 已移除 |  |
| `_j95` | `uiHintRecentlyDragged` | UI | 已移除 |  |
| `_j96` | `uiHintSetVisible` | UI | 已移除 |  |
| `_j97` | `uiHint97` | UI | 已移除 |  |
| `_j98` | `uiHint98` | UI | 已移除 |  |
| `_j99` | `uiHintSavePos` | UI | 已移除 |  |
| `_j100` | `uiHintLoadPos` | UI | 已移除 |  |
| `_j101` | `uiInitHints` | UI | 已移除 |  |
| `_j102` | `uiToggleOverlayHint` | UI | 已移除 |  |
| `_j103` | `uiToggleBrushPanel` | UI | 已移除 |  |
| `_j104` | `uiToggleEffectPanel` | UI | 已移除 |  |
| `_j105` | `uiToggleFlowPanel` | UI | 已移除 |  |
| `_j106` | `uiToggleMaskPanel` | UI | 已移除 |  |
| `_j107` | `uiToggleScreenText` | UI | 已移除 |  |
| `_j108` | `uiLoadPanelVisibility` | UI | 空桩(UI) |  |
| `_j109` | `uiSavePanelVisibility` | UI | 已移除 |  |
| `_j110` | `uiLoadPanelPositions` | UI | 空桩(UI) |  |
| `_j111` | `uiSavePanelPositions` | UI | 已移除 |  |
| `_j112` | `logMessage` | 引擎 | 保留 | 原为写入 Art System Log 面板；引擎中转发到 options.log |
| `_j113` | `uiAppendLog` | UI | 空桩(UI) |  |
| `_j114` | `uiLog114` | UI | 已移除 |  |
| `_j115` | `uiRenderMessages` | UI | 已移除 |  |
| `_j116` | `pickVideoMime` | UI | 已移除 |  |
| `_j117` | `startVideoRecording` | UI | 已移除 |  |
| `_j118` | `stopVideoRecording` | UI | 已移除 |  |
| `_j119` | `isVideoRecording` | UI | 已移除 |  |
| `_j120` | `uiUpdateRecordButtons` | UI | 空桩(UI) |  |
| `_j121` | `refImgEdgeDetect` | UI | 已移除 |  |
| `_j122` | `refImgSetMode` | UI | 已移除 |  |
| `_j123` | `refImgLoad` | UI | 已移除 |  |
| `_j124` | `refImgPaste` | UI | 已移除 |  |
| `_j125` | `refImgToggle` | UI | 已移除 |  |
| `_j126` | `saveCanvasPNG` | 引擎 | 保留 |  |
| `_j127` | `setBrushSizeName` | 引擎 | 保留 | UI 处理器去掉 DOM 后保留：'ultra-small'..'huge' → baseBrushSize |
| `_j128` | `uiSyncBrushSize` | UI | 空桩(UI) |  |
| `_j129` | `setBrushModeValue` | 引擎 | 保留 |  |
| `_j130` | `brushModeLabel` | 引擎 | 保留 |  |
| `_j131` | `uiSyncBrushMode` | UI | 空桩(UI) |  |
| `_j132` | `setInkEffectValue` | 引擎 | 保留 | useSharpen |
| `_j133` | `setBlendModeValue` | 引擎 | 保留 | 0 Mix/1 Multiply/2 Darken/3 Spectral |
| `_j134` | `uiSyncBlendMode` | UI | 空桩(UI) |  |
| `_j135` | `uiSyncInkEffect` | UI | 空桩(UI) |  |
| `_j136` | `setBrushColorName` | 引擎 | 保留 | 颜色名 → brushColorMode |
| `_j137` | `uiSyncBrushColor` | UI | 空桩(UI) |  |
| `_j138` | `setPathRotationModeValue` | 引擎 | 保留 |  |
| `_j139` | `uiSyncPathRotation` | UI | 空桩(UI) |  |
| `_j140` | `uiUpdateBrushStatus` | UI | 空桩(UI) |  |
| `_j141` | `resetBrushSettings` | 引擎 | 保留 |  |
| `_j142` | `uiBindTap` | UI | 已移除 |  |
| `_j143` | `uiSyncBackgroundColor` | UI | 空桩(UI) |  |
| `_j144` | `uiSyncCanvasSize` | UI | 空桩(UI) |  |
| `_j145` | `uiInitControlPanel` | UI | 空桩(UI) |  |
| `_j146` | `uiUpdateRecordingStatus` | UI | 空桩(UI) |  |
| `_j147` | `uiRenderMessage` | UI | 已移除 |  |
| `_j148` | `uiToggleOverlay` | UI | 已移除 |  |
| `_j149` | `uiRefreshMessages` | UI | 已移除 |  |
| `_j150` | `uiRecordStatusText` | UI | 已移除 |  |
| `_j151` | `parseUrlParams` | UI | 已移除 |  |
| `_j152` | `uiApplyUrlToggles` | UI | 已移除 |  |
| `_j153` | `uiInit` | UI | 空桩(UI) |  |
| `_j155` | `uiCreateZenButton` | UI | 已移除 |  |
| `_j156` | `uiCreateCollectButton` | UI | 已移除 |  |
| `_j157` | `uiCreateRefImageButton` | UI | 已移除 |  |
| `_j158` | `uiCyclePanelLayout` | UI | 已移除 |  |
| `_j159` | `uiToggleZen` | UI | 已移除 |  |
| `_j160` | `uiZenRestore` | UI | 已移除 |  |
| `_j161` | `uiInitMetallicControls` | UI | 已移除 |  |
| `_j162` | `uiSyncAllBrushButtons` | UI | 空桩(UI) |  |
| `_j163` | `uiGetActiveShapeType` | UI | 空桩(UI) |  |
| `_j164` | `uiSetActiveShapeType` | UI | 空桩(UI) |  |
| `_j165` | `uiInitBugsSize` | UI | 已移除 |  |
| `_j166` | `uiInitStrokeSelector` | UI | 已移除 |  |
| `_j168` | `uiInitCustomColor` | UI | 已移除 |  |
| `_j169` | `uiInitCanvasSettings` | UI | 已移除 |  |
| `_j170` | `uiInitFlowPanel` | UI | 已移除 |  |
| `_j171` | `flowButtonDown` | 引擎 | 保留 | flow 效果开始（原按钮按下处理器） |
| `_j172` | `flowButtonUp` | 引擎 | 保留 | flow 效果结束（原按钮松开处理器） |
| `_j173` | `loadCommitShaders` | 引擎 | 保留 |  |
| `_j174` | `clearCanvas` | 引擎 | 保留 |  |
| `_j175` | `initPlaybackEnvironment` | 引擎 | 保留 |  |
| `_j176` | `clearAllBuffers` | 引擎 | 保留 |  |
| `_j177` | `primeFeedback` | 引擎 | 保留 |  |
| `_j178` | `resetBrushState` | 引擎 | 保留 |  |
| `_j179` | `updateForceMap` | 引擎 | 保留 | mapFrag.frag → forceMapBuffer |
| `_j180` | `randomizeForceMap` | 引擎 | 保留 |  |
| `_j181` | `logTitle` | 引擎 | 保留 | 原本即空函数 |
| `_j182` | `warmUp` | 引擎 | 保留 |  |
| `_j183` | `warmUpStroke` | 引擎 | 保留 | setup 时画一笔隐形笔触预热 shader |
| `_j184` | `startFrameRecording` | UI | 空桩(UI) |  |
| `_j185` | `stopFrameRecording` | UI | 空桩(UI) |  |
| `_j186` | `captureFrame` | UI | 空桩(UI) |  |
| `_j187` | `finishFrameRecording` | UI | 已移除 |  |
| `_j188` | `round2` | 引擎 | 保留 | Math.round(v*100)/100 |
| `_j189` | `recordEvent` | 引擎 | 保留 |  |
| `_j190` | `startRecording` | 引擎 | 保留 |  |
| `_j191` | `stopRecording` | 引擎 | 保留 |  |
| `_j192` | `downloadRecording` | UI | 空桩(UI) |  |
| `_j193` | `openRecordingFile` | UI | 已移除 |  |
| `_j194` | `stopPlayback` | 引擎 | 保留 |  |
| `_j195` | `dispatchPlaybackEvent` | 引擎 | 保留 | mp/md/mr/kp/ec/flow/mask |
| `_j197` | `afterPlaybackEnded` | UI | 空桩(UI) | 继续录制对话框 |
| `_j198` | `continueRecordingFromPlayback` | UI | 已移除 |  |
| `_j199` | `applyRecordingCanvasSize` | UI | 已移除 |  |
| `_j200` | `captureVideoFrame` | UI | 空桩(UI) |  |
| `_j201` | `finishVideoCapture` | UI | 已移除 |  |
| `_j202` | `crc32` | UI | 已移除 |  |
| `_j203` | `buildZip` | UI | 已移除 |  |
| `_j222` | `COLOR_PALETTE` | 数据 | 保留 | 36 色表（id 0–35） |
| `_j223` | `colorTable` | 数据 | 保留 | buildColorTable() 结果 |
| `_j229` | `paperUnusedCache` | 引擎 | 保留 | 未使用 |
| `_j230` | `paperUnusedCounter` | 引擎 | 保留 | 未使用 |
| `_j231` | `PAPER_MAX_SIZE` | 数据 | 保留 | 纸纹最大边长 2000 |
| `_j241` | `bugPoints` | 引擎 | 保留 | 蟲咬点数组 |
| `_j382` | `prevGridParams` | 引擎 | 保留 |  |
| `_j446` | `tipX` | 引擎 | 保留 | 笔尖目标 x（含路径旋转偏移） |
| `_j447` | `tipY` | 引擎 | 保留 |  |
| `_j476` | `cachedRectUniform` | 引擎 | 保留 |  |
| `_j477` | `cachedInvResolution` | 引擎 | 保留 |  |
| `_j478` | `cachedRectW` | 引擎 | 保留 |  |
| `_j479` | `cachedRectH` | 引擎 | 保留 |  |
| `_j480` | `cachedRectDensity` | 引擎 | 保留 |  |
| `_j481` | `uniformCache` | 引擎 | 保留 |  |
| `_j512` | `canvasW` | 引擎 | 保留 |  |
| `_j513` | `canvasH` | 引擎 | 保留 |  |
| `_j514` | `density` | 引擎 | 保留 | pixelDensity（默认 1.6） |
| `_j515` | `forceMapBuffer` | 引擎 | 保留 | 力场图（mapFrag） |
| `_j516` | `mapShader` | 引擎 | 保留 |  |
| `_j517` | `feedbackShader` | 引擎 | 保留 |  |
| `_j518` | `realtimeShader` | 引擎 | 保留 |  |
| `_j519` | `encodeShader` | 引擎 | 保留 |  |
| `_j520` | `compositeShader` | 引擎 | 保留 |  |
| `_j521` | `distortShader` | 引擎 | 保留 |  |
| `_j522` | `typeMapEncodeShader` | 引擎 | 保留 |  |
| `_j523` | `flowShader` | 引擎 | 保留 |  |
| `_j524` | `inkGray` | 引擎 | 保留 | 每帧低通的灰度值（墨色深浅） |
| `_j525` | `whiteMaxOpacity` | 引擎 | 保留 |  |
| `_j526` | `hueShift` | 引擎 | 保留 |  |
| `_j527` | `satShift` | 引擎 | 保留 |  |
| `_j528` | `briShift` | 引擎 | 保留 |  |
| `_j529` | `interpSteps` | 引擎 | 保留 | strokeData.step：每帧插值子步数 |
| `_j530` | `branchTypeInit` | 引擎 | 保留 | setup 中置 0；笔刷函数同名参数为分叉类型 |
| `_j531` | `spring` | 引擎 | 保留 |  |
| `_j532` | `friction` | 引擎 | 保留 |  |
| `_j533` | `sizeNow` | 引擎 | 保留 | 当前尺寸（= brushSize） |
| `_j534` | `velX` | 引擎 | 保留 | 弹簧速度 x（ax） |
| `_j535` | `velY` | 引擎 | 保留 | 弹簧速度 y（ay） |
| `_j536` | `speed` | 引擎 | 保留 | 速度×系数 |
| `_j537` | `strokeWidth` | 引擎 | 保留 | sizeNow - speed |
| `_j538` | `pathAngle` | 引擎 | 保留 |  |
| `_j539` | `brushSize` | 引擎 | 保留 | 随帧衰减的尺寸（墨量） |
| `_j540` | `brushSizeMin` | 引擎 | 保留 | 低于即进入收笔 |
| `_j541` | `smoothedWidth` | 引擎 | 保留 |  |
| `_j542` | `brushSizeName` | 引擎 | 保留 | 'large' 等 |
| `_j543` | `prevInkEffect` | 引擎 | 保留 |  |
| `_j544` | `flyBrushPoints` | 引擎 | 保留 | 仅 reset 使用 |
| `_j545` | `legacyBrushX` | 引擎 | 保留 | 仅 reset 使用 |
| `_j546` | `legacyBrushY` | 引擎 | 保留 | 仅 reset 使用 |
| `_j547` | `lineWidth` | 引擎 | 保留 | 当前绘制线宽 |
| `_j548` | `prevTipX` | 引擎 | 保留 |  |
| `_j549` | `prevTipY` | 引擎 | 保留 |  |
| `_j550` | `springInitialized` | 引擎 | 保留 |  |
| `_j551` | `cursorX` | 引擎 | 保留 | 实时笔位置（round2） |
| `_j552` | `cursorY` | 引擎 | 保留 |  |
| `_j553` | `lastTipX` | 引擎 | 保留 |  |
| `_j554` | `lastTipY` | 引擎 | 保留 |  |
| `_j555` | `gridCellSize` | 引擎 | 保留 | = initialSize |
| `_j556` | `isDrawing` | 引擎 | 保留 | 笔按下中 |
| `_j557` | `isReleasing` | 引擎 | 保留 | 松笔后的 feedback 倒计时中 |
| `_j558` | `strokeActive` | 引擎 | 保留 |  |
| `_j559` | `strokeCommitted` | 引擎 | 保留 |  |
| `_j560` | `pressureEnabled` | 引擎 | 保留 |  |
| `_j561` | `maskBuffer` | 引擎 | 保留 | 白=可画 |
| `_j562` | `maskDrawMode` | 引擎 | 保留 |  |
| `_j563` | `maskActive` | 引擎 | 保留 |  |
| `_j564` | `maskTool` | 引擎 | 保留 | 'rect'\|'polygon' |
| `_j565` | `maskRectDraft` | 引擎 | 保留 |  |
| `_j566` | `maskPolygonPoints` | 引擎 | 保留 |  |
| `_j567` | `currentMaskData` | 引擎 | 保留 |  |
| `_j568` | `pressureNorm` | 引擎 | 保留 |  |
| `_j569` | `stylusDetected` | 引擎 | 保留 |  |
| `_j570` | `penPressure` | 引擎 | 保留 |  |
| `_j571` | `pressureHistory` | 引擎 | 保留 |  |
| `_j572` | `pressureBaseBrushSize` | 引擎 | 保留 |  |
| `_j573` | `pointerOnUI` | 引擎 | 保留 |  |
| `_j574` | `pathToggle` | 引擎 | 保留 | initialPathToggle |
| `_j575` | `compositeDirty` | 引擎 | 保留 |  |
| `_j576` | `agentPathActive` | 引擎 | 保留 |  |
| `_j577` | `agentPaths` | 引擎 | 保留 |  |
| `_j578` | `countdownFrame` | 引擎 | 保留 |  |
| `_j579` | `strokeFrame` | 引擎 | 保留 | mouseCount：本笔帧数 |
| `_j580` | `feedbackFrame` | 引擎 | 保留 |  |
| `_j581` | `mouseCountStart` | 引擎 | 保留 |  |
| `_j582` | `autoBugScan` | 引擎 | 保留 |  |
| `_j583` | `lastStrokeBounds` | 引擎 | 保留 |  |
| `_j584` | `collectPathPoints` | 引擎 | 保留 |  |
| `_j585` | `pathRotationMode` | 引擎 | 保留 | 1\|2\|3 |
| `_j586` | `step2` | 引擎 | 保留 |  |
| `_j587` | `MAX_STORED_STROKES` | 数据 | 保留 |  |
| `_j588` | `demoRecording` | 引擎 | 保留 |  |
| `_j589` | `futurePathCache` | 引擎 | 保留 |  |
| `_j590` | `rsFrequency` | 引擎 | 保留 |  |
| `_j591` | `rsWaveSpeed` | 引擎 | 保留 |  |
| `_j592` | `rsStrength` | 引擎 | 保留 |  |
| `_j593` | `rsGradientMix` | 引擎 | 保留 |  |
| `_j594` | `rsScale` | 引擎 | 保留 |  |
| `_j595` | `cellularScale` | 引擎 | 保留 |  |
| `_j596` | `cellularSeed` | 引擎 | 保留 |  |
| `_j597` | `whiteDotDensity` | 引擎 | 保留 |  |
| `_j598` | `grainAmount` | 引擎 | 保留 |  |
| `_j599` | `bypassFeedback` | 引擎 | 保留 |  |
| `_j600` | `flowActive` | 引擎 | 保留 |  |
| `_j601` | `flowBlendType` | 引擎 | 保留 |  |
| `_j602` | `flowStartMillis` | 引擎 | 保留 |  |
| `_j603` | `flowIterations` | 引擎 | 保留 |  |
| `_j604` | `flowUnused` | 引擎 | 保留 | 未使用 |
| `_j605` | `flowSeed` | 引擎 | 保留 |  |
| `_j606` | `flowCommitPending` | 引擎 | 保留 |  |
| `_j607` | `flowCommitData` | 引擎 | 保留 |  |
| `_j608` | `flowFrames` | 引擎 | 保留 |  |
| `_j609` | `flowTargetFrames` | 引擎 | 保留 |  |
| `_j610` | `flowTargetIterations` | 引擎 | 保留 |  |
| `_j611` | `flowIsReplay` | 引擎 | 保留 |  |
| `_j612` | `FLOW_FRAMES_PER_ITERATION` | 数据 | 保留 |  |
| `_j613` | `flowParams` | 引擎 | 保留 |  |
| `_j614` | `flowLastStrokeOnly` | 引擎 | 保留 |  |
| `_j615` | `fmRandomSeeds` | 引擎 | 保留 | forceMapParams.randomSeed1..4 |
| `_j616` | `fmScales` | 引擎 | 保留 |  |
| `_j617` | `fmAmplitudes` | 引擎 | 保留 |  |
| `_j618` | `fmPhases` | 引擎 | 保留 |  |
| `_j619` | `fmVortexScales` | 引擎 | 保留 |  |
| `_j620` | `fmClusterScales` | 引擎 | 保留 |  |
| `_j621` | `textOverlayGfx` | 引擎 | 保留 | createGraphics(WEBGL) 文字/分隔叠加（z=120） |
| `_j622` | `finalOut` | 引擎 | 保留 | 后处理后的最终图（z=0） |
| `_j623` | `futurePathGfx` | 引擎 | 保留 | createGraphics(WEBGL) 未来路径预览（z=80） |
| `_j624` | `screenBuffer` | 引擎 | 保留 | composite+realtime 工作区/临时目标 |
| `_j625` | `cursorBuffer` | 引擎 | 保留 | 光标/网格（z=40） |
| `_j626` | `paperTextureBuffer` | 引擎 | 保留 |  |
| `_j627` | `plainBgBuffer` | 引擎 | 保留 | 纯背景色 |
| `_j628` | `realtimeIntermediateBuffer` | 引擎 | 保留 |  |
| `_j629` | `lastStrokeBuffer` | 引擎 | 保留 | flow 用 lastStrokeTex |
| `_j630` | `isRecording` | 引擎 | 保留 |  |
| `_j631` | `recordStartMillis` | 引擎 | 保留 |  |
| `_j632` | `currentStrokeData` | 引擎 | 保留 |  |
| `_j633` | `lastStrokeEndMillis` | 引擎 | 保留 |  |
| `_j634` | `recordedStrokeCount` | 引擎 | 保留 |  |
| `_j635` | `pausedAccum` | 引擎 | 保留 | 自动压缩停顿 |
| `_j636` | `firstStrokePending` | 引擎 | 保留 |  |
| `_j637` | `autoFrameCapture` | 引擎 | 保留 |  |
| `_j638` | `isPlaying` | 引擎 | 保留 |  |
| `_j639` | `playbackStartMillis` | 引擎 | 保留 |  |
| `_j640` | `playbackEventIndex` | 引擎 | 保留 |  |
| `_j641` | `playbackSpeed` | 引擎 | 保留 |  |
| `_j642` | `playX` | 引擎 | 保留 |  |
| `_j643` | `playY` | 引擎 | 保留 |  |
| `_j644` | `playPrevX` | 引擎 | 保留 |  |
| `_j645` | `playPrevY` | 引擎 | 保留 |  |
| `_j646` | `playMouseDown` | 引擎 | 保留 |  |
| `_j647` | `loopWaitStart` | 引擎 | 保留 |  |
| `_j648` | `countdownPauseStart` | 引擎 | 保留 |  |
| `_j649` | `countdownPausing` | 引擎 | 保留 |  |
| `_j650` | `playbackOffsetX` | 引擎 | 保留 |  |
| `_j651` | `playbackOffsetY` | 引擎 | 保留 |  |
| `_j652` | `easycam` | 引擎 | 保留 |  |
| `_j653` | `easycamEnabled` | 引擎 | 保留 |  |
| `_j654` | `easycamTracking` | 引擎 | 保留 |  |
| `_j655` | `camCenterLerp` | 引擎 | 保留 |  |
| `_j656` | `camZoomLerp` | 引擎 | 保留 |  |
| `_j657` | `camStrokeCounter` | 引擎 | 保留 |  |
| `_j658` | `camZoomStrokeMark` | 引擎 | 保留 |  |
| `_j659` | `camZoomLevel` | 引擎 | 保留 |  |
| `_j660` | `camZoomIn` | 引擎 | 保留 |  |
| `_j661` | `camDistMin` | 引擎 | 保留 |  |
| `_j662` | `camDistMax` | 引擎 | 保留 |  |
| `_j663` | `camResetFromCenter` | 引擎 | 保留 |  |
| `_j664` | `camResetToCenter` | 引擎 | 保留 |  |
| `_j665` | `camResetting` | 引擎 | 保留 |  |
| `_j666` | `camResetStart` | 引擎 | 保留 |  |
| `_j667` | `camResetFromDist` | 引擎 | 保留 |  |
| `_j668` | `camResetToDist` | 引擎 | 保留 |  |
| `_j669` | `CAMERA_RESET_MS` | 数据 | 保留 |  |
| `_j670` | `layerZAnimating` | 引擎 | 保留 |  |
| `_j671` | `layerZAnimStart` | 引擎 | 保留 |  |
| `_j672` | `layerZFrom` | 引擎 | 保留 |  |
| `_j673` | `layerZTarget` | 引擎 | 保留 |  |
| `_j674` | `layerZ` | 引擎 | 保留 | 4 层 z 偏移 {0,40,80,120} |
| `_j675` | `layerBlurTarget` | 引擎 | 保留 |  |
| `_j676` | `layerBlur` | 引擎 | 保留 |  |
| `_j677` | `blurStartMillis` | 引擎 | 保留 |  |
| `_j678` | `BLUR_RAMP_MS` | 数据 | 保留 |  |
| `_j679` | `blurActive` | 引擎 | 保留 |  |
| `_j680` | `blurNeedsRegen` | 引擎 | 保留 |  |
| `_j681` | `isFrameRecording` | 引擎 | 保留 |  |
| `_j682` | `frameRecordStart` | 引擎 | 保留 |  |
| `_j683` | `frameRecordList` | 引擎 | 保留 |  |
| `_j684` | `frameRecordSkip` | 引擎 | 保留 |  |
| `_j685` | `unused085` | 引擎 | 保留 | 未使用 |
| `_j686` | `overlayVisible` | UI | 保留 |  |
| `_j687` | `messageLog` | UI | 已移除 |  |
| `_j688` | `MESSAGE_LOG_MAX` | UI | 已移除 |  |
| `_j689` | `overlayDragOffset` | UI | 已移除 |  |
| `_j690` | `overlayPos` | UI | 已移除 |  |
| `_j691` | `controlPanelDragging` | UI | 已移除 |  |
| `_j692` | `controlPanelDragOffset` | UI | 已移除 |  |
| `_j693` | `controlPanelPos` | UI | 已移除 |  |
| `_j694` | `controlPanelVisible` | UI | 已移除 |  |
| `_j695` | `effectPanelDragging` | UI | 已移除 |  |
| `_j696` | `effectPanelDragOffset` | UI | 已移除 |  |
| `_j697` | `effectPanelPos` | UI | 已移除 |  |
| `_j698` | `effectPanelVisible` | UI | 已移除 |  |
| `_j699` | `flowPanelDragging` | UI | 已移除 |  |
| `_j700` | `flowPanelDragOffset` | UI | 已移除 |  |
| `_j701` | `flowPanelPos` | UI | 已移除 |  |
| `_j702` | `flowPanelVisible` | UI | 已移除 |  |
| `_j703` | `maskPanelDragging` | UI | 已移除 |  |
| `_j704` | `maskPanelDragOffset` | UI | 已移除 |  |
| `_j705` | `maskPanelPos` | UI | 已移除 |  |
| `_j706` | `maskPanelVisible` | UI | 已移除 |  |
| `_j707` | `unused707` | 引擎 | 保留 | 未使用 |
| `_j708` | `screenTextLines` | 引擎 | 保留 |  |
| `_j709` | `SCREEN_TEXT_MAX_LINES` | 数据 | 保留 |  |
| `_j710` | `screenTextCounter` | 引擎 | 保留 |  |
| `_j711` | `screenTextX` | 引擎 | 保留 |  |
| `_j712` | `screenTextY0` | 引擎 | 保留 |  |
| `_j713` | `screenTextLineH` | 引擎 | 保留 |  |
| `_j714` | `screenTextAlpha` | 引擎 | 保留 |  |
| `_j715` | `SCREEN_TEXT_BUFFER_MAX` | 数据 | 保留 |  |
| `_j716` | `pendingBugScan` | 引擎 | 保留 |  |
| `_j717` | `bugScanSeed` | 引擎 | 保留 |  |
| `_j761` | `perfFrameCounter` | 调试 | 保留 |  |
| `_j762` | `PERF_SAMPLE_EVERY` | 调试 | 保留 |  |
| `_j851` | `testModeSnapshot` | UI | 已移除 |  |
| `_j887` | `dashTravelled` | 引擎 | 保留 | dash pattern state: distance travelled in current segment (was implicit global) |
| `_j912` | `dashPenDown` | 引擎 | 保留 | dash pattern state: currently in the drawn segment (was implicit global) |
| `_j920` | `BRANCH_FLIP_TABLE` | 数据 | 保留 | 分叉首条 X/Y 翻转表（brushDir） |
| `_j928` | `BRANCH_OFFSETS_5` | 数据 | 保留 | 5 条分叉偏移表 |
| `_j929` | `BRANCH_OFFSETS_8` | 数据 | 保留 | 8 条分叉（45°） |
| `_j930` | `BRANCH_OFFSETS_12` | 数据 | 保留 | 12 条分叉（30°） |
| `_j1027` | `MARKER_LINES` | 数据 | 保留 | 麦克笔平行线表 |
| `_j1052` | `sprayParticles` | 引擎 | 保留 | Gothic/喷漆粒子（推测） |
| `_j1053` | `sprayParticleCounter` | 引擎 | 保留 |  |
| `_j1161` | `buildInfoCache` | UI | 已移除 |  |
| `_j1166` | `hintPositions` | UI | 已移除 |  |
| `_j1167` | `hintDrag` | UI | 已移除 |  |
| `_j1188` | `videoRecorder` | UI | 已移除 |  |
| `_j1189` | `videoChunks` | UI | 已移除 |  |
| `_j1190` | `videoStream` | UI | 已移除 |  |
| `_j1196` | `refImgFlag` | UI | 已移除 |  |
| `_j1197` | `refImgA` | UI | 已移除 |  |
| `_j1198` | `refImgB` | UI | 已移除 |  |
| `_j1199` | `REF_IMG_C` | UI | 已移除 |  |
| `_j1200` | `refImgD` | UI | 已移除 |  |
| `_j1201` | `refImgE` | UI | 已移除 |  |
| `_j1202` | `refImgSrc` | UI | 已移除 |  |
| `_j1203` | `refImgEdgeSrc` | UI | 已移除 |  |
| `_j1204` | `refImgMode` | UI | 已移除 |  |
| `_j1387` | `zenActive` | UI | 已移除 |  |
| `_j1388` | `zenState` | UI | 已移除 |  |
| `_j1393` | `PANEL_LAYOUTS` | UI | 已移除 |  |
| `_j1394` | `panelLayoutIndex` | UI | 已移除 |  |
| `_j1421` | `activeFlowButton` | 引擎 | 保留 | flow 按住期间的按钮/令牌 |
| `_j1422` | `flowUiTimer` | 引擎 | 保留 |  |
| `_j1430` | `performanceMonitor` | 调试 | 保留 |  |
| `_j1519` | `videoCaptureConfig` | UI | 已移除 |  |
| `_j1525` | `crc32Table` | UI | 已移除 |  |

## 局部（字典）

| 混淆名 | 新名 |
|---|---|
| `_j204` | `vertSrc` |
| `_j205` | `fragSrc` |
| `_j219` | `nextPt` |
| `_j224` | `hasR` |
| `_j225` | `hasG` |
| `_j226` | `hasB` |
| `_j232` | `paperW` |
| `_j233` | `paperH` |
| `_j235` | `tile` |
| `_j237` | `paperGfx` |
| `_j243` | `items` |
| `_j253` | `blobCfg` |
| `_j254` | `blobSize` |
| `_j255` | `numVerts` |
| `_j256` | `vertices` |
| `_j264` | `prevPt` |
| `_j265` | `curPt` |
| `_j277` | `branchCfg` |
| `_j282` | `angle` |
| `_j309` | `target` |
| `_j339` | `sx` |
| `_j340` | `sy` |
| `_j366` | `recRandomCount` |
| `_j370` | `radius` |
| `_j371` | `cx` |
| `_j372` | `cy` |
| `_j392` | `labelX` |
| `_j393` | `labelY` |
| `_j406` | `isFramebuffer` |
| `_j407` | `dashOn` |
| `_j408` | `dashOff` |
| `_j409` | `segLen` |
| `_j410` | `travelled` |
| `_j411` | `dashLen` |
| `_j412` | `stepLen` |
| `_j413` | `segX` |
| `_j414` | `segY` |
| `_j415` | `lastPt` |
| `_j416` | `inset` |
| `_j417` | `outX1` |
| `_j418` | `outY1` |
| `_j419` | `outX2` |
| `_j420` | `outY2` |
| `_j421` | `polyPts` |
| `_j424` | `draftX1` |
| `_j425` | `draftY1` |
| `_j426` | `draftX2` |
| `_j427` | `draftY2` |
| `_j428` | `homeCenter` |
| `_j429` | `fov` |
| `_j431` | `homeDist` |
| `_j432` | `camCenter` |
| `_j433` | `camDist` |
| `_j436` | `elapsed` |
| `_j437` | `progress` |
| `_j440` | `curCenter` |
| `_j441` | `curDist` |
| `_j446` | `tipX_` |
| `_j447` | `tipY_` |
| `_j448` | `defaultCamDist` |
| `_j469` | `cameraTracking` |
| `_j483` | `colorModeFlag` |
| `_j487` | `bgColor` |
| `_j488` | `paperImg` |
| `_j498` | `maskOn` |
| `_j499` | `testModeOn` |
| `_j500` | `tipOffset` |
| `_j501` | `margin` |
| `_j502` | `frameX1` |
| `_j503` | `frameY1` |
| `_j504` | `frameX2` |
| `_j505` | `frameY2` |
| `_j508` | `cellSize` |
| `_j509` | `flowActive_` |
| `_j510` | `drawX` |
| `_j511` | `drawY` |
| `_j530` | `flyBrushType` |
| `_j533` | `tileSize` |
| `_j739` | `canvasEl` |
| `_j740` | `zenModeBtnEl` |
| `_j741` | `showPressure` |
| `_j742` | `onPenPointer` |
| `_j743` | `onTouchForce` |
| `_j744` | `isStylus` |
| `_j745` | `touchForce` |
| `_j746` | `canvasEl` |
| `_j767` | `defaultCanvas0El` |
| `_j768` | `fxDbgOvrEl` |
| `_j769` | `overlayCtx` |
| `_j770` | `fxhashCaptureCanvasEl` |
| `_j771` | `defaultCanvas0El_` |
| `_j772` | `frozenImg` |
| `_j773` | `captureCtx` |
| `_j774` | `lines` |
| `_j779` | `nextEvent` |
| `_j780` | `eventKind` |
| `_j781` | `isPress` |
| `_j782` | `evtTime` |
| `_j783` | `playbackElapsed` |
| `_j784` | `timeUntil` |
| `_j785` | `isDown` |
| `_j786` | `canDraw` |
| `_j787` | `inBounds` |
| `_j788` | `frameSeed` |
| `_j789` | `roll` |
| `_j790` | `altValue` |
| `_j791` | `grayTarget` |
| `_j792` | `pressure` |
| `_j793` | `prevBaseSize` |
| `_j794` | `sizeLadder` |
| `_j795` | `strokeBaseSize` |
| `_j796` | `ladderIdx` |
| `_j797` | `ladderBoost` |
| `_j798` | `newLadderIdx` |
| `_j800` | `jitterSeed` |
| `_j801` | `jitterX` |
| `_j802` | `jitterY` |
| `_j803` | `recX` |
| `_j804` | `recY` |
| `_j805` | `mdEvent` |
| `_j806` | `moved` |
| `_j807` | `minMove` |
| `_j808` | `strokeProgress` |
| `_j809` | `sprayRoll` |
| `_j810` | `isDown2` |
| `_j811` | `feedbackActive` |
| `_j812` | `savedSeed` |
| `_j813` | `scanJob` |
| `_j814` | `bugsSizeEl` |
| `_j815` | `bugsSizeValueEl` |
| `_j816` | `savedSeed` |
| `_j817` | `outsideMargin` |
| `_j820` | `sinceLastStroke` |
| `_j833` | `zTargets` |
| `_j835` | `pressedNow` |
| `_j864` | `strokes` |
| `_j866` | `scanIdx` |
| `_j869` | `evtType` / `evtType_` |
| `_j871` | `futureStroke` |
| `_j876` | `polyline` |
| `_j877` | `segIdx` |
| `_j878` | `nextIdx` |
| `_j882` | `speedPx` |
| `_j887` | `dashTravelled_` |
| `_j890` | `segDist` |
| `_j894` | `firstPt` |
| `_j898` | `visibleLines` |
| `_j902` | `dividerY` |
| `_j909` | `highlightMs` |
| `_j910` | `halfHighlightMs` |
| `_j912` | `dashPenDown_` |
| `_j913` | `words` |
| `_j914` | `currentLine` |
| `_j915` | `testLine` |
| `_j918` | `pad` |
| `_j919` | `flowIterationCountEl` / `flowIterationCountEl_` |
| `_j922` | `effBaseSize` |
| `_j923` | `isTinyBrush` |
| `_j925` | `clampedBase` |
| `_j931` | `inkValue` |
| `_j933` | `fromX` |
| `_j934` | `fromY` |
| `_j936` | `effBaseSize` |
| `_j938` | `numDots` |
| `_j939` | `fadeIn` |
| `_j940` | `fadeOut` |
| `_j942` | `dotScale` |
| `_j943` | `dotAngle` |
| `_j947` | `manhattan` |
| `_j953` | `effBaseSize` |
| `_j955` | `pressureScale` |
| `_j963` | `ctlNoiseByFrame` |
| `_j971` | `interpCount` |
| `_j975` | `curX` |
| `_j976` | `curY` |
| `_j991` | `mainAlpha` / `mainAlpha_` |
| `_j998` | `flipCfg` |
| `_j999` | `flipX1` |
| `_j1000` | `flipY1` |
| `_j1001` | `flipX2` |
| `_j1002` | `flipY2` |
| `_j1016` | `rotJitter` |
| `_j1019` | `effBaseSize` |
| `_j1020` | `baseSizeNow` |
| `_j1028` | `effBaseSize` |
| `_j1031` | `moveDx` |
| `_j1032` | `moveDy` |
| `_j1033` | `moveLen` |
| `_j1039` | `numSteps` |
| `_j1041` | `moveFactor` |
| `_j1043` | `item` |
| `_j1046` | `heading` |
| `_j1049` | `markerLine` |
| `_j1050` | `flyWhiteRand` |
| `_j1058` | `flySeed` |
| `_j1069` | `gdx` |
| `_j1070` | `gdy` |
| `_j1071` | `moveDist` |
| `_j1092` | `particle` |
| `_j1097` | `speedScale` |
| `_j1109` | `effBaseSize` |
| `_j1111` | `isTinyFly` |
| `_j1112` | `isSmallFly` |
| `_j1113` | `cacheKey` |
| `_j1125` | `nearEnd` |
| `_j1134` | `offsetNoise` |
| `_j1150` | `widthNoise` |
| `_j1157` | `prevWeight` |
| `_j1215` | `newEffect` |
| `_j1218` | `blendValue` |
| `_j1223` | `colorLabels` |
| `_j1224` | `namedColor` |
| `_j1225` | `customBrushColorEl` |
| `_j1226` | `customBrushColorTextEl` |
| `_j1251` | `sizeName` |
| `_j1257` | `modeValue` |
| `_j1400` | `metallicStrengthEl` |
| `_j1401` | `metallicStrengthValueEl` / `metallicStrengthPct` |
| `_j1402` | `metallicFlowEl` |
| `_j1403` | `metallicFlowValueEl` / `metallicFlowPct` |
| `_j1410` | `bugsSizeValue` |
| `_j1428` | `flowResult` |
| `_j1442` | `recSeed` |
| `_j1446` | `tint` |
| `_j1448` | `lastEventT` |
| `_j1457` | `panelToggles` |
| `_j1458` | `toggleCfg` |
| `_j1459` | `toggleValue` |
| `_j1460` | `toggleEl` |
| `_j1467` | `slidersEl` |
| `_j1468` | `distortFbmPreviewToggleEl` |
| `_j1470` | `flowStrengthEl` |
| `_j1471` | `flowStrengthValueEl` |
| `_j1472` | `distortDisplacementBEl` |
| `_j1473` | `distortDisplacementBValueEl` |
| `_j1474` | `distortDisplacementCEl` |
| `_j1475` | `distortDisplacementCValueEl` |
| `_j1476` | `firstEvent` |
| `_j1489` | `strokeIdxLabel` |
| `_j1492` | `evShapeType` |
| `_j1495` | `metallicStrengthValueEl` |
| `_j1496` | `metallicFlowValueEl` |
| `_j1510` | `isRelease` |
| `_j1511` | `isEc` |
| `_j1513` | `isMask` |
| `_j1514` | `isDrag` |
| `_j1533` | `vertPath` |
| `_j1534` | `fragPath` |
| `_j1537` | `contrastPow` |
| `_j1538` | `stampSize` |
| `_j1539` | `buf` |
| `_j1540` | `targetPoints_` |
| `_j1543` | `dashLength` |
| `_j1544` | `gapLength` |
| `_j1545` | `targetShader` |
| `_j1546` | `shaderKey` |
| `_j1547` | `force_` |
| `_j1548` | `maxWidth` |
| `_j1550` | `penX` |
| `_j1551` | `penY` |
| `_j1552` | `mainStrokeDir` |
| `_j1553` | `prevPenX` |
| `_j1554` | `prevPenY` |
| `_j1563` | `value` |
| `_j1568` | `response` |

## 移除的顶层语句

`window.Crandom@208`, `_j4@446`, `_j5@458`, `module.exports@486`, `window.gridCommitPrev@1622`, `_j35@3185`, `_j36@3225`, `keyPressed@4290`, `testMaskRect@4753`, `window.testMaskRect@4763`, `window.clearMask@4764`, `window.drawMaskRect@4765`, `window.drawMaskPolygon@4766`, `_j38@4769`, `enterTestMode@4779`, `exitTestMode@4801`, `window.enterTestMode@4827`, `window.exitTestMode@4828`, `_j47@5478`, `touchStarted@5489`, `touchMoved@5505`, `touchEnded@5512`, `_j48@5525`, `_j66@7053`, `_j67@7056`, `_j68@7086`, `_j69@7092`, `_j70@7103`, `_j71@7113`, `_j72@7123`, `_j73@7142`, `_j74@7156`, `_j75@7174`, `_j76@7182`, `_j77@7194`, `_j78@7204`, `_j79@7214`, `_j80@7222`, `_j81@7234`, `_j82@7244`, `_j83@7254`, `_j84@7262`, `_j85@7274`, `_j86@7284`, `_j87@7294`, `_j88@7302`, `_j89@7314`, `_j90@7324`, `_j91@7334`, `_j92@7342`, `_j93@7348`, `_j94@7363`, `_j95@7377`, `_j96@7380`, `_j97@7387`, `_j98@7397`, `_j99@7412`, `_j100@7430`, `_j101@7436`, `_j102@7493`, `_j103@7541`, `_j104@7566`, `_j105@7591`, `_j106@7616`, `_j107@7641`, `_j108@7655`, `_j109@7669`, `_j110@7675`, `_j111@7701`, `_j113@7728`, `_j114@7758`, `_j115@7773`, `_j116@7783`, `_j117@7795`, `_j118@7815`, `_j119@7846`, `_j120@7849`, `_j121@7895`, `_j122@7935`, `_j123@7948`, `_j124@7994`, `_j125@8019`, `_j128@8074`, `_j131@8108`, `_j134@8169`, `_j135@8186`, `_j137@8301`, `_j139@8374`, `_j140@8387`, `_j142@8485`, `_j143@8537`, `_j144@8552`, `_j145@8563`, `_j146@8914`, `_j147@8979`, `_j148@9015`, `_j149@9038`, `_j150@9042`, `_j151@9054`, `_j152@9095`, `_j153@9164`, `_j155@10373`, `_j156@10386`, `_j157@10395`, `_j158@10449`, `_j159@10464`, `_j160@10535`, `activateZenMode@10557`, `window.activateZenMode@10561`, `scheduleMobilePhoneZenMode@10562`, `window.scheduleMobilePhoneZenMode@10586`, `_j161@10587`, `_j162@10698`, `_j163@10706`, `_j164@10713`, `_j165@10724`, `_j166@10753`, `_j168@10814`, `_j169@10855`, `_j170@10955`, `window.testPerformanceMonitor@11218`, `_j184@11516`, `_j185@11529`, `_j186@11541`, `_j187@11564`, `_j192@11721`, `_j193@11758`, `window.startPlayback@12348`, `_j197@13279`, `_j198@13334`, `_j199@13382`, `startVideoFrameCapture@13419`, `_j200@13457`, `_j201@13484`, `_j202@13547`, `_j203@13562`, `window.startVideoFrameCapture@13627`

## 自由变量处理

- `window` → 每实例 `$win`（顶层 var/function 别名改回直接引用）；裸 `window` 作为 p5 命名空间时 → `$p`
- `document` → `$doc`（无站点 DOM）；`sessionStorage/localStorage` → `$store`（内存）
- p5 全局 API/常量 → `$p.*`；`mouseX/mouseY/pmouseX/pmouseY/mouseIsPressed/key` → `$in.*`；`millis` → `$clock`
- 仍挂在 `$win` 上的站点全局：`crandom`, `doSpotNoise`, `boidSpawners`, `doBoids`, `doEffect`, `doDemo`, `fxhashDebugMode`, `$fx`, `crandomDebugger`, `_playbackPenPressure`, `loopToggle`, `boidsSeed`, `playbackLastStrokeEndTime`, `playbackLastStrokeEndEventTime`, `playbackStrokeIndex`, `playbackLastStrokeBrushMode`, `loopWaitDuration`
