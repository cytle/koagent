import { promisfy } from 'promisfy';
import Koa from 'koa';
import getPort from 'get-port';
import { createCertificate } from 'pem';

const httpProxy = require('../middleware/httpProxy');
// const forwarder = require('./middleware/forwarder');

const getCertificate = promisfy(createCertificate);

Promise.resolve().then(async () => {
  const app = new Koa();

  app.use(async (ctx, next: Function) => {
    console.log(ctx.request.url);
    await next();
    console.log('resolve', ctx.res.finished);
  });

  const key = await getCertificate({ days: 1 });
  app.use(httpProxy({
    ssl: { key: key.serviceKey, cert: key.certificate },
  }));

}).catch((error) => {
  console.error(error);
});
