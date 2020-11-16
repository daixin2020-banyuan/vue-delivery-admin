import * as types from "./mutation-types";

const loading = {
  state: {
    show: false
  },
  mutations: {
    /* show loading */
    [types.SHOW_LOADING](state) {
      state.show = true;
    },

    /* hide loading */
    [types.HIDE_LOADING](state) {
      state.show = false;
    }
  }
};

export default loading;
