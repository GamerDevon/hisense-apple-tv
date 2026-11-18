/* Settings > Appearance (sub-menus Wallpaper and Effects) */
(function () {
  "use strict";
  var TV = window.TV, S = TV.S;
  var DIM = [0, 10, 20, 30, 40];
  var AUTO_LABELS = ["Off", "Every minute", "Every 5 minutes", "Every 15 minutes", "Every 30 minutes", "Every hour"];

  function indexOf(arr, v) { for (var i = 0; i < arr.length; i++) { if (arr[i] === v) { return i; } } return 0; }
  function wpNames() { var a = []; for (var i = 0; i < TV.WALLPAPERS.length; i++) { a.push(TV.WALLPAPERS[i].name); } return a; }

  var wallpaper = { name: "Wallpaper", desc: "Pick a wallpaper or let it change by itself.", items: [
    { name: "Wallpaper", opts: wpNames(), get: function () { return TV.wpIdx; }, set: function (i) { TV.setWallpaper(i, true); } },
    { name: "On launch", opts: ["Random", "Keep current"], get: function () { return S.wpKeep ? 1 : 0; },
      set: function (i) { S.wpKeep = (i === 1); TV.saveSettings(); } },
    { name: "Change automatically", opts: AUTO_LABELS, get: function () { return indexOf(TV.WP_AUTO_MINUTES, S.wpAuto); },
      set: function (i) { S.wpAuto = TV.WP_AUTO_MINUTES[i]; TV.saveSettings(); TV.setupWpTimer(); } }
  ] };

  var effects = { name: "Effects", desc: "Blur gives panels a frosted glass look but can slow down older TVs. If it lags, switch it off: it stays off. Remote key 2 switches it any time.", items: [
    { name: "Blur effect", opts: ["On", "Off"], get: function () { return S.blur ? 0 : 1; }, set: function (i) { TV.setBlur(i === 0); } },
    { name: "Blur support", val: function () { return TV.blurSupported() ? "Available" : "Not in this browser"; } },
    { name: "Animations", opts: ["On", "Off"], get: function () { return TV.hasClass("lite") ? 1 : 0; }, set: function (i) { TV.setLite(i === 1); } },
    { name: "Startup animation", opts: ["On", "Off"], get: function () { return S.intro ? 0 : 1; },
      set: function (i) { S.intro = (i === 0); TV.saveSettings(); } }
  ] };

  TV.addCat({
    id: "appearance", order: 40, name: "Appearance", color: "#5e5ce6", icon: "half",
    desc: "Wallpaper, effects and brightness.",
    items: [
      wallpaper,
      effects,
      { name: "Brightness", opts: ["100%", "90%", "80%", "70%", "60%"], get: function () { return indexOf(DIM, S.dim); },
        set: function (i) { S.dim = DIM[i]; TV.saveSettings(); TV.applyDim(); } }
    ]
  });
})();
