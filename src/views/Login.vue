<template>
  <div class="login-wrap">
    <div class="ms-login">
      <div class="ms-title">后台管理系统</div>
      <el-form :model="param" :rules="rules" ref="login" label-width="0px" class="ms-content">
        <el-form-item prop="telephone">
          <el-input v-model="param.telephone" placeholder="telephone">
            <template #prepend>
              <el-button icon="el-icon-mobile-phone"></el-button>
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
          <el-button type="primary" @click="submitForm()">登录</el-button>
        </div>
        <p class="login-tips">Tips : 填注册手机号和密码。</p>
      </el-form>
    </div>
  </div>
</template>

<script>
import {login} from "@/api/login";

export default {
  data() {
    return {
      param: {
        telephone: "",
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
    this.$store.commit("clearTags")
  },
  methods: {
    submitForm() {
      this.$refs.login.validate(valid => {
        if (valid) {
          console.log(this.param)
          login(this.param).then((res) => {
            console.log(res)
            if (res.status === 'fail') {
              this.$message.error(res.data.errorMsg)
              this.$message.error("请输入正确的账号和密码")
              return false
            } else if (res.status === 'success') {
              this.$message.success("登录成功")
              localStorage.setItem("ms_username", res.data.nick)
              localStorage.setItem("ms_uid", res.data.uid)
              localStorage.setItem("authorization", res.data.token)
              this.$router.push("/")
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
