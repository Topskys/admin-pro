<template>
  <div class="login-box">
    <el-form ref="formRef" :rules="rules" :model="userInfo" size="large" class="form">
      <span class="form-title">企业中台登录</span>
      <el-form-item prop="username">
        <el-input v-model="userInfo.username" placeholder="请输入用户名" />
      </el-form-item>
      <el-form-item prop="password">
        <el-input v-model="userInfo.password" type="password" placeholder="请输入密码" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" class="submit-button" @click="submitForm(formRef)">Submit</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import { showMessage } from '@/utils';
import type { FormInstance } from 'element-plus';
import { useUserStore } from '@/store/user';

const formRef = ref<FormInstance>();
const userInfo = reactive({
  username: 'admin',
  password: 'admin'
});

const rules = reactive({
  username: [
    {
      required: true,
      message: '请输入用户名',
      trigger: 'blur'
    }
  ],
  password: [
    {
      required: true,
      message: '请输入密码',
      trigger: 'blur'
    }
  ]
});

const { storeUserLogin } = useUserStore();
const router = useRouter();
const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate((valid) => {
    if (valid) {
      storeUserLogin(userInfo).then(() => {
        router.push('/');
      });
    } else {
      showMessage({ message: '用户名或密码错误', type: 'error' });
    }
  });
};
</script>
<style lang="less" scoped>
.login-box {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: var(--dawei-background-color);

  .form {
    width: 300px;
    height: max-content;
  }

  .form-title {
    display: block;
    margin-bottom: 20px;
    font-size: 24px;
    text-align: center;
    font-weight: bold;
  }

  .submit-button {
    width: 100%;
  }
}
</style>
