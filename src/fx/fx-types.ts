/**
 * 水墨动态特效的公共契约。游戏侧只依赖 start / update / dispose，
 * 不关心某一效果是扩散场、笔序还是解析形状。
 */

export interface InkFxParams {
  /** 1 为规格书时长。滑条可把它放慢或加快。 */
  speed: number;
  /** 0–1，乘在注入量上。 */
  density: number;
  /** 调色板色带：0 焦墨，0.25 朱砂，0.5 花青，0.75 赭石，1 泥金。负值表示沿用效果自己的颜色。 */
  pigment: number;
  /** 为真时不擦掉上一效果留下的墨。 */
  keep: boolean;
  /** 收尾时让整幅墨淡出。画廊里的标题要留住，叙事叠层要让开。 */
  fadeOut: boolean;
  /** 可移位效果的中心，0–1，y 向下。 */
  originX: number;
  originY: number;
}

export interface InkSplat {
  x: number;
  y: number;
  radius: number;
  amount: number;
  water: number;
  pigment: number;
  /** 低含水量时当作笔锋方向，用来烧进飞白；同时也推动附近的墨。 */
  vx: number;
  vy: number;
}

export interface InkFxFrame {
  splats: readonly InkSplat[];
  flow: number;
  diffuse: number;
  evaporate: number;
  fade: number;
  flash: number;
  recede: number;
  age: number;
  shake: number;
  clear: boolean;
  overlay: number;
  pigment: number;
  originX: number;
  originY: number;
}

export interface InkFxInfo {
  id: string;
  label: string;
  use: string;
  technique: string;
  duration: number;
  loop: boolean;
  placeable: boolean;
}

export interface InkFx {
  readonly id: string;
  readonly label: string;
  readonly duration: number;
  readonly loop: boolean;
  readonly progress: number;
  readonly finished: boolean;
  start(params?: Partial<InkFxParams>): void;
  update(dt: number): InkFxFrame;
  dispose(): void;
}

export interface FxParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  amount: number;
  water: number;
  pigment: number;
  life: number;
}

/** 一帧里效果能改写的工作区。stamp 超过上限就丢掉，先写入的优先。 */
export interface FxStep {
  t: number;
  time: number;
  dt: number;
  duration: number;
  density: number;
  pigment: number;
  fadeOut: boolean;
  rng: { next(): number; range(min: number, max: number): number };
  particles: FxParticle[];
  mem: number[];
  flow: number;
  diffuse: number;
  evaporate: number;
  fade: number;
  flash: number;
  recede: number;
  age: number;
  shake: number;
  stamp(splat: InkSplat): void;
}

export interface FxSpec extends InkFxInfo {
  overlay: number;
  /** 画廊里的默认落点。可移位效果仍以 0.5, 0.5 为笔触原点。 */
  anchorX?: number;
  anchorY?: number;
  step(ctx: FxStep): void;
}

export const FX_SPLAT_CAP = 16;

export interface InkFxPigment {
  band: number;
  name: string;
  hex: string;
}

export const INK_FX_PIGMENTS: readonly InkFxPigment[] = [
  { band: 0, name: '焦墨', hex: '#0E0D0C' },
  { band: 0.25, name: '朱砂', hex: '#B7322C' },
  { band: 0.5, name: '花青', hex: '#2F4A5E' },
  { band: 0.75, name: '赭石', hex: '#9A6A3E' },
  { band: 1, name: '泥金', hex: '#C8A55A' },
];
