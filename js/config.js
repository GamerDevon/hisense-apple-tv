// ===== TV Home config: edit the tiles, city and options below, push to GitHub, then reopen the app on the TV =====
window.TVHOME_CONFIG = {
  // App name shown on the home screen and in the page title.
  name: "Kivo TV",

  // Shown bottom-right and in the Info panel, so you can tell which file the TV is really running.
  version: "1.0.3",

  // Weather widget (Open-Meteo, no API key needed). Change to your city.
  weather: { name: "Hradec Králové", lat: 50.2104, lon: 15.8252 },

  // Idle time before the clock screensaver starts.
  saverAfterSec: 120,

  // Lite mode: no animations at all. Also toggled with key 1 on the remote, or add ?lite=1 to the app URL.
  lite: false,

  // Tiles. Each one opens its URL in the TV browser engine.
  // name:  label under the tile
  // url:   where Enter goes
  // color: two gradient colors
  // icon:  optional image URL (otherwise the first letter is shown big)
  tiles: [
    { name: "YouTube",     url: "https://www.youtube.com/tv",              color: ["#ff5a5a", "#a30f2d"], icon: "https://cdn.simpleicons.org/youtube/white",    domain: "youtube.com" },
    { name: "Netflix",     url: "https://www.netflix.com/",                color: ["#e50914", "#6b0409"], icon: "https://cdn.simpleicons.org/netflix/white",    domain: "netflix.com" },
    { name: "Prime Video", url: "https://www.primevideo.com/",             color: ["#1fa3ff", "#0b4a85"], icon: "https://cdn.simpleicons.org/primevideo/white", domain: "primevideo.com" },
    { name: "Disney+",     url: "https://www.disneyplus.com/",             color: ["#2f6bff", "#0f2468"], icon: "https://cdn.simpleicons.org/disneyplus/white", domain: "disneyplus.com" },
    { name: "Twitch",      url: "https://www.twitch.tv/",                  color: ["#9146ff", "#43199e"], icon: "https://cdn.simpleicons.org/twitch/white",     domain: "twitch.tv" },
    { name: "Spotify",     url: "https://open.spotify.com/",               color: ["#1ed760", "#0a5f2c"], icon: "https://cdn.simpleicons.org/spotify/white",    domain: "spotify.com" },
    { name: "Plex",        url: "https://app.plex.tv/desktop/",            color: ["#f0a90f", "#7a4f00"], icon: "https://cdn.simpleicons.org/plex/white",       domain: "plex.tv" },
    { name: "iVysílání", slug: "ivysilani",   url: "https://www.ceskatelevize.cz/ivysilani/", color: ["#12a8c4", "#0b6b80"], domain: "ceskatelevize.cz" }
  ]
};
