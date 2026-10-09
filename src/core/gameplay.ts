export type GameplayVerb = 'cut' | 'fall' | 'burn' | 'flow' | 'talk' | 'guard';

export interface GameplaySetup {
  readonly template: string;
  readonly verb: GameplayVerb;
  readonly label: string;
}

const TEMPLATES: Readonly<Record<string, { verb: GameplayVerb; label: string }>> = {
  duel: { verb: 'cut', label: '决斗' },
  'dialogue-timing': { verb: 'talk', label: '对答时机' },
  puzzle: { verb: 'talk', label: '解谜' },
  siege: { verb: 'guard', label: '守城' },
  naval: { verb: 'flow', label: '水战' },
  court: { verb: 'talk', label: '庙堂' },
  beacon: { verb: 'burn', label: '举火' },
  chase: { verb: 'fall', label: '奔袭' },
};

/** One gameplay template. Unknown ids stay as a labelled wait, they do not invent a fight. */
export function defineGameplay(template: string, goal: string): GameplaySetup {
  const known = TEMPLATES[template];
  const verb = known?.verb ?? 'talk';
  const name = known?.label ?? template;
  return { template, verb, label: goal ? `${name}：${goal}` : name };
}
