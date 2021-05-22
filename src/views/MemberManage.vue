<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades"></i> 权限管理
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-input v-model="search" placeholder="用户名或用户ID" class="handle-input mr10"></el-input>
        <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
        <el-button type="primary" icon="el-icon-lx-people" @click="handleAdd">添加</el-button>
      </div>
      <el-table
          :data="memberList"
          border
          class="table"
          ref="multipleTable"
          header-cell-class-name="table-header"
      >
        <el-table-column prop="uid" label="用户ID"></el-table-column>
        <el-table-column prop="nick" label="用户名"></el-table-column>
        <el-table-column label="角色" align="center">
          <template #default="scope">
            <el-tag
                :type="
                                        scope.row.role.code === 10001
                                            ? 'warning'
                                            : scope.row.role.code === 10002
                                            ? 'success'
                                            : scope.row.role.code === 10003
                                            ? 'info'
                                            : ''
                                    "
            >{{ scope.row.role.name }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="createTime" label="注册时间"></el-table-column>
        <el-table-column label="操作" width="180" align="center">
          <template #default="scope">
            <el-dropdown icon="el-icon-edit" @command="handleAppoint">
              <el-button
                  type="text"
                  icon="el-icon-edit"
              >
                <span class="el-dropdown-link">任命
                </span>
              </el-button>

              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item :command="beforeHandleCommand(10001, scope.row)">创建者</el-dropdown-item>
                  <el-dropdown-item :command="beforeHandleCommand(10002, scope.row)">管理员</el-dropdown-item>
                  <el-dropdown-item :command="beforeHandleCommand(10003, scope.row)">普通成员</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>

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
            :current-page="query.pageIndex"
            :page-size="query.pageSize"
            :total="pageTotal"
            @current-change="handlePageChange"
        ></el-pagination>
      </div>
    </div>

    <!-- 添加成员弹出框 -->
    <el-dialog title="添加成员" v-model="addVisible" width="30%">
      <el-form ref="form" :model="addUid" label-width="70px">
        <el-form-item label="用户id">
          <el-input v-model="addUid"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
            <el-button @click="addVisible = false">取 消</el-button>
            <el-button type="primary" @click="addMember">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import {getOrgMemberReq, addMemberReq, appointMemberReq, delMemberReq} from "@/api/member";

export default {
  name: "memberManage",
  data() {
    return {
      query: {
        orgId: "",
        page: 1,
        size: 10,
      },
      search: "",
      memberList: [],
      addVisible: false,
      pageTotal: 0,
      addUid: "",
      idx: -1,
      id: -1,
      appoint: ""
    }
  },
  created() {
    this.getData()
  },
  methods: {
    // 获取 easy-mock 的模拟数据
    getData() {
      // console.log(this.$route.params)
      // console.log(localStorage.getItem("ms_uid"))
      this.query.orgId = this.$route.params.orgId
      getOrgMemberReq(this.query).then(res => {
        console.log(res)
        if (res.status === "success") {
          this.memberList = res.data.list
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
    handleSearch() {
      this.query.page = 1
      let query = {
        orgId: this.query.orgId,
        page: this.query.page,
        size: this.query.size,
        search: this.search,
      }
      getOrgMemberReq(query).then(res => {
        console.log(res)
        if (res.status === "success") {
          this.memberList = res.data.list
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
    // 触发显示添加成员搜索框
    handleAdd() {
      this.addVisible = true
    },
    // 添加成员
    addMember() {
      let param = {
        orgId: this.$route.params.orgId,
        addUid: this.addUid,
      }
      addMemberReq(param).then(res => {
        console.log(res)
        if (res.status === "success") {
          this.memberList.push(res.data)
          this.$message.success("添加成功")
          this.addVisible = false
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
    // 移除操作
    handleDelete(index, row) {
      this.$message.success("移除成功")
      let param = {
        orgId: this.$route.params.orgId,
        delUid: row.uid,
      }
      delMemberReq(param).then(res => {
        console.log(res)
        if (res.status === "success") {
          this.$message.success("移除成功")
          this.addVisible = false
          this.memberList.splice(index, 1)
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
    // 任命前参数传递
    beforeHandleCommand(code, row) {
      return {
        'code': code,
        'row': row
      }
    },
    // 任命操作
    handleAppoint(command) {
      let code = command.code
      let row = command.row
      console.log(code)
      console.log(row)
      let appoint = ""
      switch (code) {
        case 10001:
          appoint = "创建者"
          break
        case 10002:
          appoint = "管理员"
          break
        case 10003:
          appoint = "普通成员"
          break
        default:
          appoint = ""
          return false
      }
      let param = {
        orgId: this.$route.params.orgId,
        appointUid: row.uid,
        appointment: code,
      }
      // 二次确认任命
      this.$confirm("确定要任命为" + appoint + "吗？", "提示", {
        type: "warning"
      })
          .then(() => {
                appointMemberReq(param).then(res => {
                  console.log(res)
                  if (res.status === "success") {
                    this.$message.success("任命成功")
                    location.reload()
                    return true
                  } else if (res.status === "fail") {
                    this.$message.error(res.data.errorMsg)
                    if (res.data.errorCode === 100010 || res.data.errorCode === 10002) {
                      this.$router.push("/login")
                    }
                    return false
                  }
                })
              }
          )
          .catch(() => {
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

.mr10 {
  margin-right: 10px;
}
</style>
