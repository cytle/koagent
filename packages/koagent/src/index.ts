import { HttpsServer } from './servers';
import certificate from 'koagent-certificate';
import KoaRouter from 'koa-router';
// import getPort from 'get-port';
import { connectHandler } from './handlers/connect';
import createKoaApp from './createKoaApp';
import config from './config';

Promise.resolve().then(async () => {
  const router = new KoaRouter();
  const app = createKoaApp(router);

  certificate(app, router, {
    storagePath: config.certifacateStoragePath,
    rootKey: config.certifacateRootKey,
  });

  const server = new HttpsServer();
  await server.create();
  server.onRequest(app.callback());
  server.onConnect(connectHandler);
  server.listen(3000);
});

// http.createServer(app.callback()).on('connect', connect).listen(3000, '0.0.0.0');
