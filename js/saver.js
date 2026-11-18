/* Screensaver. Styles (S.saverStyle): 0 drifting clock, 1 centered clock, 2 dim (almost black, small clock) */
(function () {
  "use strict";
  var TV = window.TV, $ = TV.$, S = TV.S;
  var saverMove = null;
  var STYLES = ["Drifting clock", "Centered clock", "Dim clock"];

  function moveSaver() {
    var b = $("saverbox"), tr = "none";
    if (S.saverStyle !== 1) {
      var maxX = Math.max(0, TV.stageW - 760 - 240), maxY = Math.max(0, $("stage").offsetHeight - 460 - 120);
      tr = "translate(" + (120 + Math.floor(Math.random() * maxX)) + "px," + (60 + Math.floor(Math.random() * maxY)) + "px)";
    }
    b.style.webkitTransform = b.style.transform = tr;
  }

  function showSaver() {
    TV.saverOn = true;
    $("saver").className = "on st" + (S.saverStyle || 0);
    moveSaver();
    clearInterval(saverMove);
    saverMove = setInterval(moveSaver, 30000);
  }

  function hideSaver() {
    TV.saverOn = false;
    $("saver").className = "";
    clearInterval(saverMove);
  }

  TV.SAVER_STYLES = STYLES;
  TV.showSaver = showSaver;
  TV.hideSaver = hideSaver;
})();
