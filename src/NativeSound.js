import { NativeModules, Platform } from "react-native";

const LINKING_HINT =
  "@amrshbib/react-native-sound: the native module is not linked, so every call is a no-op.\n" +
  Platform.select({
    ios: '- Run "cd ios && pod install", then rebuild the app.\n',
    android: "- Rebuild the app; autolinking picks the module up at build time.\n",
    default: "- Only iOS and Android have system UI sounds; everywhere else this is meant to be a no-op.\n",
  }) +
  "- Restarting Metro is not enough: the native side has to be compiled in.";

const native = NativeModules.SoundFeedback || null;

/**
 * A missing native module must not throw.
 *
 * The same rule the haptics package is built on, and for the same reason: a UI sound is
 * decoration, and decoration that can take a screen down with it is a bug however rare. A build
 * that has not been recompiled yet, a simulator, a web target — all of them go quiet rather
 * than crash, and nothing above this line ever has to ask whether the module is there.
 */
const noop = () => {};
let hasWarned = false;

const warnOnce = () => {
  if (hasWarned || !__DEV__) return;
  hasWarned = true;
  console.warn(LINKING_HINT);
};

export const SoundNative = native || {
  play: () => warnOnce(),
  prepare: noop,
  unload: noop,
  getCapabilities: () => Promise.resolve({ supported: false, engine: "none", systemEnabled: false }),
};

export const isNativeAvailable = !!native;
