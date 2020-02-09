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
            <el-button
              @click="searchUserInfo(inputData)"
              slot="append"
              icon="el-icon-search"
            ></el-button>
          </el-input>
        </el-col>

        <el-col :span="4">
          <el-button type="primary" @click="dialogFormVisible = true"
            >添加用户</el-button
          >
          <!-- 添加用户的弹出对话框 -->
          <el-dialog
            title="添加用户"
            :visible.sync="dialogFormVisible"
            width="50%"
            @close="addDialogClosed"
          >
            <el-form
              :model="addForm"
              :rules="addFormRules"
              ref="addFormRef"
              label-width="70px"
            >
              <el-form-item label="账户" prop="username">
                <el-input v-model="addForm.username"></el-input>
              </el-form-item>
              <el-form-item label="密码" prop="password">
                <el-input v-model="addForm.password" type="password"></el-input>
              </el-form-item>
              <el-form-item label="邮箱" prop="email">
                <el-input v-model="addForm.email"></el-input>
              </el-form-item>
              <el-form-item label="手机" prop="mobile">
                <el-input v-model="addForm.mobile"></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="dialogFormVisible = false">取 消</el-button>
              <el-button type="primary" @click="addUser">确 定</el-button>
            </div>
          </el-dialog>
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
                <el-switch
                  v-model="scope.row.mg_state"
                  @change="userStateChange(scope.row)"
                ></el-switch>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="175">
              <template slot-scope="scope">
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
                    @click="editDialogBtn(scope.row.id)"
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
                    @click="deleteDialogBtn(scope.row.id)"
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
    <!-- 添加用户的弹出对话框 -->
    <el-dialog
      title="修改用户信息"
      :visible.sync="showEditDialog"
      width="50%"
      @close="editDialogClosed"
    >
      <el-form
        :model="editForm"
        :rules="addFormRules"
        ref="editFormRef"
        label-width="70px"
      >
        <el-form-item label="账户" prop="username">
          <el-input v-model="editForm.username" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showEditDialog = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    // 验证邮箱的规则
    var checkEmail = (rule, value, callback) => {
      // 验证邮箱的正则表达式
      const regEmail = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-])+/
      if (regEmail.test(value)) {
        return callback()
      }
      callback(new Error('请输入合法的邮箱!'))
    }
    // 验证手机号规则
    var checkMobile = (rule, value, callback) => {
      const regMobile = /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/
      if (regMobile.test(value)) {
        return callback()
      }
      callback(new Error('请输入合法的手机号!'))
    }
    return {
      total: 0,
      userList: [],
      inputData: '',
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      // 添加用户的表单参数
      addForm: {
        username: '',
        password: '',
        mobile: '',
        email: ''
      },
      // 添加用户的表单参数
      editForm: {},
      // 添加用户的表单验证规则
      addFormRules: {
        username: [
          { required: true, message: '请输入账号', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 5, max: 16, message: '长度在 6 到 6 个字符', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ]
      },
      stateValue: false,
      dialogFormVisible: false,
      showEditDialog: false
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    getUserList() {
      this.$axios
        .get('users', {
          params: this.queryInfo
        })
        .then(res => {
          if (res.data.meta.status !== 200)
            return this.$message.error(res.data.meta.msg)
          this.userList = res.data.data.users
          this.total = res.data.data.total
        })
        .catch(err => {
          this.$message.error(err)
        })
    },
    // 每页显示个数
    handleSizeChange(pageSize) {
      this.queryInfo.pagesize = pageSize
      this.getUserList()
    },
    // 显示第几页
    handleCurrentChange(pageNum) {
      this.queryInfo.pagenum = pageNum
      this.getUserList()
    },
    // 改变用户状态
    userStateChange(data) {
      this.$axios
        .put(`users/${data.id}/state/${data.mg_state}`)
        .then(res => {
          if (res.data.meta.status !== 200) {
            data.mg_state = !data.mg_state
            return this.$message.error('更新用户状态失败!')
          }
          this.$message.success('更新用户状态成功!')
        })
        .catch(err => {
          this.$message.error(err)
        })
    },
    searchUserInfo(info) {
      this.queryInfo.query = info
      this.getUserList()
    },
    // 添加用户表单重置
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    // 修改用户表单重置
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    addUser() {
      this.$refs.addFormRef.validate(valid => {
        if (!valid) {
          return
        }
        this.$axios
          .post('users', this.addForm)
          .then(res => {
            if (res.data.meta.status !== 201) {
              return this.$message.error('添加用户失败!')
            }
            this.$message.success('添加用户成功!')
            this.dialogFormVisible = false
            this.getUserList()
          })
          .catch(err => {
            this.$message.error(err)
          })
      })
    },
    async editDialogBtn(userId) {
      const { data: res } = await this.$axios.get('users/' + userId)
      if (res.meta.status !== 200) {
        return this.$message.error('查询用户信息失败!')
      }
      this.editForm = res.data
      this.showEditDialog = true
    },
    deleteDialogBtn(userId) {
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$axios
            .delete('users/' + userId)
            .then(res => {
              if (res.data.meta.status !== 200) {
                return this.$message.error(res.data.meta.msg)
              }
              this.$message.success('删除用户成功!')
              this.getUserList()
            })
            .catch(err => {
              this.$message.error(err)
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    editUser() {
      this.$refs.editFormRef.validate(valid => {
        if (!valid) {
          return
        }
        this.$axios
          .put('users/' + this.editForm.id, {
            email: this.editForm.email,
            mobile: this.editForm.mobile
          })
          .then(res => {
            if (res.data.meta.status !== 200) {
              return this.$message.error('修改用户失败!')
            }
            this.showEditDialog = false
            this.getUserList()
            this.$message.success('修改用户成功!')
          })
          .catch(err => {
            this.$message.error(err)
          })
      })
    }
  }
}
</script>

<style lang="less" scoped>
.el-row {
  margin-bottom: 15px;
}

.el-pagination {
  margin-top: 15px;
}
</style>
