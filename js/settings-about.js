/* Settings > About. Press OK on "Version" 7 times to unlock Developer options (Android style). */
(function () {
  "use strict";
  var TV = window.TV, C = TV.C, S = TV.S;
  var NEED = 7, taps = 0;

  function browserName() {
    var ua = navigator.userAgent || "", m;
    m = /VIDAA[\/ ]?([\d.]+)?/i.exec(ua); if (m) { return "VIDAA" + (m[1] ? " " + m[1] : ""); }
    m = /Chrome\/(\d+)/.exec(ua); if (m) { return "Chrome " + m[1]; }
    m = /Firefox\/(\d+)/.exec(ua); if (m) { return "Firefox " + m[1]; }
    m = /Version\/([\d.]+).*Safari/.exec(ua); if (m) { return "Safari " + m[1]; }
    return ua.slice(0, 24) || "Unknown";
  }

  function tapVersion() {
    if (S.dev) { TV.toast("No need, you are already a developer."); return; }
    taps++;
    if (taps >= NEED) {
      S.dev = true; TV.saveSettings(); taps = 0;
      TV.toast("You are now a developer! Go back to find Developer options.");
    } else if (taps >= 3) {
      var left = NEED - taps;
      TV.toast("You are now " + left + " step" + (left === 1 ? "" : "s") + " away from being a developer.");
    }
  }

  TV.addCat({
    id: "about", order: 80, name: "About", color: "#636366", icon: "info",
    desc: "Details about this app and the browser it runs in.",
    onEnter: function () { taps = 0; },
    items: [
      { name: "App", val: function () { return C.name || "TV Home"; } },
      { name: "Version", val: function () { return "v" + (C.version || "?"); }, run: tapVersion },
      { name: "Window", val: function () { return window.innerWidth + " x " + window.innerHeight; } },
      { name: "Screen", val: function () { return screen.width + " x " + screen.height; } },
      { name: "Browser", val: browserName },
      { name: "Network", val: function () { return navigator.onLine === false ? "Offline" : "Online"; } }
    ]
  });
})();
