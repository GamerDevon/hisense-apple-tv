/* Boot sequence (loaded last) */
(function () {
  "use strict";
  var TV = window.TV, $ = TV.$, C = TV.C, S = TV.S, store = TV.store;

  if (C.lite || store("tvhome.lite") === "1" || /[?&]lite=1/.test(window.location.search)) { TV.setClass("lite", true); }
  document.title = C.name || "TV Home";
  $("ver").textContent = "v" + (C.version || "?");
  (function () {
    var b = $("brand"), parts = (C.name || "").split(" "), tv = parts.length > 1 ? parts.pop() : "";
    b.appendChild(document.createTextNode(parts.join(" ")));
    if (tv) { var s = document.createElement("span"); s.className = "tv"; s.textContent = tv; b.appendChild(s); }
  })();

  TV.initBlur();
  TV.applyAccess();
  TV.randomWallpaper();
  TV.setupWpTimer();
  TV.buildTiles();
  TV.applyHome();                 /* home toggles + brightness, also builds the Recently opened row */
  window.addEventListener("pageshow", function (ev) { if (ev.persisted) { TV.buildRecent(); } });
  TV.tick();
  setInterval(TV.tick, 1000);
  TV.weatherFromCache();
  TV.loadWeather();
  setInterval(TV.loadWeather, 15 * 60 * 1000);
  if (S.dev && S.perfHud) { TV.setHud(true); }
  TV.runSplash(TV.startHome);
})();
