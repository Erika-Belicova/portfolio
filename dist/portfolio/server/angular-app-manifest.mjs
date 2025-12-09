
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/',
  locale: undefined,
  routes: undefined,
  entryPointToBrowserMapping: {},
  assets: {
    'index.csr.html': {size: 2727, hash: '5bfc8ffe182d30825182997a6dc26bd3101742162cdca1cca4295bf6ddb22429', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 1113, hash: '1306bb6d90eb213ee5b942e9873dfb3d62e96cb366974ef2a2f614bc68b769c1', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'main-IIO3AIVH.css': {size: 26054, hash: '3KMEVki9tus', text: () => import('./assets-chunks/main-IIO3AIVH_css.mjs').then(m => m.default)},
    'styles-XX6TR62Z.css': {size: 39535, hash: '84SXnSoE7PA', text: () => import('./assets-chunks/styles-XX6TR62Z_css.mjs').then(m => m.default)}
  },
};
