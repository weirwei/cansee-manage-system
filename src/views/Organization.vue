<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades"></i> 组织列表
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-input v-model="search" placeholder="组织名或组织ID" class="handle-input mr10"></el-input>
        <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
        <el-button type="primary" icon="el-icon-lx-global" @click="handleCreateOrg">创建</el-button>
      </div>
      <el-table
          :data="orgVOList"
          border
          class="table"
          ref="multipleTable"
          header-cell-class-name="table-header"
      >
        <el-table-column prop="orgId" label="组织ID"></el-table-column>
        <el-table-column prop="orgName" label="组织名"></el-table-column>
        <el-table-column label="项目数量">
          <template #default="scope">
            <el-button
                type="text"
                @click="handleGotoProj(scope.row)"
            >{{scope.row.projNum}}</el-button>
          </template>
        </el-table-column>
        <el-table-column label="成员数量">
          <template #default="scope">
            <el-button
                type="text"
                @click="handleGotoMember(scope.row)"
            >{{scope.row.memberNum}}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="orgRegisterTime" label="注册时间"></el-table-column>
        <el-table-column label="操作" width="180" align="center">
          <template #default="scope">
            <el-button
                :disabled="scope.row.role.code !== 10001"
                type="text"
                icon="el-icon-lx-delete"
                class="red"
                @click="handleDelete(scope.$index, scope.row)"
            >注销</el-button>
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

    <!-- 创建组织弹出框 -->
    <el-dialog title="创建组织" v-model="visible" width="30%">
      <el-form ref="form" :model="orgName" label-width="70px">
        <el-form-item label="组织名">
          <el-input v-model="orgName"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
                <span class="dialog-footer">
                    <el-button @click="visible = false">取 消</el-button>
                    <el-button type="primary" @click="createOrg">确 定</el-button>
                </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import {createOrgReq, delOrgReq, getOrgReq} from "@/api/organization";

export default {
  name: "orgnization",
  data() {
    return {
      query: {
        page: 1,
        size: 10
      },
      orgName: "",
      uid: "",
      search: "",
      orgVOList: [],
      visible: false,
      pageTotal: 0,
      idx: -1,
      id: -1
    }
  },
  created() {
    this.getData()
  },
  methods: {
    // 获取 easy-mock 的模拟数据
    getData() {
      getOrgReq(this.query).then(res => {
        console.log(res)
        if (res.status === "success") {
          this.uid = res.data.uid
          this.orgVOList = res.data.orgVOList
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
        page: 1,
        size: 10,
        search: this.search,
      }
      getOrgReq(query).then(res => {
        console.log(res)
        if (res.status === "success") {
          this.uid = res.data.uid
          this.orgVOList = res.data.orgVOList
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
    // 删除操作
    handleDelete(index, row) {
      console.log(index + ":" + row)
      // 二次确认删除
      this.$confirm("确定要删除吗？", "提示", {
        type: "warning"
      })
          .then(() => {
            if (row.role.orgId !== 10001) {
              this.$message.error("权限不足")
              return false
            }
            let param = {
              orgId: row.orgId,
            }
            delOrgReq(param).then(res => {
              if (res.status === "success") {
                this.$message.success("删除成功")
                this.orgVOList.splice(index, 1)
                return true
              } else if (res.status === "fail") {
                this.$message.error(res.data.errorMsg)
                if (res.data.errorCode === 100010 || res.data.errorCode === 10002) {
                  this.$router.push("/login")
                }
                return false
              }
            })
          })
    },
    // 创建组织弹框
    handleCreateOrg() {
      this.visible = true
    },
    // 跳转到用户管理页面
    handleGotoMember(row) {
      let path = "/" + row.orgId + "/member"
      this.$router.push(path)
    },
    // 跳转到用户管理页面
    handleGotoProj(row) {
      let path = "/" + row.orgId + "/proj"
      this.$router.push(path)
    },
    // 创建组织操作
    createOrg() {
      let param = {
        uid: this.uid,
        orgName: this.orgName,
      }
      console.log(param)
      createOrgReq(param).then(res => {
        console.log(res)
        if (res.status === "success") {
          this.orgVOList.push(res.data)
          this.$message.success("创建成功")
          this.visible = false
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
      this.$set(this.query, "pageIndex", val)
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
