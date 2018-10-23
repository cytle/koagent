import Koa from 'koa';
import KoaRouter from 'koa-router';
import httpProxy from 'koagent-http-proxy';
import debug from 'debug';

const log = debug('koagent:koaApp');
export default function createKoaApp(router: KoaRouter): Koa {
  const app = new Koa();

  app.use(async (ctx, next: Function) => {
    try {
      log('logger', ctx.req.url);

      await next();
      log('logger:finished', ctx.res.finished);
      log('logger:body', ctx.response);
    } catch (error) {
      log('logger:error', error);
    }
  });

  app.use(router.routes());
  app.use(httpProxy({}));

  return app;
}
