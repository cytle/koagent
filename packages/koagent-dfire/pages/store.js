import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios'

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    projects: [],
  },
  mutations: {
    UPDATE_PROJECT_FORWARD({ projects }, { projectName, needForward }) {
      const project = projects.find(vo => vo.name === projectName);
      if (project) {
        project.needForward = needForward;
      }
    },

    UPDATE_PROJECT_LOADING({ projects }, { projectName, loading }) {
      const project = projects.find(vo => vo.name === projectName);
      if (project) {
        project.loading = loading;
      }
    },
    UPDATE_PROJECTS(state, projects) {
      Vue.set(state, 'projects', projects);
      console.log(state);

    },
  },
  actions: {
    async fetchProjects({ commit }) {
      const { data } = await axios.get(`/api/localProxy`);

      console.log(data);

      commit('UPDATE_PROJECTS', data);
    },
    async forward({ commit }, projectName) {
      commit('UPDATE_PROJECT_LOADING', { projectName, loading: true });
      try {
        await axios.put(`/localProxy/forward/${projectName}`);
        commit('UPDATE_PROJECT_FORWARD', { projectName, needForward: true });
      } finally {
        commit('UPDATE_PROJECT_LOADING', { projectName, loading: false });
      }
    },
    async dontForward({}, projectName) {
      commit('UPDATE_PROJECT_LOADING', { projectName, loading: true });
      try {
        await axios.delete(`/localProxy/forward/${projectName}`);
        commit('UPDATE_PROJECT_FORWARD', { projectName, needForward: false });
      } finally {
        commit('UPDATE_PROJECT_LOADING', { projectName, loading: false });
      }
    },
  },
});
