/* characters.js — Karakter ızgarası: arama + taraf/sınıf filtresi + detay modalı. */
(function () {
  "use strict";

  let ALL = [];
  let filters = { search: "", side: "all", status: "all" };

  function cardHTML(c) {
    return `
      <div class="char-card reveal" data-id="${c.id}">
        <div class="ph">
          <span class="grade-badge">${JJK.escapeHtml(c.grade)}</span>
          <img src="${JJK.escapeHtml(c.img)}" alt="${JJK.escapeHtml(c.name)}" loading="lazy" />
        </div>
        <div class="info">
          <h3>${JJK.escapeHtml(c.name)}</h3>
          <div class="aff"><span class="side-dot side-${JJK.escapeHtml(c.side)}"></span>${JJK.escapeHtml(c.affiliation)}</div>
        </div>
      </div>`;
  }

  function render() {
    const grid = document.querySelector("#charGrid");
    const q = filters.search.trim().toLowerCase();

    const list = ALL.filter((c) => {
      if (filters.side !== "all" && c.side !== filters.side) return false;
      if (filters.status !== "all" && c.status !== filters.status) return false;
      if (q) {
        const hay = (c.name + " " + c.tags.join(" ") + " " + c.affiliation).toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });

    const countEl = document.querySelector("#charCount");
    if (countEl) countEl.textContent = `${list.length} karakter`;

    grid.innerHTML = list.length
      ? list.map(cardHTML).join("")
      : `<p class="empty">Aramanıza uygun karakter bulunamadı.</p>`;

    grid.querySelectorAll(".char-card").forEach((card) => {
      card.addEventListener("click", () => openModal(card.dataset.id));
    });
    JJK.observeReveal(grid);
  }

  function openModal(id) {
    const c = ALL.find((x) => x.id === id);
    if (!c) return;
    const overlay = document.querySelector("#charModal");
    overlay.querySelector(".modal").innerHTML = `
      <div class="modal-head">
        <img src="${JJK.escapeHtml(c.img)}" alt="${JJK.escapeHtml(c.name)}" />
        <button class="modal-close" aria-label="Kapat">&times;</button>
      </div>
      <div class="modal-body">
        <h2>${JJK.escapeHtml(c.name)}</h2>
        <div class="jp">${JJK.escapeHtml(c.jp || "")}</div>
        <div class="stat-row">
          <div class="stat"><div class="k">Taraf</div><div class="v"><span class="side-dot side-${JJK.escapeHtml(c.side)}"></span>${JJK.escapeHtml(c.side)}</div></div>
          <div class="stat"><div class="k">Sınıf</div><div class="v">${JJK.escapeHtml(c.grade)}</div></div>
          <div class="stat"><div class="k">Bağlılık</div><div class="v">${JJK.escapeHtml(c.affiliation)}</div></div>
          <div class="stat"><div class="k">Durum</div><div class="v">${JJK.escapeHtml(c.status)}</div></div>
        </div>
        <p class="blurb">${JJK.escapeHtml(c.blurb)}</p>
        <div class="tag-row">
          ${c.tags.map((t) => `<span class="tag">${JJK.escapeHtml(t)}</span>`).join("")}
        </div>
      </div>`;
    overlay.classList.add("open");
    overlay.querySelector(".modal-close").addEventListener("click", closeModal);
  }

  function closeModal() {
    document.querySelector("#charModal").classList.remove("open");
  }

  function wireControls() {
    const search = document.querySelector("#charSearch");
    if (search)
      search.addEventListener("input", (e) => {
        filters.search = e.target.value;
        render();
      });

    document.querySelectorAll("#sideChips .chip").forEach((chip) => {
      chip.addEventListener("click", () => {
        document.querySelectorAll("#sideChips .chip").forEach((c) => c.classList.remove("active"));
        chip.classList.add("active");
        filters.side = chip.dataset.side;
        render();
      });
    });

    const statusSel = document.querySelector("#statusFilter");
    if (statusSel)
      statusSel.addEventListener("change", (e) => {
        filters.status = e.target.value;
        render();
      });

    const overlay = document.querySelector("#charModal");
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) closeModal();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeModal();
    });
  }

  async function init() {
    const grid = document.querySelector("#charGrid");
    if (!grid) return;
    try {
      ALL = await JJK.fetchJSON("data/characters.json");
    } catch (e) {
      grid.innerHTML = `<p class="empty">Karakterler yüklenemedi: ${JJK.escapeHtml(e.message)}</p>`;
      return;
    }
    wireControls();
    render();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
