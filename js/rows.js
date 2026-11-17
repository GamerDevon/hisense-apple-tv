/* Rows: apps, recently opened, focus handling */
(function () {
  "use strict";
  var TV = window.TV, $ = TV.$, C = TV.C, S = TV.S, store = TV.store;

  var row = $("row");
  var rowsEls = [[], []], rowIdx = 0, idxs = [0, 0], focusEl = null, recentTiles = [];
  var APPS = C.tiles.concat([{ name: "Settings", settings: true, color: ["#9aa3b5", "#3d4455"] }]);
  var RECENT_MAX = 6;

  function tag(s) { return s.indexOf("icons/") === 0 ? "local" : (s.indexOf("simpleicons") > -1 ? "logo" : "favicon"); }
  function mono(tile, name) {
    var m = document.createElement("div");
    m.className = "mono"; m.textContent = name.charAt(0);
    tile.appendChild(m);
  }
  function loadIcon(tile, t, srcs, i, quiet) {
    if (i === 0 && !quiet) { TV.iconLog[t.name] = ""; }
    if (i >= srcs.length) { if (!quiet) { TV.iconLog[t.name] += " -> letter"; } mono(tile, t.name); return; }
    var im = document.createElement("img");
    if (srcs[i].indexOf("/s2/favicons") > -1) { im.className = "fav"; }
    im.onload = function () { if (!quiet) { TV.iconLog[t.name] += " ok:" + tag(srcs[i]); } };
    im.onerror = function () {
      if (!quiet) { TV.iconLog[t.name] += " x:" + tag(srcs[i]); }
      if (im.parentNode) { tile.removeChild(im); }
      loadIcon(tile, t, srcs, i + 1, quiet);
    };
    im.src = srcs[i];
    tile.appendChild(im);
  }
  function makeTile(t, small) {
    var d = document.createElement("div");
    d.className = small ? "tile sm" : "tile";
    d.style.background = "linear-gradient(135deg," + t.color[0] + "," + t.color[1] + ")";
    if (t.settings) {
      var g = document.createElement("div");
      g.className = "gear";
      g.innerHTML = "<svg width='120' height='120' viewBox='0 0 100 100'><circle cx='50' cy='50' r='37' fill='none' stroke='#fff' stroke-width='12' stroke-dasharray='9.7 9.7'/><circle cx='50' cy='50' r='26' fill='none' stroke='#fff' stroke-width='12'/></svg>";
      d.appendChild(g);
      return d;
    }
    var srcs = ["icons/" + (t.slug || t.name.toLowerCase().replace(/[^a-z0-9]/g, "")) + ".png"];
    if (t.icon) { srcs.push(t.icon); }
    if (t.domain) { srcs.push("https://www.google.com/s2/favicons?sz=256&domain=" + t.domain); }
    loadIcon(d, t, srcs, 0, small);
    return d;
  }

  function buildTiles() {
    row.innerHTML = "";
    rowsEls[0] = [];
    for (var i = 0; i < APPS.length; i++) {
      var d = makeTile(APPS[i], false);
      row.appendChild(d);
      rowsEls[0].push(d);
    }
    var lb = document.createElement("div"); lb.id = "label"; row.appendChild(lb);
  }

  /* Recently opened: names kept in localStorage, newest first */
  function readNames() {
    var names = [];
    try { names = JSON.parse(store("tvhome.recent") || "[]"); } catch (e) { names = []; }
    return names;
  }
  function readRecent() {
    var names = readNames(), out = [];
    for (var i = 0; i < names.length; i++) {
      for (var j = 0; j < C.tiles.length; j++) {
        if (C.tiles[j].name === names[i]) { out.push(C.tiles[j]); break; }
      }
    }
    return out.slice(0, RECENT_MAX);
  }
  function pushRecent(name) {
    var names = readNames(), out = [name];
    for (var i = 0; i < names.length; i++) { if (names[i] !== name) { out.push(names[i]); } }
    store("tvhome.recent", JSON.stringify(out.slice(0, RECENT_MAX)));
  }
  function buildRecent() {
    var rr = $("rrow");
    rr.innerHTML = "";
    rowsEls[1] = [];
    recentTiles = readRecent();
    for (var i = 0; i < recentTiles.length; i++) {
      var d = makeTile(recentTiles[i], true);
      rr.appendChild(d);
      rowsEls[1].push(d);
    }
    var lb = document.createElement("div"); lb.id = "rlabel"; rr.appendChild(lb);
    $("rempty").style.display = recentTiles.length ? "none" : "block";
    idxs[1] = Math.max(0, Math.min(idxs[1], recentTiles.length - 1));
    if (rowIdx === 1 && !recentTiles.length) { rowIdx = 0; }
    focusEl = null; // old elements are gone
    refreshFocus();
  }

  /* Focus handling: only the focused element's class changes */
  function refreshFocus() {
    var el = rowsEls[rowIdx][idxs[rowIdx]] || null;
    if (focusEl && focusEl !== el) { focusEl.className = focusEl.className.replace(" focus", ""); }
    if (el && el.className.indexOf(" focus") < 0) { el.className += " focus"; }
    focusEl = el;
    var a = $("label"), r = $("rlabel");
    if (a) {
      if (rowIdx === 0 && APPS[idxs[0]]) { a.textContent = APPS[idxs[0]].name; a.style.left = (idxs[0] * 410 + 190) + "px"; }
      else { a.textContent = ""; }
    }
    if (r) {
      if (rowIdx === 1 && recentTiles[idxs[1]]) { r.textContent = recentTiles[idxs[1]].name; r.style.left = (idxs[1] * 260 + 120) + "px"; }
      else { r.textContent = ""; }
    }
    var offset = Math.max(0, (idxs[0] + 1) * 410 + 120 - (TV.stageW - 220));
    if (offset !== TV.lastOffset) {
      TV.lastOffset = offset;
      row.style.webkitTransform = row.style.transform = "translateX(" + (-offset) + "px)";
    }
  }
  function rowCount(r) { return r === 0 ? APPS.length : recentTiles.length; }
  function moveCol(d) {
    var i = Math.max(0, Math.min(rowCount(rowIdx) - 1, idxs[rowIdx] + d));
    if (i !== idxs[rowIdx]) { idxs[rowIdx] = i; refreshFocus(); TV.navBlip(); }
  }
  function moveRow(d) {
    var r = rowIdx + d;
    while (r >= 0 && r <= 1 && rowCount(r) === 0) { r += d; }
    if (r < 0 || r > 1) { return; }
    rowIdx = r;
    refreshFocus();
    TV.navBlip();
  }
  function activate() {
    var t = rowIdx === 0 ? APPS[idxs[0]] : recentTiles[idxs[1]];
    if (!t) { return; }
    if (t.settings) { TV.openPanel(); return; }
    pushRecent(t.name);
    if (S.sound >= 1) { TV.blip(880, 0.12, 0.07); }
    setTimeout(function () { window.location.href = t.url; }, 140);
  }

  TV.buildTiles = buildTiles;
  TV.buildRecent = buildRecent;
  TV.refreshFocus = refreshFocus;
  TV.moveCol = moveCol;
  TV.moveRow = moveRow;
  TV.activate = activate;
})();
