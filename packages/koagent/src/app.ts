import debug from 'debug';
import Koagent, { koagentCertificate, koagentHttpProxy, koagentLogger } from './index';
import koagentDfire from '../../koagent-dfire';

debug.enable('*');

const log = debug('koagent');

Promise.resolve().then(async () => {
  const koagent = await Koagent.create();

  koagent.proxyApp.use(await koagentDfire(koagent));
  koagent.use(koagentCertificate);
  koagent.use(koagentLogger);
  koagent.proxyApp.use(koagentHttpProxy());

  koagent.managerApp.listen(3001, () => {
    log('manager listen', 3001);
  });
  koagent.proxyServer.listen(3000, () => {
    log('proxy listen', 3000);
  });

  koagent.proxyApp.on('error', (err) => {
    log('proxyApp error', err);
  });

  koagent.managerApp.on('error', (err) => {
    log('managerApp error', err);
  });
});
