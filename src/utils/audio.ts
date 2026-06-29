/**
 * Safe Web Audio API helper for retro sci-fi sounds.
 * Fully client-side with no external asset requirements.
 */

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  return audioCtx;
}

/**
 * Play a futuristic cursor blip sound.
 */
export function playBlip(pitch = 800, duration = 0.05) {
  const ctx = getAudioContext();
  if (!ctx || ctx.state === "suspended") return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = "sine";
  osc.frequency.setValueAtTime(pitch, ctx.currentTime);
  // Sweet pitch sweep
  osc.frequency.exponentialRampToValueAtTime(pitch / 2, ctx.currentTime + duration);

  gain.gain.setValueAtTime(0.15, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start();
  osc.stop(ctx.currentTime + duration);
}

/**
 * Play a rhythmic scanner tick sweep.
 */
export function playScanTick(progressPercent: number) {
  const ctx = getAudioContext();
  if (!ctx || ctx.state === "suspended") return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  // Pitch goes higher as progress approaches 100%
  const frequency = 400 + progressPercent * 12;

  osc.type = "triangle";
  osc.frequency.setValueAtTime(frequency, ctx.currentTime);
  osc.frequency.setValueAtTime(frequency + 100, ctx.currentTime + 0.02);

  gain.gain.setValueAtTime(0.08, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start();
  osc.stop(ctx.currentTime + 0.08);
}

/**
 * Play a dramatic retro synth fanfare for the final results!
 */
export function playRevealFanfare(isGay: boolean) {
  const ctx = getAudioContext();
  if (!ctx || ctx.state === "suspended") return;

  const playNote = (pitch: number, start: number, duration: number, volume = 0.1) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = isGay ? "sawtooth" : "square"; // Sawtooth is fabulous/expressive, Square is solid/straight
    osc.frequency.setValueAtTime(pitch, start);

    gain.gain.setValueAtTime(volume, start);
    gain.gain.exponentialRampToValueAtTime(0.001, start + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(start);
    osc.stop(start + duration);
  };

  const now = ctx.currentTime;
  if (isGay) {
    // A rising sparkling arpeggio!
    playNote(261.63, now, 0.2); // C4
    playNote(329.63, now + 0.15, 0.2); // E4
    playNote(392.00, now + 0.3, 0.2); // G4
    playNote(523.25, now + 0.45, 0.4, 0.15); // C5
    playNote(659.25, now + 0.6, 0.6, 0.15); // E5
  } else {
    // A solid, highly standard chord
    playNote(196.00, now, 0.2); // G3
    playNote(220.00, now + 0.15, 0.2); // A3
    playNote(196.00, now + 0.3, 0.3); // G3
    playNote(146.83, now + 0.45, 0.6, 0.15); // D3 (very steady!)
  }
}

/**
 * Helper to unlock audio context on first user click.
 */
export function unlockAudio() {
  const ctx = getAudioContext();
  if (ctx && ctx.state === "suspended") {
    ctx.resume();
  }
}
