/* Settings > Screen Saver */
(function () {
  "use strict";
  var TV = window.TV, S = TV.S;
  var VALS = [60, 120, 300, 600, 0];

  function idx() { for (var i = 0; i < VALS.length; i++) { if (VALS[i] === S.saver) { return i; } } return 1; }

  TV.addCat({
    id: "saver", order: 70, name: "Screen Saver", color: "#ff9f0a", icon: "screen",
    desc: "A clock appears after a while without any key presses.",
    items: [
      { name: "Start after", opts: ["1 minute", "2 minutes", "5 minutes", "10 minutes", "Never"], get: idx,
        set: function (i) { S.saver = VALS[i]; TV.saveSettings(); } },
      { name: "Style", opts: TV.SAVER_STYLES, get: function () { return S.saverStyle || 0; },
        set: function (i) { S.saverStyle = i; TV.saveSettings(); } },
      { name: "Start now", val: "Start", run: function () { TV.closePanel(); TV.showSaver(); } }
    ]
  });
})();
