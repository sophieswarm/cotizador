const SHEET_ID = process.env.SHEET_ID;


export async function fetchSheet(gid) {
  try {
    const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&gid=${gid}#gid=${gid}`;
    console.log('Fetching:', url); 
    
    const res  = await fetch(url);
    console.log('Status:', res.status); 
    
    const text = await res.text();
    console.log('Response:', text.slice(0, 200)); 

    const match = text.match(/google\.visualization\.Query\.setResponse\(([\s\S]*?)\);/);
    if (!match) throw new Error('no match');

    const json    = JSON.parse(match[1]);
    const headers = json.table.cols.map(col => col.label);
    return json.table.rows.map(row =>
      Object.fromEntries(headers.map((h, i) => [h, row.c[i]?.v ?? null]))
    );
  } catch (err) {
    console.error(`error on "${gid}":`, err.message);
    throw err; 
  }
}