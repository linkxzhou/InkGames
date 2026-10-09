import { Bodies, Body, Engine, World, type Body as MatterBody } from 'matter-js';
import type { PropPhysics } from '../plugins/history-props';

/** Logical stage. The canvas CSS fills the page; the camera maps this box onto it. */
export const PROP_VIEW_W = 1600;
export const PROP_VIEW_H = 900;

/** Ink bounds inside the prop sprite, in sprite pixels. */
export interface PropInkBounds {
  readonly minX: number;
  readonly minY: number;
  readonly maxX: number;
  readonly maxY: number;
  readonly spriteW: number;
  readonly spriteH: number;
}

export interface PropInkBox {
  readonly left: number;
  readonly top: number;
  readonly right: number;
  readonly bottom: number;
}

interface InkOffset {
  readonly left: number;
  readonly right: number;
  readonly top: number;
  readonly bottom: number;
}

export interface PropWorld {
  readonly kind: PropPhysics;
  readonly engine: Engine;
  readonly prop: MatterBody;
  readonly ground: MatterBody;
  stake: MatterBody | null;
  bolt: MatterBody | null;
  readonly embers: MatterBody[];
  acted: boolean;
  /** Body position that keeps the painted ink centred, before a fall or a ride. */
  homeX: number;
  homeY: number;
  act(): string;
  step(): void;
  /** Centre the painted ink, then park the stake and the bolt where the camera can see them. */
  place(bounds: PropInkBounds): void;
  /** World box of the painted ink, used to keep the prop on screen. */
  inkBox(body?: MatterBody): PropInkBox;
  focus(): { readonly x: number; readonly y: number };
}

function offsetOf(bounds: PropInkBounds): InkOffset {
  return {
    left: bounds.minX - bounds.spriteW / 2,
    right: bounds.maxX - bounds.spriteW / 2,
    top: bounds.minY - bounds.spriteH / 2,
    bottom: bounds.maxY - bounds.spriteH / 2,
  };
}

function boxAt(x: number, y: number, off: InkOffset): PropInkBox {
  return { left: x + off.left, top: y + off.top, right: x + off.right, bottom: y + off.bottom };
}

/** Matter world for one prop page. Y grows downward, matching the sheet. */
export function createPropWorld(kind: PropPhysics): PropWorld {
  // 0.12 keeps a fall on screen for a few seconds; Matter integrates force with dt².
  const engine = Engine.create({ gravity: { x: 0, y: 0.12, scale: 0.001 } });
  const ground = Bodies.rectangle(PROP_VIEW_W / 2, 860, PROP_VIEW_W + 400, 36, { isStatic: true, friction: 0.9 });
  const y = kind === 'fall' ? 280 : 460;
  const prop = Bodies.rectangle(PROP_VIEW_W / 2, y, 150, 180, {
    friction: 0.4,
    frictionAir: 0.002,
    density: 0.004,
  });
  // Created dynamic first so setStatic(false) can restore a finite mass.
  Body.setStatic(prop, true);
  const stake = kind === 'cut' ? Bodies.rectangle(1100, 520, 40, 140, { isStatic: true }) : null;
  const bolt = kind === 'projectile' || kind === 'guard'
    ? Bodies.circle(kind === 'guard' ? 1280 : 860, 460, 10, { frictionAir: 0.01 })
    : null;
  if (bolt) Body.setStatic(bolt, true);
  const bodies: MatterBody[] = [ground, prop];
  if (stake) bodies.push(stake);
  if (bolt) bodies.push(bolt);
  World.add(engine.world, bodies);
  const embers: MatterBody[] = [];
  let bounds: PropInkBounds | null = null;
  let blowing = false;
  const world: PropWorld = {
    kind,
    engine,
    prop,
    ground,
    stake,
    bolt,
    embers,
    acted: false,
    homeX: prop.position.x,
    homeY: prop.position.y,
    place(next: PropInkBounds): void {
      bounds = next;
      const off = offsetOf(next);
      const cx = (next.minX + next.maxX) / 2;
      const cy = (next.minY + next.maxY) / 2;
      let x = PROP_VIEW_W / 2 - (cx - next.spriteW / 2);
      let y = PROP_VIEW_H / 2 - (cy - next.spriteH / 2);
      // Leave room on the right for a stake, a ride, or a shot, without starting off-centre.
      if (kind === 'cut' || kind === 'move' || kind === 'flow' || kind === 'projectile') x -= 150;
      if (kind === 'guard') x -= 40;
      const restY = y;
      if (kind === 'fall') {
        y = restY - 150;
        if (y + off.top < 28) y = 28 - off.top;
        // Land the 180px body so the ink sits on the ground line and stays inside the frame.
        const landed = Math.min(restY, PROP_VIEW_H - 48 - off.bottom);
        Body.setPosition(ground, { x: PROP_VIEW_W / 2, y: landed + 108 });
      }
      Body.setPosition(prop, { x, y });
      world.homeX = x;
      world.homeY = y;
      const ink = boxAt(x, y, off);
      if (stake) {
        const stakeX = Math.min(PROP_VIEW_W - 70, Math.max(ink.right + 90, x + 160));
        Body.setPosition(stake, { x: stakeX, y: (ink.top + ink.bottom) / 2 + 30 });
      }
      if (bolt) {
        const midY = (ink.top + ink.bottom) / 2;
        if (kind === 'guard') Body.setPosition(bolt, { x: Math.min(PROP_VIEW_W - 36, ink.right + 200), y: midY });
        else Body.setPosition(bolt, { x: ink.right - 20, y: midY - 10 });
      }
    },
    inkBox(body: MatterBody = prop): PropInkBox {
      if (!bounds) {
        return {
          left: body.position.x - 80,
          top: body.position.y - 90,
          right: body.position.x + 80,
          bottom: body.position.y + 90,
        };
      }
      return boxAt(body.position.x, body.position.y, offsetOf(bounds));
    },
    focus(): { readonly x: number; readonly y: number } {
      const box = world.inkBox();
      return { x: (box.left + box.right) / 2, y: (box.top + box.bottom) / 2 };
    },
    act() {
      if (world.acted && kind !== 'wind') return '已经动过';
      world.acted = true;
      if (kind === 'cut' && stake) {
        World.remove(engine.world, stake);
        world.stake = null;
        Body.setAngle(prop, -0.32);
        return '木桩被砍断';
      }
      if (kind === 'fall') {
        Body.setStatic(prop, false);
        return '落下';
      }
      if (kind === 'burn') {
        const at = world.focus();
        for (let i = 0; i < 8; i++) {
          const ember = Bodies.circle(at.x + (i - 3.5) * 16, at.y - 10, 6, { frictionAir: 0.04, density: 0.001 });
          Body.setVelocity(ember, { x: (i - 3.5) * 0.35, y: -3.2 - (i % 3) * 0.4 });
          embers.push(ember);
          World.add(engine.world, ember);
        }
        return '燃起';
      }
      if (kind === 'flow' || kind === 'move') {
        Body.setStatic(prop, false);
        Body.setVelocity(prop, { x: kind === 'flow' ? 1.6 : 1.9, y: 0 });
        return kind === 'flow' ? '顺水走' : '向前';
      }
      if (kind === 'wind') {
        Body.setStatic(prop, false);
        const dir = prop.velocity.x > 0 ? -1 : 1;
        Body.setVelocity(prop, { x: dir * 1.35, y: 0 });
        blowing = true;
        world.acted = false;
        return dir < 0 ? '风向西' : '风向东';
      }
      if (kind === 'guard' && bolt) {
        Body.setStatic(bolt, false);
        Body.setVelocity(bolt, { x: -5.5, y: 0.2 });
        return '格挡来袭';
      }
      if (kind === 'projectile' && bolt) {
        Body.setStatic(bolt, false);
        Body.setVelocity(bolt, { x: 6.2, y: -0.35 });
        return '射出';
      }
      return kind;
    },
    step() {
      Engine.update(engine, 1000 / 60);
      const off = bounds ? offsetOf(bounds) : null;
      if (kind === 'wind' && blowing) {
        const dx = prop.position.x - world.homeX;
        const span = 100;
        let vx = prop.velocity.x === 0 ? -1.35 : prop.velocity.x;
        if (dx > span) vx = -1.35;
        else if (dx < -span) vx = 1.35;
        const x = Math.max(world.homeX - span, Math.min(world.homeX + span, prop.position.x));
        Body.setPosition(prop, { x, y: world.homeY });
        Body.setVelocity(prop, { x: vx, y: 0 });
        Body.setAngle(prop, ((x - world.homeX) / span) * 0.42);
      }
      if ((kind === 'move' || kind === 'flow') && world.acted) {
        const limit = world.homeX + 240;
        if (prop.position.x >= limit) {
          Body.setPosition(prop, { x: limit, y: world.homeY });
          Body.setVelocity(prop, { x: 0, y: 0 });
        } else {
          Body.setPosition(prop, { x: prop.position.x, y: world.homeY });
          Body.setVelocity(prop, { x: kind === 'flow' ? 1.6 : 1.9, y: 0 });
        }
      }
      if (off) {
        const box = boxAt(prop.position.x, prop.position.y, off);
        let x = prop.position.x;
        let y = prop.position.y;
        if (box.left < 16) x += 16 - box.left;
        if (box.right > PROP_VIEW_W - 16) x -= box.right - (PROP_VIEW_W - 16);
        if (box.top < 16) y += 16 - box.top;
        if (box.bottom > PROP_VIEW_H - 16) y -= box.bottom - (PROP_VIEW_H - 16);
        if (x !== prop.position.x || y !== prop.position.y) Body.setPosition(prop, { x, y });
      }
      if (kind === 'guard' && bolt && world.acted) {
        const ink = world.inkBox();
        if (bolt.position.x < ink.right - 10 && bolt.velocity.x < 0) Body.setVelocity(bolt, { x: 4.2, y: -1.4 });
      }
      if (kind === 'projectile' && bolt && world.acted && bolt.position.x > world.homeX + 460) {
        Body.setVelocity(bolt, { x: 0, y: 0 });
      }
      for (const ember of embers) {
        let ex = ember.position.x;
        let ey = ember.position.y;
        if (ex < 20) ex = 20;
        if (ex > PROP_VIEW_W - 20) ex = PROP_VIEW_W - 20;
        if (ey < 24) {
          ey = 24;
          Body.setVelocity(ember, { x: ember.velocity.x * 0.4, y: 0.4 });
        }
        if (ey > PROP_VIEW_H - 30) ey = PROP_VIEW_H - 30;
        if (ex !== ember.position.x || ey !== ember.position.y) Body.setPosition(ember, { x: ex, y: ey });
      }
      if (bolt) {
        let bx = bolt.position.x;
        let by = bolt.position.y;
        if (bx < 20) bx = 20;
        if (bx > PROP_VIEW_W - 20) bx = PROP_VIEW_W - 20;
        if (by < 20) by = 20;
        if (by > PROP_VIEW_H - 20) by = PROP_VIEW_H - 20;
        if (bx !== bolt.position.x || by !== bolt.position.y) {
          Body.setPosition(bolt, { x: bx, y: by });
          Body.setVelocity(bolt, { x: 0, y: 0 });
        }
      }
    },
  };
  return world;
}
