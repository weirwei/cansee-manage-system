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
        <el-input v-model="query.name" placeholder="用户名" class="handle-input mr10"></el-input>
        <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
        <el-button type="primary" icon="el-icon-lx-people" @click="handleAdd">添加</el-button>
      </div>
      <el-table
          :data="tableData"
          border
          class="table"
          ref="multipleTable"
          header-cell-class-name="table-header"
      >
        <el-table-column prop="uid" label="用户ID"></el-table-column>
        <el-table-column prop="name" label="用户名"></el-table-column>
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

        <el-table-column prop="date" label="注册时间"></el-table-column>
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
                  <el-dropdown-item command="10001">创建者</el-dropdown-item>
                  <el-dropdown-item command="10002">管理员</el-dropdown-item>
                  <el-dropdown-item command="10003">普通成员</el-dropdown-item>
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
      <el-form ref="form" :model="form" label-width="70px">
        <el-form-item label="用户id">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
            <el-button @click="addVisible = false">取 消</el-button>
            <el-button type="primary" @click="makeSure">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import {fetchData} from "../api/index";

export default {
  name: "memberManage",
  data() {
    return {
      query: {
        address: "",
        name: "",
        pageIndex: 1,
        pageSize: 10
      },
      tableData: [],
      delList: [],
      addVisible: false,
      pageTotal: 0,
      form: {},
      idx: -1,
      id: -1,
      appoint: ""
    };
  },
  created() {
    this.getData();
  },
  methods: {
    // 获取 easy-mock 的模拟数据
    getData() {
      fetchData(this.query).then(res => {
        console.log(res);
        this.tableData = res.list;
        this.pageTotal = res.pageTotal || 50;
      });
    },
    // 触发搜索按钮
    handleSearch() {
      this.$set(this.query, "pageIndex", 1);
      this.getData();
    },
    // 触发显示添加成员搜索框
    handleAdd() {
      this.addVisible = true;
    },
    // 移除操作
    handleDelete(index) {
      this.$message.success("移除成功");
      this.tableData.splice(index, 1);
    },
    // 任命操作
    handleAppoint(command) {
      let appoint = ""
      switch (command) {
        case "10001":
          appoint = "创建者";
          break;
        case "10002":
          appoint = "管理员";
          break;
        case "10003":
          appoint = "普通成员";
          break
        default:
          appoint = ""
      }
      // 二次确认删除
      this.$confirm("确定要任命为" + appoint + "吗？", "提示", {
        type: "warning"
      })
          .then(() => {
            this.$message.success("任命成功");

          })
          .catch(() => {
          });
    },
    // 保存编辑
    makeSure() {
      this.addVisible = false;
      this.$message.success(`修改第 ${this.idx + 1} 行成功`);
      this.$set(this.tableData, this.idx, this.form);
    },
    // 分页导航
    handlePageChange(val) {
      this.$set(this.query, "pageIndex", val);
      this.getData();
    }
  }
};
</script>

<style scoped>
.handle-box {
  margin-bottom: 20px;
}

.handle-select {
  width: 120px;
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

.table-td-thumb {
  display: block;
  margin: auto;
  width: 40px;
  height: 40px;
}
</style>
