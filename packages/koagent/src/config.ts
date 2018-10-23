import os from 'os';
import path from 'path';

const configDir = path.join(os.homedir(), '.config/koagent/');

export default {
  certifacateStoragePath: path.join(configDir, 'certificate'),
  certifacateRootKey: 'zproxy',
};
