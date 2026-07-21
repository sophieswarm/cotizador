import { COMP_KEYS, ICONS, sel } from './state.js';
import { DATA }                   from './data.js';
import { showMeta, hideMeta }     from './meta.js';
import { checkCompat }            from './compat.js';
import { updateSummary, updateTotal } from './summary.js';

const cpuFilterState = { brand: "ALL" };

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
  container.addEventListener("click", handleProcessorFilterClick);
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
    const item = DATA[key].find(i => i.sku === sku);
    sel[key] = item;
    showMeta(k, item);
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
    const item = DATA[key].find(i => i.sku === sku);
    sel[key] = item;
    showMeta(k, item);
  }

  refreshQuoteState();
}

//filtro de procesador
function handleProcessorFilterClick(event) {
  const btn = event.target.closest(".cpu-filter-btn");
  if (!btn) return;

  const brand = btn.dataset.brand;
  if (!brand || cpuFilterState.brand === brand) return;

  cpuFilterState.brand = brand;

  const buttons = document.querySelectorAll(".cpu-filter-btn");
  buttons.forEach(b => b.classList.toggle("active", b.dataset.brand === brand));

  renderProcessorOptions();
}

//actualizar estado precio
function refreshQuoteState() {
  checkCompat();
  updateSummary();
  updateTotal();
}

//determinar marca de procesador
function getProcessorBrand(cpu) {
  const name = String(cpu?.name ?? "").toUpperCase();
  if (name.includes("AMD")) return "AMD";
  if (name.includes("INTEL")) return "INTEL";
  return "OTHER";
}

//filtrar procesadores por marca
function getFilteredProcessors() {
  if (cpuFilterState.brand === "ALL") return DATA["PROCESADOR"];

  return DATA["PROCESADOR"].filter(cpu =>
    getProcessorBrand(cpu) === cpuFilterState.brand
  );
}

// listar procesadores filtrados
function renderProcessorOptions() {
  const select = document.getElementById("sel-PROCESADOR");
  if (!select) return;

  const processors = getFilteredProcessors();
  const currentSku = sel["PROCESADOR"]?.sku ?? "";
  const hasCurrent = processors.some(cpu => cpu.sku === currentSku);
  const selectedSku = hasCurrent ? currentSku : "";

  const opts = processors.map(cpu =>
    `<option value="${cpu.sku}" ${cpu.sku === selectedSku ? "selected" : ""}>${cpu.name}</option>`
  ).join("");

  select.innerHTML = `
    <option value=""> Seleccionar PROCESADOR </option>
    ${opts}
  `;

  select.value = selectedSku;

  if (!selectedSku && sel["PROCESADOR"]) {
    sel["PROCESADOR"] = null;
    hideMeta("PROCESADOR");
    refreshQuoteState();
  }
}


function buildInputByType(key, k) {
  if (key === "PROCESADOR") return buildProcessorSelect();
  return buildSelect(key, k);
}

function buildProcessorSelect() {
  const opts = getFilteredProcessors().map(it =>
    `<option value="${it.sku}">${it.name}</option>`
  ).join("");

  return `
    <div class="cpu-filter" role="group" aria-label="Filtrar procesadores">
      <button type="button" class="cpu-filter-btn active" data-brand="ALL">Todos</button>
      <button type="button" class="cpu-filter-btn" data-brand="AMD">AMD</button>
      <button type="button" class="cpu-filter-btn" data-brand="INTEL">Intel</button>
    </div>
    <select id="sel-PROCESADOR" data-key="PROCESADOR">
      <option value=""> Seleccionar PROCESADOR </option>
      ${opts}
    </select>`;
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