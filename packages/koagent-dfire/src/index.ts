import Koa from 'koa';
import KoaRouter from 'koa-router';
import debug from 'debug';
import Koagent, { koagentLogger } from 'koagent';
import KoagentServer from 'koagent-server';
import DifreProxyLocalMananger from './dfireProxyLocal';

debug.enable('*');

const log = debug('koagent-dfire');

export default async (koagent: Koagent) => {
  const proxyLocalMananger = new DifreProxyLocalMananger();
  const localProxyServer = await KoagentServer.createServer({ certService: koagent.certService });
  const localProxyApp = new Koa;
  localProxyApp.use(koagentLogger());
  localProxyApp.use(proxyLocalMananger.forward());
  localProxyApp.on('error', (err) => {
    log('proxyApp error', err);
  });
  localProxyServer.onRequest(localProxyApp.callback());
  localProxyServer.onError(localProxyApp.onerror);
  localProxyServer.listen(3000, () => {
    log('proxy listen', 3000);
  });

  const router = new KoaRouter();
  router.get('/', (ctx) => {
    ctx.body = proxyLocalMananger.getProjects();
  });
  router.put('/forward/:projectName', (ctx) => {
    proxyLocalMananger.addForward(ctx.params.projectName);
    ctx.response.status = 200;
  });
  router.delete('/forward/:projectName', (ctx) => {
    proxyLocalMananger.removeForward(ctx.params.projectName);
    ctx.response.status = 200;
  });

  koagent.managerRouter.use('/localProxy', router.routes(), router.allowedMethods());
  return () => {};
};
