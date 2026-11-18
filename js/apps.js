/* Apps list: which tiles are shown on Home (hidden apps are skipped, Settings is always last) */
(function () {
  "use strict";
  var TV = window.TV, C = TV.C, S = TV.S;
  var SETTINGS_TILE = { name: "Settings", settings: true, color: ["#9aa3b5", "#3d4455"] };

  function isHidden(name) { return !!S.hidden[name]; }

  function setHidden(name, on) {
    if (on) { S.hidden[name] = true; } else { delete S.hidden[name]; }
    TV.saveSettings();
  }

  /* Visible apps + the Settings tile. Rebuilt by TV.rebuildApps() (see rows.js) after a change. */
  function computeApps() {
    var out = [];
    for (var i = 0; i < C.tiles.length; i++) {
      if (!isHidden(C.tiles[i].name)) { out.push(C.tiles[i]); }
    }
    out.push(SETTINGS_TILE);
    return out;
  }

  TV.isHidden = isHidden;
  TV.setHidden = setHidden;
  TV.computeApps = computeApps;
})();
