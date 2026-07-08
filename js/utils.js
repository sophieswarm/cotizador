export function fmt(n) {
  return "$" + n.toLocaleString("es-CL");
}

export function showToast(msg) {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 2800);
}

export function showCompatAlert(msg, type = "warn") {
  const container = document.getElementById("compat-alerts");
  if (!container) return;
  const alert = document.createElement("div");
  alert.className = `alert alert-${type}`;
  alert.innerHTML = `<span class="alert-icon">${type === "danger" ? "🔴" : "🟡"}</span><div>${msg}</div>`;
  container.insertAdjacentElement("afterbegin", alert);
  setTimeout(() => {
    if (alert.parentNode) alert.parentNode.removeChild(alert);
  }, 2800);
}