/* Settings > General */
(function () {
  "use strict";
  var TV = window.TV, S = TV.S, store = TV.store;
  var flashUntil = 0, armed = false;

  TV.addCat({
    id: "general", order: 10, name: "General", color: "#8e8e93", icon: "gear",
    desc: "Clock, units and app controls.",
    onEnter: function () { armed = false; },
    items: [
      { name: "Time format", opts: ["24-hour", "12-hour"], get: function () { return S.clock24 ? 0 : 1; },
        set: function (i) { S.clock24 = (i === 0); TV.saveSettings(); TV.lastHm = ""; TV.tick(); } },
      { name: "Temperature", opts: ["Celsius", "Fahrenheit"], get: function () { return S.tempF ? 1 : 0; },
        set: function (i) { S.tempF = (i === 1); TV.saveSettings(); if (TV.lastW) { TV.showWeather(TV.lastW.t, TV.lastW.c); } } },
      { name: "Reload app", val: "Now", run: function () { window.location.reload(); } },
      { name: "Recently opened", val: function () { return Date.now() < flashUntil ? "Cleared" : "Clear"; },
        run: function () { store("tvhome.recent", "[]"); TV.buildRecent(); flashUntil = Date.now() + 3000; setTimeout(TV.updateSettings, 3100); } },
      { name: "Reset all settings", val: function () { return armed ? "Press OK again" : "Reset"; },
        run: function () {
          if (!armed) { armed = true; setTimeout(function () { armed = false; TV.updateSettings(); }, 4000); return; }
          store("tvhome.settings", "{}"); store("tvhome.lite", "0"); store("tvhome.recent", "[]"); store("tvhome.wp", "");
          window.location.reload();
        } }
    ]
  });
})();
