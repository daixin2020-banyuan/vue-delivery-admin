import * as types from "./mutation-types";
import { getMenu, editfood } from "@/request/menu";
import { Message } from "element-ui";
// import _ from "lodash";

const Menu = {
  state: {
    food: [], //餐馆的菜单列表
    count: 0 //总计菜品数量
  },
  mutations: {
    [types.RECORD_MENU](state, data) {
      state.food = data.food;
      state.count = data.count;
    }
  },
  actions: {
    /*获取菜单 */
    async setMenu({ commit }, { id, page, limit, keyword }) {
      try {
        commit(types.SHOW_LOADING);
        await sleep(500);

        const result = await getMenu({
          id,
          page,
          limit,
          keyword
        });
        // console.log("餐馆的菜单列表=====》", "第" + page + "页", result);

        commit(types.RECORD_MENU, {
          food: result.list,
          count: result.count
        });
        commit(types.HIDE_LOADING);
      } catch (error) {
        Message({
          type: "failed",
          message: error
        });
      }
    },
    /*修改菜单的availbel */

    /* eslint-disable*/   
  async updateFood({commit}, data) {
      try {
        commit(types.SHOW_LOADING)
        console.log("vuex=====>", data);
        await editfood(data);
        commit(types.HIDE_LOADING)

      } catch (error) {
        Message({
          type: "failed",
          message: error
        });
      }finally{
        commit(types.HIDE_LOADING)

      }
    }
  }
};
function sleep (time){

  return new Promise((res)=>{

     setTimeout(()=>{
        res();
     },time);
  });
}

export default Menu;
