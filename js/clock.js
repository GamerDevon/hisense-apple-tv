/* Clock + date (home and screensaver), and the idle check that starts the screensaver */
(function () {
  "use strict";
  var TV = window.TV, $ = TV.$, S = TV.S, pad = TV.pad;
  var DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  var MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  function fmtTime(d) {
    var hr = d.getHours();
    if (S.clock24) { return pad(hr) + ":" + pad(d.getMinutes()); }
    return ((hr % 12) || 12) + ":" + pad(d.getMinutes()) + (hr < 12 ? " AM" : " PM");
  }

  function tick() {
    var d = new Date(), hm = fmtTime(d);
    if (hm !== TV.lastHm) {
      var ds = DAYS[d.getDay()] + ", " + d.getDate() + " " + MONTHS[d.getMonth()];
      TV.lastHm = hm;
      $("clock").textContent = hm;
      $("saverclock").textContent = hm;
      $("date").textContent = ds;
      $("saverdate").textContent = ds;
    }
    if (!TV.saverOn && S.saver > 0 && TV.ready && Date.now() - TV.lastActivity > S.saver * 1000) {
      if (TV.showSaver) { TV.showSaver(); }
    }
  }

  TV.fmtTime = fmtTime;
  TV.tick = tick;
})();
