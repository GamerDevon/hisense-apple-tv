/* Settings > Network. Details come from the browser and may be missing on some TVs. */
(function () {
  "use strict";
  var TV = window.TV, result = "";

  function conn() { return navigator.connection || null; }

  function testConnection() {
    if (result === "Testing...") { return; }
    result = "Testing...";
    TV.updateSettings();
    var t0 = TV.nowMs(), x = new XMLHttpRequest();
    x.open("GET", "https://api.open-meteo.com/v1/forecast?latitude=0&longitude=0&current=temperature_2m&_=" + Math.round(t0), true);
    x.timeout = 8000;
    x.onload = function () { result = (x.status === 200) ? Math.round(TV.nowMs() - t0) + " ms" : "Failed"; TV.updateSettings(); };
    x.onerror = x.ontimeout = function () { result = "Failed"; TV.updateSettings(); };
    x.send();
  }

  TV.addCat({
    id: "network", order: 74, name: "Network", color: "#30b0c7", icon: "network",
    desc: "Connection details from the browser. The test times one request to the weather service, it is not an internet speed test.",
    onEnter: function () { result = ""; },
    items: [
      { name: "Status", val: function () { return navigator.onLine === false ? "Offline" : "Online"; } },
      { name: "Connection", val: function () { var c = conn(); return c && c.effectiveType ? c.effectiveType : "n/a"; } },
      { name: "Downlink", val: function () { var c = conn(); return c && c.downlink ? c.downlink + " Mbps" : "n/a"; } },
      { name: "Test connection", val: function () { return result || "Run"; }, run: testConnection }
    ]
  });
})();
