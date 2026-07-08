
import { sel, COMP_KEYS, WA_NUMBER, STORE_NAME } from './state.js';
import { fmt } from './utils.js';

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
  document.getElementById("btn-quote").disabled = !allSelected;

  if (allSelected) {
    const lines = COMP_KEYS.map(k =>
      `• ${k}: ${sel[k].name} (${sel[k].sku}) — ${fmt(sel[k].price)}`
    ).join("\n");
    const msg = encodeURIComponent(
      `Hola ${STORE_NAME}! Quiero cotizar el siguiente PC Gamer:\n\n${lines}\n\n*TOTAL: ${fmt(total)}*\n\nPor favor confirmame disponibilidad y datos de pago 🙏`
    );
    document.getElementById("btn-wa").href = `https://wa.me/${WA_NUMBER}?text=${msg}`;
  }

}


