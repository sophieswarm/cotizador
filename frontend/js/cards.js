import { COMP_KEYS, ICONS, sel } from './state.js';
import { DATA }                   from './data.js';
import { fmt }                    from './utils.js';
import { showMeta, hideMeta }     from './meta.js';
import { checkCompat }            from './compat.js';
import { updateSummary, updateTotal } from './summary.js';

export function buildCards() {
  const container = document.getElementById("comp-cards");
  COMP_KEYS.forEach(key => {
    const k    = key.replace(/ /g, "_");
    const card = document.createElement("div");
    card.className = "comp-card";
    card.id        = `card-${k}`;

    card.innerHTML = `
      <div class="comp-header">
        <div class="comp-icon">${ICONS[key]}</div>
        <span class="comp-label">${key}</span>
      </div>
      <div class="comp-body">
        ${key === "GABINETE" ? buildImageGrid(key, k) : buildSelect(key, k)}
        <div class="comp-meta" id="meta-${k}" style="display:none">
          <div>
            <div class="comp-price" id="price-${k}"></div>
            <div class="comp-sku"   id="sku-${k}"></div>
          </div>
          <div class="comp-stock" id="stock-${k}"></div>
        </div>
      </div>`;

    container.appendChild(card);
  });

  document.getElementById("comp-cards").addEventListener("change", e => {
    if (e.target.tagName !== "SELECT") return;
    const key = e.target.dataset.key;
    const k   = key.replace(/ /g, "_");
    const sku = e.target.value;
    if (!sku) { sel[key] = null; hideMeta(k); }
    else {
      const item = DATA[key].find(i => i.sku === sku);
      sel[key] = item;
      showMeta(k, item);
    }
    checkCompat(); updateSummary(); updateTotal();
  });

  document.getElementById("comp-cards").addEventListener("click", e => {
    const tile = e.target.closest(".case-tile");
    if (!tile) return;
    const key = "GABINETE";
    const k   = "GABINETE";
    const sku = tile.dataset.sku;

    if (sel[key]?.sku === sku) {
      sel[key] = null;
      hideMeta(k);
      document.querySelectorAll(".case-tile").forEach(t => t.classList.remove("selected"));
    } else {
      document.querySelectorAll(".case-tile").forEach(t => t.classList.remove("selected"));
      tile.classList.add("selected");
      const item = DATA[key].find(i => i.sku === sku);
      sel[key] = item;
      showMeta(k, item);
    }
    checkCompat(); updateSummary(); updateTotal();
  });

  buildSummary();
}

function buildSelect(key, k) {
  const opts = DATA[key].map(it =>
    `<option value="${it.sku}">${it.name} — ${fmt(it.price)}</option>`
  ).join("");
  return `
    <select id="sel-${k}" data-key="${key}">
      <option value="">— Seleccionar ${key} —</option>
      ${opts}
    </select>`;
}

function buildImageGrid(key, k) {
  const tiles = DATA[key].map(it => `
    <div class="case-tile" data-sku="${it.sku}" title="${it.name}">
      <img src="${it.image ?? ''}" alt="${it.name}" />
      <div class="case-tile-name">${it.name}</div>
      <div class="case-tile-price">${fmt(it.price)}</div>
    </div>
  `).join("");
  return `<div class="case-grid">${tiles}</div>`;
}



function buildSummary() {
  const container = document.getElementById("summary-lines");
  container.innerHTML = COMP_KEYS.map(key => `
    <div class="summary-line">
      <span class="s-name">${ICONS[key]} ${key}</span>
      <span class="s-val empty" id="sum-${key.replace(/ /g,"_")}">—</span>
    </div>`).join("");
}