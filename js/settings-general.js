/* Settings > General (with sub-menus Date & Time and Storage) */
(function () {
  "use strict";
  var TV = window.TV, S = TV.S, store = TV.store;
  var recentFlash = 0, weatherFlash = 0, armed = false;

  function flashVal(until) { return function () { return Date.now() < until() ? "Cleared" : "Clear"; }; }
  function later() { setTimeout(TV.updateSettings, 3100); }

  var dateTime = { name: "Date & Time", desc: "How the clock and the date look on the home screen and the screensaver.", items: [
    { name: "Time format", opts: ["24-hour", "12-hour"], get: function () { return S.clock24 ? 0 : 1; },
      set: function (i) { S.clock24 = (i === 0); TV.saveSettings(); TV.lastHm = ""; TV.tick(); } },
    { name: "Date format", opts: ["Wednesday, 18 November", "18.11.2026", "Wed 18 Nov"], get: function () { return S.dateFmt || 0; },
      set: function (i) { S.dateFmt = i; TV.saveSettings(); TV.lastHm = ""; TV.tick(); } }
  ] };

  var storage = { name: "Storage", desc: "Settings and caches are saved inside this TV browser. Blur stays as you set it, even after a reset.", items: [
    { name: "Used", val: function () { return TV.storageKb() + " KB"; } },
    { name: "Recently opened", val: flashVal(function () { return recentFlash; }),
      run: function () { store("tvhome.recent", "[]"); TV.buildRecent(); recentFlash = Date.now() + 3000; later(); } },
    { name: "Weather cache", val: flashVal(function () { return weatherFlash; }),
      run: function () { TV.clearWeatherCache(); weatherFlash = Date.now() + 3000; later(); } },
    { name: "Reset all settings", val: function () { return armed ? "Press OK again" : "Reset"; },
      run: function () {
        if (!armed) { armed = true; setTimeout(function () { armed = false; TV.updateSettings(); }, 4000); return; }
        store("tvhome.settings", JSON.stringify({ blur: S.blur }));   /* blur choice survives a reset */
        store("tvhome.lite", "0"); store("tvhome.recent", "[]"); store("tvhome.wp", "");
        window.location.reload();
      } }
  ] };

  TV.addCat({
    id: "general", order: 10, name: "General", color: "#8e8e93", icon: "gear",
    desc: "Date and time, units, storage and app controls.",
    onEnter: function () { armed = false; },
    items: [
      dateTime,
      { name: "Temperature", opts: ["Celsius", "Fahrenheit"], get: function () { return S.tempF ? 1 : 0; },
        set: function (i) { S.tempF = (i === 1); TV.saveSettings(); if (TV.lastW) { TV.showWeather(TV.lastW.t, TV.lastW.c); } } },
      storage,
      { name: "Reload app", val: "Now", run: function () { window.location.reload(); } }
    ]
  });
})();
