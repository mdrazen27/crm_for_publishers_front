export default {
  namespaced: true,
  actions: {
    errorHandler(state, error) {
      if (error.response) {
        let status = error.response.status;
        if (status === 401) {
          this.dispatch("auth/logout");
          this.dispatch("showSnackbar", {
            text: "You have to log in again!",
            color: "red",
          });
        } else if (status === 422 || status === 403) {
          this.dispatch("showSnackbar", {
            text: error.response.data.message,
            color: "red",
          });
        } else {
          this.dispatch("showSnackbar", {
            text: "There has been an error",
            color: "red",
          });
        }
      } else {
        this.dispatch("showSnackbar", {
          text: "There has been an error",
          color: "red",
        });
      }
    },
  },
};
