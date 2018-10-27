import Koagent from './Koagent';
import httpProxy from 'koagent-http-proxy';
import certificate from 'koagent-certificate';
import logger from './middlewares/logger';

export const koagentHttpProxy = httpProxy;
export const koagentLogger = logger;
export const koagentCertificate = certificate;
export default Koagent;

// debug.enable('*');

// const log = debug('koagent');

// Promise.resolve().then(async () => {
//   const koagent = await Koagent.create();

//   koagent.proxyApp.use(certificate(koagent));
//   koagent.proxyApp.use(logger());
//   koagent.proxyApp.use(httpProxy());

//   koagent.managerApp.listen(3001, () => {
//     log('manager listen', 3001);
//   });
//   koagent.proxyServer.listen(3000, () => {
//     log('proxy listen', 3000);
//   });

//   koagent.proxyApp.on('error', (err) => {
//     log('proxyApp error', err);
//   });

//   koagent.managerApp.on('error', (err) => {
//     log('managerApp error', err);
//   });
// });
