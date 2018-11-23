import path from 'path';
import KoangetServer from 'koagent-server';
import Koa from 'koa';
import KoaRouter from 'koa-router';
import { createCertificateService, ICertificateService } from 'koagent-certificate';
import koaStatic from 'koa-static';
import koaLogger from 'koa-logger';
// import koaMount from 'koa-mount';

import defaultConfig from './config';

export default class Koagent {
  public static async create() {
    const koagent = new Koagent();
    await koagent.init();
    return koagent;
  }
  public proxyApp: Koa;
  public managerApp: Koa;
  public managerRouter: KoaRouter;
  public proxyServer: KoangetServer;
  public certService: ICertificateService;
  constructor() {
    this.certService = createCertificateService({
      storagePath: defaultConfig.certifacateStoragePath,
      rootKey: defaultConfig.certifacateRootKey,
    });
    this.proxyApp = new Koa();

    this.proxyApp
      .use(koaLogger((str) => {
        console.log('[proxy]', str);
      }));
    this.managerApp = new Koa();
    this.managerRouter = new KoaRouter({
      prefix: '/api',
    });
    this.managerApp
      .use(koaLogger((str) => {
        console.log('[manager]', str);
      }))
      .use(koaStatic(path.join(__dirname, '..', 'dist', 'client')))
      .use(this.managerRouter.routes())
      .use(this.managerRouter.allowedMethods());
  }
  async init() {
    this.proxyServer = await KoangetServer.createServer({ certService: this.certService });
    this.proxyServer.onRequest(this.proxyApp.callback());
    this.proxyServer.onError(this.proxyApp.onerror);
  }
  use(middleware: Koa.Middleware) {
    this.proxyApp.use(middleware);
  }
}
