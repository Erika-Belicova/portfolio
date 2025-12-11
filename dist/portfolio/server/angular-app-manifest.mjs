
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/',
  locale: undefined,
  routes: undefined,
  entryPointToBrowserMapping: {},
  assets: {
    'index.csr.html': {size: 2727, hash: '07b0fec1dc5c7542a1835a4613666602b7b0c59b24a21382b8df01b78ed29b8f', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 1113, hash: 'b5671c6f689ce3c9462d607e942fdcb9cf74bea4d3cab9555bf7cd6b742a29cb', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'main-IIO3AIVH.css': {size: 26054, hash: '3KMEVki9tus', text: () => import('./assets-chunks/main-IIO3AIVH_css.mjs').then(m => m.default)},
    'styles-XX6TR62Z.css': {size: 39535, hash: '84SXnSoE7PA', text: () => import('./assets-chunks/styles-XX6TR62Z_css.mjs').then(m => m.default)}
  },
};
