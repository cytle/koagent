// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import store from '@/store';
import ElementUI from 'element-ui';
import 'normalize.css/normalize.css';
import 'element-ui/lib/theme-chalk/index.css';
import router from '@/router';
import App from './App';

Vue.config.productionTip = false;

Vue.use(ElementUI);

const app = new Vue({
  el: '#app',
  store,
  router,
  components: { App },
  template: '<App/>',
});

export default {
  router,
  store,
  app,
};
