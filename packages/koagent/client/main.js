import 'babel-polyfill';
// import koagentClient from 'koagent-client';
// import '../../koagent-client/dist/index.css';
import koagentClient from '../../koagent-client/src';
import koagentDfire from '../../koagent-dfire/pages';

console.log(koagentDfire);
koagentClient.use(koagentDfire);

koagentClient.app.$mount('#app');
