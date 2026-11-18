/* Settings app engine (tvOS style): category list -> category page.
   Categories live in settings-*.js and register with TV.addCat({ id, order, name, color, icon, desc, items, hidden, onEnter }).
   Item kinds: choice { name, opts, get, set }  |  action { name, val, run }  |  info { name, val } */
(function () {
  "use strict";
  var TV = window.TV, $ = TV.$;

  var SCR = { page: -1, idx: 0, mainIdx: 0, cats: [] };
  var els = [], vals = [], base = "srow";

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
    if (it.opts) { return it.opts[it.get()]; }
    var v = it.val;
    return (typeof v === "function") ? v() : (v || "");
  }
  function mk(tagName, cls) { var e = document.createElement(tagName); if (cls) { e.className = cls; } return e; }

  function paint() {
    for (var i = 0; i < els.length; i++) { els[i].className = base + (i === SCR.idx ? " focus" : ""); }
  }
  function updateSettings() {
    if (!TV.panelOpen || SCR.page < 0) { return; }
    var items = SCR.cats[SCR.page].items;
    for (var i = 0; i < vals.length; i++) { vals[i].textContent = itemVal(items[i]); }
  }
  function setPanelClass() { $("panelwrap").className = TV.panelOpen ? (SCR.page >= 0 ? "on cat" : "on") : ""; }

  function showMain() {
    SCR.cats = visibleCats();
    SCR.page = -1; SCR.idx = Math.min(SCR.mainIdx, SCR.cats.length - 1); base = "srow main";
    var list = $("slist");
    list.innerHTML = "";
    els = []; vals = [];
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

  function showCat(ci) {
    var c = SCR.cats[ci];
    SCR.mainIdx = SCR.idx; SCR.page = ci; SCR.idx = 0; base = "srow";
    if (c.onEnter) { c.onEnter(); }
    $("sicon").style.background = c.color;
    $("sicon").innerHTML = TV.ICONS[c.icon];
    $("sname").textContent = c.name;
    $("sdesc").textContent = c.desc;
    var rt = $("sright");
    rt.innerHTML = "";
    rt.className = c.items.length > 6 ? "tight" : "";
    els = []; vals = [];
    for (var i = 0; i < c.items.length; i++) {
      var r = mk("div", "srow"), v = mk("span", "sv");
      r.appendChild(v);
      r.appendChild(document.createTextNode(c.items[i].name));
      rt.appendChild(r);
      els.push(r);
      vals.push(v);
    }
    updateSettings();
    paint();
    setPanelClass();
  }

  function openPanel() { TV.panelOpen = true; SCR.mainIdx = 0; showMain(); }
  function closePanel() { TV.panelOpen = false; $("panelwrap").className = ""; }
  function stepItem(it, d) { var n = it.opts.length; it.set((it.get() + d + n) % n); updateSettings(); }

  function settingsKey(k) {
    var KEY = TV.KEY, isBack = TV.isBack;
    var n = SCR.page < 0 ? SCR.cats.length : SCR.cats[SCR.page].items.length;
    if (k === KEY.UP) { SCR.idx = Math.max(0, SCR.idx - 1); paint(); TV.navBlip(); }
    else if (k === KEY.DOWN) { SCR.idx = Math.min(n - 1, SCR.idx + 1); paint(); TV.navBlip(); }
    else if (SCR.page < 0) {
      if (k === KEY.ENTER) { showCat(SCR.idx); }
      else if (isBack(k)) { closePanel(); }
    } else {
      var it = SCR.cats[SCR.page].items[SCR.idx];
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
  TV.settingsHome = showMain;
  TV.settingsKey = settingsKey;
})();
