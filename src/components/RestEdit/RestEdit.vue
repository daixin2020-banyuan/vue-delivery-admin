<template>
  <div>
    <!-- 操作按钮的嵌套表格 -->
    <el-dialog
      :title="restaurant.title"
      :visible.sync="isShowFlag"
      @close="closeHandle"
    >
      <el-form :model="restaurant.updateRest">
        <!-- 语言选择 -->
        <el-row>
          <el-form-item>
            <el-input v-model="restaurant.updatedName[`${defaultlang}`]">
              <el-select
                slot="prepend"
                v-model="defaultlang"
                style=" width :100px"
                value="zh-CN"
                placeholder="请选择语言"
                @change="changeLanguage"
              >
                <el-option
                  v-for="item in language"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-input>
          </el-form-item>
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
              v-for="item in restaurant.updateTagArr"
              :key="item.key"
              :type="item"
              effect="dark"
              closable
              style="margin-left: 10px;height:30px;line-height:30px;margin-top:5px"
              @close="handleClose(item)"
            >
              {{ item.toUpperCase() }}
            </el-tag>
          </el-col>
        </el-row>

        <!-- 餐馆时间显示 -->
        <el-form-item style="margin-top:20px">
          <el-row>
            <el-col :span="23">
              <el-card shadow="always">
                <span>纽约当地时间：{{ newYork }}</span>
              </el-card>
            </el-col>
          </el-row>
        </el-form-item>

        <!-- 餐馆的营业时间 -->
        <el-form-item style="margin-top:20px">
          <div v-for="(item, index) in businessTime" :key="item.key">
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
        <el-button @click="closeHandle">取 消</el-button>
        <el-button type="primary" @click="postEdit">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 操作按钮的嵌套表格  END-->
  </div>
</template>

<script>
import { tags } from "@/request/tags.js";
import Moment from "moment-timezone";
Moment.locale("zh-cn");
import { v4 as uuidv4 } from "uuid";
import _ from "lodash";
import { mapActions } from "vuex";
export default {
  name: "RestEdit",
  data() {
    return {
      isShowFlag: false,
      language: [
        { value: "zh-CN", label: "中文" },
        { value: "en-US", label: "英文" }
      ],
      defaultlang: "zh-CN",
      langOptionsValue: "", //input语言选择显示值
      tagsOption: [], //后端获取的所有tags
      selectTag: "", // 当前选中的tags
      newYork: "", //纽约时间
      week: "", //周几
      businessTime: [], //营业时间
      updatedHours: [] //更新后的事件
    };
  },
  props: {
    isShow: {
      type: Boolean,
      required: true
    },
    restaurant: {
      type: Object,
      required: true
    }
  },
  computed: {},

  created() {
    this.getTagsOption();
    this.timer();
  },
  watch: {
    restaurant: {
      /* eslint-disable */
      handler(newV, oldV) {
        this.restaurant.updateRest;
        this.renderBusinessTime(newV.updateRest);
      },
      deep: true
    },
    isShow(v) {
      this.isShowFlag = v;
    }
  },
  methods: {
    ...mapActions(["changeRestModel"]),
    closeHandle() {
      this.$emit("closeModal", false);
      this.selectTag = "";
      this.restaurant.updateTagArr = [];
      this.langValue = "";
      this.langOptionsValue = "";
    },

    // 语言选中function

    changeLanguage(val) {
      this.defaultlang = val;
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
      this.restaurant.updateTagArr.push(this.selectTag);
      this.restaurant.updateTagArr = _.uniq(this.restaurant.updateTagArr);
    },

    // 删除标签
    handleClose(tag) {
      this.restaurant.updateTagArr.splice(
        this.restaurant.updateTagArr.indexOf(tag),
        1
      );
    },

    //渲染时间
    renderTimeZone() {
      const date = new Date();
      /* 纽约时间 */
      const currentTime = Moment.tz(date, this.restaurant.timezone);
      /* 星期几 */
      this.week = currentTime.day();
      this.newYork = Moment(currentTime).format("YYYY-MM-DD HH:mm:ss");
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
              Moment()
                .startOf("day")
                .add(_.get(hours[index], "start", 0), "minutes")
                .toDate(),
              Moment()
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

      //   const end = this.getMinute(v[1]);
      //   console.log("this.businessTime===>", this.businessTime[0].time);
      console.log("updatedHours===>", this.updatedHours);
      this.updatedHours[index].start = start;
      //   this.updatedHours[index].end = end;

      console.log("updatedHours===>", this.updatedHours);
    },
    getMinute(time) {
      console.log("time ==>", time);
      return Moment(time).hours() * 60 + Moment(time).minute();
    },

    //关闭modal后初始化数据
    close() {
      this.$emit("closeModal", false);
      this.selectTag = "";
      this.restaurant.updateTagArr = [];
      this.langValue = "";
      this.langOptionsValue = "";
    },

    //定时器
    timer() {
      setInterval(() => {
        const date = new Date();
        this.newYork = Moment.tz(date, "America/New_York").format(
          "YYYY-MM-DD HH:mm:ss dddd"
        );
      }, 1000);
    },

    //编辑餐馆数据
    async postEdit() {
      const data = {
        id: this.restaurant.updateRest._id,
        data: {
          name: this.restaurant.updatedName,
          tags: this.restaurant.updateTagArr,
          hours: this.updatedHours
        }
      };
      await this.changeRestModel(data);
      //   this.$store.dispatch("setRest");
      this.$emit("closeModal", false);
    }
  },
  destroyed() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }
};
</script>

<style></style>
