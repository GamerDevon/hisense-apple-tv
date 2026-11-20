/* Settings > Performance */
(function () {
  "use strict";
  var TV = window.TV, S = TV.S;

  TV.addCat({
    id: "perf", order: 45, name: "Performance", color: "#ff9f0a", icon: "gauge",
    desc: "Fast is smoothest on older TVs. Pretty adds shadows, shine and animations.",
    items: [
      { name: "Performance mode", opts: ["Fast", "Balanced", "Pretty"], get: function () { return S.perf; },
        set: function (i) { S.perf = i; TV.saveSettings(); TV.applyPerf(); } },
      { name: "Speed test", val: function () { return TV.stressRunning() ? "Running..." : "Run (6 s)"; }, run: function () { TV.runStress(); } }
    ]
  });
})();
