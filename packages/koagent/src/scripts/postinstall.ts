import fs from 'fs-extra';
import path from 'path';
import config from '../config';

Promise.resolve().then(async () => {
  await fs.remove(config.certifacateStoragePath);
  await fs.mkdir(config.certifacateStoragePath);
  const { certifacateRootKey, certifacatePath, certifacateStoragePath } = config;
  await ['crt', 'key']
    .map(suffix => `${certifacateRootKey}.${suffix}`)
    .map(name => fs.copy(
      path.join(certifacatePath, name),
      path.join(certifacateStoragePath, name),
    ));
});
