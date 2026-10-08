import { createToken } from '../core/types';

export interface Point { x: number; y: number }
export interface StrokePoint extends Point { radius: number }
export interface Stroke {
  id: number; points: StrokePoint[]; fragments: StrokePoint[][]; locked: boolean;
  /** 该步号之后笔画固化、不再可被水刷擦除；undefined 表示永不固化（仍受 locked 约束）。 */
  dryAtStep?: number;
}
export interface StrokeStore {
  readonly strokes: readonly Stroke[];
  create(points: StrokePoint[], locked?: boolean, dryAtStep?: number): Stroke;
  get(id: number): Stroke | undefined;
  /** 返回本步新固化的笔画数；由固定步调度在 step 边界调用。 */
  advance(step: number): number;
  clear(): void;
}
export interface CircleBody extends Point { id: number; radius: number; vx: number; vy: number; restitution: number }
export interface Rect { x: number; y: number; width: number; height: number }
export interface SceneMarker extends Point { id: string; radius: number; kind: string }
export interface Scene2D {
  width: number; height: number; gravity: number;
  circles: CircleBody[];
  markers: SceneMarker[];
  addCircle(body: Omit<CircleBody, 'id'>): CircleBody;
  addMarker(marker: SceneMarker): void;
  clearMarkers(): void;
  reset(width: number, height: number): void;
}
export interface Camera2D {
  x: number; y: number; zoom: number;
  readonly viewport: Rect;
  setViewport(viewport: Partial<Rect>): void;
  screenToWorld(point: Point): Point;
  worldToScreen(point: Point): Point;
}
export interface PointerSample extends Point { pressure: number; kind: 'down' | 'move' | 'up' | 'cancel'; tool: 'ink' | 'water' }
export interface Input2D { push(sample: PointerSample): void; drain(): PointerSample[] }
export interface Erosion { erase(path: readonly Point[], radius: number): number[] }
export interface Physics2D { readonly colliders: readonly { strokeId: number; a: StrokePoint; b: StrokePoint }[]; sync(): void }
export interface InkVisual { draw(stroke: Stroke): void; erase(path: readonly Point[], radius: number): void; render(): void; resize(width: number, height: number): void; setPaper(paper: Partial<{ tone: [number, number, number]; absorbency: number; fiber: number }>): void }
export interface Renderer2D { readonly gl: WebGL2RenderingContext; readonly canvas: HTMLCanvasElement; readonly halfFloat: boolean; resize(width: number, height: number): void; dispose(): void }
export interface PointerInput { setTool(tool: 'ink' | 'water'): void; dispose(): void }
export const SceneToken = createToken<Scene2D>('inkgames.scene2d');
export const CameraToken = createToken<Camera2D>('inkgames.camera2d');
export const InputToken = createToken<Input2D>('inkgames.input2d');
export const StrokeToken = createToken<StrokeStore>('inkgames.strokes');
export const ErosionToken = createToken<Erosion>('inkgames.water-erosion');
export const PhysicsToken = createToken<Physics2D>('inkgames.physics2d');
export const RendererToken = createToken<Renderer2D>('inkgames.webgl2');
export const InkToken = createToken<InkVisual>('inkgames.ink-visual');

/**
 * 墨层诊断接口：仅供测试与调试读取 GPU 场统计量。
 * 刻意与 InkVisual（渲染契约）分开，避免把「GPU 回读」混进游戏逻辑可用面（plan/07 §3）。
 */
export interface InkDiagnostics {
  measureInk(): { total: number; active: number; fixed: number };
  /** 迫使全场重建（rebuild 路径）。 */
  forceRebuild(): void;
  /** 迫使指定笔走局部重绘（redrawStroke 路径）；笔画不存在时返回 false。 */
  forceRedraw(strokeId: number): boolean;
  /** 批量局部重绘：一次性提交整批，避免相交笔重复累加。 */
  forceRedrawBatch(strokeIds: readonly number[]): number;
}
export const InkDiagnosticsToken = createToken<InkDiagnostics>('inkgames.ink-diagnostics');
