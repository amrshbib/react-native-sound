package com.amrshbib.sound

import android.content.Context
import android.media.AudioManager
import android.provider.Settings
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

/**
 * The Android half of @amrshbib/react-native-sound.
 *
 * Everything routes through one `AudioManager`. `View.playSoundEffect` would be the more
 * idiomatic door and is a one-liner, but it needs a View — and a module that has to reach into
 * the view hierarchy to click cannot be called from a saga, a socket handler, or anywhere else
 * the interesting moments actually happen. It is also the same reason the haptics package beside
 * this one refuses `View.performHapticFeedback`.
 *
 * Nothing here opens a stream, holds a `SoundPool`, or takes audio focus. `playSoundEffect` hands
 * the request to the system, which plays it on `STREAM_SYSTEM` at the volume the user set for
 * touch sounds and mixes it under whatever is already playing. An app that needs its own sounds
 * wants a player; this is for the ones the phone already has.
 */
class SoundFeedbackModule(private val context: ReactApplicationContext) :
  ReactContextBaseJavaModule(context) {

  companion object {
    const val NAME = "SoundFeedback"
  }

  override fun getName() = NAME

  /**
   * Resolved once and kept. `getSystemService` is cheap but not free, and this is on the path of
   * every tap in the app.
   */
  private val audio: AudioManager? by lazy {
    try {
      context.getSystemService(Context.AUDIO_SERVICE) as? AudioManager
    } catch (ignored: Throwable) {
      null
    }
  }

  /**
   * Settings › Sound › Touch sounds, as the user left it.
   *
   * `playSoundEffect` already honours this below us, so the check is not what makes the app
   * quiet — it is what lets `getCapabilities` answer honestly, and what saves a bridge call per
   * tap for a user who has turned touch sounds off and is never going to hear one.
   */
  @Suppress("DEPRECATION")
  private fun isSystemSoundsEnabled(): Boolean = try {
    Settings.System.getInt(context.contentResolver, Settings.System.SOUND_EFFECTS_ENABLED, 1) == 1
  } catch (ignored: Throwable) {
    true
  }

  @ReactMethod
  fun play(type: String?) {
    val name = type ?: return
    val effect = Effects.effectFor(name) ?: return
    val manager = audio ?: return
    if (!isSystemSoundsEnabled()) return

    try {
      manager.playSoundEffect(effect)
    } catch (ignored: Throwable) {
      // A device that refuses is a device that stays quiet, which is the correct outcome for
      // decoration. Never the reason a screen goes down.
    }
  }

  /**
   * Load the samples before the first one is wanted.
   *
   * The one thing this platform has that iOS does not. Android keeps the UI effects unloaded
   * until something asks, and the first `playSoundEffect` after a cold start pays for reading
   * the sample off disk — which lands the click a beat behind the tap that caused it, and only
   * ever the very first one, which is the worst one to get wrong.
   */
  @ReactMethod
  fun prepare() {
    try {
      audio?.loadSoundEffects()
    } catch (ignored: Throwable) {
    }
  }

  @ReactMethod
  fun unload() {
    try {
      audio?.unloadSoundEffects()
    } catch (ignored: Throwable) {
    }
  }

  @ReactMethod
  fun getCapabilities(promise: Promise) {
    val supported = audio != null
    val result = Arguments.createMap()

    result.putBoolean("supported", supported)
    result.putString("engine", if (supported) "audio-manager" else "none")
    result.putBoolean("systemEnabled", isSystemSoundsEnabled())

    promise.resolve(result)
  }
}
