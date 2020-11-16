import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import VCharts from "v-charts";
Vue.use(VCharts);

Vue.use(ElementUI);

Vue.config.productionTip = false;

/* 金额样式过滤器 */

Vue.filter("FormatPrice", value => {
  value = (value / 100).toFixed(2);
  return "$" + value;
});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
