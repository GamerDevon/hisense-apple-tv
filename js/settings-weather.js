/* Settings > Weather: city for the weather widget (list is in weather-cities.js) */
(function () {
  "use strict";
  var TV = window.TV, cities = TV.allCities();

  function names() { var a = []; for (var i = 0; i < cities.length; i++) { a.push(cities[i].name); } return a; }
  function cur() { var n = TV.weatherLoc().name; for (var i = 0; i < cities.length; i++) { if (cities[i].name === n) { return i; } } return 0; }

  TV.addCat({
    id: "weather", order: 50, name: "Weather", color: "#0a84ff", icon: "cloud",
    desc: "Pick the city for the weather widget. Data comes from Open-Meteo.",
    items: [
      { name: "City", opts: names(), get: cur, set: function (i) { TV.changeCity(cities[i].name); } },
      { name: "Refresh now", val: "Refresh", run: function () { TV.loadWeather(); TV.toast("Refreshing weather..."); } }
    ]
  });
})();
