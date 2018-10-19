import createKoaApp from './createKoaApp';

Promise.resolve().then(async () => {
  try {
    await createKoaApp();
  } catch (error) {
    console.error(error);
  }
});
