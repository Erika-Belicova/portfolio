
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/',
  locale: undefined,
  routes: undefined,
  entryPointToBrowserMapping: {},
  assets: {
    'index.csr.html': {size: 2727, hash: 'a13d7e60859ca16913b5ee06f81d8a02c42f24801b3d553a825a5b3ddf732e49', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 1113, hash: '73fef94626b36c304ee37004e46ff839f424ec0296b73a52ced52dd8ba09b671', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'main-IIO3AIVH.css': {size: 26054, hash: '3KMEVki9tus', text: () => import('./assets-chunks/main-IIO3AIVH_css.mjs').then(m => m.default)},
    'styles-XX6TR62Z.css': {size: 39535, hash: '84SXnSoE7PA', text: () => import('./assets-chunks/styles-XX6TR62Z_css.mjs').then(m => m.default)}
  },
};
