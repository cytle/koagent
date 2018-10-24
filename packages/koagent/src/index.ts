import debug from 'debug';
import { KoangetServer } from './servers';
import config from './config';
import Koa from 'koa';
import KoaRouter from 'koa-router';
import httpProxy from '../../koagent-http-proxy';
import certificate, { createCertificateService } from '../../koagent-certificate';
import logger from './middlewares/logger';

debug.enable('koagent:*');

Promise.resolve().then(async () => {
  const certService = createCertificateService({
    storagePath: config.certifacateStoragePath,
    rootKey: config.certifacateRootKey,
  });
  const app = new Koa();
  const router = new KoaRouter();
  const koagentContext = {
    app,
    router,
    certService,
  };
  app.use(certificate(koagentContext));
  app.use(logger(koagentContext));
  app.use(router.routes());
  app.use(httpProxy(koagentContext));

  const server = await KoangetServer.createServer({
    certService,
  });

  server
    .onRequest(app.callback())
    .onError(app.onerror)
    .listen(3000, () => {
      console.log('listen', 3000);
    });
});
