import index from './home.vue';

export default ({ router, store }) => {
  store.commit('ADD_MENU_ITEM', {
    path: '/',
    title: '本地反向代理',
    icon: ''
  });
  router.addRoutes([
    {
      path: '/',
      name: 'DFire',
      component: index,
    }
  ]);
};
