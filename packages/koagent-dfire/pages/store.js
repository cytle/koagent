import Vuex from 'vuex';
import axios from 'axios'

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
      state.projects.splice(0, state.projects.length);
      state.projects.push(...projects);
    },
  },
  actions: {
    async fetchProjects({ commit }) {
      const { data } = await axios.get(`/api/localProxy`);
      commit('UPDATE_PROJECTS', data);
    },
    async forward({ commit }, projectName) {
      commit('UPDATE_PROJECT_LOADING', { projectName, loading: true });
      try {
        await axios.put(`/api/localProxy/forward/${projectName}`);
        commit('UPDATE_PROJECT_FORWARD', { projectName, needForward: true });
      } finally {
        commit('UPDATE_PROJECT_LOADING', { projectName, loading: false });
      }
    },
    async dontForward({ commit }, projectName) {
      commit('UPDATE_PROJECT_LOADING', { projectName, loading: true });
      try {
        await axios.delete(`/api/localProxy/forward/${projectName}`);
        commit('UPDATE_PROJECT_FORWARD', { projectName, needForward: false });
      } finally {
        commit('UPDATE_PROJECT_LOADING', { projectName, loading: false });
      }
    },
  },
});
