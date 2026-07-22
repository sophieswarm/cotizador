import { COMP_KEYS, ICONS, sel } from './state.js';
import { showMeta, hideMeta }     from './meta.js';
import { checkCompat }            from './compat.js';
import { updateSummary, updateTotal } from './summary.js';
import { getFilteredProducts } from './filters.js';

const motherboardFilterState = { vendor: "ALL" };

//lista de todas las cards de componentes
export function buildCards() {
  const container = document.getElementById("comp-cards");
  container.innerHTML = "";
  COMP_KEYS.forEach(key => {
    container.appendChild(createCard(key));
  });

  bindCardEvents(container);
}

//crea una card
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
      ${key === "GABINETE" ? buildImageGrid(key, k) : buildInputByType(key, k)}
      <div class="comp-meta" id="meta-${k}" style="display:none">
        <div class="comp-stock" id="stock-${k}"></div>
      </div>
    </div>`;

  return card;
}

//bind eventos con funciones
function bindCardEvents(container) {
  if (container.dataset.bound) return;

  container.addEventListener("change", handleCardSelectChange);
  container.addEventListener("click", handleCaseTileClick);
  container.addEventListener("click", handleVendorFilterClick);
  container.dataset.bound = "true";
}

//seleccionar
function handleCardSelectChange(event) {
  if (event.target.tagName !== "SELECT") return;

  const key = event.target.dataset.key;
  const k   = key.replace(/ /g, "_");
  const sku = event.target.value;

  if (!sku) {
    sel[key] = null;
    hideMeta(k);
  } else {
    const item = getFilteredProducts(key, sel, motherboardFilterState.vendor).find(i => i.sku === sku);
    sel[key] = item;
    showMeta(k, item);
  }

  if (key === "PLACA MADRE") {
    syncSelectionWithFilter("PROCESADOR");
  }

  refreshQuoteState();
}

//seleccionar gabinete
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
    const item = getFilteredProducts(key, sel).find(i => i.sku === sku);
    sel[key] = item;
    showMeta(k, item);
  }

  refreshQuoteState();
}

function handleVendorFilterClick(event) {
  const button = event.target.closest(".vendor-filter-btn");
  if (!button) return;

  const vendor = button.dataset.vendor;
  motherboardFilterState.vendor = vendor;

  const visibleMotherboards = getFilteredProducts("PLACA MADRE", sel, motherboardFilterState.vendor);
  const selectedMotherboard = sel["PLACA MADRE"];

  if (selectedMotherboard) {
    const isStillVisible = visibleMotherboards.some(item => item.sku === selectedMotherboard.sku);
    if (!isStillVisible) {
      sel["PLACA MADRE"] = visibleMotherboards[0] ?? null;
      if (sel["PLACA MADRE"]) {
        showMeta("PLACA_MADRE", sel["PLACA MADRE"]);
      } else {
        hideMeta("PLACA_MADRE");
      }
    }
  }

  syncSelectionWithFilter("PROCESADOR");
  buildCards();
  refreshQuoteState();
}

//actualizar estado precio
function refreshQuoteState() {
  checkCompat();
  updateSummary();
  updateTotal();
}

function syncSelectionWithFilter(key) {
  const visibleItems = getFilteredProducts(key, sel, motherboardFilterState.vendor);
  const selected = sel[key];

  if (!selected) return;

  const isStillVisible = visibleItems.some(item => item.sku === selected.sku);
  if (!isStillVisible) {
    sel[key] = null;
    hideMeta(key.replace(/ /g, "_"));
  }
}

function buildInputByType(key, k) {
  if (key === "PLACA MADRE") return buildMotherboardFilters();
  if (key === "PROCESADOR") return buildProcessorSelect();
  return buildSelect(key, k);
}

function buildMotherboardFilters() {
  const activeVendor = motherboardFilterState.vendor;
  return `
    <div class="vendor-filter" role="group" aria-label="Filtrar placas madre">
      <button type="button" class="vendor-filter-btn ${activeVendor === "ALL" ? "active" : ""}" data-vendor="ALL">Todos</button>
      <button type="button" class="vendor-filter-btn ${activeVendor === "AMD" ? "active" : ""}" data-vendor="AMD">AMD</button>
      <button type="button" class="vendor-filter-btn ${activeVendor === "INTEL" ? "active" : ""}" data-vendor="INTEL">Intel</button>
    </div>
    ${buildSelect("PLACA MADRE", "PLACA_MADRE")}
  `;
}

function buildProcessorSelect() {
  const opts = getFilteredProducts("PROCESADOR", sel, motherboardFilterState.vendor).map(it =>
    `<option value="${it.sku}">${it.name}</option>`
  ).join("");

  return `
    <select id="sel-PROCESADOR" data-key="PROCESADOR">
      <option value=""> Seleccionar PROCESADOR </option>
      ${opts}
    </select>`;
}

function buildSelect(key, k) {
  const opts = getFilteredProducts(key, sel, motherboardFilterState.vendor).map(it =>
    `<option value="${it.sku}">${it.name}</option>`
  ).join("");
  return `
    <select id="sel-${k}" data-key="${key}">
      <option value=""> Seleccionar ${key} </option>
      ${opts}
    </select>`;
}

function buildImageGrid(key, k) {
  const tiles = getFilteredProducts(key, sel, motherboardFilterState.vendor).map(it => `
    <div class="case-tile" data-sku="${it.sku}" title="${it.name}">
      <img src="${it.image ?? ''}" alt="${it.name}" />
      <div class="case-tile-name">${it.name}</div>
    </div>
  `).join("");
  return `<div class="case-grid">${tiles}</div>`;
}