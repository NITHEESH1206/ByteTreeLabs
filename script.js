/* ====================================================
   ByteTree Labs — Interactions
   ==================================================== */

(() => {
  "use strict";

  /* ----------- Custom cursor ----------- */
  const cursor = document.getElementById("cursor");
  const cursorDot = document.getElementById("cursorDot");
  const isTouch = window.matchMedia("(pointer: coarse)").matches;

  if (cursor && cursorDot && !isTouch) {
    let mx = 0, my = 0, cx = 0, cy = 0, dx = 0, dy = 0;

    window.addEventListener("mousemove", (e) => {
      mx = e.clientX;
      my = e.clientY;
      cursor.classList.add("visible");
      cursorDot.classList.add("visible");
    });
    document.addEventListener("mouseleave", () => {
      cursor.classList.remove("visible");
      cursorDot.classList.remove("visible");
    });

    const loop = () => {
      cx += (mx - cx) * 0.18;
      cy += (my - cy) * 0.18;
      dx += (mx - dx) * 0.5;
      dy += (my - dy) * 0.5;
      cursor.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`;
      cursorDot.style.transform = `translate(${dx}px, ${dy}px) translate(-50%, -50%)`;
      requestAnimationFrame(loop);
    };
    loop();

    document.querySelectorAll('[data-cursor="link"], a, button, .product-card, .app-tile, input, textarea').forEach((el) => {
      el.addEventListener("mouseenter", () => cursor.classList.add("link"));
      el.addEventListener("mouseleave", () => cursor.classList.remove("link"));
    });
  }

  /* ----------- Navbar + scroll progress + back to top ----------- */
  const navbar = document.getElementById("navbar");
  const scrollProgress = document.getElementById("scrollProgress");
  const toTop = document.getElementById("toTop");

  const onScroll = () => {
    const y = window.scrollY;
    if (navbar) navbar.classList.toggle("scrolled", y > 30);
    if (toTop) toTop.classList.toggle("visible", y > 400);
    if (scrollProgress) {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      scrollProgress.style.width = `${Math.min(100, (y / h) * 100)}%`;
    }
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if (toTop) {
    toTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ----------- Mobile menu ----------- */
  const navToggle = document.getElementById("navToggle");
  const mobileMenu = document.getElementById("mobileMenu");
  if (navToggle && mobileMenu) {
    navToggle.addEventListener("click", () => {
      navToggle.classList.toggle("active");
      mobileMenu.classList.toggle("open");
      document.body.style.overflow = mobileMenu.classList.contains("open") ? "hidden" : "";
    });
    mobileMenu.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => {
        navToggle.classList.remove("active");
        mobileMenu.classList.remove("open");
        document.body.style.overflow = "";
      });
    });
  }

  /* ----------- Reveal on scroll ----------- */
  const stagger = (root, selector, base = 0.08) => {
    document.querySelectorAll(root).forEach((parent) => {
      parent.querySelectorAll(selector).forEach((el, i) => {
        el.style.setProperty("--d", `${i * base}s`);
      });
    });
  };
  stagger(".hero-inner", ".reveal-up", 0.1);
  stagger(".features", ".feature-card", 0.1);
  stagger(".feature-pair", ".feature-card", 0.1);
  stagger(".numbers-grid", ".number-card", 0.12);
  stagger(".engagement-grid", ".product-card", 0.1);
  stagger(".testimonials-right", ".quote-card", 0.12);
  stagger(".app-strip", ".app-tile", 0.05);

  const revealEls = document.querySelectorAll(".reveal, .reveal-up");
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
  );
  revealEls.forEach((el) => io.observe(el));

  /* ----------- Counter animation ----------- */
  const counters = document.querySelectorAll(".counter");
  const counterIO = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseInt(el.dataset.target, 10);
        const duration = 1800;
        const start = performance.now();
        const easeOut = (t) => 1 - Math.pow(1 - t, 3);
        const tick = (now) => {
          const t = Math.min(1, (now - start) / duration);
          el.textContent = Math.round(easeOut(t) * target).toString();
          if (t < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        counterIO.unobserve(el);
      });
    },
    { threshold: 0.4 }
  );
  counters.forEach((c) => counterIO.observe(c));

  /* ----------- Magnetic buttons ----------- */
  document.querySelectorAll(".magnetic").forEach((btn) => {
    let raf;
    btn.addEventListener("mousemove", (e) => {
      const r = btn.getBoundingClientRect();
      const x = e.clientX - (r.left + r.width / 2);
      const y = e.clientY - (r.top + r.height / 2);
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        btn.style.transform = `translate(${x * 0.2}px, ${y * 0.3}px)`;
      });
    });
    btn.addEventListener("mouseleave", () => {
      cancelAnimationFrame(raf);
      btn.style.transform = "";
    });
  });

  /* ----------- Parallax on hero app tiles ----------- */
  if (!isTouch) {
    const tiles = document.querySelectorAll(".app-strip .app-tile");
    window.addEventListener("mousemove", (e) => {
      const cxw = e.clientX / window.innerWidth - 0.5;
      const cyw = e.clientY / window.innerHeight - 0.5;
      tiles.forEach((t, i) => {
        const f = ((i % 3) + 1) * 6;
        t.style.translate = `${cxw * f}px ${cyw * f}px`;
      });
    });
  }

  /* ----------- Smooth anchor scroll ----------- */
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      if (id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: "smooth" });
    });
  });
})();
