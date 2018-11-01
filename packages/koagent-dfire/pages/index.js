import index from './home.vue';

export default ({ router, store }) => {
  store.commit('ADD_MENU_ITEM', {
    path: '/dfire',
    title: '本地反向代理',
    icon: ''
  });
  router.addRoutes([
    {
      path: '/dfire',
      name: 'DFire',
      component: index,
    }
  ]);
};
