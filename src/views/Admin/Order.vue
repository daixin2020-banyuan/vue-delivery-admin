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
      totalPersonOrder: 0,
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
      this.loadingFlag = true;
      await this.setOrder({
        start: value[0].toString(),
        end: value[1].toString()
      });
      this.personOrder();
      this.dailyOrder();
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

    //计算每天的单量
    dailyOrder() {
      this.daily();
      // console.log("x轴的日期====>", this.date);

      // console.log("======in order计算======");
      let arr = _.map(this.orderList, item => {
        return {
          count: _.get(item, "cart", "").length,
          date: moment(item.updatedAt).format("YYYY-MM-DD")
        };
      });
      let map = {},
        newArr = [];
      for (let i = 0; i < arr.length; i++) {
        let ai = arr[i];
        if (!map[ai.date]) {
          newArr.push({
            date: ai.date,
            count: ai.count
          });
          map[ai.date] = ai;
        } else {
          for (let j = 0; j < newArr.length; j++) {
            let dj = newArr[j];
            if (dj.date == ai.date) {
              dj.count = dj.count + ai.count;
              break;
            }
          }
        }
      }
      // console.log("订单量====>", newArr);
      // 0: {date: "2020-11-07", count: 6}
      // 1: {date: "2020-11-11", count: 1}
      // 2: {date: "2020-11-12", count: 20}
      // 3: {date: "2020-11-13", count: 73}
      let arr2 = [];
      _.forEach(this.date, i => {
        _.forEach(newArr, j => {
          if (j.date === i.date) {
            arr2.push({
              date: i.date,
              count: j.count
            });
          } else {
            arr2.push({
              date: i.date,
              count: 0
            });
          }
        });
      });
      this.finalArr = computeArr(arr2);
      // console.log("处理过的最终数据=====.>", this.finalArr);
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
      // console.log(data);
      let total = 0;
      _.forEach(this.orderList, i => {
        total += i.cart.length;
      });
      this.totalPersonOrder = total;

      const userCount = _.map(data, (v, k) => {
        return {
          name: k,
          value: v.length
        };
      });
      console.log(userCount);
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
