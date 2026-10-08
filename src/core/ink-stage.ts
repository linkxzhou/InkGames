import { Application, Container, Graphics } from 'pixi.js';
import { InkWorld } from './ink-world';
import { InkEffects } from './ink-effects';
import type { ItemPreset } from '../plugins/items';

export interface InkStageOptions {
  readonly parent: HTMLElement;
  readonly item: ItemPreset;
  readonly onStatus?: (text: string) => void;
}

export class InkStage {
  readonly world = new InkWorld();
  readonly app = new Application();
  private effects!: InkEffects;
  private readonly scene = new Graphics();
  private readonly paper = new Graphics();
  private readonly landscape = new Graphics();
  private readonly water = new Graphics();
  private readonly foreground = new Graphics();
  private raf = 0;
  private last = 0;
  private accumulator = 0;
  private steps = 0;
  private paused = false;
  private disposed = false;
  private readonly keys = new Set<string>();
  private readonly observers: Array<() => void> = [];
  private readonly decorative = new Container();

  private constructor(private readonly options: InkStageOptions) {}

  static async create(options: InkStageOptions): Promise<InkStage> {
    const stage = new InkStage(options);
    try { await stage.init(); return stage; }
    catch (error) { await stage.dispose(); throw error; }
  }

  private async init(): Promise<void> {
    await this.app.init({ width: 1280, height: 720, preference: 'webgl', autoStart: false,
      backgroundColor: 0xf3ead7, antialias: true, resolution: Math.min(2, window.devicePixelRatio || 1) });
    if (this.disposed) return;
    this.app.canvas.style.width = '100%';
    this.app.canvas.style.height = '100%';
    this.app.canvas.style.objectFit = 'contain';
    this.options.parent.appendChild(this.app.canvas);
    this.effects = new InkEffects(this.app);
    this.app.stage.addChild(this.paper, this.landscape, this.water, this.scene, this.effects.layer, this.decorative, this.foreground);
    this.paintBackground();
    this.installInput();
    this.world.addBridge(440, 470, 270, false);
    this.world.addBridge(860, 415, 240, true);
    this.draw();
    this.raf = requestAnimationFrame(this.frame);
  }

  private paintBackground(): void {
    this.paper.rect(0, 0, 1280, 720).fill(0xf3ead7);
    for (let i = 0; i < 60; i++) {
      const x = (i * 233) % 1280;
      const y = (i * 149) % 720;
      this.paper.circle(x, y, (i % 4) + 1).fill({ color: 0xbab5a5, alpha: 0.16 });
    }
    this.landscape.moveTo(0, 380).bezierCurveTo(190, 315, 290, 360, 430, 325)
      .bezierCurveTo(690, 270, 800, 395, 1280, 294).lineTo(1280, 720).lineTo(0, 720)
      .fill({ color: 0x98a59b, alpha: 0.24 });
    this.landscape.moveTo(0, 510).bezierCurveTo(200, 405, 350, 470, 550, 410)
      .bezierCurveTo(760, 355, 1010, 470, 1280, 420).lineTo(1280, 720).lineTo(0, 720)
      .fill({ color: 0x627d74, alpha: 0.17 });
    this.water.rect(0, 620, 1280, 100).fill({ color: 0x71918d, alpha: 0.14 });
  }

  private installInput(): void {
    const down = (event: KeyboardEvent) => { this.keys.add(event.code); if (event.code === 'Space') { event.preventDefault(); this.act(); } };
    const up = (event: KeyboardEvent) => { this.keys.delete(event.code); };
    const pointer = (event: PointerEvent) => {
      const rect = this.app.canvas.getBoundingClientRect();
      const scale = Math.min(rect.width / 1280, rect.height / 720);
      if (!scale) return;
      const x = (event.clientX - rect.left - (rect.width - 1280 * scale) / 2) / scale;
      const y = (event.clientY - rect.top - (rect.height - 720 * scale) / 2) / scale;
      this.act(x, y);
    };
    const lost = (event: Event) => { event.preventDefault(); this.pause(); this.options.onStatus?.('WebGL 上下文已丢失，演示已暂停'); };
    const restored = () => { this.options.onStatus?.('WebGL 已恢复；请重新启动演示以重建资源'); };
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    this.app.canvas.addEventListener('pointerdown', pointer);
    this.app.canvas.addEventListener('webglcontextlost', lost);
    this.app.canvas.addEventListener('webglcontextrestored', restored);
    this.observers.push(() => window.removeEventListener('keydown', down), () => window.removeEventListener('keyup', up),
      () => this.app.canvas.removeEventListener('pointerdown', pointer),
      () => this.app.canvas.removeEventListener('webglcontextlost', lost),
      () => this.app.canvas.removeEventListener('webglcontextrestored', restored));
  }

  private readonly frame = (now: number): void => {
    if (this.disposed) return;
    if (this.paused) {
      this.last = now;
      this.accumulator = 0;
      this.raf = requestAnimationFrame(this.frame);
      return;
    }
    if (!this.last) this.last = now;
    this.accumulator += Math.min(Math.max(0, (now - this.last) / 1000), 0.08);
    this.last = now;
    let updates = 0;
    while (this.accumulator >= 1 / 60 && updates++ < 4) {
      this.fixedStep();
      this.accumulator -= 1 / 60;
    }
    if (this.accumulator > 1 / 60) this.accumulator = 0;
    this.draw();
    this.raf = requestAnimationFrame(this.frame);
  };

  private fixedStep(): void {
    const direction = (this.keys.has('KeyD') || this.keys.has('ArrowRight') ? 1 : 0) -
      (this.keys.has('KeyA') || this.keys.has('ArrowLeft') ? 1 : 0);
    if (this.keys.has('KeyW') || this.keys.has('ArrowUp')) this.world.jump();
    this.world.move(direction);
    this.world.step(1 / 60);
    for (const impact of this.world.drainImpacts()) {
      this.effects.splash(impact.x, impact.y, this.options.item.accent, this.options.item.id === 'ink-bomb' ? 28 : 14);
      this.effects.ripple(impact.x, impact.y, this.options.item.accent);
      this.options.onStatus?.('投射物命中物理表面，落点墨效已触发');
    }
    this.steps++;
    if (this.options.item.effects.includes('dust') && direction && this.steps % 16 === 0) {
      this.effects.splash(this.world.player.position.x, this.world.player.position.y + 18, 0xa69b81, 5);
    }
    if (this.options.item.effects.includes('ripple') && this.steps % 45 === 0) this.effects.ripple(this.world.player.position.x, 625);
  }

  act(x = this.world.player.position.x + 130, y = this.world.player.position.y - 30): void {
    if (this.paused || this.disposed || !this.effects) return;
    const { id, accent } = this.options.item;
    const origin = { x: this.world.player.position.x, y: this.world.player.position.y };
    if (id === 'water-brush') {
      const changed = this.world.eraseBridge(x, y, 55);
      this.effects.ripple(x, y);
      this.options.onStatus?.(changed.length ? '墨桥命中区间已裁切；对应 Matter 碰撞体同步替换' : '未命中可擦墨桥；锁定桥保持实体碰撞');
    } else if (id === 'banner' || id === 'boat' || id === 'shield') {
      this.effects.ripple(x, y, accent);
      this.effects.splash(x, y, accent, 8);
    } else if (id === 'bow' || id === 'ink-bomb') {
      this.world.attack();
      this.world.launchProjectile(origin.x, origin.y - 24, x, y);
      this.options.onStatus?.('投射物已发射；命中物理表面后才会溅墨');
    } else {
      this.world.attack();
      this.effects.slash(origin, { x, y }, accent, id === 'blade' ? 24 : 12);
    }
  }

  private draw(): void {
    if (!this.effects) return;
    this.scene.clear();
    this.foreground.clear();
    this.scene.roundRect(0, 604, 1280, 54, 10).fill({ color: 0x343e3b, alpha: 0.65 });
    for (const bridge of this.world.strokes) {
      this.scene.roundRect(bridge.x - bridge.width / 2, bridge.y - 7, bridge.width, 14, 6)
        .fill({ color: bridge.locked ? 0x2e4a50 : 0x344041, alpha: 0.78 });
    }
    for (const projectile of this.world.projectiles) {
      const { x: shotX, y: shotY } = projectile.body.position;
      this.foreground.circle(shotX, shotY, 8).fill({ color: this.options.item.accent, alpha: 0.9 });
      this.foreground.circle(shotX - 6, shotY - 2, 3).fill({ color: 0x293a3a, alpha: 0.5 });
    }
    const { x, y } = this.world.player.position;
    this.foreground.circle(x, y, 18).fill(this.world.state === 'hurt' ? 0x9b4d3f : 0x273a39);
    this.foreground.circle(x + 5, y - 5, 4).fill({ color: 0xf3ead7, alpha: 0.8 });
    if (this.world.state === 'attack') this.foreground.ellipse(x + 24, y - 5, 16, 5)
      .fill({ color: this.options.item.accent, alpha: 0.55 });
    this.effects.update();
    this.app.render();
  }

  togglePause(): boolean {
    this.paused = !this.paused;
    this.last = 0;
    this.accumulator = 0;
    return this.paused;
  }

  pause(): void { this.paused = true; this.last = 0; this.accumulator = 0; }

  reset(): void {
    this.world.resetPlayer();
    this.effects.splash(180, 135, this.options.item.accent, 15);
    this.options.onStatus?.('角色已重置');
  }

  async dispose(): Promise<void> {
    if (this.disposed) return;
    this.disposed = true;
    cancelAnimationFrame(this.raf);
    for (const cleanup of this.observers.splice(0)) cleanup();
    this.world.dispose();
    this.effects?.dispose();
    this.app.destroy(true, { children: true });
  }
}
