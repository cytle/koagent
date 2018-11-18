import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import createLogger from 'vuex/dist/logger';
import io from 'socket.io-client';

Vue.use(Vuex);

function createSocketPlugin(socket) {
  return store => {
    store.$socket = socket;
    socket.on('addForward', (projectName) => {
      store.commit('ADD_LOGS', `addForward: ${projectName}`);
      store.commit('UPDATE_PROJECT_FORWARD', { projectName, needForward: true });
      store.commit('UPDATE_PROJECT_LOADING', { projectName, loading: false });
    });
    socket.on('removeForward', (projectName) => {
      store.commit('ADD_LOGS', `removeForward: ${projectName}`);
      store.commit('UPDATE_PROJECT_FORWARD', { projectName, needForward: false });
      store.commit('UPDATE_PROJECT_LOADING', { projectName, loading: false });
    });
    socket.on('listend', (proxyPort) => {
      store.commit('ADD_LOGS', `listend: ${proxyPort}`);
      store.commit('UPDATE_SERVER', { proxyPort, proxyOn: true });
    });
    socket.on('forward', ({ from, target }) => {
      store.commit('ADD_LOGS', `forward: ${from} => ${target}`);
      store.commit('UPDATE_SERVER', { proxyPort, proxyOn: true });
    });

    ['error', 'log', 'storing', 'stored'].forEach((vo) => {
      socket.on(vo, (payload) => {
        store.commit('ADD_LOGS', payload);
      });
    });
  };
}

export default new Vuex.Store({
  plugins: [createLogger(), createSocketPlugin(io('/'))],
  state: {
    projects: [],
    proxyPort: 0,
    proxyOn: false,
    logs: [],
  },
  mutations: {
    ADD_LOGS({ logs }, payload) {
      logs.push({
        logAt: new Date().toLocaleString(),
        payload,
      });
    },
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
      state.proxyPort = server.proxyPort;
      state.proxyOn = server.proxyOn;
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
    addForward({ commit }, projectName) {
      this.$socket.emit('addForward', projectName);
      commit('UPDATE_PROJECT_LOADING', { projectName, loading: true });
    },

    removeForward({ commit }, projectName) {
      this.$socket.emit('removeForward', projectName);
      commit('UPDATE_PROJECT_LOADING', { projectName, loading: true });
    },
  },
});
