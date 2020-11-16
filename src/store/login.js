import * as types from "./mutation-types";

const loading = {
  state: {
    user: []
  },
  mutations: {
    [types.GET_USER](state, data) {
      state.user = data;
    }
  }
};

export default loading;
