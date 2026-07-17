import { COMP_KEYS, ICONS, sel } from './state.js';
import { DATA }                   from './data.js';
import { showMeta, hideMeta }     from './meta.js';
import { checkCompat }            from './compat.js';
import { updateSummary, updateTotal } from './summary.js';

export function buildCards() {
  const container = document.getElementById("comp-cards");
  container.innerHTML = "";
  COMP_KEYS.forEach(key => {
    container.appendChild(createCard(key));
  });

  bindCardEvents(container);
}

function createCard(key) {
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
        <div class="comp-stock" id="stock-${k}"></div>
      </div>
    </div>`;

  return card;
}

function bindCardEvents(container) {
  if (container.dataset.bound) return;

  container.addEventListener("change", handleCardSelectChange);
  container.addEventListener("click", handleCaseTileClick);
  container.dataset.bound = "true";
}

function handleCardSelectChange(event) {
  if (event.target.tagName !== "SELECT") return;

  const key = event.target.dataset.key;
  const k   = key.replace(/ /g, "_");
  const sku = event.target.value;

  if (!sku) {
    sel[key] = null;
    hideMeta(k);
  } else {
    const item = DATA[key].find(i => i.sku === sku);
    sel[key] = item;
    showMeta(k, item);
  }

  refreshQuoteState();
}

function handleCaseTileClick(event) {
  const tile = event.target.closest(".case-tile");
  if (!tile) return;

  const key = "GABINETE";
  const k   = "GABINETE";
  const sku = tile.dataset.sku;

  document.querySelectorAll(".case-tile").forEach(t => t.classList.remove("selected"));

  if (sel[key]?.sku === sku) {
    sel[key] = null;
    hideMeta(k);
  } else {
    tile.classList.add("selected");
    const item = DATA[key].find(i => i.sku === sku);
    sel[key] = item;
    showMeta(k, item);
  }

  refreshQuoteState();
}

function refreshQuoteState() {
  checkCompat();
  updateSummary();
  updateTotal();
}

function buildSelect(key, k) {
  const opts = DATA[key].map(it =>
    `<option value="${it.sku}">${it.name}</option>`
  ).join("");
  return `
    <select id="sel-${k}" data-key="${key}">
      <option value=""> Seleccionar ${key} </option>
      ${opts}
    </select>`;
}

function buildImageGrid(key, k) {
  const tiles = DATA[key].map(it => `
    <div class="case-tile" data-sku="${it.sku}" title="${it.name}">
      <img src="${it.image ?? ''}" alt="${it.name}" />
      <div class="case-tile-name">${it.name}</div>
    </div>
  `).join("");
  return `<div class="case-grid">${tiles}</div>`;
}