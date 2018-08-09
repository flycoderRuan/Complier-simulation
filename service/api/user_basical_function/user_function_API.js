var models = require('../../db/db');
var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var $sql = require('../../db/sqlMap_new');
var MailService = require('../MailService')
var generateVerificationCode= require('./generateVerificationCode')
var conn = mysql.createConnection(models.mysql);
var smtpProvider = 'qq';
var sender = '2369969039';
var code = 'ngyoikiaeegndjhj';
// var smtpProvider = '163';
// var sender = '13427532895';
// var code = 'qq594978168';
var mailService = MailService(sender, code, smtpProvider);
conn.connect();
var jsonWrite = function(res, ret) {
  if(typeof ret === 'undefined') {
    res.send('err');
  } else {
    console.log(ret);
    res.send(ret);
  }
}

//生成验证码函数  ///generateVerificationCode()
//
// /api/user_function/generateVerificationCode
//输入：邮箱
//随机生成一个6位验证码
//遍历student_user，如果email已存在 表student_user，{state:0,message:"该邮箱已被注册，请更换邮箱"}
//                email不存在，则遍历identity    email style(1)
//                    如果插入email和identityCode,style(1) 到table identity中
//                发送邮件 给该邮箱
router.post('/generateVerificationCode', (req, res) => {
  var params = req.body;
  var email = params.email
  var verCode = generateVerificationCode()

  var sqlSelect = "SELECT * FROM student_user WHERE email=? "
  var values = params.email
  conn.query(sqlSelect, values, function (err, result) {
    if (err) {
      console.log(err);
    } else {
      if (result.length > 0) {
        var responseData = {state: 0, message: "邮箱已经被注册"}
        jsonWrite(res, responseData);
      } else {
        var sqlSelect2 = "SELECT * FROM identity WHERE email=? AND style=1"
        var values2 = params.email
        conn.query(sqlSelect2, values2, function (err, result) {
          if (err) {
            console.log(err);
          } else {
            if (result.length === 0) {
              var sqlAdd = "INSERT INTO identity(`email`,`identityCode`,`style`) VALUES ?"
              var values3 = [[params.email, verCode, 1]]
              conn.query(sqlAdd, [values3], function (err) {
                if (err) {
                  console.log(err);
                } else {
                  var recipient = params.email
                  mailService.createAccount(recipient, verCode);
                  var result3 = {state: 1, message: "sending email successfully!", email: recipient}
                  jsonWrite(res, result3);
                }
              })
            } else {
              var sqlUpdate = 'UPDATE identity SET identityCode = ? WHERE email = ? AND style=1'
              var values3 = [verCode, params.email];
              conn.query(sqlUpdate, values3, function (err, result) {
                if (err) {
                  console.log(err);
                } else {
                  var recipient = params.email
                  mailService.createAccount(recipient, verCode);
                  var result3 = {state: 1, message: "sending email successfully!", email: recipient}
                  jsonWrite(res, result3);
                }
              })
            }
          }

        })
      }
    }

  })
});  //已调试



// //胜利


// 用户注册接口    //  /api/user_function/addUser                    /*1为注册用，2为忘记密码 */
//调用完验证码接口
// 输入：1studentName 2studentID 3password 4email  5verificationCode 6verificationAttribute用户输入的验证码和验证码的属性
//         判断studentID是否存在  存在   则返回state = 0   message :"学号已经被注册"
//                              不存在  如果验证码和属性正确  插入数据库 返回state=1 message:"注册成功"
//                                     如果验证码或属性不正确  返回state = -1   message :"验证码错误"
//
router.post('/addUser', (req, res) => {
  var params=req.body;
  var sqlSelect="SELECT * FROM student_user WHERE studentID=?"
  var values = params.studentID
  conn.query(sqlSelect,[values], function(err, result) {
    if (err) {
      console.log(err);
    }
    if (result) {
      if(result.length==0){
        var sqlSelect1="SELECT * FROM identity WHERE email=? AND identityCode=? AND style = ?";
        conn.query(sqlSelect1,[params.email,params.verificationCode,params.verificationAttribute], function(err, result){
          if(err){console.log(err)}
          if(result){
            if(result.length==0){
              //注册  验证码不正确 请重新输入
              console.log("验证码不正确 请重新输入");
              jsonWrite(res, {state:-1,message:'验证码不正确 请重新输入'});
            }
            else{
              //注册 验证码正确  请插入数据
              var sqlInsert="INSERT INTO student_user(`studentID`,`studentName`,`password`,`email`) VALUES ?";
              conn.query(sqlInsert,[[[params.studentID,params.studentName,params.password,params.email]]], function(err){
                if(err){console.log(err)}else{
                  console.log("数据插入成功");
                  jsonWrite(res, {state:1,message:'数据插入成功'});
                }
              });
              var sqlDelete="DELETE FROM identity WHERE email=? AND identityCode=? AND style = ?";
              conn.query(sqlDelete,[params.email,params.verificationCode,params.verificationAttribute], function(err){
                if(err){console.log(err)}else{
                  console.log("验证码删除");}
              });
            }
          }
        });

      }else{
        //账号已经存在 请输入正确的账号
        console.log("账号已经存在 请输入正确的账号");
        jsonWrite(res, {state:0,message:'账号已经存在 请输入正确的账号'});
      }
    }
  })
})//已调试

//登陆成功后更改密码 /api/user_function/modifyPassword
//输入: studentID old_password new_password
//    (判断学号是否存在0.0)     判断旧密码是否正确0.0   正确则将密码重置为新密码 返回state=1 message=“修改成功”
//                              错误则返回state=0  message=“密码错误”
router.post('/modifyPassword', (req, res) => {
  var params=req.body;
  var sqlSelect='SELECT  studentID FROM student_user WHERE studentID = ? AND password=?'
  var Sql_Params = [params.studentID,params.old_password];
  conn.query(sqlSelect,Sql_Params, function(err, result) {
    if(err){console.log(err)}
    if(result){
      if(result.length==0){//密码错误
        // console.log("密码输入错误")
        jsonWrite(res, {state:0,message:'密码输入错误'});
      }else{
        var sqlUpdate='UPDATE student_user SET password = ? WHERE studentID = ?'
        var Sql_Params1 = [params.new_password,params.studentID];
        conn.query(sqlUpdate,Sql_Params1, function(err) {
          if(err){console.log("密码更新出现错误！！！！！")}
          jsonWrite(res, {state:1,message:'密码修改成功'});
        });
      }
    }
  });


});
//登录   /api/user_function/login
//输入studentID password
//     验证 studentID password
//         判断studentID是否存在
//                              存在   密码如果正确则返回state = 1   message :"验证成功"  data=[studentName,studentID,email]
//                                            错误   state = -1    message :"密码错误"
//                              不存在 则返回state = 0   message :"学号不存在"
router.post('/login', (req, res) => {
  var params=req.body;
  //params.studentID params.password
  var sqlSelect='SELECT * FROM student_user WHERE studentID = ?'
  conn.query(sqlSelect,params.studentID, function(err, result) {
    if(err){}
    if(result){
      if(result.length==0){
        //账号不存在
        console.log('该账号不存在，请检查输入的账号')
        jsonWrite(res, {state:0,message:'该账号不存在，请检查输入的账号'});
      }else {
        if(result[0].password==params.password){
          console.log('密码正确')
          console.log(result[0])
          jsonWrite(res, {state:1,message:'登陆成功',data:{studentName: result[0].studentName, studentID: result[0].studentID, email: result[0].email}});
        }else{
          //密码错误 请检查输入的密码
          console.log('密码错误')
          console.log(result[0])
          jsonWrite(res, {state:-1,message:'密码错误 请检查输入的密码'});
        }
      }
    }
  })
})//已调试

//忘记密码 /api/user_function/forgetPasswordGetVerificationCode  你输入学号   向邮箱发邮件  输入验证码  0.0
//输入：studentID
//    判断studentID是否存在  存在
// 随机生成验证码并发送到该账号绑定的邮箱
// 将验证码和邮箱插入到验证码表格，属性为2
// 返回是否发送验证码成功       返回1  以及相关的邮箱

//                         不存在 返回0
router.post('/forgetPasswordGetVerificationCode', (req, res) => {
  var params=req.body;
  var verCode = generateVerificationCode()
  //params.studentID params.password
  var sqlSelect='SELECT email FROM student_user WHERE studentID = ?'
  conn.query(sqlSelect,params.studentID, function(err, result) {
    if(err) {
      console.log(err)
    }else{
      if(result.length===0){
        // 账号不存在
        // console.log("账号不存在")
        jsonWrite(res, {state:0,message:'该账号不存在，请检查输入的账号'});
      }else{
        var sqlSelect2 = "SELECT * FROM identity WHERE email=? AND style=2"
        var values = result[0].email
        conn.query(sqlSelect2,values, function(err, result) {
          if (err) {
            console.log(err);
          }else {
            if (result.length === 0) {
              var sqlAdd = "INSERT INTO identity(`email`,`identityCode`,`style`) VALUES ?"
              var values3 = [[values, verCode, 2]]
              conn.query(sqlAdd, [values3], function (err) {
                if (err) {
                  console.log(err);
                } else {
                  var recipient = values
                  // console.log(1,recipient, verCode)
                  mailService.resetPassword(recipient, verCode)
                  var result3 = {state: 1, message: "sending email successfully!", email: recipient}
                  jsonWrite(res, result3);
                }
              })
            } else {
              var sqlUpdate = 'UPDATE identity SET identityCode = ? WHERE email = ? AND style=2'
              var values4 = [verCode , values];
              conn.query(sqlUpdate, values4, function (err, result) {
                if (err) {
                  console.log(err);
                } else {
                  var recipient = values
                  // console.log(2,recipient, verCode)
                  mailService.resetPassword(recipient, verCode);
                  var result3 = {state: 1, message: "sending email successfully!", email: recipient}
                  jsonWrite(res, result3);
                }
              })
            }
          }
        });
      }
    }

  })
})//已调试
// 11


//修改密码（忘记密码）api/user_function/modifyPasswordOfForgetPassword
//输入：studentID ，verificationCode verificationAttribute（2）， new_password
//判断验证码和属性是否正确   都正确  则修改密码 返回state=1，message=“修改密码成功”
//                       其一不正确 则返回state=0，message=“验证码错误”
router.post('/modifyPasswordOfForgetPassword', (req, res) => {
  var params=req.body;
  //params.studentID params.new_password

  var sqlSelect='SELECT identityCode FROM identity WHERE email = ? AND style=?'
  conn.query(sqlSelect,[params.email,2], function(err, result) {
    if(err){console.log(err)}
    if(result){
      if(result.length==0){
        //该验证码不存在  系统错误
        // console.log("该验证码不存在  系统逻辑错误")
        jsonWrite(res, {state:0,message:'该验证码不存在  系统逻辑错误'});
      }else {
        if(result[0].identityCode==params.verificationCode){
          var sqlUpdate='UPDATE student_user SET password = ? WHERE studentID = ?'
          var Sql_Params1 = [params.new_password,params.studentID];
          conn.query(sqlUpdate,Sql_Params1, function(err) {
            if(err){console.log("密码更新出现错误！！！！！")}
            else{
              jsonWrite(res, {state:1,message:'密码修改成功'});
            }

          });
          var sqlDelete="DELETE FROM identity WHERE email=? AND identityCode=? AND style = ?";
          conn.query(sqlDelete,[params.email,params.verificationCode,params.verificationAttribute], function(err){
            if(err){console.log(err)}else{
              // console.log("验证码删除");
            }
          });
        }else{
          console.log('验证码输入错误  请重新输入')

          jsonWrite(res, {state:-1,message:'验证码输入错误  请重新输入'});
        }
      }
    }
  })


})//已调试




//用户新增收藏 接口  用户点击收藏按钮  添加数据 /api/user_function/collectionADD
//输入 studentID data_content 0，1，2 （词法）


//用户新增收藏 接口  用户点击收藏按钮  添加数据
//输入 studentID data_content 类型 data_content

//查找到用户  并且插入 ID自增的ID  插入数据(studentID  collectionID collectionType )
//返回state = 1  message:"收藏成功"
router.post('/collectionAdd', (req, res) => {
  var params=req.body;
  var sqlAdd="INSERT INTO user_collection(`studentID`,`collectionType`,`data_content`,`displayOrNot`) VALUES ?"
//var studentID=params.studentID
//var data_content=params.data_content
  var values =   [[params.studentID,params.collectionType,params.data_content,true]];
  conn.query(sqlAdd,[values], function(err) {
    if (err) {
      // console.log(err);
      jsonWrite(res, {state:0,message:"添加收藏失败"});
    }
    else{

      // console.log("添加收藏成功")
      jsonWrite(res, {state:1,message:"添加收藏成功"});
    }

  })

});






router.post('/collectionQuery', (req, res) => {
  var params=req.body;
  var sqlSelect = "SELECT collectionID,collectionType,data_content FROM user_collection WHERE studentID=? AND displayOrNot=1";

  conn.query(sqlSelect,params.studentID, function(err, result) {
    if (err) {
      console.log(err);
      jsonWrite(res, {state:0,message:"查询收藏失败"});
    }
    if (result) {
      console.log(result)
      jsonWrite(res, {state:1,message:"查询成功",data: result});
    }
  })
});


//用户删除收藏接口/api/user_function/collectionDelete
//输入 studentID,collectionID
//将该条收藏记录的displayOrNot设置为0
router.post('/collectionDelete', (req, res) => {
  var params=req.body;
  var sqlUpdate='UPDATE user_collection SET displayOrNot = 0 WHERE studentID = ? AND collectionID=?'
  var Sql_Params = [params.studentID,params.collectionID];
  conn.query(sqlUpdate,Sql_Params, function(err, result) {
    if (err) {
      console.log(err);
      jsonWrite(res, {state:0,message:"删除收藏失败"});
    }
    else{
      jsonWrite(res, {state:1,message:"删除收藏成功"});
    }
  })
});



module.exports = router;
