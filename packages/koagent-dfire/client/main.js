import 'babel-polyfill';
import koagentClient from 'koagent-client';
import koagentDfire from './pages';

console.log(koagentDfire);
koagentClient.store.dispatch('hideMenu');
koagentClient.use(koagentDfire);
koagentClient.app.$mount('#app');
