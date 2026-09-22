package com.amrshbib.sound

import android.media.AudioManager

/**
 * The name → `AudioManager` effect table, and the only place an effect constant appears.
 *
 * Android's answer to "play a UI sound" is ten fixed effects, six of which are keyboard sounds.
 * That is the whole palette without shipping audio files, and it is why the vocabulary is five
 * names long. The mapping below is the one place the app's sound is decided on this platform,
 * the way `Vibrations.kt` is for its buzz.
 *
 * Every one of these is whatever the *device's* keyboard sounds like — a Pixel and a Samsung do
 * not agree, and should not. A click that matched across phones would be a click that matched
 * neither, and the point of using the system's own is that it already sounds like the phone the
 * user chose.
 */
internal object Effects {
  fun effectFor(name: String): Int? = when (name) {
    // The affirmative click, and the one the whole package is named after.
    Sounds.TICK -> AudioManager.FX_KEY_CLICK
    // The backspace. Duller and lower than the click on every stock keyboard, which is exactly
    // the asymmetry an untick wants.
    Sounds.UNTICK -> AudioManager.FX_KEYPRESS_DELETE
    // Flatter than FX_KEY_CLICK on most devices: a tap that did something, without the point.
    Sounds.TAP -> AudioManager.FX_KEYPRESS_STANDARD
    // The return key — the sound a phone already makes when something was committed.
    Sounds.SUCCESS -> AudioManager.FX_KEYPRESS_RETURN
    // The only one that means no, and the only one reserved for it.
    Sounds.ERROR -> AudioManager.FX_KEYPRESS_INVALID
    else -> null
  }
}
