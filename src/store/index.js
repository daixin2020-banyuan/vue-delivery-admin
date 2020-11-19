import Vue from "vue";
import Vuex from "vuex";

import loading from "./loading.js";

import Rest from "./restaurant";

import Menu from "./menu";

import Order from "./order";

import login from "./login";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    loading,
    Rest,
    Menu,
    Order,
    login
  }
});
