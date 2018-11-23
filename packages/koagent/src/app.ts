import debug from 'debug';
import Koagent, { koagentCertificate, koagentHttpProxy } from './index';

debug.enable('*');

const log = debug('koagent');

Promise.resolve().then(async () => {
  const koagent = await Koagent.create();

  koagent.use(koagentCertificate(koagent));
  koagent.proxyApp.use(koagentHttpProxy());
  console.log(koagent.managerRouter.stack.map(i => i.path));
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
