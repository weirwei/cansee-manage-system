<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades"></i> 注册
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-form :model="param" :rules="rules" ref="login" label-width="0px" class="ms-content">
      <el-form-item prop="telephone">
        <el-input v-model="param.telephone" placeholder="telephone">
          <template #prepend>
            <el-button icon="el-icon-mobile-phone"></el-button>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item prop="nickname">
        <el-input v-model="param.nickname" placeholder="nickname">
          <template #prepend>
            <el-button icon="el-icon-user"></el-button>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
            type="password"
            placeholder="password"
            v-model="param.passwd"
            @keyup.enter="submitForm()"
        >
          <template #prepend>
            <el-button icon="el-icon-lock"></el-button>
          </template>
        </el-input>
      </el-form-item>
      <div class="login-btn">
        <el-button type="primary" @click="submitForm()">注册</el-button>
      </div>
      <p class="login-tips">Tips : 用户名和密码随便填。</p>
    </el-form>

  </div>
</template>

<script>
import {register} from "@/api/index";

export default {
  name: "register",
  data() {
    return {
      param: {
        telephone: "",
        nickname: "",
        passwd: ""
      },
      rules: {
        telephone: [
          {
            required: true,
            message: "请输入手机号码",
            trigger: "blur",
          },
          {
            pattern: /^1[34578]\d{9}$/,
            message: "手机号码格式错误",
            trigger: "blur"
          }
        ],
        passwd: [
          {required: true, message: "请输入密码", trigger: "blur"}
        ]
      }
    }
  },
  created() {
  },
  methods: {
    submitForm() {
      this.$refs.login.validate(valid => {
        if (valid) {
          console.log(this.param)
          register(this.param).then((res) => {
            console.log(res)
            if (res.status === 'fail') {
              this.$message.error(res.data.errorMsg)
              this.$message.error("注册失败")
              return false
            } else if (res.status === 'success') {
              this.$message.success("注册成功")
              location.reload()
              return true
            }
          })
        } else {
          this.$message.error("请输入账号和密码")
          return false
        }
      })
    }

  }
}
</script>

<style scoped>
.login-wrap {
  position: relative;
  width: 100%;
  height: 100%;
  background-image: url(../assets/img/login-bg.jpg);
  background-size: 100%;
}

.ms-title {
  width: 100%;
  line-height: 50px;
  text-align: center;
  font-size: 20px;
  color: #fff;
  border-bottom: 1px solid #ddd;
}

.ms-login {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 350px;
  margin: -190px 0 0 -175px;
  border-radius: 5px;
  background: rgba(255, 255, 255, 0.3);
  overflow: hidden;
}

.ms-content {
  padding: 30px 30px;
}

.login-btn {
  text-align: center;
}

.login-btn button {
  width: 100%;
  height: 36px;
  margin-bottom: 10px;
}

.login-tips {
  font-size: 12px;
  line-height: 30px;
  color: #fff;
}
</style>

