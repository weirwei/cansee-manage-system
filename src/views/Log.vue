<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades"></i> 日志管理
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-date-picker
            class="time-picker"
            v-model="logTime"
            type="datetimerange"
            :shortcuts="shortcuts"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            align="right">
        </el-date-picker>
        <el-input v-model="searchReqId" placeholder="requestId" class="handle-input mr10"></el-input>
        <el-button type="primary" icon="el-icon-search" @click="handleSearch(1)">搜索</el-button>
        <el-button type="success" icon="el-icon-lx-delete" @click="handleSearch(0)">回收站</el-button>
      </div>
      <el-table
          :data="projList"
          border
          class="table"
          ref="multipleTable"
          header-cell-class-name="table-header"
      >
        <el-table-column prop="logId" label="日志ID"></el-table-column>
        <el-table-column prop="reqId" label="请求ID"></el-table-column>
        <el-table-column label="日志级别" align="center">
          <template #default="scope">
            <el-tag
                :type="
                                        scope.row.logType === 10003
                                            ? 'warning'
                                            : scope.row.logType === 10002
                                            ? 'success'
                                            : scope.row.logType === 10001
                                            ? 'info'
                                            : ''
                                    "

            >{{ getLevel(scope.row) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="proj.projName" label="项目名"></el-table-column>
        <el-table-column prop="org.orgName" label="组织名"></el-table-column>
        <el-table-column prop="logTime" label="产生时间"></el-table-column>
        <el-table-column prop="logClass" label="所属类"></el-table-column>
        <el-table-column label="操作" width="180" align="center">
          <template #default="scope">
            <el-button
                type="text"
                icon="el-icon-lx-text"
                class="blue"
                @click="handleGetProjConf"
            >配置
            </el-button>
            <el-popconfirm
                title="确定移除吗？"
                @confirm="handleDelete(scope.$index, scope.row)"
            >
              <template #reference>
                <el-button
                    type="text"
                    icon="el-icon-delete"
                    class="red"

                >移除
                </el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
            background
            layout="total, prev, pager, next"
            :current-page="query.page"
            :page-size="query.size"
            :total="pageTotal"
            @current-change="handlePageChange"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>

import {delLogReq, getLogReq} from "@/api/log";

export default {
  name: "log",
  data() {
    return {
      query: {
        orgId: "",
        projId: "",
        type: "",
        page: 1,
        size: 10,
      },
      shortcuts: [{
        text: '最近一周',
        value: (() => {
          const end = new Date();
          const start = new Date();
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
          return [start, end]
        })()
      }, {
        text: '最近一个月',
        value: (() => {
          const end = new Date();
          const start = new Date();
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
          return [start, end]
        })()
      }, {
        text: '最近三个月',
        value: (() => {
          const end = new Date();
          const start = new Date();
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
          return [start, end]
        })()
      }],
      logTime: [],
      searchReqId: "",
      projList: [],
      addVisible: false,
      pageTotal: 0,
      projName: "",
      idx: -1,
      id: -1,
    }
  },
  created() {
    this.getData()
  },
  methods: {
    getData() {
      this.query.orgId = this.$route.params.orgId
      this.query.projId = this.$route.params.projId
      this.query.type = this.$route.params.type
      getLogReq(this.query).then(res => {
        console.log(res)
        if (res.status === "success") {
          this.projList = res.data.list
          this.pageTotal = res.data.pageTotal || 50
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
    // 触发搜索按钮
    handleSearch(solved) {
      this.query.page = 1
      this.query.orgId = this.$route.params.orgId
      this.query.projId = this.$route.params.projId
      this.query.type = this.$route.params.type
      let start, end;
      // 获取时间戳
      if (this.logTime !== null && this.logTime.length === 2) {
        start = new Date(this.logTime[0]).getTime()
        end = new Date(this.logTime[1]).getTime()
      }
      let query = {
        orgId: this.query.orgId,
        projId: this.query.projId,
        type: this.query.type,
        page: this.query.page,
        size: this.query.size,
        start: start,
        end: end,
        searchReqId: this.searchReqId,
        solved: solved,
      }
      getLogReq(query).then(res => {
        console.log(res)
        if (res.status === "success") {
          this.projList = res.data.list
          this.pageTotal = res.data.pageTotal || 50
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
    // 获取日志级别
    getLevel(row) {
      switch (row.logType) {
        case 10001:
          return "info"
        case 10002:
          return "warn"
        case 10003:
          return "error"
        default:
          return ""
      }
    },
    // 移除操作
    handleDelete(index, row) {
      this.$message.success("移除成功")
      let param = {
        orgId: this.$route.params.orgId,
        delUid: row.uid,
      }
      delLogReq(param).then(res => {
        console.log(res)
        if (res.status === "success") {
          this.$message.success("移除成功")
          this.addVisible = false
          this.projList.splice(index, 1)
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
    // 获得项目配置信息
    handleGetProjConf() {

    },
    // 分页导航
    handlePageChange(val) {
      this.query.page = val
      this.getData()
    }
  }
}
</script>

<style scoped>
.handle-box {
  margin-bottom: 20px;
}

.handle-input {
  width: 300px;
  display: inline-block;
}

.table {
  width: 100%;
  font-size: 14px;
}

.red {
  color: #ff0000;
}

.blue {
  color: #0099ff;
}

.mr10 {
  margin-right: 10px;
}

.todo-item-del {
  text-decoration: line-through;
  color: #999;
}
</style>
