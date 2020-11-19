<template>
  <div>
    <div class="select-container">
      <el-select
        v-model="selectValue"
        filterable
        placeholder="请选择"
        @change="selectRest"
        :filter-method="pinyingMatch"
      >
        <el-option
          v-for="item in brand"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
    </div>

    <el-table
      :data="food"
      stripe
      style="width: 100%"
      v-loading="loading"
      :filter-method="pinyingMatch"
    >
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

      <el-table-column label="状态">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.available"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :disabled="$permission()"
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
// import _ from "lodash";
import pinyingMatch from "pinyin-match";

export default {
  name: "Menu",
  data() {
    return {
      loading: false,
      selectValue: "", //下拉框的值
      brand: [],
      keyword: "",
      restaurantId: "", //餐馆id
      currentPage: 1, //当前页
      pageSize: 10 //单页显示数
    };
  },

  computed: {
    ...mapState({
      restName: state => state.Rest.restName,
      food: state => state.Menu.food,
      count: state => state.Menu.count
    })
  },
  watch: {
    restName(val) {
      this.brand = val;
    }
  },
  created() {
    this.$store.dispatch("setRest");
  },
  methods: {
    ...mapActions(["setRest", "setMenu", "updateFood"]),

    selectRest(value) {
      this.restaurantId = value;
      this.$refs.inputRef.value = "";
      this.keyword = "";
      this.currentPage = 1;
      this.renderFood();
      this.brand = this.restName;
    },
    //下拉框设置拼音模糊搜索
    pinyingMatch(val) {
      if (val) {
        let result = [];
        //
        this.restName.forEach(e => {
          var m = pinyingMatch.match(e.label, val);
          if (m) {
            result.push(e);
          }
        });
        //搜索到相应的数据就把符合条件的n个数据赋值newRestList
        this.brand = result;
      } else {
        //没有搜索到数据，就还展示所有的brand
        this.brand = this.restName;
      }
    },

    /**加载点击第几页 */
    handlePageChange(v) {
      this.currentPage = v;
      this.renderFood();
    },
    handleSizeChange(v) {
      this.pageSize = v;
      this.currentPage = 1;
      this.renderFood();
    },
    async renderFood() {
      await this.setMenu({
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
