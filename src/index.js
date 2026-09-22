import { SoundNative, isNativeAvailable } from "./NativeSound";
import { SOUND, isSoundType } from "./types";

export { SOUND };

/**
 * Sound is a preference, and the switch lives here rather than at every call site.
 *
 * Held in JS for the same reason the haptics one is: a gate that had to cross the bridge to say
 * "no" would cost a round trip per tap to do nothing. It is also the more important of the two
 * switches — a phone that buzzes in a pocket is private, and a phone that clicks in a meeting
 * is not — so the app is expected to set it from wherever it keeps the user's answer, and to
 * default it off if that is what the product wants. Nothing below has to ask.
 */
let isEnabled = true;

/**
 * Two sounds of the same kind inside this many milliseconds are one sound.
 *
 * Wider than the haptics guard, because the failure is worse. Two ticks landing a frame apart
 * are felt as one slightly longer tick; two clicks landing a frame apart are *heard* as a
 * stutter, and a list that fires one per row crossed turns into a rattle. Still well under the
 * ~120ms a deliberate double-tap takes, so nothing a finger meant twice is swallowed.
 */
const MIN_GAP_MS = 40;

let lastType = null;
let lastAt = 0;

const shouldSkip = (type) => {
  const now = Date.now();
  if (type === lastType && now - lastAt < MIN_GAP_MS) return true;

  // Only a sound that actually played moves the clock. Stamping it on the swallowed ones too
  // would make a steady stream silence itself completely after the first one, each skip
  // pushing the window out again.
  lastType = type;
  lastAt = now;
  return false;
};

/** Play one of the five. Unknown names are ignored rather than guessed at. */
export const play = (type = SOUND.TAP) => {
  if (!isEnabled || !isSoundType(type) || shouldSkip(type)) return;
  SoundNative.play(type);
};

/**
 * Warm the sounds.
 *
 * Android keeps its UI effects unloaded until something asks for one, and the first
 * `playSoundEffect` after a cold start pays for loading the sample — late enough to feel like
 * it belongs to the next tap rather than this one. Call this when a screen that will click
 * opens; not per tap, which is the same latency moved. iOS has nothing to warm, and says so by
 * doing nothing.
 */
export const prepare = () => SoundNative.prepare();

/**
 * Give the samples back.
 *
 * Android only, and rarely worth calling: the effects are a few kilobytes shared across the
 * whole system. It is here for an app that goes quiet for a long stretch — a player, a call —
 * and would rather not hold them. The next `play` loads them again.
 */
export const unload = () => SoundNative.unload();

/**
 * What this device can actually do: `{ supported, engine, systemEnabled }`.
 *
 * `engine` is "system-sound" on iOS, "audio-manager" on Android, and "none" when the native
 * module is not linked. `systemEnabled` is the OS-level touch-sounds switch: Android reports it
 * truthfully, and iOS has no public read for it, so it answers `true` and lets the platform
 * enforce the silent switch below us — which it does, for every sound this package plays.
 */
export const getCapabilities = () => SoundNative.getCapabilities();

export const setEnabled = (value) => {
  isEnabled = !!value;
};

export const getEnabled = () => isEnabled;

export const isSupported = () => isNativeAvailable;

/**
 * `onPress={sound(handleSave, SOUND.SUCCESS)}` — a handler with its click in front of it.
 *
 * Saves the wrapper at every call site, and keeps the sound before the work rather than after:
 * the touch is what is being answered, not the result of it.
 */
export const sound = (handler, type = SOUND.TAP) => (...args) => {
  play(type);
  return typeof handler === "function" ? handler(...args) : undefined;
};

export const tick = () => play(SOUND.TICK);
export const untick = () => play(SOUND.UNTICK);
export const tap = () => play(SOUND.TAP);
export const success = () => play(SOUND.SUCCESS);
export const error = () => play(SOUND.ERROR);

/**
 * The one asymmetric call, and the reason this package exists at all.
 *
 * Ticking something off is the affirmative act; untickings it is a correction. They get
 * different sounds for the same reason they get different haptics — a correction that
 * celebrated itself would be lying about what just happened.
 */
export const ticked = (isOn) => play(isOn ? SOUND.TICK : SOUND.UNTICK);

export default {
  SOUND,
  play,
  prepare,
  unload,
  getCapabilities,
  setEnabled,
  getEnabled,
  isSupported,
  sound,
  tick,
  untick,
  tap,
  success,
  error,
  ticked,
};
