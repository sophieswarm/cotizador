import { COMP_KEYS, STORE_NAME, WA_NUMBER, sel } from './state.js';
import { areAllComponentsSelected, getQuoteTotal, getSelectedInsuranceTier } from './pricing.js';
import { fmt } from './utils.js';



export function buildComponentQuoteLines() {
  return COMP_KEYS.map((key) =>
    `• ${key}: ${sel[key].name} (${sel[key].sku}) — ${fmt(sel[key].price)}`
  ).join('\n');
}

export function buildInsuranceQuoteLine() {
  const insuranceTier = getSelectedInsuranceTier();
  if (!insuranceTier) return '';

  return `\n• Seguro ${insuranceTier.title}: ${insuranceTier.description} — ${fmt(insuranceTier.price)}`;
}

export function buildWhatsAppHref() {
  if (!areAllComponentsSelected()) return null;

  const msg = encodeURIComponent(
    `Hola ${STORE_NAME}! Quiero cotizar el siguiente PC Gamer:\n\n${buildComponentQuoteLines()}${buildInsuranceQuoteLine()}\n\n*TOTAL: ${fmt(getQuoteTotal())}*\n\nPor favor confirmame disponibilidad y datos de pago 🙏`
  );

  return `https://wa.me/${WA_NUMBER}?text=${msg}`;
}

export function buildContactWhatsAppHref() {
  const msg = encodeURIComponent(
    `Hola ${STORE_NAME}, no encuentro el componente que estoy buscando. ¿Me pueden ayudar con disponibilidad o alternativas?`
  );

  return `https://wa.me/${WA_NUMBER}?text=${msg}`;
}