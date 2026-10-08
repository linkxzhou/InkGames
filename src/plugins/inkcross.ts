import type { EnginePlugin } from '../core/types';
import { SceneToken, StrokeToken, type CircleBody, type Point } from './tokens';
import { loadSceneJSON, type SceneJSON } from './scene-json';

export interface InkCrossState { status: 'ready' | 'playing' | 'won' | 'lost'; ink: number; ball?: CircleBody }
export function createInkCrossPlugin(input: SceneJSON, inkBudget = 500): EnginePlugin & { readonly game: InkCrossState } {
  let state: InkCrossState = { status: 'ready', ink: inkBudget };
  let goal: (Point & { radius: number }) | undefined;
  let store: import('./tokens').StrokeStore;
  let bind: (value: import('./tokens').StrokeStore) => void;
  let prestrokeCount = 0;
  return {
    manifest: {
      id: 'inkcross', version: '1.0.0',
      requires: [{ token: SceneToken, range: '^1.0.0' }, { token: StrokeToken, range: '^1.0.0' }],
      fixedPhase: 'gameplay',
    },
    get game() { return state; },
    register(ctx) {
      ctx.resources.add(ctx.events.on<{ strokeId: number }>('StrokeCreated', event => {
        if (state.status !== 'playing') return;
        const stroke = store.get(event.payload.strokeId);
        if (!stroke || stroke.id <= prestrokeCount) return;
        let cost = 0;
        for (let i = 1; i < stroke.points.length; i++) {
          const a = stroke.points[i - 1], b = stroke.points[i];
          const dx = b.x - a.x, dy = b.y - a.y;
          cost += Math.sqrt(dx * dx + dy * dy) * (a.radius + b.radius) / 4;
        }
        state.ink = Math.max(0, state.ink - cost);
      }));
      bind = value => { store = value; };
    },
    init(ctx) {
      bind(ctx.get(StrokeToken));
      const scene = loadSceneJSON(ctx.get(SceneToken), store, input);
      goal = scene.goal;
      prestrokeCount = store.strokes.length;
      state = { status: 'playing', ink: inkBudget, ball: ctx.get(SceneToken).circles[0] };
      if (!state.ball || !goal) throw new Error('InkCross scene requires a ball and a goal');
    },
    fixedUpdate(ctx) {
      const ball = state.ball;
      if (!ball || !goal || state.status !== 'playing') return;
      const dx = ball.x - goal.x, dy = ball.y - goal.y;
      if (dx*dx + dy*dy <= (ball.radius + goal.radius) ** 2) {
        state.status = 'won'; ctx.events.emit('GoalEntered', { step: ctx.step });
      } else if (ball.y - ball.radius > ctx.get(SceneToken).height) {
        state.status = 'lost'; ctx.events.emit('BallLost', { step: ctx.step });
      }
    },
  };
}
