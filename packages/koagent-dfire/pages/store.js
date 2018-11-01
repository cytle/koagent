import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios'

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    projects: [],
    server: {
      proxyPort: 0,
      proxyOn: false,
    },
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

    UPDATE_SERVER(state, server) {
      state.server.proxyPort = server.proxyPort;
      state.server.proxyOn = server.proxyOn;
    },
  },
  actions: {
    async fetchServer({ commit }) {
      const { data } = await axios.get(`/api/localProxy/server`);
      commit('UPDATE_SERVER', data);
    },
    async fetchProjects({ commit }) {
      const { data } = await axios.get(`/api/localProxy/projects`);
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
