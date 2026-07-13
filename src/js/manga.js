/* manga.js — Manga arklarını listeler; karta tıklayınca detay modalı açar,
   okuma durumu localStorage'da saklanır, resmî okuyucuya bağlanır. */
(function () {
  "use strict";

  const KEY = "jjk-read-arcs";
  let DATA = null;
  let ARCS = [];
  let read = {};

  function load() {
    try { read = JSON.parse(localStorage.getItem(KEY)) || {}; }
    catch { read = {}; }
  }
  function save() { localStorage.setItem(KEY, JSON.stringify(read)); }

  function renderStats() {
    const total = ARCS.length;
    const done = ARCS.filter((a) => read[a.id]).length;
    const pct = total ? Math.round((done / total) * 100) : 0;
    const host = document.querySelector("#trackerStats");
    if (!host) return;
    host.innerHTML = `
      <div class="stat-box"><div class="num">${done}/${total}</div><div class="lbl">Okunan ark</div></div>
      <div class="stat-box"><div class="num">%${pct}</div><div class="lbl">Tamamlanma</div></div>
      <div class="stat-box"><div class="num">${total - done}</div><div class="lbl">Kalan ark</div></div>`;
  }

  function render() {
    const host = document.querySelector("#arcList");
    host.innerHTML = ARCS.map(
      (a) => `
      <div class="arc-card ${read[a.id] ? "done" : ""}" data-id="${a.id}">
        <img src="${JJK.escapeHtml(a.img)}" alt="${JJK.escapeHtml(a.title)}" loading="lazy" />
        <div class="arc-info">
          <div class="ch">Bölüm ${JJK.escapeHtml(a.chapters)}${a.episodes && a.episodes !== "—" ? " · Anime " + JJK.escapeHtml(a.episodes) : ""}</div>
          <h3>${JJK.escapeHtml(a.title)}</h3>
          <p>${JJK.escapeHtml(a.summary)}</p>
          <span class="arc-more">Detay ve oku →</span>
        </div>
        <label class="switch" title="Okundu olarak işaretle">
          <input type="checkbox" data-id="${a.id}" ${read[a.id] ? "checked" : ""}>
          <span class="track"></span>
        </label>
      </div>`
    ).join("");

    // Okuma anahtarı (modalı açmasın)
    host.querySelectorAll(".switch").forEach((sw) => {
      sw.addEventListener("click", (e) => e.stopPropagation());
    });
    host.querySelectorAll("input[type=checkbox]").forEach((cb) => {
      cb.addEventListener("change", () => {
        setRead(cb.dataset.id, cb.checked);
        cb.closest(".arc-card").classList.toggle("done", cb.checked);
      });
    });

    // Karta tıkla → detay modalı
    host.querySelectorAll(".arc-card").forEach((card) => {
      card.addEventListener("click", () => openModal(card.dataset.id));
    });
  }

  function setRead(id, val) {
    if (val) read[id] = true; else delete read[id];
    save();
    renderStats();
  }

  function openModal(id) {
    const a = ARCS.find((x) => x.id === id);
    if (!a) return;
    const overlay = document.querySelector("#mangaModal");
    const isRead = !!read[id];
    overlay.querySelector(".modal").innerHTML = `
      <div class="modal-head">
        <img src="${JJK.escapeHtml(a.img)}" alt="${JJK.escapeHtml(a.title)}" />
        <button class="modal-close" aria-label="Kapat">&times;</button>
      </div>
      <div class="modal-body">
        <h2>${JJK.escapeHtml(a.title)}</h2>
        <div class="stat-row">
          <div class="stat"><div class="k">Bölümler</div><div class="v">${JJK.escapeHtml(a.chapters)}</div></div>
          <div class="stat"><div class="k">Anime</div><div class="v">${JJK.escapeHtml(a.episodes || "—")}</div></div>
        </div>
        <p class="blurb">${JJK.escapeHtml(a.longSummary)}</p>
        <h4 class="event-title">Öne çıkan olaylar</h4>
        <ul class="event-list">
          ${a.keyEvents.map((e) => `<li>${JJK.escapeHtml(e)}</li>`).join("")}
        </ul>
        <div class="share-row" style="justify-content:flex-start;margin-top:22px">
          <button class="btn" id="readMangaPlus">📖 MANGA Plus'ta Oku</button>
          <button class="btn btn-outline" id="readViz">VIZ</button>
          <button class="btn btn-outline" id="toggleRead">${isRead ? "✓ Okundu" : "Okundu işaretle"}</button>
        </div>
      </div>`;
    overlay.classList.add("open");

    overlay.querySelector(".modal-close").addEventListener("click", closeModal);
    overlay.querySelector("#readMangaPlus").addEventListener("click", () => JJK.openExternal(DATA.readUrl));
    overlay.querySelector("#readViz").addEventListener("click", () => JJK.openExternal(DATA.vizUrl));
    overlay.querySelector("#toggleRead").addEventListener("click", (ev) => {
      const now = !read[id];
      setRead(id, now);
      ev.target.textContent = now ? "✓ Okundu" : "Okundu işaretle";
      // arkadaki kartı da güncelle
      const card = document.querySelector(`.arc-card[data-id="${id}"]`);
      if (card) {
        card.classList.toggle("done", now);
        const cb = card.querySelector("input[type=checkbox]");
        if (cb) cb.checked = now;
      }
    });
  }

  function closeModal() {
    document.querySelector("#mangaModal").classList.remove("open");
  }

  async function init() {
    const host = document.querySelector("#arcList");
    if (!host) return;
    try { DATA = await JJK.fetchJSON("data/manga.json"); }
    catch (e) {
      host.innerHTML = `<p class="empty">Manga verisi yüklenemedi: ${JJK.escapeHtml(e.message)}</p>`;
      return;
    }
    ARCS = DATA.arcs;
    load();
    render();
    renderStats();

    const overlay = document.querySelector("#mangaModal");
    if (overlay) {
      overlay.addEventListener("click", (e) => { if (e.target === overlay) closeModal(); });
      document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeModal(); });
    }

    const resetBtn = document.querySelector("#resetTracker");
    if (resetBtn)
      resetBtn.addEventListener("click", () => {
        read = {};
        save();
        render();
        renderStats();
        JJK.toast("Takip listesi sıfırlandı.");
      });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
