import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../pages/Welcome.vue'
import Users from '../components/user/Users.vue'
Vue.use(VueRouter)

const routes = [

    {path:'/',redirect:'/login'},//重定向
    {
      path: '/login',
      component: Login
    },
    {
      path:'/home',
      component: Home,
      redirect:'/welcome',
      children:[
        {path:'/welcome',component: Welcome},
        {path:'/users',component: Users}
      ]
    }

]

const router = new VueRouter({
  routes
})

// 控制页面访问权限
//全局前置守卫：初始化时执行、每次路由切换前执行
router.beforeEach((to,from,next)=>{
//to:将要访问的路径
// from:代表从哪来
// next()函数，放行；  next('/login')强制跳转
  if(to.path==='/login') return next()
  //获取token
  const tokenStr=sessionStorage.getItem('token')
  if(!tokenStr) return next('/login')
  next()

})

export default router
