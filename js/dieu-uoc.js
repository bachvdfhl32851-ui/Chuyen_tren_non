(function () {
  "use strict";
  var root = document.getElementById("dieu-uoc");
  if (!root) return;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var L = function () { return document.documentElement.lang === "en" ? "en" : "vi"; };
  var T = function (o) { return o[L()] || o.vi; };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };

  /* ---------------------------------------------------------------
     DỮ LIỆU HỒ SƠ — ĐÂY LÀ DỮ LIỆU MẪU (lấy từ ví dụ trong dieu_uoc.docx).
     Thay bằng hồ sơ thật đã xác minh: mỗi hồ sơ là một object.
     type: sach | dodung | csvc | hoctap | thietyeu
     prio: gap | can | bosung        status: tim | ketnoi | thongnhat | xong
     --------------------------------------------------------------- */
  var PENDING = { vi: "Cập nhật sau khi xác minh", en: "To be updated after verification" };
  var DATA = [
    {
      id: "mau-01", sample: true, type: "sach", prio: "can", status: "tim", region: PENDING,
      title: { vi: "Bổ sung sách cho góc đọc lớp học", en: "Add books to a classroom reading corner" },
      place: { vi: "Tên trường, điểm trường, xã và tỉnh — cập nhật sau khi xác minh.", en: "School, school point, commune and province — updated after verification." },
      need: { vi: "Bổ sung sách truyện, sách khám phá và tài liệu đọc phù hợp với độ tuổi học sinh.", en: "Storybooks, discovery books and reading materials suited to the students' ages." },
      goal: { vi: "Tạo thêm cơ hội đọc sách và duy trì hoạt động đọc thường xuyên tại lớp.", en: "Create more chances to read and keep a regular reading habit in class." },
      items: null
    },
    {
      id: "mau-02", sample: true, type: "dodung", prio: "bosung", status: "tim", region: PENDING,
      title: { vi: "Bổ sung đồ dùng học tập cho lớp", en: "Add school supplies for a class" },
      place: { vi: "Tên trường, điểm trường và địa phương — cập nhật sau khi xác minh.", en: "School, school point and area — updated after verification." },
      need: { vi: "Bút, vở, thước và các vật dụng học tập theo danh sách nhà trường xác nhận.", en: "Pens, notebooks, rulers and other supplies from the list the school confirms." },
      goal: { vi: "Bổ sung những vật dụng còn thiếu, phù hợp với nhu cầu thực tế của học sinh.", en: "Fill in what is missing, matching the students' real needs." },
      items: null
    },
    {
      id: "mau-03", sample: true, type: "csvc", prio: "gap", status: "tim", region: PENDING,
      title: { vi: "Điểm trường X · 24 học sinh | 3 lớp", en: "School point X · 24 students | 3 classes" },
      place: { vi: "Điểm trường X — thông tin địa chỉ cập nhật sau khi xác minh.", en: "School point X — address updated after verification." },
      need: { vi: "Máy chiếu, tủ sách, sách thiếu nhi và đồ dùng học tập cho cả điểm trường.", en: "A projector, a bookcase, children's books and school supplies for the whole school point." },
      goal: { vi: "Đủ điều kiện học tập cơ bản cho 24 học sinh của 3 lớp.", en: "Basic learning conditions for the 24 students in 3 classes." },
      items: [
        { p: "gap", vi: "01 máy chiếu", en: "1 projector" },
        { p: "can", vi: "01 tủ sách và 300 cuốn sách thiếu nhi", en: "1 bookcase and 300 children's books" },
        { p: "bosung", vi: "24 bộ đồ dùng học tập", en: "24 sets of school supplies" }
      ]
    }
  ];

  var LBL = {
    type: { sach: { vi: "Sách", en: "Books" }, dodung: { vi: "Đồ dùng học tập", en: "School supplies" }, csvc: { vi: "Cơ sở vật chất", en: "Facilities" }, hoctap: { vi: "Học tập", en: "Learning" }, thietyeu: { vi: "Đồ dùng thiết yếu", en: "Daily necessities" } },
    prio: { gap: { vi: "Cần gấp", en: "Urgent" }, can: { vi: "Đang cần", en: "Needed" }, bosung: { vi: "Có thể bổ sung", en: "Can be added" } },
    status: { tim: { vi: "Đang tìm nguồn lực", en: "Looking for resources" }, ketnoi: { vi: "Đang kết nối", en: "Connecting" }, thongnhat: { vi: "Đã thống nhất", en: "Agreed" }, xong: { vi: "Đã hoàn thành", en: "Completed" } }
  };
  var UI = {
    sample: { vi: "Mẫu hồ sơ", en: "Sample profile" },
    place: { vi: "Địa điểm", en: "Location" },
    need: { vi: "Nội dung cần hỗ trợ", en: "What is needed" },
    goal: { vi: "Mục tiêu hỗ trợ", en: "Support goal" },
    state: { vi: "Trạng thái kết nối", en: "Connection status" },
    learn: { vi: "Tìm hiểu nhu cầu", en: "Learn about the need" },
    hide: { vi: "Thu gọn", en: "Collapse" },
    help: { vi: "Tôi muốn hỗ trợ", en: "I want to help" },
    detail: { vi: "Danh mục chi tiết sẽ được cập nhật sau khi nhà trường xác nhận.", en: "The detailed list will be updated once the school confirms." },
    detailHead: { vi: "Danh mục cần hỗ trợ", en: "Items needed" },
    note: { vi: "Hồ sơ mẫu minh họa, chưa phải nhu cầu thật.", en: "Illustrative sample, not a real need yet." },
    count: { vi: function (n) { return "Đang hiển thị " + n + " hồ sơ"; }, en: function (n) { return "Showing " + n + " profile" + (n === 1 ? "" : "s"); } },
    none: { vi: "Chưa có hồ sơ phù hợp với bộ lọc này. Hãy thử bỏ bớt điều kiện lọc.", en: "No profile matches these filters yet. Try removing a filter." },
    errReq: { vi: "Vui lòng điền đầy đủ các mục có dấu *.", en: "Please fill in all fields marked *." },
    errMail: { vi: "Email chưa đúng định dạng.", en: "The email address looks invalid." },
    errSend: { vi: "Chưa gửi được. Bạn thử lại sau hoặc liên hệ qua email của Chuyện trên non nhé.", en: "Could not send. Please try again or email Chuyen tren non." }
  };

  /* ---- bộ lọc ---- */
  var fType = $("#fType"), fRegion = $("#fRegion"), fPrio = $("#fPrio"), fStatus = $("#fStatus");
  var cardsEl = $("#duCards"), countEl = $("#duCount");
  var regions = {};
  DATA.forEach(function (d) { regions[d.region.vi] = d.region; });
  function buildRegions() {
    var cur = fRegion.value;
    fRegion.innerHTML = '<option value="">' + (L() === "en" ? "All" : "Tất cả") + "</option>" +
      Object.keys(regions).map(function (k) { return '<option value="' + esc(k) + '">' + esc(T(regions[k])) + "</option>"; }).join("");
    fRegion.value = cur;
  }

  function card(d) {
    var items = d.items ? '<ul>' + d.items.map(function (i) { return '<li><span class="p-' + i.p + '"><b>●</b></span> ' + esc(T(i)) + " <small>(" + esc(T(LBL.prio[i.p])) + ")</small></li>"; }).join("") + "</ul>" : "<p style='margin:0'>" + esc(T(UI.detail)) + "</p>";
    return '<article class="du-card" data-id="' + d.id + '">' +
      '<div class="du-tags">' +
      (d.sample ? '<span class="du-tag">' + esc(T(UI.sample)) + "</span>" : "") +
      '<span class="du-tag p-' + d.prio + '"><i></i>' + esc(T(LBL.prio[d.prio])) + "</span>" +
      '<span class="du-tag">' + esc(T(LBL.type[d.type])) + "</span></div>" +
      "<h4>" + esc(T(d.title)) + "</h4>" +
      "<dl><div><dt>" + esc(T(UI.place)) + "</dt><dd>" + esc(T(d.place)) + "</dd></div>" +
      "<div><dt>" + esc(T(UI.need)) + "</dt><dd>" + esc(T(d.need)) + "</dd></div>" +
      "<div><dt>" + esc(T(UI.goal)) + "</dt><dd>" + esc(T(d.goal)) + "</dd></div></dl>" +
      '<div class="du-more" id="more-' + d.id + '"><b>' + esc(T(UI.detailHead)) + "</b>" + items + (d.sample ? "<p style='margin:.6em 0 0;opacity:.75'>" + esc(T(UI.note)) + "</p>" : "") + "</div>" +
      '<p class="du-state"><b>' + esc(T(UI.state)) + ':</b> <span class="s-' + d.status + '">● ' + esc(T(LBL.status[d.status])) + "</span></p>" +
      '<div class="du-acts"><button class="du-btn ghost sm" type="button" data-act="more" aria-expanded="false" aria-controls="more-' + d.id + '">' + esc(T(UI.learn)) + '</button>' +
      '<button class="du-btn sm" type="button" data-act="help">' + esc(T(UI.help)) + "</button></div></article>";
  }

  function render() {
    var f = { type: fType.value, region: fRegion.value, prio: fPrio.value, status: fStatus.value };
    var list = DATA.filter(function (d) {
      return (!f.type || d.type === f.type) && (!f.region || d.region.vi === f.region) && (!f.prio || d.prio === f.prio) && (!f.status || d.status === f.status);
    });
    countEl.textContent = T(UI.count)(list.length);
    cardsEl.innerHTML = list.length ? list.map(card).join("") : '<p class="du-none">' + esc(T(UI.none)) + "</p>";
  }
  [fType, fRegion, fPrio, fStatus].forEach(function (s) { s.addEventListener("change", render); });

  /* ---- "Tìm hiểu nhu cầu" mở rộng / "Tôi muốn hỗ trợ" mở hộp thoại ---- */
  var dlg = $("#duHelp");
  cardsEl.addEventListener("click", function (e) {
    var b = e.target.closest("button[data-act]");
    if (!b) return;
    var art = b.closest(".du-card"), id = art.getAttribute("data-id");
    var d = DATA.filter(function (x) { return x.id === id; })[0];
    if (b.getAttribute("data-act") === "more") {
      var box = $("#more-" + id), on = box.classList.toggle("on");
      b.setAttribute("aria-expanded", on ? "true" : "false");
      b.textContent = T(on ? UI.hide : UI.learn);
    } else {
      openHelp(d);
    }
  });

  /* ---- gửi dữ liệu: nếu có CTN_CONFIG.WISH_ENDPOINT thì POST JSON; chưa có thì chỉ hiện lời cảm ơn (bản demo) ---- */
  function send(kind, payload) {
    var cfg = window.CTN_CONFIG || {}, url = (cfg.WISH_ENDPOINT || "").trim();
    payload.kind_of_form = kind;
    payload.submitted_at = new Date().toISOString();
    payload.lang = L();
    if (!url) return Promise.resolve(true);
    return fetch(url, { method: "POST", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify(payload) })
      .then(function (r) { return r.ok || r.type === "opaque"; }).catch(function () { return false; });
  }
  function formData(form) {
    var o = {};
    [].forEach.call(form.elements, function (el) {
      if (!el.name) return;
      if (el.type === "radio" && !el.checked) return;
      if (el.type === "checkbox") { o[el.name] = el.checked; return; }
      o[el.name] = el.value.trim();
    });
    return o;
  }
  var badMail = function (v) { return v && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); };

  /* ---- form "Khu vực tiếp nhận điều ước" ---- */
  var form = $("#duForm"), err = $("#duErr"), thanks = $("#duThanks");
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    err.classList.remove("on");
    var d = formData(form);
    if (!d.name || !d.phone || !d.wish) { err.textContent = T(UI.errReq); err.classList.add("on"); return; }
    if (badMail(d.email)) { err.textContent = T(UI.errMail); err.classList.add("on"); return; }
    var btn = form.querySelector("button[type=submit]"); btn.disabled = true;
    send("dieu-uoc", d).then(function (ok) {
      btn.disabled = false;
      if (!ok) { err.textContent = T(UI.errSend); err.classList.add("on"); return; }
      form.reset(); form.hidden = true; thanks.classList.add("on"); thanks.focus();
    });
  });

  /* ---- hành trình điều ước ---- */
  var jb = $("#duJourneyBtn"), jp = $("#duJourney");
  jb.addEventListener("click", function () {
    var on = jp.classList.toggle("on");
    jb.setAttribute("aria-expanded", on ? "true" : "false");
  });

  /* ---- hộp thoại "Tôi muốn hỗ trợ" ---- */
  var hForm = $("#duHelpForm"), hErr = $("#duHelpErr"), hThanks = $("#duHelpThanks"), hBody = $("#duHelpBody"), hProfile = $("#hProfile");
  var current = null;
  function openHelp(d) {
    current = d;
    hForm.reset(); hBody.hidden = false; hThanks.classList.remove("on"); hErr.classList.remove("on");
    hProfile.value = T(d.title);
    if (dlg.showModal) dlg.showModal(); else dlg.setAttribute("open", "");
  }
  function closeHelp() { if (dlg.close) dlg.close(); else dlg.removeAttribute("open"); }
  $("#duHelpX").addEventListener("click", closeHelp);
  dlg.addEventListener("click", function (e) { if (e.target === dlg) closeHelp(); });
  hForm.addEventListener("submit", function (e) {
    e.preventDefault();
    hErr.classList.remove("on");
    var d = formData(hForm);
    if (!d.name || !d.contact || !d.ok) { hErr.textContent = T(UI.errReq) + (L() === "en" ? " (and tick the confirmation)" : " (và tích xác nhận)"); hErr.classList.add("on"); return; }
    if (d.contact.indexOf("@") > -1 && badMail(d.contact)) { hErr.textContent = T(UI.errMail); hErr.classList.add("on"); return; }
    if (current) { d.profile_id = current.id; d.sample = !!current.sample; }
    var btn = hForm.querySelector("button[type=submit]"); btn.disabled = true;
    send("toi-muon-ho-tro", d).then(function (ok) {
      btn.disabled = false;
      if (!ok) { hErr.textContent = T(UI.errSend); hErr.classList.add("on"); return; }
      hBody.hidden = true; hThanks.classList.add("on"); hThanks.focus();
    });
  });

  /* ---- song ngữ: đặt lại placeholder + vẽ lại danh sách khi đổi ngôn ngữ ---- */
  function placeholders() {
    [].forEach.call(document.querySelectorAll("#dieu-uoc [data-ph-en],#duHelp [data-ph-en]"), function (el) {
      if (!el.hasAttribute("data-ph-vi")) el.setAttribute("data-ph-vi", el.getAttribute("placeholder") || "");
      el.setAttribute("placeholder", L() === "en" ? el.getAttribute("data-ph-en") : el.getAttribute("data-ph-vi"));
    });
  }
  document.addEventListener("langchange", function () { buildRegions(); render(); placeholders(); });
  buildRegions(); render(); placeholders();
  if (L() === "en") { /* trang đã ở EN khi nạp */ }
})();
