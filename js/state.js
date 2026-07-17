export const COMP_KEYS = [
  "PLACA MADRE","PROCESADOR","COOLER",
  "MEMORIA RAM","SSD","GPU","FUENTE","GABINETE"
];

export const ICONS = {
  "PLACA MADRE":"👽","PROCESADOR":"👽","COOLER":"👽",
  "MEMORIA RAM":"👽","SSD":"👽","GPU":"👽","FUENTE":"👽","GABINETE":"👽"
};

export const WA_NUMBER  = "56921816067";
export const STORE_NAME = "Invasión Gamer";
export const ASSEMBLY_FEE = 50000;

export const INSURANCE_TIERS = [
  { id: "insurance-1y", title: "1 año", description: "Seguro básico", price: 30000 },
  { id: "insurance-2y", title: "2 años", description: "Seguro extendido", price: 60000 },
  { id: "insurance-3y", title: "3 años", description: "Seguro premium", price: 90000 }
];

export const sel = {};
COMP_KEYS.forEach(k => sel[k] = null);

export const insuranceState = { tierId: null };