import { Bodies, Body, Engine, World, type Body as MatterBody } from 'matter-js';
import type { PropPhysics } from '../plugins/history-props';

export interface PropWorld {
  readonly kind: PropPhysics;
  readonly engine: Engine;
  readonly prop: MatterBody;
  readonly ground: MatterBody;
  stake: MatterBody | null;
  bolt: MatterBody | null;
  readonly embers: MatterBody[];
  acted: boolean;
  act(): string;
  step(): void;
}

/** Matter world for one prop page. Y grows downward, matching the sheet. */
export function createPropWorld(kind: PropPhysics): PropWorld {
  // 0.12 keeps a fall on screen for a few seconds; Matter integrates force with dt².
  const engine = Engine.create({ gravity: { x: 0, y: 0.12, scale: 0.001 } });
  const ground = Bodies.rectangle(480, 500, 1000, 36, { isStatic: true, friction: 0.9 });
  const y = kind === 'fall' ? 150 : kind === 'move' || kind === 'flow' ? 400 : 250;
  const prop = Bodies.rectangle(300, y, 150, 180, {
    friction: 0.4,
    frictionAir: 0.002,
    density: 0.004,
  });
  // Created dynamic first so setStatic(false) can restore a finite mass.
  Body.setStatic(prop, true);
  const stake = kind === 'cut' ? Bodies.rectangle(640, 420, 40, 120, { isStatic: true }) : null;
  const bolt = kind === 'projectile' || kind === 'guard'
    ? Bodies.circle(kind === 'guard' ? 760 : 430, 250, 10, { frictionAir: 0.01 })
    : null;
  if (bolt) Body.setStatic(bolt, true);
  const bodies: MatterBody[] = [ground, prop];
  if (stake) bodies.push(stake);
  if (bolt) bodies.push(bolt);
  World.add(engine.world, bodies);
  const embers: MatterBody[] = [];
  const world: PropWorld = {
    kind,
    engine,
    prop,
    ground,
    stake,
    bolt,
    embers,
    acted: false,
    act() {
      if (world.acted && kind !== 'wind') return '已经动过';
      world.acted = true;
      if (kind === 'cut' && stake) {
        World.remove(engine.world, stake);
        world.stake = null;
        Body.setAngle(prop, -0.4);
        return '木桩被砍断';
      }
      if (kind === 'fall') {
        Body.setStatic(prop, false);
        return '落下';
      }
      if (kind === 'burn') {
        for (let i = 0; i < 6; i++) {
          const ember = Bodies.circle(300 + (i - 2.5) * 14, 210, 6, { frictionAir: 0.02, density: 0.001 });
          Body.setVelocity(ember, { x: (i - 2.5) * 0.6, y: -7 - i * 0.3 });
          embers.push(ember);
          World.add(engine.world, ember);
        }
        return '燃起';
      }
      if (kind === 'flow' || kind === 'move') {
        Body.setStatic(prop, false);
        Body.setVelocity(prop, { x: kind === 'flow' ? 1.5 : 1.8, y: 0 });
        return kind === 'flow' ? '顺水走' : '向前';
      }
      if (kind === 'wind') {
        Body.setStatic(prop, false);
        const dir = prop.velocity.x >= 0 ? -1 : 1;
        Body.setVelocity(prop, { x: dir * 1.3, y: 0 });
        world.acted = false;
        return dir < 0 ? '风向西' : '风向东';
      }
      if (kind === 'guard' && bolt) {
        Body.setStatic(bolt, false);
        Body.setVelocity(bolt, { x: -6, y: 0.4 });
        return '格挡来袭';
      }
      if (kind === 'projectile' && bolt) {
        Body.setStatic(bolt, false);
        Body.setVelocity(bolt, { x: 7, y: -1.2 });
        return '射出';
      }
      return kind;
    },
    step() {
      Engine.update(engine, 1000 / 60);
      if (kind === 'wind') {
        // This Matter build has no per-body gravity scale; pin the flag's height after the step.
        Body.setPosition(prop, { x: prop.position.x, y });
        Body.setVelocity(prop, { x: prop.velocity.x, y: 0 });
      }
      if (kind === 'guard' && bolt && world.acted && bolt.position.x < prop.position.x + 90) {
        Body.setVelocity(bolt, { x: 5, y: -2 });
      }
    },
  };
  return world;
}
