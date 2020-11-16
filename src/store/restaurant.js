import * as types from "./mutation-types";
import { getRest } from "@/request/restaurant";
import { Message } from "element-ui";
import _ from "lodash";

const Rest = {
  state: {
    restList: []
  },
  mutations: {
    [types.GET_RESTAURANT](state, data) {
      state.restList = data;
    }
  },
  actions: {
    /**存储总的restlist */
    async setRest({ commit }) {
      try {
        const data = await getRest();
        // console.log('restaurant======>',data);

        const newData = _.map(data.list, item => {
          item.isClosed = !_.isEmpty(item.closed);
          return item;
        });

        commit(types.GET_RESTAURANT, newData);
      } catch (error) {
        Message({
          type: "failed",
          message: error
        });
      }
    }
  }
};

export default Rest;
