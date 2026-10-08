import type { Engine } from '../core/engine';
import type { Stamped } from '../core/types';

export interface Recording {
  format: 'inkgames.recording';
  version: 1;
  fixedHz: number;
  messages: Stamped[];
}

export function createRecorder(engine: Engine, fixedHz = 60): { readonly recording: Recording; stop(): Recording } {
  const recording: Recording = { format: 'inkgames.recording', version: 1, fixedHz, messages: [] };
  let stopped = false;
  const unsubscribe = engine.commands.onAny(message => {
    if (stopped || ((message.kind === 'DrawStroke' || message.kind === 'EraseStroke') &&
      (message.payload as { source?: string } | null)?.source === 'pointer')) return;
    recording.messages.push({ ...message, payload: structuredClone(message.payload) as unknown });
  });
  return {
    recording,
    stop() { stopped = true; unsubscribe(); return recording; },
  };
}
export function parseRecording(value: string | unknown): Recording {
  const data = typeof value === 'string' ? JSON.parse(value) as unknown : value;
  if (!data || typeof data !== 'object') throw new Error('Recording must be an object');
  const recording = data as Recording;
  if (recording.format !== 'inkgames.recording' || recording.version !== 1 || !Number.isFinite(recording.fixedHz) || recording.fixedHz <= 0 || !Array.isArray(recording.messages)) throw new Error('Invalid recording header');
  if (recording.messages.length > 100_000) throw new Error('Recording too large');
  let previousStep = -1, previousOrder = -1;
  for (const entry of recording.messages) {
    if (!entry || !Number.isSafeInteger(entry.step) || entry.step < 0 || !Number.isSafeInteger(entry.order) || entry.order < 0 || typeof entry.kind !== 'string' || !entry.kind) throw new Error('Invalid recorded command');
    if (entry.step < previousStep || (entry.step === previousStep && entry.order <= previousOrder)) throw new Error('Out of order recording');
    previousStep = entry.step; previousOrder = entry.order;
  }
  return recording;
}
export function createReplay(engine: Engine, source: Recording, fixedHz = 60): { update(): void; done(): boolean } {
  const recording = parseRecording(source);
  if (recording.fixedHz !== fixedHz) throw new Error('Recording fixedHz mismatch');
  let index = 0;
  let lastStep = -1;
  return {
    update() {
      if (engine.currentStep === lastStep) return;
      lastStep = engine.currentStep;
      if (index < recording.messages.length && recording.messages[index].step < engine.currentStep) throw new Error('Replay missed a fixed step');
      while (index < recording.messages.length && recording.messages[index].step === engine.currentStep) {
        const item = recording.messages[index++];
        engine.commands.enqueue(item.kind, item.payload);
      }
    },
    done: () => index >= recording.messages.length,
  };
}
