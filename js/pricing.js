import { ASSEMBLY_FEE, COMP_KEYS, INSURANCE_TIERS, insuranceState, sel } from './state.js';

export function getComponentCount() {
  return COMP_KEYS.filter(key => Boolean(sel[key])).length;
}

export function areAllComponentsSelected() {
  return COMP_KEYS.every(key => Boolean(sel[key]));
}

export function getBaseTotal() {
  return COMP_KEYS.reduce((sum, key) => sum + (sel[key]?.price || 0), 0);
}

export function getInsuranceTierOptions() {
  return INSURANCE_TIERS;
}

export function getSelectedInsuranceTier() {
  return INSURANCE_TIERS.find(tier => tier.id === insuranceState.tierId) ?? null;
}

export function setSelectedInsuranceTier(tierId) {
  insuranceState.tierId = tierId;
}

export function getInsuranceTotal() {
  return getSelectedInsuranceTier()?.price || 0;
}

export function getQuoteTotal() {
  const baseTotal = getBaseTotal();
  if (!areAllComponentsSelected()) return baseTotal;

  return baseTotal + ASSEMBLY_FEE + getInsuranceTotal();
}