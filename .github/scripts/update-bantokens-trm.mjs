const sourceUrl = 'https://dolar.wilkinsonpc.com.co/';
const response = await fetch(sourceUrl, {
  headers: { 'user-agent': 'GRUPODGH-exchange-buy-rate-updater/1.0 (+https://github.com/adelgallego/cuentas-grupodgh)' },
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

const quoteIndex = text.search(/Te lo compran/i);
const quote = quoteIndex >= 0 ? text.slice(quoteIndex, quoteIndex + 160).match(/Te lo compran\s*\$?\s*([\d.,]+)/i) : null;
if (!quote) throw new Error('No se encontró la cotización “Te lo compran” de casas de cambio.');

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
const purchaseRateCopPerUsd = Number(normalizedRate);
if (!Number.isFinite(purchaseRateCopPerUsd) || purchaseRateCopPerUsd < 1000 || purchaseRateCopPerUsd > 10000) {
  throw new Error(`Valor “Te lo compran” inválido: ${rawRate}`);
}

const beforeQuote = text.slice(Math.max(0, quoteIndex - 500), quoteIndex);
const validDate = beforeQuote.match(/(\d{1,2} de [a-záéíóú]+(?: de \d{4})?)(?: \([^)]*\))?\s*(?:Prima)?\s*$/i)?.[1]?.trim() ?? '';
const result = {
  source: sourceUrl,
  sourceLabel: 'Wilkinsonpc · Casas de Cambio · Te lo compran',
  purchaseRateCopPerUsd,
  validDate,
  fetchedAt: new Date().toISOString(),
};
await import('node:fs/promises').then(({ writeFile, mkdir }) => mkdir('data', { recursive: true }).then(() => writeFile('data/bantokens-trm.json', `${JSON.stringify(result, null, 2)}\n`)));
console.log(`Promedio “Te lo compran”: ${purchaseRateCopPerUsd} COP/USD; fecha ${validDate || 'sin fecha'}.`);
