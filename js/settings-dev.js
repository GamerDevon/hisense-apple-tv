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

  TV.addCat({
    id: "dev", order: 90, name: "Developer options", color: "#bf5af2", icon: "dev",
    desc: "Debug box and performance tools.",
    hidden: function () { return !S.dev; },
    items: [
      { name: "Debug box", opts: ["Hidden", "Shown"], get: function () { return TV.debugOn ? 1 : 0; },
        set: function (i) { TV.debugOn = (i === 1); TV.debugLog({ keyCode: "-" }); } },
      perf,
      { name: "Turn off developer options", val: "Turn off", run: turnOff }
    ]
  });
})();
