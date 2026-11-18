/* City list for the weather widget (Czech cities). Add more here: { name, lat, lon } */
(function () {
  "use strict";
  var TV = window.TV, C = TV.C, S = TV.S;

  var CITIES = [
    { name: "Praha", lat: 50.0755, lon: 14.4378 },
    { name: "Brno", lat: 49.1951, lon: 16.6068 },
    { name: "Ostrava", lat: 49.8209, lon: 18.2625 },
    { name: "Plzeň", lat: 49.7384, lon: 13.3736 },
    { name: "Liberec", lat: 50.7663, lon: 15.0543 },
    { name: "Olomouc", lat: 49.5938, lon: 17.2509 },
    { name: "České Budějovice", lat: 48.9745, lon: 14.4743 },
    { name: "Hradec Králové", lat: 50.2104, lon: 15.8252 },
    { name: "Pardubice", lat: 50.0343, lon: 15.7812 },
    { name: "Ústí nad Labem", lat: 50.6607, lon: 14.0323 },
    { name: "Zlín", lat: 49.2242, lon: 17.6627 },
    { name: "Jihlava", lat: 49.3961, lon: 15.5912 },
    { name: "Karlovy Vary", lat: 50.2319, lon: 12.872 },
    { name: "Opava", lat: 49.9387, lon: 17.9026 }
  ];

  /* The city from config.js is always selectable too, even if it isn't in the list above. */
  function allCities() {
    var out = CITIES.slice(), w = C.weather, found = false;
    for (var i = 0; i < out.length; i++) { if (w && out[i].name === w.name) { found = true; } }
    if (w && w.name && !found) { out.unshift({ name: w.name, lat: w.lat, lon: w.lon }); }
    return out;
  }

  function weatherLoc() {
    var all = allCities();
    for (var i = 0; i < all.length; i++) { if (all[i].name === S.city) { return all[i]; } }
    return all[0] || { name: "", lat: 50, lon: 15 };
  }

  TV.allCities = allCities;
  TV.weatherLoc = weatherLoc;
})();
