/* Performance modes and single-effect switches.
   Mode (S.perf): 0 Fast (default), 1 Balanced, 2 Pretty (the original look).
   The developer "Performance lab" can override single effects (S.lab[name] = 1 on / 0 off).
   An effect that is switched off adds the body class "x-<name>", styles are in css/perf.css. */
(function () {
  "use strict";
  var TV = window.TV, S = TV.S, $ = TV.$;

  /* [name, label shown in the lab] */
  var EFFECTS = [
    ["shade", "Dark overlay on wallpaper"],
    ["overlays", "Tile shine and gloss"],
    ["shadow", "Focus shadow"],
    ["round", "Rounded corners"],
    ["panelfade", "Settings fade and slide"],
    ["rowanim", "Settings row animations"],
    ["bg", "Wallpaper gradients"],
    ["lift", "Tile lift on focus"],
    ["rowslide", "Row slide animation"],
    ["layers", "Tile GPU layers"],
    ["hidehome", "Hide Home behind Settings"],
    ["zoom", "Scale stage with zoom"]
  ];

  /* 1 = effect on. Fast switches off everything that is expensive to paint. */
  var PRESET = [
    { shade: 0, overlays: 0, shadow: 0, round: 1, panelfade: 0, rowanim: 0, bg: 1, lift: 1, rowslide: 1, layers: 1, hidehome: 1, zoom: 0 },
    { shade: 0, overlays: 1, shadow: 0, round: 1, panelfade: 1, rowanim: 0, bg: 1, lift: 1, rowslide: 1, layers: 1, hidehome: 1, zoom: 0 },
    { shade: 1, overlays: 1, shadow: 1, round: 1, panelfade: 1, rowanim: 1, bg: 1, lift: 1, rowslide: 1, layers: 1, hidehome: 1, zoom: 0 }
  ];

  function on(key) {
    var o = S.lab && S.lab[key];
    if (o === 0 || o === 1) { return o === 1; }
    return (PRESET[S.perf] || PRESET[0])[key] === 1;
  }

  /* Hide Home while Settings is open (Settings is opaque, so nothing visible changes, but Home stops being painted) */
  function onPanel(open) {
    $("home").style.visibility = (open && on("hidehome") && !TV.hasClass("blur")) ? "hidden" : "";
  }

  function applyPerf() {
    var zoom = on("zoom");
    TV.setClass("pf0", S.perf === 0);
    TV.setClass("pf1", S.perf === 1);
    TV.setClass("pf2", S.perf === 2);
    for (var i = 0; i < EFFECTS.length; i++) {
      if (EFFECTS[i][0] !== "zoom") { TV.setClass("x-" + EFFECTS[i][0], !on(EFFECTS[i][0])); }
    }
    onPanel(TV.panelOpen);
    if (zoom !== !!TV.zoomOn) { TV.zoomOn = zoom; TV.fit(); }
  }

  TV.PERF_EFFECTS = EFFECTS;
  TV.applyPerf = applyPerf;
  TV.onPanel = onPanel;
})();
