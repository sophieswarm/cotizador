
import { sel, COMP_KEYS, WA_NUMBER, STORE_NAME } from './state.js';
import { fmt }  from './utils.js';
import { showToast } from './utils.js';

export async function generatePDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit:"mm", format:"a4" });
  const W = 210, M = 18;
  let y = 0;

  doc.setFillColor(10, 10, 18);
  doc.rect(0, 0, W, 52, "F");

 doc.setFont("helvetica","bold");
  doc.setFontSize(22);
  doc.setTextColor(255, 255, 255);
  doc.text("COTIZACIÓN PC GAMER", M, 22);

  doc.setFont("helvetica","normal");
  doc.setFontSize(10);
  doc.setTextColor(136, 146, 164);
  doc.text(STORE_NAME, M, 31);

  const dateStr = new Date().toLocaleDateString("es-CL", { day:"2-digit", month:"2-digit", year:"numeric" });
  const cotNum  = `COT-${Date.now().toString().slice(-6)}`;
  doc.setTextColor(0, 212, 255);
  doc.text(`Fecha: ${dateStr}`, W - M, 22, { align:"right" });
  doc.text(`N°: ${cotNum}`,     W - M, 31, { align:"right" });

  y = 60;

  doc.setFont("helvetica","bold");
  doc.setFontSize(8);
  doc.setTextColor(0, 212, 255);
  doc.setFillColor(26, 26, 46);
  doc.rect(M, y - 5, W - M * 2, 9, "F");
  doc.text("COMPONENTE", M + 3,  y);
  doc.text("SKU",        M + 52, y);
  doc.text("PRODUCTO",   M + 75, y);
  doc.text("PRECIO",     W - M - 2, y, { align:"right" });
  y += 6;

  COMP_KEYS.forEach((key, i) => {
    const item = sel[key];
    if (!item) return;

    doc.setFillColor(...(i % 2 === 0 ? [18,18,30] : [22,33,62]));
    doc.rect(M, y - 4.5, W - M * 2, 9, "F");

    doc.setFont("helvetica","bold");   doc.setFontSize(7.5); doc.setTextColor(200, 200, 220);
    doc.text(key, M + 3, y);
    doc.setFont("helvetica","normal"); doc.setTextColor(160, 170, 195);
    doc.text(item.sku, M + 52, y);

    let nameStr = item.name;
    while (doc.getStringUnitWidth(nameStr) * 7.5 * 0.352 > 57 && nameStr.length > 10)
      nameStr = nameStr.slice(0, -4) + "…";
    doc.text(nameStr, M + 75, y);

    doc.setFont("helvetica","bold"); doc.setTextColor(0, 212, 255);
    doc.text(fmt(item.price), W - M - 2, y, { align:"right" });
    y += 10;
  });

  y += 4;
  const total = COMP_KEYS.reduce((s, k) => s + (sel[k]?.price || 0), 0);
  doc.setFillColor(26, 26, 46);
  doc.rect(M, y - 5, W - M * 2, 13, "F");
  doc.setDrawColor(0, 212, 255);
  doc.rect(M, y - 5, W - M * 2, 13, "S");
  doc.setFont("helvetica","bold"); doc.setFontSize(12); doc.setTextColor(255, 255, 255);
  doc.text("TOTAL ESTIMADO", M + 3, y + 3);
  doc.setTextColor(0, 212, 255); doc.setFontSize(14);
  doc.text(fmt(total), W - M - 2, y + 3, { align:"right" });

  y += 24;
  doc.setFont("helvetica","italic"); doc.setFontSize(8); doc.setTextColor(100, 110, 130);
  doc.text("* Esta cotización es referencial y está sujeta a disponibilidad de stock.", M, y);
  doc.text("* Los precios no incluyen servicio de armado. Consultar por costo adicional.", M, y + 5);
  doc.text("* Válido por 72 horas desde la fecha de emisión.", M, y + 10);

  doc.setFillColor(10, 10, 18);
  doc.rect(0, 282, W, 15, "F");
  doc.setFont("helvetica","normal"); doc.setFontSize(8); doc.setTextColor(80, 90, 110);
  doc.text(`${STORE_NAME} · whatsapp.me/${WA_NUMBER}`, W / 2, 290, { align:"center" });

  doc.save(`Cotizacion_PC_Gamer_${cotNum}.pdf`);
  showToast("📄 Cotización descargada correctamente");
}