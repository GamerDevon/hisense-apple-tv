/* Accessibility: stronger focus ring on tiles, larger clock (body classes, styles in css/access.css) */
(function () {
  "use strict";
  var TV = window.TV, S = TV.S;

  function applyAccess() {
    TV.setClass("fring", !!S.focusStrong);
    TV.setClass("bigclock", !!S.bigClock);
  }

  TV.applyAccess = applyAccess;
})();
