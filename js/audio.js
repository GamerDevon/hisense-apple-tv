/* Sounds (WebAudio blips) */
(function () {
  "use strict";
  var TV = window.TV, S = TV.S;
  var actx = null;

  function ensureAudio(force) {
    if ((!S.sound && !force) || actx) { return; }
    try { var A = window.AudioContext || window.webkitAudioContext; if (A) { actx = new A(); } } catch (e) { actx = null; }
  }

  function blip(freq, dur, vol) {
    if (!actx) { return; }
    vol = Math.max(0.0002, vol * S.vol / 60); /* S.vol 0..100, 60 = original loudness */
    try {
      var o = actx.createOscillator(), g = actx.createGain(), t = actx.currentTime;
      o.type = "sine"; o.frequency.value = freq;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(vol, t + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(g); g.connect(actx.destination); o.start(t); o.stop(t + dur + 0.02);
    } catch (e) {}
  }

  function navBlip() { if (S.sound === 2) { blip(520, 0.06, 0.05); } }

  TV.ensureAudio = ensureAudio;
  TV.blip = blip;
  TV.navBlip = navBlip;
})();
