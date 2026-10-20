/* Ý kiến dưới bài viết: lưu trong trình duyệt của người xem (localStorage) */
(function () {
  "use strict";
  var box = document.getElementById("cm");
  if (!box) return;
  var KEY = box.getAttribute("data-key"), list = document.getElementById("cmList");
  var form = document.getElementById("cmForm"), nameI = document.getElementById("cmName"), txt = document.getElementById("cmText");
  var send = document.getElementById("cmSend"), cnt = document.getElementById("cmCount"), num = document.getElementById("cmN");
  var tab = "top", items = [];
  function load() { try { items = JSON.parse(localStorage.getItem(KEY) || "[]") || []; } catch (e) { items = []; } }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(items)); } catch (e) {} }
  function en() { return document.documentElement.lang === "en"; }
  function fmt(t) {
    var d = new Date(t), p = function (n) { return (n < 10 ? "0" : "") + n; };
    return p(d.getHours()) + ":" + p(d.getMinutes()) + " " + p(d.getDate()) + "/" + p(d.getMonth() + 1) + "/" + d.getFullYear();
  }
  function render() {
    num.textContent = items.length;
    var s = items.slice().sort(function (a, b) { return tab === "top" ? (b.likes - a.likes) || (b.t - a.t) : b.t - a.t; });
    list.innerHTML = "";
    if (!s.length) { var e = document.createElement("li"); e.className = "cm-empty"; e.textContent = en() ? "No comments yet. Be the first to share." : "Chưa có ý kiến nào. Hãy là người đầu tiên chia sẻ."; list.appendChild(e); return; }
    s.forEach(function (c) {
      var li = document.createElement("li"); li.className = "cm-item";
      var av = document.createElement("span"); av.className = "cm-av"; av.textContent = (c.name || "?").charAt(0).toUpperCase();
      var tx = document.createElement("p"); tx.className = "cm-tx";
      var b = document.createElement("b"); b.textContent = c.name; tx.appendChild(b); tx.appendChild(document.createTextNode(c.text));
      var act = document.createElement("div"); act.className = "cm-act";
      var lk = document.createElement("button"); lk.type = "button"; if (c.liked) lk.className = "on";
      lk.textContent = "👍 " + (en() ? "Like" : "Thích") + (c.likes ? " · " + c.likes : "");
      lk.onclick = function () { c.liked = !c.liked; c.likes = Math.max(0, (c.likes || 0) + (c.liked ? 1 : -1)); save(); render(); };
      var tm = document.createElement("time"); tm.textContent = fmt(c.t);
      act.appendChild(lk); act.appendChild(tm); li.appendChild(av); li.appendChild(tx); li.appendChild(act); list.appendChild(li);
    });
  }
  txt.addEventListener("input", function () { cnt.textContent = txt.value.length + "/1000"; send.disabled = !txt.value.trim(); });
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var v = txt.value.trim(); if (!v) return;
    items.push({ name: nameI.value.trim() || (en() ? "Guest" : "Bạn đọc"), text: v, t: Date.now(), likes: 0, liked: false });
    save(); txt.value = ""; cnt.textContent = "0/1000"; send.disabled = true; render();
  });
  [].forEach.call(box.querySelectorAll(".cm-tabs button"), function (b) {
    b.onclick = function () {
      tab = b.getAttribute("data-tab");
      [].forEach.call(box.querySelectorAll(".cm-tabs button"), function (x) { x.classList.toggle("on", x === b); });
      render();
    };
  });
  document.addEventListener("langchange", render);
  load(); render();
})();
