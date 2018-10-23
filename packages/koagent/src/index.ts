import debug from 'debug';
import createCertificateService from 'koagent-certificate';
import KoaRouter from 'koa-router';
import getPort from 'get-port';
import Server from './servers';
import createKoaApp from './createKoaApp';
import config from './config';

debug.enable('koagent:*');

const log = debug('koagent:App');
Promise.resolve().then(async () => {
  const router = new KoaRouter();
  const app = createKoaApp(router);
  const certService = createCertificateService({
    storagePath: config.certifacateStoragePath,
    rootKey: config.certifacateRootKey,
  });

  const selfRouter = new KoaRouter();
  selfRouter.get('/rootCA', async (ctx) => {
    ctx.set('Content-disposition', 'attachment;filename=koagentCA.crt');
    ctx.body = (await certService.getRoot()).cert;
  });
  router.use('/certificate', selfRouter.routes(), selfRouter.allowedMethods());

  const httpPort = 3000;
  const httpsPort = await getPort();

  const server = new Server(certService, httpsPort, httpPort);
  await server.create();
  server.onRequest(app.callback());
  server.onError((error) => {
    log('error', error);
  });
  server.listen(httpPort, () => {
    log('listen', httpPort);
  });
});
