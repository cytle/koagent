import Koa from 'koa';
import getPort from 'get-port';
import certificate from '../middleware/certificate';
import httpProxy from '../middleware/httpProxy';
import config from '../config';

export default function createKoaApp() {
  const app = new Koa();
  certificate(app, {
    storagePath: config.certifacateStoragePath,
    rootKey: config.certifacateRootKey,
    encoding: 'utf-8',
  });
  app.use(async (ctx, next: Function) => {
    console.log(ctx.request.url);
    await next();
    console.log('resolve', ctx.res.finished);
  });

  app.use(httpProxy({}));

  return new Promise(async (resolve, reject) => {
    app.listen(
      await getPort({ port: 3000 }),
      (error?: Error) => error ? reject(error) : resolve(app),
    );
  });
}
