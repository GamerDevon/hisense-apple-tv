/* Home screen toggles (weather, wallpaper widget, recent row, hint bar) and brightness */
(function () {
  "use strict";
  var TV = window.TV, $ = TV.$, S = TV.S;

  function show(id, on) { var d = on ? "" : "none"; if ($(id).style.display !== d) { $(id).style.display = d; } }

  function applyDim() { $("dimmer").style.opacity = String((S.dim || 0) / 100); }

  function applyHome() {
    show("w-weather", S.showWeather);
    show("w-wall", S.showWall);
    show("widgets", S.showWeather || S.showWall);
    show("recent", S.showRecent);
    show("hints", S.showHints);
    /* a lone weather widget slides to the right edge so the gap doesn't look odd */
    $("w-weather").style.left = S.showWall ? "0px" : "400px";
    applyDim();
    if (TV.buildRecent) { TV.buildRecent(); }
  }

  TV.applyDim = applyDim;
  TV.applyHome = applyHome;
})();
