<template>
  <div class="home">
    <el-container>
      <!-- 左侧导航 START -->
      <el-aside :width="isCollapse ? '80px' : '190px'">
        <div class="logo">
          <img src="@/assets/logo.png" alt="" class="logo-image" />
        </div>
        <div class="aside">
          <div>
            <el-menu
              default-active="1-4-1"
              class="el-menu-vertical-demo"
              text-color="#fff"
              :collapse="isCollapse"
              router
            >
              <el-menu-item index="/admin/restaurant">
                <i class="el-icon-menu"></i>
                <span slot="title">
                  餐馆
                </span>
              </el-menu-item>

              <el-menu-item index="/admin/menu">
                <i class="el-icon-tableware"></i>
                <span slot="title">
                  菜单
                </span>
              </el-menu-item>

              <el-menu-item index="/admin/order" v-if="checkPermission()">
                <i class="el-icon-shopping-cart-full"></i>
                <span slot="title">订单</span>
              </el-menu-item>
            </el-menu>
          </div>
          <div>
            <el-button
              type="info"
              style="margin-top: 300px;  background: #333;  border: solid 1px #333;"
              @click="logOut"
              >登出</el-button
            >
          </div>
          <div
            :style="{ width: isCollapse ? '80px' : '200px' }"
            class="radio-container"
          >
            <el-radio-group v-model="isCollapse" style="margin-bottom: 20px;">
              <el-radio-button
                :label="false"
                v-show="isCollapse == true"
                style="background:black"
                >&gt;</el-radio-button
              >
              <el-radio-button :label="true" v-show="isCollapse == false"
                >&lt;</el-radio-button
              >
            </el-radio-group>
          </div>
        </div>
      </el-aside>
      <!-- 左侧导航结束 END -->

      <el-container>
        <el-header height="70px"></el-header>
        <el-main>
          <div class="main-nav">
            <el-breadcrumb separator="/">
              <el-breadcrumb-item>Admin</el-breadcrumb-item>
              <el-breadcrumb-item>{{ tags }}</el-breadcrumb-item>
            </el-breadcrumb>
          </div>
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import { getStorage } from "@/common/utils.js";
import _ from "lodash";
export default {
  name: "Admin",
  components: {},
  data() {
    return {
      widthSize: "200px",
      isCollapse: true
    };
  },
  computed: {
    tags() {
      return this.$route.name.toLowerCase();
    }
  },
  methods: {
    ...mapActions(["loginOut"]),
    logOut() {
      this.loginOut();
    },
    checkPermission() {
      const role = _.get(getStorage("role"), "role", "");
      if (role !== "visitor") {
        return true;
      }
    }
  }
};
</script>

<style lang="scss">
.home {
  height: 100vh;
}
.el-header {
  color: #333;
  text-align: center;
  border-bottom: 1px solid #e6e6e6;
}

.el-aside {
  // height: 100vh;
  min-height: 788px;
  color: #333;
  text-align: center;
  background-color: rgb(31, 31, 31);
  position: relative;
}

.el-main {
  color: #333;
  // text-align: left;
  overflow: scroll;
  display: block;
  flex: 1;
  flex-basis: auto;
  padding: 20px;
  .main-nav {
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    font-variant: tabular-nums;
    line-height: 1.5715;
    list-style: none;
    -webkit-font-feature-settings: "tnum";
    font-feature-settings: "tnum", "tnum";
    font-size: 14px;
    margin: 16px 0;
    width: 100%;
  }
}

body > .el-container {
  margin-bottom: 40px;
}

.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
  line-height: 260px;
}

.el-container:nth-child(7) .el-aside {
  line-height: 320px;
}
.aside {
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  // height: 100%;
  // width: 200px;
}
.el-menu-vertical-demo {
  background: rgb(31, 31, 31);
  min-width: 80px;
  color: white;
}
.logo {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 120px;
}
.logo-image {
  height: 60px;
  -webkit-filter: invert(100%) sepia(0) saturate(5338%) hue-rotate(117deg)
    brightness(110%) contrast(101%);
  filter: invert(100%) sepia(0) saturate(5338%) hue-rotate(117deg)
    brightness(110%) contrast(101%);
}

.el-radio-button:first-child .el-radio-button__inner {
  background: #333;
  border: solid 1px #333;
  color: #fff;
}

.home {
  .el-menu {
    border: none;
  }
}
.radio-container {
  display: flex;
  align-content: center;
  width: 200px;
  display: flex;
  align-items: center;
  justify-content: space-around;
  margin-top: 54px;
}

.el-radio-button:first-child .el-radio-button__inner {
  background: #333;
  border: solid 1px #333;
  color: #fff;
  // position: fixed;
  // left: calc(100vw -1420px);
  // top: calc(100vh - 110px);
}
.el-radio-button:last-child .el-radio-button__inner {
  background: #333;
  border: solid 1px #333;
  color: #fff;
  // position: fixed;
  // left: calc(100vw -1420px);
  // top: calc(100vh - 110px);
}
</style>
