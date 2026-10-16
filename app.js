(() => {
  const STORAGE_KEY = 'cuenta-clara-v1';
  const THEME_KEY = 'cuenta-clara-theme';
  const TIFFANY_SHARE_MIGRATION_KEY = 'grupodgh-tiffany-share-80-v1';
  const TWL_OWNER_FEE_RATE = 0.10;
  const TRM_RATE_URL = './data/bantokens-trm.json';
  const ACCENT_KEY = 'grupodgh-accent-color';
  const TEXT_SIZE_KEY = 'grupodgh-text-size';
  const $ = (selector) => document.querySelector(selector);
  let savedTheme = 'light';
  try { savedTheme = localStorage.getItem(THEME_KEY) || 'light'; } catch { /* Keep the default theme when browser storage is unavailable. */ }
  document.documentElement.dataset.theme = savedTheme === 'dark' ? 'dark' : 'light';
  let savedTextSize = 100;
  try {
    const storedTextSize = Number(localStorage.getItem(TEXT_SIZE_KEY));
    if ([100, 110, 120, 130, 140].includes(storedTextSize)) savedTextSize = storedTextSize;
  } catch { /* Keep the default text size when browser storage is unavailable. */ }
  document.documentElement.style.setProperty('--app-zoom', String(savedTextSize / 100));
  let savedAccent = '';
  try {
    const storedAccent = localStorage.getItem(ACCENT_KEY) || '';
    if (/^#[\da-f]{6}$/i.test(storedAccent)) savedAccent = storedAccent;
  } catch { /* Keep the default accent when browser storage is unavailable. */ }
  const hexRgb = (hex) => hex.match(/[\da-f]{2}/gi).map((part) => parseInt(part, 16));
  const rgbHex = (rgb) => `#${rgb.map((part) => Math.round(part).toString(16).padStart(2, '0')).join('')}`;
  const blendHex = (front, back, amount) => rgbHex(hexRgb(front).map((value, index) => value * amount + hexRgb(back)[index] * (1 - amount)));
  function applyAccentColor(color) {
    const root = document.documentElement;
    const dark = root.dataset.theme === 'dark';
    const surface = dark ? '#1b2330' : '#ffffff';
    const rgb = hexRgb(color);
    root.style.setProperty('--user-accent', color);
    root.style.setProperty('--user-accent-dark', blendHex(color, dark ? '#0b1020' : '#172033', 0.2));
    root.style.setProperty('--user-accent-soft', blendHex(color, surface, dark ? 0.2 : 0.1));
    root.style.setProperty('--user-accent-softer', blendHex(color, surface, dark ? 0.12 : 0.05));
    root.style.setProperty('--user-accent-border', blendHex(color, dark ? '#303949' : '#e9edf3', dark ? 0.58 : 0.28));
    root.style.setProperty('--user-accent-focus', blendHex(color, dark ? '#c0b5ff' : '#a497ec', 0.45));
    root.style.setProperty('--user-accent-glow', `rgba(${rgb.join(', ')}, .14)`);
    root.style.setProperty('--user-accent-contrast', rgb[0] * 0.2126 + rgb[1] * 0.7152 + rgb[2] * 0.0722 > 158 ? '#172033' : '#ffffff');
    const swatch = $('#accentSwatch');
    if (swatch) swatch.style.backgroundColor = color;
  }
  if (savedAccent) applyAccentColor(savedAccent);
  const defaults = { rates: { usdPerToken: { stripchat: 0.05, chaturbate: 0.05 }, copPerUsdByProvider: { bantokens: '', twl: '', usdt: '' } }, models: [], entries: [] };
  const modelIdRemap = {};
  let state;
  try {
    state = { ...defaults, ...JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') };
    const oldRates = state.rates || {};
    const legacyTokensPerUsd = Number(oldRates.tokensPerUsd) || 0;
    const legacyCopPerUsd = oldRates.copPerUsd ?? '';
    state.rates = { ...defaults.rates, ...oldRates };
    state.rates.usdPerToken = oldRates.usdPerToken && typeof oldRates.usdPerToken === 'object'
      ? { ...defaults.rates.usdPerToken, ...oldRates.usdPerToken }
      : { stripchat: legacyTokensPerUsd > 0 ? 1 / legacyTokensPerUsd : 0.05, chaturbate: legacyTokensPerUsd > 0 ? 1 / legacyTokensPerUsd : 0.05 };
    state.rates.copPerUsdByProvider = oldRates.copPerUsdByProvider && typeof oldRates.copPerUsdByProvider === 'object'
      ? { ...defaults.rates.copPerUsdByProvider, ...oldRates.copPerUsdByProvider }
      : { bantokens: legacyCopPerUsd, twl: legacyCopPerUsd };
    const importedModels = Array.isArray(state.models) ? state.models : [];
    const modelsByName = new Map();
    state.models = [];
    for (const source of importedModels) {
      const platform = source.platform || 'both';
      const oldShare = Number(source.sharePct);
      const percentages = source.sharePctByPlatform && typeof source.sharePctByPlatform === 'object'
        ? { stripchat: Number(source.sharePctByPlatform.stripchat) || 0, chaturbate: Number(source.sharePctByPlatform.chaturbate) || 0 }
        : {
            stripchat: platform === 'chaturbate' ? 0 : (Number.isFinite(oldShare) ? oldShare : 0),
            chaturbate: platform === 'stripchat' ? 0 : (Number.isFinite(oldShare) ? oldShare : 0),
          };
      const oldDiscount = Number(source.copDiscountPerUsd) || 0;
      const discounts = source.copDiscountByPlatform && typeof source.copDiscountByPlatform === 'object'
        ? { stripchat: Number(source.copDiscountByPlatform.stripchat) || 0, chaturbate: Number(source.copDiscountByPlatform.chaturbate) || 0 }
        : {
            stripchat: platform === 'chaturbate' ? 0 : oldDiscount,
            chaturbate: platform === 'stripchat' ? 0 : oldDiscount,
          };
      const normalized = { ...source, platform: 'both', sharePctByPlatform: percentages };
      normalized.copDiscountByPlatform = discounts;
      const key = String(normalized.name || '').trim().toLocaleLowerCase();
      const existing = modelsByName.get(key);
      if (!existing) {
        state.models.push(normalized);
        modelsByName.set(key, normalized);
        modelIdRemap[normalized.id] = normalized.id;
      } else {
        if (platform === 'stripchat') existing.sharePctByPlatform.stripchat = percentages.stripchat;
        else if (platform === 'chaturbate') existing.sharePctByPlatform.chaturbate = percentages.chaturbate;
        else {
          existing.sharePctByPlatform.stripchat = percentages.stripchat;
          existing.sharePctByPlatform.chaturbate = percentages.chaturbate;
        }
        if (platform === 'stripchat') existing.copDiscountByPlatform.stripchat = discounts.stripchat;
        else if (platform === 'chaturbate') existing.copDiscountByPlatform.chaturbate = discounts.chaturbate;
        else {
          existing.copDiscountByPlatform.stripchat = discounts.stripchat;
          existing.copDiscountByPlatform.chaturbate = discounts.chaturbate;
        }
        modelIdRemap[normalized.id] = existing.id;
      }
    }
    state.entries = Array.isArray(state.entries) ? state.entries : [];
    state.entries = state.entries.map((entry) => ({
      ...entry,
      modelId: modelIdRemap[entry.modelId] || entry.modelId,
      platform: entry.platform || 'legacy',
      provider: entry.provider || 'legacy',
      usdPerToken: Number(entry.usdPerToken) || ((Number(entry.tokensPerUsd) || 0) > 0 ? 1 / Number(entry.tokensPerUsd) : undefined),
      copDiscountPerUsd: Number(entry.copDiscountPerUsd) || 0,
    }));
    if (localStorage.getItem(TIFFANY_SHARE_MIGRATION_KEY) !== 'done') {
      const tiffany = state.models.find((model) => String(model.name || '').toLocaleLowerCase().replace(/[^a-z0-9]/g, '') === 'tiffanysims');
      if (tiffany) {
        tiffany.sharePctByPlatform = { ...tiffany.sharePctByPlatform, stripchat: 80, chaturbate: 80 };
        state.entries = state.entries.map((entry) => entry.modelId === tiffany.id ? { ...entry, sharePct: 80 } : entry);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
          localStorage.setItem(TIFFANY_SHARE_MIGRATION_KEY, 'done');
        } catch { /* Keep the in-memory correction if browser storage is unavailable. */ }
      }
    }
  } catch { state = structuredClone(defaults); }

  const number = (v) => Number(v) || 0;
  const fmt = (v, digits = 2) => new Intl.NumberFormat('es-CO', { maximumFractionDigits: digits }).format(number(v));
  const usd = (v) => '$' + fmt(v, 2);
  const cop = (v) => '$' + fmt(v, 0) + ' COP';
  let lastTrmFetchedAt = '';
  const syncBantokensTrm = async () => {
    const note = $('#bantokensRateNote');
    try {
      if (!['http:', 'https:'].includes(window.location.protocol)) throw new Error('La sincronización requiere la versión web.');
      const response = await fetch(`${TRM_RATE_URL}?v=${Date.now()}`, { cache: 'no-store' });
      if (!response.ok) throw new Error('No se pudo consultar la TRM.');
      const rate = await response.json();
      const trm = Number(rate.trmRate);
      const bantokensRate = Number(rate.bantokensRate);
      if (!Number.isFinite(trm) || trm <= 50 || !Number.isFinite(bantokensRate) || bantokensRate <= 0 || Math.abs(bantokensRate - (trm - 50)) > 0.01) throw new Error('La tasa TRM recibida no es válida.');
      const dateText = rate.validDate ? ` · ${rate.validDate}` : '';
      note.textContent = `TRM ${fmt(trm, 2)} − $50 = ${fmt(bantokensRate, 2)} COP${dateText}`;
      if (rate.fetchedAt !== lastTrmFetchedAt || number(state.rates.copPerUsdByProvider.bantokens) !== bantokensRate) {
        lastTrmFetchedAt = rate.fetchedAt || '';
        state.rates.copPerUsdByProvider.bantokens = bantokensRate;
        $('#copPerUsdBantokens').value = bantokensRate;
        persist();
        render();
      }
    } catch {
      note.textContent = number(state.rates.copPerUsdByProvider.bantokens) > 0
        ? 'Usando la última tasa guardada; no se pudo actualizar la TRM.'
        : 'TRM − $50 · se actualizará en la versión web.';
    }
  };
  const todayISO = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };
  const weekKey = (dateValue) => {
    const date = new Date(`${dateValue}T00:00:00`);
    date.setDate(date.getDate() - ((date.getDay() + 6) % 7));
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };
  let selectedWeek = weekKey(todayISO());
  const weekRangeLabel = (key) => {
    const monday = new Date(`${key}T00:00:00`);
    const sunday = new Date(monday);
    sunday.setDate(sunday.getDate() + 6);
    const dateLabel = (date) => date.toLocaleDateString('es-CO', { day: 'numeric', month: 'short' });
    return `${dateLabel(monday)} – ${dateLabel(sunday)}, ${sunday.getFullYear()}`;
  };
  const escapeHtml = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  const modelById = (id) => state.models.find((m) => m.id === id);
  const ratesReady = (platform = $('#entryPlatform')?.value || 'stripchat', provider = $('#entryProvider')?.value || 'bantokens') => number(state.rates.usdPerToken[platform]) > 0 && number(state.rates.copPerUsdByProvider[provider]) > 0;
  const tokenUsd = (tokens, platform) => number(tokens) * number(state.rates.usdPerToken[platform]);
  const previousWeeklyReading = (modelId, platform, date, excludeId = '') => {
    const snapshots = state.entries
      .filter((entry) => entry.id !== excludeId && entry.weeklyTokens !== undefined && entry.weeklyTokens !== null && entry.modelId === modelId && entry.platform === platform && entry.date < date && weekKey(entry.date) === weekKey(date))
      .sort((a, b) => b.date.localeCompare(a.date) || (b.createdAt || 0) - (a.createdAt || 0));
    if (snapshots.length) return snapshots[0];
    const earlierDailyLogs = state.entries.filter((entry) => entry.id !== excludeId && (entry.weeklyTokens === undefined || entry.weeklyTokens === null) && entry.modelId === modelId && entry.platform === platform && entry.date <= date && weekKey(entry.date) === weekKey(date));
    if (!earlierDailyLogs.length) return undefined;
    return { weeklyTokens: earlierDailyLogs.reduce((sum, entry) => sum + number(entry.tokens), 0), date: earlierDailyLogs.map((entry) => entry.date).sort().at(-1), legacy: true };
  };
  const entryTokens = (entry) => {
    if (entry.weeklyTokens === undefined || entry.weeklyTokens === null) return number(entry.tokens);
    const previous = previousWeeklyReading(entry.modelId, entry.platform, entry.date, entry.id);
    return Math.max(0, number(entry.weeklyTokens) - number(previous?.weeklyTokens));
  };
  const entryUsd = (entry) => entryTokens(entry) * (number(entry.usdPerToken) || number(state.rates.usdPerToken[entry.platform]) || 0);
  const entryCopRate = (entry) => {
    const currentRate = number(state.rates.copPerUsdByProvider[entry.provider]);
    const recordedRate = number(entry.copPerUsd);
    if (weekKey(entry.date) === weekKey(todayISO()) && currentRate > 0) return currentRate;
    return recordedRate || currentRate || number(state.rates.copPerUsd);
  };
  const entryModelCopRate = (entry) => Math.max(0, entryCopRate(entry) - number(entry.copDiscountPerUsd));
  const entryModelUsd = (entry) => entryUsd(entry) * number(entry.sharePct) / 100;
  const entryModelCop = (entry) => entryUsd(entry) * number(entry.sharePct) / 100 * entryModelCopRate(entry);
  const entryOwnerFeeUsd = (entry) => entry.provider === 'twl' ? entryUsd(entry) * TWL_OWNER_FEE_RATE : 0;
  const entryOwnerFeeCop = (entry) => entryOwnerFeeUsd(entry) * entryCopRate(entry);
  const entryOwnerUsd = (entry) => entryUsd(entry) - entryModelUsd(entry) - entryOwnerFeeUsd(entry);
  const entryOwnerCop = (entry) => entryUsd(entry) * entryCopRate(entry) - entryModelCop(entry) - entryOwnerFeeCop(entry);
  function persist() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    $('#saveIndicator').textContent = '● Guardado';
  }
  function flash(message) {
    const toast = $('#toast');
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(flash.timer);
    flash.timer = setTimeout(() => toast.classList.remove('show'), 2300);
  }
  function periodEntries() {
    const period = $('#period').value;
    const platform = $('#platformFilter').value;
    const provider = $('#providerFilter').value;
    const modelId = $('#modelFilter').value;
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    if (period === 'month') start.setDate(1);
    if (period === 'week') start.setDate(start.getDate() - 6);
    return state.entries.filter((e) => (platform === 'all' || e.platform === platform) && (provider === 'all' || e.provider === provider) && (modelId === 'all' || e.modelId === modelId) && (period === 'all' || (period === 'selected-week' ? weekKey(e.date) === selectedWeek : new Date(`${e.date}T00:00:00`) >= start)));
  }
  function renderSummary() {
    const entries = periodEntries();
    const tokens = entries.reduce((sum, e) => sum + entryTokens(e), 0);
    const total = entries.reduce((sum, e) => sum + entryUsd(e), 0);
    const modelsTotal = entries.reduce((sum, e) => sum + entryModelUsd(e), 0);
    const ownerTotal = entries.reduce((sum, e) => sum + entryOwnerUsd(e), 0);
    const totalCop = entries.reduce((sum, e) => sum + entryUsd(e) * entryCopRate(e), 0);
    const modelsCop = entries.reduce((sum, e) => sum + entryModelCop(e), 0);
    const ownerCop = entries.reduce((sum, e) => sum + entryOwnerCop(e), 0);
    const ownerFeeUsd = entries.reduce((sum, e) => sum + entryOwnerFeeUsd(e), 0);
    const ownerFeeCop = entries.reduce((sum, e) => sum + entryOwnerFeeCop(e), 0);
    const period = $('#period').value;
    $('#summaryPeriodLabel').textContent = period === 'selected-week' ? `Semana ${weekRangeLabel(selectedWeek)}` : period === 'all' ? 'Histórico completo' : period === 'month' ? 'Desde el inicio del mes' : 'Últimos 7 días';
    $('#totalTokens').innerHTML = `${fmt(tokens, 0)} <small>tokens</small>`;
    $('#totalUsd').innerHTML = `${usd(total)} <small>USD</small>`;
    $('#totalCop').textContent = entries.length && entries.every((e) => entryCopRate(e) > 0) ? `≈ ${cop(totalCop)}` : 'Configura las tasas para convertir a COP';
    $('#modelsUsd').innerHTML = `${usd(modelsTotal)} <small>USD</small>`;
    $('#modelsCop').textContent = entries.length && entries.every((e) => entryCopRate(e) > 0) ? `≈ ${cop(modelsCop)}` : 'Configura las tasas para convertir a COP';
    $('#ownerUsd').innerHTML = `${usd(ownerTotal)} <small>USD</small>`;
    $('#ownerCop').textContent = entries.length && entries.every((e) => entryCopRate(e) > 0) ? `≈ ${cop(ownerCop)}` : 'Configura las tasas para convertir a COP';
    const feeCopText = entries.every((e) => entryCopRate(e) > 0) ? cop(ownerFeeCop) : 'COP pendiente de tasa';
    $('#ownerFeeSummary').textContent = `Retención TWL (10% del total): ${usd(ownerFeeUsd)} · ${feeCopText}`;
  }
  function renderWeekOptions() {
    const weeks = new Set([weekKey(todayISO()), ...state.entries.map((entry) => weekKey(entry.date))]);
    if (!weeks.has(selectedWeek)) selectedWeek = weekKey(todayISO());
    const options = [...weeks].sort((a, b) => b.localeCompare(a));
    $('#weekSelector').innerHTML = options.map((week) => `<option value="${week}">${escapeHtml(weekRangeLabel(week))}${week === weekKey(todayISO()) ? ' · actual' : ''}</option>`).join('');
    $('#weekSelector').value = selectedWeek;
  }
  function renderWeeklyPayouts() {
    $('#weeklyDateRange').textContent = `Lunes a domingo · ${weekRangeLabel(selectedWeek)} · TWL retiene 10% del total y luego se calcula tu restante.`;
    const totals = new Map();
    state.entries.filter((entry) => weekKey(entry.date) === selectedWeek).forEach((entry) => {
      const key = JSON.stringify([entry.modelId, entry.platform, entry.provider]);
      if (!totals.has(key)) totals.set(key, { modelName: entry.modelName || modelById(entry.modelId)?.name || 'Modelo eliminada', platform: entry.platform, provider: entry.provider, tokens: 0, modelUsd: 0, modelCop: 0, ownerFeeUsd: 0, ownerFeeCop: 0, ownerUsd: 0, ownerCop: 0, hasCopRate: true });
      const total = totals.get(key);
      total.tokens += entryTokens(entry);
      total.modelUsd += entryModelUsd(entry);
      total.modelCop += entryModelCop(entry);
      total.ownerFeeUsd += entryOwnerFeeUsd(entry);
      total.ownerFeeCop += entryOwnerFeeCop(entry);
      total.ownerUsd += entryOwnerUsd(entry);
      total.ownerCop += entryOwnerCop(entry);
      if (!(entryCopRate(entry) > 0)) total.hasCopRate = false;
    });
    const rows = [...totals.values()].sort((a, b) => a.modelName.localeCompare(b.modelName) || a.platform.localeCompare(b.platform) || a.provider.localeCompare(b.provider));
    $('#weeklyPayoutEmpty').hidden = rows.length > 0;
    $('#weeklyPayoutBody').innerHTML = rows.map((row) => {
      const platform = row.platform === 'stripchat' ? 'Stripchat' : row.platform === 'chaturbate' ? 'Chaturbate' : 'Anterior';
      const provider = row.provider === 'bantokens' ? 'BANTOKENS' : row.provider === 'twl' ? 'TWL' : row.provider === 'usdt' ? 'USDT' : 'Anterior';
      return `<tr><td data-label="Modelo"><span class="model-cell"><span class="model-dot">${escapeHtml(row.modelName.trim().charAt(0).toUpperCase() || '?')}</span>${escapeHtml(row.modelName)}</span></td><td data-label="Página">${platform}</td><td data-label="Monetizadora">${provider}</td><td class="token-cell" data-label="Tokens en la semana">${fmt(row.tokens, 0)}</td><td class="amount-cell" data-label="Modelo · USD">${usd(row.modelUsd)}</td><td class="share-cell" data-label="Modelo · COP">${row.hasCopRate ? cop(row.modelCop) : 'Configura la tasa COP/USD'}</td><td class="fee-cell" data-label="Retención TWL">${row.provider === 'twl' ? `${usd(row.ownerFeeUsd)}<small>${row.hasCopRate ? cop(row.ownerFeeCop) : 'Configura tasa COP/USD'}</small>` : '—'}</td><td class="amount-cell" data-label="Tu neto · USD">${usd(row.ownerUsd)}</td><td class="owner-cell" data-label="Tu neto · COP">${row.hasCopRate ? cop(row.ownerCop) : 'Configura la tasa COP/USD'}</td></tr>`;
    }).join('');
    const totalTokens = rows.reduce((sum, row) => sum + row.tokens, 0);
    const totalModelUsd = rows.reduce((sum, row) => sum + row.modelUsd, 0);
    const totalModelCop = rows.reduce((sum, row) => sum + row.modelCop, 0);
    const totalFeeUsd = rows.reduce((sum, row) => sum + row.ownerFeeUsd, 0);
    const totalFeeCop = rows.reduce((sum, row) => sum + row.ownerFeeCop, 0);
    const totalOwnerUsd = rows.reduce((sum, row) => sum + row.ownerUsd, 0);
    const totalOwnerCop = rows.reduce((sum, row) => sum + row.ownerCop, 0);
    const allCopRatesReady = rows.length > 0 && rows.every((row) => row.hasCopRate);
    $('#weeklyPayoutFoot').innerHTML = rows.length ? `<tr><th colspan="3">TOTAL SEMANAL</th><th data-label="Tokens en la semana">${fmt(totalTokens, 0)}</th><th data-label="Modelo · USD">${usd(totalModelUsd)}</th><th data-label="Modelo · COP">${allCopRatesReady ? cop(totalModelCop) : 'Configura las tasas'}</th><th data-label="Retención TWL">${usd(totalFeeUsd)}<small>${allCopRatesReady ? cop(totalFeeCop) : 'Configura las tasas'}</small></th><th data-label="Tu neto · USD">${usd(totalOwnerUsd)}</th><th data-label="Tu neto · COP">${allCopRatesReady ? cop(totalOwnerCop) : 'Configura las tasas'}</th></tr>` : '';
  }
  function renderWeeklyHistory() {
    const totals = new Map();
    state.entries.forEach((entry) => {
      const key = weekKey(entry.date);
      if (!totals.has(key)) totals.set(key, { week: key, tokens: 0, totalUsd: 0, modelUsd: 0, modelCop: 0, ownerUsd: 0, ownerCop: 0, hasCopRate: true });
      const week = totals.get(key);
      week.tokens += entryTokens(entry);
      week.totalUsd += entryUsd(entry);
      week.modelUsd += entryModelUsd(entry);
      week.modelCop += entryModelCop(entry);
      week.ownerUsd += entryOwnerUsd(entry);
      week.ownerCop += entryOwnerCop(entry);
      if (!(entryCopRate(entry) > 0)) week.hasCopRate = false;
    });
    const rows = [...totals.values()].sort((a, b) => b.week.localeCompare(a.week));
    $('#weeklyHistoryEmpty').hidden = rows.length > 0;
    $('#weeklyHistoryBody').innerHTML = rows.map((row) => `<tr><td data-label="Semana">${escapeHtml(weekRangeLabel(row.week))}</td><td class="token-cell" data-label="Tokens">${fmt(row.tokens, 0)}</td><td class="amount-cell" data-label="Total · USD">${usd(row.totalUsd)}</td><td class="share-cell" data-label="Modelos · USD">${usd(row.modelUsd)}</td><td data-label="Modelos · COP">${row.hasCopRate ? cop(row.modelCop) : 'Configura las tasas'}</td><td class="amount-cell" data-label="Tu neto · USD">${usd(row.ownerUsd)}</td><td data-label="Tu neto · COP">${row.hasCopRate ? cop(row.ownerCop) : 'Configura las tasas'}</td><td data-label="Detalle"><button class="week-history-open" type="button" data-select-week="${row.week}">Ver semana →</button></td></tr>`).join('');
    const total = rows.reduce((all, row) => ({ tokens: all.tokens + row.tokens, totalUsd: all.totalUsd + row.totalUsd, modelUsd: all.modelUsd + row.modelUsd, modelCop: all.modelCop + row.modelCop, ownerUsd: all.ownerUsd + row.ownerUsd, ownerCop: all.ownerCop + row.ownerCop, hasCopRate: all.hasCopRate && row.hasCopRate }), { tokens: 0, totalUsd: 0, modelUsd: 0, modelCop: 0, ownerUsd: 0, ownerCop: 0, hasCopRate: rows.length > 0 });
    $('#weeklyHistoryFoot').innerHTML = rows.length ? `<tr><th>ACUMULADO HISTÓRICO</th><th data-label="Tokens">${fmt(total.tokens, 0)}</th><th data-label="Total · USD">${usd(total.totalUsd)}</th><th data-label="Modelos · USD">${usd(total.modelUsd)}</th><th data-label="Modelos · COP">${total.hasCopRate ? cop(total.modelCop) : 'Configura las tasas'}</th><th data-label="Tu neto · USD">${usd(total.ownerUsd)}</th><th data-label="Tu neto · COP">${total.hasCopRate ? cop(total.ownerCop) : 'Configura las tasas'}</th><th></th></tr>` : '';
  }
  function renderEntries() {
    const modelFilter = $('#modelFilter');
    const selectedModel = modelFilter.value;
    modelFilter.innerHTML = `<option value="all">Todas las modelos</option>${state.models.map((model) => `<option value="${escapeHtml(model.id)}">${escapeHtml(model.name)}</option>`).join('')}`;
    if ([...modelFilter.options].some((option) => option.value === selectedModel)) modelFilter.value = selectedModel;
    const tbody = $('#entriesBody');
    const entries = periodEntries().slice().sort((a, b) => b.date.localeCompare(a.date) || (b.createdAt || 0) - (a.createdAt || 0));
    $('#emptyState').hidden = entries.length > 0;
    tbody.innerHTML = entries.map((e) => {
      const model = modelById(e.modelId);
      const name = e.modelName || model?.name || 'Modelo eliminada';
      const gross = entryUsd(e);
      const share = number(e.sharePct);
      const platform = e.platform === 'stripchat' ? 'Stripchat' : e.platform === 'chaturbate' ? 'Chaturbate' : 'Anterior';
      const provider = e.provider === 'bantokens' ? 'BANTOKENS' : e.provider === 'twl' ? 'TWL' : e.provider === 'usdt' ? 'USDT' : 'Anterior';
      const d = new Date(`${e.date}T00:00:00`).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' });
      const dailyTokens = entryTokens(e);
      const weeklyTokens = e.weeklyTokens === undefined || e.weeklyTokens === null ? '—' : fmt(e.weeklyTokens, 0);
      return `<tr><td data-label="Modelo"><span class="model-cell"><span class="model-dot">${escapeHtml(name.trim().charAt(0).toUpperCase() || '?')}</span>${escapeHtml(name)}</span></td><td data-label="Página">${platform}</td><td data-label="Monetizadora">${provider}</td><td data-label="Fecha">${d}</td><td class="token-cell" data-label="Tokens del día">${fmt(dailyTokens, 0)}</td><td data-label="Acumulado semanal">${weeklyTokens}</td><td class="amount-cell" data-label="Valor total · USD">${usd(gross)}</td><td class="share-cell" data-label="Modelo · USD / COP">${usd(entryModelUsd(e))} <span style="color:#9aa2af">(${fmt(share, 1)}%)</span><small class="payout-cop">${cop(entryModelCop(e))}</small></td><td class="fee-cell" data-label="Retención TWL">${e.provider === 'twl' ? `${usd(entryOwnerFeeUsd(e))}<small>${cop(entryOwnerFeeCop(e))}</small>` : '—'}</td><td class="owner-cell" data-label="Tu neto · USD / COP">${usd(entryOwnerUsd(e))}<small>${cop(entryOwnerCop(e))}</small></td><td class="entry-actions-cell" data-label="Acciones"><div class="entry-actions"><button class="edit-entry" data-edit-entry="${escapeHtml(e.id)}" aria-label="Editar ingreso" title="Editar ingreso">Editar</button><button class="delete-entry" data-delete-entry="${escapeHtml(e.id)}" aria-label="Eliminar ingreso" title="Eliminar ingreso">×</button></div></td></tr>`;
    }).join('');
    renderWeekOptions();
    renderSummary();
    renderWeeklyPayouts();
    renderWeeklyHistory();
  }
  function renderModels() {
    const currentSelection = $('#entryModel').value;
    const options = state.models.map((m) => `<option value="${escapeHtml(m.id)}">${escapeHtml(m.name)}</option>`).join('');
    $('#entryModel').innerHTML = `<option value="">Selecciona un modelo</option>${options}`;
    if ([...$('#entryModel').options].some((option) => option.value === currentSelection)) $('#entryModel').value = currentSelection;
    $('#modelList').innerHTML = state.models.map((m) => {
      const share = `SC ${fmt(m.sharePctByPlatform.stripchat, 1)}% · -${fmt(m.copDiscountByPlatform.stripchat, 0)} COP/USD · CB ${fmt(m.sharePctByPlatform.chaturbate, 1)}% · -${fmt(m.copDiscountByPlatform.chaturbate, 0)} COP/USD`;
      return `<div class="model-row"><span class="model-dot">${escapeHtml(m.name.trim().charAt(0).toUpperCase() || '?')}</span><span class="model-info"><b>${escapeHtml(m.name)}</b><small>${share}</small></span></div>`;
    }).join('');
    $('#noModels').hidden = state.models.length > 0;
    $('#modelManageList').innerHTML = state.models.map((m) => {
      const locked = state.entries.some((e) => e.modelId === m.id);
      const share = `SC ${fmt(m.sharePctByPlatform.stripchat, 1)}% · -${fmt(m.copDiscountByPlatform.stripchat, 0)} COP/USD · CB ${fmt(m.sharePctByPlatform.chaturbate, 1)}% · -${fmt(m.copDiscountByPlatform.chaturbate, 0)} COP/USD`;
      return `<div class="manage-row"><span class="manage-name">${escapeHtml(m.name)} <small style="color:#8b94a3">· ${share}</small> ${locked ? '<small title="Tiene ingresos registrados" style="color:#99a1ae">· con movimientos</small>' : ''}</span><button class="edit-model" data-edit-model="${escapeHtml(m.id)}" title="Editar modelo">Editar</button><button class="remove-model" data-remove-model="${escapeHtml(m.id)}" ${locked ? 'disabled title="No se puede eliminar porque tiene ingresos registrados"' : 'title="Eliminar modelo"'} aria-label="Eliminar modelo">×</button></div>`;
    }).join('');
  }
  function renderPreview() {
    const model = modelById($('#entryModel').value);
    const rawWeeklyTokens = $('#entryWeeklyTokens').value;
    const weeklyTokens = Number(rawWeeklyTokens);
    const preview = $('#entryPreview');
    if (!model || rawWeeklyTokens === '' || !Number.isFinite(weeklyTokens) || weeklyTokens < 0) { preview.textContent = 'Ingresa el acumulado semanal. Se comparará con la lectura anterior de esta modelo y página.'; return; }
    const platform = $('#entryPlatform').value;
    const provider = $('#entryProvider').value;
    const date = $('#entryDate').value || todayISO();
    const editingEntry = state.entries.find((entry) => entry.id === $('#editingEntryId').value);
    const sameDay = state.entries.find((entry) => entry.weeklyTokens !== undefined && entry.weeklyTokens !== null && entry.modelId === model.id && entry.platform === platform && entry.date === date);
    const previous = previousWeeklyReading(model.id, platform, date, editingEntry?.id || sameDay?.id || '');
    const sameContext = editingEntry && editingEntry.modelId === model.id && editingEntry.platform === platform && editingEntry.provider === provider;
    const previousTokens = number(previous?.weeklyTokens);
    if (previous && weeklyTokens < previousTokens) {
      preview.textContent = `El acumulado (${fmt(weeklyTokens, 0)}) es menor que la última lectura de esta semana (${fmt(previousTokens, 0)}). Revisa la fecha o el valor.`;
      return;
    }
    const dailyTokens = Math.max(0, weeklyTokens - previousTokens);
    const previousInfo = previous ? `${previous.legacy ? 'Tokens registrados antes' : 'Última lectura'}: ${fmt(previousTokens, 0)} (${new Date(`${previous.date}T00:00:00`).toLocaleDateString('es-CO', { day: 'numeric', month: 'short' })}).` : 'Primera lectura de esta modelo y página en la semana: el acumulado completo se contará como tokens del día.';
    const previewUsdPerToken = sameContext ? number(editingEntry.usdPerToken) : number(state.rates.usdPerToken[platform]);
    const previewCopRate = sameContext ? entryCopRate(editingEntry) : number(state.rates.copPerUsdByProvider[provider]);
    if (!(previewUsdPerToken > 0 && previewCopRate > 0)) {
      preview.innerHTML = `${sameContext || sameDay ? 'Actualizando ingreso.' : 'Tokens del día estimados:'} <b>${fmt(dailyTokens, 0)}</b> · Acumulado semanal: <b>${fmt(weeklyTokens, 0)}</b>. ${previousInfo} Configura las tasas para calcular el dinero.`;
      return;
    }
    const gross = dailyTokens * previewUsdPerToken;
    const sharePct = sameContext ? number(editingEntry.sharePct) : Number(model.sharePctByPlatform[platform]);
    if (!Number.isFinite(sharePct) || sharePct < 0 || sharePct > 100) { preview.textContent = 'Esta modelo no tiene un porcentaje configurado. Agrégala de nuevo con página y porcentaje.'; return; }
    const modelPart = gross * sharePct / 100;
    const discount = sameContext ? number(editingEntry.copDiscountPerUsd) : number(model.copDiscountByPlatform[platform]);
    const copRate = previewCopRate;
    const modelPayoutCop = modelPart * Math.max(0, copRate - discount);
    const totalCop = gross * copRate;
    const ownerFeeUsd = provider === 'twl' ? gross * TWL_OWNER_FEE_RATE : 0;
    const ownerNetUsd = gross - modelPart - ownerFeeUsd;
    const ownerNetCop = totalCop - modelPayoutCop - ownerFeeUsd * copRate;
    preview.innerHTML = `${sameContext || sameDay ? 'Actualizando ingreso.' : 'Tokens del día estimados:'} <b>${fmt(dailyTokens, 0)}</b> · Acumulado: <b>${fmt(weeklyTokens, 0)}</b>. ${previousInfo}<br>Total del día: <b>${usd(gross)}</b> (${cop(totalCop)}). Modelo (${fmt(sharePct, 1)}%): <b>${usd(modelPart)}</b> · paga <b>${cop(modelPayoutCop)}</b>. ${provider === 'twl' ? `TWL retiene ${usd(ownerFeeUsd)} (${cop(ownerFeeUsd * copRate)}) del total. ` : ''}Tu parte neta: <b>${usd(ownerNetUsd)}</b> · <b>${cop(ownerNetCop)}</b>.`;
  }
  function render() { renderModels(); renderEntries(); renderPreview(); }
  function updateThemeControl() {
    const dark = document.documentElement.dataset.theme === 'dark';
    $('#themeIcon').textContent = dark ? '☀' : '☾';
    $('#themeToggle').setAttribute('aria-label', dark ? 'Activar modo claro' : 'Activar modo oscuro');
    $('#themeToggle').title = dark ? 'Activar modo claro' : 'Activar modo oscuro';
  }
  function clearModelEdit() {
    $('#modelForm').reset();
    $('#editingModelId').value = '';
    $('#modelFormTitle').textContent = 'Agregar modelo';
    $('#modelSubmitButton').innerHTML = '<span>＋</span> Agregar modelo';
    $('#cancelModelEdit').hidden = true;
  }
  function clearEntryEdit() {
    $('#entryForm').reset();
    $('#editingEntryId').value = '';
    $('#entryDate').value = todayISO();
    $('#entryFormTitle').textContent = 'Registrar ingresos';
    $('#entrySubmitButton').innerHTML = 'Guardar ingreso <span>→</span>';
    $('#cancelEntryEdit').hidden = true;
    renderPreview();
  }

  $('#today').textContent = new Date().toLocaleDateString('es-CO', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
  const textSizeToggle = $('#textSizeToggle');
  const textSizePanel = $('#textSizePanel');
  const textSizeRange = $('#textSizeRange');
  const applyTextSize = (size) => {
    savedTextSize = Number(size);
    document.documentElement.style.setProperty('--app-zoom', String(savedTextSize / 100));
    textSizeRange.value = String(savedTextSize);
    $('#textSizeValue').value = `${savedTextSize}%`;
    try { localStorage.setItem(TEXT_SIZE_KEY, String(savedTextSize)); } catch { /* Keep the size until the app is closed. */ }
  };
  applyTextSize(savedTextSize);
  textSizeToggle.addEventListener('click', () => {
    const open = textSizePanel.hidden;
    textSizePanel.hidden = !open;
    textSizeToggle.setAttribute('aria-expanded', String(open));
    if (open) textSizeRange.focus();
  });
  textSizeRange.addEventListener('input', (event) => applyTextSize(event.target.value));
  $('#textSizeReset').addEventListener('click', () => applyTextSize(100));
  document.addEventListener('click', (event) => {
    if (!event.target.closest('.text-size-control')) {
      textSizePanel.hidden = true;
      textSizeToggle.setAttribute('aria-expanded', 'false');
    }
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !textSizePanel.hidden) {
      textSizePanel.hidden = true;
      textSizeToggle.setAttribute('aria-expanded', 'false');
      textSizeToggle.focus();
    }
  });
  $('#accentColorInput').value = savedAccent || (document.documentElement.dataset.theme === 'dark' ? '#a99bf6' : '#6856d9');
  $('#accentColorInput').addEventListener('input', (event) => {
    savedAccent = event.target.value;
    applyAccentColor(savedAccent);
    try { localStorage.setItem(ACCENT_KEY, savedAccent); } catch { /* Keep the color until the app is closed. */ }
  });
  updateThemeControl();
  $('#themeToggle').addEventListener('click', () => {
    const nextTheme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = nextTheme;
    localStorage.setItem(THEME_KEY, nextTheme);
    if (savedAccent) applyAccentColor(savedAccent);
    else $('#accentColorInput').value = nextTheme === 'dark' ? '#a99bf6' : '#6856d9';
    updateThemeControl();
  });
  let pendingBackupImport = null;
  $('#exportBackup').addEventListener('click', () => {
    const backup = { app: 'GRUPODGH', version: 1, exportedAt: new Date().toISOString(), data: state };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const download = document.createElement('a');
    download.href = url;
    download.download = `grupodgh-respaldo-${todayISO()}.json`;
    document.body.append(download);
    download.click();
    download.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    flash('Respaldo descargado.');
  });
  $('#backupFile').addEventListener('change', async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const backup = JSON.parse(await file.text());
      const imported = backup?.data;
      if (backup?.app !== 'GRUPODGH' || backup?.version !== 1 || !imported || !Array.isArray(imported.models) || !Array.isArray(imported.entries) || !imported.rates || typeof imported.rates !== 'object') {
        flash('Ese archivo no es un respaldo válido de GRUPODGH.');
        return;
      }
      pendingBackupImport = imported;
      $('#backupConfirmDetails').textContent = `Archivo: ${file.name}. Se importarán ${imported.models.length} modelos, ${imported.entries.length} ingresos y sus tasas.`;
      $('#backupConfirm').hidden = false;
    } catch {
      flash('No se pudo importar. Revisa que el archivo sea un respaldo válido.');
    } finally {
      event.target.value = '';
    }
  });
  $('#cancelBackupImport').addEventListener('click', () => {
    pendingBackupImport = null;
    $('#backupConfirm').hidden = true;
  });
  $('#confirmBackupImport').addEventListener('click', () => {
    if (!pendingBackupImport) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(pendingBackupImport));
      pendingBackupImport = null;
      $('#backupConfirm').hidden = true;
      flash('Respaldo importado. Recargando la app…');
      setTimeout(() => window.location.reload(), 350);
    } catch {
      pendingBackupImport = null;
      $('#backupConfirm').hidden = true;
      flash('No se pudo guardar el respaldo en este navegador.');
    }
  });
  $('#entryDate').value = todayISO();
  $('#rateStripchat').value = state.rates.usdPerToken.stripchat;
  $('#rateChaturbate').value = state.rates.usdPerToken.chaturbate;
  $('#copPerUsdBantokens').value = state.rates.copPerUsdByProvider.bantokens;
  $('#copPerUsdTwl').value = state.rates.copPerUsdByProvider.twl;
  $('#copPerUsdUsdt').value = state.rates.copPerUsdByProvider.usdt;
  for (const [id, platform] of [['rateStripchat', 'stripchat'], ['rateChaturbate', 'chaturbate']]) {
    $(`#${id}`).addEventListener('change', (event) => {
      const value = event.target.value;
      if (value && number(value) <= 0) { event.target.value = ''; return; }
      state.rates.usdPerToken[platform] = number(value);
      persist(); render();
    });
  }
  for (const [id, provider] of [['copPerUsdBantokens', 'bantokens'], ['copPerUsdTwl', 'twl'], ['copPerUsdUsdt', 'usdt']]) {
    $(`#${id}`).addEventListener('change', (event) => {
      const value = event.target.value;
      if (value && number(value) <= 0) { event.target.value = ''; return; }
      state.rates.copPerUsdByProvider[provider] = value;
      if (provider === 'bantokens') $('#bantokensRateNote').textContent = 'Tasa editada manualmente; se sincroniza desde la TRM al abrir la versión web.';
      persist(); render();
    });
  }
  syncBantokensTrm();
  if (['http:', 'https:'].includes(window.location.protocol)) setInterval(syncBantokensTrm, 60 * 60 * 1000);
  $('#period').addEventListener('change', renderEntries);
  $('#platformFilter').addEventListener('change', renderEntries);
  $('#providerFilter').addEventListener('change', renderEntries);
  $('#modelFilter').addEventListener('change', renderEntries);
  $('#weekSelector').addEventListener('change', (event) => { selectedWeek = event.target.value; renderEntries(); });
  $('#weeklyHistoryBody').addEventListener('click', (event) => {
    const button = event.target.closest('[data-select-week]');
    if (!button) return;
    selectedWeek = button.dataset.selectWeek;
    $('#weekSelector').value = selectedWeek;
    $('#period').value = 'selected-week';
    renderEntries();
    $('#weekly-panel')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
  $('#entryPlatform').addEventListener('change', renderPreview);
  $('#entryProvider').addEventListener('change', renderPreview);
  $('#entryModel').addEventListener('change', renderPreview);
  $('#entryDate').addEventListener('change', renderPreview);
  $('#entryWeeklyTokens').addEventListener('input', renderPreview);
  $('#modelForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const editingId = $('#editingModelId').value;
    const name = $('#modelName').value.trim();
    const stripchatPct = Number($('#modelShareStripchat').value);
    const chaturbatePct = Number($('#modelShareChaturbate').value);
    const copDiscountStripchat = Number($('#modelCopStripchat').value);
    const copDiscountChaturbate = Number($('#modelCopChaturbate').value);
    if (!name) { flash('Escribe el nombre de la modelo.'); return; }
    if (![stripchatPct, chaturbatePct].every((value) => Number.isFinite(value) && value >= 0 && value <= 100)) { flash('Usa porcentajes entre 0 y 100 para ambas páginas.'); return; }
    if (![copDiscountStripchat, copDiscountChaturbate].every((value) => Number.isFinite(value) && value >= 0)) { flash('Los descuentos en pesos deben ser números iguales o mayores a cero.'); return; }
    const configuredCopRates = Object.values(state.rates.copPerUsdByProvider).map(number).filter((rate) => rate > 0);
    if (configuredCopRates.some((rate) => copDiscountStripchat >= rate || copDiscountChaturbate >= rate)) { flash('Cada descuento debe ser menor que las tasas COP/USD configuradas.'); return; }
    if (state.models.some((m) => m.id !== editingId && m.name.toLocaleLowerCase() === name.toLocaleLowerCase())) { flash(`Ya existe ${name} en el equipo.`); return; }
    if (editingId) {
      const model = modelById(editingId);
      if (!model) { flash('No se encontró la modelo para editar.'); return; }
      model.name = name;
      model.platform = 'both';
      model.sharePctByPlatform = { stripchat: stripchatPct, chaturbate: chaturbatePct };
      model.copDiscountByPlatform = { stripchat: copDiscountStripchat, chaturbate: copDiscountChaturbate };
      persist(); clearModelEdit(); render(); flash('Modelo actualizada. Los ingresos anteriores conservan sus valores.');
    } else {
      state.models.push({ id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()), name, platform: 'both', sharePctByPlatform: { stripchat: stripchatPct, chaturbate: chaturbatePct }, copDiscountByPlatform: { stripchat: copDiscountStripchat, chaturbate: copDiscountChaturbate } });
      persist(); clearModelEdit(); render(); flash('Modelo agregada.');
    }
  });
  $('#entryForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const model = modelById($('#entryModel').value);
    const rawWeeklyTokens = $('#entryWeeklyTokens').value;
    const weeklyTokens = Number(rawWeeklyTokens);
    if (!model || rawWeeklyTokens === '' || !Number.isFinite(weeklyTokens) || weeklyTokens < 0) { flash('Selecciona una modelo e ingresa el acumulado semanal de tokens.'); return; }
    const platform = $('#entryPlatform').value;
    const provider = $('#entryProvider').value;
    const date = $('#entryDate').value || todayISO();
    const editingId = $('#editingEntryId').value;
    const editingEntry = editingId ? state.entries.find((entry) => entry.id === editingId) : undefined;
    if (editingId && !editingEntry) { clearEntryEdit(); flash('No se encontró el ingreso que estabas editando.'); return; }
    const preservingRates = editingEntry && editingEntry.modelId === model.id && editingEntry.platform === platform && editingEntry.provider === provider;
    if (!preservingRates && (!ratesReady(platform, provider) || number(state.rates.usdPerToken[platform]) <= 0)) { flash('Configura las tasas de conversión para esta página y monetizadora antes de registrar ingresos.'); return; }
    const existingReading = state.entries.find((entry) => entry.id !== editingId && entry.weeklyTokens !== undefined && entry.weeklyTokens !== null && entry.modelId === model.id && entry.platform === platform && entry.date === date);
    if (editingEntry && existingReading) { flash('Ya existe una lectura para esa modelo, página y fecha. Edita ese registro para evitar duplicados.'); return; }
    const previous = previousWeeklyReading(model.id, platform, date, editingEntry?.id || existingReading?.id || '');
    const previousTokens = number(previous?.weeklyTokens);
    if (previous && weeklyTokens < previousTokens) { flash(`El acumulado no puede ser menor que la última lectura de esta semana (${fmt(previousTokens, 0)} tokens).`); return; }
    const nextReading = state.entries.filter((entry) => entry.id !== editingEntry?.id && entry.weeklyTokens !== undefined && entry.weeklyTokens !== null && entry.modelId === model.id && entry.platform === platform && entry.date > date && weekKey(entry.date) === weekKey(date)).sort((a, b) => a.date.localeCompare(b.date))[0];
    if (nextReading && weeklyTokens > number(nextReading.weeklyTokens)) { flash(`El acumulado supera la lectura posterior del ${new Date(`${nextReading.date}T00:00:00`).toLocaleDateString('es-CO', { day: 'numeric', month: 'short' })} (${fmt(nextReading.weeklyTokens, 0)} tokens).`); return; }
    const dailyTokens = Math.max(0, weeklyTokens - previousTokens);
    const sameContext = editingEntry && editingEntry.modelId === model.id && editingEntry.platform === platform && editingEntry.provider === provider;
    const sharePct = sameContext ? number(editingEntry.sharePct) : Number(model.sharePctByPlatform[platform]);
    if (!Number.isFinite(sharePct) || sharePct < 0 || sharePct > 100) { flash('Esta modelo no tiene un porcentaje configurado. Agrégala de nuevo con página y porcentaje.'); return; }
    const copDiscountPerUsd = sameContext ? number(editingEntry.copDiscountPerUsd) : number(model.copDiscountByPlatform[platform]);
    const copPerUsd = sameContext ? entryCopRate(editingEntry) : number(state.rates.copPerUsdByProvider[provider]);
    const usdPerToken = sameContext ? number(editingEntry.usdPerToken) : number(state.rates.usdPerToken[platform]);
    if (copDiscountPerUsd >= copPerUsd) { flash('El descuento por dólar debe ser menor que la tasa COP/USD de esta monetizadora.'); return; }
    const reading = { id: editingEntry?.id || existingReading?.id || (crypto.randomUUID ? crypto.randomUUID() : String(Date.now())), modelId: model.id, modelName: model.name, platform, provider, date, tokens: dailyTokens, weeklyTokens, sharePct, usdPerToken, copPerUsd, copDiscountPerUsd, createdAt: editingEntry?.createdAt || existingReading?.createdAt || Date.now() };
    if (editingEntry) Object.assign(editingEntry, reading);
    else if (existingReading) Object.assign(existingReading, reading);
    else state.entries.push(reading);
    persist();
    clearEntryEdit(); $('#entryDate').value = date; render();
    flash(`${editingEntry || existingReading ? 'Ingreso actualizado' : 'Ingreso guardado'}: ${fmt(dailyTokens, 0)} tokens del día.`);
  });
  $('#modelManageList').addEventListener('click', (event) => {
    const editButton = event.target.closest('[data-edit-model]');
    if (editButton) {
      const model = modelById(editButton.dataset.editModel);
      if (!model) return;
      $('#editingModelId').value = model.id;
      $('#modelName').value = model.name;
      $('#modelShareStripchat').value = model.sharePctByPlatform.stripchat;
      $('#modelShareChaturbate').value = model.sharePctByPlatform.chaturbate;
      $('#modelCopStripchat').value = number(model.copDiscountByPlatform.stripchat);
      $('#modelCopChaturbate').value = number(model.copDiscountByPlatform.chaturbate);
      $('#modelFormTitle').textContent = 'Editar modelo';
      $('#modelSubmitButton').innerHTML = 'Guardar cambios <span>→</span>';
      $('#cancelModelEdit').hidden = false;
      $('#modelos').scrollIntoView({ behavior: 'smooth', block: 'center' });
      $('#modelName').focus();
      return;
    }
    const removeButton = event.target.closest('[data-remove-model]');
    const id = removeButton?.dataset.removeModel;
    if (!id) return;
    if (state.entries.some((e) => e.modelId === id)) { flash('No se puede eliminar una modelo con ingresos registrados.'); return; }
    if ($('#editingModelId').value === id) clearModelEdit();
    state.models = state.models.filter((m) => m.id !== id); persist(); render(); flash('Modelo eliminada.');
  });
  $('#cancelModelEdit').addEventListener('click', clearModelEdit);
  $('#cancelEntryEdit').addEventListener('click', clearEntryEdit);
  $('#entriesBody').addEventListener('click', (event) => {
    const editButton = event.target.closest('[data-edit-entry]');
    if (editButton) {
      const entry = state.entries.find((item) => item.id === editButton.dataset.editEntry);
      if (!entry) return;
      const model = modelById(entry.modelId);
      if (!model) { flash('No se encontró la modelo de este ingreso.'); return; }
      $('#editingEntryId').value = entry.id;
      $('#entryPlatform').value = ['stripchat', 'chaturbate'].includes(entry.platform) ? entry.platform : 'stripchat';
      $('#entryProvider').value = ['bantokens', 'twl', 'usdt'].includes(entry.provider) ? entry.provider : 'bantokens';
      $('#entryModel').value = entry.modelId;
      $('#entryDate').value = entry.date;
      const previous = previousWeeklyReading(entry.modelId, entry.platform, entry.date, entry.id);
      $('#entryWeeklyTokens').value = entry.weeklyTokens === undefined || entry.weeklyTokens === null ? number(previous?.weeklyTokens) + number(entry.tokens) : entry.weeklyTokens;
      $('#entryFormTitle').textContent = 'Editar ingreso';
      $('#entrySubmitButton').innerHTML = 'Guardar cambios <span>→</span>';
      $('#cancelEntryEdit').hidden = false;
      renderPreview();
      $('#registro').scrollIntoView({ behavior: 'smooth', block: 'center' });
      $('#entryWeeklyTokens').focus();
      return;
    }
    const id = event.target.dataset.deleteEntry;
    if (!id) return;
    if ($('#editingEntryId').value === id) clearEntryEdit();
    state.entries = state.entries.filter((e) => e.id !== id); persist(); renderEntries(); flash('Ingreso eliminado.');
  });
  render();
})();
