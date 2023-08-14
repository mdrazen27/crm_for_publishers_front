import router from "@/router";

export default {
  namespaced: true,
  state: {
    authenticated: false,
    user_token: null,
    user: null,
    role: null,
  },
  mutations: {
    SET_AUTH_TOKEN(state, token) {
      state.user_token = token;
    },
    REMOVE_AUTH_TOKEN(state) {
      state.user_token = null;
    },
    REMOVE_ROLE(state) {
      state.role = null;
    },
    SET_USER(state, user) {
      state.user = user;
    },
    SET_ROLE(state, roleId) {
      state.role = roleId;
    },
    REMOVE_USER(state) {
      state.user = null;
    },
    SET_AUTHENTICATED(state, value) {
      state.authenticated = value;
    },
  },
  actions: {
    setAuthToken({ commit }, newValue) {
      commit("SET_AUTH_TOKEN", newValue);
      commit("SET_AUTHENTICATED", true);
    },
    setUser({ commit }, user) {
      commit("SET_USER", user);
    },
    setRole({ commit }, roleId) {
      commit("SET_ROLE", roleId);
    },
    setAuthenticated({ commit }, value) {
      commit("SET_AUTHENTICATED", value);
    },
    removeAuthToken({ commit }) {
      commit("REMOVE_AUTH_TOKEN");
    },
    removeUser({ commit }) {
      commit("REMOVE_USER");
    },
    logout({ commit }) {
      commit("REMOVE_AUTH_TOKEN");
      commit("REMOVE_USER");
      commit("SET_AUTHENTICATED", false);
      router.push({ name: "login" });
    },
  },
  getters: {
    authenticated(state) {
      return state.authenticated;
    },
    authToken(state) {
      return state.user_token;
    },
    user(state) {
      return state.user;
    },
    role(state) {
      return state.role;
    },
  },
};
