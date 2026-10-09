/* sreach + log in gg */
(function () {
  "use strict";
  /* ====== Cau hinh ====== */
  var GOOGLE_CLIENT_ID = (window.CTN_CONFIG && window.CTN_CONFIG.GOOGLE_CLIENT_ID) || "";   // cleint id gg trong config.js
  /* =============================================================== */
  var $ = function (s) { return document.querySelector(s); };
  var L = function () { return document.documentElement.lang === "en" ? "en" : "vi"; };
  var norm = function (s) { return s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").toLowerCase(); };
  var esc = function (s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };
  var P = { home: { vi: "Trang chủ", en: "Home" }, xuan: { vi: "Mùa xuân", en: "Spring" }, ha: { vi: "Mùa hạ", en: "Summer" }, thu: { vi: "Mùa thu", en: "Autumn" }, dong: { vi: "Mùa đông", en: "Winter" }, thuong: { vi: "Mùa yêu thương", en: "Love" } };
  var F = { home: "index.html", xuan: "xuan.html", ha: "ha.html", thu: "thu.html", dong: "dong.html", thuong: "thuong.html" };
  var RAW = [
    ["home", "Chuyện trên non", "Chuyen tren non", "tuổi thơ trẻ em vùng cao childhood highland children"],
    ["home", "Liên hệ / Đồng hành", "Contact / Join hands", "gửi nhu cầu điểm trường sách học bổng doanh nghiệp tổ chức nhà xuất bản email send needs scholarship donate partner volunteer", "#donghanh"],
    ["xuan", "Mùa xuân: mùa em lớn", "Spring: season of growing up", "gia đình văn hoá phong tục family culture customs"],
    ["xuan", "Xuân nhà em", "Spring at my home", "tết bữa cơm năm mới gia đình new year meal"],
    ["xuan", "Xuân bản em", "Spring in my village", "lễ hội trang phục âm nhạc chợ phiên festival costume music market"],
    ["xuan", "Xuân của trẻ", "Spring of children", "trẻ chơi gì mong gì thích gì play wish"],
    ["xuan", "Mùa xuân trên bản nhỏ", "Spring in the little village", "mỗi món một câu chuyện bánh chưng gù food dish"],
    ["ha", "Mùa hạ: mùa vui chơi", "Summer: season of play", "vui chơi tuổi thơ trò chơi games"],
    ["ha", "Chơi cùng em", "Play with me", "đồ vật trò chơi hòn đá lá cây con quay sợi dây con suối stone leaf top rope stream"],
    ["ha", "Chơi cùng núi rừng", "Play with the mountains", "núi rừng suối forest"],
    ["thu", "Mùa thu: mùa đến lớp", "Autumn: season of school", "đến trường đi học nội trú con chữ school boarding"],
    ["thu", "Cặp em có gì", "What's in my bag", "sách vở đồ dùng books notebooks"],
    ["thu", "Đường em đi", "The road I walk", "hành trình đến trường cầu journey bridge"],
    ["thu", "Lớp học của em", "My classroom", "thầy cô bạn bè giờ ra chơi teacher friends recess"],
    ["thu", "Chuyện từ trang sách", "Stories from the pages", "văn hoá đọc sách thư viện reading library"],
    ["thu", "Đi cùng em đến lớp", "Walk to school with me", "dấu chân nhà đường cầu trường lớp sân chơi footprints"],
    ["dong", "Mùa đông: mùa kể chuyện", "Winter: season of storytelling", "bếp lửa bà mẹ tiếng hát làng nghề fire grandma mother songs"],
    ["dong", "Ngồi bên bếp lửa", "Sitting by the fire", "bà mẹ ông tiếng củi cháy câu chuyện stories grandma mom grandpa"],
    ["dong", "Chuyện bên bếp", "Fireside tales", "gia đình món ăn sinh hoạt family food"],
    ["dong", "Chuyện người lớn kể", "Stories elders tell", "ký ức truyền thống dân gian memory tradition folk"],
    ["thuong", "Mùa yêu thương", "The season of love", "hành động đồng hành action support"],
    ["thuong", "Em đang cần", "What they need", "nhu cầu thực tế needs"],
    ["thuong", "Gieo một mầm xanh", "Plant a green seed", "tủ sách tri thức hành trình đọc bookshelf reading"],
    ["thuong", "Trao cơ hội", "Give a chance", "học bổng quỹ scholarship fund"],
    ["thuong", "Nối một sợi thương", "Tie a thread of care", "kết nối cá nhân doanh nghiệp điểm trường donate connect business"]
  ];
  var IDX = RAW.map(function (r) { return { u: F[r[0]] + (r[4] || ""), t: { vi: r[1], en: r[2] }, p: P[r[0]], n: norm(r[1] + " " + r[2] + " " + P[r[0]].vi + " " + P[r[0]].en + " " + r[3]) }; });
  var T = {
    ph: { vi: "Tìm kiếm…", en: "Search…" }, none: { vi: "Không tìm thấy kết quả.", en: "No results found." },
    title: { vi: "Đăng nhập", en: "Log in" }, reg: { vi: "Đăng ký", en: "Sign up" },
    sub: { vi: "Tiếp tục hành trình cùng các em vùng cao", en: "Continue the journey with highland children" },
    subr: { vi: "Tạo tài khoản để đồng hành cùng các em", en: "Create an account to walk with the children" },
    g: { vi: "Đăng nhập bằng Google", en: "Continue with Google" },
    or: { vi: "Hoặc dùng email", en: "Or use email" },
    lbName: { vi: "Tên hiển thị", en: "Display name" }, lbEmail: { vi: "Email", en: "Email" }, lbPw: { vi: "Mật khẩu", en: "Password" },
    go: { vi: "Đăng nhập", en: "Log in" }, goReg: { vi: "Đăng ký", en: "Sign up" },
    sw1: { vi: "Chưa có tài khoản?", en: "No account yet?" }, sw1a: { vi: "Đăng ký ngay", en: "Sign up now" },
    sw2: { vi: "Đã có tài khoản?", en: "Already have an account?" }, sw2a: { vi: "Đăng nhập", en: "Log in" },
    nocfg: { vi: "Chưa cấu hình đăng nhập này. Hãy điền ID trong file account.js.", en: "This login isn't configured yet. Fill in the ID in account.js." },
    nofile: { vi: "Hãy mở trang bằng Live Server (http://localhost:5500), không mở file trực tiếp.", en: "Open the page with Live Server (http://localhost:5500), not as a local file." },
    fail: { vi: "Đăng nhập không thành công, vui lòng thử lại.", en: "Login failed, please try again." },
    bademail: { vi: "Email chưa hợp lệ.", en: "Invalid email." }, pwlen: { vi: "Mật khẩu cần ít nhất 6 ký tự.", en: "Password needs at least 6 characters." },
    exists: { vi: "Email này đã được đăng ký.", en: "This email is already registered." }, wrong: { vi: "Sai email hoặc mật khẩu.", en: "Wrong email or password." },
    out: { vi: "Đăng xuất", en: "Log out" }, hi: { vi: "Xin chào", en: "Hello" }
  };

  /* ---------------- sreach button ---------------- */
  var box = $(".srch"), q = $("#q"), res = $("#res"), cur = [], sel = -1;
  function setPh() { q.placeholder = T.ph[L()]; q.setAttribute("aria-label", T.ph[L()]); }
  function show(open) { res.hidden = !open; q.setAttribute("aria-expanded", open ? "true" : "false"); }
  function openS() { box.classList.add("open"); setTimeout(function () { q.focus(); }, 200); }
  function closeS() { box.classList.remove("open"); q.value = ""; show(false); q.blur(); }
  function render() {
    var v = norm(q.value.trim()); sel = -1;
    if (!v) { show(false); return; }
    var toks = v.split(/\s+/);
    cur = IDX.filter(function (it) { return toks.every(function (t) { return it.n.indexOf(t) > -1; }); }).slice(0, 7);
    res.innerHTML = cur.length ? cur.map(function (it) { return '<a href="' + it.u + '" role="option"><b>' + esc(it.t[L()]) + "</b><small>" + esc(it.p[L()]) + "</small></a>"; }).join("") : '<div class="none">' + T.none[L()] + "</div>";
    show(true);
  }
  function mark() { [].forEach.call(res.querySelectorAll("a"), function (a, i) { a.classList.toggle("act", i === sel); }); }
  $("#sbtn").addEventListener("click", function () {
    if (!box.classList.contains("open")) return openS();
    if (q.value.trim() && cur.length) location.href = cur[sel > -1 ? sel : 0].u; else closeS();
  });
  q.addEventListener("focus", function () { box.classList.add("open"); render(); });
  q.addEventListener("input", render);
  q.addEventListener("keydown", function (e) {
    if (e.key === "ArrowDown") { e.preventDefault(); sel = Math.min(sel + 1, cur.length - 1); mark(); }
    else if (e.key === "ArrowUp") { e.preventDefault(); sel = Math.max(sel - 1, 0); mark(); }
    else if (e.key === "Enter" && cur.length) { location.href = cur[sel > -1 ? sel : 0].u; }
    else if (e.key === "Escape") { closeS(); }
  });
  document.addEventListener("click", function (e) { if (!e.target.closest(".srch")) { show(false); if (!q.value.trim()) box.classList.remove("open"); } });
  document.addEventListener("keydown", function (e) {
    if (e.key === "/" && !/INPUT|TEXTAREA/.test(document.activeElement.tagName)) { e.preventDefault(); openS(); }
  });

  /* ---------------- Ho so nguoi dung ---------------- */
  var KEY = "ctn-user", AK = "ctn-accounts", user = null;
  try { user = JSON.parse(localStorage.getItem(KEY) || "null"); } catch (e) {}
  function setUser(u) { user = u; try { u ? localStorage.setItem(KEY, JSON.stringify(u)) : localStorage.removeItem(KEY); } catch (e) {} paint(); closeModal(); }
  var um;
  function paint() {
    var lg = $("#login"), av = $("#av");
    lg.hidden = !!user; av.hidden = !user;
    if (um) { um.remove(); um = null; }
    if (user) {
      av.innerHTML = user.picture ? '<img src="' + esc(user.picture) + '" alt="" referrerpolicy="no-referrer">' : esc((user.name || "?").charAt(0).toUpperCase());
      av.title = user.name || "";
    }
  }
  $("#av").onclick = function (e) {
    e.stopPropagation();
    if (um) { um.remove(); um = null; return; }
    um = document.createElement("div"); um.className = "um";
    um.innerHTML = "<b>" + T.hi[L()] + ", " + esc(user.name || "") + '!</b><button class="ic" style="padding:0 16px" id="lo">' + T.out[L()] + "</button>";
    $(".hr").appendChild(um);
    $("#lo").onclick = function () {
      try { if (user.provider === "google" && window.google) google.accounts.id.disableAutoSelect(); } catch (x) {}
      setUser(null);
    };
  };
  document.addEventListener("click", function (e) { if (um && !e.target.closest(".um,.av")) { um.remove(); um = null; } });

  /* ---------------- gg account ---------------- */
  function accts() { try { return JSON.parse(localStorage.getItem(AK) || "{}"); } catch (e) { return {}; } }
  function hex(buf) { return Array.prototype.map.call(new Uint8Array(buf), function (b) { return ("0" + b.toString(16)).slice(-2); }).join(""); }
  async function hashPw(pw, salt) {
    var enc = new TextEncoder(), k = await crypto.subtle.importKey("raw", enc.encode(pw), "PBKDF2", false, ["deriveBits"]);
    return hex(await crypto.subtle.deriveBits({ name: "PBKDF2", salt: enc.encode(salt), iterations: 100000, hash: "SHA-256" }, k, 256));
  }
  async function submit(ev) {
    ev.preventDefault();
    var em = $("#em").value.trim().toLowerCase(), pw = $("#pw").value, nm = mode === "reg" ? $("#nm").value.trim() : "";
    if (!/^\S+@\S+\.\S+$/.test(em)) return msg("bademail");
    if (pw.length < 6) return msg("pwlen");
    if (!(window.crypto && crypto.subtle)) return msg("fail");
    var A = accts();
    try {
      if (mode === "reg") {
        if (A[em]) return msg("exists");
        var salt = hex(crypto.getRandomValues(new Uint8Array(16)));
        A[em] = { name: nm || em.split("@")[0], salt: salt, hash: await hashPw(pw, salt) };
        localStorage.setItem(AK, JSON.stringify(A));
        setUser({ name: A[em].name, email: em, provider: "email" });
      } else {
        var a = A[em];
        if (!a || (await hashPw(pw, a.salt)) !== a.hash) return msg("wrong");
        setUser({ name: a.name, email: em, provider: "email" });
      }
    } catch (x) { msg("fail"); }
  }

  /* ---------------- khung log in ---------------- */
  function loadScript(src) {
    return new Promise(function (ok, no) {
      if (document.querySelector('script[src="' + src + '"]')) return ok();
      var s = document.createElement("script"); s.src = src; s.async = true; s.onload = ok; s.onerror = no; document.head.appendChild(s);
    });
  }
  var modal, mode = "login";
  var IC = {
    mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="M3.5 7l8.5 6 8.5-6"/></svg>',
    lock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><rect x="5" y="11" width="14" height="9" rx="2.5"/><path d="M8 11V8a4 4 0 018 0v3"/></svg>',
    user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="8" r="4"/><path d="M4 21c1-4 4-6 8-6s7 2 8 6"/></svg>',
    g: '<svg width="22" height="22" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.9 2.4 30.4 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.9 6.1C12.4 13.6 17.7 9.5 24 9.5z"/><path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8c4.4-4.1 7.1-10.1 7.1-17.5z"/><path fill="#FBBC05" d="M10.5 28.7c-.5-1.4-.8-3-.8-4.7s.3-3.200.8-4.700l-7.900-6.100C.9 16.400 0 20.100 0 24s.9 7.600 2.600 10.800l7.900-6.100z"/><path fill="#34A853" d="M24 48c6.500 0 11.900-2.100 15.900-5.800l-7.500-5.800c-2.100 1.400-4.800 2.300-8.400 2.300-6.300 0-11.600-4.100-13.500-9.800l-7.900 6.100C6.500 42.600 14.600 48 24 48z"/></svg>'
  };
  function msg(k) { var m = $("#mmsg"); if (m) m.textContent = k ? T[k][L()] : ""; }
  function build() {
    var r = mode === "reg", keep = {};
    if (modal) ["nm", "em", "pw"].forEach(function (i) { var e = $("#" + i); if (e) keep[i] = e.value; });
    modal.innerHTML = '<div class="mbox" role="dialog" aria-modal="true" aria-labelledby="mt"><button class="mx" aria-label="Close">×</button>' +
      '<div class="mlogo"><svg viewBox="0 0 48 48" width="34" height="34" fill="none" stroke="#eeb963" stroke-width="2.6" stroke-linejoin="round" stroke-linecap="round"><path d="M4 38l13-22 8 12 6-8 13 18z"/></svg></div><h3 id="mt">' + (r ? T.reg[L()] : T.title[L()]) + "</h3><p>" + (r ? T.subr[L()] : T.sub[L()]) + "</p>" +
      '<div id="gbtn"></div><button class="sb" id="gfake" type="button">' + IC.g + "<span>" + T.g[L()] + '</span></button>' +
      '<div class="dv">' + T.or[L()] + "</div>" +
      '<form class="mf" id="mform" novalidate>' +
      (r ? '<label for="nm">' + T.lbName[L()] + '</label><div class="fi">' + IC.user + '<input id="nm" autocomplete="name"></div>' : "") +
      '<label for="em">' + T.lbEmail[L()] + '</label><div class="fi">' + IC.mail + '<input id="em" type="email" autocomplete="email"></div>' +
      '<label for="pw">' + T.lbPw[L()] + '</label><div class="fi">' + IC.lock + '<input id="pw" type="password" autocomplete="' + (r ? "new-password" : "current-password") + '"></div>' +
      '<button class="go" type="submit">' + (r ? T.goReg[L()] : T.go[L()]) + " →</button></form>" +
      '<div class="mmsg" id="mmsg" role="alert"></div>' +
      '<div class="sw">' + (r ? T.sw2[L()] + ' <a id="swt">' + T.sw2a[L()] : T.sw1[L()] + ' <a id="swt">' + T.sw1a[L()]) + "</a></div></div>";
    for (var k in keep) $("#" + k) && ($("#" + k).value = keep[k]);
    $("#mform").onsubmit = submit;
    $("#swt").onclick = function () { mode = mode === "reg" ? "login" : "reg"; build(); };
    $("#gfake").onclick = function () { if (!GOOGLE_CLIENT_ID) msg("nocfg"); };
    if (GOOGLE_CLIENT_ID) googleBtn();
  }
  function googleBtn() {
    if (location.protocol === "file:") return msg("nofile");
    loadScript("https://accounts.google.com/gsi/client").then(function () {
      google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: function (r) {
          try {
            var b = r.credential.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
            var p = JSON.parse(decodeURIComponent(escape(atob(b))));
            setUser({ name: p.name, email: p.email, picture: p.picture, provider: "google" });
          } catch (x) { msg("fail"); }
        }
      });
      var f = $("#gfake"), g = $("#gbtn"); if (!f || !g) return;
      f.hidden = true;
      google.accounts.id.renderButton(g, { theme: "filled_black", size: "large", shape: "rectangular", text: "signin_with", width: 340 });
      setTimeout(function () { var gg = $("#gbtn"); if (gg && !gg.children.length) { f.hidden = false; msg("fail"); } }, 4000);
    }).catch(function () { msg("fail"); });
  }
  function closeModal() { if (modal) { modal.remove(); modal = null; } }
  function openModal() {
    if (modal) return;
    modal = document.createElement("div"); modal.className = "mod";
    document.body.appendChild(modal); build();
    modal.addEventListener("mousedown", function (e) { if (e.target === modal || e.target.closest(".mx")) closeModal(); });
  }
  $("#login").onclick = openModal;
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeModal(); });
  document.addEventListener("langchange", function () { setPh(); if (modal) build(); if (res && !res.hidden) render(); });
  setPh(); paint();
})();
