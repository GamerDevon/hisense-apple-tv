/* Weather (Open-Meteo, no key). Result is cached per city in tvhome.weather.<city> */
(function () {
  "use strict";
  var TV = window.TV, $ = TV.$, S = TV.S, store = TV.store;
  var req = null;

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
    $("w-place").textContent = TV.weatherLoc().name;
  }

  function cacheKey() { return "tvhome.weather." + TV.weatherLoc().name; }

  function fromCache() {
    try {
      var c = JSON.parse(store(cacheKey()));
      if (c) { showWeather(c.t, c.c); return; }
    } catch (e) {}
    TV.lastW = null;
    $("w-temp").innerHTML = "--&deg;";
    $("w-desc").textContent = "Offline";
    $("w-place").textContent = TV.weatherLoc().name;
  }

  function loadWeather() {
    var loc = TV.weatherLoc(), key = cacheKey();
    var url = "https://api.open-meteo.com/v1/forecast?latitude=" + loc.lat + "&longitude=" + loc.lon +
      "&current=temperature_2m,weather_code&timezone=auto";
    if (req) { req.onload = req.onerror = req.ontimeout = null; try { req.abort(); } catch (e0) {} }
    var x = req = new XMLHttpRequest();
    x.open("GET", url, true);
    x.timeout = 10000;
    x.onload = function () {
      try {
        var j = JSON.parse(x.responseText);
        showWeather(j.current.temperature_2m, j.current.weather_code);
        store(key, JSON.stringify({ t: j.current.temperature_2m, c: j.current.weather_code }));
      } catch (e) { fromCache(); }
    };
    x.onerror = x.ontimeout = fromCache;
    x.send();
  }

  /* Switching city: show that city's cached value right away, then refresh from the network. */
  function changeCity(name) {
    S.city = name;
    TV.saveSettings();
    fromCache();
    loadWeather();
  }

  TV.showWeather = showWeather;
  TV.weatherFromCache = fromCache;
  TV.loadWeather = loadWeather;
  TV.changeCity = changeCity;
})();
