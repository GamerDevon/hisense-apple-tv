/* TV Home - Core state, storage and settings defaults */
(function () {
  "use strict";

  var errLog = [];
  window.onerror = function (msg, src, line) {
    errLog.push(String(msg).slice(0, 60) + " (line " + line + ")");
    if (errLog.length > 4) { errLog.shift(); }
    return false;
  };

  var C = window.TVHOME_CONFIG || { tiles: [], weather: { name: "", lat: 50, lon: 15 }, saverAfterSec: 120 };
  function $(id) { return document.getElementById(id); }
  function store(k, v) { try { if (v === undefined) { return localStorage.getItem(k); } localStorage.setItem(k, v); } catch (e) {} return null; }
  function pad(n) { return (n < 10 ? "0" : "") + n; }

  /* Saved settings (kept in the TV browser's storage as tvhome.settings) */
  var S = {
    clock24: true, tempF: false,
    wpKeep: false, wpAuto: 0,            /* wpAuto = minutes between automatic wallpaper changes, 0 = off */
    sound: 0, vol: 60,                   /* sound: 0 off, 1 select only, 2 all (default OFF) */
    saver: C.saverAfterSec || 120, saverStyle: 0,
    intro: true, dim: 0,                 /* dim = % darker, 0..40 */
    showWeather: true, showWall: true, showRecent: true, showHints: true,
    city: (C.weather && C.weather.name) || "",
    hidden: {},                          /* app name -> true when hidden from Home */
    dev: false, perfHud: false
  };
  try {
    var saved = JSON.parse(store("tvhome.settings") || "{}");
    for (var sk in saved) { if (saved.hasOwnProperty(sk)) { S[sk] = saved[sk]; } }
  } catch (e) {}
  if (!S.hidden || typeof S.hidden !== "object") { S.hidden = {}; }
  function saveSettings() { store("tvhome.settings", JSON.stringify(S)); }

  window.TV = {
    C: C, S: S, $: $, store: store, pad: pad, saveSettings: saveSettings,
    errLog: errLog, iconLog: {},
    lastW: null, lastOffset: -1, lastHm: "",
    ready: false, saverOn: false, panelOpen: false, debugOn: false,
    lastActivity: Date.now(), stageW: 1920
  };
})();
