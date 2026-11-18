/* Stats HUD (top-right box). Rewrites its text once per second, and only if the text changed. */
(function () {
  "use strict";
  var TV = window.TV, $ = TV.$;
  var timer = null, lastText = "";

  function render() {
    var t = TV.perfLines().join("\n");
    if (t !== lastText) { lastText = t; $("hud").textContent = t; }
  }

  function setHud(on) {
    var el = $("hud");
    clearInterval(timer);
    timer = null;
    if (on) {
      TV.perfStart();
      el.style.display = "block";
      lastText = "";
      render();
      timer = setInterval(render, 1000);
    } else {
      TV.perfStop();
      el.style.display = "none";
    }
  }

  TV.setHud = setHud;
})();
