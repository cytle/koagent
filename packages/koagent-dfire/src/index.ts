import Koa from 'koa';
import KoaRouter from 'koa-router';
import debug from 'debug';
import Koagent, { koagentLogger } from 'koagent';
import DifreProxyLocalMananger from './dfireProxyLocal';

debug.enable('*');

const log = debug('koagent-dfire');

Promise.resolve().then(async () => {
  const koagent = await Koagent.create();
  const proxyLocalMananger = new DifreProxyLocalMananger();

  koagent.proxyApp.use(koagentLogger());
  koagent.proxyApp.use(proxyLocalMananger.forward());
  koagent.proxyServer.listen(3000, () => {
    log('proxy listen', 3000);
  });
  koagent.proxyApp.on('error', (err) => {
    log('proxyApp error', err);
  });

  const app = new Koa();
  const router = new KoaRouter();
  router.get('/proxyLocal', (ctx) => {
    ctx.body = proxyLocalMananger.getProjects();
  });
  router.put('/proxyLocal/forward/:projectName', (ctx) => {
    proxyLocalMananger.addForward(ctx.params.projectName);
    ctx.response.status = 200;
  });
  router.delete('/proxyLocal/forward/:projectName', (ctx) => {
    proxyLocalMananger.removeForward(ctx.params.projectName);
    ctx.response.status = 200;
  });

  app.use(router.routes());
  app.listen(3001, () => {
    log('manager listen', 3001);
  });
  app.on('error', (err) => {
    log('managerApp error', err);
  });
});
