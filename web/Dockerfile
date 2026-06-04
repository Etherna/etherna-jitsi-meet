ARG JITSI_REPO=jitsi
ARG BASE_TAG=latest
FROM ${JITSI_REPO}/base:${BASE_TAG}

LABEL org.opencontainers.image.title="Etherna Jitsi Meet (web)"
LABEL org.opencontainers.image.description="Etherna-branded Jitsi Meet web frontend. WebRTC video conferences with Etherna visual identity."
LABEL org.opencontainers.image.url="https://etherna.io/"
LABEL org.opencontainers.image.source="https://github.com/Etherna/etherna-jitsi-meet"
LABEL org.opencontainers.image.documentation="https://jitsi.github.io/handbook/"
LABEL org.opencontainers.image.vendor="Etherna"

ADD https://raw.githubusercontent.com/acmesh-official/acme.sh/3.0.7/acme.sh /opt
COPY rootfs/ /

RUN apt-dpkg-wrap apt-get update && \
    apt-dpkg-wrap apt-get install -y dnsutils cron nginx-extras jitsi-meet-web socat curl jq && \
    mv /usr/share/jitsi-meet/interface_config.js /defaults && \
    rm -f /etc/nginx/conf.d/default.conf && \
    apt-cleanup

# --- Etherna branding (baked into the image) ---
# Override package assets under /usr/share/jitsi-meet, append brand CSS and
# interface_config defaults, and rebrand the static title/manifest.
# Copied after the apt layer so branding edits don't bust the package cache.
COPY etherna/ /tmp/etherna/
RUN set -e; \
    cp -f /tmp/etherna/images/* /usr/share/jitsi-meet/images/; \
    cp -f /tmp/etherna/images/favicon.ico /usr/share/jitsi-meet/favicon.ico; \
    cp -f /tmp/etherna/title.html /usr/share/jitsi-meet/title.html; \
    cat /tmp/etherna/css/etherna.css >> /usr/share/jitsi-meet/css/all.css; \
    cat /tmp/etherna/interface_config.append.js >> /defaults/interface_config.js; \
    sed -i 's#("welcome-page"),document.title=interfaceConfig.APP_NAME#("welcome-page"),document.title="Join etherna"#' \
        /usr/share/jitsi-meet/libs/app.bundle.min.js; \
    sed -i 's/.Env.DISABLE_DEEP_LINKING | default "false"/.Env.DISABLE_DEEP_LINKING | default "true"/' \
        /defaults/settings-config.js; \
    if [ -f /usr/share/jitsi-meet/pwa-worker.js ]; then \
        sed -i "s#self.addEventListener('fetch', event => {#&\n    try { if (new URL(event.request.url).pathname.startsWith('/recordings/')) return; } catch (e) {}#" \
            /usr/share/jitsi-meet/pwa-worker.js; \
    fi; \
    if [ -f /usr/share/jitsi-meet/manifest.json ]; then \
        sed -i 's/Jitsi Meet/Etherna/g' /usr/share/jitsi-meet/manifest.json; \
    fi; \
    rm -rf /tmp/etherna

EXPOSE 80 443

VOLUME ["/config", "/usr/share/jitsi-meet/transcripts"]
