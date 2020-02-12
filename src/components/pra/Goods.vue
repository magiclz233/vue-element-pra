<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
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
          <el-button type="primary" @click="addGoods">添加商品</el-button>
        </el-col>
      </el-row>

      <el-row>
        <el-col>
          <!-- 表格部分 -->
          <el-table :data="goodsList" border style="width: 100%">
            <el-table-column type="index" label="#"> </el-table-column>
            <el-table-column
              prop="goods_name"
              label="商品名称"
              width="300px"
            ></el-table-column>
            <el-table-column
              prop="goods_price"
              label="商品价格（元）"
            ></el-table-column>
            <el-table-column
              prop="goods_number"
              label="商品数量"
            ></el-table-column>
            <el-table-column
              prop="goods_weight"
              label="商品重量"
            ></el-table-column>
            <el-table-column prop="add_time" label="创建时间"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="sc">
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
                    @click="editBtn(sc.row.goods_id)"
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
                    @click="deleteBtn(sc.row.goods_id)"
                  ></el-button>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
          <!-- 分页菜单 -->
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="goodsParams.pagenum"
            :page-sizes="[2, 5, 10, 20]"
            :page-size="goodsParams.pagesize"
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
      goodsList: [],
      goodsParams: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      total: 0,
      inputData: ''
    }
  },
  created() {
    this.getGoodsList()
  },
  methods: {
    addGoods() {
      this.$router.push('/goods/add')
    },
    async getGoodsList() {
      const { data: res } = await this.$axios.get('goods', {
        params: this.goodsParams
      })
      if (res.meta.status !== 200) {
        return this.$message.error('查询商品列表失败！')
      }
      this.goodsList = res.data.goods
      this.total = res.data.total
      console.log(res.data.goods)
    },
    searchUserInfo(info) {
      console.log(info)
      this.goodsParams.query = info
      this.getGoodsList()
    },
    // 每页显示个数
    handleSizeChange(pageSize) {
      this.goodsParams.pagesize = pageSize
      this.getGoodsList()
    },
    // 显示第几页
    handleCurrentChange(pageNum) {
      this.goodsParams.pagenum = pageNum
      this.getGoodsList()
    },
    deleteBtn(id) {
      this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$axios
            .delete('goods/' + id)
            .then(res => {
              if (res.data.meta.status !== 200) {
                return this.$message.error(res.data.meta.msg)
              }
              this.$message.success('删除商品成功!')
              this.getGoodsList()
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
    }
  }
}
</script>

<style scoped>
.el-row {
  margin-bottom: 15px;
}

.el-pagination {
  margin-top: 15px;
}
</style>
