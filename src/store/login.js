import * as types from "./mutation-types";
import { loginPost } from "@/request/login";
import { setStorage, cleanStorage } from "@/common/utils";
import { Message } from "element-ui";
import router from "@/router";

const login = {
  state: {
    role: {}
  },
  mutations: {
    [types.SET_LOGIN](state, data) {
      setStorage("role", data);
      state.role = data;
    },
    [types.SET_LOGINOUT](state) {
      cleanStorage("role");
      state.role = {};
    }
  },
  actions: {
    async login({ commit }, data) {
      try {
        const info = await loginPost(data);
        router.push({
          path: "/admin"
        });
        commit(types.SET_LOGIN, info);
      } catch (error) {
        Message({
          type: "failed",
          message: error
        });
      }
    },

    loginOut({ commit }) {
      try {
        router.push({
          path: "/login"
        });
        commit(types.SET_LOGINOUT);
      } catch (error) {
        Message({
          type: "failed",
          message: error
        });
      }
    }
  }
};

export default login;
