import { KoangetServer } from './servers';
import Koa from 'koa';
import defaultConfig from './config';
import { createCertificateService, ICertificateService } from 'koagent-certificate';

export default class Koagent {
  public static async create() {
    const koagent = new Koagent();
    await koagent.init();
    return koagent;
  }
  public proxyApp: Koa;
  public proxyServer: KoangetServer;
  public certService: ICertificateService;
  constructor() {
    this.certService = createCertificateService({
      storagePath: defaultConfig.certifacateStoragePath,
      rootKey: defaultConfig.certifacateRootKey,
    });
    this.proxyApp = new Koa();
  }
  async init() {
    this.proxyServer = await KoangetServer.createServer({ certService: this.certService });
    this.proxyServer.onRequest(this.proxyApp.callback());
    this.proxyServer.onError(this.proxyApp.onerror);
  }
}
