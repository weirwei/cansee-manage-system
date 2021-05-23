<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades"></i> 项目管理
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-input v-model="search" placeholder="项目名或项目ID" class="handle-input mr10"></el-input>
        <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
        <el-button type="primary" icon="el-icon-lx-goods" @click="handleAdd">添加</el-button>
      </div>
      <el-table
          :data="projList"
          border
          class="table"
          ref="multipleTable"
          header-cell-class-name="table-header"
      >
        <el-table-column prop="projId" label="项目ID"></el-table-column>
        <el-table-column prop="projName" label="项目名"></el-table-column>
        <el-table-column label="debug" align="center">
          <template #default="scope">
            <el-tag type="info"
            >{{ scope.row.logNum.debug }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="warning" align="center">
          <template #default="scope">
            <el-tag type="warning"
            >{{ scope.row.logNum.warning }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="error" align="center">
          <template #default="scope">
            <el-tag type="danger"
            >{{ scope.row.logNum.error }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="createTime" label="创建时间"></el-table-column>
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

    <!-- 新建项目弹出框 -->
    <el-dialog title="新建项目" v-model="addVisible" width="30%">
      <el-form ref="form" :model="projName" label-width="70px">
        <el-form-item label="项目名">
          <el-input v-model="projName"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
            <el-button @click="addVisible = false">取 消</el-button>
            <el-button type="primary" @click="addProj">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>

import {addProjReq, delProjReq, getOrgProjReq} from "@/api/project";

export default {
  name: "project",
  data() {
    return {
      query: {
        orgId: "",
        page: 1,
        size: 10,
      },
      search: "",
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
    // 获取 easy-mock 的模拟数据
    getData() {
      // console.log(this.$route.params)
      // console.log(localStorage.getItem("ms_uid"))
      this.query.orgId = this.$route.params.orgId
      getOrgProjReq(this.query).then(res => {
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
    handleSearch() {
      this.query.page = 1
      let query = {
        orgId: this.query.orgId,
        page: this.query.page,
        size: this.query.size,
        search: this.search,
      }
      getOrgProjReq(query).then(res => {
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
    // 触发显示添加成员搜索框
    handleAdd() {
      this.addVisible = true
    },
    // 添加项目
    addProj() {
      console.log("projName: " + this.projName)
      let param = {
        orgId: this.$route.params.orgId,
        projName: this.projName,
      }
      addProjReq(param).then(res => {
        console.log(res)
        if (res.status === "success") {
          this.projList.push(res.data)
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
      delProjReq(param).then(res => {
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
</style>
