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
        <el-button type="primary" icon="el-icon-search" @click="getData(0)">未解决</el-button>
        <el-button type="success" icon="el-icon-lx-delete" @click="getData(1)">已解决</el-button>
      </div>
      <el-table
          :data="projList"
          border
          class="table"
          ref="multipleTable"
          header-cell-class-name="table-header"
      >
<!--        <el-table-column prop="logId" label="日志ID"></el-table-column>-->
        <el-table-column prop="reqId" label="请求ID"></el-table-column>
        <el-table-column label="日志级别" align="center">
          <template #default="scope">
            <el-tag
                :type="
                                        scope.row.logType === 10003
                                            ? 'warning'
                                            : scope.row.logType === 10004
                                            ? 'danger'
                                            : scope.row.logType === 10001
                                            ? 'info'
                                            : ''
                                    "

            >{{ getLevel(scope.row) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="proj.projName" label="项目名"></el-table-column>
<!--        <el-table-column prop="org.orgName" label="组织名"></el-table-column>-->
        <el-table-column prop="logMsg" label="日志内容"></el-table-column>
        <el-table-column prop="logTime" label="产生时间"></el-table-column>
        <el-table-column prop="logClass" label="所属类"></el-table-column>
        <el-table-column label="操作" width="180" align="center">
          <template #default="scope">
            <el-popconfirm
                v-if="scope.row.solved === 0"
                title="解决后可在回收站进行恢复或删除"
                @confirm="handleSolve(scope.$index, scope.row)"
            >
              <template #reference>
                <el-button
                    type="text"
                    icon="el-icon-lx-roundcheck"
                    class="blue"
                >解决
                </el-button>
              </template>
            </el-popconfirm>
            <el-popconfirm
                v-if="scope.row.solved === 1"
                title="确定恢复吗？"
                @confirm="handleRecover(scope.$index, scope.row)"
            >
              <template #reference>
                <el-button
                    type="text"
                    icon="el-icon-lx-refresh"
                    class="green"
                >恢复
                </el-button>
              </template>
            </el-popconfirm>
            <el-popconfirm
                v-if="scope.row.solved === 1"
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

import {delLogReq, getLogReq, solveLogReq} from "@/api/log";

export default {
  name: "requestLog",
  data() {
    return {
      query: {
        orgId: "",
        projId: "",
        searchReqId: "",
        type: "",
        solved: 0,
        page: 1,
        size: 10,
      },
      projList: [],
      pageTotal: 0,
      projName: "",
      idx: -1,
      id: -1,
    }
  },
  created() {
    this.getData(0)
  },
  methods: {
    getData(solved) {
      this.query.orgId = this.$route.params.orgId
      this.query.projId = this.$route.params.projId
      this.query.searchReqId = this.$route.params.reqId
      this.query.type = "all"
      this.query.solved = solved
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
    // 获取日志级别
    getLevel(row) {
      switch (row.logType) {
        case 10001:
          return "info"
        case 10003:
          return "warn"
        case 10004:
          return "error"
        default:
          return ""
      }
    },
    // 移除操作
    handleDelete(index, row) {
      if (row.solved !== 1) {
        this.$message.warning("请先标记解决")
        return false
      }
      let param = {
        orgId: this.$route.params.orgId,
        projId: this.$route.params.projId,
        logId: row.logId,
      }
      delLogReq(param).then(res => {
        console.log(res)
        if (res.status === "success") {
          this.$message.success("移除成功")
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
    // 标记解决
    handleSolve(index, row) {
      if (row.solved !== 0) {
        this.$message.warning("已解决")
        return false
      }
      let param = {
        orgId: this.$route.params.orgId,
        projId: this.$route.params.projId,
        logId: row.logId,
        solved: 1,
      }
      solveLogReq(param).then(res => {
        console.log(res)
        if (res.status === "success") {
          this.$message.success("解决成功")
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
    // 标记恢复
    handleRecover(index, row) {
      if (row.solved !== 1) {
        this.$message.warning("已恢复")
        return false
      }
      let param = {
        orgId: this.$route.params.orgId,
        projId: this.$route.params.projId,
        logId: row.logId,
        solved: 0,
      }
      solveLogReq(param).then(res => {
        console.log(res)
        if (res.status === "success") {
          this.$message.success("恢复成功")
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

.green {
  color: #00a854;
}

.mr10 {
  margin-right: 10px;
}

.todo-item-del {
  text-decoration: line-through;
  color: #999;
}
</style>
