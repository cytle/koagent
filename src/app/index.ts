import KoaRouter from 'koa-router';
import createKoaApp from './createKoaApp';

Promise.resolve().then(async () => {
  try {
    const router = new KoaRouter();
    await createKoaApp(router);
  } catch (error) {
    console.error(error);
  }
});
