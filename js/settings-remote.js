/* Settings > Remote: which keys do what (info only, the keys are handled in input.js) */
(function () {
  "use strict";
  var TV = window.TV;

  function key(name, what) { return { name: name, val: what }; }

  TV.addCat({
    id: "remote", order: 76, name: "Remote", color: "#ff453a", icon: "remote",
    desc: "Shortcuts on the remote. The keyboard letters work too, handy when testing on a computer.",
    items: [
      key("Red (W)", "Next wallpaper"),
      key("Green (S)", "Screensaver"),
      key("Yellow (R)", "Reload app"),
      key("Blue (D)", "Debug box (developer)"),
      key("1", "Animations on/off"),
      key("2", "Blur on/off"),
      key("Back", "Close menu / go back")
    ]
  });
})();
