export const COMP_KEYS = [
  "PLACA MADRE","PROCESADOR","COOLER",
  "MEMORIA RAM","SSD","GPU","FUENTE","GABINETE"
];

export const ICONS = {
  "PLACA MADRE":"🧩","PROCESADOR":"🧠","COOLER":"❄️",
  "MEMORIA RAM":"📚","SSD":"💾","GPU":"🎮","FUENTE":"🔌","GABINETE":"🗄️"
};

export const WA_NUMBER  = "56921816067";
export const STORE_NAME = "Invasión Gamer";
export const ASSEMBLY_FEE = 50000;

export const INSURANCE_TIERS = [
  { id: "insurance-1y", title: "1 año", description: "Garantía Standard", price: 0 },
  { id: "insurance-2y", title: "2 años", description: "Garantía SWOP+", price: 129990 },
  { id: "insurance-3y", title: "3 años", description: "Garantía SWOP+", price: 219900 }
];

export const sel = {};
COMP_KEYS.forEach(k => sel[k] = null);

export const insuranceState = { tierId: null };