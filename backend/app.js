import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { fetchSheet } from './service.js';
const app = express();

app.use(cors({
  origin: ['https://sophieswarm.github.io/', 'http://localhost:5500']
}));

app.get('/sheet', async (req, res) => {
  try {
    const [placaMadre, procesador, cooler, memoriaRam, ssd, gpu, fuente, gabinete] = await Promise.all([
      fetchSheet(process.env.GID_PLACA_MADRE),
      fetchSheet(process.env.GID_PROCESADOR),
      fetchSheet(process.env.GID_COOLER),
      fetchSheet(process.env.GID_MEMORIA_RAM),
      fetchSheet(process.env.GID_SSD),
      fetchSheet(process.env.GID_GPU),
      fetchSheet(process.env.GID_FUENTE),
      fetchSheet(process.env.GID_GABINETE),
    ]);
    res.set('Cache-Control', 's-maxage=60, stale-while-revalidate=30');
    res.json({ placaMadre, procesador, cooler, memoriaRam, ssd, gpu, fuente, gabinete });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener datos del sheet' });
  }
});


app.listen(process.env.PORT || 3000);