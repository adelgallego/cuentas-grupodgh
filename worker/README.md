# Chaturbate Stats API proxy

The app is a static GitHub Pages site, so it cannot safely call Chaturbate from the browser directly. This Worker relays one fixed Stats API request and enables browser CORS only for `https://adelgallego.github.io`. It does not store credentials or readings.

## Deploy

1. Install Node.js and Wrangler (`npm install --global wrangler`).
2. In this folder, run `wrangler login` and then `wrangler deploy`.
3. Copy the deployed URL and append `/stats` (for example, `https://grupodgh-chaturbate-proxy.<your-subdomain>.workers.dev/stats`) into the app.
4. In Chaturbate, create a separate Stats API Auth Token for each model account. Add each username and token in the app.

The worker only accepts POST requests to `/stats`, forwards credentials to the fixed `https://chaturbate.com/statsapi/` endpoint, and returns `token_balance`. Credentials are sent over HTTPS and are not logged or persisted by this code. The app stores them locally in the browser; do not enter them on a shared device.