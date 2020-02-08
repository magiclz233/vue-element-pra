<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 整体卡片 -->
    <el-card shadow="never">
      <!-- 搜索框部分 -->
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input
            placeholder="请输入内容"
            v-model="inputData"
            class="input-with-select"
          >
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>

        <el-col :span="4">
          <el-button type="primary">添加用户</el-button>
        </el-col>
      </el-row>

      <el-row>
        <el-col>
          <!-- 表格部分 -->
          <el-table :data="userList" border style="width: 100%">
            <el-table-column type="index" label="#"> </el-table-column>
            <el-table-column
              prop="username"
              label="姓名"
              width="130"
            ></el-table-column>
            <el-table-column
              prop="email"
              label="邮箱"
              width="190"
            ></el-table-column>
            <el-table-column
              prop="mobile"
              label="电话"
              width="190"
            ></el-table-column>
            <el-table-column
              prop="role_name"
              label="角色"
              width="149"
            ></el-table-column>
            <el-table-column prop="mg_state" label="状态" width="100">
              <template slot-scope="scope">
                <el-switch v-model="scope.row.state"></el-switch>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="175">
              <template>
                <el-tooltip
                  effect="dark"
                  content="编辑"
                  placement="top"
                  :enterable="false"
                >
                  <el-button
                    type="primary"
                    icon="el-icon-edit"
                    size="mini"
                  ></el-button>
                </el-tooltip>
                <el-tooltip
                  effect="dark"
                  content="删除"
                  placement="top"
                  :enterable="false"
                >
                  <el-button
                    type="danger"
                    icon="el-icon-delete"
                    size="mini"
                  ></el-button>
                </el-tooltip>
                <el-tooltip
                  effect="dark"
                  content="分配角色"
                  placement="top"
                  :enterable="false"
                >
                  <el-button
                    type="warning"
                    icon="el-icon-setting"
                    size="mini"
                  ></el-button>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
          <!-- 分页菜单 -->
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="queryInfo.pagenum"
            :page-sizes="[2, 5, 10, 20]"
            :page-size="queryInfo.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          >
          </el-pagination>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      total: 0,
      userList: [],
      inputData: "",
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 5
      },
      stateValue: false
    };
  },
  created() {
    this.getUserList();
  },
  methods: {
    getUserList() {
      this.$axios
        .get("users", {
          params: this.queryInfo
        })
        .then(res => {
          if (res.data.meta.status !== 200)
            return this.$message.error(res.data.meta.msg);
          this.userList = res.data.data.users;
          this.total = res.data.data.total;
        })
        .catch(err => {
          this.$message.error(err);
        });
    },
    // 每页显示个数
    handleSizeChange(pageSize){
      this.queryInfo.pagesize = pageSize;
      this.getUserList();
    },
    // 显示第几页
    handleCurrentChange(pageNum){
      this.queryInfo.pagenum = pageNum;
      this.getUserList();
    }
  }
};
</script>

<style lang="less" scoped>
.el-row {
  margin-bottom: 15px;
}

.el-pagination {
  margin-top: 15px;
}
</style>
