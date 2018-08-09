<template>
<div id="p" class="page">
  <el-header>
      <h1 class="head">修改密码</h1>
  </el-header>
  <div class="login-wrap">
    <div class="ms-forget">
        <el-form ref="form" :model="form" :rules="rules">
          <div class="errdiv" v-if="errorInfo">
            <span>{{errInfo}}</span>
          </div>
          <el-form-item prop="old_password">
            <el-input v-model="form.old_password" type="password" placeholder="旧的密码"></el-input>
          </el-form-item>
          <el-form-item prop="new_password">
            <el-input v-model="form.new_password" type="password" placeholder="新的密码"></el-input>
          </el-form-item>
          <el-form-item prop="checkpassword">
            <el-input v-model="form.checkpassword" type="password" placeholder="确认密码"></el-input>
          </el-form-item>
          <div class="login-btn1">
            <el-button type="primary" @click="modifyPassword('form')">确认修改</el-button>
          </div>
        </el-form>
    </div>
  </div>
</div>
</template>

<script>
import {Message} from 'element-ui'
export default {
  data () {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.form.new_password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    var password = (rule, value, callback) => {
      if (value.indexOf('_') === 0) {
        callback(new Error('密码不得以下划线开头'))
      } else {
        callback()
      }
    }
    return {
      errorInfo: false,
      errInfo: '',
      form: {
        old_password: '',
        new_password: '',
        checkpassword: ''
      },
      rules: {
        old_password: [{required: true, message: '请输入旧的密码!', trigger: 'blur'}],
        new_password: [
          {required: true, message: '请输入新的密码!', trigger: 'blur'},
          { validator: password, trigger: 'change' },
          { pattern: /^[a-zA-Z0-9][_a-zA-Z0-9]*$/, message: '密码必须由字母、数字或下划线组成' },
          { min: 6, max: 20, message: '长度在6-20位之间', trigger: 'blur' }
        ],
        checkpassword: [
          { validator: validatePass, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 登陆成功后更改密码 /api/user_function/modifyPassword
    // 输入: studentID old_password new_password
    // (判断学号是否存在0.0)     判断旧密码是否正确0.0   正确则将密码重置为新密码 返回state=1 message=“修改成功”
    //                                                                错误则 返回state=0  message=“密码错误”
    modifyPassword (formName) {
      const self = this
      self.errorInfo = false
      self.errInfo = ''
      self.$refs[formName].validate((valid) => {
        if (valid) {
          let studentID = sessionStorage.getItem('studentID')
          console.log(studentID)
          let Params = {studentID: studentID, old_password: self.form.old_password, new_password: self.form.new_password}
          self.$axios.post('/api/user_function/modifyPassword', Params)
            .then((response) => {
              if (response.data.state === 0) {
                self.errorInfo = true
                self.errInfo = '旧密码不正确'
              } else if (response.data.state === 1) {
                Message({
                  message: '成功修改密码',
                  type: 'success',
                  center: true
                })
                self.errorInfo = false
                self.errInfo = ''
                self.resetForm('form')
              }
            }).catch((error) => {
              console.log(error)
              Message({
                message: '请检查网络并重试',
                type: 'error',
                center: true
              })
            })
        }
      })
    },
    // 重置表单
    resetForm (formName) {
      this.$refs[formName].resetFields()
    }
  },
  mounted () {
    document.getElementById('p').style.height = (window.innerHeight - 110) + 'px'
  },
}
</script>

<style scoped>
.page {
  width: 50%;
  margin-left: auto;
  margin-right: auto;
  min-width: 900px;
}
.head {
  padding: 3rem;
  font-size: 2.5rem;
}
.login-wrap {
  margin:50px auto;
  width: 300px;
  height: 250px;
}
.ms-forget {
  position: relative;
  width: 300px;
  padding: 0px 40px;
  border-radius: 5px;
  background-color: rgba(125, 125, 125, 0);
}
/* 确认修改 */
.login-btn1 {
  margin-top: 10px;
  text-align: center;
}
.login-btn1 button {
  width: 100%;
  height: 36px;
}
.errdiv {
  position:absolute;
  color: red;
  font-size:14px;
  top:-40px;
}
</style>
<style>
</style>
