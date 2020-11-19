import * as types from "./mutation-types";
import { getRest } from "@/request/restaurant";
import { editRest } from "@/request/editRest";
import { Message } from "element-ui";
import { v4 as uuidv4 } from "uuid";
import _ from "lodash";

const Rest = {
  state: {
    restList: [],
    restName: []
  },
  mutations: {
    [types.GET_RESTAURANT](state, data) {
      state.restList = data.newData;
      state.restName = data.newRestList;
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

        const newRestList = _.map(newData, item => {
          return {
            label: _.get(item, "name.zh-CN", ""),
            key: uuidv4(),
            value: item._id
          };
        });

        commit(types.GET_RESTAURANT, { newData, newRestList });
      } catch (error) {
        Message({
          type: "failed",
          message: error
        });
      }
    },
    async changeRestModel({ commit, dispatch }, data) {
      commit(types.SHOW_LOADING);
      try {
        await editRest(data);
      } catch (error) {
        Message({
          type: "failed",
          message: error
        });
      } finally {
        await dispatch("setRest");
        commit(types.HIDE_LOADING);
      }
    }
  }
};

export default Rest;
