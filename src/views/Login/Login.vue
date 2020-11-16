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
          :rules="[
            { required: true, message: '年龄不能为空' },
            { type: 'number', message: '年龄必须为数字值' }
          ]"
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
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      ruleForm: {
        pass: "",
        username: ""
      }
    };
  },
  methods: {
    submitForm() {
      console.log("submitForm");
    },
    showDetails() {
      console.log("showDetails");
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
</style>
