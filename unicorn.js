/* ===== Flying unicorn that chases your cursor + falling sprinkles ===== */
(function () {
  "use strict";

  /* ---------- Build the winged unicorn ---------- */
  var uni = document.createElement("div");
  uni.id = "unicorn";
  uni.setAttribute("aria-hidden", "true");
  uni.innerHTML =
    '<div class="body">' +
      '<svg class="uni-svg" viewBox="0 0 120 112" xmlns="http://www.w3.org/2000/svg">' +
        /* Rainbow tail flowing behind */
        '<path d="M24 50 Q2 42 8 24 Q16 38 26 42 Z" fill="#ff5fa2"/>' +
        '<path d="M24 55 Q0 55 5 38 Q15 49 26 49 Z" fill="#a35bff"/>' +
        '<path d="M24 59 Q3 73 13 86 Q19 70 27 60 Z" fill="#3fb4ff"/>' +
        '<path d="M24 57 Q1 66 8 82 Q16 66 27 55 Z" fill="#ffd23f" opacity="0.85"/>' +
        /* Back legs + hooves */
        '<rect x="35" y="66" width="10" height="30" rx="5" fill="#efe0ff"/>' +
        '<rect x="59" y="66" width="10" height="30" rx="5" fill="#efe0ff"/>' +
        '<rect x="35" y="90" width="10" height="7" rx="3" fill="#c9a8f5"/>' +
        '<rect x="59" y="90" width="10" height="7" rx="3" fill="#c9a8f5"/>' +
        /* Body */
        '<ellipse cx="52" cy="53" rx="34" ry="24" fill="#ffffff"/>' +
        /* Front legs + hooves */
        '<rect x="45" y="68" width="10" height="29" rx="5" fill="#ffffff"/>' +
        '<rect x="69" y="68" width="10" height="29" rx="5" fill="#ffffff"/>' +
        '<rect x="45" y="91" width="10" height="7" rx="3" fill="#e3ceff"/>' +
        '<rect x="69" y="91" width="10" height="7" rx="3" fill="#e3ceff"/>' +
        /* Neck */
        '<path d="M72 44 Q77 21 92 21 L99 40 Q95 57 76 56 Z" fill="#ffffff"/>' +
        /* Head + snout */
        '<ellipse cx="95" cy="29" rx="15" ry="13" fill="#ffffff"/>' +
        '<ellipse cx="107" cy="33" rx="8" ry="6.5" fill="#ffffff"/>' +
        '<circle cx="110" cy="34" r="1.5" fill="#c98bd0"/>' +
        /* Ear */
        '<polygon points="85,19 89,6 95,18" fill="#ffffff"/>' +
        '<polygon points="87,17 89,9 92,17" fill="#ffd9f0"/>' +
        /* Golden horn */
        '<polygon points="99,2 94,20 107,16" fill="#ffd23f"/>' +
        '<polygon points="99,2 97,11 102,9" fill="#ffe98a"/>' +
        /* Eye */
        '<circle cx="98" cy="29" r="3" fill="#4a2b6b"/>' +
        '<circle cx="99.3" cy="27.8" r="1" fill="#ffffff"/>' +
        /* Rainbow mane down the neck */
        '<path d="M92 5 Q105 13 96 24 Q90 15 85 21 Q88 11 92 5 Z" fill="#ff5fa2"/>' +
        '<path d="M85 21 Q96 26 87 37 Q81 28 78 34 Q81 24 85 21 Z" fill="#a35bff"/>' +
        '<path d="M78 34 Q89 40 80 51 Q74 42 71 48 Q74 37 78 34 Z" fill="#3fb4ff"/>' +
        /* Wing (flaps) */
        '<g class="wing-svg">' +
          '<path d="M55 41 Q35 12 7 19 Q26 29 26 50 Q31 43 41 45 Q46 41 55 41 Z" fill="#cbb0ff"/>' +
          '<path d="M50 42 Q34 24 15 27 M46 43 Q33 33 22 37 M43 45 Q34 40 27 44" stroke="#9d6df0" stroke-width="1.6" fill="none" stroke-linecap="round"/>' +
        '</g>' +
      '</svg>' +
    '</div>';
  document.body.appendChild(uni);

  var body = uni.querySelector(".body");
  var HALFW = 60;           // half unicorn width  (matches CSS 120px)
  var HALFH = 56;           // half unicorn height (matches CSS 112px)

  // Start the unicorn in the middle of the screen.
  var uniX = window.innerWidth / 2;
  var uniY = window.innerHeight / 2;

  // Target = where the cursor is. Default to centre until the mouse moves.
  var targetX = uniX;
  var targetY = uniY;
  var facingLeft = false;

  function setTarget(x, y) {
    targetX = x;
    targetY = y;
  }

  window.addEventListener("mousemove", function (e) {
    setTarget(e.clientX, e.clientY);
  });

  // Touch screens: chase the finger too.
  window.addEventListener("touchmove", function (e) {
    if (e.touches && e.touches.length) {
      setTarget(e.touches[0].clientX, e.touches[0].clientY);
    }
  }, { passive: true });

  /* ---------- Clamp so it never leaves the page ---------- */
  function clamp(value, min, max) {
    return value < min ? min : (value > max ? max : value);
  }

  /* ---------- Animation loop (smooth easing, all directions) ---------- */
  function tick() {
    // Ease toward the cursor — smaller = slower, gentler chase.
    var dx = targetX - uniX;
    var dy = targetY - uniY;
    uniX += dx * 0.05;
    uniY += dy * 0.05;

    // Keep the whole unicorn on screen, above and below.
    uniX = clamp(uniX, HALFW, window.innerWidth - HALFW);
    uniY = clamp(uniY, HALFH, window.innerHeight - HALFH);

    // Face the direction it's flying (flip left/right).
    if (dx < -0.5) facingLeft = true;
    else if (dx > 0.5) facingLeft = false;
    body.style.transform = facingLeft ? "scaleX(-1)" : "scaleX(1)";

    // A little up-and-down bob while flying.
    var bob = Math.sin(uniX / 40) * 4;

    uni.style.transform =
      "translate(" + (uniX - HALFW) + "px, " + (uniY - HALFH + bob) + "px)";

    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);

  /* ---------- Sprinkles raining down ---------- */
  var COLORS = ["#ff5fa2", "#3fb4ff", "#a35bff", "#ffd23f", "#ff8ac2", "#7ad0ff"];

  function makeSprinkle() {
    var s = document.createElement("div");
    s.className = "sprinkle";

    var w = 6 + Math.random() * 5;       // little rectangle
    var h = w * (2 + Math.random());
    s.style.width = w + "px";
    s.style.height = h + "px";
    s.style.background = COLORS[Math.floor(Math.random() * COLORS.length)];
    s.style.left = Math.random() * window.innerWidth + "px";
    s.style.opacity = 0.85;

    document.body.appendChild(s);

    var startY = -20;
    var endY = window.innerHeight + 30;
    var duration = 4000 + Math.random() * 4000;   // 4–8 seconds
    var drift = (Math.random() - 0.5) * 120;      // gentle side sway
    var spin = Math.random() * 720 - 360;
    var startTime = null;

    function fall(now) {
      if (startTime === null) startTime = now;
      var t = (now - startTime) / duration;
      if (t >= 1) {
        s.remove();
        return;
      }
      var y = startY + (endY - startY) * t;
      var x = Math.sin(t * Math.PI * 2) * drift;
      s.style.transform =
        "translate(" + x + "px, " + y + "px) rotate(" + (spin * t) + "deg)";
      requestAnimationFrame(fall);
    }
    requestAnimationFrame(fall);
  }

  // Drop a new sprinkle every so often (skip if user prefers reduced motion).
  var reduce = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduce) {
    setInterval(makeSprinkle, 350);
    // A few to start with so it looks alive right away.
    for (var i = 0; i < 6; i++) setTimeout(makeSprinkle, i * 120);
  }
})();
