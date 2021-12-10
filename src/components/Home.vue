<template>
  <el-container class="home-container">
    <!-- 头部 -->
    <el-header>
      <div>
        <img src="../assets/heima.png" alt="">
        <span>电商管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!-- 主体 -->
    <el-container>
      <!-- 侧边 -->
      <el-aside :width="isCollapse?'64px':'200px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>


        <!-- router是否使用 vue-router 的模式，启用该模式会在激活导航时以 index 作为 path 进行路由跳转 -->

        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409EFF" unique-opened :collapse="isCollapse" :collapse-transition="false" :router="true" 
          :default-active="activePath">

          <!-- 一级菜单 -->
          <el-submenu :index="item.id+''" v-for="item in menuList" :key="item.id">
            <!-- 一级菜单的模板区 -->
            <template slot="title">
              <!-- 图标 -->
              <i :class="iconObj[item.id]"></i>
              <!-- 文本 -->
              <span>{{item.authName}}</span>
            </template>

    
            <!-- 二级菜单 -->
            <el-menu-item :index="'/'+subItem.path" v-for="subItem in item.children" :key="subItem.id" 
                @click="saveNavState('/'+subItem.path)">
                <template slot="title">
                  <!-- 图标 -->
                  <i class="el-icon-menu"></i>
                  <!-- 文本 -->
                  <span>{{subItem.authName}}</span>
                </template>
            </el-menu-item>


          </el-submenu>



        </el-menu>


      </el-aside>

      <!-- 右侧主体 -->
      <el-main>
        <!-- 路由占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
    
  </el-container>
</template>

<script>
export default {
  data(){
    return{
      menuList:[],
      iconObj:{
        '125':'iconfont icon-user',
        '103':'iconfont icon-tijikongjian',
        '101':'iconfont icon-shangpin',
        '102':'iconfont icon-danju',
        '145':'iconfont icon-baobiao'
      },
      isCollapse:false,
      activePath:'',
    }
  },
  created(){
    this.getMenuList()
    this.activePath=sessionStorage.getItem('activePath')
  },
  methods:{
    logout(){
      sessionStorage.clear();
      this.$router.push('/login')
    },

    // 获取所有菜单
    async getMenuList(){
       const {data:res}=await this.$http.get('menus')
       if(res.meta.status!==200) return this.$message.error('res.meta.msg')
       this.menuList=res.data
      //  console.log(res)
    },

    // 切换菜单折叠展开
    toggleCollapse(){
      this.isCollapse=!this.isCollapse
    },
    saveNavState(activePath){
      // console.log(this.menuList)
      sessionStorage.setItem('activePath',activePath)

      // 点击和跳转的时候都需要高亮
      this.activePath=activePath
    }
  }

}
</script>

<style lang="less" scope>
  .el-header{
    background-color: #373D41;
    display:flex;
    justify-content: space-between;
    padding-left: 0;
    align-items: center;
    color: #fff;
    font-size:20px;
    > div{
      display:flex;
      align-items:center;
      span{
        margin-left:15px ;
      }
    }
    /* text-align: center; */
    /* line-height: 60px; */
  }
  
  .el-aside {
    background-color: #333744;
    /* color: #333; */
    /* text-align: center; */
    /* line-height: 200px; */
    .el-menu {
      border-right: none;
    }
  }
  
  .el-main {
    background-color: #E9EEF3;
    /* color: #333; */
    /* text-align: center; */
    /* line-height: 160px; */
  }

  
  .home-container {
    /* 让元素撑满整个屏幕 */
    height: 100%;
  }


 .iconfont{
   margin: 10px;
 }

 .toggle-button{
   background-color:'#4A5064';
   font-size:10px;
   line-height:24px;
   color: #fff;
   text-align: center;
   letter-spacing: 0.2em;
   cursor: pointer;

 }
</style>