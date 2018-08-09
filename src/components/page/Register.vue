<template>
  <div class="login-wrap">
    <div class="ms-register">
      <el-form ref="form" :model="form" :rules="rules">
        <div class="errdiv" v-if="errorInfo">
          <span>{{errInfo}}</span>
        </div>
        <el-form-item prop="studentName">
          <el-input v-model="form.studentName" placeholder="昵称"></el-input>
        </el-form-item>
        <el-form-item prop="studentID">
          <el-input v-model="form.studentID" placeholder="学号"></el-input>
        </el-form-item>
        <el-form ref="emailform" :model="form" :rules="emailrules">
          <el-form-item prop="email">
            <el-input v-model="form.email" placeholder="邮箱"></el-input>
          </el-form-item>
        </el-form>
        <el-form-item prop="verificationCode">
          <el-row>
            <el-col span="12">
              <el-input v-model="form.verificationCode" placeholder="验证码"></el-input>
            </el-col>
            <el-col span="10" offset="1">
              <el-button width="100%" @click="generateVerificationCode(form.email)">获取邮箱验证码</el-button>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="form.password" type="password" placeholder="密码"></el-input>
        </el-form-item>
        <el-form-item prop="checkpassword">
          <el-input v-model="form.checkpassword" type="password" placeholder="确认密码"></el-input>
        </el-form-item>
        <div class="login-btn">
          <el-button type="primary" @click="onSubmit('form')">注册</el-button>
        </div>
        <p class="register" @click="gotoLogin()">已有账号？ 登录</p>
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
      } else if (value !== this.form.password) {
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
        studentName: '',
        studentID: '',
        password: '',
        email: '',
        verificationCode: '',
        verificationAttribute: 1,
        checkpassword: ''
      },
      rules: {
        studentName: [
          { required: true, message: '请输入昵称!', trigger: 'blur' },
          { max: 30, message: '不能超过30个字符', trigger: 'blur' }
        ],
        studentID: [
          { required: true, message: '请输入学号!', trigger: 'blur' },
          { pattern: /^[0-9]*$/, message: '不能含非数字字符' },
          { min: 12, max: 12, message: '学号长度为12位', trigger: 'blur' }
        ],
        password: [
          {required: true, message: '请输入密码!', trigger: 'blur'},
          { validator: password, trigger: 'change' },
          { pattern: /^[a-zA-Z0-9][_a-zA-Z0-9]*$/, message: '密码必须由字母、数字或下划线组成' },
          { min: 6, max: 20, message: '长度在6-20位之间', trigger: 'blur' }
        ],
        checkpassword: [
          { validator: validatePass, trigger: 'blur' }
        ],
        verificationCode: [
          { required: true, message: '请输入邮箱验证码!', trigger: 'blur' }
        ]
      },
      emailrules: {
        email: [
          {required: true, message: '请输入邮箱!', trigger: 'blur'},
          { type: 'email', message: '请输入正确的Email格式', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 生成验证码接口 /api/user_function/generateVerificationCode
    // 输入：邮箱
    // 随机生成一个6位验证码
    // 遍历验证码表，如果邮箱已存在，则将该邮箱的验证码更新
    //                 邮箱不存在，则插入邮箱和验证码到验证码表格，属性为1//

    // 用户注册接口   /api/user_function/addUser  /*1为注册用，2为忘记密码 */
    // 调用完验证码接口
    // 输入：1studentName 2studentID 3password 4email  5verificationCode 6verificationAttribute用户输入的验证码和验证码的属性
    // 判断studentID是否存在  存在   则返回state = 0   message :"学号已经被注册"
    //                       不存在 如果验证码和属性正确  插入数据库 返回state=1 message:"注册成功"
    //                       如果验证码或属性不正确  返回state = -1   message :"验证码错误"

    // 获取邮箱验证码按钮
    generateVerificationCode (email) {
      const self = this
      self.errorInfo = false
      self.errInfo = ''
      self.$refs['emailform'].validate((valid) => {
        if (valid) {
          self.$axios.post('/api/user_function/generateVerificationCode', {email: self.form.email})
            .then((response) => {
              if (response.data.state === 0) {
                self.errorInfo = true
                self.errInfo = response.data.message
              } else if (response.data.state === 1) {
                Message({
                  message: '已发送验证码，请查收',
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
        }
      })
    },

    // 注册按钮
    onSubmit (formName) {
      const self = this
      self.errorInfo = false
      self.errInfo = ''
      self.$refs[formName].validate((valid) => {
        if (valid) {
          self.$refs['emailform'].validate((valid) => {
            if (valid) {
              let Params = {studentName: self.form.studentName, studentID: self.form.studentID, password: self.form.password, email: self.form.email, verificationCode: self.form.verificationCode, verificationAttribute: 1}
              self.$axios.post('/api/user_function/addUser', Params)
                .then((response) => {
                  if (response.data.state === -1) {
                    self.errorInfo = true
                    self.errInfo = response.data.message
                  } else if (response.data.state === 0) {
                    self.errorInfo = true
                    self.errInfo = response.data.message
                  } else if (response.data.state === 1) {
                    Message({
                      message: '注册成功',
                      type: 'success',
                      center: true
                    })
                    this.gotoLogin()
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
        }
      })
    },

    // 已有账号？登陆
    gotoLogin () {
      this.$emit('gotoLogin')
    }
  }
}
</script>

<style scoped>
.login-wrap {
  width: 300px;
  height: 435px;
}
.ms-register {
  width: 300px;
  padding: 0px 40px;
  border-radius: 5px;
  background-color: rgba(125, 125, 125, 0);
}
.login-btn {
  text-align: center;
}
.login-btn button {
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
  color: #2e82ff;
  cursor: pointer;
  float: right;
}
</style>
