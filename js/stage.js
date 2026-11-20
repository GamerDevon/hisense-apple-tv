/* Fit the 1920x1080 design stage to the real window (fills any window shape) */
(function () {
  "use strict";
  var TV = window.TV, stage = TV.$("stage");

  function fit() {
    var w = window.innerWidth, hh = window.innerHeight, s = Math.min(w / 1920, hh / 1080);
    TV.scale = s;
    TV.stageW = Math.round(w / s);
    stage.style.width = TV.stageW + "px";
    stage.style.height = Math.round(hh / s) + "px";
    if (TV.zoomOn && s !== 1) { stage.style.webkitTransform = stage.style.transform = "none"; stage.style.zoom = String(s); }
    else { stage.style.zoom = ""; stage.style.webkitTransform = stage.style.transform = (s === 1 ? "none" : "scale(" + s + ")"); }
    stage.style.left = "0px";
    stage.style.top = "0px";
  }
  window.addEventListener("resize", function () {
    fit();
    if (TV.ready) { TV.lastOffset = -1; if (TV.refreshFocus) { TV.refreshFocus(); } }
  });
  fit();
  TV.fit = fit;
})();
