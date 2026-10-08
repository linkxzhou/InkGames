import { Body, type Body as MatterBody } from 'matter-js';
import { Application, Graphics } from 'pixi.js';
import { InkWorld } from './ink-world';
import {
  INK_BLACK, INK_CINNABAR, INK_INDIGO, INK_PINE, INK_TEA, InkWash,
  type InkPigment, type InkStrokeStyle,
} from './ink-wash';
import type { ItemPreset } from '../plugins/items';

export interface InkStageOptions {
  readonly parent: HTMLElement;
  readonly item: ItemPreset;
  readonly onStatus?: (text: string) => void;
}

interface Mark { readonly id: number; readonly x: number; readonly y: number; hit: boolean }
interface Ripple { readonly x: number; readonly y: number; age: number }
interface BridgeSpec { readonly x: number; readonly y: number; readonly width: number; readonly locked: boolean }

const RING: readonly (readonly [number, number])[] = [
  [1, 0], [0.707, 0.707], [0, 1], [-0.707, 0.707], [-1, 0], [-0.707, -0.707], [0, -1], [0.707, -0.707],
];

/**
 * One Pixi canvas, one Matter world, one ink sheet.
 * Item pages only differ by which public action they fire; they do not own a second clock.
 */
export class InkStage {
  readonly world = new InkWorld();
  readonly app = new Application();
  private ink!: InkWash;
  private readonly actor = new Graphics();
  private readonly props = new Graphics();
  private raf = 0;
  private last = 0;
  private accumulator = 0;
  private steps = 0;
  private paused = false;
  private disposed = false;
  private wind = 0;
  private horseX = 240;
  private horseRunning = false;
  private boatX = 280;
  private boatMoving = false;
  private drawing = false;
  private threat: MatterBody | undefined;
  private board: MatterBody | undefined;
  private threatWait = 30;
  private readonly keys = new Set<string>();
  private readonly observers: Array<() => void> = [];
  private readonly ripples: Ripple[] = [];
  private readonly marks: Mark[] = [];
  private readonly bridges: BridgeSpec[] = [];
  private readonly pigment: InkPigment;
  private readonly post = { x: 900, y: 540 };

  private constructor(private readonly options: InkStageOptions) {
    this.pigment = pigmentOf(options.item.accent);
  }

  static async create(options: InkStageOptions): Promise<InkStage> {
    const stage = new InkStage(options);
    try { await stage.init(); return stage; }
    catch (error) { await stage.dispose(); throw error; }
  }

  private async init(): Promise<void> {
    await this.app.init({
      width: 1280, height: 720, preference: 'webgl', autoStart: false,
      backgroundColor: 0xf4efe4, antialias: false, resolution: 1,
    });
    if (this.disposed) return;
    this.app.canvas.style.width = '100%';
    this.app.canvas.style.height = '100%';
    this.app.canvas.style.objectFit = 'contain';
    this.options.parent.appendChild(this.app.canvas);
    this.ink = new InkWash(this.app, { width: 1280, height: 720, scale: 0.5, seed: hashId(this.options.item.id), paper: 'xuan' });
    this.app.stage.addChild(this.ink.view, this.props, this.actor);
    this.installInput();
    this.mountPhysics(true);
    this.paintSheet();
    this.options.onStatus?.(this.options.item.hint);
    this.raf = requestAnimationFrame(this.frame);
  }

  private mountPhysics(placePlayer: boolean): void {
    this.bridges.length = 0;
    this.marks.length = 0;
    const id = this.options.item.id;
    if (id === 'water-brush') {
      this.bridges.push({ x: 300, y: 500, width: 420, locked: false }, { x: 920, y: 450, width: 240, locked: true });
    }
    if (id === 'spear') {
      this.marks.push({ id: 1, x: 620, y: 520, hit: false }, { id: 2, x: 760, y: 470, hit: false }, { id: 3, x: 900, y: 520, hit: false });
    }
    if (id === 'bow' && !this.board) this.board = this.world.addBody(1040, 480, 36, { isStatic: true, label: 'target' });
    for (const bridge of this.bridges) this.world.addBridge(bridge.x, bridge.y, bridge.width, bridge.locked);
    if (!placePlayer) return;
    const spawn = id === 'water-brush' ? { x: 220, y: 360 } : { x: 220, y: 180 };
    Body.setPosition(this.world.player, spawn);
    Body.setVelocity(this.world.player, { x: 0, y: 0 });
  }

  private paintSheet(): void {
    const ridge: Array<{ x: number; y: number }> = [];
    const far: Array<{ x: number; y: number }> = [];
    for (let i = 0; i <= 18; i++) {
      const x = i * 72;
      ridge.push({ x, y: 250 + (i % 4) * 16 - (i % 3) * 10 });
      far.push({ x, y: 180 + (i % 5) * 8 });
    }
    const ground: Array<{ x: number; y: number }> = [];
    for (let i = 0; i <= 16; i++) ground.push({ x: i * 80, y: 618 + (i % 2) * 2 });
    this.ink.strokePath(far, style('brush', 0.7, 'mix', { r: 0.55, g: 0.58, b: 0.56 }, 2), 'locked', 4);
    this.ink.strokePath(ridge, style('brush', 1.1, 'mix', INK_PINE, 3), 'locked', 6);
    this.ink.strokePath(ground, style('brush', 1.4, 'wet', INK_BLACK, 4), 'locked', 4);
    for (const bridge of this.bridges) {
      const left = bridge.x - bridge.width / 2;
      const points = [];
      for (let i = 0; i <= 10; i++) points.push({ x: left + bridge.width * i / 10, y: bridge.y });
      this.ink.strokePath(points, style('brush', 0.85, 'mix', bridge.locked ? INK_INDIGO : INK_BLACK, 8 + bridge.x), bridge.locked ? 'locked' : 'erasable', 5);
    }
    if (this.options.item.id === 'sword') {
      this.ink.strokePath([{ x: this.post.x, y: 630 }, { x: this.post.x, y: 430 }], style('pen', 0.8, 'mix', INK_BLACK, 9), 'locked', 4);
    }
    if (this.options.item.id === 'blade') {
      this.ink.blot(560, 430, 54, style('brush', 2, 'wet', INK_INDIGO, 11), 'erasable', 6);
      this.ink.blot(700, 470, 48, style('brush', 2, 'wet', INK_CINNABAR, 12), 'erasable', 6);
    }
    if (this.options.item.id === 'bow') this.ink.blot(1040, 480, 34, style('brush', 1, 'mix', INK_TEA, 13), 'locked', 4);
    for (const mark of this.marks) this.ink.blot(mark.x, mark.y, 16, style('pen', 1, 'mix', INK_BLACK, 20 + mark.id), 'erasable', 3);
    this.paintSignature();
  }

  private paintSignature(): void {
    const id = this.options.item.id;
    const origin = { x: 240, y: 520 };
    if (id === 'sword') this.ink.strokePath(quad(origin, { x: 360, y: 400 }, { x: 520, y: 530 }, 18), style('brush', 1.15, 'flyingWhite', INK_BLACK, 30), 'erasable', 8);
    else if (id === 'blade') this.ink.strokePath(quad({ x: 280, y: 500 }, { x: 520, y: 360 }, { x: 780, y: 500 }, 20), style('brush', 2.1, 'wet', INK_BLACK, 31), 'erasable', 8);
    else if (id === 'spear') this.ink.strokePath([{ x: 240, y: 500 }, { x: 560, y: 490 }], style('pen', 0.7, 'flyingWhite', INK_BLACK, 32), 'erasable', 5);
    else if (id === 'ink-bomb') {
      this.ink.blot(640, 420, 46, style('brush', 2, 'wet', INK_BLACK, 33), 'erasable', 6);
      this.ink.blot(690, 400, 36, style('brush', 2, 'wet', INK_CINNABAR, 34), 'erasable', 6);
    } else if (id === 'banner') {
      this.ink.strokePath([{ x: 180, y: 160 }, { x: 460, y: 140 }, { x: 720, y: 180 }], style('brush', 0.6, 'mix', INK_TEA, 35), 'erasable', 4);
    }
  }

  private installInput(): void {
    const down = (event: KeyboardEvent) => {
      this.keys.add(event.code);
      if (event.code === 'Space') { event.preventDefault(); this.act(); }
    };
    const up = (event: KeyboardEvent) => { this.keys.delete(event.code); };
    const pointer = (event: PointerEvent) => {
      const point = this.local(event);
      if (!point) return;
      if (this.options.item.action === 'erase') {
        this.drawing = true;
        this.wipe(point.x, point.y);
        return;
      }
      if (this.options.item.action === 'swing') {
        this.drawing = true;
        this.ink.beginStroke(point, style('brush', this.options.item.id === 'blade' ? 1.8 : 1.1, this.options.item.id === 'blade' ? 'wet' : 'flyingWhite', this.pigment, this.steps + 40));
        return;
      }
      this.act(point.x, point.y);
    };
    const move = (event: PointerEvent) => {
      if (!this.drawing) return;
      const point = this.local(event);
      if (!point) return;
      if (this.options.item.action === 'erase') this.wipe(point.x, point.y);
      else this.ink.addPoint(point);
    };
    const lift = () => {
      if (!this.drawing) return;
      this.drawing = false;
      if (this.options.item.action === 'swing') {
        this.ink.endStroke();
        this.options.onStatus?.('笔已提起，湿墨会再洇开一阵后收干。');
      }
    };
    const lost = (event: Event) => { event.preventDefault(); this.pause(); this.options.onStatus?.('WebGL 上下文已丢失，演示已暂停。'); };
    const restored = () => { this.options.onStatus?.('WebGL 已恢复。请重置演示以重建墨层。'); };
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    this.app.canvas.addEventListener('pointerdown', pointer);
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', lift);
    this.app.canvas.addEventListener('webglcontextlost', lost);
    this.app.canvas.addEventListener('webglcontextrestored', restored);
    this.observers.push(
      () => window.removeEventListener('keydown', down),
      () => window.removeEventListener('keyup', up),
      () => this.app.canvas.removeEventListener('pointerdown', pointer),
      () => window.removeEventListener('pointermove', move),
      () => window.removeEventListener('pointerup', lift),
      () => this.app.canvas.removeEventListener('webglcontextlost', lost),
      () => this.app.canvas.removeEventListener('webglcontextrestored', restored),
    );
  }

  private local(event: PointerEvent): { x: number; y: number } | undefined {
    const rect = this.app.canvas.getBoundingClientRect();
    const scale = Math.min(rect.width / 1280, rect.height / 720);
    if (!scale) return undefined;
    return {
      x: (event.clientX - rect.left - (rect.width - 1280 * scale) / 2) / scale,
      y: (event.clientY - rect.top - (rect.height - 720 * scale) / 2) / scale,
    };
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
    for (const impact of this.world.drainImpacts()) this.onImpact(impact.x, impact.y);
    this.steps += 1;
    if (this.options.item.id === 'shield') this.tickThreat();
    if (this.horseRunning) {
      this.horseX = 140 + ((this.horseX + 7 - 140) % 980);
      if (this.steps % 8 === 0) {
        this.ink.blot(this.horseX - 18, 600, 7, style('pen', 0.45, 'flyingWhite', INK_TEA, this.steps), 'erasable', 2);
        this.ripples.push({ x: this.horseX + 10, y: 590, age: 0 });
      }
    }
    if (this.boatMoving) {
      this.boatX = 120 + ((this.boatX + 2.2 - 120) % 1000);
      if (this.steps % 10 === 0) {
        this.ink.blot(this.boatX - 40, 648, 10, style('brush', 0.5, 'wet', INK_INDIGO, this.steps), 'erasable', 2);
        this.ripples.push({ x: this.boatX - 36, y: 650, age: 0 });
      }
    }
    if (this.wind && this.steps % 18 === 0) {
      const x = 200 + (this.steps * 37) % 800;
      this.ink.strokePath(
        [{ x, y: 150 }, { x: x + this.wind * 70, y: 190 }],
        style('pen', 0.4, 'mix', INK_PINE, this.steps), 'erasable', 2,
      );
    }
    for (const ripple of this.ripples) ripple.age += 1;
    if (this.ripples.length > 24) this.ripples.splice(0, this.ripples.length - 24);
  }

  act(x = this.world.player.position.x + 160, y = this.world.player.position.y - 40): void {
    if (this.paused || this.disposed || !this.ink) return;
    const origin = { x: this.world.player.position.x, y: this.world.player.position.y - 10 };
    switch (this.options.item.action) {
      case 'swing': {
        this.world.attack();
        const wide = this.options.item.id === 'blade';
        const path = quad(origin, { x: (origin.x + x) / 2, y: Math.min(origin.y, y) - (wide ? 70 : 48) }, { x, y }, wide ? 16 : 14);
        this.ink.strokePath(path, style('brush', wide ? 2.2 : 1.2, wide ? 'wet' : 'flyingWhite', wide ? INK_BLACK : this.pigment, this.steps + 7), 'erasable', 6);
        if (!wide && path.some(point => Math.hypot(point.x - this.post.x, point.y - this.post.y) < 56)) {
          this.ink.blot(this.post.x, this.post.y + 20, 18, style('brush', 1, 'mix', INK_BLACK, this.steps), 'erasable', 4);
          this.options.onStatus?.('剑锋扫过木桩，命中后才溅出墨点。');
        } else if (wide) this.options.onStatus?.('宽刃穿过两团色墨，重叠处按更暗的颜色压住。');
        else this.options.onStatus?.('挥出一道飞白。剑锋没有碰到木桩，所以没有溅墨。');
        break;
      }
      case 'thrust': {
        this.world.attack();
        this.ink.strokePath([origin, { x, y }], style('pen', 0.65, 'flyingWhite', INK_BLACK, this.steps + 3), 'erasable', 4);
        const hit = this.marks.filter(mark => !mark.hit && distanceToSegment(mark.x, mark.y, origin.x, origin.y, x, y) < 28);
        for (const mark of hit) {
          mark.hit = true;
          this.ink.blot(mark.x, mark.y, 14, style('brush', 0.8, 'mix', INK_CINNABAR, mark.id + this.steps), 'erasable', 3);
        }
        this.options.onStatus?.(hit.length ? `刺中 ${hit.map(mark => mark.id).join('、')}，同一目标不会再次计数。` : '这一刺没有碰到靶点。');
        break;
      }
      case 'projectile':
      case 'blast':
        this.world.attack();
        this.world.launchProjectile(origin.x + 16, origin.y, x, y);
        this.options.onStatus?.('已经离弦。墨晕要等它碰到实体之后才出现。');
        break;
      case 'guard':
        this.tryGuard();
        break;
      case 'gallop':
        this.horseRunning = !this.horseRunning;
        this.options.onStatus?.(this.horseRunning ? '马开跑。蹄印留在纸上，尘点随步频出现。' : '马停下，不再落新的蹄印。');
        break;
      case 'wind':
        this.wind = this.wind >= 1 ? -1 : this.wind <= -1 ? 0 : 1;
        this.options.onStatus?.(this.wind === 0 ? '风停了。' : `风向改为${this.wind > 0 ? '东' : '西'}，旗面和空中墨丝跟着偏。`);
        break;
      case 'erase':
        this.wipe(x, y);
        break;
      case 'wake':
        this.boatMoving = !this.boatMoving;
        this.options.onStatus?.(this.boatMoving ? '舟开始走，船尾留下会洇开的水墨。' : '舟停住。');
        break;
      default:
        break;
    }
  }

  replay(): void {
    if (this.paused || this.disposed || !this.ink) return;
    const { x, y } = this.world.player.position;
    const velocity = { x: this.world.player.velocity.x, y: this.world.player.velocity.y };
    this.restoreCourse(false);
    Body.setPosition(this.world.player, { x, y });
    Body.setVelocity(this.world.player, velocity);
    this.options.onStatus?.('墨层已按本页的开场笔画重来一遍。');
  }

  private wipe(x: number, y: number): void {
    const changed = this.world.eraseBridge(x, y, 52);
    this.ink.wash(x, y, 52);
    this.ripples.push({ x, y, age: 0 });
    this.options.onStatus?.(changed.length ? '可擦的墨桥被水刷断开，碰撞体跟着换了。锁住的那段还在。' : '这一刷没碰到可擦的桥，锁定桥的墨和碰撞都留着。');
  }

  private tryGuard(): void {
    const player = this.world.player.position;
    const threat = this.threat;
    if (!threat) {
      this.options.onStatus?.('眼前没有来袭，格挡不会凭空画出墨环。');
      return;
    }
    const near = Math.hypot(threat.position.x - player.x, threat.position.y - player.y) < 120;
    if (!near) {
      this.options.onStatus?.('来袭还太远，这次格挡没有成立。');
      return;
    }
    this.world.removeBody(threat);
    this.threat = undefined;
    this.threatWait = 50;
    for (const [dx, dy] of RING) {
      this.ink.blot(player.x + dx * 46, player.y + dy * 28, 8, style('brush', 0.7, 'mix', INK_INDIGO, this.steps + dx * 10), 'erasable', 2);
    }
    this.options.onStatus?.('格挡成立，墨环只在这一下出现。');
  }

  private tickThreat(): void {
    const player = this.world.player.position;
    if (!this.threat) {
      this.threatWait -= 1;
      if (this.threatWait > 0) return;
      this.threat = this.world.addBody(1180, player.y, 12, { frictionAir: 0.01, label: 'threat' });
      Body.setVelocity(this.threat, { x: -7, y: 0 });
      this.options.onStatus?.('右侧有墨点袭来。靠近时按空格格挡。');
      return;
    }
    if (Math.hypot(this.threat.position.x - player.x, this.threat.position.y - player.y) < 28) {
      this.world.removeBody(this.threat);
      this.threat = undefined;
      this.threatWait = 70;
      this.world.hurt();
      this.options.onStatus?.('没格开，受击了。这一下不画墨环。');
    }
  }

  private onImpact(x: number, y: number): void {
    if (this.options.item.id === 'ink-bomb') {
      this.ink.blot(x, y, 40, style('brush', 2, 'wet', INK_BLACK, this.steps), 'erasable', 5);
      this.ink.blot(x + 28, y - 12, 30, style('brush', 1.6, 'wet', INK_CINNABAR, this.steps + 1), 'erasable', 5);
      this.ink.blot(x - 16, y + 18, 26, style('brush', 1.4, 'wet', INK_INDIGO, this.steps + 2), 'erasable', 5);
      this.options.onStatus?.('墨弹落地。几团颜色叠在一起，更暗的压住更浅的。');
    } else {
      this.ink.blot(x, y, 22, style('brush', 1.2, 'wet', INK_INDIGO, this.steps), 'erasable', 5);
      this.options.onStatus?.('箭落到实体上，落点才开始晕开。');
    }
    this.ripples.push({ x, y: y + 8, age: 0 });
  }

  private draw(): void {
    if (!this.ink) return;
    this.ink.update();
    this.props.clear();
    this.actor.clear();
    this.drawProps();
    this.drawActor();
    for (let i = this.ripples.length - 1; i >= 0; i--) {
      const ripple = this.ripples[i];
      if (!ripple || ripple.age > 36) { this.ripples.splice(i, 1); continue; }
      this.props.ellipse(ripple.x, ripple.y, 10 + ripple.age * 2.4, 4 + ripple.age * 0.7)
        .stroke({ width: 1.5, color: 0x355c62, alpha: 0.45 * (1 - ripple.age / 36) });
    }
    if (this.threat) this.props.circle(this.threat.position.x, this.threat.position.y, 8).fill({ color: 0x1a1a1a, alpha: 0.85 });
    for (const shot of this.world.projectiles) {
      this.props.circle(shot.body.position.x, shot.body.position.y, 5).fill(0x1c1c1c);
    }
    this.app.render();
  }

  private drawProps(): void {
    if (this.options.item.action === 'gallop') {
      const stride = this.horseRunning ? (this.steps % 16 < 8 ? 6 : -3) : 0;
      const x = this.horseX;
      this.props.moveTo(x - 36, 575).quadraticCurveTo(x, 548 + stride, x + 40, 572)
        .stroke({ width: 8, color: 0x2a241e, cap: 'round' });
      this.props.moveTo(x - 20, 578).lineTo(x - 28, 612 - stride).moveTo(x + 16, 578).lineTo(x + 26, 612 + stride)
        .stroke({ width: 4, color: 0x2a241e, cap: 'round' });
      this.props.moveTo(x + 30, 558).quadraticCurveTo(x + 70, 540 - stride, x + 48, 590)
        .stroke({ width: 3, color: 0x2a241e, cap: 'round' });
    }
    if (this.options.item.action === 'wake') {
      this.props.moveTo(this.boatX - 58, 636).quadraticCurveTo(this.boatX, 688, this.boatX + 58, 636)
        .stroke({ width: 6, color: 0x243433, cap: 'round' });
      this.props.moveTo(this.boatX - 10, 636).lineTo(this.boatX + 16, 600).stroke({ width: 3, color: 0x243433 });
    }
    if (this.options.item.action === 'wind') {
      const sway = ((this.steps % 48) / 48) * 2;
      const wave = sway < 1 ? sway : 2 - sway;
      const lean = this.wind * (28 + wave * 18);
      this.props.moveTo(180, 620).lineTo(180, 250).stroke({ width: 5, color: 0x3a332c });
      this.props.moveTo(186, 270).quadraticCurveTo(280 + lean, 300 + wave * 16, 390 + lean, 280)
        .lineTo(186, 360).fill({ color: 0x6e3b32, alpha: 0.82 });
    }
  }

  private drawActor(): void {
    const { x, y } = this.world.player.position;
    const ink = this.world.state === 'hurt' ? 0x7a332c : 0x1a1a1a;
    this.actor.circle(x, y - 26, 10).stroke({ width: 2.5, color: ink });
    this.actor.moveTo(x, y - 16).lineTo(x, y + 18).stroke({ width: 3.5, color: ink, cap: 'round' });
    this.actor.moveTo(x, y - 2).lineTo(x - 16, y + 12).moveTo(x, y - 2).lineTo(x + 18, y + 8)
      .moveTo(x, y + 18).lineTo(x - 10, y + 40).moveTo(x, y + 18).lineTo(x + 12, y + 40)
      .stroke({ width: 3, color: ink, cap: 'round' });
    if (this.world.state === 'attack') {
      this.actor.moveTo(x + 8, y - 8).lineTo(x + 46, y - 24).stroke({ width: 3, color: 0x1a1a1a, cap: 'round' });
    }
  }

  togglePause(): boolean {
    this.paused = !this.paused;
    this.last = 0;
    this.accumulator = 0;
    if (this.paused) this.ink.endStroke();
    return this.paused;
  }

  pause(): void { this.paused = true; this.last = 0; this.accumulator = 0; }

  reset(): void {
    if (!this.ink) return;
    this.world.resetPlayer();
    if (this.threat) { this.world.removeBody(this.threat); this.threat = undefined; }
    this.horseRunning = false;
    this.boatMoving = false;
    this.wind = 0;
    this.horseX = 240;
    this.boatX = 280;
    this.threatWait = 30;
    this.ripples.length = 0;
    this.drawing = false;
    this.restoreCourse(true);
    this.options.onStatus?.('角色和墨层已回到这一页的开场。');
  }

  private restoreCourse(placePlayer: boolean): void {
    this.world.clearBridges();
    if (this.board) { this.world.removeBody(this.board); this.board = undefined; }
    this.mountPhysics(placePlayer);
    this.ink.clear();
    this.paintSheet();
  }

  async dispose(): Promise<void> {
    if (this.disposed) return;
    this.disposed = true;
    cancelAnimationFrame(this.raf);
    for (const cleanup of this.observers.splice(0)) cleanup();
    if (this.threat) this.world.removeBody(this.threat);
    this.world.dispose();
    this.ink?.dispose();
    this.app.destroy(true, { children: true });
  }
}

function style(mode: InkStrokeStyle['mode'], size: number, effect: InkStrokeStyle['effect'], pigment: InkPigment, seed: number): InkStrokeStyle {
  return { mode, size, effect, pigment, seed: seed >>> 0 };
}

function pigmentOf(accent: number): InkPigment {
  return { r: ((accent >> 16) & 255) / 255, g: ((accent >> 8) & 255) / 255, b: (accent & 255) / 255 };
}

function hashId(id: string): number {
  let n = 2166136261;
  for (let i = 0; i < id.length; i++) n = Math.imul(n ^ id.charCodeAt(i), 16777619);
  return n >>> 0;
}

function quad(a: { x: number; y: number }, b: { x: number; y: number }, c: { x: number; y: number }, steps: number): Array<{ x: number; y: number }> {
  const points = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const u = 1 - t;
    points.push({ x: u * u * a.x + 2 * u * t * b.x + t * t * c.x, y: u * u * a.y + 2 * u * t * b.y + t * t * c.y });
  }
  return points;
}

function distanceToSegment(px: number, py: number, ax: number, ay: number, bx: number, by: number): number {
  const dx = bx - ax;
  const dy = by - ay;
  const len2 = dx * dx + dy * dy || 1;
  const t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / len2));
  const x = ax + dx * t;
  const y = ay + dy * t;
  return Math.hypot(px - x, py - y);
}
