/* news.js — Haberleri data/news.json'dan yükler ve kartlara basar. */
(function () {
  "use strict";

  function formatDate(iso) {
    try {
      return new Date(iso).toLocaleDateString("tr-TR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    } catch {
      return iso;
    }
  }

  async function init() {
    const grid = document.querySelector("#newsGrid");
    if (!grid) return;

    let news;
    try {
      news = await JJK.fetchJSON("data/news.json");
    } catch (e) {
      grid.innerHTML = `<p class="empty">Haberler yüklenemedi: ${JJK.escapeHtml(e.message)}</p>`;
      return;
    }

    // En yeni haber üstte
    news.sort((a, b) => new Date(b.date) - new Date(a.date));

    grid.innerHTML = news
      .map(
        (n) => `
        <article class="news-card reveal" data-url="${JJK.escapeHtml(n.url)}">
          <img src="${JJK.escapeHtml(n.img)}" alt="${JJK.escapeHtml(n.title)}" loading="lazy" />
          <div class="body">
            <div class="meta">
              <span class="tag">${JJK.escapeHtml(n.tag)}</span>
              <span class="date">${formatDate(n.date)}</span>
            </div>
            <h3>${JJK.escapeHtml(n.title)}</h3>
            <p>${JJK.escapeHtml(n.excerpt)}</p>
          </div>
        </article>`
      )
      .join("");

    grid.querySelectorAll(".news-card").forEach((card) => {
      card.addEventListener("click", () => JJK.openExternal(card.dataset.url));
    });

    JJK.observeReveal(grid);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
