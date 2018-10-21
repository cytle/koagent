import Koa from 'koa';
import KoaRouter from 'koa-router';
import getPort from 'get-port';
import certificate from 'koagent-certificate';
import httpProxy from 'koagent-http-proxy';
import config from './config';

export default async function createKoaApp(router: KoaRouter): Promise<Koa> {
  const app = new Koa();

  certificate(app, router, {
    storagePath: config.certifacateStoragePath,
    rootKey: config.certifacateRootKey,
    encoding: 'utf-8',
  });

  app.use(async (ctx, next: Function) => {
    try {
      console.log(ctx.request.url);
      await next();
      console.log('resolve', ctx.res.finished);
    } catch (error) {
      console.error(error);
    }
  });

  app.use(router.routes());
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
