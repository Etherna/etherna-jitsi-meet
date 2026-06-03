# Etherna Jitsi Meet

Etherna-branded fork of [`jitsi/docker-jitsi-meet`](https://github.com/jitsi/docker-jitsi-meet).

Only the **`web`** image carries Etherna branding (logo, watermark, favicon,
welcome page, brand colour `#00AABE`). Every other component
(prosody / jicofo / jvb / jibri / jigasi) reuses the upstream `jitsi/*` images
at the same stable version, so this fork stays trivial to keep in sync.

## Branches

- **`master`** — clean mirror of upstream `jitsi/master`. Do not commit branding
  here. Update with:
  ```bash
  git fetch jitsi
  git checkout master && git merge --ff-only jitsi/master
  ```
- **`etherna`** — production branch: latest upstream **stable** + Etherna
  branding. Pushing here triggers the CI that builds and publishes the image.

## Where the branding lives

All branding is baked into the `web` image at build time (`web/Dockerfile`):

| File | Purpose |
|---|---|
| `web/etherna/images/watermark.svg` | conference watermark (white Etherna symbol) |
| `web/etherna/images/welcome-logo.svg` | welcome-page hero logo (symbol + lettering + "Eyes Wide Open" payoff) |
| `web/etherna/images/welcome-background.jpg` | welcome-page background (light beam over water) |
| `web/etherna/images/favicon.svg`, `favicon.ico`, `apple-touch-icon.png` | browser/app icons |
| `web/etherna/images/jitsilogo.png` | social/OpenGraph preview image |
| `web/etherna/title.html` | page `<title>` ("Join etherna"), favicon link, OpenGraph/meta |
| `web/etherna/css/etherna.css` | appended to `css/all.css` (brand accents + welcome hero restyle) |
| `web/etherna/interface_config.append.js` | appended to `interface_config.js` (`APP_NAME`, logos, watermark) |
| `web/etherna/BASE_TAG` | upstream stable version this branch tracks (e.g. `stable-10978`) |

The `web/Dockerfile` also: appends the CSS to `css/all.css`, appends the
interface_config overrides, sets the welcome-page browser-tab title to
"Join etherna" (one targeted patch of `app.bundle.min.js`), and renames the
PWA manifest to "Etherna".

Colours come from `#00AABE` / the brand SVGs — never sampled from the master
JPGs (a known colour error renders them mint-green).

**Localization is preserved**: no language files are modified, so jitsi's
automatic browser-language detection (e.g. Italian) keeps working. The header
shows the logo image, not translated text, so it is language-independent.

## CI / publishing

`.github/workflows/etherna-web.yml` runs on every push to `etherna` (and on
`etherna-*` tags / manual dispatch). It builds the `web` image multi-arch
(`linux/amd64,linux/arm64`) **FROM `jitsi/base:<BASE_TAG>`** and pushes:

- `etherna/jitsi-web:latest`
- `etherna/jitsi-web:stable` (rolling, matches the upstream `:stable` tag used by the other components)
- `etherna/jitsi-web:<BASE_TAG>` (e.g. `etherna/jitsi-web:stable-10978`)
- `etherna/jitsi-web:<BASE_TAG>-<short-sha>`

**Required secrets** — the organisation-level secrets (available to all Etherna repos):

- `DOCKER_USERNAME` — Docker Hub user with push access to the `etherna` namespace
- `DOCKER_PASSWORD` — Docker Hub access token / password for that user

Pull requests only build (no push) as a smoke test.

## Run in production

```bash
cp env.example .env
./gen-passwords.sh
# edit .env: set PUBLIC_URL, TZ, enable Let's Encrypt, etc.

export JITSI_IMAGE_VERSION=stable-10978   # upstream images
export ETHERNA_WEB_VERSION=stable-10978   # Etherna-branded web image
docker compose -f docker-compose.yml -f docker-compose.etherna.yml up -d
```

The welcome page is enabled by default (`ENABLE_WELCOME_PAGE=true`).

## Bumping the upstream version

1. `git checkout etherna`
2. `git merge stable-XXXX` (the new upstream stable tag), resolving the tiny
   conflict in `web/Dockerfile` if any.
3. Update `web/etherna/BASE_TAG` to `stable-XXXX`.
4. Commit & push → CI publishes `etherna/jitsi-web:stable-XXXX`.
