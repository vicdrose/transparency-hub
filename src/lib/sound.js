let ctx = null;

function ensureCtx() {
  if (!ctx) {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return null;
    ctx = new Ctx();
  }
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

function tone(freq, gain, dur, type = 'sine', delay = 0) {
  const c = ensureCtx();
  if (!c) return;
  const t = c.currentTime + (delay || 0);
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(gain, t + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  osc.connect(g);
  g.connect(c.destination);
  osc.start(t);
  osc.stop(t + dur + 0.05);
}

export function beep() {
  tone(660, 0.06, 0.08, 'square');
  tone(990, 0.04, 0.06, 'square', 0.05);
}

export function selectTone() {
  tone(523.25, 0.08, 0.14, 'sine');
  tone(659.25, 0.08, 0.16, 'sine', 0.08);
  tone(783.99, 0.08, 0.2, 'sine', 0.16);
}

export function warmup() {
  ensureCtx();
}
