import type { EnginePlugin, FixedPhase, PluginManifest, RenderPhase, ServiceToken } from './types';

export const FIXED_PHASES: readonly FixedPhase[] = ['input', 'commands', 'geometry', 'collision', 'physics', 'gameplay'];
export const RENDER_PHASES: readonly RenderPhase[] = ['gpu', 'scene', 'ink', 'ui'];

function versionParts(version: string): [number, number, number] {
  const match = /^(\d+)(?:\.(\d+))?(?:\.(\d+))?$/.exec(version);
  if (!match) throw new Error(`Unsupported version: ${version}`);
  return [Number(match[1]), Number(match[2] ?? 0), Number(match[3] ?? 0)];
}

export function satisfies(version: string, range: string): boolean {
  const current = versionParts(version);
  const operator = range.startsWith('^') ? '^' : range.startsWith('~') ? '~' : '=';
  const expected = versionParts(operator === '=' ? range : range.slice(1));
  if (operator === '^' && current[0] !== expected[0]) return false;
  if (operator === '~' && (current[0] !== expected[0] || current[1] !== expected[1])) return false;
  const comparison = current[0] - expected[0] || current[1] - expected[1] || current[2] - expected[2];
  return operator === '=' ? comparison === 0 : comparison >= 0;
}

function validateManifest(manifest: PluginManifest): void {
  if (!manifest.id) throw new Error('Plugin id is required');
  versionParts(manifest.version);
  if (manifest.fixedPhase && !FIXED_PHASES.includes(manifest.fixedPhase)) throw new Error(`Unknown fixed phase: ${manifest.fixedPhase}`);
  if (manifest.renderPhase && !RENDER_PHASES.includes(manifest.renderPhase)) throw new Error(`Unknown render phase: ${manifest.renderPhase}`);
}

export function resolvePlugins(plugins: readonly EnginePlugin[]): EnginePlugin[] {
  const byId = new Map<string, EnginePlugin>();
  const providers = new Map<symbol, { plugin: EnginePlugin; version: string; token: ServiceToken<unknown> }>();
  for (const plugin of plugins) {
    const manifest = plugin.manifest;
    validateManifest(manifest);
    if (byId.has(manifest.id)) throw new Error(`Duplicate plugin: ${manifest.id}`);
    byId.set(manifest.id, plugin);
    for (const provided of manifest.provides ?? []) {
      versionParts(provided.version);
      if (providers.has(provided.token.key)) throw new Error(`Duplicate provider for ${provided.token.id}`);
      providers.set(provided.token.key, { plugin, version: provided.version, token: provided.token });
    }
  }
  const edges = new Map(plugins.map(plugin => [plugin.manifest.id, new Set<string>()]));
  for (const plugin of plugins) {
    const manifest = plugin.manifest;
    for (const dependency of manifest.requires ?? []) {
      const provider = providers.get(dependency.token.key);
      if (!provider) throw new Error(`${manifest.id} requires missing service ${dependency.token.id}`);
      if (!satisfies(provider.version, dependency.range)) throw new Error(`${manifest.id} requires ${dependency.token.id}@${dependency.range}, got ${provider.version}`);
      if (provider.plugin !== plugin) edges.get(manifest.id)!.add(provider.plugin.manifest.id);
    }
    for (const dependency of manifest.optional ?? []) {
      const provider = providers.get(dependency.token.key);
      if (provider && satisfies(provider.version, dependency.range) && provider.plugin !== plugin) edges.get(manifest.id)!.add(provider.plugin.manifest.id);
    }
    for (const id of manifest.after ?? []) {
      if (!byId.has(id)) throw new Error(`${manifest.id} orders after unknown plugin ${id}`);
      edges.get(manifest.id)!.add(id);
    }
    for (const id of manifest.before ?? []) {
      if (!byId.has(id)) throw new Error(`${manifest.id} orders before unknown plugin ${id}`);
      edges.get(id)!.add(manifest.id);
    }
  }
  const order: EnginePlugin[] = [];
  const visiting = new Set<string>();
  const done = new Set<string>();
  function visit(id: string): void {
    if (visiting.has(id)) throw new Error(`Plugin dependency cycle at ${id}`);
    if (done.has(id)) return;
    visiting.add(id);
    for (const parent of edges.get(id)!) visit(parent);
    visiting.delete(id);
    done.add(id);
    order.push(byId.get(id)!);
  }
  for (const plugin of plugins) visit(plugin.manifest.id);
  return order;
}
