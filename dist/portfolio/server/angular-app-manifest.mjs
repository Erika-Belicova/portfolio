
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/',
  locale: undefined,
  routes: undefined,
  entryPointToBrowserMapping: {},
  assets: {
    'index.csr.html': {size: 2727, hash: 'ace74072973dd312d20840aecdc39afedcdc9b4753da14b429c923c2db8b7c97', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 1113, hash: 'c6c8389cad082d985ba4da3fc5fae92a4ed294ae05fdb3d1513f9b32cb9f0e20', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'main-IIO3AIVH.css': {size: 26054, hash: '3KMEVki9tus', text: () => import('./assets-chunks/main-IIO3AIVH_css.mjs').then(m => m.default)},
    'styles-IHGIFIPL.css': {size: 40666, hash: 'noKChjKefP4', text: () => import('./assets-chunks/styles-IHGIFIPL_css.mjs').then(m => m.default)}
  },
};
