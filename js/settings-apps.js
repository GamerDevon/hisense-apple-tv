/* Settings > Apps: show or hide each app tile (apps come from config.js) */
(function () {
  "use strict";
  var TV = window.TV, tiles = TV.C.tiles;

  function appItem(t) {
    return { name: t.name, opts: ["Shown", "Hidden"], get: function () { return TV.isHidden(t.name) ? 1 : 0; },
      set: function (i) { TV.setHidden(t.name, i === 1); TV.rebuildApps(); } };
  }

  var items = [];
  for (var i = 0; i < tiles.length; i++) { items.push(appItem(tiles[i])); }

  TV.addCat({
    id: "apps", order: 30, name: "Apps", color: "#34c759", icon: "grid",
    desc: "Hide apps you don't use. Settings always stays on the home screen.",
    hidden: function () { return !items.length; },
    items: items
  });
})();
