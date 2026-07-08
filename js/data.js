const SHEET_URL= "http://localhost:3000/sheet";

export async function getSheetData() {
  try {
    const response = await fetch(SHEET_URL);
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error: ${error}`);
    return null;
  }
}

function normalizeSheet(rows) {
  return rows.map(row => {
    const priceKey = Object.keys(row).find(k => k.includes("VALOR"));
    return {
      sku:         row.SKU,
      name:        row.PRODUCTO,
      price:       row[priceKey],
      stock:       row.STOCK,
      socket:      row.SOCKET,
      ddr:         row.DDR,
      formFactor:  row.FOR,
      tdp:         row.TDP,
      chipset:     row.CHIPSET,
      tdpCapacity: row["TDP CAPACITY"],
      type:        row.TYPE,
      watt:        row.WATT,
      vram:        row.VRAM,
      watts:       row.WATTS,
      rating:      row.RATING,
      grade:      row.GRADO,
      image:      row.IMAGEN,

    };
  });
}

const raw = await getSheetData() ?? {};


export const DATA = {
  "PLACA MADRE":  normalizeSheet(raw.placaMadre  ?? []),
  "PROCESADOR":   normalizeSheet(raw.procesador  ?? []),
  "COOLER":       normalizeSheet(raw.cooler      ?? []),
  "MEMORIA RAM":  normalizeSheet(raw.memoriaRam  ?? []),
  "SSD":          normalizeSheet(raw.ssd         ?? []),
  "GPU":          normalizeSheet(raw.gpu         ?? []),
  "FUENTE":       normalizeSheet(raw.fuente      ?? []),
  "GABINETE":     normalizeSheet(raw.gabinete    ?? []),
};

