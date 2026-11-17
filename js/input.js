/* Keys, Debug overlay, and Boot sequence */
(function () {
  "use strict";
  var TV = window.TV, $ = TV.$, C = TV.C, store = TV.store;

  var KEY = { LEFT: 37, UP: 38, RIGHT: 39, DOWN: 40, ENTER: 13, RED: 403, GREEN: 404, YELLOW: 405, BLUE: 406 };
  function isBack(k) { return k === 8 || k === 27 || k === 461 || k === 10009 || k === 10182; }

  function setLite(on) {
    document.body.className = on ? "lite" : "";
    store("tvhome.lite", on ? "1" : "0");
    TV.updateSettings();
  }

  function iconReport() {
    var s = "";
    for (var k in TV.iconLog) { if (TV.iconLog.hasOwnProperty(k)) { s += "\n" + k + ":" + TV.iconLog[k]; } }
    return s;
  }

  function debugLog(e) {
    var d = $("debug");
    d.style.display = TV.debugOn ? "block" : "none";
    if (TV.debugOn) {
      d.textContent = "Kivo TV v" + (C.version || "?") + "\nkeyCode: " + e.keyCode + "\nkey: " + (e.key || "-") +
        "\nscreen: " + window.innerWidth + "x" + window.innerHeight + "\nerrors: " +
        (TV.errLog.length ? "\n  " + TV.errLog.join("\n  ") : "none") + iconReport();
    }
  }

  TV.KEY = KEY;
  TV.isBack = isBack;
  TV.setLite = setLite;
  TV.debugLog = debugLog;

  document.addEventListener("keydown", function (e) {
    var k = e.keyCode;
    TV.ensureAudio();
    TV.lastActivity = Date.now();
    if (k === KEY.BLUE || k === 68) { TV.debugOn = !TV.debugOn; TV.updateSettings(); }
    if (k === 49) { setLite(document.body.className !== "lite"); }
    if (TV.debugOn || k === KEY.BLUE || k === 68) { debugLog(e); }
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

  /* ---------- Boot ---------- */
  if (C.lite || store("tvhome.lite") === "1" || /[?&]lite=1/.test(window.location.search)) { document.body.className = "lite"; }
  document.title = C.name || "TV Home";
  $("ver").textContent = "v" + (C.version || "?");
  (function () {
    var b = $("brand"), parts = (C.name || "").split(" "), tv = parts.length > 1 ? parts.pop() : "";
    b.appendChild(document.createTextNode(parts.join(" ")));
    if (tv) { var s = document.createElement("span"); s.className = "tv"; s.textContent = tv; b.appendChild(s); }
  })();

  TV.randomWallpaper();
  TV.buildTiles();
  TV.buildRecent();
  window.addEventListener("pageshow", function (ev) { if (ev.persisted) { TV.buildRecent(); } });
  TV.tick();
  setInterval(TV.tick, 1000);
  TV.loadWeather();
  setInterval(TV.loadWeather, 15 * 60 * 1000);
  TV.runSplash(TV.startHome);
})();
