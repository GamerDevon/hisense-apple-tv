/* Settings category icons (white SVG shapes on the colored tile) */
(function () {
  "use strict";
  var TV = window.TV;
  var H = "<svg width='100%' height='100%' viewBox='0 0 100 100'>", E = "</svg>";

  TV.ICONS = {
    gear: H + "<circle cx='50' cy='50' r='37' fill='none' stroke='#fff' stroke-width='12' stroke-dasharray='9.7 9.7'/><circle cx='50' cy='50' r='26' fill='none' stroke='#fff' stroke-width='12'/>" + E,
    half: H + "<circle cx='50' cy='50' r='34' fill='none' stroke='#fff' stroke-width='8'/><path d='M50 16a34 34 0 0 1 0 68z' fill='#fff'/>" + E,
    speaker: H + "<path d='M14 38h16l22-18v60L30 62H14z' fill='#fff'/><path d='M64 36q14 14 0 28' fill='none' stroke='#fff' stroke-width='8' stroke-linecap='round'/><path d='M74 24q24 26 0 52' fill='none' stroke='#fff' stroke-width='8' stroke-linecap='round'/>" + E,
    screen: H + "<rect x='12' y='22' width='76' height='50' rx='8' fill='none' stroke='#fff' stroke-width='8'/><path d='M36 86h28' stroke='#fff' stroke-width='8' stroke-linecap='round'/>" + E,
    info: H + "<circle cx='50' cy='50' r='36' fill='none' stroke='#fff' stroke-width='8'/><circle cx='50' cy='32' r='5' fill='#fff'/><path d='M50 46v26' stroke='#fff' stroke-width='9' stroke-linecap='round'/>" + E,
    home: H + "<path d='M14 48L50 18l36 30' fill='none' stroke='#fff' stroke-width='9' stroke-linecap='round' stroke-linejoin='round'/><path d='M24 46v34h18V58h16v22h18V46L50 28z' fill='#fff'/>" + E,
    grid: H + "<rect x='14' y='14' width='32' height='32' rx='8' fill='#fff'/><rect x='54' y='14' width='32' height='32' rx='8' fill='#fff'/><rect x='14' y='54' width='32' height='32' rx='8' fill='#fff'/><rect x='54' y='54' width='32' height='32' rx='8' fill='#fff'/>" + E,
    cloud: H + "<path d='M30 74a17 17 0 0 1 1-34 23 23 0 0 1 44 7 14 14 0 0 1-2 27z' fill='#fff'/>" + E,
    dev: H + "<path d='M34 30L14 50l20 20M66 30l20 20-20 20' fill='none' stroke='#fff' stroke-width='9' stroke-linecap='round' stroke-linejoin='round'/><path d='M57 22L43 78' stroke='#fff' stroke-width='8' stroke-linecap='round'/>" + E
  };
})();
