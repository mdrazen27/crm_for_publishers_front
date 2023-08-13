export default {
  namespaced: true,
  actions: {
    errorHandler(state, error) {
      if (error.response) {
        if (error.response.status === 401) {
          this.dispatch("auth/logout")
          this.dispatch("showSnackbar", { text: "You have to log in again!", color: "red" });
        } else if (error.response.status === 422) {
          this.dispatch("showSnackbar", { text: error.response.data.message, color: "red" });
        } else {
          this.dispatch("showSnackbar", { text: "There has been an error", color: "red" });
        }
      } else {
        this.dispatch("showSnackbar", { text: "There has been an error", color: "red" });
      }
    }
  }
};