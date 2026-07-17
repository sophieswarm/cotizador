
import { ICONS, sel, COMP_KEYS } from './state.js';
import { areAllComponentsSelected, getComponentCount, getQuoteTotal } from './pricing.js';
import { buildWhatsAppHref } from './quote.js';
import { fmt, renderAlerts } from './utils.js';

// articulos resumen
export function buildSummaryLines() {
  const container = document.getElementById("summary-lines");
  if (!container) return;

  container.innerHTML = COMP_KEYS.map(key => `
    <div class="summary-line">
      <span class="s-name">${key}</span>
      <span class="s-val empty" id="sum-${key.replace(/ /g, "_")}">—</span>
    </div>`).join("");
}

// actualizar resumen
export function updateSummary() {
  COMP_KEYS.forEach(key => {
    const el = document.getElementById(`sum-${key.replace(/ /g, "_")}`);
    if (sel[key]) {
      el.textContent = sel[key].name;
      el.classList.remove("empty");
    } else {
      el.textContent = "—";
      el.classList.add("empty");
    }
  });
}

// actualizar total y barra de progreso
export function updateTotal() {
  const count = getComponentCount();
  const allSelected = areAllComponentsSelected();
  const total = getQuoteTotal();
  const totalHint = document.getElementById("total-hint");

  document.getElementById("total-display").textContent = allSelected ? fmt(total) : "—";
  if (totalHint) {
    totalHint.style.display = allSelected ? "none" : "block";
  }

  document.getElementById("prog-count").textContent    = `${count} / 8`;
  document.getElementById("prog-bar").style.width      = `${(count / 8) * 100}%`;

  const waBtn = document.getElementById("btn-wa");
  document.getElementById("btn-quote").disabled = !allSelected;

  waBtn.onclick = (e) => {
    if (!allSelected) {
      e.preventDefault();
      renderAlerts([{ type: "warn", msg: "Selecciona los 8 componentes para generar tu cotización y contactar por WhatsApp" }], { append: true, autoDismiss: 2800 });
    }
  };

  if (allSelected) {
    waBtn.href = buildWhatsAppHref();
  } else {
    waBtn.removeAttribute("href");
  }
}



