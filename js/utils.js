export function fmt(n) {
  return "$" + n.toLocaleString("es-CL");
}

//alertas
export function renderAlerts(alerts, options = {}) {
  const { append = false, autoDismiss = 0 } = options;
  const container = document.getElementById("compat-alerts");
  if (!container) return;

  if (!append) container.innerHTML = "";

  alerts.forEach(a => {
    const alert = document.createElement("div");
    alert.className = `alert alert-${a.type}`;
    alert.innerHTML = `<span class="alert-icon">${a.type === "danger" ? "🔴" : "🟡"}</span><div>${a.msg}</div>`;
    if (append) container.insertAdjacentElement("afterbegin", alert);
    else container.appendChild(alert);

    if (autoDismiss > 0) {
      setTimeout(() => {
        if (alert.parentNode) alert.parentNode.removeChild(alert);
      }, autoDismiss);
    }
  });
}

