const sourceUrl = 'https://dolar.wilkinsonpc.com.co/';
const deductionCop = 50;

const response = await fetch(sourceUrl, {
  headers: { 'user-agent': 'GRUPODGH-TRM-updater/1.0 (+https://github.com/adelgallego/cuentas-grupodgh)' },
  signal: AbortSignal.timeout(20000),
});
if (!response.ok) throw new Error(`Wilkinsonpc respondió HTTP ${response.status}.`);

const html = await response.text();
const text = html
  .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')
  .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ')
  .replace(/<[^>]+>/g, ' ')
  .replace(/&#(\d+);/g, (_, value) => String.fromCodePoint(Number(value)))
  .replace(/&#x([\da-f]+);/gi, (_, value) => String.fromCodePoint(parseInt(value, 16)))
  .replace(/&nbsp;|&#160;/gi, ' ')
  .replace(/&amp;/gi, '&')
  .replace(/\s+/g, ' ');

const quote = text.match(/Esta es la TRM vigente[\s\S]{0,350}?\$\s*([\d.,]+)/i);
if (!quote) throw new Error('No se encontró la frase oficial de TRM vigente en la página.');

const rawRate = quote[1];
let normalizedRate;
if (rawRate.includes(',') && rawRate.includes('.')) {
  normalizedRate = rawRate.lastIndexOf(',') > rawRate.lastIndexOf('.')
    ? rawRate.replace(/\./g, '').replace(',', '.')
    : rawRate.replace(/,/g, '');
} else if (rawRate.includes(',')) {
  normalizedRate = /,\d{1,2}$/.test(rawRate) ? rawRate.replace(',', '.') : rawRate.replace(/,/g, '');
} else {
  normalizedRate = /\.\d{1,2}$/.test(rawRate) ? rawRate : rawRate.replace(/\./g, '');
}
const trmRate = Number(normalizedRate);
if (!Number.isFinite(trmRate) || trmRate <= deductionCop) throw new Error(`Valor TRM inválido: ${rawRate}`);

const validDate = text.match(/Esta es la TRM vigente del\s+([^,.]{4,70})/i)?.[1]?.trim() ?? '';
const result = {
  source: sourceUrl,
  trmRate,
  deductionCop,
  bantokensRate: Number((trmRate - deductionCop).toFixed(2)),
  validDate,
  fetchedAt: new Date().toISOString(),
};

await import('node:fs/promises').then(({ writeFile, mkdir }) => mkdir('data', { recursive: true }).then(() => writeFile('data/bantokens-trm.json', `${JSON.stringify(result, null, 2)}\n`)));
console.log(`TRM ${trmRate}; BANTOKENS ${result.bantokensRate} COP/USD; vigencia ${validDate || 'sin fecha'}.`);
