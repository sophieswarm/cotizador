import { DATA } from './data.js';
import { COMP_KEYS } from './state.js';

function getProductVendor(name) {
  if (!name) return null;

  const normalized = String(name).toUpperCase();
  if (normalized.includes("AMD")) return "AMD";
  if (normalized.includes("INTEL")) return "INTEL";
  return null;
}

export function getVendorFromSelection(selection = {}) {
  return getProductVendor(selection["PLACA MADRE"]?.name);
}

export function getFilteredProducts(key, selection = {}, vendorFilter = null) {
  const selectedVendor = vendorFilter && vendorFilter !== "ALL"
    ? vendorFilter
    : null;

  const shouldFilter = selectedVendor && (key === "PLACA MADRE" || key === "PROCESADOR");

  if (!shouldFilter) return DATA[key];
  return DATA[key].filter(item => getProductVendor(item.name) === selectedVendor);
}

export function getFilteredProductsMap(selection = {}) {
  return Object.fromEntries(
    COMP_KEYS.map(key => [key, getFilteredProducts(key, selection)])
  );
}
