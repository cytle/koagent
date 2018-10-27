import { KoangetServer } from './servers';
import Koa from 'koa';
import KoaRouter from 'koa-router';
import defaultConfig from './config';
import { createCertificateService, ICertificateService } from 'koagent-certificate';

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
    this.managerApp = new Koa();
    this.managerRouter = new KoaRouter();
    this.managerApp.use(this.managerRouter.routes());
  }
  async init() {
    this.proxyServer = await KoangetServer.createServer({ certService: this.certService });
    this.proxyServer.onRequest(this.proxyApp.callback());
    this.proxyServer.onError(this.proxyApp.onerror);
  }
  use(middleware) {
    this.proxyApp.use(middleware(this));
  }
}
