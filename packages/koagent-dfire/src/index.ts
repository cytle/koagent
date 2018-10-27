import debug from 'debug';
import Koagent, { koagentLogger } from 'koagent';
import dfireProxyLocal from './dfireProxyLocal';

debug.enable('*');

const log = debug('koagent-dfire');

Promise.resolve().then(async () => {
  const koagent = await Koagent.create();

  koagent.proxyApp.use(koagentLogger());
  koagent.proxyApp.use(dfireProxyLocal());

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
