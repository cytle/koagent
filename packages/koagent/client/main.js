import 'babel-polyfill';
// import koagentClient from 'koagent-client';
import '../../koagent-client/dist/index.css';
import koagentClient from '../../koagent-client';
import koagentDfire from '../../koagent-dfire/dist/pages';

console.log(koagentDfire);
koagentClient.router.addRoutes(koagentDfire.routes);
koagentClient.app.$mount('#app');
