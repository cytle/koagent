import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    menu: [],
  },
  mutations: {
    ADD_MENU_ITEM({ menu }, { title, icon, path }) {
      menu.push({
        icon, path, title,
      });
    },
  },
  actions: {
    addMenusFromRouter({ commit }, router) {
      router.options.routes.map(vo => ({
        path: vo.path,
        title: (vo.meta && vo.meta.title) || vo.name,
        icon: ''
      })).forEach((vo) => {
        commit('ADD_MENU_ITEM', vo);
      });
    },
  },
});
