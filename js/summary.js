
import { sel, COMP_KEYS, WA_NUMBER, STORE_NAME } from './state.js';
import { fmt, showToast } from './utils.js';

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

export function updateTotal() {
  const total = COMP_KEYS.reduce((s, k) => s + (sel[k]?.price || 0), 0);
  document.getElementById("total-display").textContent = fmt(total);

  const count = COMP_KEYS.filter(k => sel[k]).length;
  document.getElementById("prog-count").textContent    = `${count} / 8`;
  document.getElementById("prog-bar").style.width      = `${(count / 8) * 100}%`;

  const allSelected = count === 8;
  const waBtn = document.getElementById("btn-wa");
  document.getElementById("btn-quote").disabled = !allSelected;

  waBtn.onclick = (e) => {
    if (!allSelected) {
      e.preventDefault();
      showToast("Selecciona los 8 componentes para generar tu cotización y contactar por WhatsApp");
    }
  };

  if (allSelected) {
    const lines = COMP_KEYS.map(k =>
      `• ${k}: ${sel[k].name} (${sel[k].sku}) — ${fmt(sel[k].price)}`
    ).join("\n");
    const msg = encodeURIComponent(
      `Hola ${STORE_NAME}! Quiero cotizar el siguiente PC Gamer:\n\n${lines}\n\n*TOTAL: ${fmt(total)}*\n\nPor favor confirmame disponibilidad y datos de pago 🙏`
    );
    waBtn.href = `https://wa.me/${WA_NUMBER}?text=${msg}`;
  } else {
    waBtn.removeAttribute("href");
  }


}



