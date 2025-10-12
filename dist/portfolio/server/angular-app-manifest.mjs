
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/',
  locale: undefined,
  routes: undefined,
  entryPointToBrowserMapping: {},
  assets: {
    'index.csr.html': {size: 2727, hash: 'bea4e26170b7e830568c2cd27ec3258c9f5f28d2b275df9bddf5d7f5c54d7dcf', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 1113, hash: 'a7962a85657b3f5627f9bb770b08a27a2dca5c31bac5fbf91e8d735a48f0a11d', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'main-IIO3AIVH.css': {size: 26054, hash: '3KMEVki9tus', text: () => import('./assets-chunks/main-IIO3AIVH_css.mjs').then(m => m.default)},
    'styles-ECXQVPFA.css': {size: 40630, hash: '85W/ydbPGR4', text: () => import('./assets-chunks/styles-ECXQVPFA_css.mjs').then(m => m.default)}
  },
};
