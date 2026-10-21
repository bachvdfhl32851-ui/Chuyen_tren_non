/* O trong cho anh / video chua co: neu tep chua duoc them, hien khung nhac ten tep can them.
   Danh dau bang thuoc tinh data-add="duong/dan/tu/thu-muc/goc" tren <img> hoac <video>. */
(function () {
  "use strict";
  function mark(el, txt) {
    var p = el.parentNode;
    if (!p || p.classList.contains("ph-missing")) return;
    p.classList.add("ph-missing");
    p.setAttribute("data-ph", txt + el.getAttribute("data-add"));
  }
  function scan(root) {
    [].forEach.call((root || document).querySelectorAll("img[data-add]"), function (i) {
      if (i.complete && i.naturalWidth === 0) mark(i, "Thêm ảnh: ");
    });
  }
  document.addEventListener("error", function (e) {
    var t = e.target;
    if (!t || !t.tagName) return;
    if (t.tagName === "IMG" && t.hasAttribute("data-add")) mark(t, "Thêm ảnh: ");
    else if (t.tagName === "SOURCE" && t.parentNode && t.parentNode.hasAttribute("data-add")) mark(t.parentNode, "Thêm video: ");
  }, true);
  window.CTN_FB = scan;
  scan();
  window.addEventListener("load", function () { scan(); });
})();
