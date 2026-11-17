/* Screensaver & Startup Splash */
(function () {
  "use strict";
  var TV = window.TV, $ = TV.$;

  /* ---------- Screensaver ---------- */
  var saverMove = null;
  function showSaver() {
    TV.saverOn = true; $("saver").className = "on";
    moveSaver();
    saverMove = setInterval(moveSaver, 30000);
  }
  function moveSaver() {
    var c = $("saverclock");
    var tr = "translate(" + (120 + Math.floor(Math.random() * 1000)) + "px," + (80 + Math.floor(Math.random() * 640)) + "px)";
    c.style.webkitTransform = c.style.transform = tr;
  }
  function hideSaver() {
    TV.saverOn = false; $("saver").className = ""; clearInterval(saverMove);
  }

  /* ---------- Startup splash: glowing blob, then zoom out into Home ---------- */
  function runSplash(done) {
    var cv = $("blob"), g = cv.getContext("2d"), t0 = Date.now(), D = 2000, finished = false;
    g.scale(0.5, 0.5); // canvas is half resolution
    var COLS = ["rgba(70,190,255,", "rgba(60,255,200,", "rgba(120,140,255,"];
    function frame() {
      var t = Date.now() - t0, p = Math.min(1, t / D);
      g.globalCompositeOperation = "source-over";
      g.clearRect(0, 0, 600, 600);
      g.globalCompositeOperation = "lighter";
      var fade = p < 0.2 ? p / 0.2 : 1;
      for (var i = 0; i < COLS.length; i++) {
        var a = t / 650 + i * 1.26,
            r = (80 + 26 * Math.sin(t / 420 + i)) * (0.6 + 0.4 * fade),
            x = 300 + Math.cos(a) * 62 * (1 - p * 0.35),
            y = 300 + Math.sin(a * 1.3) * 62 * (1 - p * 0.35),
            gr = g.createRadialGradient(x, y, 0, x, y, r * 1.7);
        gr.addColorStop(0, COLS[i] + (0.85 * fade) + ")");
        gr.addColorStop(1, COLS[i] + "0)");
        g.fillStyle = gr; g.beginPath(); g.arc(x, y, r * 1.7, 0, 6.2832); g.fill();
      }
      if (p < 1) { requestAnimationFrame(frame); }
      else if (!finished) { finished = true; done(); }
    }
    requestAnimationFrame(frame);
    setTimeout(function () { if (!finished) { finished = true; done(); } }, D + 800); // safety net
  }

  function startHome() {
    var s = $("splash");
    s.className = "out";
    $("home").className = "in";
    TV.ready = true;
    TV.lastActivity = Date.now();
    setTimeout(function () { s.className = "gone"; }, 1000);
  }

  TV.showSaver = showSaver;
  TV.hideSaver = hideSaver;
  TV.runSplash = runSplash;
  TV.startHome = startHome;
})();
