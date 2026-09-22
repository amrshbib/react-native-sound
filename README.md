# @amrshbib/react-native-sound

Semantic UI sounds for React Native. Five named events — a tick, an untick, a tap, a yes, a no —
played with the system's own keyboard and feedback sounds on both platforms. No audio files, no
`AVAudioSession`, no `SoundPool`, nothing added to the bundle.

React Native ships no way to play a UI sound at all. The usual fix is a full audio player — a
library that wants a session, takes focus, ducks the user's music and holds a decoded sample in
memory, all so a checkbox can click. This is the other answer: the phone already owns the sound
a key makes, and it is already the right sound, because it is the one the user's own keyboard
makes.

## Install

```sh
npm install @amrshbib/react-native-sound
cd ios && pod install
```

Autolinked on both platforms. Nothing to add to `Info.plist` and no Android permission — the
system plays the sound, not the app. Rebuild after installing; restarting Metro is not enough.

## Use

```js
import Sound, { SOUND } from "@amrshbib/react-native-sound";

Sound.tick();               // something was ticked off
Sound.untick();             // and undone
Sound.ticked(isChecked);    // whichever of the two the tap produced
Sound.play(SOUND.ERROR);
```

### The five

| Name | Means | iOS | Android |
| --- | --- | --- | --- |
| `tick` | something was ticked off — a checkbox, an item bought | `key_press_click` (1104) | `FX_KEY_CLICK` |
| `untick` | the same thing undone | `key_press_delete` (1105) | `FX_KEYPRESS_DELETE` |
| `tap` | an ordinary tap that did something | `key_press_click` (1104) | `FX_KEYPRESS_STANDARD` |
| `success` | it worked — sent, saved, joined | `Tink` (1057) | `FX_KEYPRESS_RETURN` |
| `error` | it did not, or it will not | `SIMToolkitNegativeACK` (1053) | `FX_KEYPRESS_INVALID` |

Five, and not fifty, because the list can only be as long as the shorter platform's. Android
exposes ten `AudioManager` effects and no more without shipping audio; iOS has hundreds of system
sound ids but nothing Android could answer. What is left is the intersection — and a sixth name
would mean one of the two platforms quietly playing nothing.

The mapping is in exactly two places, one per platform: `SoundIdForName` in `ios/SoundFeedback.m`
and `Effects.kt` on Android. Retuning how an app sounds is editing those.

### Asymmetry

`ticked(isOn)` is the whole reason this exists. A checkbox that plays the same sound going on and
coming off is a checkbox that tells you something happened without telling you what — and every
stock keyboard already has the pair, a bright click for a key and a duller one for a backspace.
This just uses them for the thing they were designed for.

```js
const handlePress = () => {
  Sound.ticked(!checked);   // the state the tap produces, not the one it left
  onPress?.();
};
```

## The switch

```js
Sound.setEnabled(false);
```

Held in JS, so a user who has turned sound off does not pay a bridge crossing per tap to be told
nothing happens. This is the more important of the two feedback switches — a phone that buzzes in
a pocket is private and a phone that clicks in a meeting is not — so set it from wherever the app
keeps the answer, and default it off if that is what the product wants.

The OS switches sit under this one and cannot be overridden: the ringer switch and Keyboard
Clicks on iOS, Settings › Sound › Touch sounds on Android. When either is off, nothing comes out
no matter what `setEnabled` says. That is the user's answer and it outranks the app's.

## Warming up

```js
Sound.prepare();   // when a screen that will click opens
Sound.unload();    // rarely; Android only
```

Android keeps its UI samples unloaded until something asks for one, and the first click after a
cold start pays for reading it off disk — which is the one click that lands behind the tap that
caused it, and the worst one to get wrong. iOS has nothing to warm and does nothing.

## Repeats

Two sounds of the same name inside 40ms are one sound. A list that fires a tick per row crossed
would otherwise rattle: two clicks a frame apart are *heard* as a stutter, where two haptics a
frame apart are merely felt as one longer tick. Well under the ~120ms a deliberate double-tap
takes, so nothing a finger meant twice is swallowed.

## Capabilities

```js
const { supported, engine, systemEnabled } = await Sound.getCapabilities();
```

`engine` is `system-sound` on iOS, `audio-manager` on Android, `none` when the native module is
not linked. `systemEnabled` is truthful on Android; iOS has no public read for its own switches
and answers `true`, so do not branch on it to decide whether to call.

## Not linked

Every call is a silent no-op, with one `console.warn` in `__DEV__`. A UI sound is decoration, and
decoration that can take a screen down with it is a bug however rare — so a build that has not
been recompiled, a simulator, or a web target goes quiet rather than throwing.

## See also

[@amrshbib/react-native-haptic-feedback](https://github.com/amrshbib/react-native-haptic-feedback)
— the same idea for what the phone does rather than what it says. The two are designed to be
called together and switched separately.

## Licence

MIT © Amr Shbib
