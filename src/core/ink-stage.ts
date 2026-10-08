import { Body, type Body as MatterBody } from 'matter-js';
import { Application, Container, Matrix } from 'pixi.js';
import { InkWorld } from './ink-world';
import { InkWash } from './ink-wash';
import type { ItemPreset } from '../plugins/items';
import type { PropPaintingId } from '../plugins/prop-brushes';
import { actionStroke, paintProp, type PropPlacement, type PropStroke } from '../plugins/prop-paintings';

export interface InkStageOptions {
  readonly parent: HTMLElement;
  readonly item: ItemPreset;
  readonly onStatus?: (text: string) => void;
}

interface Mark { readonly id: number; readonly x: number; readonly y: number; hit: boolean }
interface BridgeSpec { readonly x: number; readonly y: number; readonly width: number; readonly locked: boolean }

/** A small ink sheet painted once and moved around like a sprite (multiplied over the paper). */
interface InkSprite {
  readonly wash: InkWash;
  /** Where the painting's own origin sits inside the sprite. */
  readonly anchorX: number;
  readonly anchorY: number;
}

type Vec = { x: number; y: number };

/** canvasBackgroundColor for the game sheet; the paper is this × 1.1, a warm xuan tone. */
export const INK_STAGE_PAPER: readonly [number, number, number] = [214, 206, 188];

const ARROW_PARTS: ReadonlySet<string> = new Set(['shaft', 'arrowhead', 'fletch']);
const FIGURE_SCALE = 1.3;

/** Where each page's hero prop is painted on the main sheet (1280×720). */
const HERO: Readonly<Partial<Record<string, PropPlacement>>> = {
  sword: { x: 640, y: 330 },
  blade: { x: 1040, y: 360 },
  spear: { x: 640, y: 300 },
  bow: { x: 640, y: 300 },
  shield: { x: 900, y: 330 },
  'ink-bomb': { x: 640, y: 420, scale: 1.25 },
  'water-brush': { x: 640, y: 300 },
};

/**
 * One Pixi canvas, one Matter world, ink sheets that run the inkEngine pipeline.
 * Everything on screen is painted by the ported brush through PROP_BRUSHES: the paper sheet holds
 * the landscape, river and the page's prop; a transparent sheet multiplied on top takes the strokes
 * that can be washed away; moving things (horse, boat, banner, the figure and what it holds,
 * arrows and jars in flight) are small ink sheets moved as sprites. Bodies stay circles and boxes.
 */
export class InkStage {
  readonly world = new InkWorld();
  readonly app = new Application();
  private sheet!: InkWash;
  private marks!: InkWash;
  private readonly layer = new Container();
  private readonly sprites: InkSprite[] = [];
  private figure: InkSprite[] = [];
  private held: InkSprite | undefined;
  private horse: InkSprite[] = [];
  private boat: InkSprite | undefined;
  private banner: InkSprite[] = [];
  private shot: InkSprite | undefined;
  private threatArrow: InkSprite | undefined;
  private readonly lastVelocity = new Map<number, Vec>();
  private raf = 0;
  private last = 0;
  private accumulator = 0;
  private steps = 0;
  private paused = false;
  private disposed = false;
  private wind = 0;
  private horseX = 260;
  private horseRunning = false;
  private boatX = 300;
  private boatMoving = false;
  private drawing = false;
  private threat: MatterBody | undefined;
  private board: MatterBody | undefined;
  private threatWait = 30;
  private readonly keys = new Set<string>();
  private readonly observers: Array<() => void> = [];
  private readonly marksList: Mark[] = [];
  private readonly bridges: BridgeSpec[] = [];
  private readonly post = { x: 900, y: 540 };

  private constructor(private readonly options: InkStageOptions) {}

  static async create(options: InkStageOptions): Promise<InkStage> {
    const stage = new InkStage(options);
    try { await stage.init(); return stage; }
    catch (error) { await stage.dispose(); throw error; }
  }

  private get id(): string { return this.options.item.id; }

  private async init(): Promise<void> {
    await this.app.init({
      width: 1280, height: 720, preference: 'webgl', autoStart: false,
      backgroundColor: 0xeae2d2, antialias: false, resolution: 1,
    });
    if (this.disposed) return;
    this.app.canvas.style.width = '100%';
    this.app.canvas.style.height = '100%';
    this.app.canvas.style.objectFit = 'contain';
    this.options.parent.appendChild(this.app.canvas);
    const seed = hashId(this.id);
    this.sheet = new InkWash(this.app, { width: 1280, height: 720, seed, background: INK_STAGE_PAPER, paper: true });
    this.marks = new InkWash(this.app, { width: 1280, height: 720, seed: seed + 1, transparent: true });
    this.marks.view.blendMode = 'multiply';
    this.app.stage.addChild(this.sheet.view, this.marks.view, this.layer);
    this.installInput();
    this.mountPhysics(true);
    this.paintSheet();
    this.paintSprites();
    this.paintMarks();
    this.options.onStatus?.(this.options.item.hint);
    this.raf = requestAnimationFrame(this.frame);
  }

  private mountPhysics(placePlayer: boolean): void {
    this.bridges.length = 0;
    this.marksList.length = 0;
    if (this.id === 'water-brush') {
      this.bridges.push({ x: 300, y: 500, width: 420, locked: false }, { x: 920, y: 450, width: 240, locked: true });
    }
    if (this.id === 'spear') {
      this.marksList.push({ id: 1, x: 620, y: 520, hit: false }, { id: 2, x: 760, y: 470, hit: false }, { id: 3, x: 900, y: 520, hit: false });
    }
    if (this.id === 'bow' && !this.board) this.board = this.world.addBody(1040, 480, 36, { isStatic: true, label: 'target' });
    for (const bridge of this.bridges) this.world.addBridge(bridge.x, bridge.y, bridge.width, bridge.locked);
    if (!placePlayer) return;
    const spawn = this.id === 'water-brush' ? { x: 220, y: 360 } : { x: 220, y: 180 };
    Body.setPosition(this.world.player, spawn);
    Body.setVelocity(this.world.player, { x: 0, y: 0 });
  }

  /** The paper sheet: painted once, never washed. */
  private paintSheet(): void {
    const ink = this.sheet;
    const river = this.id === 'boat' || this.id === 'water-brush';
    const land = paintProp('landscape', { x: 0, y: 500, width: 1280 });
    this.paint(ink, river ? land.filter(stroke => stroke.part !== 'ground' && stroke.part !== 'grass') : land);
    if (river) this.paint(ink, paintProp('water', { x: 0, y: 548, width: 1280 }));
    const hero = HERO[this.id];
    if (hero) this.paint(ink, paintProp(this.id as PropPaintingId, hero));
    if (this.id === 'sword') this.paintAction(ink, 'landscape', 'post', [[this.post.x, 640], [this.post.x - 2, 430]]);
    for (const mark of this.marksList) {
      // A straw bale on a stake: the stake, then a short broad wet block for the bale.
      this.paintAction(ink, 'landscape', 'post', [[mark.x, 640], [mark.x, mark.y + 6]], mark.id);
      this.paintAction(ink, 'spear', 'target', [[mark.x - 12, mark.y - 4], [mark.x + 12, mark.y - 2]], mark.id);
    }
    if (this.id === 'bow') {
      this.paintAction(ink, 'landscape', 'post', [[1040, 640], [1040, 500]]);
      this.paintAction(ink, 'bow', 'butt', ringPath(1040, 470, 34, 30));
      this.paintAction(ink, 'bow', 'ring', ringPath(1040, 470, 14, 12));
    }
    if (this.id === 'blade') {
      this.paintAction(ink, 'blade', 'pool', ringPath(520, 400, 26, 18));
      this.paintAction(ink, 'blade', 'poolWarm', ringPath(760, 450, 26, 18));
    }
    for (const bridge of this.bridges.filter(b => b.locked)) this.paintBridge(ink, bridge);
  }

  /** The washable sheet: the bridge the water brush can cut. Cleared on replay/reset. */
  private paintMarks(): void {
    for (const bridge of this.bridges.filter(b => !b.locked)) this.paintBridge(this.marks, bridge);
  }

  private paintBridge(ink: InkWash, bridge: BridgeSpec): void {
    const left = bridge.x - bridge.width / 2;
    this.paintAction(ink, 'landscape', 'ground', [[left, bridge.y + 2], [left + bridge.width / 2, bridge.y - 3], [left + bridge.width, bridge.y + 1]], bridge.x);
  }

  /** Sprites: the figure and what it holds, plus whatever moves on this page. */
  private paintSprites(): void {
    this.figure = [0, 1].map(pose => this.sprite('figure', { x: 80, y: 110, pose, scale: FIGURE_SCALE }, 170, 210));
    const heldScale: Readonly<Partial<Record<string, number>>> = {
      sword: 0.34, blade: 0.36, spear: 0.3, bow: 0.3, shield: 0.32, 'ink-bomb': 0.32, 'water-brush': 0.32, banner: 0.24,
    };
    const scale = heldScale[this.id];
    if (scale) this.held = this.sprite(this.id as PropPaintingId, { x: 110, y: 110, scale, pose: 0 }, 220, 220);
    if (this.id === 'war-horse') this.horse = [0, 1].map(pose => this.sprite('war-horse', { x: 230, y: 160, pose }, 440, 300));
    if (this.id === 'boat') this.boat = this.sprite('boat', { x: 230, y: 130 }, 460, 220);
    if (this.id === 'banner') this.banner = [-1, 0, 1].map(lean => this.sprite('banner', { x: 30, y: 250, pose: lean }, 380, 500));
    // Arrows pivot on the head (where the projectile body is), jars on the belly.
    const arrow = (mirror: boolean): InkSprite => this.sprite('bow', { x: mirror ? 112 : 24, y: 40, scale: 0.42, mirror }, 140, 80,
      { x: mirror ? 112 - 178 * 0.42 : 24 + 178 * 0.42, y: 40 }, ARROW_PARTS);
    if (this.id === 'bow') this.shot = arrow(false);
    if (this.id === 'shield') this.threatArrow = arrow(true);
    if (this.id === 'ink-bomb') this.shot = this.sprite('ink-bomb', { x: 40, y: 70, scale: 0.36 }, 80, 100, { x: 40, y: 62 });
    for (const sprite of [...this.horse, ...this.banner]) sprite.wash.view.visible = false;
    for (const sprite of [this.shot, this.threatArrow]) if (sprite) sprite.wash.view.visible = false;
  }

  private sprite(id: PropPaintingId, at: PropPlacement, width: number, height: number, pivot?: Vec, parts?: ReadonlySet<string>): InkSprite {
    const wash = new InkWash(this.app, { width, height, seed: hashId(`${id}:${at.pose ?? 0}:${at.scale ?? 1}`), transparent: true });
    wash.view.blendMode = 'multiply';
    const strokes = paintProp(id, at);
    this.paint(wash, parts ? strokes.filter(stroke => parts.has(stroke.part)) : strokes);
    this.layer.addChild(wash.view);
    const sprite = { wash, anchorX: pivot?.x ?? at.x, anchorY: pivot?.y ?? at.y };
    this.sprites.push(sprite);
    return sprite;
  }

  private paint(ink: InkWash, strokes: readonly PropStroke[]): void {
    for (const stroke of strokes) ink.paint(stroke);
  }

  private paintAction(ink: InkWash, id: PropPaintingId, part: string, path: ReadonlyArray<readonly [number, number]>, variant = this.steps): void {
    const stroke = actionStroke(id, part, path, variant);
    if (stroke) ink.paint(stroke);
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
        const stroke = actionStroke(this.id === 'blade' ? 'blade' : 'sword', 'slash', [[point.x, point.y]], this.steps);
        if (stroke) {
          this.marks.setBrush(stroke.brush);
          this.marks.setColor(stroke.color);
          this.marks.beginStroke(point, stroke.seed);
        }
        return;
      }
      this.act(point.x, point.y);
    };
    const move = (event: PointerEvent) => {
      if (!this.drawing) return;
      const point = this.local(event);
      if (!point) return;
      if (this.options.item.action === 'erase') this.wipe(point.x, point.y);
      else this.marks.addPoint(point);
    };
    const lift = () => {
      if (!this.drawing) return;
      this.drawing = false;
      if (this.options.item.action === 'swing') {
        this.marks.endStroke();
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

  private local(event: PointerEvent): Vec | undefined {
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
    for (const shot of this.world.projectiles) this.lastVelocity.set(shot.id, { x: shot.body.velocity.x, y: shot.body.velocity.y });
    this.world.step(1 / 60);
    for (const impact of this.world.drainImpacts()) this.onImpact(impact.id, impact.x, impact.y);
    this.steps += 1;
    if (this.id === 'shield') this.tickThreat();
    if (this.horseRunning) {
      this.horseX = 160 + ((this.horseX + 6 - 160) % 960);
      if (this.steps % 14 === 0) {
        const hoof = this.horseX + (this.steps % 28 === 0 ? -150 : 60);
        this.paintAction(this.marks, 'war-horse', 'dust', [[hoof - 20, 622], [hoof + 24, 616]]);
      }
    }
    if (this.boatMoving) {
      this.boatX = 140 + ((this.boatX + 2 - 140) % 1000);
      if (this.steps % 16 === 0) {
        this.paintAction(this.marks, 'boat', 'wake', [[this.boatX - 260, 620], [this.boatX - 170, 612]]);
      }
    }
    if (this.wind && this.steps % 24 === 0) {
      const x = 520 + (this.steps * 37) % 600;
      this.paintAction(this.marks, 'banner', 'gust', [[x, 150], [x + this.wind * 90, 172]]);
    }
  }

  act(x = this.world.player.position.x + 180, y = this.world.player.position.y - 30): void {
    if (this.paused || this.disposed || !this.sheet) return;
    const origin = { x: this.world.player.position.x, y: this.world.player.position.y - 10 };
    switch (this.options.item.action) {
      case 'swing': {
        this.world.attack();
        const wide = this.id === 'blade';
        const path = quadPath(origin, { x: (origin.x + x) / 2, y: Math.min(origin.y, y) - (wide ? 70 : 50) }, { x, y }, 14);
        this.paintAction(this.marks, wide ? 'blade' : 'sword', 'slash', path);
        if (!wide && path.some(([px, py]) => Math.hypot(px - this.post.x, py - this.post.y) < 56)) {
          this.paintAction(this.marks, 'sword', 'splash', [[this.post.x - 24, this.post.y - 10], [this.post.x + 26, this.post.y + 14]]);
          this.options.onStatus?.('剑锋扫过木桩，命中后才泼出墨。');
        } else if (wide) this.options.onStatus?.('刀身的湿墨扫过青、朱两团色墨，叠处按 inkEngine 的混色压暗。');
        else this.options.onStatus?.('挥出一道飞白。剑锋没有碰到木桩，所以没有泼墨。');
        break;
      }
      case 'thrust': {
        this.world.attack();
        this.paintAction(this.marks, 'spear', 'thrust', [[origin.x, origin.y], [x, y]]);
        const hit = this.marksList.filter(mark => !mark.hit && distanceToSegment(mark.x, mark.y, origin.x, origin.y, x, y) < 28);
        for (const mark of hit) {
          mark.hit = true;
          this.paintAction(this.marks, 'spear', 'hit', [[mark.x - 16, mark.y], [mark.x + 18, mark.y - 6]], mark.id + this.steps);
        }
        this.options.onStatus?.(hit.length ? `刺中 ${hit.map(mark => mark.id).join('、')}，同一靶不会再次计数。` : '这一刺没有碰到靶。');
        break;
      }
      case 'projectile':
      case 'blast':
        this.world.attack();
        this.world.launchProjectile(origin.x + 16, origin.y, x, y);
        this.options.onStatus?.(this.id === 'bow' ? '箭已离弦。落到实体上才留下墨迹。' : '墨罐出手。碰到实体才炸开泼墨。');
        break;
      case 'guard':
        this.tryGuard();
        break;
      case 'gallop':
        this.horseRunning = !this.horseRunning;
        this.options.onStatus?.(this.horseRunning ? '马开跑。蹄下扬起的尘按步频写进纸里。' : '马停下，不再添新的尘迹。');
        break;
      case 'wind':
        this.wind = this.wind >= 1 ? -1 : this.wind <= -1 ? 0 : 1;
        this.options.onStatus?.(this.wind === 0 ? '风停了。' : `风向改为${this.wind > 0 ? '东' : '西'}，旗面换成另一幅随风的画，空中添墨丝。`);
        break;
      case 'erase':
        this.wipe(x, y);
        break;
      case 'wake':
        this.boatMoving = !this.boatMoving;
        this.options.onStatus?.(this.boatMoving ? '舟开始走，船尾留下飞白水纹。' : '舟停住。');
        break;
      default:
        break;
    }
  }

  replay(): void {
    if (this.paused || this.disposed || !this.sheet) return;
    const { x, y } = this.world.player.position;
    const velocity = { x: this.world.player.velocity.x, y: this.world.player.velocity.y };
    this.restoreCourse(false);
    Body.setPosition(this.world.player, { x, y });
    Body.setVelocity(this.world.player, velocity);
    this.options.onStatus?.('可擦的墨层已按本页开场重来一遍。');
  }

  private wipe(x: number, y: number): void {
    const changed = this.world.eraseBridge(x, y, 52);
    this.marks.wash(x, y, 52);
    this.options.onStatus?.(changed.length ? '可擦的墨桥被水刷断开，碰撞体跟着换了。锁住的那段还在。' : '这一刷没碰到可擦的桥，锁定桥的墨和碰撞都留着。');
  }

  private tryGuard(): void {
    const player = this.world.player.position;
    const threat = this.threat;
    if (!threat) {
      this.options.onStatus?.('眼前没有来袭，格挡不会凭空落墨。');
      return;
    }
    if (Math.hypot(threat.position.x - player.x, threat.position.y - player.y) >= 120) {
      this.options.onStatus?.('来袭还太远，这次格挡没有成立。');
      return;
    }
    this.world.removeBody(threat);
    this.threat = undefined;
    this.threatWait = 50;
    this.paintAction(this.marks, 'shield', 'block', [[player.x + 30, player.y - 30], [player.x + 44, player.y + 10]]);
    this.options.onStatus?.('格挡成立，箭在盾前碎成一蓬墨。');
  }

  private tickThreat(): void {
    const player = this.world.player.position;
    if (!this.threat) {
      this.threatWait -= 1;
      if (this.threatWait > 0) return;
      this.threat = this.world.addBody(1180, player.y, 12, { frictionAir: 0.01, label: 'threat' });
      Body.setVelocity(this.threat, { x: -7, y: 0 });
      this.options.onStatus?.('右侧有箭袭来。靠近时按空格格挡。');
      return;
    }
    if (Math.hypot(this.threat.position.x - player.x, this.threat.position.y - player.y) < 28) {
      this.world.removeBody(this.threat);
      this.threat = undefined;
      this.threatWait = 70;
      this.world.hurt();
      this.options.onStatus?.('没格开，受击了。这一下不落墨。');
    }
  }

  private onImpact(id: number, x: number, y: number): void {
    const velocity = this.lastVelocity.get(id) ?? { x: 1, y: 0 };
    this.lastVelocity.delete(id);
    if (this.id === 'ink-bomb') {
      this.paintAction(this.marks, 'ink-bomb', 'spill', ringPath(x, y - 6, 18, 12));
      this.paintAction(this.marks, 'ink-bomb', 'burst', [[x - 46, y - 4], [x + 50, y - 12]]);
      this.options.onStatus?.('墨罐落地，浓墨炸开，顺着纸纹洇出去。');
    } else {
      const len = Math.hypot(velocity.x, velocity.y) || 1;
      const ux = velocity.x / len;
      const uy = velocity.y / len;
      // The arrow sticks in where it landed: shaft back along its flight, then a small splash.
      this.paintAction(this.marks, 'bow', 'shaft', [[x - ux * 64, y - uy * 64], [x, y]]);
      this.paintAction(this.marks, 'bow', 'fletch', [[x - ux * 60, y - uy * 60], [x - ux * 74 - uy * 8, y - uy * 74 + ux * 8]]);
      this.paintAction(this.marks, 'bow', 'hit', [[x - 14, y + 4], [x + 16, y - 4]]);
      this.options.onStatus?.('箭落到实体上，扎住的地方才溅开墨。');
    }
  }

  private draw(): void {
    if (!this.sheet) return;
    this.marks.update();
    const { x, y } = this.world.player.position;
    const attack = this.world.state === 'attack';
    this.figure.forEach((sprite, pose) => {
      sprite.wash.view.visible = (pose === 1) === attack;
      // The painted feet sit 62px (×scale) below the figure's origin; the body's bottom is 18px below its centre.
      place(sprite, x, y + 18 - 62 * FIGURE_SCALE);
      sprite.wash.view.tint = this.world.state === 'hurt' ? 0xffb0a0 : 0xffffff;
    });
    if (this.held) {
      const view = this.held.wash.view;
      const hx = x + (attack ? 26 : 18);
      const hy = y - (attack ? 18 : 4);
      // Held copy tilts forward while attacking; set the transform from a basis, no trig.
      const tilt = attack ? { c: 0.6, s: 0.8 } : { c: 0.97, s: 0.24 };
      view.setFromMatrix(new Matrix(tilt.c, tilt.s, -tilt.s, tilt.c, 0, 0)
        .append(new Matrix(1, 0, 0, 1, -this.held.anchorX, -this.held.anchorY))
        .prepend(new Matrix(1, 0, 0, 1, hx, hy)));
    }
    this.horse.forEach((sprite, pose) => {
      sprite.wash.view.visible = this.horseRunning ? Math.floor(this.steps / 8) % 2 === pose : pose === 0;
      place(sprite, this.horseX, 500);
    });
    if (this.boat) place(this.boat, this.boatX, 580);
    this.banner.forEach((sprite, index) => {
      sprite.wash.view.visible = index - 1 === this.wind;
      place(sprite, 300, 400);
    });
    if (this.threatArrow) {
      this.threatArrow.wash.view.visible = Boolean(this.threat);
      if (this.threat) place(this.threatArrow, this.threat.position.x, this.threat.position.y);
    }
    const shots = this.world.projectiles;
    if (this.shot) {
      const view = this.shot.wash.view;
      const shot = shots[0];
      view.visible = Boolean(shot);
      if (shot) {
        const v = shot.body.velocity;
        const len = Math.hypot(v.x, v.y) || 1;
        const c = this.id === 'bow' ? v.x / len : 1;
        const s = this.id === 'bow' ? v.y / len : 0;
        view.setFromMatrix(new Matrix(c, s, -s, c, 0, 0)
          .append(new Matrix(1, 0, 0, 1, -this.shot.anchorX, -this.shot.anchorY))
          .prepend(new Matrix(1, 0, 0, 1, shot.body.position.x, shot.body.position.y)));
      }
    }
    this.app.render();
  }

  togglePause(): boolean {
    this.paused = !this.paused;
    this.last = 0;
    this.accumulator = 0;
    if (this.paused) this.marks?.endStroke();
    return this.paused;
  }

  pause(): void { this.paused = true; this.last = 0; this.accumulator = 0; }

  reset(): void {
    if (!this.sheet) return;
    this.world.resetPlayer();
    if (this.threat) { this.world.removeBody(this.threat); this.threat = undefined; }
    this.horseRunning = false;
    this.boatMoving = false;
    this.wind = 0;
    this.horseX = 260;
    this.boatX = 300;
    this.threatWait = 30;
    this.drawing = false;
    this.restoreCourse(true);
    this.options.onStatus?.('角色和可擦的墨层已回到这一页的开场。');
  }

  private restoreCourse(placePlayer: boolean): void {
    this.world.clearBridges();
    if (this.board) { this.world.removeBody(this.board); this.board = undefined; }
    this.mountPhysics(placePlayer);
    this.marks.clear();
    this.paintMarks();
  }

  async dispose(): Promise<void> {
    if (this.disposed) return;
    this.disposed = true;
    cancelAnimationFrame(this.raf);
    for (const cleanup of this.observers.splice(0)) cleanup();
    if (this.threat) this.world.removeBody(this.threat);
    this.world.dispose();
    for (const sprite of this.sprites.splice(0)) sprite.wash.dispose();
    this.marks?.dispose();
    this.sheet?.dispose();
    this.app.destroy(true, { children: true });
  }
}

function place(sprite: InkSprite, x: number, y: number): void {
  sprite.wash.view.position.set(x - sprite.anchorX, y - sprite.anchorY);
}

function ringPath(cx: number, cy: number, rx: number, ry: number): Array<readonly [number, number]> {
  // An octagon is enough for a hand-drawn loop; the spring rounds the corners.
  const k = 0.7071067811865476;
  return [[1, 0], [k, k], [0, 1], [-k, k], [-1, 0], [-k, -k], [0, -1], [k, -k], [1, 0]]
    .map(([u, v]) => [cx + (u ?? 0) * rx, cy + (v ?? 0) * ry] as const);
}

function hashId(id: string): number {
  let n = 2166136261;
  for (let i = 0; i < id.length; i++) n = Math.imul(n ^ id.charCodeAt(i), 16777619);
  return n >>> 0;
}

function quadPath(a: Vec, b: Vec, c: Vec, steps: number): Array<readonly [number, number]> {
  const points: Array<readonly [number, number]> = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const u = 1 - t;
    points.push([u * u * a.x + 2 * u * t * b.x + t * t * c.x, u * u * a.y + 2 * u * t * b.y + t * t * c.y]);
  }
  return points;
}

function distanceToSegment(px: number, py: number, ax: number, ay: number, bx: number, by: number): number {
  const dx = bx - ax;
  const dy = by - ay;
  const len2 = dx * dx + dy * dy || 1;
  const t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / len2));
  return Math.hypot(px - (ax + dx * t), py - (ay + dy * t));
}
