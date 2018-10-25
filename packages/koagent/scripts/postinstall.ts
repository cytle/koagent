import fs from 'fs-extra';
import path from 'path';
import config from '../src/config';

Promise.resolve().then(async () => {
  await fs.remove(config.certifacateStoragePath);
  await fs.mkdir(config.certifacateStoragePath);
  const { certifacateRootKey, certifacatePath, certifacateStoragePath } = config;
  const files = ['crt', 'key']
    .map(suffix => `${certifacateRootKey}.${suffix}`)
    .map(name => [
      path.join(certifacatePath, name),
      path.join(certifacateStoragePath, name),
    ]);

  console.log(files);

  await files.map(([src, dest]) => fs.copy(src, dest));
  console.log('finish copy');
});
