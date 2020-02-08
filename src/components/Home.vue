<template>
  <el-container class="el_container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img id="avatar" src="../assets/avatar.png" alt="avatar头像" />
        <span>后台管理平台</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!-- 页面主体 -->
    <el-container>
      <!-- 页面左侧导航 -->
      <el-aside :width="toggleColl ? '60px' : '200px'">
        <!-- 侧边栏菜单区域 -->
        <!--  unique-opened:菜单每次只能展开一个 -->
        <!-- :default-active="$router.path" 绑定当前打开的path 返回可以还原 -->
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409eff"
          unique-opened
          :collapse="toggleColl"
          :collapse-transition="false"
          :router="true"
          :default-active="this.$route.path"
        >
          <div class="toggle-button" @click="toggleCollapse">===</div>
          <!-- 一级菜单 -->
          <el-submenu
            :index="item.id + ''"
            v-for="item in menuList"
            :key="item.id"
          >
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{ item.authName }}</span>
            </template>
            <!-- 二级 -->
            <el-menu-item
              :index="'/' + child.path"
              v-for="child in item.children"
              :key="child.id"
            >
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{ child.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 页面展示区域 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      menuList: [],
      toggleColl: false
    };
  },
  created() {
    this.getMenuList();
  },
  methods: {
    logout() {
      sessionStorage.clear("token");
      this.$router.push("/login");
    },
    getMenuList() {
      this.$axios
        .get("menus")
        .then(res => {
          // console.log(res.data.data);
          if (res.data.meta.status !== 200)
            return this.$message.error(res.data.meta.msg);
          this.menuList = res.data.data;
          // res.data.data
        })
                       
        .catch(err => {
          console.error(err);
        });
    },
    // 折叠菜单
    toggleCollapse() {
      this.toggleColl = !this.toggleColl;
    }
  }
};
</script>

<style lang="less" scoped>
.el-menu {
  border-right: none;
}

.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-right: 10px;
  padding-left: 10px;
  align-items: center;
  color: #fff;
  font-size: 25px;
  > div {
    display: flex;
    align-items: center;
    span {
      margin-left: 10px;
    }
  }
}

.el_container {
  height: 100%;
}

.el-aside {
  background-color: #333744;
}

.el-main {
  background-color: #eaedf1;
}

#avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
}

.toggle-button {
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  text-align: center;
  color: #fff;
  cursor: pointer;
}
</style>
