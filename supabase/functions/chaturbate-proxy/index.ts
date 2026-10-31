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
  return json({ token_balance: balance, fetched_at: new Date().toISOString() }, 200, origin);
});
