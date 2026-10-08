import { Body, type Body as MatterBody } from 'matter-js';
import { Application, Graphics } from 'pixi.js';
import { InkWorld } from './ink-world';
import {
  INK_BLACK, INK_CINNABAR, INK_INDIGO, INK_PINE, INK_TEA, InkWash,
  type InkPigment, type InkStrokeStyle,
} from './ink-wash';
import {
  aimMotif, arrowMotif, bannerMotif, bladeMotif, boatMotif, bowMotif, buttMotif,
  dashMotif, horseMotif, inkBombMotif, shieldMotif, spearMotif, splashMotif, spillMotif,
  swordMotif, targetMotif, waterBody, waterBrushMotif, type MotifStroke,
} from './ink-motifs';
import type { ItemPreset } from '../plugins/items';

export interface InkStageOptions {
  readonly parent: HTMLElement;
  readonly item: ItemPreset;
  readonly onStatus?: (text: string) => void;
}

interface Mark { readonly id: number; readonly x: number; readonly y: number; hit: boolean }
interface BridgeSpec { readonly x: number; readonly y: number; readonly width: number; readonly locked: boolean }

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
    const id = this.options.item.id;
    if (id === 'boat' || id === 'water-brush') this.paintMotif(waterBody(40, 1240, 545, 160), 'locked', 60, 2);
    if (id === 'sword') {
      this.ink.strokePath([{ x: this.post.x, y: 640 }, { x: this.post.x, y: 420 }], style('pen', 0.7, 'mix', INK_TEA, 9), 'locked', 3);
    }
    for (const mark of this.marks) this.paintMotif(targetMotif(mark.x, mark.y, 1.15), 'erasable', 20 + mark.id, 2);
    if (id === 'bow') this.paintMotif(buttMotif(1040, 470, 1.35), 'locked', 13, 2);
    this.paintProp();
  }

  /** The page's object, drawn with the ink brush into the sheet. */
  private paintProp(): void {
    const id = this.options.item.id;
    if (id === 'sword') this.paintMotif(swordMotif(760, 505, 1.2, 0.12), 'erasable', 30, 3);
    else if (id === 'blade') {
      this.paintMotif(bladeMotif(640, 490, 1.25), 'erasable', 31, 3);
      this.paintMotif(spillMotif(520, 400, INK_INDIGO), 'erasable', 41, 2);
      this.paintMotif(spillMotif(760, 450, INK_CINNABAR), 'erasable', 42, 2);
    } else if (id === 'spear') this.paintMotif(spearMotif(500, 430, 1.35, 0.42), 'erasable', 32, 3);
    else if (id === 'bow') this.paintMotif(bowMotif(560, 400, 1.15), 'erasable', 33, 3);
    else if (id === 'shield') this.paintMotif(shieldMotif(740, 430, 1.3), 'erasable', 34, 3);
    else if (id === 'war-horse') this.paintMotif(horseMotif(this.horseX + 20, 545, 1.35, 0), 'erasable', 35, 3);
    else if (id === 'banner') this.paintMotif(bannerMotif(300, 390, 1.05, this.wind * 56), 'erasable', 36, 3);
    else if (id === 'ink-bomb') this.paintMotif(inkBombMotif(700, 450, 1.45), 'erasable', 37, 3);
    else if (id === 'water-brush') this.paintMotif(waterBrushMotif(560, 470, 1.5), 'erasable', 38, 3);
    else if (id === 'boat') this.paintMotif(boatMotif(this.boatX, 590, 1.2), 'erasable', 39, 3);
  }

  private paintMotif(strokes: readonly MotifStroke[], layer: 'erasable' | 'locked', seed: number, settle: number): void {
    strokes.forEach((stroke, index) => {
      if (stroke.points.length < 2) return;
      this.ink.strokePath(stroke.points, {
        mode: stroke.mode, size: stroke.size, effect: stroke.effect, pigment: stroke.pigment, seed: (seed + index * 17) >>> 0,
      }, layer, settle);
    });
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
      const previous = this.horseX;
      this.horseX = 140 + ((this.horseX + 7 - 140) % 980);
      if (this.steps % 10 === 0) {
        this.ink.wash(previous + 20, 560, 130);
        this.ink.wash(previous + 80, 590, 70);
        this.paintMotif(horseMotif(this.horseX + 20, 545, 1.35, this.steps % 20 < 10 ? 8 : -8), 'erasable', 35 + this.steps, 1);
        this.paintMotif(dashMotif(this.horseX - 10, 628, this.horseX + 24, 634, INK_TEA, 'flyingWhite'), 'erasable', this.steps, 1);
      }
    }
    if (this.boatMoving) {
      const previous = this.boatX;
      this.boatX = 120 + ((this.boatX + 2.2 - 120) % 1000);
      if (this.steps % 12 === 0) {
        this.ink.wash(previous, 600, 120);
        this.paintMotif(boatMotif(this.boatX, 590, 1.2), 'erasable', 39 + this.steps, 1);
        this.paintMotif(dashMotif(this.boatX - 90, 640, this.boatX - 20, 628, INK_INDIGO, 'wet'), 'erasable', this.steps + 3, 1);
      }
    }
    if (this.wind && this.steps % 18 === 0) {
      const x = 200 + (this.steps * 37) % 800;
      this.ink.strokePath(
        [{ x, y: 150 }, { x: x + this.wind * 70, y: 190 }],
        style('pen', 0.4, 'mix', INK_PINE, this.steps), 'erasable', 2,
      );
    }
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
          this.paintMotif(splashMotif(this.post.x, this.post.y + 16, 28, INK_BLACK), 'erasable', this.steps, 1);
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
          this.paintMotif(splashMotif(mark.x, mark.y, 18, INK_CINNABAR), 'erasable', mark.id + this.steps, 1);
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
        this.ink.wash(430, 300, 220);
        this.paintMotif(bannerMotif(300, 390, 1.05, this.wind * 56), 'erasable', 36 + this.steps, 2);
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
    this.paintMotif(shieldMotif(player.x + 36, player.y - 8, 0.55), 'erasable', this.steps + 4, 1);
    this.options.onStatus?.('格挡成立，盾面只在这一下又印上一层。');
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
      this.paintMotif(splashMotif(x, y, 46, INK_BLACK), 'erasable', this.steps, 1);
      this.paintMotif(splashMotif(x + 16, y - 8, 28, INK_CINNABAR), 'erasable', this.steps + 1, 1);
      this.paintMotif(inkBombMotif(x, y, 0.7), 'erasable', this.steps + 2, 1);
      this.options.onStatus?.('墨弹落地。墨从裂开的器形里泼出来。');
    } else {
      this.paintMotif(aimMotif(arrowMotif(1.1), x, y, 1, 0.2), 'erasable', this.steps, 1);
      this.paintMotif(splashMotif(x, y, 24, INK_INDIGO), 'erasable', this.steps + 1, 1);
      this.options.onStatus?.('箭落到实体上，落点才开始晕开。');
    }
  }

  private draw(): void {
    if (!this.ink) return;
    this.ink.update();
    this.props.clear();
    this.actor.clear();
    this.drawActor();
    if (this.threat) {
      const velocity = this.threat.velocity;
      this.traceMotif(aimMotif(arrowMotif(0.85), this.threat.position.x, this.threat.position.y, velocity.x || -1, velocity.y), this.props);
    }
    for (const shot of this.world.projectiles) {
      const velocity = shot.body.velocity;
      const motif = this.options.item.id === 'ink-bomb'
        ? inkBombMotif(shot.body.position.x, shot.body.position.y, 0.35)
        : aimMotif(arrowMotif(0.9), shot.body.position.x, shot.body.position.y, velocity.x || 1, velocity.y);
      this.traceMotif(motif, this.props);
    }
    this.app.render();
  }

  private traceMotif(strokes: readonly MotifStroke[], target: Graphics): void {
    for (const stroke of strokes) {
      const first = stroke.points[0];
      if (!first || stroke.points.length < 2) continue;
      target.moveTo(first.x, first.y);
      for (let i = 1; i < stroke.points.length; i++) {
        const point = stroke.points[i];
        if (point) target.lineTo(point.x, point.y);
      }
      const pigment = stroke.pigment;
      const color = (Math.round(pigment.r * 255) << 16) | (Math.round(pigment.g * 255) << 8) | Math.round(pigment.b * 255);
      target.stroke({ width: 1.2 + stroke.size * 2.6, color, alpha: 0.92, cap: 'round', join: 'round' });
    }
  }

  private drawActor(): void {
    const { x, y } = this.world.player.position;
    const ink = this.world.state === 'hurt' ? 0x7a332c : 0x1a1a1a;
    this.actor.moveTo(x - 8, y - 34).quadraticCurveTo(x + 1, y - 46, x + 10, y - 30)
      .quadraticCurveTo(x + 2, y - 20, x - 6, y - 26)
      .stroke({ width: 2.2, color: ink, cap: 'round', join: 'round' });
    this.actor.moveTo(x, y - 22).lineTo(x, y + 16).stroke({ width: 3.2, color: ink, cap: 'round' });
    this.actor.moveTo(x, y - 6).lineTo(x - 16, y + 10).moveTo(x, y - 4).lineTo(x + 16, y + 6)
      .moveTo(x, y + 16).lineTo(x - 10, y + 40).moveTo(x, y + 16).lineTo(x + 12, y + 40)
      .stroke({ width: 2.6, color: ink, cap: 'round' });
    this.traceMotif(this.heldMotif(x, y), this.actor);
  }

  /** Small copy of the page's object in the hand, same silhouette as the ink painting. */
  private heldMotif(x: number, y: number): MotifStroke[] {
    const attack = this.world.state === 'attack';
    const id = this.options.item.id;
    if (id === 'sword') return swordMotif(x + 36, y - 6, 0.42, attack ? 0.85 : 0.35);
    if (id === 'blade') return bladeMotif(x + 30, y + 4, attack ? 0.48 : 0.36);
    if (id === 'spear') return spearMotif(x + 28, y + 8, 0.42, attack ? 0.9 : 0.55);
    if (id === 'bow') return bowMotif(x + 26, y - 4, 0.32);
    if (id === 'shield') return shieldMotif(x + 34, y - 4, 0.32);
    if (id === 'water-brush') return waterBrushMotif(x + 30, y - 8, 0.4);
    if (id === 'ink-bomb') return inkBombMotif(x + 28, y - 6, 0.32);
    if (id === 'banner') return bannerMotif(x + 24, y + 10, 0.22, this.wind * 20);
    return [];
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
