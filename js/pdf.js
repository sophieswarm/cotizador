
import { sel, COMP_KEYS, WA_NUMBER, STORE_NAME } from './state.js';
import { getQuoteTotal, getSelectedInsuranceTier } from './pricing.js';
import { fmt, renderAlerts } from './utils.js';


export async function generatePDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit:"mm", format:"a4" });
  const W = 210, M = 18;
  let y = 0;
  const insuranceTier = getSelectedInsuranceTier();


  const COLOR_ACCENT = [54, 170, 175];
  const COLOR_ACCENT_DARK = [0, 33, 84];
  const COLOR_TEXT = [0, 0, 0];
  const COLOR_MUTED = [136, 146, 164];
  const COLOR_BORDER = [229, 229, 229];
  const COLOR_SURFACE = [241, 241, 241];

  doc.setFillColor(...COLOR_ACCENT_DARK);
  doc.rect(0, 0, W, 46, "F");

 doc.setFont("helvetica","bold");
  doc.setFontSize(22);
  doc.setTextColor(255, 255, 255);
  doc.text("COTIZACIÓN PC GAMER", M, 22);

  doc.setFont("helvetica","normal");
  doc.setFontSize(10);
  doc.setTextColor(224, 234, 255);
  doc.text(STORE_NAME, M, 31);

  const dateStr = new Date().toLocaleDateString("es-CL", { day:"2-digit", month:"2-digit", year:"numeric" });
  const cotNum  = `COT-${Date.now().toString().slice(-6)}`;
  doc.setTextColor(...COLOR_ACCENT);
  doc.text(`Fecha: ${dateStr}`, W - M, 22, { align:"right" });
  doc.text(`N°: ${cotNum}`,     W - M, 31, { align:"right" });

  y = 55;

  doc.setFont("helvetica","bold");
  doc.setFontSize(8.5);
  doc.setTextColor(...COLOR_ACCENT_DARK);
  doc.setFillColor(...COLOR_SURFACE);
  doc.rect(M, y - 5, W - M * 2, 9, "F");
  doc.setDrawColor(...COLOR_BORDER);
  doc.rect(M, y - 5, W - M * 2, 9, "S");
  doc.text("COMPONENTE", M + 3,  y);
  doc.text("PRODUCTO",   M + 55, y);
  y += 6;

  COMP_KEYS.forEach((key, i) => {
    const item = sel[key];
    if (!item) return;

    doc.setFillColor(...(i % 2 === 0 ? [255, 255, 255] : [250, 250, 250]));
    doc.rect(M, y - 4.5, W - M * 2, 9, "F");
    doc.setDrawColor(...COLOR_BORDER);
    doc.rect(M, y - 4.5, W - M * 2, 9, "S");

    doc.setFont("helvetica","bold");   doc.setFontSize(7.5); doc.setTextColor(...COLOR_ACCENT_DARK);
    doc.text(key, M + 3, y);
    doc.setFont("helvetica","normal"); doc.setTextColor(...COLOR_TEXT);

    let nameStr = item.name;
    while (doc.getStringUnitWidth(nameStr) * 7.5 * 0.352 > 130 && nameStr.length > 10)
      nameStr = nameStr.slice(0, -4) + "…";
    doc.text(nameStr, M + 55, y);
    y += 10;
  });

  doc.setFillColor(255, 255, 255);
  doc.rect(M, y - 4.5, W - M * 2, 9, "F");
  doc.setDrawColor(...COLOR_BORDER);
  doc.rect(M, y - 4.5, W - M * 2, 9, "S");

  doc.setFont("helvetica","bold");   doc.setFontSize(7.5); doc.setTextColor(...COLOR_ACCENT_DARK);
  doc.text("GARANTÍA", M + 3, y);
  doc.setFont("helvetica","normal"); doc.setTextColor(...COLOR_TEXT);
  doc.text(
    insuranceTier
      ? `${insuranceTier.title} · ${insuranceTier.description}`
      : "Garantía Standard",
    M + 55,
    y
  );
  y += 10;

  y += 4;
  const total = getQuoteTotal();
  doc.setFillColor(...COLOR_SURFACE);
  doc.rect(M, y - 5, W - M * 2, 13, "F");
  doc.setDrawColor(...COLOR_ACCENT);
  doc.rect(M, y - 5, W - M * 2, 13, "S");
  doc.setFont("helvetica","bold"); doc.setFontSize(12); doc.setTextColor(...COLOR_ACCENT_DARK);
  doc.text("TOTAL ESTIMADO", M + 3, y + 3);
  doc.setTextColor(...COLOR_ACCENT); doc.setFontSize(14);
  doc.text(fmt(total), W - M - 2, y + 3, { align:"right" });

  y += 24;
  doc.setFont("helvetica","italic"); doc.setFontSize(8); doc.setTextColor(...COLOR_MUTED);
  doc.text("* Esta cotización es referencial y está sujeta a disponibilidad de stock.", M, y);
  doc.text("* Los precios no incluyen servicio de armado. Consultar por costo adicional.", M, y + 5);
  doc.text("* Válido por 72 horas desde la fecha de emisión.", M, y + 10);

  doc.setFillColor(...COLOR_ACCENT_DARK);
  doc.rect(0, 282, W, 15, "F");
  doc.setFont("helvetica","normal"); doc.setFontSize(8); doc.setTextColor(224, 234, 255);
  doc.text(`${STORE_NAME} · whatsapp.me/${WA_NUMBER}`, W / 2, 290, { align:"center" });

  doc.save(`Cotizacion_PC_Gamer_${cotNum}.pdf`);
  renderAlerts([{ type: "warn", msg: "Cotización descargada" }], { append: true, autoDismiss: 2800 });
}