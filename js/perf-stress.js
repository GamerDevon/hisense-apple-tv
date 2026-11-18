/* Stress test: moves 300 small boxes with JS every frame for 6 seconds, then reports FPS in a toast.
   Compare the result to the normal HUD FPS to see how much headroom the TV has. */
(function () {
  "use strict";
  var TV = window.TV, $ = TV.$;
  var N = 300, DURATION = 6000, running = false;

  function runStress() {
    if (running) { return; }
    running = true;
    var host = document.createElement("div"), nodes = [], i;
    host.id = "stress";
    for (i = 0; i < N; i++) {
      var d = document.createElement("div");
      d.className = "sd";
      host.appendChild(d);
      nodes.push({ el: d, x: Math.random() * 1800, y: Math.random() * 1000, p: Math.random() * 6.28 });
    }
    $("stage").appendChild(host);
    TV.updateSettings();

    var t0 = TV.nowMs(), prev = t0, frames = 0, worst = 0;
    function step() {
      var now = TV.nowMs(), dt = now - prev;
      prev = now; frames++;
      if (dt > worst) { worst = dt; }
      var t = now / 400;
      for (var k = 0; k < N; k++) {
        var n = nodes[k], tr = "translate(" + Math.round(n.x + Math.sin(t + n.p) * 60) + "px," + Math.round(n.y + Math.cos(t + n.p) * 40) + "px)";
        n.el.style.webkitTransform = n.el.style.transform = tr;
      }
      if (now - t0 < DURATION) { requestAnimationFrame(step); return; }
      $("stage").removeChild(host);
      running = false;
      TV.toast("Stress test: avg " + Math.round(frames * 1000 / (now - t0)) + " fps, worst frame " + Math.round(worst) + " ms (" + N + " boxes)", 6000);
      TV.updateSettings();
    }
    requestAnimationFrame(step);
  }

  TV.runStress = runStress;
  TV.stressRunning = function () { return running; };
})();
