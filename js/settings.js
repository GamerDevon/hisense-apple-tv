/* Settings app (tvOS style): categories, then options */
(function () {
  "use strict";
  var TV = window.TV, $ = TV.$, C = TV.C, S = TV.S, store = TV.store;

  var SCR = { page: -1, idx: 0, mainIdx: 0 };
  var settingsEls = [], settingsVals = [], settingsBase = "srow", flashUntil = 0, resetArmed = false;
  var SAVER_VALS = [60, 120, 300, 600, 0];
  var ICONS = {
    gear: "<svg width='100%' height='100%' viewBox='0 0 100 100'><circle cx='50' cy='50' r='37' fill='none' stroke='#fff' stroke-width='12' stroke-dasharray='9.7 9.7'/><circle cx='50' cy='50' r='26' fill='none' stroke='#fff' stroke-width='12'/></svg>",
    half: "<svg width='100%' height='100%' viewBox='0 0 100 100'><circle cx='50' cy='50' r='34' fill='none' stroke='#fff' stroke-width='8'/><path d='M50 16a34 34 0 0 1 0 68z' fill='#fff'/></svg>",
    speaker: "<svg width='100%' height='100%' viewBox='0 0 100 100'><path d='M14 38h16l22-18v60L30 62H14z' fill='#fff'/><path d='M64 36q14 14 0 28' fill='none' stroke='#fff' stroke-width='8' stroke-linecap='round'/><path d='M74 24q24 26 0 52' fill='none' stroke='#fff' stroke-width='8' stroke-linecap='round'/></svg>",
    screen: "<svg width='100%' height='100%' viewBox='0 0 100 100'><rect x='12' y='22' width='76' height='50' rx='8' fill='none' stroke='#fff' stroke-width='8'/><path d='M36 86h28' stroke='#fff' stroke-width='8' stroke-linecap='round'/></svg>",
    info: "<svg width='100%' height='100%' viewBox='0 0 100 100'><circle cx='50' cy='50' r='36' fill='none' stroke='#fff' stroke-width='8'/><circle cx='50' cy='32' r='5' fill='#fff'/><path d='M50 46v26' stroke='#fff' stroke-width='9' stroke-linecap='round'/></svg>"
  };

  function wpNames() { var a = []; for (var i = 0; i < TV.WALLPAPERS.length; i++) { a.push(TV.WALLPAPERS[i].name); } return a; }
  function saverIdx() { for (var i = 0; i < SAVER_VALS.length; i++) { if (SAVER_VALS[i] === S.saver) { return i; } } return 1; }
  function browserName() {
    var ua = navigator.userAgent || "", m;
    m = /VIDAA[\/ ]?([\d.]+)?/i.exec(ua); if (m) { return "VIDAA" + (m[1] ? " " + m[1] : ""); }
    m = /Chrome\/(\d+)/.exec(ua); if (m) { return "Chrome " + m[1]; }
    m = /Firefox\/(\d+)/.exec(ua); if (m) { return "Firefox " + m[1]; }
    m = /Version\/([\d.]+).*Safari/.exec(ua); if (m) { return "Safari " + m[1]; }
    return ua.slice(0, 24) || "Unknown";
  }

  var CATS = [
    { name: "General", color: "#8e8e93", icon: "gear", desc: "Clock, units and app controls.", items: [
      { name: "Time format", opts: ["24-hour", "12-hour"], get: function () { return S.clock24 ? 0 : 1; }, set: function (i) { S.clock24 = (i === 0); TV.saveSettings(); TV.lastHm = ""; TV.tick(); } },
      { name: "Temperature", opts: ["Celsius", "Fahrenheit"], get: function () { return S.tempF ? 1 : 0; }, set: function (i) { S.tempF = (i === 1); TV.saveSettings(); if (TV.lastW) { TV.showWeather(TV.lastW.t, TV.lastW.c); } } },
      { name: "Reload app", val: "Now", run: function () { window.location.reload(); } },
      { name: "Recently opened", val: function () { return Date.now() < flashUntil ? "Cleared" : "Clear"; }, run: function () { store("tvhome.recent", "[]"); TV.buildRecent(); flashUntil = Date.now() + 3000; setTimeout(updateSettings, 3100); } },
      { name: "Reset all settings", val: function () { return resetArmed ? "Press OK again" : "Reset"; }, run: function () {
          if (!resetArmed) { resetArmed = true; setTimeout(function () { resetArmed = false; updateSettings(); }, 4000); return; }
          store("tvhome.settings", "{}"); store("tvhome.lite", "0"); store("tvhome.recent", "[]"); window.location.reload();
        } }
    ] },
    { name: "Appearance", color: "#5e5ce6", icon: "half", desc: "Wallpaper and animations.", items: [
      { name: "Wallpaper", opts: wpNames(), get: function () { return TV.wpIdx; }, set: function (i) { TV.setWallpaper(i, true); } },
      { name: "Wallpaper on launch", opts: ["Random", "Keep current"], get: function () { return S.wpKeep ? 1 : 0; }, set: function (i) { S.wpKeep = (i === 1); TV.saveSettings(); } },
      { name: "Animations", opts: ["On", "Off"], get: function () { return document.body.className === "lite" ? 1 : 0; }, set: function (i) { TV.setLite(i === 1); } }
    ] },
    { name: "Sounds", color: "#ff375f", icon: "speaker", desc: "Optional click sounds when you move around or open apps.", items: [
      { name: "UI sounds", opts: ["Off", "Select only", "All"], get: function () { return S.sound; }, set: function (i) { S.sound = i; TV.saveSettings(); TV.ensureAudio(); } },
      { name: "Test sound", val: "Play", run: function () { TV.ensureAudio(true); TV.blip(880, 0.12, 0.07); } }
    ] },
    { name: "Screen Saver", color: "#0a84ff", icon: "screen", desc: "A moving clock appears after a while without any key presses.", items: [
      { name: "Start after", opts: ["1 minute", "2 minutes", "5 minutes", "10 minutes", "Never"], get: saverIdx, set: function (i) { S.saver = SAVER_VALS[i]; TV.saveSettings(); } },
      { name: "Start now", val: "Start", run: function () { closePanel(); TV.showSaver(); } }
    ] },
    { name: "About", color: "#636366", icon: "info", desc: "Details about this app and the browser it runs in.", items: [
      { name: "App", info: true, val: function () { return C.name || "TV Home"; } },
      { name: "Version", info: true, val: function () { return "v" + (C.version || "?"); } },
      { name: "Window", info: true, val: function () { return window.innerWidth + " x " + window.innerHeight; } },
      { name: "Screen", info: true, val: function () { return screen.width + " x " + screen.height; } },
      { name: "Browser", info: true, val: function () { return browserName(); } },
      { name: "Network", info: true, val: function () { return navigator.onLine === false ? "Offline" : "Online"; } },
      { name: "Debug box", opts: ["Hidden", "Shown"], get: function () { return TV.debugOn ? 1 : 0; }, set: function (i) { TV.debugOn = (i === 1); TV.debugLog({ keyCode: "-" }); } }
    ] }
  ];

  function itemVal(it) {
    if (it.opts) { return it.opts[it.get()]; }
    var v = it.val;
    return (typeof v === "function") ? v() : (v || "");
  }
  function mk(tagName, cls) { var e = document.createElement(tagName); if (cls) { e.className = cls; } return e; }
  function paintSettings() {
    for (var i = 0; i < settingsEls.length; i++) { settingsEls[i].className = settingsBase + (i === SCR.idx ? " focus" : ""); }
  }
  function updateSettings() {
    if (!TV.panelOpen || SCR.page < 0) { return; }
    var items = CATS[SCR.page].items;
    for (var i = 0; i < settingsVals.length; i++) { settingsVals[i].textContent = itemVal(items[i]); }
  }
  function showMain() {
    SCR.page = -1; SCR.idx = SCR.mainIdx; settingsBase = "srow main";
    var list = $("slist");
    list.innerHTML = "";
    settingsEls = []; settingsVals = [];
    for (var i = 0; i < CATS.length; i++) {
      var r = mk("div", "srow main"), ic = mk("div", "sico");
      ic.style.background = CATS[i].color;
      ic.innerHTML = ICONS[CATS[i].icon];
      r.appendChild(ic);
      r.appendChild(document.createTextNode(CATS[i].name));
      r.appendChild(mk("span", "chev"));
      list.appendChild(r);
      settingsEls.push(r);
    }
    paintSettings();
    setPanelClass();
  }
  function showCat(ci) {
    SCR.mainIdx = SCR.idx; SCR.page = ci; SCR.idx = 0; resetArmed = false; settingsBase = "srow";
    var c = CATS[ci];
    $("sicon").style.background = c.color;
    $("sicon").innerHTML = ICONS[c.icon];
    $("sname").textContent = c.name;
    $("sdesc").textContent = c.desc;
    var rt = $("sright");
    rt.innerHTML = "";
    settingsEls = []; settingsVals = [];
    for (var i = 0; i < c.items.length; i++) {
      var r = mk("div", "srow"), v = mk("span", "sv");
      r.appendChild(v);
      r.appendChild(document.createTextNode(c.items[i].name));
      rt.appendChild(r);
      settingsEls.push(r);
      settingsVals.push(v);
    }
    updateSettings();
    paintSettings();
    setPanelClass();
  }
  function setPanelClass() { $("panelwrap").className = TV.panelOpen ? (SCR.page >= 0 ? "on cat" : "on") : ""; }
  function openPanel() { TV.panelOpen = true; SCR.mainIdx = 0; showMain(); }
  function closePanel() { TV.panelOpen = false; resetArmed = false; $("panelwrap").className = ""; }
  function stepItem(it, d) { var n = it.opts.length; it.set((it.get() + d + n) % n); updateSettings(); }

  function settingsKey(k) {
    var KEY = TV.KEY, isBack = TV.isBack;
    var n = SCR.page < 0 ? CATS.length : CATS[SCR.page].items.length;
    if (k === KEY.UP) { SCR.idx = Math.max(0, SCR.idx - 1); paintSettings(); TV.navBlip(); }
    else if (k === KEY.DOWN) { SCR.idx = Math.min(n - 1, SCR.idx + 1); paintSettings(); TV.navBlip(); }
    else if (SCR.page < 0) {
      if (k === KEY.ENTER) { showCat(SCR.idx); }
      else if (isBack(k)) { closePanel(); }
    } else {
      var it = CATS[SCR.page].items[SCR.idx];
      if (k === KEY.LEFT && it.opts) { stepItem(it, -1); }
      else if (k === KEY.RIGHT && it.opts) { stepItem(it, 1); }
      else if (k === KEY.ENTER) {
        if (it.opts) { stepItem(it, 1); }
        else if (it.run) { it.run(); updateSettings(); }
      }
      else if (isBack(k)) { showMain(); }
    }
  }

  TV.updateSettings = updateSettings;
  TV.openPanel = openPanel;
  TV.closePanel = closePanel;
  TV.settingsKey = settingsKey;
})();
