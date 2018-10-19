import Koa from 'koa';
import getPort from 'get-port';
import certificate from '../middleware/certificate';
import httpProxy from '../middleware/httpProxy';
import config from '../config';

export default async function createKoaApp(): Promise<Koa> {
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
  const port = await getPort({ port: 3000 });

  await new Promise(async (resolve, reject) => {
    app.listen(
      port,
      (error?: Error) => error ? reject(error) : resolve(),
    );
  });
  console.log(`listen ${port}`);
  return app;
}
