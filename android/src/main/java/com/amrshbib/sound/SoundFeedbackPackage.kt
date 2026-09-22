package com.amrshbib.sound

import com.facebook.react.ReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ViewManager

/**
 * The plain `ReactPackage`, deprecation and all.
 *
 * Newer React Natives would rather this were a `BaseReactPackage` with a module-info provider,
 * and say so at compile time. It is not one on purpose: `ReactPackage` is the one shape that
 * works unchanged from 0.71 — the floor this package claims — through the bridgeless interop
 * layer of 0.83, and this module is four methods, one of which takes a string. There is nothing
 * here for a lazier registration to save.
 */
@Suppress("DEPRECATION", "OVERRIDE_DEPRECATION")
class SoundFeedbackPackage : ReactPackage {
  override fun createNativeModules(reactContext: ReactApplicationContext): List<NativeModule> =
    listOf(SoundFeedbackModule(reactContext))

  override fun createViewManagers(reactContext: ReactApplicationContext): List<ViewManager<*, *>> =
    emptyList()
}
