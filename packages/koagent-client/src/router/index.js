import Vue from 'vue';
import Router from 'vue-router';
import HelloWorld from '~/pages/HelloWorld';
import Monitor from '~/pages/Monitor';
import ReverseProxy from '~/pages/ReverseProxy';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld,
      meta: {
        title: 'HelloWorld',
      },
    },
    {
      path: '/Monitor',
      name: 'Monitor',
      component: Monitor,
      meta: {
        title: 'Monitor',
      },
    },
    {
      path: '/ReverseProxy',
      name: 'ReverseProxy',
      component: ReverseProxy,
      meta: {
        title: 'ReverseProxy',
      },
    },
  ],
});
