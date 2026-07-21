import { fmt } from './utils.js';
import { getInsuranceTierOptions, getSelectedInsuranceTier, setSelectedInsuranceTier } from './pricing.js';

let onInsuranceChange = null;

export function buildInsuranceOptions(onChange) {
  const container = document.getElementById('insurance-box');
  if (!container) return;

  onInsuranceChange = onChange ?? null;

  if (!container.dataset.bound) {
    container.addEventListener('click', (event) => {
      const button = event.target.closest('.insurance-tier');
      if (!button) return;

      const selectedTier = getSelectedInsuranceTier();
      setSelectedInsuranceTier(selectedTier?.id === button.dataset.tierId ? null : button.dataset.tierId);

      renderInsuranceOptions();
      onInsuranceChange?.();
    });
    container.dataset.bound = 'true';
  }

  renderInsuranceOptions();
}

export function resetInsuranceSelection() {
  setSelectedInsuranceTier(null);
  renderInsuranceOptions();
}

function renderInsuranceOptions() {
  const container = document.getElementById('insurance-box');
  if (!container) return;

  const selectedTierId = getSelectedInsuranceTier()?.id ?? null;
  const tiers = getInsuranceTierOptions().map((tier) => {
    const selectedClass = tier.id === selectedTierId ? ' selected' : '';
    return `
      <button type="button" class="insurance-tier${selectedClass}" data-tier-id="${tier.id}">
        <span class="insurance-tier-title">${tier.title}</span>
        <span class="insurance-tier-description">${tier.description}</span>
        <span class="insurance-tier-price">${fmt(tier.price)}</span>
      </button>`;
  }).join('');

  container.innerHTML = `
    <div class="insurance-grid">${tiers}</div>
    <a
      class="insurance-help-link"
      href="https://invasiongamer.com/garantia-swop"
      target="_blank"
      rel="noopener"
    >
      Conoce más sobre SWOP+
    </a>`;
}