/* Settings > Sounds (off by default; nothing plays on left/right unless "All") */
(function () {
  "use strict";
  var TV = window.TV, S = TV.S;
  var VOL = [20, 40, 60, 80, 100];

  function volIdx() { for (var i = 0; i < VOL.length; i++) { if (VOL[i] === S.vol) { return i; } } return 2; }

  TV.addCat({
    id: "sounds", order: 60, name: "Sounds", color: "#ff375f", icon: "speaker",
    desc: "Optional click sounds when you move around or open apps.",
    items: [
      { name: "UI sounds", opts: ["Off", "Select only", "All"], get: function () { return S.sound; },
        set: function (i) { S.sound = i; TV.saveSettings(); TV.ensureAudio(); } },
      { name: "Volume", opts: ["20%", "40%", "60%", "80%", "100%"], get: volIdx,
        set: function (i) { S.vol = VOL[i]; TV.saveSettings(); } },
      { name: "Test sound", val: "Play", run: function () { TV.ensureAudio(true); TV.blip(880, 0.12, 0.07); } }
    ]
  });
})();
