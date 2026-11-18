/* Blur (frosted glass). Costs GPU time, so older TVs may lag.
   Three ways to turn it off, and it STAYS off (saved in S.blur, also kept by "Reset all settings"):
   Settings > Appearance > Effects, remote key 2, or open the app with ?blur=0 (?blur=1 turns it back on). */
(function () {
  "use strict";
  var TV = window.TV, S = TV.S;

  function blurSupported() {
    try {
      return !!(window.CSS && CSS.supports && (CSS.supports("backdrop-filter", "blur(1px)") || CSS.supports("-webkit-backdrop-filter", "blur(1px)")));
    } catch (e) { return false; }
  }

  function applyBlur() { TV.setClass("blur", !!S.blur); }

  function setBlur(on, notify) {
    S.blur = !!on;
    TV.saveSettings();
    applyBlur();
    if (TV.updateSettings) { TV.updateSettings(); }
    if (notify) { TV.toast(S.blur ? "Blur on (press 2 to turn it off)" : "Blur off"); }
  }

  function initBlur() {
    var m = /[?&]blur=([01])/.exec(window.location.search);
    if (m) { S.blur = (m[1] === "1"); TV.saveSettings(); }
    applyBlur();
  }

  TV.blurSupported = blurSupported;
  TV.setBlur = setBlur;
  TV.initBlur = initBlur;
})();
