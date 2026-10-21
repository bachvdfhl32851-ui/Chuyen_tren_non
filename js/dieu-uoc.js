(function () {
  "use strict";
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return [].slice.call((c || document).querySelectorAll(s)); };
  var L = function () { return document.documentElement.lang === "en" ? "en" : "vi"; };
  var T = function (o) { return o[L()] || o.vi; };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion:reduce)").matches;
  var replay = function (el, cls) { el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls); };

  var UI = {
    errReq: { vi: "Vui lòng điền đầy đủ các mục có dấu *.", en: "Please fill in all fields marked *." },
    errContact: { vi: "Số điện thoại hoặc email chưa đúng định dạng.", en: "The phone number or email looks invalid." },
    errSend: { vi: "Chưa gửi được. Bạn thử lại sau hoặc liên hệ qua email của Chuyện trên non nhé.", en: "Could not send. Please try again or email Chuyen tren non." },
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
    count: { vi: function (n) { return "Đang hiển thị " + n + " hồ sơ"; }, en: function (n) { return "Showing " + n + " profile" + (n === 1 ? "" : "s"); } }
  };

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
  var badMail = function (v) { return !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); };
  var badContact = function (v) { return v.indexOf("@") > -1 ? badMail(v) : v.replace(/\D/g, "").length < 9; };
  function fail(el, msg) { el.textContent = T(msg); replay(el, "on"); }
  function submitWith(form, err, thanks, kind, check, extra) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      err.classList.remove("on");
      var d = formData(form);
      if (!check(d)) return fail(err, UI.errReq);
      if (badContact(d.contact)) return fail(err, UI.errContact);
      if (extra) extra(d);
      var btn = $("button[type=submit]", form);
      btn.disabled = true;
      send(kind, d).then(function (ok) {
        btn.disabled = false;
        if (!ok) return fail(err, UI.errSend);
        form.reset(); form.hidden = true; thanks.classList.add("on"); thanks.focus();
      });
    });
  }

  var news = $("#ytNews");
  if (news) {
    var chips = $$(".yt-chips button");
    chips.forEach(function (b) {
      b.addEventListener("click", function () {
        var f = b.getAttribute("data-f"), k = 0;
        chips.forEach(function (x) { x.classList.toggle("on", x === b); x.setAttribute("aria-pressed", x === b ? "true" : "false"); });
        $$(".nw-card", news).forEach(function (c) {
          var show = !f || c.getAttribute("data-cat") === f;
          c.hidden = !show;
          if (show && !reduce) { c.style.animationDelay = (k++ * 70) + "ms"; replay(c, "ytIn"); }
        });
      });
    });
  }

  var wishText = $("#wishText");
  if (wishText) {
    var WISHES = [
      { vi: "“Em mong có một chiếc cặp mới để đựng sách vở đi học.”", en: "“I wish I had a new school bag to carry my books to school.”" },
      { vi: "“Chúng em mong lớp có thêm một chiếc bảng để cô viết bài.”", en: "“We wish our class had another board for our teacher to write on.”" },
      { vi: "“Em mong lớp em có thêm nhiều truyện để chúng em cùng đọc vào giờ ra chơi.”", en: "“I wish my class had more storybooks for us to read together at break time.”" },
      { vi: "“Em mong có đủ bút màu để vẽ những bức tranh thật đẹp.”", en: "“I wish I had enough colour pencils to draw really beautiful pictures.”" },
      { vi: "“Em mong trường có một sân chơi để chúng em được chạy nhảy cùng nhau.”", en: "“I wish our school had a playground where we could run and jump together.”" },
      { vi: "“Chúng em mong có thêm bàn ghế để các bạn ngồi học thoải mái hơn.”", en: "“We wish we had more desks and chairs so everyone could sit and study comfortably.”" },
      { vi: "“Em mong được đọc nhiều sách hơn để biết thêm những điều hay và mới lạ.”", en: "“I wish I could read more books to learn more interesting and new things.”" },
      { vi: "“Em mong có một chiếc áo ấm để mặc vào những ngày trời lạnh.”", en: "“I wish I had a warm coat to wear on cold days.”" },
      { vi: "“Em mong lớp có một chiếc quạt để những ngày hè học đỡ nóng.”", en: "“I wish our class had a fan so summer lessons weren't so hot.”" },
      { vi: "“Em mong được học vẽ để vẽ tặng mẹ một bức tranh thật đẹp.”", en: "“I wish I could learn to draw so I can paint a beautiful picture for my mum.”" },
      { vi: "“Em mong có một chiếc đèn sáng hơn để buổi tối đọc sách.”", en: "“I wish I had a brighter lamp to read in the evenings.”" }
    ];
    var wCard = wishText.closest(".du-wish-card"), wNo = $("#wishNo"), cur = Math.floor(Math.random() * WISHES.length);
    var showWish = function (i, anim) {
      cur = (i + WISHES.length) % WISHES.length;
      wNo.textContent = (cur < 9 ? "0" : "") + (cur + 1);
      wishText.textContent = T(WISHES[cur]);
      if (anim && !reduce) replay(wCard, "swap");
    };
    var wBox = wCard.closest(".du-wish"), wBar = $(".du-wish-bar i", wCard), hold = {};
    var restart = function () { replay(wBar, "run"); };
    var pause = function (k, on) {
      if (on) hold[k] = 1; else delete hold[k];
      wBox.classList.toggle("paused", Object.keys(hold).length > 0);
    };
    var manual = function (i) { wCard.setAttribute("aria-live", "polite"); showWish(i, true); restart(); };
    wBar.addEventListener("animationend", function () { wCard.setAttribute("aria-live", "off"); showWish(cur + 1, true); restart(); });
    $("#wishNext").addEventListener("click", function () {
      var n = Math.floor(Math.random() * (WISHES.length - 1));
      manual(n >= cur ? n + 1 : n);
    });
    $("#wishPrev").addEventListener("click", function () { manual(cur - 1); });
    $("#wishFwd").addEventListener("click", function () { manual(cur + 1); });
    wBox.addEventListener("mouseenter", function () { pause("hover", true); });
    wBox.addEventListener("mouseleave", function () { pause("hover", false); });
    wBox.addEventListener("focusin", function (e) { if (e.target.matches(":focus-visible")) pause("focus", true); });
    wBox.addEventListener("focusout", function () { pause("focus", false); });
    if ("IntersectionObserver" in window) new IntersectionObserver(function (es) { pause("view", !es[0].isIntersecting); }, { threshold: .3 }).observe(wBox);
    document.addEventListener("langchange", function () { showWish(cur, false); });
    showWish(cur, false);
    wCard.setAttribute("aria-live", "off");
    restart();
  }

  var duForm = $("#duForm");
  if (duForm) {
    var duThanks = $("#duThanks");
    submitWith(duForm, $("#duErr"), duThanks, "dieu-uoc", function (d) { return d.sender && d.title && d.wish && d.place && d.name && d.contact; });
    $("#duAgain").addEventListener("click", function () { duThanks.classList.remove("on"); duForm.hidden = false; $("input", duForm).focus(); });
  }

  var jb = $("#duJourneyBtn"), jp = $("#duJourney");
  if (jb && jp) jb.addEventListener("click", function () { jb.setAttribute("aria-expanded", jp.classList.toggle("on") ? "true" : "false"); });

  var nsForm = $("#nsForm"), picked = null;
  function clearPick() { picked = null; var p = $("#nsPicked"); if (p) p.hidden = true; }
  function selectProgram(v) {
    if (!nsForm) return;
    var r = $('input[name=program][value="' + v + '"]', nsForm);
    if (nsForm.hidden) { $("#nsThanks").classList.remove("on"); nsForm.hidden = false; }
    if (r) r.checked = true;
    $("#gui-soi-thuong").scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    if (r && !reduce) replay(r.closest(".du-fs"), "hl");
  }
  if (nsForm) {
    var nsThanks = $("#nsThanks");
    submitWith(nsForm, $("#nsErr"), nsThanks, "noi-soi-thuong", function (d) { return d.program && d.kind && d.name && d.contact; }, function (d) {
      if (picked) { d.profile_id = picked.id; d.profile = T(picked.title); d.sample = !!picked.sample; }
    });
    $("#nsAgain").addEventListener("click", function () { nsThanks.classList.remove("on"); nsForm.hidden = false; clearPick(); $("input", nsForm).focus(); });
    $("#nsPickedX").addEventListener("click", clearPick);
  }

  var dlg = $("#nsDlg");
  if (dlg) {
    var curProg = null;
    var fillDlg = function () {
      $("#nsDlgImg").src = $(".ns-prog-img img", curProg).getAttribute("src");
      $("#nsDlgNo").textContent = $(".ns-prog-no", curProg).textContent;
      $("#nsDlgT").textContent = $("h4", curProg).textContent;
      $("#nsDlgBody").innerHTML = $(".ns-detail", curProg).innerHTML;
    };
    var closeDlg = function () { if (dlg.close) dlg.close(); else dlg.removeAttribute("open"); };
    $$(".ns-more").forEach(function (b) {
      b.addEventListener("click", function () {
        curProg = b.closest(".ns-prog");
        fillDlg();
        if (dlg.showModal) dlg.showModal(); else dlg.setAttribute("open", "");
        dlg.scrollTop = 0;
      });
    });
    $("#nsDlgX").addEventListener("click", closeDlg);
    dlg.addEventListener("click", function (e) { if (e.target === dlg) closeDlg(); });
    $("#nsJoin").addEventListener("click", function () { closeDlg(); clearPick(); selectProgram(curProg.getAttribute("data-prog")); });
    document.addEventListener("langchange", function () { if (curProg && dlg.open) fillDlg(); });
  }

  var cardsEl = $("#duCards");
  if (cardsEl) {
    var DATA = [
      {
        id: "mau-01", sample: true, type: "sach", prio: "can", status: "tim",
        title: { vi: "Bổ sung sách cho góc đọc lớp học", en: "Add books to a classroom reading corner" },
        place: { vi: "Tên trường, điểm trường, xã và tỉnh — cập nhật sau khi xác minh.", en: "School, school point, commune and province — updated after verification." },
        need: { vi: "Bổ sung sách truyện, sách khám phá và tài liệu đọc phù hợp với độ tuổi học sinh.", en: "Storybooks, discovery books and reading materials suited to the students' ages." },
        goal: { vi: "Tạo thêm cơ hội đọc sách và duy trì hoạt động đọc thường xuyên tại lớp.", en: "Create more chances to read and keep a regular reading habit in class." },
        items: null
      },
      {
        id: "mau-02", sample: true, type: "dodung", prio: "bosung", status: "tim",
        title: { vi: "Bổ sung đồ dùng học tập cho lớp", en: "Add school supplies for a class" },
        place: { vi: "Tên trường, điểm trường và địa phương — cập nhật sau khi xác minh.", en: "School, school point and area — updated after verification." },
        need: { vi: "Bút, vở, thước và các vật dụng học tập theo danh sách nhà trường xác nhận.", en: "Pens, notebooks, rulers and other supplies from the list the school confirms." },
        goal: { vi: "Bổ sung những vật dụng còn thiếu, phù hợp với nhu cầu thực tế của học sinh.", en: "Fill in what is missing, matching the students' real needs." },
        items: null
      },
      {
        id: "mau-03", sample: true, type: "csvc", prio: "gap", status: "tim",
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
    var TO_PROG = { sach: "tusach", dodung: "sach", csvc: "lophoc", hoctap: "hocbong", thietyeu: "sinhhoat" };
    var countEl = $("#duCount");
    var ICON = {
      sach: '<path d="M2 5.5C4.5 4 8 4 12 6c4-2 7.5-2 10-.5V19c-2.5-1.5-6-1.5-10 .5-4-2-7.5-2-10-.5z"/><path d="M12 6v13.5"/>',
      dodung: '<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="M13.5 6.5l4 4"/>',
      csvc: '<path d="M3 21h18"/><path d="M5 21V10l7-5 7 5v11"/><path d="M10 21v-5h4v5"/>',
      hoctap: '<path d="M2 9l10-5 10 5-10 5z"/><path d="M6 11v5c3 2.5 9 2.5 12 0v-5"/>',
      thietyeu: '<path d="M12 20s-7-4.4-9.3-9A5.3 5.3 0 0 1 12 5.4 5.3 5.3 0 0 1 21.3 11C19 15.6 12 20 12 20z"/>',
      place: '<path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
      need: '<path d="M3 8h18v4H3z"/><path d="M5 12v9h14v-9"/><path d="M12 8v13"/>',
      goal: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5"/>'
    };
    var icon = function (k) { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + ICON[k] + "</svg>"; };
    var STEPS = ["tim", "ketnoi", "thongnhat", "xong"];
    var card = function (d) {
      var step = STEPS.indexOf(d.status);
      var items = d.items ? "<ul>" + d.items.map(function (i) { return '<li><span class="p-' + i.p + '"><b>●</b></span> ' + esc(T(i)) + " <small>(" + esc(T(LBL.prio[i.p])) + ")</small></li>"; }).join("") + "</ul>" : "<p style='margin:0'>" + esc(T(UI.detail)) + "</p>";
      var info = [["place", UI.place, d.place], ["need", UI.need, d.need], ["goal", UI.goal, d.goal]].map(function (r) {
        return "<li>" + icon(r[0]) + "<div><b>" + esc(T(r[1])) + "</b><span>" + esc(T(r[2])) + "</span></div></li>";
      }).join("");
      return '<article class="du-card pr-' + d.prio + '" data-id="' + d.id + '">' +
        '<div class="du-card-top"><span class="du-type">' + icon(d.type) + esc(T(LBL.type[d.type])) + "</span>" +
        '<span class="du-tag p-' + d.prio + '"><i></i>' + esc(T(LBL.prio[d.prio])) + "</span></div>" +
        "<h4>" + esc(T(d.title)) + "</h4>" +
        (d.sample ? '<p class="du-sample">' + esc(T(UI.sample)) + "</p>" : "") +
        '<ul class="du-info">' + info + "</ul>" +
        '<button class="du-toggle" type="button" data-act="more" aria-expanded="false" aria-controls="more-' + d.id + '"><span>' + esc(T(UI.learn)) + '</span><b aria-hidden="true">▾</b></button>' +
        '<div class="du-more" id="more-' + d.id + '"><b>' + esc(T(UI.detailHead)) + "</b>" + items + (d.sample ? "<p style='margin:.6em 0 0;opacity:.75'>" + esc(T(UI.note)) + "</p>" : "") + "</div>" +
        '<div class="du-track"><p><b>' + esc(T(UI.state)) + '</b><span class="s-' + d.status + '">' + esc(T(LBL.status[d.status])) + " · " + (step + 1) + "/" + STEPS.length + "</span></p>" +
        '<ol aria-hidden="true">' + STEPS.map(function (s, i) { return "<li" + (i <= step ? ' class="on"' : "") + "></li>"; }).join("") + "</ol></div>" +
        '<button class="du-btn du-help" type="button" data-act="help">' + esc(T(UI.help)) + ' <b aria-hidden="true">→</b></button></article>';
    };
    var render = function () {
      countEl.textContent = T(UI.count)(DATA.length);
      cardsEl.innerHTML = DATA.map(card).join("");
    };
    cardsEl.addEventListener("click", function (e) {
      var b = e.target.closest("button[data-act]");
      if (!b) return;
      var id = b.closest(".du-card").getAttribute("data-id");
      var d = DATA.filter(function (x) { return x.id === id; })[0];
      if (b.getAttribute("data-act") === "more") {
        var on = $("#more-" + id).classList.toggle("on");
        b.setAttribute("aria-expanded", on ? "true" : "false");
        $("span", b).textContent = T(on ? UI.hide : UI.learn);
        return;
      }
      picked = d;
      $("#nsPickedT").textContent = T(d.title);
      $("#nsPicked").hidden = false;
      selectProgram(TO_PROG[d.type] || "khac");
    });
    document.addEventListener("langchange", function () {
      render();
      if (picked) $("#nsPickedT").textContent = T(picked.title);
    });
    render();
  }

  function placeholders() {
    $$("main [data-ph-en]").forEach(function (el) {
      if (!el.hasAttribute("data-ph-vi")) el.setAttribute("data-ph-vi", el.getAttribute("placeholder") || "");
      el.setAttribute("placeholder", L() === "en" ? el.getAttribute("data-ph-en") : el.getAttribute("data-ph-vi"));
    });
  }
  document.addEventListener("langchange", placeholders);
  placeholders();
})();
