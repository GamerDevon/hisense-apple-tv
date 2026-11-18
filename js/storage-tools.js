/* Helpers for what this app keeps in the TV browser's localStorage (all keys start with "tvhome.") */
(function () {
  "use strict";
  var TV = window.TV;

  function keys(prefix) {
    var out = [];
    try {
      for (var i = 0; i < localStorage.length; i++) {
        var k = localStorage.key(i);
        if (k.indexOf(prefix) === 0) { out.push(k); }
      }
    } catch (e) {}
    return out;
  }

  /* Rough size in KB (browsers store 2 bytes per character) */
  function storageKb() {
    var n = 0, ks = keys("tvhome.");
    for (var i = 0; i < ks.length; i++) { n += ks[i].length + (TV.store(ks[i]) || "").length; }
    return (n * 2 / 1024).toFixed(1);
  }

  function clearWeatherCache() {
    var ks = keys("tvhome.weather");
    for (var i = 0; i < ks.length; i++) { try { localStorage.removeItem(ks[i]); } catch (e) {} }
  }

  TV.storageKb = storageKb;
  TV.clearWeatherCache = clearWeatherCache;
})();
