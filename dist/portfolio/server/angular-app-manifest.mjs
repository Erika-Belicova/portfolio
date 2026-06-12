
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/',
  locale: undefined,
  routes: undefined,
  entryPointToBrowserMapping: {},
  assets: {
    'index.csr.html': {size: 2829, hash: '3422f053951b12fa7a5f69f7a645e4c5ccfc77beaa5a12de744988c36456a8b7', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 1216, hash: 'c03caeceb4d9adf1b6031412c8f0c68698022e01bec87157362b3c3de1c2e360', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'main-IIO3AIVH.css': {size: 26054, hash: '3KMEVki9tus', text: () => import('./assets-chunks/main-IIO3AIVH_css.mjs').then(m => m.default)},
    'styles-ZFM5XDMQ.css': {size: 39574, hash: 'HmMkQGzHorc', text: () => import('./assets-chunks/styles-ZFM5XDMQ_css.mjs').then(m => m.default)}
  },
};
