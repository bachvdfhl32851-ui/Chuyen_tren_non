(function () {
  "use strict";
  var box = document.getElementById("donghanh");
  if (!box) return;
  var note = document.getElementById("dhNote");
  var L = function () { return document.documentElement.lang === "en" ? "en" : "vi"; };

  var MAIL = {
    story: {
      vi: ["[Chuyện trên non] Gửi câu chuyện", "Họ tên:\nĐiểm trường / bản làng:\nCâu chuyện (hoặc đường dẫn ảnh, video):\n"],
      en: ["[Chuyen tren non] Send a story", "Name:\nSchool point / village:\nStory (or link to photos, video):\n"]
    },
    need: {
      vi: ["[Chuyện trên non] Gửi nhu cầu hỗ trợ", "Tên điểm trường:\nĐịa chỉ (xã, huyện, tỉnh):\nSố học sinh:\nNhu cầu hỗ trợ:\nNgười liên hệ và số điện thoại:\n"],
      en: ["[Chuyen tren non] Send a support need", "School point name:\nAddress (commune, district, province):\nNumber of students:\nSupport needed:\nContact person and phone:\n"]
    },
    join: {
      vi: ["[Chuyện trên non] Đồng hành cùng chúng tôi", "Tên cá nhân / tổ chức:\nHình thức đồng hành mong muốn (sách, học bổng, quỹ, khác):\nThông tin liên hệ:\n"],
      en: ["[Chuyen tren non] Join us", "Individual / organization name:\nWays you would like to help (books, scholarship, funding, other):\nContact information:\n"]
    }
  };
  var MSG = {
    vi: "Chưa có email nhận thư. Hãy điền CONTACT_EMAIL trong file config.js.",
    en: "No contact email yet. Please fill in CONTACT_EMAIL in config.js."
  };

  [].forEach.call(box.querySelectorAll(".dh-actions a[data-kind]"), function (a) {
    a.addEventListener("click", function (e) {
      var cfg = window.CTN_CONFIG || {};
      var to = (cfg.CONTACT_EMAIL || "").trim();
      if (!to) {
        e.preventDefault();
        note.textContent = MSG[L()];
        note.hidden = false;
        return;
      }
      note.hidden = true;
      var m = MAIL[a.getAttribute("data-kind")][L()];
      a.href = "mailto:" + encodeURIComponent(to).replace(/%40/g, "@") +
      "?subject=" + encodeURIComponent(m[0]) + "&body=" + encodeURIComponent(m[1]);
    });
  });

  document.addEventListener("langchange", function () { if (!note.hidden) note.textContent = MSG[L()]; });
})();
