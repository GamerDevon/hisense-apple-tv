/* Remote / keyboard input */
(function () {
  "use strict";
  var TV = window.TV, S = TV.S, store = TV.store;

  var KEY = { LEFT: 37, UP: 38, RIGHT: 39, DOWN: 40, ENTER: 13, RED: 403, GREEN: 404, YELLOW: 405, BLUE: 406 };
  function isBack(k) { return k === 8 || k === 27 || k === 461 || k === 10009 || k === 10182; }

  function setLite(on) {
    document.body.className = on ? "lite" : "";
    store("tvhome.lite", on ? "1" : "0");
    TV.updateSettings();
  }

  TV.KEY = KEY;
  TV.isBack = isBack;
  TV.setLite = setLite;

  document.addEventListener("keydown", function (e) {
    var k = e.keyCode;
    TV.ensureAudio();
    TV.lastActivity = Date.now();
    /* Blue / D toggles the debug box, but only once Developer options are unlocked */
    if (S.dev && (k === KEY.BLUE || k === 68)) { TV.debugOn = !TV.debugOn; TV.updateSettings(); }
    if (k === 49) { setLite(document.body.className !== "lite"); }
    if (TV.debugOn || (S.dev && (k === KEY.BLUE || k === 68))) { TV.debugLog(e); }
    if (TV.saverOn) { TV.hideSaver(); e.preventDefault(); return; }
    if (!TV.ready) { return; }
    if (TV.panelOpen) { TV.settingsKey(k); e.preventDefault(); return; }
    if (k === KEY.LEFT) { TV.moveCol(-1); e.preventDefault(); }
    else if (k === KEY.RIGHT) { TV.moveCol(1); e.preventDefault(); }
    else if (k === KEY.UP) { TV.moveRow(-1); e.preventDefault(); }
    else if (k === KEY.DOWN) { TV.moveRow(1); e.preventDefault(); }
    else if (k === KEY.ENTER) { TV.activate(); e.preventDefault(); }
    else if (k === KEY.RED || k === 87) { TV.setWallpaper(TV.wpIdx + 1, true); TV.blip(660, 0.1, 0.05); e.preventDefault(); }
    else if (k === KEY.GREEN || k === 83) { TV.showSaver(); e.preventDefault(); }
    else if (k === KEY.YELLOW || k === 82) { window.location.reload(); }
    else if (isBack(k)) { /* leave Back alone at Home so the TV can close the app */ }
  });
})();
