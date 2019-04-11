import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: {},
    collapsed: false,
    status: ''
  },
  mutations: {
    setUser (state, payload) {
      state.user = payload;
      localStorage.vueLoginJWT = payload.token;
      state.status = ""
    },
    deleteUser (state) {
      state.user = null;
      localStorage.removeItem('vueLoginJWT');
    },
    setCollapsed (state, collapsed) {
      state.collapsed = collapsed;
    }
  },
  actions: {
    setUserAction ({ commit }, payload) {
      commit('setUser', payload);
    },
    deleteUser ({ commit }) {
      commit('deleteUser');
    },
    setCollapsedAction ({ commit }, collapsed) {
      commit('setCollapsed', collapsed);
    }
  }
});
