var models = require('../../db/db');
var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var $sql = require('../../db/sqlMap_new');
var MailService = require('../MailService')
var generateVerificationCode= require('./generateVerificationCode')
var conn = mysql.createConnection(models.mysql);
var sender = '13427532895';
var code = 'qq594978168';
// var recipient = '3556350883@qq.com'
// var verCode = '123456'
var mailService = MailService(sender, code);
// mailService.resetPassword('3556350883@qq.com','test')
// console.log(11111)
// mailService.resetPassword(recipient, verCode);
conn.connect();
var jsonWrite = function(res, ret) {
  if(typeof ret === 'undefined') {
    // res.send('err');
    console.log('err')
  } else {
    console.log(ret);
    // res.send(ret);
  }
}


var params ={ studentID:'201530613702', collectionID:'2'};
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
