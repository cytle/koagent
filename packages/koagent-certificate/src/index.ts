import KoaRouter from 'koa-router';
import _ from 'lodash';
export * from './interfaces';
export * from './CertificateService';
export * from './CertificateStorage';
import { ICertificateOptions } from './interfaces';
import { CertificateService } from './CertificateService';
import { CertificateStorage } from './CertificateStorage';

export default (
  koangetCtx,
) => {
  const selfRouter = new KoaRouter();
  selfRouter.get('/rootCA', async (ctx) => {
    ctx.set('Content-disposition', 'attachment;filename=koagentCA.crt');
    ctx.body = (await koangetCtx.certService.getRoot()).cert;
  });
  koangetCtx.router.use('/certificate', selfRouter.routes(), selfRouter.allowedMethods());
  return (_ctx, next) => next();
};

export function createCertificateService(options: ICertificateOptions) {
  const certStorage = new CertificateStorage(options, {});
  return new CertificateService(options.rootKey, certStorage);
}
