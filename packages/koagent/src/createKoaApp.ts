import Koa from 'koa';
import KoaRouter from 'koa-router';
import httpProxy from 'koagent-http-proxy';

export default function createKoaApp(router: KoaRouter): Koa {
  const app = new Koa();

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

  return app;
}
