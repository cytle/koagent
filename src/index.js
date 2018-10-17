const Koa = require('koa');
const getPort = require('get-port');
const pem = require('pem');
const { promisfy } = require('promisfy');

const httpProxy = require('./middleware/httpProxy');
// const forwarder = require('./middleware/forwarder');

const getCertificate = promisfy(pem.createCertificate);

Promise.resolve().then(async () => {
  const app = new Koa();

  app.use(async (ctx, next) => {
    console.log(ctx.request.url);
    await next();
    console.log('resolve', ctx.res.finished);
  });

  const key = await getCertificate({ days: 1 });
  app.use(httpProxy({
    ssl: { key: key.serviceKey, cert: key.certificate },
  }));

  const port = await getPort({ port: 3000 });

  app.listen(port, (error) => {
    if (error) {
      console.error(error);
      return;
    }
    console.log(`listen port: ${port}`);
  });
}).catch((error) => {
  console.error(error);
});
