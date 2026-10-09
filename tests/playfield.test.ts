import { describe, expect, it } from 'vitest';
import {
  ACTOR_RADIUS, KNOCKBACK_CAP, KNOCKBACK_LOCK, MOVE_SPEED, Playfield,
} from '../src/core/playfield';
import { advanceFixedClock, FIXED_DT, MAX_FRAME_SEC } from '../src/core/fixed-clock';
import { footingKind } from '../src/core/slope';
import { bakeHeightField, contactsToStamps, hashBytes, terrainBounds } from '../src/core/terrain-field';

describe('fixed clock and body link', () => {
  it('copies body xy into the link and keeps z', () => {
    const field = new Playfield();
    field.placeActor(40, 80);
    field.stepOnce();
    const pose = field.sample(field.actor.id, 1);
    expect(pose?.z).toBe(40);
    expect(pose?.x).toBeCloseTo(field.actor.position.x, 5);
    expect(pose?.y).toBeCloseTo(field.actor.position.y, 5);
  });

  it('alpha 0 and 1 stick to previous and current', () => {
    const field = new Playfield();
    field.addPolyline([{ x: 0, y: 400 }, { x: 800, y: 400 }]);
    field.placeActor(200, 300);
    field.stepOnce();
    const before = field.sample(field.actor.id, 0);
    field.stepOnce();
    const link = field.link(field.actor.id);
    expect(link).toBeTruthy();
    expect(field.sample(field.actor.id, 0)).toEqual({ x: link?.previousX, y: link?.previousY, z: 40 });
    expect(field.sample(field.actor.id, 1)).toEqual({ x: link?.currentX, y: link?.currentY, z: 40 });
    expect(before?.y).not.toBe(link?.currentY);
  });

  it('drops the remainder and sets alpha to 1 when the catch-up cap trips', () => {
    const primed = advanceFixedClock(0, MAX_FRAME_SEC);
    expect(primed.capped).toBe(false);
    expect(primed.steps).toBe(4);
    const overflow = advanceFixedClock(FIXED_DT * 0.9, MAX_FRAME_SEC);
    expect(overflow.capped).toBe(true);
    expect(overflow.alpha).toBe(1);
    expect(overflow.accumulator).toBe(0);
    expect(overflow.steps).toBe(4);
  });
});

describe('slopes, one-way platforms, knockback', () => {
  it('classifies a shallow normal as walkable and a steep one as a wall', () => {
    expect(footingKind(0, -1)).toBe('walk');
    expect(footingKind(0.5, -Math.sqrt(1 - 0.5 * 0.5))).toBe('walk');
    expect(footingKind(-1, 0)).toBe('wall');
    expect(footingKind(0.94, -0.342)).toBe('wall');
  });

  it('stands on a slope as walkable and treats a near-vertical face as a wall', () => {
    const slope = new Playfield();
    slope.addPolyline([{ x: 0, y: 520 }, { x: 800, y: 360 }]);
    slope.placeActor(280, 400);
    for (let i = 0; i < 90; i++) slope.stepOnce();
    expect(slope.footing.kind).toBe('walk');

    const wall = new Playfield();
    wall.addPolyline([{ x: 420, y: 80 }, { x: 450, y: 700 }]);
    wall.placeActor(360, 400);
    wall.move(1);
    for (let i = 0; i < 40; i++) wall.stepOnce();
    expect(wall.footing.kind).toBe('wall');
    expect(wall.actor.position.x).toBeLessThan(430);
  });

  it('keeps the one-way mask off from below and on from above', () => {
    const below = new Playfield();
    below.addOneWay(200, 400, 220);
    below.placeActor(200, 470);
    below.stepOnce();
    expect(below.oneWayEnabled).toBe(false);
    expect(below.actor.collisionFilter.mask & 0x0002).toBe(0);

    const above = new Playfield();
    above.addOneWay(200, 400, 220);
    above.placeActor(200, 300);
    above.stepOnce();
    expect(above.oneWayEnabled).toBe(true);
    expect(above.actor.collisionFilter.mask & 0x0002).not.toBe(0);
    for (let i = 0; i < 120; i++) above.stepOnce();
    expect(above.actor.position.y).toBeLessThan(400);
    expect(above.actor.position.y + ACTOR_RADIUS).toBeGreaterThan(370);
  });

  it('caps knockback and ignores move input during the 22-step lock', () => {
    const field = new Playfield();
    field.placeActor(200, 100);
    field.hurt(100, 0);
    expect(Math.abs(field.actor.velocity.x)).toBeLessThanOrEqual(KNOCKBACK_CAP + 1e-6);
    expect(Math.abs(field.actor.velocity.x)).toBeGreaterThan(MOVE_SPEED);
    const vx = field.actor.velocity.x;
    field.move(1);
    expect(field.actor.velocity.x).toBe(vx);
    expect(field.inputLock).toBe(KNOCKBACK_LOCK);
    field.stepOnce();
    expect(field.inputLock).toBe(KNOCKBACK_LOCK - 1);
    expect(field.actor.velocity.x).toBeGreaterThan(MOVE_SPEED);
    expect(Math.abs(field.actor.velocity.x)).toBeLessThanOrEqual(KNOCKBACK_CAP + 0.2);
  });
});

describe('bamboo, stamps, height field', () => {
  it('cuts a bamboo once when the sweep reaches it', () => {
    const field = new Playfield();
    field.addPolyline([{ x: 0, y: 600 }, { x: 900, y: 600 }]);
    const id = field.addBamboo(250, 600, 160);
    field.placeActor(190, 540);
    field.move(1);
    field.attack();
    for (let i = 0; i < 8; i++) field.stepOnce();
    expect(field.bambooIntact(id)).toBe(false);
    expect(field.bambooBodies(id)).toHaveLength(2);
  });

  it('splits one bamboo body into a root and an upper body', () => {
    const field = new Playfield();
    const id = field.addBamboo(300, 560, 180);
    expect(field.bambooBodies(id)).toHaveLength(1);
    expect(field.bambooIntact(id)).toBe(true);
    expect(field.cutBamboo(id)).toBe(true);
    const parts = field.bambooBodies(id);
    expect(parts).toHaveLength(2);
    expect(parts.map(body => body.label).sort()).toEqual(['bamboo-root', 'bamboo-upper']);
    expect(parts.find(body => body.label === 'bamboo-root')?.isStatic).toBe(true);
    expect(parts.find(body => body.label === 'bamboo-upper')?.isStatic).toBe(false);
    expect(field.bambooIntact(id)).toBe(false);
  });

  it('turns contacts into at most eight UV stamps and hashes the height field stably', () => {
    const points = [
      { x: 0, y: 500 },
      { x: 400, y: 420 },
      { x: 800, y: 460 },
    ];
    const bounds = terrainBounds(points);
    const contacts = Array.from({ length: 12 }, (_, i) => ({ x: 20 + i * 30, y: 450 }));
    const stamps = contactsToStamps(contacts, bounds);
    expect(stamps).toHaveLength(8);
    expect(stamps[0]?.u).toBeGreaterThanOrEqual(0);
    expect(stamps[0]?.u).toBeLessThanOrEqual(1);
    const first = bakeHeightField(points, 32, 16);
    const second = bakeHeightField(points, 32, 16);
    expect(hashBytes(first)).toBe(hashBytes(second));
    const shifted = bakeHeightField([{ x: 0, y: 500 }, { x: 400, y: 300 }, { x: 800, y: 460 }], 32, 16);
    expect(hashBytes(shifted)).not.toBe(hashBytes(first));
  });
});
