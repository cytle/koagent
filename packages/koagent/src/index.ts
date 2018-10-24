import debug from 'debug';
import { KoangetServer } from './servers';
import config from './config';
import Koa from 'koa';
import KoaRouter from 'koa-router';
// import httpProxy from 'koagent-http-proxy';
import httpProxy from '../../koagent-http-proxy';
import certificate, { createCertificateService } from 'koagent-certificate';
import logger from './middlewares/logger';
// import renderFoo from './middlewares/renderFoo';
// import tunnel from './middlewares/tunnel';

debug.enable('*');

const log = debug('koagent');

Promise.resolve().then(async () => {
  const certService = createCertificateService({
    storagePath: config.certifacateStoragePath,
    rootKey: config.certifacateRootKey,
  });
  const managerApp = new Koa();
  const router = new KoaRouter();
  managerApp.use(router.routes());
  managerApp.listen(3001, () => {
    log('manager listen', 3001);
  });

  const proxyApp = new Koa();
  const koagentContext = {
    managerApp,
    proxyApp,
    router,
    certService,
  };
  proxyApp.use(certificate(koagentContext));
  // proxyApp.use(tunnel(koagentContext));
  proxyApp.use(logger(koagentContext));
  // proxyApp.use(renderFoo());
  proxyApp.use(httpProxy(koagentContext));

  const server = await KoangetServer.createServer({
    certService,
  });

  server
    .onRequest(proxyApp.callback())
    .onError(proxyApp.onerror)
    .listen(3000, () => {
      log('proxy listen', 3000);
    });

  proxyApp.on('error', (err) => {
    log('proxyApp error', err);
  });

  managerApp.on('error', (err) => {
    log('managerApp error', err);
  });
});
