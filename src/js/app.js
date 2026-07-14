/* ===========================================================
   app.js — Ortak altyapı: tema, vurgu rengi, navigasyon,
   scroll-reveal ve yardımcı fonksiyonlar.
   Tüm sayfalarda ilk yüklenen script budur. window.JJK üzerinden
   sayfa scriptleri yardımcıları kullanır.
   =========================================================== */
(function () {
  "use strict";

  const ACCENTS = [
    { id: "red", hex: "#ff4747", label: "Kırmızı (Sukuna)" },
    { id: "blue", hex: "#4f9dff", label: "Mavi (Gojo)" },
    { id: "purple", hex: "#a855f7", label: "Mor (Sınırsızlık)" },
    { id: "green", hex: "#22c55e", label: "Yeşil (Şifa)" },
  ];

  const NAV = [
    { page: "home", href: "index.html", label: "Ana Sayfa" },
    { page: "manga", href: "manga.html", label: "Manga" },
    { page: "characters", href: "karakterler.html", label: "Karakterler" },
    { page: "quiz", href: "test.html", label: "Karakter Testi" },
    { page: "game", href: "game.html", label: "Düello" },
  ];

  /* ---- Yardımcılar ---- */
  function hexToRgb(hex) {
    const h = hex.replace("#", "");
    const n = parseInt(h, 16);
    return `${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}`;
  }

  async function fetchJSON(path) {
    const res = await fetch(path);
    if (!res.ok) throw new Error(`${path} yüklenemedi (${res.status})`);
    return res.json();
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  // Dış bağlantıyı sistem tarayıcısında aç (Tauri opener), yoksa normal aç.
  async function openExternal(url) {
    try {
      if (window.__TAURI__ && window.__TAURI__.opener) {
        await window.__TAURI__.opener.openUrl(url);
        return;
      }
    } catch (e) {
      console.warn("opener başarısız, fallback:", e);
    }
    window.open(url, "_blank", "noopener");
  }

  let toastTimer;
  function toast(msg) {
    let el = document.querySelector(".toast");
    if (!el) {
      el = document.createElement("div");
      el.className = "toast";
      document.body.appendChild(el);
    }
    el.textContent = msg;
    requestAnimationFrame(() => el.classList.add("show"));
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("show"), 2600);
  }

  /* ---- Tema & Vurgu ---- */
  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("jjk-theme", theme);
    const btn = document.querySelector("#themeToggle");
    if (btn) btn.textContent = theme === "light" ? "🌙" : "☀️";
  }

  function applyAccent(hex) {
    document.documentElement.style.setProperty("--accent", hex);
    document.documentElement.style.setProperty("--accent-rgb", hexToRgb(hex));
    localStorage.setItem("jjk-accent", hex);
    document.querySelectorAll(".swatch").forEach((s) => {
      s.classList.toggle("selected", s.dataset.hex === hex);
    });
  }

  /* ---- Üst bar + Footer enjeksiyonu ---- */
  function renderChrome() {
    const active = document.body.dataset.page || "home";

    const topbarHost = document.querySelector("#topbar");
    if (topbarHost) {
      const links = NAV.map(
        (n) =>
          `<a href="${n.href}" class="${n.page === active ? "active" : ""}">${n.label}</a>`
      ).join("");

      const swatches = ACCENTS.map(
        (a) =>
          `<button class="swatch" title="${a.label}" data-hex="${a.hex}" style="background:${a.hex}"></button>`
      ).join("");

      topbarHost.outerHTML = `
        <header class="topbar">
          <div class="brand"><span class="dot"></span> JJK Merkez</div>
          <button class="icon-btn menu-toggle" id="menuToggle" aria-label="Menü">☰</button>
          <nav class="nav-links" id="navLinks">${links}</nav>
          <div class="topbar-actions">
            <div class="accent-picker">${swatches}</div>
            <button class="icon-btn" id="themeToggle" aria-label="Tema değiştir">☀️</button>
          </div>
        </header>`;
    }

    const footerHost = document.querySelector("#footer");
    if (footerHost) {
      footerHost.outerHTML = `
        <footer>
          <p>&copy; 2026 Jujutsu Kaisen Merkez — Hayran projesi | Hazırlayan: Eren</p>
        </footer>`;
    }
  }

  /* ---- Olaylar ---- */
  function wireEvents() {
    const themeBtn = document.querySelector("#themeToggle");
    if (themeBtn) {
      themeBtn.addEventListener("click", () => {
        const cur = document.documentElement.getAttribute("data-theme");
        applyTheme(cur === "light" ? "dark" : "light");
      });
    }

    document.querySelectorAll(".swatch").forEach((s) => {
      s.addEventListener("click", () => applyAccent(s.dataset.hex));
    });

    const menuBtn = document.querySelector("#menuToggle");
    const nav = document.querySelector("#navLinks");
    if (menuBtn && nav) {
      menuBtn.addEventListener("click", () => nav.classList.toggle("open"));
    }
  }

  /* ---- Scroll Reveal ---- */
  function initReveal() {
    const els = document.querySelectorAll(".reveal");
    if (!els.length) return;
    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("visible"));
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    els.forEach((el) => obs.observe(el));
  }

  // Dinamik eklenen .reveal öğeleri için tekrar tarama
  function observeReveal(root) {
    const els = (root || document).querySelectorAll(".reveal:not(.visible)");
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    els.forEach((el) => obs.observe(el));
  }

  /* ---- Açılış ---- */
  function boot() {
    renderChrome();
    applyTheme(localStorage.getItem("jjk-theme") || "dark");
    applyAccent(localStorage.getItem("jjk-accent") || "#ff4747");
    wireEvents();
    initReveal();
  }

  // window.JJK API
  window.JJK = { fetchJSON, escapeHtml, openExternal, toast, observeReveal, ACCENTS };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
