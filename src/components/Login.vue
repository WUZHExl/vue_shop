<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像区 -->
      <div class="header_box">
        <img src="../assets/logo.png" alt="">
      </div>
      <!-- 登录表单 -->
      <el-form label-width="0px" ref="loginFormRef" class="loginForm" :model="loginForm" :rules="loginRules">
        <!-- 用户名 -->
        <el-form-item label=""  prop="username">
          <el-input  prefix-icon="el-icon-user-solid" v-model="loginForm.username"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item label="" prop="password">
          <el-input  prefix-icon="el-icon-lock" v-model="loginForm.password" show-password ></el-input>
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item class="btns">
           <el-button type="primary" @click="login">登录</el-button>
           <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>


      </el-form>

    </div>
  </div>
</template>

<script>
export default {
    // name:'Login',
    data(){
      return{
        // 这是登录表单的数据
        loginForm:{
          username:'admin',
          password:'123456'
        },
        // 表单的验证规则对象
        loginRules:{
          username:[
            { required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 2, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
          ],
          password:[
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
          ],
        }
      }
    },
    methods: {
      // 重置
      resetLoginForm(){
        // ref,vue获取dom的方法
        this.$refs.loginFormRef.resetFields()
      },
      login(){
        this.$refs.loginFormRef.validate(async (valid,text)=>{
            // console.log(valid) 两个参数：是否校验成功和未通过校验的字段
            // console.log(text)
            if(!valid) return;
            // Vue.prototype.$http=axios
            // 相当于axios.post
            // const result=await this.$http.post('login',this.loginForm)
            // 解构赋值
            const {data:res}=await this.$http.post('login',this.loginForm)
            // console.log(res)
            if(res.meta.status!==200) return  this.$message.error('登录失败');
            this.$message.success('登录成功');
            // 1.将登录成功之后的token,保存到客户端的sessionStorage中
            //  1.1 项目中除了登录之外的其他API接口，必须在登录之后才能访问
            //  1.2 token只应当在当前网站打开期间生效，所以将token保存在sessionStorage中
            // console.log(res)
            window.sessionStorage.setItem('token',res.data.token)
            // 2.通过编程式导航跳转到后台主页，路由地址是/home
            this.$router.push('/home')



        })
      }
    }
}
</script>

<style lang="less" scoped>
.login_container {
  background-color: skyblue;
  height: 100%;
}

// 登录盒子
.login_box {
  width: 450px;
  height: 300px;
  background-color:#fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform:translate(-50%,-50%)
}

.header_box {
  height: 130px;
  width: 130px;
  border: 1px solid #eee;
  border-radius: 50%;
  padding:10px;
  box-shadow: 0 0 10px #ddd;
  position: absolute;
  left:50%;
  transform:translate(-50%,-50%);
  background-color: #fff;
  img{
    width: 100%;
    height: 100%;
    border-radius:50%;
    background-color: #eee;
  }
}

.btns{
  display: flex;
  justify-content:flex-end;
}

.loginForm{
  position: absolute;
  bottom: 0;
  width: 100%;
  padding:0 20px;
  box-sizing: border-box;
}

</style>