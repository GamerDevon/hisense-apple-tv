/* Settings > Kivo TV installation demo + simulated software updater.
   These flows are UI simulations; they do not install a VIDAA system package or replace app files. */
(function () {
  "use strict";
  var TV = window.TV, C = TV.C;
  var active = false, status = "Installed", phase = 0, timer = 0;
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
        TV.toast("Kivo TV installation demo complete");
        return;
      }
      TV.updateSettings();
      timer = setTimeout(next, 650);
    }
    timer = setTimeout(next, 650);
  }

  /* Keep a simulated installed version in browser storage, separate from the code build version. */
  var BUILD_VERSION = C.version || "1.0.4";
  var installedVersion = TV.store("kivo.installedVersion") || "1.0.3";
  C.version = installedVersion;
  var updateChecked = false, updating = false, updatePhase = 0, updateStatus = "Not checked";
  var UPDATE_STEPS = ["Checking for updates", "Downloading update", "Preparing installation", "Installing Kivo TV", "Finalising update", "Restarting Kivo TV"];
  function hasUpdate() { return installedVersion !== BUILD_VERSION; }
  function updateValue() {
    if (updating) { return UPDATE_STEPS[Math.min(updatePhase, UPDATE_STEPS.length - 1)] + "…"; }
    if (!updateChecked) { return "Not checked"; }
    return hasUpdate() ? "Update available" : "Kivo TV is up to date";
  }
  function checkUpdate() {
    updateChecked = true;
    updateStatus = hasUpdate() ? "Version " + BUILD_VERSION + " is available" : "You're on the latest version";
    TV.updateSettings();
    TV.toast(updateStatus);
  }
  function installUpdate() {
    if (updating) { TV.toast("An update is already running."); return; }
    if (!updateChecked) { TV.toast("Check for updates first."); return; }
    if (!hasUpdate()) { TV.toast("Kivo TV is already up to date."); return; }
    updating = true; updatePhase = 0; TV.updateSettings();
    TV.toast("Preparing Kivo TV update");
    function next() {
      updatePhase++;
      if (updatePhase >= UPDATE_STEPS.length) {
        installedVersion = BUILD_VERSION;
        TV.store("kivo.installedVersion", installedVersion);
        C.version = installedVersion;
        updating = false; updateChecked = true; updateStatus = "Updated to " + installedVersion;
        updatePhase = 0;
        TV.updateSettings();
        TV.toast("Update complete · simulated restart finished");
        return;
      }
      TV.updateSettings();
      timer = setTimeout(next, 900);
    }
    timer = setTimeout(next, 900);
  }

  TV.addCat({
    id: "install", order: 84, name: "Software Update", color: "#0a84ff", icon: "screen",
    desc: "Check for a Kivo TV update and run the simulated installation experience.",
    items: [
      { name: "Installed version", val: function () { return "v" + installedVersion; } },
      { name: "Available version", val: function () { return hasUpdate() ? "v" + BUILD_VERSION : "Up to date"; } },
      { name: "Update status", val: updateValue },
      { name: "Check for Updates", val: function () { return "Check now"; }, run: checkUpdate },
      { name: "Install Update", val: function () { return updating ? "Installing…" : (hasUpdate() ? "Install v" + BUILD_VERSION : "No update"); }, run: installUpdate }
    ]
  });

  TV.addCat({
    id: "installer", order: 85, name: "Kivo TV Installer", color: "#0a84ff", icon: "screen",
    desc: "A presentation-only installation demo. It does not install a VIDAA system package or alter the TV's real Settings.",
    items: [
      { name: "Installation status", val: value },
      { name: "Run installer", val: function () { return active ? "Installing…" : "Start"; }, run: start },
      { name: "Package", val: function () { return (C.name || "Kivo TV") + " · " + (C.version || "1.0.0"); } },
      { name: "Installation target", val: function () { return "Kivo interface only"; } }
    ]
  });
})();