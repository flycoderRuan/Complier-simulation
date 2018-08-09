<template>
  <div class="login-wrap">
    <div class="ms-forget">
        <el-form v-if="!next" ref="form" :model="form" :rules="rules">
          <div class="errdiv" v-if="errorInfo">
            <span>{{errInfo}}</span>
          </div>
          <el-form-item prop="studentID">
            <el-input v-model="form.studentID" placeholder="学号"></el-input>
          </el-form-item>
          <el-form-item prop="new_password">
            <el-input v-model="form.new_password" type="password" placeholder="新的密码"></el-input>
          </el-form-item>
          <el-form-item prop="checkpassword">
            <el-input v-model="form.checkpassword" type="password" placeholder="确认密码"></el-input>
          </el-form-item>
          <div class="login-btn1">
            <el-button type="primary" @click="GetVerificationCode('form')">下一步</el-button>
            <p class="register" @click="gotoLogin()">已有账号？ 登录</p>
          </div>
        </el-form>
        <el-form v-else ref="verificationCodeform" :model="form" :rules="verificationCoderules">
          <div class="errdiv" v-if="errorInfo">
            <span>{{errInfo}}</span>
          </div>
          <p style="overflow:hidden">验证码已发送到{{email}}</p>
          <el-button type="text" @click="again()">未收到? 再次发送</el-button>
          <el-form-item prop="verificationCode">
            <el-input v-model="form.verificationCode" placeholder="邮箱验证码"></el-input>
          </el-form-item>
          <div class="login-btn">
            <el-button type="primary" @click="next=false,errorInfo=false,errInfo=''">上一步</el-button>
            <el-button type="primary" @click="onSubmit('verificationCodeform')">确认更改</el-button>
            <p class="register" @click="gotoLogin()">已有账号？ 登录</p>
          </div>
        </el-form>
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
      next: false,
      email: '',
      errorInfo: false,
      errInfo: '',
      form: {
        studentID: '',
        new_password: '',
        checkpassword: '',
        verificationCode: ''
      },
      rules: {
        studentID: [
          { required: true, message: '请输入正确的学号!', trigger: 'blur' },
          { pattern: /^[0-9]{12}$/, message: '请输入正确的学号!' }
        ],
        new_password: [
          {required: true, message: '请输入密码!', trigger: 'blur'},
          { validator: password, trigger: 'change' },
          { pattern: /^[a-zA-Z0-9][_a-zA-Z0-9]*$/, message: '密码必须由字母、数字或下划线组成' },
          { min: 6, max: 20, message: '长度在6-20位之间', trigger: 'blur' }
        ],
        checkpassword: [
          { validator: validatePass, trigger: 'blur' }
        ]
      },
      verificationCoderules: {
        verificationCode: [{ required: true, message: '请输入验证码!', trigger: 'blur' }]
      }
    }
  },
  methods: {
    // 忘记密码 /api/user_function/forgetPasswordGetVerificationCode  你输入学号   向邮箱发邮件  输入验证码  0.0
    // 输入：studentID
    // 判断studentID是否存在  存在
    // 随机生成验证码并发送到该账号绑定的邮箱
    // 将验证码和邮箱插入到验证码表格，属性为2
    // 返回是否发送验证码成功  返回1~~
    //                       不存在 返回0

    // 修改密码（忘记密码）api/user_function/modifyPasswordOfForgetPassword
    // 输入：studentID ，verificationCode verificationAttribute（2）， new_password
    // 判断验证码和属性是否正确   都正确  则修改密码 返回state=1，message=“修改密码成功”
    //                       其一不正确 则返回state=0，message=“验证码错误”
    //

    // 下一步按钮
    GetVerificationCode (formName) {
      const self = this
      self.errorInfo = false
      self.errInfo = ''
      self.$refs[formName].validate((valid) => {
        if (valid) {
          let Params = {studentID: self.form.studentID}
          self.$axios.post('/api/user_function/forgetPasswordGetVerificationCode', Params)
            .then((response) => {
              if (response.data.state === 0) {
                self.errorInfo = true
                self.errInfo = '该学号不存在'
              } else if (response.data.state === 1) {
                self.errorInfo = false
                self.errInfo = ''
                self.email = response.data.email
                self.next = true
                self.email=response.data.email
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

    // 确认更改
    onSubmit (formName) {
      const self = this
      self.errorInfo = false
      self.errInfo = ''
      self.$refs[formName].validate((valid) => {
        if (valid) {
          let Params = {studentID: self.form.studentID, verificationCode: self.form.verificationCode, verificationAttribute: 2, new_password: self.form.new_password,email: self.email}
          self.$axios.post('/api/user_function/modifyPasswordOfForgetPassword', Params)
            .then((response) => {
              if (response.data.state === 0) {
                self.errorInfo = true
                self.errInfo = response.data.message || '邮箱验证码错误'
              } else if (response.data.state === 1) {
                Message({
                  message: '成功修改密码',
                  type: 'success',
                  center: true
                })
                self.gotoLogin()
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
    // 未收到？ 再次发送
    again () {
      console.log(11111111111)
      const self = this
      let Params = {studentID: self.form.studentID}
      self.$axios.post('/api/user_function/forgetPasswordGetVerificationCode', Params)
        .then((response) => {
          if (response.data.state === 1) {
            Message({
              message: '已发送，请查收邮箱',
              type: 'success',
              center: true
            })
          }
        }).catch((error) => {
          console.log(error)
          Message({
            message: '请检查网络并重试',
            type: 'error',
            center: true
          })
        })
    },
    // 已有账号？ 登陆
    gotoLogin () {
      this.$emit('gotoLogin')
    }
  }
}
</script>

<style scoped>
.login-wrap {
  width: 300px;
  height: 250px;
}
.ms-forget {
  width: 300px;
  padding: 0px 40px;
  border-radius: 5px;
  background-color: rgba(125, 125, 125, 0);
}
.login-btn {
  margin-top: 10px;
  text-align: center;
}
/* 下一步 */
.login-btn1 {
  margin-top: 10px;
  text-align: center;
}
.login-btn button {
  width: 47%;
  height: 36px;
}
/* 下一步 */
.login-btn1 button {
  width: 100%;
  height: 36px;
}
.errdiv {
  position:absolute;
  color: red;
  font-size:14px;
  top:60px;
}
.register {
  font-size: 14px;
  line-height: 30px;
  color:#2e82ff;
  cursor: pointer;
}
</style>
