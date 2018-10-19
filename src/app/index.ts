import createKoaApp from './createKoaApp';

Promise.resolve(async () => {
  try {
    await createKoaApp();
  } catch (error) {
    console.error(error);
  }
});
