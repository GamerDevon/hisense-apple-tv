/* Settings app engine (tvOS style): category list -> category page -> sub pages (any depth).
   Categories live in settings-*.js and register with TV.addCat({ id, order, name, color, icon, desc, items, hidden, onEnter }).
   Item kinds: choice { name, opts, get, set } | action { name, val, run } | info { name, val } | sub-menu { name, desc, items: [...] }
   Long lists scroll: only the rows that fit above the bottom hint are shown. */
(function () {
  "use strict";
  var TV = window.TV, $ = TV.$;

  var SCR = { page: null, idx: 0, mainIdx: 0, cats: [], stack: [] };
  var els = [], vals = [], base = "srow", win = { start: 0, count: 9, ready: false }, shown = [];

  TV.cats = [];
  TV.addCat = function (c) { TV.cats.push(c); };

  function visibleCats() {
    var out = [];
    for (var i = 0; i < TV.cats.length; i++) {
      if (!(TV.cats[i].hidden && TV.cats[i].hidden())) { out.push(TV.cats[i]); }
    }
    out.sort(function (a, b) { return a.order - b.order; });
    return out;
  }
  function itemVal(it) {
    if (it.items) { return ""; }
    if (it.opts) { return it.opts[it.get()]; }
    var v = it.val;
    return (typeof v === "function") ? v() : (v || "");
  }
  function mk(tagName, cls) { var e = document.createElement(tagName); if (cls) { e.className = cls; } return e; }

  /* Show only the rows that fit; keep the focused row inside the window */
  function rowH() { return base === "srow main" ? 92 : ($("sright").className === "tight" ? 84 : 102); }
  function fitWindow() {
    var h = $("stage").offsetHeight || 1080;
    win.count = Math.max(3, Math.floor((h - 220) / rowH()));
    if (SCR.idx < win.start) { win.start = SCR.idx; }
    if (SCR.idx >= win.start + win.count) { win.start = SCR.idx - win.count + 1; }
    win.start = Math.max(0, Math.min(win.start, Math.max(0, els.length - win.count)));
    for (var i = 0; i < els.length; i++) {
      var vis = i >= win.start && i < win.start + win.count;
      if (shown[i] !== vis) {
        shown[i] = vis;
        if (vis && win.ready) { els[i].style.webkitAnimationDelay = els[i].style.animationDelay = "0s"; }
        els[i].style.display = vis ? "" : "none";
      }
    }
    win.ready = true;
  }

  function paint() {
    for (var i = 0; i < els.length; i++) { els[i].className = base + (i === SCR.idx ? " focus" : ""); }
    fitWindow();
  }
  function updateSettings() {
    if (!TV.panelOpen || !SCR.page) { return; }
    var items = SCR.page.items;
    for (var i = 0; i < vals.length; i++) { vals[i].textContent = itemVal(items[i]); }
  }
  function setPanelClass() { $("panelwrap").className = TV.panelOpen ? (SCR.page ? "on cat" : "on") : ""; }
  function resetRows() { els = []; vals = []; shown = []; win.start = 0; win.ready = false; }

  function showMain() {
    SCR.cats = visibleCats(); SCR.page = null; SCR.stack = [];
    SCR.idx = Math.min(SCR.mainIdx, SCR.cats.length - 1); base = "srow main";
    var list = $("slist");
    list.innerHTML = "";
    resetRows();
    for (var i = 0; i < SCR.cats.length; i++) {
      var c = SCR.cats[i], r = mk("div", "srow main"), ic = mk("div", "sico");
      ic.style.background = c.color;
      ic.innerHTML = TV.ICONS[c.icon];
      r.appendChild(ic);
      r.appendChild(document.createTextNode(c.name));
      r.appendChild(mk("span", "chev"));
      list.appendChild(r);
      els.push(r);
    }
    paint();
    setPanelClass();
  }

  /* Draw one page (a category or a sub-menu) */
  function showPage(p, idx) {
    SCR.page = p; SCR.idx = idx || 0; base = "srow";
    $("sicon").style.background = p.color;
    $("sicon").innerHTML = TV.ICONS[p.icon];
    $("sname").textContent = p.name;
    $("sdesc").textContent = p.desc || "";
    var rt = $("sright");
    rt.innerHTML = "";
    rt.className = p.items.length > 6 ? "tight" : "";
    resetRows();
    for (var i = 0; i < p.items.length; i++) {
      var r = mk("div", "srow"), v = mk("span", "sv");
      r.appendChild(v);
      r.appendChild(document.createTextNode(p.items[i].name));
      if (p.items[i].items) { r.appendChild(mk("span", "chev")); }
      rt.appendChild(r);
      els.push(r);
      vals.push(v);
    }
    updateSettings();
    paint();
    setPanelClass();
  }

  function enterCat(c) {
    SCR.mainIdx = SCR.idx; SCR.stack = [];
    if (c.onEnter) { c.onEnter(); }
    showPage(c, 0);
  }
  function enterSub(it) {
    SCR.stack.push({ page: SCR.page, idx: SCR.idx });
    showPage({ name: it.name, color: SCR.page.color, icon: SCR.page.icon, desc: it.desc || SCR.page.desc, items: it.items }, 0);
  }
  function back() {
    if (SCR.stack.length) { var s = SCR.stack.pop(); showPage(s.page, s.idx); }
    else { showMain(); }
  }

  function openPanel() { TV.panelOpen = true; SCR.mainIdx = 0; if (TV.onPanel) { TV.onPanel(true); } showMain(); }
  function closePanel() { TV.panelOpen = false; $("panelwrap").className = ""; if (TV.onPanel) { TV.onPanel(false); } }
  function stepItem(it, d) { var n = it.opts.length; it.set((it.get() + d + n) % n); updateSettings(); }

  function settingsKey(k) {
    var KEY = TV.KEY, isBack = TV.isBack;
    var n = SCR.page ? SCR.page.items.length : SCR.cats.length;
    if (k === KEY.UP) { SCR.idx = Math.max(0, SCR.idx - 1); paint(); TV.navBlip(); }
    else if (k === KEY.DOWN) { SCR.idx = Math.min(n - 1, SCR.idx + 1); paint(); TV.navBlip(); }
    else if (!SCR.page) {
      if (k === KEY.ENTER) { enterCat(SCR.cats[SCR.idx]); }
      else if (isBack(k)) { closePanel(); }
    } else {
      var it = SCR.page.items[SCR.idx];
      if (k === KEY.LEFT && it.opts) { stepItem(it, -1); }
      else if (k === KEY.RIGHT && it.opts) { stepItem(it, 1); }
      else if (k === KEY.ENTER) {
        if (it.items) { enterSub(it); }
        else if (it.opts) { stepItem(it, 1); }
        else if (it.run) { it.run(); updateSettings(); }
      }
      else if (isBack(k)) { back(); }
    }
  }

  TV.updateSettings = updateSettings;
  TV.openPanel = openPanel;
  TV.closePanel = closePanel;
  TV.settingsHome = showMain;
  TV.settingsKey = settingsKey;
})();
