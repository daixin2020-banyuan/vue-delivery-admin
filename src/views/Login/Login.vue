<template>
  <div class="login-container">
    <div class="login-input-container">
      <el-form
        :model="ruleForm"
        status-icon
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item
          label="账号"
          prop="username"
          hide-required-asterisk="true"
          :rules="[{ required: true, message: '账号不能为空' }]"
        >
          <el-input
            type="text"
            v-model="ruleForm.username"
            autocomplete="off"
            style="width:400px"
          >
          </el-input>
        </el-form-item>
        <el-form-item
          label="密码"
          prop="pass"
          :rules="[{ required: true, message: '密码不能为空' }]"
        >
          <el-input type="password" v-model="ruleForm.pass" autocomplete="off">
          </el-input>
        </el-form-item>
        <el-form-item style="display:flex;  justify-content: center;">
          <el-button type="primary" @click="submitForm">提交</el-button>
          <el-button @click="showDetails">显示</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-drawer :visible.sync="isVisible">
      <el-card class="box-card">
        <p>管理员</p>
        <p>username: admin</p>
        <p>password: 随意</p>
      </el-card>

      <el-card class="box-card">
        <p>部门员工</p>
        <p>username: employee</p>
        <p>password: 随意</p>
      </el-card>

      <el-card class="box-card">
        <p>游客</p>
        <p>username: visitor</p>
        <p>password: 随意</p>
      </el-card>
    </el-drawer>
  </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
  name: "Login",
  data() {
    return {
      ruleForm: {
        pass: "",
        username: ""
      },
      isVisible: false
    };
  },
  methods: {
    ...mapActions(["login"]),
    submitForm() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          const info = {
            username: this.ruleForm.username,
            password: this.ruleForm.pass
          };
          console.log("login.vue", info);
          this.login(info);
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm() {
      this.$refs.ruleForm.resetFields();
    },
    showDetails() {
      this.isVisible = true;
    }
  }
};
</script>

<style lang="scss">
.login-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
}
.box-card {
  width: 280px;
  margin: 20px auto 0 auto;
}
</style>
