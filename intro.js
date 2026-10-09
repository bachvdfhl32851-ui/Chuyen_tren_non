(function () {
  "use strict";
  var root = document.documentElement;
  var ov = document.getElementById("intro");
  if (!ov) { root.classList.remove("intro-open"); return; }

  var SKIP = "ctn-intro-never", LK = "ctn-lang";
  var reduce = matchMedia("(prefers-reduced-motion:reduce)").matches;
  var horn = document.getElementById("hornBtn");
  var radios = [].slice.call(ov.querySelectorAll('input[name="ilang"]'));

  var cur = "vi";
  try { cur = localStorage.getItem(LK) === "en" ? "en" : "vi"; } catch (e) {}
  var sel = cur;
  radios.forEach(function (r) {
    r.checked = r.value === sel;
    r.addEventListener("change", function () { if (r.checked) sel = r.value; });
  });

  var audio = new Audio("audio/start_sound_effect.mp3?v=2");
  audio.preload = "auto";

  var busy = false;

  function applyLang() {
    if (sel === cur) return;
    try { localStorage.setItem(LK, sel); } catch (e) {}
    var b = document.getElementById("lang");
    if (b) b.click();
  }

  function ease(t) { return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }

  function finish() {
    if (ov.parentNode) ov.parentNode.removeChild(ov);
    root.classList.remove("intro-open", "intro-go");
    document.removeEventListener("keydown", onKey, true);
    setTimeout(function () { root.classList.remove("intro-enter"); }, 1900);
  }

  function reveal(x, y) {
    // 1) the ngon ngu doi truoc, luc lop phu van che kin -> khong giat khi dang chuyen canh
    applyLang();
    // 2) cho trinh duyet ve xong roi moi bat dau chuyen canh
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        if (!reduce) {
          [ "", "s2" ].forEach(function (cls) {
            var s = document.createElement("i");
            s.className = "shock " + cls;
            s.style.setProperty("--sx", x + "px");
            s.style.setProperty("--sy", y + "px");
            ov.appendChild(s);
          });
        }
        ov.classList.add("leaving");
        root.classList.add("intro-go", "intro-enter");
        setTimeout(finish, reduce ? 700 : 1900);
      });
    });
  }

  function enter(withSound) {
    if (busy) return;
    busy = true;
    try { sessionStorage.setItem("ctn-intro-seen", "1"); } catch (e) {}   // mat khi dong tab

    var rc = (withSound ? horn : ov.firstElementChild).getBoundingClientRect();
    var x = rc.left + rc.width * (withSound ? .16 : .5);   // tu mieng loa cua tu va
    var y = rc.top + rc.height * (withSound ? .24 : .5);

    if (withSound) {
      try { audio.currentTime = 0; var p = audio.play(); if (p && p.catch) p.catch(function () {}); } catch (e) {}
      horn.classList.add("blow");
    }
    setTimeout(function () { reveal(x, y); }, withSound && !reduce ? 750 : 0);
  }

  horn.addEventListener("click", function () { enter(true); });

  function onKey(e) {
    if (e.key === "Escape") { e.preventDefault(); enter(false); return; }
    if (e.key !== "Tab") return;
    var f = [].slice.call(ov.querySelectorAll("button,input")).filter(function (n) { return !n.disabled && n.offsetParent !== null || n.type === "radio"; });
    if (!f.length) return;
    var first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }
  document.addEventListener("keydown", onKey, true);

  setTimeout(function () { try { ov.firstElementChild.focus({ preventScroll: true }); } catch (e) {} }, 900);
})();
