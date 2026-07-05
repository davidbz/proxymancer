# Proxymancer

A deliberately minimal Chromium based browsers (Manifest V3) extension that does exactly one
thing: manage the browser's forward-proxy settings from the toolbar. Set a proxy
address and a bypass list in the icon popup; toggle it on to route traffic
through the proxy, off to hand control back to the operating system.

It exists because a proxy switcher should be small enough to read in full and
trust. There is no framework, no telemetry, and no runtime dependencies at all.
The entire extension is a hand-written manifest, a service worker, and a popup.

## What it does

- Configure a forward proxy: scheme (`http` / `https` / `socks4` / `socks5`),
  host, and port.
- Maintain a bypass list (one entry per line) for hosts that should skip the
  proxy.
- Enable or disable with a single toggle. When disabled, Proxymancer applies
  `system` mode so the browser follows the OS proxy configuration.
- Persist settings via `chrome.storage.sync`; the service worker re-applies them
  on install, on browser startup, and whenever they change.

The extension requests only two permissions: `proxy` and `storage`. It requests
no host permissions and performs no network requests of its own.

## Requirements

- Node.js 22+
- Chrome 120+ (or a Chromium-based browser of equivalent version)

A devcontainer is included (`.devcontainer/`) that provisions the toolchain and
runs `npm install` automatically.

## Getting started

```bash
npm install
npm run build
```

Then load the extension unpacked:

1. Open `chrome://extensions`.
2. Enable Developer mode.
3. Choose "Load unpacked" and select the `dist/` directory.
4. Open the Proxymancer toolbar icon and enter proxy details. Changes save
   automatically.

## Commands

| Command | Description |
| --- | --- |
| `npm run build` | Bundle the extension into `dist/` with esbuild. |
| `npm run dev` | Rebuild on change (watch mode). Reload the unpacked extension after each build. |
| `npm run test` | Run the unit tests with Vitest. |
| `npm run lint` | Check formatting and lint rules with Biome. |
| `npm run format` | Apply formatting fixes with Biome. |
| `npm run typecheck` | Type-check the source with `tsc --noEmit`. |
| `npm run package` | Build, then produce a signed `proxymancer.crx`. |
| `npm run clean` | Remove `dist/` and `proxymancer.crx` (the signing key is kept). |

## Project layout

```
src/manifest.json    Manifest V3 definition (permissions: proxy, storage)
src/proxy.ts         Pure settings-to-ProxyConfig logic (unit tested)
src/background.ts    Service worker: bridges storage and chrome.proxy
src/popup.html       Popup markup
src/popup.ts         Popup logic: load and save settings
src/log.ts           Minimal, dependency-free console logging wrapper
scripts/build.mjs    esbuild build (supports --watch)
scripts/pack.mjs     crx3 packaging into a signed .crx
```

All proxy-config decisions live in `src/proxy.ts` as pure functions that never
touch the `chrome.*` APIs, so they can be tested without a browser mock.
`src/background.ts` is the thin layer that connects that logic to
`chrome.proxy.settings.set`.

## Packaging

`npm run package` builds and then produces two artifacts:

- `proxymancer.zip` — the Chrome Web Store upload (manifest at the archive root).
- `proxymancer.crx` — a signed package for self-hosting or enterprise installs.

On the first run it generates `key.pem`; subsequent runs reuse it so the
extension ID stays stable. `key.pem`, `*.crx`, and `*.zip` are gitignored — keep
`key.pem` private.

A self-signed `.crx` installs only via developer mode or an enterprise policy. A
standard, locked-down Chrome will report `CRX_REQUIRED_PROOF_MISSING` for any
extension not distributed through the Chrome Web Store; this is expected. For
day-to-day development, load the `dist/` directory unpacked.

## Icons

Placeholder icons live in `src/icons/` (16/32/48/128 px) and are referenced by
the manifest's `icons` and `action.default_icon`. They are plain brand-colored
placeholders — replace them with real artwork before publishing. The build
copies `src/icons/` into `dist/` automatically.

## Publishing to the Chrome Web Store

See [Chrome's prepare guide](https://developer.chrome.com/docs/webstore/prepare).
Ready in this repo:

- Manifest V3 with `name`, `version`, `description` (81 chars, under the 132
  limit), and `icons` (128 px included) — no comments in the JSON.
- `npm run package` emits a store-ready `proxymancer.zip` with the manifest at
  the root.
- Single, narrow purpose and a minimal permission set (`proxy`, `storage`; no
  host permissions).

Still required before submitting (done in the Web Store dashboard, not this
repo):

- A Chrome Web Store developer account and a one-time registration fee.
- Real 128x128 store icon and artwork (replace the placeholders).
- At least one screenshot (1280x800 or 640x400; up to 5).
- A small promo tile (440x280). Marquee tile (1400x560) is optional.
- Store listing text: detailed description and a category.
- Privacy disclosures: a single-purpose description, a justification for the
  `proxy` permission, and data-use declarations (this extension collects and
  transmits no user data). A privacy policy is provided in [PRIVACY.md](PRIVACY.md);
  host it at a public URL and link it in the dashboard.

## Toolchain

- TypeScript compiled and bundled by esbuild
- Biome for linting and formatting (one tool)
- Vitest for unit tests
- crx3 for packaging
- Zero runtime dependencies (all tooling is dev-only)

## License

Apache License 2.0. See [LICENSE](LICENSE).
