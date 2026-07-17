
import { buildCards }             from './cards.js';
import { updateTotal }            from './summary.js';
import { checkCompat }            from './compat.js';
import { generatePDF }            from './pdf.js';
import { sel, COMP_KEYS }         from './state.js';
import { hideMeta }               from './meta.js';
import { checkCompat as _compat } from './compat.js';
import { updateSummary }          from './summary.js';
import { renderAlerts as renderUtilsAlerts } from './utils.js';

window.generatePDF = generatePDF;
window.resetAll    = resetAll;

function resetAll() {
  COMP_KEYS.forEach(key => {
    sel[key] = null;
    const k  = key.replace(/ /g, "_");
    const select = document.getElementById(`sel-${k}`);
    if (select) select.value = "";
    hideMeta(k);
  });
  document.querySelectorAll(".case-tile.selected").forEach(tile => tile.classList.remove("selected"));
  _compat();
  updateSummary();
  updateTotal();
  renderUtilsAlerts([{ type: "warn", msg: "↺ Selección reiniciada" }], { append: true, autoDismiss: 2800 });
}

// Init
buildCards();
updateTotal();