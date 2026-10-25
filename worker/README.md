# Chaturbate and Stripchat Stats API proxy

This Worker keeps the API requests out of the GitHub Pages browser app and enables CORS only for `https://adelgallego.github.io`. It does not store API keys, Chaturbate tokens, or earnings data.

## Routes

- `POST /stats`: forwards username and API Auth Token to the official Chaturbate Stats API and returns `token_balance`.
- `POST /stripchat/stats`: forwards a Studio API key in the `API-Key` header to the official Stripchat Studio Stats API and returns `totalEarnings` as `token_balance`.

## Deploy / update

1. Open the Worker project directory and run `wrangler login` then `wrangler deploy`, or replace the code in Cloudflare Dashboard > Workers & Pages > your Worker > Edit code and select Deploy.
2. For Chaturbate, use the deployed Worker URL ending in `/stats`.
3. For Stripchat, use the same Worker URL ending in `/stripchat/stats`.
4. In the GRUPODGH app, add the Chaturbate API Auth Token per model. For Stripchat, enter the Studio username, model username, and API-Key issued by Stripchat at `https://stripchat.com/studio/api`.

Studio API keys and model usernames are stored in the app's local browser storage, are sent to this Worker over HTTPS when syncing, and are excluded from app backup files. This code does not log or persist them.
