<template>
  <div>
    <div class="select-container">
      <el-select
        v-model="selectValue"
        filterable
        placeholder="请选择"
        @change="selectRest"
      >
        <el-option
          v-for="item in newRestList"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
    </div>

    <el-table :data="food" stripe style="width: 100%" v-loading="loading">
      <el-table-column prop="name.zh-CN" width="400">
        <template slot="header">
          <div class="menu-name-input">
            <span>名称</span>
            <input
              ref="inputRef"
              v-model="keyword"
              placeholder="输入关键字搜索"
              class="el-input__inner "
              style="width :200px;height :28px;lineHeight :28px"
              @keyup.enter="renderFood"
            />
          </div>
        </template>
      </el-table-column>

      <el-table-column label="价格" width="380">
        <template slot-scope="scope">
          {{ scope.row.price | FormatPrice }}
        </template>
      </el-table-column>

      <el-table-column prop="address" label="状态">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.available"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="
              v => {
                handleSwitch(v, scope.row);
              }
            "
          >
          </el-switch>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      layout="prev,pager,next,sizes"
      :total="count"
      :current-page="currentPage"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      @current-change="handlePageChange"
      @size-change="handleSizeChange"
    >
    </el-pagination>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import _ from "lodash";
import { v4 as uuidv4 } from "uuid";

export default {
  name: "Menu",
  data() {
    return {
      loading: false,
      selectValue: "", //下拉框的值
      keyword: "",
      restaurantId: "", //餐馆id
      currentPage: 1, //当前页
      pageSize: 10 //单页显示数
    };
  },
  // watch: {
  //   food: {
  //     handler(newv, oldv) {
  //       console.log("food list change", newv, oldv);
  //       let saa = this.food.slice(
  //         (this.currentPage - 1) * this.pageSize,
  //         this.currentPage * this.pageSize
  //       );
  //       console.log("deal", saa);
  //     },
  //     deep: true
  //   }
  // },
  computed: {
    ...mapState({
      restList: state => state.Rest.restList,
      food: state => state.Menu.food,
      count: state => state.Menu.count
    }),

    /* 重构restList 按需求排序*/
    newRestList() {
      const newRestList = _.map(this.restList, item => {
        return {
          label: _.get(item, "name.zh-CN", ""),
          key: uuidv4(),
          value: item._id
        };
      });
      return newRestList;
    }
  },
  created() {
    this.setRest();
    console.log(this.food);
  },
  methods: {
    ...mapActions(["setRest", "setMenu", "updateFood"]),

    selectRest(value) {
      this.restaurantId = value;
      console.log(this.$refs.inputRef);
      this.$refs.inputRef.value = "";
      this.keyword = "";
      this.currentPage = 1;
      this.renderFood();
    },

    /**加载点击第几页 */
    handlePageChange(v) {
      this.currentPage = v;
      // console.log("currentPage====>", this.currentPage);
      this.renderFood();
    },
    handleSizeChange(v) {
      this.pageSize = v;
      this.currentPage = 1;
      // console.log("pageSize======>", v);
      this.renderFood();
    },
    renderFood() {
      this.setMenu({
        id: this.restaurantId,
        page: this.currentPage,
        limit: this.pageSize,
        keyword: this.keyword
      });
    },
    handleSwitch(value, row) {
      const data = {
        id: row._id,
        data: {
          available: value
        }
      };
      this.updateFood(data);
    }
  }
};
</script>

<style lang="scss">
.select-container {
  padding-bottom: 20px;
  border-bottom: 1px solid #e6e6e6;
  .menu-name-input {
    display: flex;
    justify-content: space-between;
    line-height: 28px;
  }
}

.menu-name-input > .el-input__inner {
  float: right;
}
</style>
