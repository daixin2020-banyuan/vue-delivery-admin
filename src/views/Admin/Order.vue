<template>
  <div>
    <div class="date-picker-container">
      <el-date-picker
        v-model="dataValue"
        type="daterange"
        unlink-panels
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        :picker-options="pickerOptions"
        @change="changeDate"
      >
      </el-date-picker>
    </div>

    <div style="display: inline; float: left; width: 50%; ">
      <ve-line
        :data="chartData"
        :legend-visible="false"
        :loading="loadingFlag"
        :data-empty="false"
        height="400px"
      />
    </div>
    <div style="display: inline;float: right; width: 50%; ">
      <ve-pie
        :data="chartData"
        :legend-visible="false"
        :loading="loadingFlag"
        :settings="chartSettings"
        height="400px"
      />
    </div>
    <div style="display: inline;float: left; width: 50%; ">
      <ve-pie
        :data="chartData2"
        :settings="chartSettings2"
        :legend-visible="false"
        :loading="loadingFlag"
        height="400px"
      />
    </div>

    <div></div>
  </div>
</template>

<script>
import moment from "moment";
import { mapActions, mapState } from "vuex";
import { getAllDate, computeArr } from "@/common/utils.js";
import _ from "lodash";
import "v-charts/lib/style.css";

export default {
  name: "Order",
  data() {
    this.chartSettings = {
      label: {
        normal: {
          formatter: params => {
            // console.log(params);
            return `${params.data.name} :${
              params.data.value
            } (${params.percent + "%"} )`;
          }
        }
      }
    };
    this.chartSettings2 = {
      label: {
        normal: {
          formatter: params => {
            return `${params.data.name}  ${this.chartData2.columns[1]} :${params.data.value}`;
          }
        }
      }
    };
    return {
      dataValue: "",
      start: "",
      date: [], //X轴的数据
      finalArr: [], //处理后的数据
      loadingFlag: false,
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      }, //el time picker配置

      chartData: {
        columns: ["date", "count"],
        rows: [{ date: "0", count: 0 }]
      },
      chartData2: {
        columns: ["name", "value"],
        rows: [{ name: "0", value: 0 }]
      }
    };
  },
  computed: {
    ...mapState({
      orderList: state => state.Order.orderList
    })
  },

  methods: {
    ...mapActions(["setOrder"]),
    async changeDate(value) {
      this.start = moment(value[0]).format("YYYY-MM-DD");
      this.end = moment(value[1]).format("YYYY-MM-DD");
      console.log("this.start=====>", this.start);
      console.log("this.end=====>", this.end);

      this.loadingFlag = true;
      await this.setOrder({
        start: value[0].toISOString(),
        end: value[1].toISOString()
      });
      this.personOrder();
      // this.dailyOrder();
      this.test();
      this.loadingFlag = false;
    },

    //计算订单量,要按天
    daily() {
      let dateArr = getAllDate(this.start, this.end);
      let newDataArr = _.map(dateArr, i => {
        return { date: i };
      });
      this.date = newDataArr;
    },

    //目标数据 {date:11-20,count:0}

    test() {
      this.daily();
      let data = _(this.orderList)
        .map(item => {
          return { date: moment(item.updatedAt).format("YYYY-MM-DD") };
        })
        .groupBy("date")
        .value();
      // console.log(data);
      const count = _.map(data, (v, k) => {
        return {
          date: k,
          value: v.length
        };
      });
      // console.log(count);
      let arr2 = [];
      _.forEach(this.date, i => {
        _.forEach(count, j => {
          arr2.push({
            date: i.date,
            count: j.date == i.date ? j.value : 0
          });
        });
      });
      this.finalArr = computeArr(arr2);

      this.chartData.rows = computeArr(arr2);
    },

    //计算下单人数
    personOrder() {
      let data = _(this.orderList)
        .groupBy(item => {
          if (item.user) {
            return item.user.username;
          }
        })
        .value();
      // 计算总的订单量
      // console.log("personOrder", data);

      const userCount = _.map(data, (v, k) => {
        return {
          name: k,
          value: v.length
        };
      });
      // console.log(userCount);
      // 0: {name: "zhoumengruu", value: 18, percent: "14.29%"}
      // 1: {name: "tangdian0925_", value: 1, percent: "0.79%"}
      // 2: {name: "undefined", value: 18, percent: "14.29%"}
      // 3: {name: "zhouzhou", value: 2, percent: "1.59%"}
      this.chartData2.rows = userCount;
    }
  }
};
</script>

<style lang="scss">
#line {
  width: 100%;
  height: 400px;
}
</style>
