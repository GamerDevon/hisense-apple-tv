/* Automatic wallpaper change every N minutes (S.wpAuto, 0 = off) */
(function () {
  "use strict";
  var TV = window.TV, S = TV.S, timer = null;
  var MINUTES = [0, 1, 5, 15, 30, 60];

  function setupWpTimer() {
    clearInterval(timer);
    timer = null;
    if (!S.wpAuto) { return; }
    timer = setInterval(function () {
      /* never swap while the user is in Settings or the screensaver is up */
      if (TV.panelOpen || TV.saverOn || !TV.ready) { return; }
      TV.setWallpaper(TV.wpIdx + 1, true);
    }, S.wpAuto * 60 * 1000);
  }

  TV.WP_AUTO_MINUTES = MINUTES;
  TV.setupWpTimer = setupWpTimer;
})();
