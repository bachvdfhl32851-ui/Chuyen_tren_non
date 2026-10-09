(function () {
  "use strict";
  var cards = document.querySelectorAll("#cacmua .mc");
  if (!cards.length) return;

  /* bam vao bat ky cho nao tren the cung mo trang mua */
  cards.forEach(function (card) {
    card.addEventListener("click", function (e) {
      var a = card.querySelector(".mc-go");
      if (!a || e.target.closest("a")) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey) { window.open(a.href, "_blank"); return; }
      location.href = a.href;
    });
  });

  /* nhan song ngu cho lien ket tu va */
  function sync() {
    var en = document.documentElement.lang === "en";
    document.querySelectorAll("#cacmua .mc-go").forEach(function (a) {
      if (!a.dataset.viAria) { a.dataset.viAria = a.getAttribute("aria-label"); a.dataset.viTtl = a.getAttribute("title"); }
      a.setAttribute("aria-label", en ? a.dataset.enAria : a.dataset.viAria);
      a.setAttribute("title", en ? a.dataset.enTtl : a.dataset.viTtl);
    });
  }
  document.addEventListener("langchange", sync);
  sync();
})();
