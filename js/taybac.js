/* Canh hoa ban / hoa man roi tren hero (trang chu). Tu tat khi nguoi dung chon giam chuyen dong. */
(function () {
  "use strict";
  var box = document.getElementById("tbPetals");
  if (!box || matchMedia("(prefers-reduced-motion:reduce)").matches) return;
  function uri(s) { return 'url("data:image/svg+xml,' + encodeURIComponent(s) + '")'; }
  var petalPath = '<ellipse cx="12" cy="7.5" rx="4.6" ry="7" fill="#fffdf8" stroke="#e6dfcc" stroke-width=".6"/>';
  var flower = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">' +
    [0, 72, 144, 216, 288].map(function (a) { return '<g transform="rotate(' + a + ' 12 12)">' + petalPath + '</g>'; }).join("") +
    '<circle cx="12" cy="12" r="2.4" fill="#d9bb3c"/><circle cx="12" cy="12" r="1" fill="#b64a77"/></svg>';
  var single = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><ellipse cx="12" cy="12" rx="5.5" ry="9" fill="#fffdf8" stroke="#e6dfcc" stroke-width=".7" transform="rotate(25 12 12)"/><path d="M12 19 Q11 12 14 5" stroke="#d9cdb8" stroke-width="1.2" fill="none"/></svg>';
  var imgs = [uri(flower), uri(single)];
  var n = innerWidth < 700 ? 11 : 20, r = Math.random;
  for (var i = 0; i < n; i++) {
    var p = document.createElement("i");
    p.className = "tb-petal";
    var s = p.style;
    s.setProperty("--img", imgs[r() < .55 ? 0 : 1]);
    s.setProperty("--x", (r() * 100).toFixed(1) + "%");
    s.setProperty("--s", (11 + r() * 15).toFixed(0) + "px");
    s.setProperty("--o", (.55 + r() * .4).toFixed(2));
    s.setProperty("--d", (11 + r() * 10).toFixed(1) + "s");
    s.setProperty("--dl", (-r() * 20).toFixed(1) + "s");
    s.setProperty("--dx", ((r() - .5) * 220).toFixed(0) + "px");
    box.appendChild(p);
  }
  var hero = box.parentNode;
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (es) {
      box.classList.toggle("paused", !es[0].isIntersecting);
    }).observe(hero);
  }
})();
