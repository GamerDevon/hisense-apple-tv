/* Weather (Open-Meteo) */
(function () {
  "use strict";
  var TV = window.TV, $ = TV.$, C = TV.C, S = TV.S, store = TV.store;

  function codeText(c) {
    if (c === 0) { return "Clear"; }
    if (c <= 2) { return "Partly cloudy"; }
    if (c === 3) { return "Overcast"; }
    if (c === 45 || c === 48) { return "Fog"; }
    if (c >= 51 && c <= 57) { return "Drizzle"; }
    if (c >= 61 && c <= 67) { return "Rain"; }
    if (c >= 71 && c <= 77) { return "Snow"; }
    if (c >= 80 && c <= 82) { return "Showers"; }
    if (c >= 85 && c <= 86) { return "Snow showers"; }
    if (c >= 95) { return "Thunderstorm"; }
    return "-";
  }

  function showWeather(t, code) {
    TV.lastW = { t: t, c: code };
    $("w-temp").innerHTML = Math.round(S.tempF ? t * 9 / 5 + 32 : t) + "&deg;" + (S.tempF ? "F" : "C");
    $("w-desc").textContent = codeText(code);
    $("w-place").textContent = C.weather.name;
  }

  function loadWeather() {
    var url = "https://api.open-meteo.com/v1/forecast?latitude=" + C.weather.lat + "&longitude=" + C.weather.lon +
      "&current=temperature_2m,weather_code&timezone=auto";
    var x = new XMLHttpRequest();
    x.open("GET", url, true);
    x.timeout = 10000;
    x.onload = function () {
      try {
        var j = JSON.parse(x.responseText);
        showWeather(j.current.temperature_2m, j.current.weather_code);
        store("tvhome.weather", JSON.stringify({ t: j.current.temperature_2m, c: j.current.weather_code }));
      } catch (e) { fromCache(); }
    };
    x.onerror = x.ontimeout = fromCache;
    x.send();
  }

  function fromCache() {
    try {
      var c = JSON.parse(store("tvhome.weather"));
      if (c) { showWeather(c.t, c.c); return; }
    } catch (e) {}
    $("w-desc").textContent = "Offline";
    $("w-place").textContent = C.weather.name;
  }

  TV.showWeather = showWeather;
  TV.loadWeather = loadWeather;
})();
