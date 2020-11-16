import * as types from "./mutation-types";
import { getOrder } from "@/request/order";
import { Message } from "element-ui";

const Order = {
  state: {
    orderList: []
  },
  mutations: {
    [types.GET_ORDER](state, data) {
      state.orderList = data.list;
      console.log("vuex==== orderList", state.orderList);
    }
  },
  actions: {
    /**存储总的orderlist */
    async setOrder({ commit }, { start, end }) {
      try {
        const result = await getOrder(start, end);
        commit(types.GET_ORDER, result);
      } catch (error) {
        Message({
          type: "failed",
          message: error
        });
      }
    }
  }
};

export default Order;
