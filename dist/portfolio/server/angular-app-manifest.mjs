
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/',
  locale: undefined,
  routes: undefined,
  entryPointToBrowserMapping: {},
  assets: {
    'index.csr.html': {size: 2727, hash: 'f1278ad5a2e2e87377d31b197b65f957749a85b6352f914a8a8852ab561f1bae', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 1113, hash: 'cd0df0396c82aff53d3f73e34182b6ecfe32447754a8a6e771b80251bd62fcae', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'main-IIO3AIVH.css': {size: 26054, hash: '3KMEVki9tus', text: () => import('./assets-chunks/main-IIO3AIVH_css.mjs').then(m => m.default)},
    'styles-7SZADNC4.css': {size: 52816, hash: 'a6BNfRbg72g', text: () => import('./assets-chunks/styles-7SZADNC4_css.mjs').then(m => m.default)}
  },
};
