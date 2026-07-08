
import { buildCards }             from './cards.js';
import { updateTotal }            from './summary.js';
import { checkCompat }            from './compat.js';
import { generatePDF }            from './pdf.js';
import { sel, COMP_KEYS }         from './state.js';
import { hideMeta }               from './meta.js';
import { checkCompat as _compat } from './compat.js';
import { updateSummary }          from './summary.js';
import { showToast }              from './utils.js';

window.generatePDF = generatePDF;
window.resetAll    = resetAll;

function resetAll() {
  COMP_KEYS.forEach(key => {
    sel[key] = null;
    const k  = key.replace(/ /g, "_");
    document.getElementById(`sel-${k}`).value = "";
    hideMeta(k);
  });
  _compat();
  updateSummary();
  updateTotal();
  showToast("↺ Selección reiniciada");
}

// Init
buildCards();
updateTotal();