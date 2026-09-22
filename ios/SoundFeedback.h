#import <React/RCTBridgeModule.h>

/**
 * The iOS half of @amrshbib/react-native-sound.
 *
 * Everything goes through `AudioServicesPlaySystemSound`, which is the one audio call on iOS
 * that does not want an `AVAudioSession`. That matters more than it sounds: the moment a
 * library opens a session to play a 40ms click, it has taken a position on whether the user's
 * music should duck, whether the app records, and what happens when a call arrives — for a
 * sound that is decoration. System sounds take no position. They ride the ringer volume, go
 * silent with the ringer switch, and mix with whatever is already playing.
 *
 * The cost is that there is no volume, no stop, and no file of one's own: a system sound id is
 * a number Apple assigned to a `.caf` in `/System/Library/Audio/UISounds`, and the table that
 * picks them is in the implementation. That is the trade this package is, and an app that needs
 * its own sounds wants a player, not this.
 */
@interface SoundFeedback : NSObject <RCTBridgeModule>

@end
