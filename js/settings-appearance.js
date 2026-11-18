/* Settings > Appearance: wallpaper, brightness, animations, startup animation */
(function () {
  "use strict";
  var TV = window.TV, S = TV.S;
  var DIM = [0, 10, 20, 30, 40];
  var AUTO_LABELS = ["Off", "Every minute", "Every 5 minutes", "Every 15 minutes", "Every 30 minutes", "Every hour"];

  function indexOf(arr, v) { for (var i = 0; i < arr.length; i++) { if (arr[i] === v) { return i; } } return 0; }
  function wpNames() { var a = []; for (var i = 0; i < TV.WALLPAPERS.length; i++) { a.push(TV.WALLPAPERS[i].name); } return a; }

  TV.addCat({
    id: "appearance", order: 40, name: "Appearance", color: "#5e5ce6", icon: "half",
    desc: "Wallpaper, brightness and animations.",
    items: [
      { name: "Wallpaper", opts: wpNames(), get: function () { return TV.wpIdx; }, set: function (i) { TV.setWallpaper(i, true); } },
      { name: "Wallpaper on launch", opts: ["Random", "Keep current"], get: function () { return S.wpKeep ? 1 : 0; },
        set: function (i) { S.wpKeep = (i === 1); TV.saveSettings(); } },
      { name: "Change wallpaper", opts: AUTO_LABELS, get: function () { return indexOf(TV.WP_AUTO_MINUTES, S.wpAuto); },
        set: function (i) { S.wpAuto = TV.WP_AUTO_MINUTES[i]; TV.saveSettings(); TV.setupWpTimer(); } },
      { name: "Brightness", opts: ["100%", "90%", "80%", "70%", "60%"], get: function () { return indexOf(DIM, S.dim); },
        set: function (i) { S.dim = DIM[i]; TV.saveSettings(); TV.applyDim(); } },
      { name: "Startup animation", opts: ["On", "Off"], get: function () { return S.intro ? 0 : 1; },
        set: function (i) { S.intro = (i === 0); TV.saveSettings(); } },
      { name: "Animations", opts: ["On", "Off"], get: function () { return document.body.className === "lite" ? 1 : 0; },
        set: function (i) { TV.setLite(i === 1); } }
    ]
  });
})();
