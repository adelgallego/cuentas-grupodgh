const allowedOrigins = new Set([
  "https://adelgallego.github.io",
  "null",
  "http://localhost",
  "http://127.0.0.1",
]);

function corsHeaders(origin) {
  const allowOrigin = allowedOrigins.has(origin) ? origin : "https://adelgallego.github.io";
  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Headers": "authorization, apikey, content-type, x-client-info",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
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

// Keep Supabase JWT verification enabled for this user-authenticated function.
// The Chaturbate token is used only for this request; it is never stored or logged.
Deno.serve(async (request) => {
  const origin = request.headers.get("Origin") || "";
  if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: corsHeaders(origin) });
  if (origin && !allowedOrigins.has(origin)) return json({ error: "Forbidden origin" }, 403, origin);
  if (request.method !== "POST") return json({ error: "Use POST" }, 405, origin);

  let credentials;
  try {
    const body = await request.text();
    if (body.length > 4096) return json({ error: "Request too large" }, 413, origin);
    credentials = JSON.parse(body);
  } catch {
    return json({ error: "Invalid JSON" }, 400, origin);
  }

  const username = String(credentials?.username || "").trim();
  if (credentials?.action === "status") {
    if (credentials?.platform === "stripchat") {
      const username = String(credentials?.username || "").trim();
      if (!/^[a-zA-Z0-9_.-]{1,80}$/.test(username)) return json({ error: "Enter a valid Stripchat username" }, 400, origin);
      let upstream;
      try {
        upstream = await fetch(`https://stripchat.com/api/front/v2/models/username/${encodeURIComponent(username)}/cam`, {
          headers: { Accept: "application/json", Referer: `https://stripchat.com/${encodeURIComponent(username)}`, "X-Requested-With": "XMLHttpRequest", "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124.0 Safari/537.36" },
          redirect: "follow",
        });
      } catch { return json({ error: "Could not reach Stripchat live status API" }, 502, origin); }
      let statusData;
      try { statusData = await upstream.json(); }
      catch { return json({ error: `Stripchat live status returned a non-JSON response (HTTP ${upstream.status}; ${upstream.headers.get("content-type") || "unknown content type"})` }, 502, origin); }
      if (!upstream.ok) return json({ error: `Stripchat live status returned HTTP ${upstream.status}` }, 502, origin);
      const user = statusData?.user?.user || statusData?.user || {};
      const cam = statusData?.cam || {};
      const flags = [user.isLive, cam.isCamActive, cam.isCamAvailable].filter((value) => typeof value === "boolean");
      if (!flags.length) return json({ error: "Stripchat response did not contain a recognizable live status" }, 502, origin);
      return json({ is_online: flags.some(Boolean), fetched_at: new Date().toISOString() }, 200, origin);
    }
    const username = String(credentials?.username || "").trim();
    if (!/^[a-zA-Z0-9_]{1,30}$/.test(username)) return json({ error: "Enter a valid Chaturbate username" }, 400, origin);
    let upstream;
    try {
      upstream = await fetch(`https://chaturbate.com/api/chatvideocontext/${encodeURIComponent(username)}/`, {
        headers: { Accept: "application/json", Referer: `https://chaturbate.com/${encodeURIComponent(username)}/`, "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124.0 Safari/537.36" },
        redirect: "follow",
      });
    } catch { return json({ error: "Could not reach Chaturbate live status API" }, 502, origin); }
    let statusData;
    try { statusData = await upstream.json(); }
    catch { return json({ error: `Chaturbate live status returned a non-JSON response (HTTP ${upstream.status})` }, 502, origin); }
    if (!upstream.ok) return json({ error: `Chaturbate live status returned HTTP ${upstream.status}` }, 502, origin);
    const roomStatus = String(statusData?.room_status || "").toLowerCase();
    if (!roomStatus) return json({ error: "Chaturbate response did not contain room_status" }, 502, origin);
    return json({ is_online: roomStatus !== "offline", room_status: roomStatus, fetched_at: new Date().toISOString() }, 200, origin);
  }

  const token = String(credentials?.token || "").trim();
  if (!/^[a-zA-Z0-9_]{1,30}$/.test(username) || !/^[a-zA-Z0-9]{24}$/.test(token)) {
    return json({ error: "Enter a valid Chaturbate username and 24-character API Auth Token" }, 400, origin);
  }

  const apiUrl = new URL("https://chaturbate.com/statsapi/");
  apiUrl.searchParams.set("username", username);
  apiUrl.searchParams.set("token", token);
  let upstream;
  try {
    upstream = await fetch(apiUrl, {
      headers: { Accept: "application/json", "User-Agent": "GRUPODGH/1.0 (+https://adelgallego.github.io/cuentas-grupodgh/)" },
      redirect: "follow",
    });
  } catch {
    return json({ error: "Could not reach Chaturbate Stats API" }, 502, origin);
  }

  const contentType = upstream.headers.get("content-type") || "unknown content type";
  let responseText;
  try { responseText = await upstream.text(); }
  catch { return json({ error: "Could not read Chaturbate response (HTTP " + upstream.status + ")" }, 502, origin); }
  if (!upstream.ok) return json({ error: "Chaturbate Stats API returned HTTP " + upstream.status + " (" + contentType + ")" }, 502, origin);

  let data;
  try { data = JSON.parse(responseText); }
  catch { return json({ error: "Chaturbate returned a non-JSON response (HTTP " + upstream.status + "; " + contentType + ")" }, 502, origin); }
  const balance = Number(data?.token_balance);
  if (!Number.isFinite(balance) || balance < 0) {
    return json({ error: String(data?.error || "The API response did not contain a valid token_balance") }, 502, origin);
  }
  const rawTimeOnline = data?.time_online;
  const parsedTimeOnline = rawTimeOnline === null || rawTimeOnline === undefined || rawTimeOnline === "" ? null : Number(rawTimeOnline);
  const timeOnline = parsedTimeOnline !== null && Number.isFinite(parsedTimeOnline) ? parsedTimeOnline : null;
  return json({
    token_balance: balance,
    time_online: timeOnline,
    is_online: timeOnline === null ? null : timeOnline >= 0,
    fetched_at: new Date().toISOString(),
  }, 200, origin);
});
