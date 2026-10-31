const allowedOrigins = new Set(["https://adelgallego.github.io"]);

function corsHeaders(origin) {
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    "Vary": "Origin",
  };
}

function json(body, status, origin) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders(origin), "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" },
  });
}

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const origin = request.headers.get("Origin") || "";
    if (!allowedOrigins.has(origin)) return new Response("Forbidden origin", { status: 403 });
    if (!["/stats", "/chaturbate/status", "/stripchat/stats", "/stripchat/status"].includes(url.pathname)) return json({ error: "Not found" }, 404, origin);
    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: corsHeaders(origin) });
    if (request.method !== "POST") return json({ error: "Use POST" }, 405, origin);

    let credentials;
    try {
      if (Number(request.headers.get("content-length") || 0) > 4096) return json({ error: "Request too large" }, 413, origin);
      credentials = await request.json();
    } catch {
      return json({ error: "Invalid JSON" }, 400, origin);
    }

    if (url.pathname === "/stats") return fetchChaturbate(credentials, origin);
    if (url.pathname === "/chaturbate/status") return fetchChaturbateLiveStatus(credentials, origin);
    if (url.pathname === "/stripchat/status") return fetchStripchatLiveStatus(credentials, origin);
    return fetchStripchat(credentials, origin);
  },
};

async function fetchChaturbateLiveStatus(credentials, origin) {
  const username = String(credentials?.username || "").trim();
  if (!/^[a-zA-Z0-9_]{1,30}$/.test(username)) return json({ error: "Enter a valid Chaturbate username" }, 400, origin);
  let upstream;
  try {
    upstream = await fetch(`https://chaturbate.com/api/chatvideocontext/${encodeURIComponent(username)}/`, { headers: { Accept: "application/json", Referer: `https://chaturbate.com/${encodeURIComponent(username)}/`, "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124.0 Safari/537.36" }, redirect: "follow" });
  } catch { return json({ error: "Could not reach Chaturbate live status API" }, 502, origin); }
  let data;
  try { data = await upstream.json(); } catch { return json({ error: `Chaturbate live status returned a non-JSON response (HTTP ${upstream.status})` }, 502, origin); }
  if (!upstream.ok) return json({ error: `Chaturbate live status returned HTTP ${upstream.status}` }, 502, origin);
  const roomStatus = String(data?.room_status || "").toLowerCase();
  if (!roomStatus) return json({ error: "Chaturbate response did not contain room_status" }, 502, origin);
  return json({ is_online: roomStatus !== "offline", room_status: roomStatus, fetched_at: new Date().toISOString() }, 200, origin);
}

async function fetchChaturbate(credentials, origin) {
  const username = String(credentials?.username || "").trim();
  const token = String(credentials?.token || "").trim();
  if (!/^[a-zA-Z0-9_]{1,30}$/.test(username) || !/^[a-zA-Z0-9]{24}$/.test(token)) {
    return json({ error: "Enter a valid Chaturbate username and 24-character API Auth Token" }, 400, origin);
  }
  const apiUrl = new URL("https://chaturbate.com/statsapi/");
  apiUrl.searchParams.set("username", username);
  apiUrl.searchParams.set("token", token);
  let upstream;
  try {
    upstream = await fetch(apiUrl, { headers: { Accept: "application/json", "User-Agent": "GRUPODGH/1.0 (+https://adelgallego.github.io/cuentas-grupodgh/)" }, redirect: "follow" });
  } catch {
    return json({ error: "Could not reach Chaturbate Stats API" }, 502, origin);
  }
  const contentType = upstream.headers.get("content-type") || "unknown content type";
  let responseText;
  try { responseText = await upstream.text(); } catch { return json({ error: `Could not read Chaturbate response (HTTP ${upstream.status})` }, 502, origin); }
  if (!upstream.ok) return json({ error: `Chaturbate Stats API returned HTTP ${upstream.status} (${contentType})` }, 502, origin);
  let data;
  try { data = JSON.parse(responseText); } catch { return json({ error: `Chaturbate returned a non-JSON response (HTTP ${upstream.status}; ${contentType})` }, 502, origin); }
  const balance = Number(data?.token_balance);
  if (!Number.isFinite(balance) || balance < 0) return json({ error: String(data?.error || "The API response did not contain a valid token_balance") }, 502, origin);
  const timeOnline = Number(data?.time_online);
  return json({ token_balance: balance, time_online: Number.isFinite(timeOnline) ? timeOnline : null, num_viewers: Number.isFinite(Number(data?.num_viewers)) ? Number(data.num_viewers) : null, last_broadcast: data?.last_broadcast ?? null, fetched_at: new Date().toISOString() }, 200, origin);
}

async function fetchStripchatLiveStatus(credentials, origin) {
  const username = String(credentials?.username || "").trim();
  if (!/^[a-zA-Z0-9_.-]{1,80}$/.test(username)) return json({ error: "Enter a valid Stripchat username" }, 400, origin);
  const apiUrl = `https://stripchat.com/api/front/v2/models/username/${encodeURIComponent(username)}/cam`;
  let upstream;
  try {
    upstream = await fetch(apiUrl, { headers: { Accept: "application/json", Referer: `https://stripchat.com/${encodeURIComponent(username)}`, "X-Requested-With": "XMLHttpRequest", "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124.0 Safari/537.36" }, redirect: "follow" });
  } catch { return json({ error: "Could not reach Stripchat live status API" }, 502, origin); }
  let data;
  try { data = await upstream.json(); }
  catch { return json({ error: `Stripchat live status returned a non-JSON response (HTTP ${upstream.status}; ${upstream.headers.get("content-type") || "unknown content type"})` }, 502, origin); }
  if (!upstream.ok) return json({ error: `Stripchat live status returned HTTP ${upstream.status}` }, 502, origin);
  const user = data?.user?.user || data?.user || {};
  const cam = data?.cam || {};
  const flags = [user.isLive, cam.isCamActive, cam.isCamAvailable].filter((value) => typeof value === "boolean");
  if (!flags.length) return json({ error: "Stripchat response did not contain a recognizable live status" }, 502, origin);
  return json({ is_online: flags.some(Boolean), fetched_at: new Date().toISOString() }, 200, origin);
}

async function fetchStripchat(credentials, origin) {
  const studioUsername = String(credentials?.studioUsername || "").trim();
  const modelUsername = String(credentials?.modelUsername || "").trim();
  const apiKey = String(credentials?.apiKey || "").trim();
  const periodStart = String(credentials?.periodStart || "");
  const periodEnd = String(credentials?.periodEnd || "");
  const datePattern = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;
  if (!/^[a-zA-Z0-9_.-]{1,80}$/.test(studioUsername) || !/^[a-zA-Z0-9_.-]{1,80}$/.test(modelUsername) || !apiKey || apiKey.length > 512 || !datePattern.test(periodStart) || !datePattern.test(periodEnd)) {
    return json({ error: "Enter a valid Studio, model, API-Key, and date range" }, 400, origin);
  }
  const apiUrl = new URL(`https://stripchat.com/api/stats/v2/studios/username/${encodeURIComponent(studioUsername)}/models/username/${encodeURIComponent(modelUsername)}`);
  apiUrl.searchParams.set("periodStart", periodStart);
  apiUrl.searchParams.set("periodEnd", periodEnd);
  let upstream;
  try {
    upstream = await fetch(apiUrl, { headers: { Accept: "application/json", "API-Key": apiKey } });
  } catch {
    return json({ error: "Could not reach Stripchat Studio API" }, 502, origin);
  }
  let data;
  try { data = await upstream.json(); } catch { return json({ error: "Stripchat returned an unreadable response" }, 502, origin); }
  if (!upstream.ok) {
    const knownErrors = { 400: "Stripchat rejected the date range or request", 403: "Wrong Stripchat Studio API-Key", 404: "Stripchat Studio or model not found" };
    return json({ error: knownErrors[upstream.status] || `Stripchat Studio API returned HTTP ${upstream.status}` }, 502, origin);
  }
  const balance = Number(data?.totalEarnings);
  if (!Number.isFinite(balance) || balance < 0) return json({ error: "Stripchat response did not contain a valid totalEarnings value" }, 502, origin);
  return json({ token_balance: balance, fetched_at: new Date().toISOString() }, 200, origin);
}
