/* Settings > Kivo TV installation experience.
   This is a presentation-only installer simulation inside Kivo; it cannot install or register a VIDAA system package. */
(function () {
  "use strict";
  var TV = window.TV, C = TV.C, active = false, status = "Installed", phase = 0, timer = 0;
  var STEPS = ["Checking Kivo package", "Preparing interface", "Registering Kivo home entry", "Verifying launch files", "Installation complete"];

  function value() {
    if (active) { return STEPS[Math.min(phase, STEPS.length - 1)] + "…"; }
    return status === "Installed" ? "Installed · Kivo UI demo" : status;
  }
  function start() {
    if (active) { TV.toast("Kivo installation is already running."); return; }
    active = true; phase = 0; status = "Installing"; TV.updateSettings();
    TV.toast("Kivo TV installer started");
    function next() {
      phase++;
      if (phase >= STEPS.length) {
        active = false; status = "Installed"; timer = 0;
        TV.updateSettings();
        TV.toast("Kivo TV installation complete");
        return;
      }
      TV.updateSettings();
      timer = setTimeout(next, 650);
    }
    timer = setTimeout(next, 650);
  }

  TV.addCat({
    id: "install", order: 85, name: "Kivo TV Installer", color: "#0a84ff", icon: "screen",
    desc: "A tvOS-style installation demo inside Kivo. It does not install a VIDAA system package or alter the TV's real Settings.",
    items: [
      { name: "Installation status", val: value },
      { name: "Run installer", val: function () { return active ? "Installing…" : "Start"; }, run: start },
      { name: "Package", val: function () { return (C.name || "Kivo TV") + " · " + (C.version || "1.0.0"); } },
      { name: "Installation target", val: function () { return "Kivo interface only"; } }
    ]
  });
})();
