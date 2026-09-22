package com.amrshbib.sound

/**
 * The five names, shared with `src/types.js`.
 *
 * Plain strings rather than an enum because they cross the bridge as strings, and an enum here
 * would only mean a `valueOf` that throws on a typo — where the right answer to a name this
 * side does not know is to do nothing.
 */
internal object Sounds {
  const val TICK = "tick"
  const val UNTICK = "untick"
  const val TAP = "tap"
  const val SUCCESS = "success"
  const val ERROR = "error"
}
