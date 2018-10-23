import _ from 'lodash';
export * from './interfaces';
export * from './CertificateService';
export * from './CertificateStorage';
import { ICertificateOptions } from './interfaces';
import { CertificateService } from './CertificateService';
import { CertificateStorage } from './CertificateStorage';

// declare module 'koa' {
//   interface BaseContext {
//     certificate: ICertificateService;
//   }
// }

export default function createCertificateService(options: ICertificateOptions) {
  const certStorage = new CertificateStorage(options, {});
  return new CertificateService(options.rootKey, certStorage);
}
// export default (app: Koa, router: KoaRouter, options: ICertificateOptions) => {
//   const certService = createCertificateService(options);
//   app.context.certificate = certService;

//   const selfRouter = new KoaRouter();
//   selfRouter.get('/rootCA', async (ctx) => {
//     ctx.set('Content-disposition', 'attachment;filename=koagentCA.crt');
//     ctx.body = (await certService.getRoot()).cert;
//   });

//   router.use('/certificate', selfRouter.routes(), selfRouter.allowedMethods());
// };
