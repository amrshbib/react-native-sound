export type SoundType = "tick" | "untick" | "tap" | "success" | "error";

export declare const SOUND: {
  readonly TICK: "tick";
  readonly UNTICK: "untick";
  readonly TAP: "tap";
  readonly SUCCESS: "success";
  readonly ERROR: "error";
};

export interface Capabilities {
  /** False only when the native module is not linked. Every real iPhone and Android can click. */
  supported: boolean;
  engine: "system-sound" | "audio-manager" | "none";
  /**
   * The OS-level touch-sounds switch. Android reports it truthfully; iOS has no public read for
   * the ringer switch or for Keyboard Clicks and always reports `true`, so never branch on it to
   * decide whether to call — the platform enforces it below this library either way.
   */
  systemEnabled: boolean;
}

export declare function play(type?: SoundType): void;
/** Android loads its UI samples; iOS has nothing to warm and does nothing. */
export declare function prepare(): void;
/** Android gives the samples back; iOS does nothing. The next `play` reloads them. */
export declare function unload(): void;
export declare function getCapabilities(): Promise<Capabilities>;

export declare function setEnabled(value: boolean): void;
export declare function getEnabled(): boolean;
/** Whether the native module is linked at all. False means every call is a silent no-op. */
export declare function isSupported(): boolean;

export declare function sound<T extends (...args: any[]) => any>(
  handler: T,
  type?: SoundType,
): (...args: Parameters<T>) => ReturnType<T> | undefined;

export declare function tick(): void;
export declare function untick(): void;
export declare function tap(): void;
export declare function success(): void;
export declare function error(): void;
/** `tick` when true, `untick` when false — the asymmetry a checkbox wants. */
export declare function ticked(isOn: boolean): void;

declare const Sound: {
  SOUND: typeof SOUND;
  play: typeof play;
  prepare: typeof prepare;
  unload: typeof unload;
  getCapabilities: typeof getCapabilities;
  setEnabled: typeof setEnabled;
  getEnabled: typeof getEnabled;
  isSupported: typeof isSupported;
  sound: typeof sound;
  tick: typeof tick;
  untick: typeof untick;
  tap: typeof tap;
  success: typeof success;
  error: typeof error;
  ticked: typeof ticked;
};

export default Sound;
