<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card shadow="never">
      <el-row>
        <el-col>
          <!-- 表格部分 -->
          <el-table :data="rightsList" border style="width: 100%">
            <el-table-column type="index" label="#"> </el-table-column>
            <el-table-column
              prop="authName"
              label="权限名称"
            ></el-table-column>
            <el-table-column
              prop="path"
              label="路径"
            ></el-table-column>
            
            <el-table-column prop="level" label="权限登记">
              <template slot-scope="sc">
                <el-tag v-if="sc.row.level === '0'">一级</el-tag>
                <el-tag v-else-if="sc.row.level === '1'" type="success">二级</el-tag>
                <el-tag v-else type="warning">三级</el-tag>
              </template>
            </el-table-column>
          </el-table>
         
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 权限列表
      rightsList: []
    }
  },
  created() {
    // 获取所有的权限列表
    this.getRightsList()
  },
  methods: {
    async getRightsList(){
      const {data: res} = await this.$axios.get('rights/list')
      if(res.meta.status !== 200){
        return this.$message.error('调用查询列表接口失败！')
      }
      this.rightsList = res.data
        console.log(res.data)
    }
  },
}
</script>

<style lang="less" scoped></style>
