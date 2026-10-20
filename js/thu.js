(function () {
  "use strict";
  var stage = document.getElementById("thuStage");
  var v = document.getElementById("thuVideo");
  var btn = document.getElementById("thuSnd");
  if (!stage || !v) return;

  /* chua co file video (hoac loi tai): giu anh poster, an nut tieng */
  var src = v.querySelector("source");
  if (src) src.addEventListener("error", function () { stage.classList.add("no-video"); });
  v.addEventListener("error", function () { stage.classList.add("no-video"); });

  /* ton trong "giam chuyen dong": khong tu chay */
  if (window.matchMedia && matchMedia("(prefers-reduced-motion:reduce)").matches) {
    v.removeAttribute("autoplay");
    v.pause();
    v.setAttribute("controls", "");
  }

  /* chi chay khi dang nhin thay (tiet kiem pin / du lieu) */
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (v.hasAttribute("controls")) return;
        if (e.isIntersecting) { var p = v.play(); if (p && p.catch) p.catch(function () {}); }
        else v.pause();
      });
    }, { threshold: 0.2 }).observe(v);
  }

  if (btn) btn.addEventListener("click", function () {
    v.muted = !v.muted;
    btn.setAttribute("aria-pressed", v.muted ? "false" : "true");
    var en = document.documentElement.lang === "en";
    btn.setAttribute("aria-label", v.muted ? (en ? "Turn video sound on" : "Bật tiếng video") : (en ? "Turn video sound off" : "Tắt tiếng video"));
    if (!v.muted) { var p = v.play(); if (p && p.catch) p.catch(function () {}); }
  });
})();
