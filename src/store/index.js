import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex);

export default new Vuex.Store({
  plugins: [
    createPersistedState({
      storage: window.sessionStorage,
    }),
  ],
  state: {
    snackbar: {
      active: false,
      color: "red",
      text: "",
    },
  },
  getters: {},
  mutations: {
    SET_SNACKBAR(state, snackbar) {
      state.snackbar = snackbar;
    },
  },
  actions: {
    showSnackbar({ commit }, snackbar) {
      snackbar.active = true;
      commit("SET_SNACKBAR", snackbar);
    },
  },
  modules: {},
});
