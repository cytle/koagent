import os from 'os';
import path from 'path';

const configDir = path.join(os.homedir(), '.config/koagent/');

export default {
  certifacateStoragePath: path.join(configDir, 'certificate'),
  certifacatePath: path.join(__dirname, '..', 'certificate'),
  certifacateRootKey: 'zproxy',
};
