import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    menu: [],
    showMenu: true,
  },
  mutations: {
    ADD_MENU_ITEM({ menu }, { title, icon, path }) {
      menu.push({
        icon, path, title,
      });
    },
    TOGGLE_MENU(state, show) {
      state.showMenu = !!show;
    }
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
    hideMenu({ commit }) {
      commit('TOGGLE_MENU', false);
    },
    showMenu({ commit }) {
      commit('TOGGLE_MENU', false);
    }
  },
});
