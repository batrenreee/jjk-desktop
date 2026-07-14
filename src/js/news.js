/* news.js — Uygulama içi haber merkezi, filtreler ve okuma listesi. */
(function () {
  "use strict";

  let ALL = [];
  let featured = null;
  let state = { search: "", category: "Tümü", sort: "newest" };
  let saved;
  try {
    const stored = JSON.parse(localStorage.getItem("jjk-saved-news") || "[]");
    saved = new Set(Array.isArray(stored) ? stored : []);
  } catch {
    saved = new Set();
  }

  function formatDate(iso) {
    return new Date(`${iso}T12:00:00`).toLocaleDateString("tr-TR", { day:"numeric", month:"long", year:"numeric" });
  }

  function persistSaved() {
    localStorage.setItem("jjk-saved-news", JSON.stringify([...saved]));
    document.querySelector("#savedTotal").textContent = saved.size;
  }

  function visual(n, cls="") {
    return `<div class="news-visual ${cls}"><img class="news-visual-bg" src="${JJK.escapeHtml(n.img)}" alt="" aria-hidden="true" /><img class="news-visual-main" src="${JJK.escapeHtml(n.img)}" alt="${JJK.escapeHtml(n.title)}" loading="lazy" /></div>`;
  }

  function cardHTML(n) {
    const isSaved=saved.has(n.id);
    return `<article class="news-feed-card reveal" data-id="${n.id}" tabindex="0">
      ${visual(n)}
      <div class="news-feed-body">
        <div class="news-card-meta"><span class="news-category">${JJK.escapeHtml(n.category)}</span><span>${formatDate(n.date)}</span><span>•</span><span>${n.readTime} dk okuma</span></div>
        <h3>${JJK.escapeHtml(n.title)}</h3>
        <p>${JJK.escapeHtml(n.excerpt)}</p>
        <div class="news-card-foot"><span>${JJK.escapeHtml(n.source)}</span><button class="save-news ${isSaved?"saved":""}" data-save="${n.id}" aria-label="${isSaved?"Okuma listesinden çıkar":"Okuma listesine ekle"}">${isSaved?"★":"☆"}</button></div>
      </div>
    </article>`;
  }

  function filtered() {
    const q=state.search.trim().toLocaleLowerCase("tr");
    const list=ALL.filter(n=>(state.category==="Tümü"||n.category===state.category)&&(!q||[n.title,n.excerpt,n.category,n.source,...n.content].join(" ").toLocaleLowerCase("tr").includes(q)));
    list.sort((a,b)=>state.sort==="oldest"?new Date(a.date)-new Date(b.date):state.sort==="shortest"?a.readTime-b.readTime:new Date(b.date)-new Date(a.date));
    return list;
  }

  function render() {
    const list=filtered(), grid=document.querySelector("#newsGrid");
    grid.innerHTML=list.length?list.map(cardHTML).join(""):`<div class="empty"><strong>Haber bulunamadı</strong><span>Arama kelimesini veya kategoriyi değiştirmeyi dene.</span></div>`;
    wireCards(grid); JJK.observeReveal(grid);
  }

  function wireCards(root) {
    root.querySelectorAll(".news-feed-card").forEach(card=>{
      card.addEventListener("click",e=>{if(!e.target.closest(".save-news"))openArticle(card.dataset.id);});
      card.addEventListener("keydown",e=>{if((e.key==="Enter"||e.key===" ")&&!e.target.closest(".save-news")){e.preventDefault();openArticle(card.dataset.id);}});
    });
    root.querySelectorAll(".save-news").forEach(btn=>btn.addEventListener("click",e=>{e.stopPropagation();toggleSave(btn.dataset.save);render();}));
  }

  function toggleSave(id) {
    if(saved.has(id)){saved.delete(id);JJK.toast("Okuma listesinden çıkarıldı");}else{saved.add(id);JJK.toast("Okuma listene eklendi");}
    persistSaved();
  }

  function openArticle(id) {
    const n=ALL.find(x=>x.id===id); if(!n)return;
    const overlay=document.querySelector("#newsModal"), isSaved=saved.has(id);
    overlay.querySelector(".news-reader").innerHTML=`
      <button class="modal-close" aria-label="Kapat">×</button>
      ${visual(n,"reader-visual")}
      <div class="reader-body">
        <div class="news-card-meta"><span class="news-category">${JJK.escapeHtml(n.category)}</span><span>${formatDate(n.date)}</span><span>•</span><span>${n.readTime} dk okuma</span></div>
        <h2>${JJK.escapeHtml(n.title)}</h2><p class="reader-lead">${JJK.escapeHtml(n.excerpt)}</p>
        <div class="reader-source"><div><span>Kaynak</span><strong>${JJK.escapeHtml(n.source)}</strong></div><span>Türkçe özet • JJK Merkez</span></div>
        <div class="reader-copy">${n.content.map(p=>`<p>${JJK.escapeHtml(p)}</p>`).join("")}${n.highlights?.length?`<div class="reader-highlights"><h3>Kısa kısa</h3><ul>${n.highlights.map(x=>`<li>${JJK.escapeHtml(x)}</li>`).join("")}</ul></div>`:""}</div>
        <div class="reader-actions"><button class="btn save-article ${isSaved?"saved":""}">${isSaved?"★ Okuma listemde":"☆ Okuma listesine ekle"}</button><button class="btn btn-outline open-source">Resmî kaynağı aç ↗</button></div>
      </div>`;
    overlay.classList.add("open");document.body.classList.add("modal-open");
    overlay.querySelector(".modal-close").addEventListener("click",closeArticle);
    overlay.querySelector(".save-article").addEventListener("click",()=>{toggleSave(id);openArticle(id);render();});
    overlay.querySelector(".open-source").addEventListener("click",()=>JJK.openExternal(n.url));
  }

  function closeArticle(){document.querySelector("#newsModal").classList.remove("open");document.body.classList.remove("modal-open");}

  function setupFeatured() {
    featured=ALL.find(n=>n.featured)||ALL[0]; if(!featured)return;
    document.querySelector("#featuredMeta").textContent=`${featured.category.toUpperCase()} • ${formatDate(featured.date)} • ${featured.readTime} DK OKUMA`;
    document.querySelector("#featuredTitle").textContent=featured.title;
    document.querySelector("#featuredExcerpt").textContent=featured.excerpt;
    const btn=document.querySelector("#readFeatured");btn.disabled=false;btn.addEventListener("click",()=>openArticle(featured.id));
    document.querySelector("#tickerTrack").innerHTML=ALL.slice(0,5).map(n=>`<button data-id="${n.id}"><i></i>${JJK.escapeHtml(n.title)}</button>`).join("");
    document.querySelectorAll("#tickerTrack button").forEach(b=>b.addEventListener("click",()=>openArticle(b.dataset.id)));
  }

  function setupControls() {
    const cats=["Tümü",...new Set(ALL.map(n=>n.category))];
    document.querySelector("#newsCategories").innerHTML=cats.map((c,i)=>`<button class="news-filter ${i===0?"active":""}" data-category="${JJK.escapeHtml(c)}">${JJK.escapeHtml(c)}<span>${c==="Tümü"?ALL.length:ALL.filter(n=>n.category===c).length}</span></button>`).join("");
    document.querySelectorAll(".news-filter").forEach(btn=>btn.addEventListener("click",()=>{document.querySelectorAll(".news-filter").forEach(x=>x.classList.remove("active"));btn.classList.add("active");state.category=btn.dataset.category;render();}));
    document.querySelector("#newsSearch").addEventListener("input",e=>{state.search=e.target.value;render();});
    document.querySelector("#newsSort").addEventListener("change",e=>{state.sort=e.target.value;render();});
    const overlay=document.querySelector("#newsModal");overlay.addEventListener("click",e=>{if(e.target===overlay)closeArticle();});document.addEventListener("keydown",e=>{if(e.key==="Escape")closeArticle();});
  }

  function setupSidebar() {
    document.querySelector("#trendingList").innerHTML=ALL.slice().sort((a,b)=>(b.popularity||0)-(a.popularity||0)).slice(0,4).map((n,i)=>`<button class="trending-item" data-id="${n.id}"><b>0${i+1}</b><span>${JJK.escapeHtml(n.title)}<small>${n.category} • ${n.readTime} dk</small></span></button>`).join("");
    document.querySelectorAll(".trending-item").forEach(b=>b.addEventListener("click",()=>openArticle(b.dataset.id)));
  }

  async function init() {
    try{ALL=await JJK.fetchJSON("data/news.json");}catch(e){document.querySelector("#newsGrid").innerHTML=`<p class="empty">Haberler yüklenemedi: ${JJK.escapeHtml(e.message)}</p>`;return;}
    ALL.sort((a,b)=>new Date(b.date)-new Date(a.date));
    document.querySelector("#newsTotal").textContent=ALL.length;document.querySelector("#categoryTotal").textContent=new Set(ALL.map(n=>n.category)).size;persistSaved();
    setupFeatured();setupControls();setupSidebar();render();
  }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);else init();
})();
