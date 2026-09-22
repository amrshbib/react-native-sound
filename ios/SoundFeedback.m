#import "SoundFeedback.h"

#import <AudioToolbox/AudioToolbox.h>

static NSString *const kEngineSystemSound = @"system-sound";

/**
 * The name → system sound id table, and the only place an id appears.
 *
 * These are the keyboard and feedback sounds every iPhone already has, so there is nothing to
 * ship and nothing to load. Retuning how the whole app sounds is editing this function.
 *
 *   1104  key_press_click   — the click under a key. The affirmative one.
 *   1105  key_press_delete  — the duller one under a backspace.
 *   1057  Tink              — short, bright, the system's own "that landed".
 *   1053  SIMToolkitNegativeACK — flat and low; the only one here that means no.
 *
 * An id iOS does not recognise plays nothing rather than raising, which is why an unknown
 * *name* returns 0 here and is dropped before the call: a silent failure is the correct
 * outcome for decoration, but it should be one this file chose.
 */
static SystemSoundID SoundIdForName(NSString *name) {
  if ([name isEqualToString:@"tick"]) return 1104;
  if ([name isEqualToString:@"untick"]) return 1105;
  if ([name isEqualToString:@"tap"]) return 1104;
  if ([name isEqualToString:@"success"]) return 1057;
  if ([name isEqualToString:@"error"]) return 1053;
  return 0;
}

@implementation SoundFeedback

RCT_EXPORT_MODULE(SoundFeedback);

/**
 * Nothing here touches UIKit, so there is no reason to take the main thread.
 *
 * Left unset on purpose: React Native then gives the module its own serial queue, and the
 * dispatch into `AudioServicesPlaySystemSound` — which is itself asynchronous — happens off
 * both the JS thread and the main one. A click is allowed to arrive a millisecond late; a
 * dropped frame in the list it was fired from is not.
 */
+ (BOOL)requiresMainQueueSetup {
  return NO;
}

RCT_EXPORT_METHOD(play:(NSString *)name) {
  if (name.length == 0) return;

  SystemSoundID sound = SoundIdForName(name);
  if (sound == 0) return;

  AudioServicesPlaySystemSound(sound);
}

/**
 * Nothing to warm.
 *
 * The system sounds are resident before the app launches — they are the ones the keyboard and
 * the lock screen use — so the first click costs what every other click costs. Kept so a caller
 * does not have to know which platform it is on; Android does have something to load.
 */
RCT_EXPORT_METHOD(prepare) {
}

/**
 * Nothing to give back either, for the same reason.
 *
 * Named `unload` and not `release`, which is what Android's own call is called: ARC forbids a
 * class implementing `-release`, so the one obvious name for this is the one name it cannot
 * have. `unloadSoundEffects` is what the other half does anyway.
 */
RCT_EXPORT_METHOD(unload) {
}

RCT_EXPORT_METHOD(getCapabilities:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject) {
  resolve(@{
    // There is no iOS device that cannot play a system sound, including the simulator — which
    // is the one place a caller might expect silence and will not get it.
    @"supported": @YES,
    @"engine": kEngineSystemSound,
    // iOS exposes no read for the ringer switch or for Settings › Sounds › Keyboard Clicks.
    // Both are obeyed below us — the sound simply does not come out — so this is reported as on
    // rather than guessed at, and a caller must not use it to decide whether to bother.
    @"systemEnabled": @YES,
  });
}

@end
