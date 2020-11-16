<template>
  <div class="rest-container">
    <el-table
      v-loading="loading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      :data="
        restList.slice((currentPage - 1) * pagesize, currentPage * pagesize)
      "
    >
      <el-table-column type="text" width="50"> </el-table-column>

      <!-- 餐馆名字 -->
      <el-table-column label="餐馆" prop="name.zh-CN" width="180">
      </el-table-column>

      <!-- 地址 -->
      <el-table-column label="地址" prop="address.formatted" width="400">
      </el-table-column>

      <!-- 标签 -->
      <el-table-column
        prop="tags"
        label="标签"
        width="260"
        filter-placement="bottom-end"
      >
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
      <el-table-column label="操作" prop="edit" width="150">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)"
            >操作</el-button
          >
        </template>
      </el-table-column>
      <!-- 操作 END-->

      <!-- 手动关闭 -->
      <el-table-column label="手动关闭" prop="action" width="150">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.isClosed"
            active-color="#ff4949"
            inactive-color="#13ce66"
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

    <!-- 操作按钮的嵌套表格 -->
    <el-dialog
      :title="title"
      :visible.sync="dialogFormVisible"
      @close="closeModal"
    >
      <el-form :model="updateRest">
        <!-- 语言选择 -->
        <el-row>
          <el-col :span="8">
            <el-form-item>
              <el-select
                v-model="langValue"
                placeholder="请选择语言"
                @change="langOptionChange"
              >
                <el-option
                  v-for="item in langOptions"
                  :key="item.key"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="16" style="margin-left: -36px;">
            <el-form-item>
              <input
                type="text"
                autocomplete="off"
                placeholder="请输入内容"
                class="el-input__inner"
                v-model="langOptionsValue"
                @change="changeName"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 标签tags选择 -->
        <el-row>
          <el-col :span="4">
            <el-select
              v-model="selectTag"
              placeholder="请选择"
              @change="addTags"
            >
              <el-option
                v-for="item in tagsOption"
                :key="item.id"
                :label="item"
                :value="item"
              >
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="18">
            <el-tag
              v-for="item in updateTagArr"
              :key="item.key"
              :type="item"
              effect="dark"
              closable
              style="margin-left: 10px;height:30px;line-height:30px;margin-top:5px"
              @close="handleClose(item)"
            >
              {{ item }}
            </el-tag>
          </el-col>
        </el-row>

        <!-- 餐馆时间显示 -->
        <el-form-item style="margin-top:20px">
          <el-row>
            <el-col :span="23">
              <el-card shadow="always">
                <span> 纽约时间:{{ newYork }} </span> <span>周{{ week }}</span>
              </el-card>
            </el-col>
          </el-row>
        </el-form-item>

        <!-- 餐馆的营业时间 -->
        <el-form-item style="margin-top:20px">
          <div v-for="(item, index) in businessTime" :key="item._id">
            <span style="margin-right:20px">{{ item.day }}</span>
            <el-time-picker
              is-range
              arrow-control
              v-model="item.time"
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              placeholder="选择时间范围"
              @change="
                v => {
                  changeHour(v, index);
                }
              "
            >
            </el-time-picker>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="postEdit">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 操作按钮的嵌套表格  END-->
  </div>
</template>

<script>
import { getRest } from "@/request/restaurant.js";
import { tags } from "@/request/tags.js";
import { editRest } from "@/request/editRest.js";
import moment from "moment-timezone";
import { v4 as uuidv4 } from "uuid";
import _ from "lodash";
import * as types from "@/store/mutation-types.js";

export default {
  name: "Restaurant",
  data() {
    return {
      loading: false,
      currentPage: 1, //当前页面
      pagesize: 10, //    每页的数据
      restList: [], //后端数据
      updateRest: {}, //当前修改的餐馆
      isClosed: true, //开关按钮
      key: uuidv4(),
      dialogFormVisible: false, //嵌套表格
      title: "", //标题
      langValue: "", //下拉框语言选择
      langOptions: [
        {
          value: "zh-CN",
          label: "中文"
        },
        {
          value: "en-US",
          label: "英文"
        }
      ],
      langOptionsValue: "", //input语言选择显示值
      tagsOption: [], //后端获取的所有tags
      selectTag: "", // 当前选中的tags
      updateTagArr: [], //右侧显示的选中tags
      timezone: "", //时区
      newYork: "", //纽约时间
      week: "", //周几
      businessTime: [], //营业时间
      updatedName: {}, //更新后的名字
      updatedHours: [] //更新后的事件
    };
  },
  computed: {},
  created() {
    this.getRestList();
    this.getTagsOption();
  },
  methods: {
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage;
    },
    //获取餐馆数据
    async getRestList() {
      this.loading = true;
      const data = await getRest();
      //重构数据，加入isClosed
      this.restList = _.map(data.list, item => {
        item.isClosed = !_.isEmpty(item.closed);
        return item;
      });
      this.loading = false;
    },

    //获取编辑按钮的数据
    async handleEdit(index, row) {
      this.dialogFormVisible = true;
      this.updateRest = row;
      this.title = row.name["zh-CN"];
      // 数据初始化
      this.updatedName = _.clone(_.get(row, "name", {}));
      this.updateTagArr = _.clone(_.get(row, "tags", []));
      this.timezone = _.clone(_.get(row, "timezone", ""));
      this.renderBusinessTime(row);
      this.time();
    },

    // 语言选中function
    langOptionChange(value) {
      this.langOptionsValue = _.get(this.updateRest, `name[${value}]`, "");
    },
    changeName() {
      this.updatedName[this.langValue] = this.langOptionsValue;
    },

    // 标签function开始
    async getTagsOption() {
      const data = await tags();
      if (data) {
        this.tagsOption = data.list;
      }
    },

    //添加标签
    addTags() {
      this.updateTagArr.push(this.selectTag.toUpperCase());
      this.updateTagArr = _.uniq(this.updateTagArr);
    },

    // 删除标签
    handleClose(tag) {
      this.updateTagArr.splice(this.updateTagArr.indexOf(tag), 1);
    },

    //渲染时间
    renderTimeZone() {
      const date = new Date();
      /* 纽约时间 */
      const currentTime = moment.tz(date, this.timezone);
      /* 星期几 */
      this.week = currentTime.day();
      this.newYork = moment(currentTime).format("YYYY-MM-DD HH:mm:ss");
    },

    // 渲染营业时间
    renderBusinessTime(value) {
      const hours = _.get(value, "hours", []);
      const weekday = [
        "星期一",
        "星期二",
        "星期三",
        "星期四",
        "星期五",
        "星期六",
        "星期日"
      ];

      this.businessTime = _(weekday)
        .map((item, index) => {
          return {
            key: uuidv4(),
            day: item,
            time: [
              moment()
                .startOf("day")
                .add(_.get(hours[index], "start", 0), "minutes")
                .toDate(),
              moment()
                .startOf("day")
                .add(_.get(hours[index], "end", 0), "minutes")
                .toDate()
            ]
          };
        })
        .value();
      this.updatedHours = hours;
    },

    //修改营业时间
    changeHour(v, index) {
      const start = this.getMinute(v[0]);
      const end = this.getMinute(v[1]);
      // console.log(start),
      //   console.log(end),
      //   console.log(this.updatedHours[index]);
      this.updatedHours[index].start = start;
      this.updatedHours[index].end = end;
    },
    getMinute(time) {
      return moment(time).hours() * 60 + moment(time).minute();
    },

    //开关按钮的控制
    async handleSwitch(value, row) {
      if (value) {
        const data = {
          id: row._id,
          data: {
            closed: true
          }
        };
        this.$store.commit(types.SHOW_LOADING);

        await editRest(data);
        this.$store.commit(types.HIDE_LOADING);
      } else {
        const data = {
          id: row._id,
          data: {
            closed: null
          }
        };
        this.$store.commit(types.SHOW_LOADING);

        await editRest(data);
        this.$store.commit(types.HIDE_LOADING);
      }
    },

    //关闭modal后初始化数据
    closeModal() {
      this.updateTagArr = [];
      this.langValue = "";
      this.langOptionsValue = "";
    },

    //定时器
    time() {
      setInterval(this.renderTimeZone, 1000);
    },

    //编辑餐馆数据
    async postEdit() {
      this.dialogFormVisible = false;

      const data = {
        id: this.updateRest._id,
        data: {
          name: this.updatedName,
          tags: this.updateTagArr,
          hours: this.updatedHours
        }
      };
      this.$store.commit(types.SHOW_LOADING);
      await editRest(data);
      this.$store.commit(types.HIDE_LOADING);
    }
  },
  updated() {
    // console.log("总数据====>", this.restList);
    // console.log("updatedHours", this.updatedHours);
    // console.log("businessTime", this.businessTime);
    // console.log("updatedName", this.updatedName);
  },
  destroyed() {
    if (this.time) {
      clearInterval(this.time);
    }
  }
};
</script>

<style lang="scss">
.el-table {
  // background-color: black;
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
</style>
