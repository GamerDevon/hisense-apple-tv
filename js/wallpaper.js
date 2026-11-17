/* Wallpapers (pure CSS gradients, no image files needed) */
(function () {
  "use strict";
  var TV = window.TV, $ = TV.$, S = TV.S, store = TV.store;

  var WALLPAPERS = [
    { name: "Aurora",   css: "radial-gradient(900px 700px at 20% 30%, #1fd1a5 0%, transparent 60%), radial-gradient(1000px 800px at 80% 20%, #2b6fff 0%, transparent 60%), radial-gradient(900px 900px at 60% 90%, #0b1d4d 0%, transparent 70%), #04121f" },
    { name: "Ember",    css: "radial-gradient(900px 700px at 25% 75%, #ff8a3d 0%, transparent 60%), radial-gradient(1000px 800px at 80% 30%, #c2185b 0%, transparent 62%), radial-gradient(900px 900px at 50% 10%, #3a0a2e 0%, transparent 70%), #120309" },
    { name: "Glacier",  css: "radial-gradient(1000px 800px at 30% 20%, #9be7ff 0%, transparent 60%), radial-gradient(900px 800px at 85% 70%, #3a7bd5 0%, transparent 60%), radial-gradient(800px 800px at 10% 90%, #0f2a4a 0%, transparent 70%), #071524" },
    { name: "Meadow",   css: "radial-gradient(900px 700px at 70% 25%, #b8e986 0%, transparent 58%), radial-gradient(1000px 800px at 20% 70%, #1b8a5a 0%, transparent 62%), radial-gradient(900px 900px at 80% 95%, #0a3d2e 0%, transparent 70%), #05160f" },
    { name: "Dusk",     css: "radial-gradient(1000px 800px at 75% 25%, #ff9a8b 0%, transparent 60%), radial-gradient(900px 800px at 20% 30%, #4a6cf7 0%, transparent 62%), radial-gradient(1000px 900px at 50% 100%, #1b1f4b 0%, transparent 70%), #0a0c1f" },
    { name: "Lagoon",   css: "radial-gradient(900px 800px at 25% 25%, #00c9ff 0%, transparent 60%), radial-gradient(1000px 800px at 80% 75%, #0072b5 0%, transparent 62%), radial-gradient(800px 800px at 60% 10%, #92fe9d 0%, transparent 65%), #03202c" },
    { name: "Graphite", css: "radial-gradient(1000px 800px at 30% 25%, #5a6270 0%, transparent 60%), radial-gradient(900px 800px at 80% 70%, #2d3440 0%, transparent 62%), radial-gradient(900px 900px at 50% 100%, #0b0d12 0%, transparent 70%), #0c0e13" },
    { name: "Sand",     css: "radial-gradient(1000px 800px at 70% 30%, #f6d7a7 0%, transparent 60%), radial-gradient(900px 800px at 20% 75%, #c98a5a 0%, transparent 62%), radial-gradient(900px 900px at 80% 95%, #5a3a2a 0%, transparent 70%), #1a110c" },
    { name: "Nebula",   css: "radial-gradient(900px 800px at 20% 25%, #7b5cff 0%, transparent 60%), radial-gradient(1000px 800px at 85% 60%, #00d4ff 0%, transparent 62%), radial-gradient(900px 900px at 40% 100%, #1a0b3d 0%, transparent 70%), #07040f" },
    { name: "Pine",     css: "radial-gradient(1000px 800px at 75% 20%, #6fd3a0 0%, transparent 58%), radial-gradient(900px 800px at 15% 60%, #165a4a 0%, transparent 62%), radial-gradient(900px 900px at 60% 100%, #06231d 0%, transparent 70%), #04120e" }
  ];
  TV.WALLPAPERS = WALLPAPERS;
  TV.wpIdx = 0;

  function setWallpaper(i, animate) {
    TV.wpIdx = (i + WALLPAPERS.length) % WALLPAPERS.length;
    var bg = $("bg");
    function apply() {
      bg.style.background = WALLPAPERS[TV.wpIdx].css;
      $("w-wname").textContent = WALLPAPERS[TV.wpIdx].name;
      store("tvhome.wp", String(TV.wpIdx));
      if (TV.updateSettings) { TV.updateSettings(); }
    }
    if (!animate) { apply(); return; }
    bg.className = "swap";
    setTimeout(function () { apply(); bg.className = ""; }, 400);
  }

  function randomWallpaper() { // different one on every launch
    var last = parseInt(store("tvhome.wp"), 10);
    if (S.wpKeep && !isNaN(last) && last >= 0 && last < WALLPAPERS.length) { setWallpaper(last, false); return; }
    var i; do { i = Math.floor(Math.random() * WALLPAPERS.length); } while (i === last && WALLPAPERS.length > 1);
    setWallpaper(i, false);
  }

  TV.setWallpaper = setWallpaper;
  TV.randomWallpaper = randomWallpaper;
})();
