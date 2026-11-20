/* Settings > Developer options (hidden until unlocked in About) */
(function () {
  "use strict";
  var TV = window.TV, S = TV.S;

  function turnOff() {
    S.dev = false; S.perfHud = false; TV.debugOn = false;
    TV.saveSettings(); TV.setHud(false); TV.debugLog({ keyCode: "-" });
    TV.toast("Developer options turned off.");
    TV.settingsHome();
  }

  var perf = { name: "Performance", desc: "Live stats and a stress test. Page stats only: a web page can't read the TV's real RAM, model or serial.", items: [
    { name: "Stats HUD", opts: ["Off", "On"], get: function () { return S.perfHud ? 1 : 0; },
      set: function (i) { S.perfHud = (i === 1); TV.saveSettings(); TV.setHud(S.perfHud); } },
    { name: "Stress test", val: function () { return TV.stressRunning() ? "Running..." : "Run (6 s)"; }, run: function () { TV.runStress(); } }
  ] };

  /* Performance lab: switch single effects On/Off (Auto follows the Performance mode) and watch the FPS in the Stats HUD */
  function labItem(e) {
    return { name: e[1], opts: ["Auto", "On", "Off"],
      get: function () { var v = S.lab[e[0]]; return v === 1 ? 1 : (v === 0 ? 2 : 0); },
      set: function (i) { if (i === 0) { delete S.lab[e[0]]; } else { S.lab[e[0]] = (i === 1 ? 1 : 0); } TV.saveSettings(); TV.applyPerf(); } };
  }
  var labItems = [];
  for (var i = 0; i < TV.PERF_EFFECTS.length; i++) { labItems.push(labItem(TV.PERF_EFFECTS[i])); }
  labItems.push({ name: "Reset lab", val: "Reset", run: function () { S.lab = {}; TV.saveSettings(); TV.applyPerf(); } });
  var lab = { name: "Performance lab", desc: "Turn single effects On or Off and watch FPS in the Stats HUD. Auto follows the Performance mode.", items: labItems };

  TV.addCat({
    id: "dev", order: 90, name: "Developer options", color: "#bf5af2", icon: "dev",
    desc: "Debug box and performance tools.",
    hidden: function () { return !S.dev; },
    items: [
      { name: "Debug box", opts: ["Hidden", "Shown"], get: function () { return TV.debugOn ? 1 : 0; },
        set: function (i) { TV.debugOn = (i === 1); TV.debugLog({ keyCode: "-" }); } },
      perf,
      lab,
      { name: "Turn off developer options", val: "Turn off", run: turnOff }
    ]
  });
})();
