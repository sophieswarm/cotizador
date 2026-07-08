import { sel } from './state.js';
import { renderAlerts } from './utils.js';


function checkMBCPU(pm, cpu, alerts) {
  if (!pm || !cpu) return;
  if (pm.socket !== cpu.socket)
    alerts.push({ type:"danger", msg:`<b>Incompatibilidad de socket:</b> La placa madre usa socket <b>${pm.socket}</b> pero el procesador requiere <b>${cpu.socket}</b>. No son compatibles.` });
}

function checkRamMB(pm, ram, alerts) {
  if (!pm || !ram || !pm.ddr) return;
  if (!pm.ddr.includes(ram.type))
    alerts.push({ type:"danger", msg:`<b>Incompatibilidad de RAM:</b> La placa madre soporta <b>${pm.ddr}</b> pero la memoria seleccionada es <b>${ram.type}</b>.` });
}

function checkPSUGPUCPU(psu, gpu, cpu, alerts) {
  if (!psu || !gpu) return;
  if (cpu) {
    const estimatedWatt = gpu.watt + cpu.tdp + 100;
    const recommended   = Math.ceil(estimatedWatt * 1.2 / 50) * 50;
    if (psu.watts < estimatedWatt)
      alerts.push({ type:"danger", msg:`<b>Fuente insuficiente:</b> CPU + GPU + sistema requieren ~${estimatedWatt}W pero tu fuente solo entrega <b>${psu.watts}W</b>. Recomendamos al menos <b>${recommended}W</b>.` });
    else if (psu.watts < recommended)
      alerts.push({ type:"warn", msg:`<b>Margen de potencia ajustado:</b> La fuente de <b>${psu.watts}W</b> es suficiente, pero recomendamos ${recommended}W para mayor seguridad.` });
  } else {
    if (psu.watts < gpu.watt + 100)
      alerts.push({ type:"warn", msg:`<b>Verificá la potencia:</b> La GPU consume ${gpu.watt}W. Con el sistema completo podría necesitar más de ${psu.watts}W.` });
  }
}

function checkCoolerCPU(cooler, cpu, alerts) {
  if (!cooler || !cpu || !cooler.socket) return;
  const sockets = cooler.socket.split(",").map(s => s.trim());
  if (!sockets.includes(cpu.socket))
    alerts.push({ type:"danger", msg:`<b>Incompatibilidad de cooler:</b> El cooler no es compatible con el socket <b>${cpu.socket}</b> del procesador.` });
}

function checkCaseMB(gab, pm, alerts) {
  if (!gab || !pm || !gab.formFactor) return;
  const formats = gab.formFactor.split(",").map(s => s.trim());
  if (!formats.includes(pm.formFactor))
    alerts.push({ type:"danger", msg:`<b>Gabinete incompatible:</b> El gabinete no soporta el formato <b>${pm.formFactor}</b> de la placa madre.` });
}


function checkGenCompat(selected, alerts) {
  const components = Object.values(selected).filter(Boolean);
  if (components.length < 3) return;

  const gradeOrder = { "BAJO": 1, "MEDIO": 2, "ALTO": 3, "SUPERIOR": 4 };

  const graded = components.filter(c => c.grade && gradeOrder[c.grade]);
  if (graded.length < 3) return;

  const gradeCounts = { "BAJO": [], "MEDIO": [], "ALTO": [], "SUPERIOR": [] };
  graded.forEach(c => gradeCounts[c.grade].push(c.name));

  const highEnd   = [...gradeCounts.ALTO, ...gradeCounts.SUPERIOR];
  const lowEnd    = [...gradeCounts.BAJO];
  const total     = graded.length;

  if (highEnd.length >= Math.floor(total * 0.5) && lowEnd.length >= 1) {
    const names = lowEnd.map(n => `<b>${n}</b>`).join(", ");
    alerts.push({ type:"warn", msg:`<b>Cuello de botella:</b> ${names} ${lowEnd.length > 1 ? "son componentes" : "es un componente"} de gama baja que podrían limitar el rendimiento del resto del equipo de gama alta.` });

  } else if (lowEnd.length >= Math.floor(total * 0.5) && highEnd.length >= 1) {
    const names = highEnd.map(n => `<b>${n}</b>`).join(", ");
    alerts.push({ type:"warn", msg:`<b>Componentes desaprovechados:</b> ${names} ${highEnd.length > 1 ? "son componentes" : "es un componente"} de gama alta que podrían estar siendo limitados por el resto del equipo de gama baja.` });
  }
}
export function getSelected() {
  return {
    pm:     sel["PLACA MADRE"],
    cpu:    sel["PROCESADOR"],
    ram:    sel["MEMORIA RAM"],
    ssd:    sel["SSD"],
    psu:    sel["FUENTE"],
    gpu:    sel["GPU"],
    cooler: sel["COOLER"],
    gab:    sel["GABINETE"],
  };
}

export function checkCompat(){
  const alerts= [];
  const { pm, cpu, ram, psu, gpu, cooler, ssd, gab } = getSelected();
  checkMBCPU(pm, cpu, alerts);
  checkRamMB(pm, ram, alerts);
  checkPSUGPUCPU(psu, gpu, cpu, alerts);
  checkCoolerCPU(cooler, cpu, alerts);
  checkCaseMB(gab, pm, alerts);
  checkGenCompat({ pm, cpu, ram, psu, gpu, cooler, ssd, gab }, alerts);
  renderAlerts(alerts);

}