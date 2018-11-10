import path from 'path';
import Koa from 'koa';
import KoaRouter from 'koa-router';
import DifreProxyLocalMananger from './dfireProxyLocal';
import DfireProxyLocalServer from './DfireProxyLocalServer';
import { createCertificateService } from 'koagent-certificate';
import koaStatic from 'koa-static';
import koaLogger from 'koa-logger';
import debug from 'debug';
import defaultConfig from './config';

debug.enable('*');

export default async function koagentDifre() {
  const proxyLocalMananger = new DifreProxyLocalMananger();

  const certService = createCertificateService({
    storagePath: defaultConfig.certifacateStoragePath,
    rootKey: defaultConfig.certifacateRootKey,
  });
  const proxyLocalServer = await DfireProxyLocalServer.createServer({
    certService,
    mananger: proxyLocalMananger,
  });

  proxyLocalServer.listen(30001);

  const router = new KoaRouter({
    prefix: '/api/localProxy',
  });
  router.get('/server', (ctx) => {
    console.log(ctx.req.headers);
    console.log(ctx.req.url);
    ctx.body = proxyLocalServer.getState();
  });
  router.get('/projects', (ctx) => {
    ctx.body = proxyLocalMananger.getProjects();
  });
  router.put('/forward', (ctx) => {
    proxyLocalMananger.addForward(ctx.query.projectName);
    ctx.response.status = 200;
  });
  router.delete('/forward', (ctx) => {
    proxyLocalMananger.removeForward(ctx.query.projectName);
    ctx.response.status = 200;
  });
  const app = new Koa();
  app
    .use(koaLogger((str) => {
      console.log('[manager]', str);
    }))
    .use(koaStatic(path.join(__dirname, '..', 'dist', 'client')))
    .use(router.routes())
    .use(router.allowedMethods());

  app.listen(30000);
}

koagentDifre();
