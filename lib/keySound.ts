"use client";

/**
 * Mechanical key sounds, played with the Web Audio API.
 *
 * Two sound sets live in /public:
 * - "asmr"   /keys-asmr.m4a (25 KB): per-key press + release clips from the
 *            "ASMR Programming" Mechvibes pack by luv.sora. NOTE: that pack's
 *            licence says "personal use only".
 * - "typing" /keys.m4a (12 KB): six keystrokes cut from a typing recording,
 *            one picked at random per press, no release sound.
 *
 * Switch with PACK below. Until the file loads (or if decoding fails) a small
 * synthesised click is used instead.
 */
const PACK: "asmr" | "typing" = "asmr";

type Clip = [start: number, duration: number]; // seconds

// Offsets into /keys-asmr.m4a for the letters used on the site.
const ASMR: { down: Record<string, Clip>; up: Record<string, Clip> } = {
  down: {
    a: [0.0, 0.0908], d: [0.2556, 0.0768], e: [0.5051, 0.0828], f: [0.7657, 0.0828],
    l: [0.8785, 0.1088], o: [1.1859, 0.1387], p: [1.5173, 0.0908], r: [0.0, 0.0908],
    s: [1.7988, 0.1048], t: [2.0902, 0.1247], v: [0.5051, 0.0828], w: [0.7657, 0.0828],
  },
  up: {
    a: [0.1208, 0.1048], d: [0.3624, 0.1127], e: [0.6179, 0.1177], f: [0.6179, 0.1177],
    l: [1.0172, 0.1387], o: [1.3546, 0.1327], p: [1.6381, 0.1307], r: [0.1208, 0.1048],
    s: [1.9335, 0.1267], t: [1.0172, 0.1387], v: [0.6179, 0.1177], w: [0.6179, 0.1177],
  },
};

let ctx: AudioContext | null = null;
let out: GainNode | null = null;
let buffer: AudioBuffer | null = null;
let typingStarts: number[] = [];
let loading: Promise<void> | null = null;
let lastPick = -1;

// Mute switch, remembered per browser. Components listen for "folio:sound".
const MUTE_KEY = "folio:muted";
let muted: boolean | null = null;

export function isMuted() {
  if (muted === null) {
    try {
      muted = localStorage.getItem(MUTE_KEY) === "1";
    } catch {
      muted = false;
    }
  }
  return muted;
}

export function setMuted(value: boolean) {
  muted = value;
  try {
    localStorage.setItem(MUTE_KEY, value ? "1" : "0");
  } catch {}
  window.dispatchEvent(new Event("folio:sound"));
}

function context() {
  if (ctx) return ctx;
  const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  if (!AC) return null;
  ctx = new AC();
  out = ctx.createGain();
  out.gain.value = 1; // overall volume (the pack recommends 1)
  out.connect(ctx.destination);
  return ctx;
}

/** Locate each keystroke in the "typing" clip, so encoder padding never shifts offsets. */
function findStarts(buf: AudioBuffer) {
  const data = buf.getChannelData(0);
  let peak = 0;
  for (let i = 0; i < data.length; i++) peak = Math.max(peak, Math.abs(data[i]));
  const found: number[] = [];
  const skip = Math.floor(buf.sampleRate * 0.12);
  for (let i = 0; i < data.length; i++) {
    if (Math.abs(data[i]) > peak * 0.2) {
      found.push(Math.max(0, i - buf.sampleRate * 0.003) / buf.sampleRate);
      i += skip;
    }
  }
  return found;
}

/** Fetch and decode the sound file. Safe to call many times; it only loads once. */
export function prepareKeySound() {
  if (loading) return loading;
  if (typeof OfflineAudioContext === "undefined") return Promise.resolve();
  // An offline context can decode before any user gesture, without warnings.
  const decoder = new OfflineAudioContext(1, 1, 44100);
  loading = fetch(PACK === "asmr" ? "/keys-asmr.m4a" : "/keys.m4a")
    .then((r) => r.arrayBuffer())
    .then((data) => decoder.decodeAudioData(data))
    .then((buf) => {
      buffer = buf;
      if (PACK === "typing") typingStarts = findStarts(buf);
    })
    .catch(() => {
      buffer = null;
    });
  return loading;
}

function play(c: AudioContext, [start, duration]: Clip, gain: number, rate = 1) {
  const src = c.createBufferSource();
  src.buffer = buffer;
  src.playbackRate.value = rate;
  const g = c.createGain();
  g.gain.value = gain;
  src.connect(g).connect(out!);
  src.start(c.currentTime, start, duration);
}

function synthClick(c: AudioContext) {
  const t = c.currentTime;
  const len = Math.floor(c.sampleRate * 0.05);
  const noise = c.createBuffer(1, len, c.sampleRate);
  const ch = noise.getChannelData(0);
  for (let i = 0; i < len; i++) ch[i] = (Math.random() * 2 - 1) * (1 - i / len);
  const src = c.createBufferSource();
  src.buffer = noise;
  const band = c.createBiquadFilter();
  band.type = "bandpass";
  band.frequency.value = 2600 + Math.random() * 600;
  const g = c.createGain();
  g.gain.setValueAtTime(0.5, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.05);
  src.connect(band).connect(g).connect(out!);
  src.start(t);
}

/** Play the sound for `letter` going down or coming back up. */
export function playKey(letter: string, kind: "down" | "up" = "down") {
  if (isMuted()) return;
  const c = context();
  if (!c) return;
  if (c.state === "suspended") void c.resume();
  const key = letter.toLowerCase();

  if (!buffer) {
    if (kind === "down") synthClick(c);
    void prepareKeySound();
    return;
  }

  if (PACK === "asmr") {
    const clip = ASMR[kind][key] ?? ASMR[kind].a;
    play(c, clip, kind === "down" ? 1 : 0.7);
  } else if (kind === "down" && typingStarts.length) {
    let pick = Math.floor(Math.random() * typingStarts.length);
    if (pick === lastPick && typingStarts.length > 1) pick = (pick + 1) % typingStarts.length;
    lastPick = pick;
    play(c, [typingStarts[pick], 0.14], 0.85 + Math.random() * 0.15, 0.94 + Math.random() * 0.12);
  }
}
