import { describe, expect, it } from 'vitest';
import { InkWorld } from '../src/core/ink-world';
import { ITEM_PRESETS, getItemPreset, validateItemPreset } from '../src/plugins/items';

describe('2.0 内建物理与道具', () => {
  it('固定步使角色落在平台上且只维护一个物理世界', () => {
    const world = new InkWorld();
    for (let i = 0; i < 240; i++) world.step(1 / 60);
    expect(world.player.position.y).toBeGreaterThan(580);
    expect(world.player.position.y).toBeLessThan(615);
    world.dispose();
  });

  it('擦桥仅裁掉命中区间并同步更新 Matter 残段；锁定桥保持原状', () => {
    const world = new InkWorld();
    const bridge = world.addBridge(430, 300, 250, false);
    const locked = world.addBridge(430, 260, 250, true);
    const previousBody = world.bodyFor(bridge);
    expect(previousBody).toBeDefined();
    expect(world.eraseBridge(430, 300, 25)).toContain(bridge);
    expect(world.strokes.filter(part => part.id === bridge)).toHaveLength(2);
    expect(world.bodyFor(bridge)).not.toBe(previousBody);
    expect(world.bodyFor(bridge)?.label).toBe(`bridge-${bridge}`);
    expect(world.eraseBridge(430, 260, 25)).not.toContain(locked);
    expect(world.bodyFor(locked)).toBeDefined();
    world.dispose();
  });

  it('角色落地、移动、跳跃、攻击与受击状态由核心固定步推进', () => {
    const world = new InkWorld();
    for (let i = 0; i < 220; i++) world.step(1 / 60);
    expect(world.state).toBe('idle');
    world.move(1);
    world.step(1 / 60);
    expect(world.state).toBe('run');
    world.jump();
    world.step(1 / 60);
    expect(world.state).toBe('jump');
    world.attack();
    world.step(1 / 60);
    expect(world.state).toBe('attack');
    world.hurt();
    world.step(1 / 60);
    expect(world.state).toBe('hurt');
    world.dispose();
  });

  it('投射物只在物理命中时产出一次墨效事件，并在命中后移除', () => {
    const world = new InkWorld();
    const projectileId = world.launchProjectile(640, 250, 640, 460);
    expect(world.projectiles).toHaveLength(1);
    expect(world.drainImpacts()).toEqual([]);
    const impacts: Array<{ id: number; x: number; y: number }> = [];
    for (let i = 0; i < 180; i++) {
      world.step(1 / 60);
      impacts.push(...world.drainImpacts());
    }
    expect(impacts).toHaveLength(1);
    expect(impacts[0].id).toBe(projectileId);
    expect(impacts[0].x).toBeGreaterThan(590);
    expect(world.projectiles).toHaveLength(0);
    expect(world.drainImpacts()).toEqual([]);
    world.dispose();
  });

  it('未命中的投射物离开世界后清理且不会伪造溅墨', () => {
    const world = new InkWorld();
    world.launchProjectile(640, 80, 640, -100);
    world.physics.gravity.y = 0;
    for (let i = 0; i < 180; i++) world.step(1 / 60);
    expect(world.projectiles).toHaveLength(0);
    expect(world.drainImpacts()).toEqual([]);
    world.dispose();
  });

  it('道具协议拒绝缺失效果、重复 ID 与不兼容版本', () => {
    const sword = getItemPreset('sword');
    expect(() => validateItemPreset(sword)).not.toThrow();
    expect(() => validateItemPreset({ ...sword, version: '2.0.0' })).toThrow(/version/i);
    expect(() => validateItemPreset({ ...sword, effects: ['slash', 'unknown'] })).toThrow(/effect/i);
    expect(() => validateItemPreset({ ...sword, effects: ['slash', 'slash'] })).toThrow(/duplicate/i);
    expect(() => validateItemPreset({ ...sword, action: 'projectile', effects: ['slash'] })).toThrow(/projectile/i);
  });

  it('十个道具各有独立路由和实际效果组合', () => {
    expect(ITEM_PRESETS).toHaveLength(10);
    expect(new Set(ITEM_PRESETS.map(item => item.id)).size).toBe(10);
    for (const item of ITEM_PRESETS) {
      expect(item.effects.length).toBeGreaterThan(0);
      expect(item.action).toBeDefined();
    }
    expect(ITEM_PRESETS.find(item => item.id === 'spear')?.action).toBe('thrust');
    expect(ITEM_PRESETS.find(item => item.id === 'bow')?.action).toBe('projectile');
    expect(ITEM_PRESETS.find(item => item.id === 'war-horse')?.action).toBe('gallop');
    expect(ITEM_PRESETS.find(item => item.id === 'banner')?.action).toBe('wind');
  });
});
