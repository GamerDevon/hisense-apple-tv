/* Simulated Kivo TV software updater.
   This UI flow does not download/replace app files or install a VIDAA system package. */
(function () {
  "use strict";
  var TV = window.TV, C = TV.C;

  /* Keep the simulated installed version separate from the code build version. */
  var BUILD_VERSION = C.version || "1.0.8";
  var installedVersion = TV.store("kivo.installedVersion") || "1.0.3";
  var updateChecked = false, updating = false, updatePhase = 0, timer = 0;
  var updateStatus = "Not checked";
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
})();
