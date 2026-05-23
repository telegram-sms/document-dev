# Config Transfer API

Telegram SMS uses a small Cloudflare Worker (`cf-kv-storage`) as a **short-lived, encrypted config-transfer relay**. It lets the web [Config Generator](https://config.telegram-sms.com/) and the Android app's *Transfer config* feature (`TransferConfigActivity`) exchange configuration without a persistent backend or user accounts.

The relay never sees plaintext. The client encrypts the configuration locally and uploads only the opaque ciphertext; the server stores it under a short, human-shareable key and returns it exactly once. Security comes from three layers working together:

1. **Client-side encryption** — the payload is encrypted before upload (libsodium SecretBox, the same `Crypto` scheme the app uses elsewhere).
2. **Short TTL** — config entries expire after **1 hour**.
3. **One-time read** — fetching a config deletes it immediately, so a key can only be redeemed once.

The key itself is intentionally short and is *not* a secret; it is meant to be typed or scanned between two of your own devices within a few minutes.

## Tech stack

- **Cloudflare Workers** — serverless runtime
- **itty-router** (`AutoRouter`) — routing + CORS (`preflight` / `corsify`)
- **Workers KV** — storage for the encrypted blobs
- **TypeScript**, tested with **Vitest** (`@cloudflare/vitest-pool-workers`), deployed with **Wrangler**

The entire service is two source files: `src/index.ts` (routes) and `src/snowflake.ts` (key generator).

## Endpoints

| Method & path        | KV namespace      | TTL    | Read behaviour        | Used by                          |
| -------------------- | ----------------- | ------ | --------------------- | -------------------------------- |
| `GET /`              | —                 | —      | 302 → telegram-sms.com | —                                |
| `PUT /config`        | `telegram_config` | 1 hour | —                     | Upload main app config           |
| `GET /config?key=`   | `telegram_config` | —      | one-time (deletes)    | Download main app config         |
| `PUT /cc-config`     | `cc_config`       | 1 hour | —                     | Upload Carbon Copy config        |
| `GET /cc-config?key=`| `cc_config`       | —      | one-time (deletes)    | Download Carbon Copy config      |
| `POST /log`          | `telegram_log`    | none   | no read route         | Upload diagnostic log (write-only) |

### Upload (`PUT /config`, `PUT /cc-config`)

Body is a JSON object whose `encrypt` field holds the already-encrypted blob. The Worker generates a key, stores the blob with a 1-hour TTL, and returns the key.

```bash
curl -X PUT https://<worker-host>/config \
     -H "Content-Type: application/json" \
     -d '{"encrypt": "<client-encrypted-config>"}'
# → {"key":"abc123xyz"}
```

### Download (`GET /config`, `GET /cc-config`)

Pass the key as the `key` query parameter. The Worker returns the stored blob **and deletes it**, so a second request with the same key returns `404 Value not found`.

```bash
curl "https://<worker-host>/config?key=abc123xyz"
# → <client-encrypted-config>   (then the key is gone)
```

### Diagnostic log (`POST /log`)

Stores an encrypted blob in `telegram_log` and returns a key. There is intentionally **no read route** and **no TTL** on this namespace — it is a write-only sink for diagnostics inspected out-of-band.

## Key generation

Keys come from `Snowflake.generateKey()` (`src/snowflake.ts`), a singleton that builds a base-36 string from a **21-bit timestamp + 13-bit sequence** (Snowflake-style), right-padded with random `[A-Za-z0-9]` characters to a fixed **9 characters**. The result is short enough to read aloud or scan, which is the whole point — it is a transient handle, not a credential.

## CORS

`cors()` is configured in `src/index.ts`:

- **Allowed origins:** `http://localhost:5173` (local Config Generator dev) and `https://config.telegram-sms.com`
- **Allowed methods:** `GET`, `PUT`
- **Allowed headers:** `Content-Type`

> Because `allowMethods` lists only `GET` and `PUT`, the `POST /log` route is **not** reachable cross-origin from the config site under the current configuration.

## KV bindings

`wrangler.toml` declares two namespaces:

```toml
[[kv_namespaces]]
binding = "telegram_config"
id = "..."

[[kv_namespaces]]
binding = "cc_config"
id = "..."
```

> **Known gap:** `telegram_log` is referenced by `POST /log` but is **not** declared in `wrangler.toml`. The `/log` route will fail until a `telegram_log` binding is added.

## Develop, test, deploy

```bash
npm run dev        # wrangler dev — local server
npm test           # vitest
npm run deploy     # wrangler deploy
npm run cf-typegen # regenerate Worker type definitions
```

> The checked-in `test/index.spec.ts` is still the `create-cloudflare` "Hello World!" template and does not cover the real routes; it needs to be rewritten.

## How it fits the app

The Android *Transfer config* flow and the web Config Generator both encrypt the config locally, `PUT` it here, and surface the returned key (often as a QR code). The receiving device redeems the key once via `GET`, decrypts locally, and applies the config. The relay only ever holds opaque ciphertext for at most an hour, and only until it is read once.
