import { promisfy } from 'promisfy';
import Koa from 'koa';
import getPort from 'get-port';
import { createCertificate } from 'pem';
import { ICertificateService, CertificateService, CertificateStorage } from '../certificate';

const httpProxy = require('../middleware/httpProxy');
// const forwarder = require('./middleware/forwarder');

const getCertificate = promisfy(createCertificate);

Promise.resolve().then(async () => {
  const app = new Koa();

  const storagePath = '';
  const rootKey = '';
  const certStorate = new CertificateStorage({ storagePath }, {});
  const certService = new CertificateService(rootKey, certStorate);

  app.use(async (ctx, next: Function) => {
    console.log(ctx.request.url);
    await next();
    console.log('resolve', ctx.res.finished);
  });

  app.use(httpProxy({
    ssl: { key: key.serviceKey, cert: key.certificate },
  }));

  const port = await getPort({ port: 300 });

  return new Promise((resolve, reject) => {
    app.listen(port, (error?: Error) => {
      if (error) {
        reject(error);
        return;
      }
      resolve();
    });
  });
}).catch((error) => {
  console.error(error);
});
