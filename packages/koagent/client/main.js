import 'babel-polyfill';
import koagentClient from 'koagent-client';
// import koagentDfire from '../../koagent-dfire/pages/dist/pages.esm';

console.log(koagentClient);
koagentClient.app.$mount('#app');
// koagentClient.router.addRoutes(koagentDfire.routes);
