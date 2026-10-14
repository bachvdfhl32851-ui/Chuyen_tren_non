(function () {
    "use strict";

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isFinePointer = window.matchMedia("(pointer: fine)").matches;
    const isTouch = window.matchMedia("(pointer: coarse)").matches;

    const onReady = (fn) => {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", fn);
        } else {
            fn();
        }
    };


    /* =================================================================
       1. CUSTOM CURSOR
    ================================================================= */

    function initCustomCursor() {

        if (!isFinePointer || isTouch || prefersReducedMotion) return;

        const root = document.documentElement;

        const dot = document.createElement("div");
        dot.className = "fx-cursor-dot";

        const ring = document.createElement("div");
        ring.className = "fx-cursor-ring";

        root.appendChild(dot);
        root.appendChild(ring);
        root.classList.add("fx-has-cursor");

        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;
        let ringX = mouseX;
        let ringY = mouseY;
        let moved = false;      // đã có lần di chuột đầu tiên chưa
        let lastCheck = 0;

        const hoverSelector = 'a, button, input, label, select, textarea, .card, .toy, [role="button"], [role="option"]';

        function updateState() {
            if (!moved) return;
            const el = document.elementFromPoint(mouseX, mouseY);
            const hover = !!(el && el.closest && el.closest(hoverSelector));
            const inFrame = !!(el && el.tagName === "IFRAME");   // nút Google nằm trong iframe
            root.classList.toggle("fx-cursor-hover", hover);
            root.classList.toggle("fx-iframe", inFrame);
        }

        window.addEventListener("mousemove", (e) => {
            moved = true;
            mouseX = e.clientX;
            mouseY = e.clientY;
            dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
            // luôn hiện lại khi chuột còn di chuyển (phòng khi mouseenter không bắn)
            root.classList.remove("fx-cursor-hidden");
            updateState();
        }, { passive: true });

        document.addEventListener("mouseleave", () => {
            root.classList.add("fx-cursor-hidden");
        });

        document.addEventListener("mouseenter", () => {
            root.classList.remove("fx-cursor-hidden");
        });

        // quay lại tab / cửa sổ (ví dụ sau khi đóng cửa sổ đăng nhập Google)
        function resync() {
            root.classList.remove("fx-cursor-hidden");
            updateState();
        }
        window.addEventListener("focus", resync);
        document.addEventListener("visibilitychange", () => {
            if (!document.hidden) resync();
        });

        function tickRing(now) {

            ringX += (mouseX - ringX) * 0.18;
            ringY += (mouseY - ringY) * 0.18;

            ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;

            // kiểm tra định kỳ để bắt các thay đổi DOM khi chuột đứng yên
            if (now - lastCheck > 120) {
                lastCheck = now;
                updateState();
            }

            requestAnimationFrame(tickRing);
        }

        requestAnimationFrame(tickRing);

        // Cuộn bằng nút giữa (autoscroll): trình duyệt không gửi mousemove nên
        // tạm hiện con trỏ thật, bấm lần nữa để quay lại con trỏ giả.
        window.addEventListener("mousedown", (e) => {
            if (e.button === 1) root.classList.add("fx-native");
            else root.classList.remove("fx-native");
        });

    }



    /* =================================================================
       2. tro chuot gia
    ================================================================= */

    function initTiltAndGlow() {

        const glowSelector =
            ".card";

        document.querySelectorAll(glowSelector).forEach((el) => {
            el.classList.add("fx-glow");
        });

        if (!isFinePointer || isTouch || prefersReducedMotion) return;

        const tiltSelector = ".card";

        document.querySelectorAll(tiltSelector).forEach((card) => {

            card.classList.add("fx-tilt");

            const lift = card.classList.contains("architecture-card") || card.classList.contains("library-card")
                ? -10 : -8;

            card.addEventListener("mousemove", (e) => {

                const rect = card.getBoundingClientRect();
                const px = (e.clientX - rect.left) / rect.width;
                const py = (e.clientY - rect.top) / rect.height;

                const rotateY = (px - 0.5) * 10;
                const rotateX = (0.5 - py) * 10;

                card.style.transform =
                    `perspective(900px) translateY(${lift}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.015)`;

                card.style.setProperty("--fx-mx", (px * 100).toFixed(1) + "%");
                card.style.setProperty("--fx-my", (py * 100).toFixed(1) + "%");
            });

            card.addEventListener("mouseleave", () => {
                card.style.transform = "";
            });

        });

        // glow-only cards (khong tilt, van theo doi con tro)
        document.querySelectorAll(".fmt").forEach((card) => {

            card.addEventListener("mousemove", (e) => {
                const rect = card.getBoundingClientRect();
                const px = ((e.clientX - rect.left) / rect.width) * 100;
                const py = ((e.clientY - rect.top) / rect.height) * 100;

                card.style.setProperty("--fx-mx", px.toFixed(1) + "%");
                card.style.setProperty("--fx-my", py.toFixed(1) + "%");
            });

        });

    }


    /* =================================================================
       3. MAGNETIC BUTTONS
    ================================================================= */

    function initMagnetic() {

        if (!isFinePointer || isTouch || prefersReducedMotion) return;

        const selector = ".btn, .ic";

        document.querySelectorAll(selector).forEach((btn) => {

            btn.classList.add("fx-magnetic");

            btn.addEventListener("mousemove", (e) => {
                const rect = btn.getBoundingClientRect();
                const relX = e.clientX - rect.left - rect.width / 2;
                const relY = e.clientY - rect.top - rect.height / 2;

                btn.style.transform = `translate(${relX * 0.25}px, ${relY * 0.35}px)`;
            });

            btn.addEventListener("mouseleave", () => {
                btn.style.transform = "";
            });

        });

    }


    /* =================================================================
       4. RIPPLE
    ================================================================= */

    function initRipple() {

        const selector = ".btn, .ic, .toy, .top-btn";

        document.addEventListener("click", (e) => {

            const target = e.target.closest(selector);
            if (!target) return;

            target.classList.add("fx-ripple-host");

            const rect = target.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);

            const ripple = document.createElement("span");
            ripple.className = "fx-ripple";
            ripple.style.width = ripple.style.height = size + "px";
            ripple.style.left = (e.clientX - rect.left - size / 2) + "px";
            ripple.style.top = (e.clientY - rect.top - size / 2) + "px";

            target.appendChild(ripple);

            window.setTimeout(() => ripple.remove(), 650);

        });

    }




    /* =================================================================
       6. PARALLAX (hero) + KINETIC SCROLL cho tieu de
    ================================================================= */

    function initParallax() {

        if (prefersReducedMotion) return;

        const hero = document.querySelector(".hero");
        const heroTitle = document.querySelector(".hero h1");

        if (!hero && !heroTitle) return;

        let ticking = false;

        function update() {

            const y = window.scrollY;

            if (hero) {
                const h1 = document.getElementById("h1"), h2 = document.getElementById("h2");
                if (h1) h1.style.transform = `translateY(${y * 0.12}px)`;
                if (h2) h2.style.transform = `translateY(${y * 0.06}px)`;
            }

            if (heroTitle) {
                const progress = Math.min(y / (window.innerHeight || 800), 1);
                heroTitle.style.transform = `translateY(${progress * 40}px)`;
                heroTitle.style.opacity = String(1 - progress * 0.6);
            }

            ticking = false;
        }

        window.addEventListener("scroll", () => {
            if (!ticking) {
                requestAnimationFrame(update);
                ticking = true;
            }
        }, { passive: true });

        update();

    }


    /* =================================================================
       7. KINETIC TYPOGRAPHY
    ================================================================= */

    function splitIntoWords(el) {

        if (el.dataset.fxSplit) return;
        if (el.children.length > 0) return; // co the chua <br>, <span> khac -> bo qua
        if (el.hasAttribute("data-en")) return; // phan tu do en-vn.js quan ly -> bo qua de tranh xung dot khi doi ngon ngu

        const words = el.textContent.trim().split(/\s+/);

        el.textContent = "";

        words.forEach((word, i) => {
            const span = document.createElement("span");
            span.className = "kinetic-word";
            span.style.setProperty("--fx-delay", (i * 55) + "ms");
            span.textContent = word;

            el.appendChild(span);
            el.appendChild(document.createTextNode(" "));
        });

        el.dataset.fxSplit = "true";

    }

    function initKineticHeadings() {

        const targets = document.querySelectorAll("section h2");

        targets.forEach((el) => splitIntoWords(el));

        if (prefersReducedMotion) {
            document.querySelectorAll(".kinetic-word").forEach((w) => w.classList.add("fx-in"));
            return;
        }

        const io = new IntersectionObserver((entries) => {

            entries.forEach((entry) => {

                if (!entry.isIntersecting) return;

                const words = entry.target.querySelectorAll(".kinetic-word");

                if (words.length) {
                    words.forEach((w) => w.classList.add("fx-in"));
                } else {
                    entry.target.classList.add("fx-reveal", "fx-in");
                }

                io.unobserve(entry.target);

            });

        }, { threshold: 0.4 });

        targets.forEach((el) => io.observe(el));

    }


    /* =================================================================
       8. SCROLL REVEAL
    ================================================================= */

    function initScrollReveal() {

        const selector = [".sea", ".in > p", ".out", ".fire"].join(", ");

        const items = document.querySelectorAll(selector);
        if (!items.length) return;

        items.forEach((el, i) => {
            el.classList.add("fx-reveal");
            el.style.setProperty("--fx-delay", Math.min(i % 6, 5) * 70 + "ms");
        });

        if (prefersReducedMotion) {
            items.forEach((el) => el.classList.add("fx-in"));
            return;
        }

        const io = new IntersectionObserver((entries) => {

            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("fx-in");
                    io.unobserve(entry.target);
                }
            });

        }, { threshold: 0.12 });

        items.forEach((el) => io.observe(el));

    }


    /* =================================================================
       9. GLASS PANELS
    ================================================================= */

    function initGlass() {

        document.querySelectorAll(".out").forEach((el) => el.classList.add("fx-glass"));

    }

    onReady(() => {
        initCustomCursor();
        initTiltAndGlow();
        initMagnetic();
        initRipple();
        initParallax();
        initKineticHeadings();
        initScrollReveal();
        initGlass();
    });

})();
