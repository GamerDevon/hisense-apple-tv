/* Toast: small message at the bottom of the screen (opacity only, no zoom) */
(function () {
  "use strict";
  var TV = window.TV, $ = TV.$, timer = null;

  function toast(msg, ms) {
    var el = $("toast");
    el.textContent = msg;
    el.className = "on";
    clearTimeout(timer);
    timer = setTimeout(function () { el.className = ""; }, ms || 2200);
  }

  TV.toast = toast;
})();
