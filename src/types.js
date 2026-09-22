/**
 * The vocabulary, and the only strings the native side will answer to.
 *
 * Five names, and five is not an accident. Everything here plays a sound the operating system
 * already owns — the click under a key, the thud under a backspace — so the list can only be as
 * long as the shorter of the two platforms' own lists. Android exposes ten `AudioManager`
 * effects and nothing else without shipping audio files; iOS has hundreds of system sound ids
 * but no way to name one that Android could answer. What is left is the intersection, and
 * naming a sixth event would mean one platform quietly playing nothing.
 *
 * Named for what happened rather than for how it sounds, exactly as `HAPTIC` is: whether
 * ticking an item off should sound like a key or like a confirmation is a fact about the app,
 * and it has to be decided in one place.
 */
export const SOUND = {
  /** Something was ticked off — a checkbox filled, an item bought. The affirmative click. */
  TICK: "tick",
  /** The same thing undone. Duller and lower than `TICK`, the way a backspace is. */
  UNTICK: "untick",
  /** An ordinary tap that did something, when a screen wants one and the tick is too pointed. */
  TAP: "tap",
  /** It worked — a form sent, a home joined. The sound a return key makes. */
  SUCCESS: "success",
  /** It did not, or it will not: a bound refusing to move, a field rejecting what was typed. */
  ERROR: "error",
};

const ALL = new Set(Object.values(SOUND));

export const isSoundType = (type) => ALL.has(type);
