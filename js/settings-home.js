/* Settings > Home Screen: show or hide parts of the home screen */
(function () {
  "use strict";
  var TV = window.TV, S = TV.S;

  function onoff(name, key) {
    return { name: name, opts: ["On", "Off"], get: function () { return S[key] ? 0 : 1; },
      set: function (i) { S[key] = (i === 0); TV.saveSettings(); TV.applyHome(); } };
  }

  TV.addCat({
    id: "home", order: 20, name: "Home Screen", color: "#30b0c7", icon: "home",
    desc: "Choose what is shown on the home screen.",
    items: [
      onoff("Weather widget", "showWeather"),
      onoff("Wallpaper widget", "showWall"),
      onoff("Recently opened row", "showRecent"),
      onoff("Hint bar", "showHints")
    ]
  });
})();
