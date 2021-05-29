<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="10">
        <el-card shadow="hover" class="mgb20" style="height:252px;">
          <div class="user-info">
            <img src="../assets/img/img.jpg" class="user-avator" alt/>
            <div class="user-info-cont">
              <div class="user-info-name">{{ user.nick }}</div>
            </div>
          </div>
          <div class="user-info-list">
            注册时间：
            <span>{{ user.createTime }}</span>
          </div>
        </el-card>
        <el-card shadow="hover">
          <schart ref="line" class="schart" canvasId="line" :options="lineChat"></schart>
        </el-card>
      </el-col>
      <el-col :span="14">
        <el-row :gutter="20" class="mgb20">
          <el-col :span="8">
            <el-card shadow="hover" :body-style="{ padding: '0px' }">
              <div class="grid-content grid-con-1">
                <i class="el-icon-user-solid grid-con-icon"></i>
                <div class="grid-cont-right">
                  <div class="grid-num">{{ logNum.info }}</div>
                  <div>INFO</div>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card shadow="hover" :body-style="{ padding: '0px' }">
              <div class="grid-content grid-con-2">
                <i class="el-icon-message-solid grid-con-icon"></i>
                <div class="grid-cont-right">
                  <div class="grid-num">{{ logNum.warn }}</div>
                  <div>WARN</div>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card shadow="hover" :body-style="{ padding: '0px' }">
              <div class="grid-content grid-con-3">
                <i class="el-icon-s-goods grid-con-icon"></i>
                <div class="grid-cont-right">
                  <div class="grid-num">{{ logNum.error }}</div>
                  <div>ERROR</div>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
        <el-card shadow="hover" style="height:403px;">
          <template #header>
            <div class="clearfix">
              <span>待办事项</span>
              <el-button style="float: right; padding: 3px 0" type="text">添加</el-button>
            </div>
          </template>

          <el-table :show-header="false" :data="todoList" style="width:100%;">
            <el-table-column width="40">
              <template #default="scope">
                <el-checkbox v-model="scope.row.status"></el-checkbox>
              </template>
            </el-table-column>
            <el-table-column>
              <template #default="scope">
                <div
                    class="todo-item"
                    :class="{
                                        'todo-item-del': scope.row.status,
                                    }"
                >{{ scope.row.title }}
                </div>
              </template>
            </el-table-column>
            <el-table-column width="60">
              <template>
                <i class="el-icon-edit"></i>
                <i class="el-icon-delete"></i>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Schart from "vue-schart";
import {getLogChatReq, getLogNumReq, getUserInfoReq} from "@/api";

export default {
  name: "dashboard",
  data() {
    return {
      user: {
        uid: "",
        email: "",
        nick: localStorage.getItem("ms_username"),
        createTime: "",
        updateTime: "",
        telephone: "",
      },
      logNum: {
        info: 0,
        debug: 0,
        warn: 0,
        error: 0,
      },
      todoList: [
        {
          title: "今天要修复100个bug",
          status: false
        },
        {
          title: "今天要修复100个bug",
          status: false
        },
        {
          title: "今天要写100行代码加几个bug吧",
          status: false
        },
        {
          title: "今天要修复100个bug",
          status: false
        },
        {
          title: "今天要修复100个bug",
          status: true
        },
        {
          title: "今天要写100行代码加几个bug吧",
          status: true
        },
        {
          title: "再加一条看看",
          status: true
        }
      ],
      lineChat: {
        type: "line",
        title: {
          text: "最近几个月各品类销售趋势图"
        },
        labels: ["6月", "7月", "8月", "9月", "10月"],
        datasets: [
          {
            label: "家电",
            data: [234, 278, 270, 190, 230]
          },
          {
            label: "百货",
            data: [164, 178, 150, 135, 160]
          },
          {
            label: "食品",
            data: [74, 118, 200, 235, 90]
          }
        ]
      }
    };
  },
  components: {
    Schart
  },
  created() {
    this.getData()
  },
  methods: {
    getData() {
      this.handleUserInfo()
      this.handleLogNum()
      this.handleLogChat()
    },
    // 获得用户信息
    handleUserInfo() {
      getUserInfoReq().then(res => {
        console.log(res)
        if (res.status === "success") {
          this.user.uid = res.data.uid
          this.user.nick = res.data.nick
          this.user.email = res.data.email
          this.user.createTime = res.data.createTime
          this.user.updateTime = res.data.updateTime
          this.user.telephone = res.data.telephone
          return true
        } else if (res.status === "fail") {
          this.$message.error(res.data.errorMsg)
          if (res.data.errorCode === 100010 || res.data.errorCode === 10002) {
            this.$router.push("/login")
          }
          return false
        }
      })
    },
    // 获得各级别日志数
    handleLogNum() {
      getLogNumReq().then(res => {
        console.log(res)
        if (res.status === "success") {
          this.logNum.info = res.data.info
          this.logNum.debug = res.data.debug
          this.logNum.warn = res.data.warning
          this.logNum.error = res.data.error
          return true
        } else if (res.status === "fail") {
          this.$message.error(res.data.errorMsg)
          if (res.data.errorCode === 100010 || res.data.errorCode === 10002) {
            this.$router.push("/login")
          }
          return false
        }
      })
    },
    // 获得表格数据
    handleLogChat() {
      getLogChatReq().then(res => {
        console.log(res)
        if (res.status === "success") {
          this.lineChat.title.text = res.data.text
          this.lineChat.labels = res.data.labels
          this.lineChat.datasets = res.data.dataSets
          return true
        } else if (res.status === "fail") {
          this.$message.error(res.data.errorMsg)
          if (res.data.errorCode === 100010 || res.data.errorCode === 10002) {
            this.$router.push("/login")
          }
          return false
        }
      })
    },
    changeDate() {
      const now = new Date().getTime();
      this.data.forEach((item, index) => {
        const date = new Date(now - (6 - index) * 86400000);
        item.name = `${date.getFullYear()}/${date.getMonth() +
        1}/${date.getDate()}`;
      });
    }
  }
};
</script>

<style scoped>
.el-row {
  margin-bottom: 20px;
}

.grid-content {
  display: flex;
  align-items: center;
  height: 100px;
}

.grid-cont-right {
  flex: 1;
  text-align: center;
  font-size: 14px;
  color: #999;
}

.grid-num {
  font-size: 30px;
  font-weight: bold;
}

.grid-con-icon {
  font-size: 50px;
  width: 100px;
  height: 100px;
  text-align: center;
  line-height: 100px;
  color: #fff;
}

.grid-con-1 .grid-con-icon {
  background: rgb(45, 140, 240);
}

.grid-con-1 .grid-num {
  color: rgb(45, 140, 240);
}

.grid-con-2 .grid-con-icon {
  background: rgb(100, 213, 114);
}

.grid-con-2 .grid-num {
  color: rgb(45, 140, 240);
}

.grid-con-3 .grid-con-icon {
  background: rgb(242, 94, 67);
}

.grid-con-3 .grid-num {
  color: rgb(242, 94, 67);
}

.user-info {
  display: flex;
  align-items: center;
  padding-bottom: 20px;
  border-bottom: 2px solid #ccc;
  margin-bottom: 20px;
}

.user-avator {
  width: 120px;
  height: 120px;
  border-radius: 50%;
}

.user-info-cont {
  padding-left: 50px;
  flex: 1;
  font-size: 14px;
  color: #999;
}

.user-info-cont div:first-child {
  font-size: 30px;
  color: #222;
}

.user-info-list {
  font-size: 14px;
  color: #999;
  line-height: 25px;
}

.user-info-list span {
  margin-left: 70px;
}

.mgb20 {
  margin-bottom: 20px;
}

.todo-item {
  font-size: 14px;
}

.todo-item-del {
  text-decoration: line-through;
  color: #999;
}

.schart {
  width: 100%;
  height: 300px;
}
</style>
