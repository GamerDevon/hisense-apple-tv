/* Settings > Accessibility */
(function () {
  "use strict";
  var TV = window.TV, S = TV.S;

  TV.addCat({
    id: "access", order: 72, name: "Accessibility", color: "#0a84ff", icon: "access",
    desc: "Make the home screen easier to see.",
    items: [
      { name: "Focus highlight", opts: ["Normal", "Strong"], get: function () { return S.focusStrong ? 1 : 0; },
        set: function (i) { S.focusStrong = (i === 1); TV.saveSettings(); TV.applyAccess(); } },
      { name: "Clock size", opts: ["Normal", "Large"], get: function () { return S.bigClock ? 1 : 0; },
        set: function (i) { S.bigClock = (i === 1); TV.saveSettings(); TV.applyAccess(); } }
    ]
  });
})();
