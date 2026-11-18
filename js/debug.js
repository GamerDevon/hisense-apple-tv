/* Debug box: last key code, window size, JS errors, and how each tile icon loaded (Developer options) */
(function () {
  "use strict";
  var TV = window.TV, $ = TV.$, C = TV.C;

  function iconReport() {
    var s = "";
    for (var k in TV.iconLog) { if (TV.iconLog.hasOwnProperty(k)) { s += "\n" + k + ":" + TV.iconLog[k]; } }
    return s;
  }

  function debugLog(e) {
    var d = $("debug");
    d.style.display = TV.debugOn ? "block" : "none";
    if (TV.debugOn) {
      d.textContent = "Kivo TV v" + (C.version || "?") + "\nkeyCode: " + e.keyCode + "\nkey: " + (e.key || "-") +
        "\nscreen: " + window.innerWidth + "x" + window.innerHeight + "\nerrors: " +
        (TV.errLog.length ? "\n  " + TV.errLog.join("\n  ") : "none") + iconReport();
    }
  }

  TV.debugLog = debugLog;
})();
