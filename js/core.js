/* TV Home - Core state, storage, stage scaling, and clock */
(function () {
  "use strict";

  var errLog = [];
  window.onerror = function (msg, src, line) {
    errLog.push(String(msg).slice(0, 60) + " (line " + line + ")");
    if (errLog.length > 4) { errLog.shift(); }
    return false;
  };

  var C = window.TVHOME_CONFIG || { tiles: [], weather: { name: "", lat: 50, lon: 15 }, saverAfterSec: 120, sounds: true };
  function $(id) { return document.getElementById(id); }
  function store(k, v) { try { if (v === undefined) { return localStorage.getItem(k); } localStorage.setItem(k, v); } catch (e) {} return null; }
  function pad(n) { return (n < 10 ? "0" : "") + n; }

  /* Saved settings (kept in the TV browser's storage) */
  var S = { clock24: true, tempF: false, wpKeep: false, sound: 0, saver: C.saverAfterSec || 120 };
  try {
    var saved = JSON.parse(store("tvhome.settings") || "{}");
    for (var sk in saved) { if (saved.hasOwnProperty(sk)) { S[sk] = saved[sk]; } }
  } catch (e) {}
  function saveSettings() { store("tvhome.settings", JSON.stringify(S)); }

  function fmtTime(d) {
    var hr = d.getHours();
    if (S.clock24) { return pad(hr) + ":" + pad(d.getMinutes()); }
    return ((hr % 12) || 12) + ":" + pad(d.getMinutes()) + (hr < 12 ? " AM" : " PM");
  }

  var TV = window.TV = {
    C: C, S: S, $: $, store: store, pad: pad,
    saveSettings: saveSettings, fmtTime: fmtTime,
    errLog: errLog, iconLog: {},
    lastW: null, lastOffset: -1, lastHm: "",
    ready: false, saverOn: false, panelOpen: false, debugOn: false,
    lastActivity: Date.now(), stageW: 1920
  };

  /* ---------- Fit 1920x1080 stage to the real screen ---------- */
  var stage = $("stage");
  function fit() {
    var w = window.innerWidth, hh = window.innerHeight, s = Math.min(w / 1920, hh / 1080);
    TV.stageW = Math.round(w / s);
    stage.style.width = TV.stageW + "px";
    stage.style.height = Math.round(hh / s) + "px";
    stage.style.webkitTransform = stage.style.transform = (s === 1 ? "none" : "scale(" + s + ")");
    stage.style.left = "0px";
    stage.style.top = "0px";
  }
  window.addEventListener("resize", function () { fit(); if (TV.ready) { TV.lastOffset = -1; if (TV.refreshFocus) { TV.refreshFocus(); } } });
  fit();

  /* ---------- Clock + date ---------- */
  var DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  var MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  function tick() {
    var d = new Date(), hm = fmtTime(d);
    if (hm !== TV.lastHm) {
      TV.lastHm = hm;
      $("clock").textContent = hm;
      $("saverclock").textContent = hm;
      $("date").textContent = DAYS[d.getDay()] + ", " + d.getDate() + " " + MONTHS[d.getMonth()];
    }
    if (!TV.saverOn && S.saver > 0 && TV.ready && Date.now() - TV.lastActivity > S.saver * 1000) {
      if (TV.showSaver) { TV.showSaver(); }
    }
  }
  TV.tick = tick;
})();
