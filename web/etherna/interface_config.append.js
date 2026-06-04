// === Etherna branding overrides ===
// Appended to the default interface_config.js at image build time
// (see web/Dockerfile). Mutates the global `interfaceConfig` object.
// Only branding is changed; jitsi's welcome-page structure is left intact.

interfaceConfig.APP_NAME = 'Etherna';
interfaceConfig.NATIVE_APP_NAME = 'Etherna';
interfaceConfig.PROVIDER_NAME = 'Etherna';

// Logo (welcome header watermark + in-conference watermark) -> Etherna logo.
// The image itself is overridden in /usr/share/jitsi-meet/images/watermark.svg.
interfaceConfig.DEFAULT_LOGO_URL = 'images/watermark.svg';
interfaceConfig.DEFAULT_WELCOME_PAGE_LOGO_URL = 'images/watermark.svg';
interfaceConfig.SHOW_JITSI_WATERMARK = true;
// In-conference watermark links to this instance's own home (e.g.
// https://join.etherna.io/), not the corporate site. Relative so it follows
// whatever domain the instance is served on.
interfaceConfig.JITSI_WATERMARK_LINK = '/';

// No secondary brand watermark / "powered by".
interfaceConfig.SHOW_BRAND_WATERMARK = false;
interfaceConfig.BRAND_WATERMARK_LINK = '';
interfaceConfig.SHOW_POWERED_BY = false;

// Dark background -> contrast with the white logo (brand: white on dark).
interfaceConfig.DEFAULT_BACKGROUND = '#101820';
