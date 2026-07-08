import { fmt } from './utils.js';

export function hideMeta(k) {
  document.getElementById(`meta-${k}`).style.display = "none";
}

export function showMeta(k, item) {
  document.getElementById(`meta-${k}`).style.display = "flex";
  document.getElementById(`price-${k}`).textContent = fmt(item.price);

  const stEl = document.getElementById(`stock-${k}`);
  if (item.stock <= 3)
    { stEl.className = "comp-stock low"; stEl.innerHTML = `<span class="dot"></span> Pocas unidades (${item.stock})`; }

}