<template>
  <div class="rest-container">
    <el-table
      v-loading="loading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      :data="
        restList.slice((currentPage - 1) * pagesize, currentPage * pagesize)
      "
      style="width : 100%"
    >
      <!-- 餐馆名字 -->
      <el-table-column label="餐馆" prop="name.zh-CN"> </el-table-column>

      <!-- 地址 -->
      <el-table-column label="地址" prop="address.formatted"> </el-table-column>

      <!-- 标签 -->
      <el-table-column prop="tags" label="标签" filter-placement="bottom-end">
        <template slot-scope="scope">
          <el-tag
            v-for="item in scope.row.tags"
            :key="item.label"
            :type="item.type"
            effect="dark"
            style="margin-right:5px"
          >
            {{ item.toUpperCase() }}
          </el-tag>
        </template>
      </el-table-column>
      <!-- 标签 END-->

      <!-- 操作 -->
      <el-table-column label="操作" prop="edit">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handleEdit(scope.$index, scope.row)"
            :disabled="$permission()"
            >操作</el-button
          >
        </template>
      </el-table-column>
      <!-- 操作 END-->

      <!-- 手动关闭 -->
      <el-table-column label="手动关闭" prop="action">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.isClosed"
            active-color="#ff4949"
            inactive-color="#13ce66"
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
    <!-- 手动关闭 END-->

    <!-- 下方的导航按钮 -->
    <el-pagination
      background
      layout="prev, pager, next"
      :total="restList.length"
      @current-change="handleCurrentChange"
    >
    </el-pagination>
    <!-- 下方的导航按钮 END-->

    <RestEdit
      @closeModal="ModalCloseHandle"
      :isShow="isShow"
      :restaurant="restaurant"
    />
  </div>
</template>

<script>
import RestEdit from "@/components/RestEdit/RestEdit";
import _ from "lodash";
import { mapActions, mapState } from "vuex";

export default {
  name: "Restaurant",
  components: {
    RestEdit
  },
  data() {
    return {
      restaurant: {
        updateRest: {},
        title: "",
        updatedName: {}, //更新后的名字
        updateTagArr: [], //右侧显示的选中tags
        timezone: "" //时区
      },
      loading: false,
      currentPage: 1, //当前页面
      pagesize: 10, //    每页的数据
      isShow: false
    };
  },
  computed: {
    ...mapState({
      restList: state => state.Rest.restList
    })
  },
  created() {
    this.getRestList();
  },
  methods: {
    ...mapActions(["changeRestModel", "setRest"]),
    ModalCloseHandle() {
      this.isShow = false;
    },
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage;
    },
    //获取餐馆数据
    async getRestList() {
      this.loading = true;
      this.setRest();
      this.loading = false;
    },

    //获取编辑按钮的数据
    async handleEdit(index, row) {
      console.log("点击编辑按钮的时候", row);
      this.isShow = true;
      this.restaurant.updateRest = row;
      this.restaurant.title = row.name["zh-CN"];
      // 数据初始化
      this.restaurant.updatedName = _.clone(_.get(row, "name", {}));
      this.restaurant.updateTagArr = _.clone(_.get(row, "tags", []));
      this.restaurant.timezone = _.clone(_.get(row, "timezone", ""));
      // this.time();
    },

    //开关按钮的控制
    async handleSwitch(value, row) {
      let closed = value ? { closed: true } : null;
      const data = {
        id: row._id,
        data: { closed }
      };
      await this.changeRestModel(data);
    }
  },
  updated() {}
};
</script>

<style lang="scss">
.el-table {
  .el-pagination {
    position: absolute;
    right: 0;
  }
  .el-form-item {
    display: flex;
  }
  .el-tag {
    margin-left: 10px;
  }
}
.el-table__body,
.el-table__footer,
.el-table__header {
  table-layout: fixed;
  border-collapse: separate;
  width: 100vw;
}
</style>
