import KoaRouter from 'koa-router';
import Koagent from 'koagent';
import DifreProxyLocalMananger from './dfireProxyLocal';
import DfireProxyLocalServer from './DfireProxyLocalServer';

export default async (koagent: Koagent) => {
  const proxyLocalMananger = new DifreProxyLocalMananger();
  const proxyLocalServer = await DfireProxyLocalServer.createServer({
    certService: koagent.certService,
    mananger: proxyLocalMananger,
  });

  proxyLocalServer.listen(30001);

  const router = new KoaRouter();
  router.get('/server', (ctx) => {
    ctx.body = proxyLocalServer.getState();
  });
  router.get('/projects', (ctx) => {
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
