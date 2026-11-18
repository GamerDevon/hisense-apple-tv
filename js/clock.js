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

  /* S.dateFmt: 0 "Wednesday, 18 November", 1 "18.11.2026", 2 "Wed 18 Nov" */
  function dateText(d) {
    if (S.dateFmt === 1) { return d.getDate() + "." + (d.getMonth() + 1) + "." + d.getFullYear(); }
    if (S.dateFmt === 2) { return DAYS[d.getDay()].slice(0, 3) + " " + d.getDate() + " " + MONTHS[d.getMonth()].slice(0, 3); }
    return DAYS[d.getDay()] + ", " + d.getDate() + " " + MONTHS[d.getMonth()];
  }

  function tick() {
    var d = new Date(), hm = fmtTime(d);
    if (hm !== TV.lastHm) {
      var ds = dateText(d);
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
