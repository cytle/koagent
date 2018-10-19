import os from 'os';
import path from 'path';

export default {
  certifacateStoragePath: path.join(os.homedir(), '.koagent/certificate'),
  certifacateRootKey: 'koagent-root',
};
