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
      state.role = data;
    },
    [types.SET_LOGINOUT](state) {
      state.role = {};
    }
  },
  actions: {
    async login({ commit }, data) {
      try {
        const info = await loginPost(data);
        setStorage("role", info);
        commit(types.SET_LOGIN, info);
        router.push({
          path: "/admin"
        });
      } catch (error) {
        Message({
          type: "failed",
          message: error
        });
      }
    },

    loginOut({ commit }) {
      try {
        cleanStorage("role");
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
