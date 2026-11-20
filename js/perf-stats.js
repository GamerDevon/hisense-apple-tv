/* Performance collectors (no UI). Everything here is what the PAGE can see, not the TV hardware:
   - heap numbers come from performance.memory (Chrome only, often n/a on TV browsers) and are JS memory only
   - a web page can NOT read the TV's real total RAM, model or serial number */
(function () {
  "use strict";
  var TV = window.TV;
  var P = { fps: 0, frameMs: 0, worstMs: 0, keyMs: -1, running: false };
  var raf = 0, last = 0, frames = 0, acc = 0, worst = 0, pendingKey = 0;

  function nowMs() { return (window.performance && performance.now) ? performance.now() : Date.now(); }

  function loop() {
    if (!P.running) { return; }
    var now = nowMs();
    if (last) {
      var dt = now - last;
      frames++; acc += dt;
      if (dt > worst) { worst = dt; }
      if (acc >= 1000) {
        P.fps = Math.round(frames * 1000 / acc); P.frameMs = acc / frames; P.worstMs = worst;
        frames = 0; acc = 0; worst = 0;
      }
    }
    last = now;
    /* key-to-frame: time from the key press until the next animation frame (where its visual change gets drawn) */
    if (pendingKey) { P.keyMs = now - pendingKey; pendingKey = 0; }
    raf = requestAnimationFrame(loop);
  }

  document.addEventListener("keydown", function () { if (P.running) { pendingKey = nowMs(); } }, true);

  function start() {
    if (P.running) { return; }
    P.running = true; last = 0; frames = 0; acc = 0; worst = 0;
    raf = requestAnimationFrame(loop);
  }
  function stop() {
    P.running = false;
    if (raf && window.cancelAnimationFrame) { cancelAnimationFrame(raf); }
    raf = 0;
  }

  function mb(n) { return (n / 1048576).toFixed(1); }

  function lines() {
    var m = window.performance && performance.memory, c = navigator.connection, out = [];
    out.push("FPS: " + (P.fps || "-") + (P.fps ? "  (" + P.frameMs.toFixed(1) + " ms, worst " + Math.round(P.worstMs) + ")" : ""));
    out.push("Key to frame: " + (P.keyMs >= 0 ? Math.round(P.keyMs) + " ms" : "press a key"));
    out.push("JS heap: " + (m ? mb(m.usedJSHeapSize) + " / " + mb(m.jsHeapSizeLimit) + " MB" : "n/a"));
    out.push("DOM nodes: " + document.getElementsByTagName("*").length);
    out.push("CPU threads: " + (navigator.hardwareConcurrency || "n/a"));
    out.push("deviceMemory: " + (navigator.deviceMemory ? "~" + navigator.deviceMemory + " GB (rounded)" : "n/a"));
    out.push("Network: " + (c ? (c.effectiveType || "?") + (c.downlink ? ", " + c.downlink + " Mbps" : "") : "n/a"));
    out.push("Window: " + window.innerWidth + "x" + window.innerHeight);
    out.push("Stage scale: " + (TV.scale ? TV.scale.toFixed(2) : "1.00") + (TV.zoomOn ? " (zoom)" : ""));
    out.push("Mode: " + ["Fast", "Balanced", "Pretty"][TV.S.perf] + (TV.hasClass("blur") ? " + blur" : ""));
    out.push("Screen: " + screen.width + "x" + screen.height + " @" + (window.devicePixelRatio || 1) + "x");
    out.push("Heap = page JS memory, not TV RAM");
    return out;
  }

  TV.perf = P;
  TV.nowMs = nowMs;
  TV.perfStart = start;
  TV.perfStop = stop;
  TV.perfLines = lines;
})();
