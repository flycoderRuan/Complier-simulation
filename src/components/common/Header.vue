<template>
    <el-row>
        <div id="head" class="header">
          <div class="navigation">
            <div class="logo">
              <!-- <img src="../../assets/_logo.png"/> -->
              <a style="float:left">文法分析模拟器</a>
            </div>
            <div class="nav-menu">
              <ul class="menu-ul">
                <li class="menu-li"><a :class="{'active':active1}" @click="gotoUrl('/index/main-interface')">首页</a></li>
                <li class="menu-li"><a :class="{'active':active2}" @click="gotoUrl('/index/lexical-analysis')">词法分析</a></li>
                <li class="menu-li"><a :class="{'active':active3}">语法分析</a></li>
                <li class="menu-li"><a :class="{'active':active4}">语义分析</a></li>
              </ul>
            </div>
            <div class="nav-login">
              <ul v-if="!userName">
                <li class="menu-li"><a class='login-btn' @click="show = true,status='login',titletext='登陆'">登录</a></li>
                <li class="menu-li"><a class='login-btn' @click="show = true,status='register',titletext='注册'">注册</a></li>
              </ul>
              <el-dropdown v-else @command="handleCommand">
                <span class="el-dropdown-link">
                  {{userName}}<i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="my-collection">我的收藏</el-dropdown-item>
                  <el-dropdown-item command="modifypassword">修改密码</el-dropdown-item>
                  <el-dropdown-item command="logout"><el-button type="text" @click="logout()">注销</el-button></el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </div>
        </div>
        <el-dialog :title="titletext" :visible.sync="show" width="420px" :close-on-click-modal="canclose" @close="reset()">
            <login-area v-if="status==='login'" @gotoRegister="status='register',titletext='注册'" @gotoFindback="status='forget',titletext='重置密码'" @loginsuccess="loginsucceed()"></login-area>
            <register-area v-else-if="status==='register'" @gotoLogin="status='login',titletext='登陆'"></register-area>
            <find-back v-else-if="status==='forget'" @gotoLogin="status='login',titletext='登陆'"></find-back>
        </el-dialog>
    </el-row>
</template>

<script>
import loginArea from '../page/Login'
import registerArea from '../page/Register'
import findBack from '../page/FindBack'
export default {
  components: {
    loginArea,
    registerArea,
    findBack
  },
  data () {
    return {
      active1: false,
      active2: false,
      active3: false,
      active4: false,
      status: '',
      show: false,
      canclose: false,
      titletext: '',
      userName: ''
    }
  },
  methods: {
    loginsucceed () {
      this.show = false
      console.log(sessionStorage.getItem('studentName'))
      this.userName = sessionStorage.getItem('studentName')
    },
    // 关闭dialog时重置登陆注册忘记密码等表单
    reset () {
      this.status = ''
      this.titletext = ''
    },
    // 导航栏根据URL高亮显示某个按钮
    highlightchange () {
      console.log('url切换到' + window.location.hash)
      const self = this
      self.active1 = false
      self.active2 = false
      self.active3 = false
      self.active4 = false
      switch (window.location.hash) {
        case '#/index/main-interface':
          this.active1 = true
          document.getElementById('head').style.backgroundColor = "rgba(16, 16, 16, 0.5)"
          break
        case '#/index/lexical-analysis':
          this.active2 = true
          document.getElementById('head').style.backgroundColor = "rgba(16, 16, 16, 1)"
          break
        case '#/index/gramma-analysis':
          this.active3 = true
          break
        case '#/index/semantic-analysis':
          this.active4 = true
          break
        default:
          console.log('不是导航栏的URL')
          document.getElementById('head').style.backgroundColor = "rgba(16, 16, 16, 1)"
          break
      }
    },
    // 注销
    logout () {
      this.$confirm('此操作将注销账号, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let re = /#\/index\/./
        if (!re.test(window.location.hash)) {
          this.$router.push('/index')
        }
        sessionStorage.removeItem('studentID')
        sessionStorage.removeItem('studentName')
        sessionStorage.removeItem('email')
        this.userName = ''
      }).catch(() => {
      })
    },
    // 处理账号下来菜单的点击事件
    handleCommand (command) {
      if (command === 'modifypassword') {
        this.gotoUrl('/user/modifypassword')
      } else if (command === 'logout') {
        this.logout()
      } else if (command === 'my-collection') {
        this.$router.push('/user/my-collection')
      }
    },
    // 改变URL
    gotoUrl (url) {
      const self = this
      self.$router.push(url)
    }
  },
  // 监听URL的变化
  watch: {
    $route: 'highlightchange'
  },
  // 初始化页面时，改变高亮的按钮，读取已登陆的账号名字
  mounted () {
    this.highlightchange()
    this.userName = sessionStorage.getItem('studentName')
  }
}
</script>

<style scoped>
.header {
  width: 100%;
  height: 45px;
  color: #ffffff;
  background-color: #161616;
  font-size: 16px;
  font-weight: 400;
  padding:15px 0px;
  box-shadow: 0px 1px 1px #ece9e9;
  position: relative;
  font-family:"Microsoft YaHei",Helvetica, "microsoft yahei", arial, STHeiTi, sans-serif;
}
.navigation{
  position: relative;
  overflow: hidden;
  white-space: nowrap;
  min-width: 900px;
  margin:0px auto;
  width:65%;
  height:45px;
}
.logo {
  font-size: 30px;
  cursor: pointer;
  /* -webkit-text-size-adjust:100%; */
  float: left;
}
img{
  float:left ;
  width:40px ;
  height:40px;
}
.nav-menu {
  height: 40px;
  padding-bottom: 2px;
  float: left;
  margin-left:10%;
}
.nav-login{
  height: 40px;
  float: right;
}

ul{
  list-style:none; /* 去掉ul前面的符号 */
  margin: 0px; /* 与外界元素的距离为0 */
  padding: 0px; /* 与内部元素的距离为0 */
  width: auto; /* 宽度根据元素内容调整 */
}
ul li.menu-li
{
  padding:0px 10px;
  float:left; /* 向左漂移，将竖排变为横排 */
}
ul li a, ul li a:visited
{
  cursor: pointer;
  color:#eeeeee;
  display: block; /* 此元素将显示为块级元素，此元素前后会带有换行符 */
  padding: 10px; /* 内部填充的距离 */
  text-decoration: none; /* 不显示超链接下划线 */
  white-space: nowrap; /* 对于文本内的空白处，不会换行，文本会在在同一行上继续，直到遇到 <br> 标签为止。 */
}
ul li a:hover
{
  color: #39a9db; /* 文字颜色 */
  text-decoration: none; /* 不显示超链接下划线 */
}
ul li a:active
{
  color:#49505b;/* 文字颜色 */
  text-decoration: none; /* 不显示超链接下划线 */
}
ul li a.active{
  color: #409eff; /* 文字颜色 */
  border-bottom: 2px solid #409eff;
}

.login-btn{
  cursor: pointer;
  font-size:15px;
  color: #ffffff;
  display: block; /* 此元素将显示为块级元素，此元素前后会带有换行符 */
  padding: 12px 10px; /* 内部填充的距离 */
  text-decoration: none; /* 不显示超链接下划线 */
  white-space: nowrap; /* 对于文本内的空白处，不会换行，文本会在在同一行上继续，直到遇到 <br> 标签为止。 */
}
</style>

<style>
.el-dialog__header{
  text-align:center;
}
.el-dropdown {
  height:45px;
  line-height:45px;
  color: #ffffff;
  font-size: 16px;
}
</style>
