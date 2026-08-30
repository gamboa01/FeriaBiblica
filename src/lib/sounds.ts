"use client";

// Efectos de sonido sintetizados con Web Audio API — sin archivos de audio.
// Experimental: los navegadores solo permiten reproducir sonido después de
// una interacción real del usuario. `unlockAudio()` crea/retoma el
// AudioContext y debe llamarse dentro de un click real (activar movimiento,
// iniciar carrera); las llamadas posteriores a las funciones de sonido
// reusan ese mismo contexto ya desbloqueado.

let ctx: AudioContext | null = null;

export function unlockAudio() {
  if (typeof window === "undefined") return;
  const AudioCtor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioCtor) return;
  if (!ctx) ctx = new AudioCtor();
  if (ctx.state === "suspended") void ctx.resume();
}

function tone(freq: number, durationMs: number, type: OscillatorType, startDelayMs: number, volume: number) {
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  osc.connect(gain);
  gain.connect(ctx.destination);
  const start = ctx.currentTime + startDelayMs / 1000;
  const end = start + durationMs / 1000;
  gain.gain.setValueAtTime(volume, start);
  gain.gain.exponentialRampToValueAtTime(0.001, end);
  osc.start(start);
  osc.stop(end + 0.02);
}

export function playCorrect() {
  tone(880, 120, "sine", 0, 0.2);
  tone(1174, 160, "sine", 110, 0.2);
}

export function playWrong() {
  tone(220, 280, "sawtooth", 0, 0.15);
}

export function playFinish() {
  [523, 659, 784, 1046].forEach((f, i) => tone(f, 180, "square", i * 120, 0.18));
}

// Suena apenas aparece la pregunta, para que el jugador deje de agitar de
// inmediato en vez de perder tiempo sin darse cuenta de que ya debe leer.
export function playQuestionReady() {
  tone(660, 90, "triangle", 0, 0.22);
  tone(660, 90, "triangle", 140, 0.22);
}
