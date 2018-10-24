import Koa from 'koa';
import KoaRouter from 'koa-router';
import { ICertificateService } from 'koagent-certificate';

export interface IKoagentMiddlewareContext {
  proxyApp: Koa;
  managerApp: Koa;
  router: KoaRouter;
  certService: ICertificateService;
}
