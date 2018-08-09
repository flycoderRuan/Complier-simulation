var express = require('express');
var generateNFA =require("./generateNFA");
var generateDFA =require("./generateDFA");
var simplifyDFA =require("./simplifyDFA");
var generateCode =require("./generate_nfa_code");

var router = express.Router();
var tool =require("./tool");

var jsonWrite = function(res, ret) {
  if(typeof ret === 'undefined') {
    res.send('err');
  } else {
    //console.log(ret);
    res.send(ret);
  }
}
// var dateStr = function(str) {
//   return new Date(str.slice(0,7));
// }

// 生成NFA接口
router.post('/regularExpression', (req, res) => {
  var state = 1
  var params=req.body;
  console.log(params.RE)
  var expressions=params.RE


  console.log(expressions)
  var NFA =new generateNFA(expressions)
  if(NFA.state === 0 ){
    state = 0
    jsonWrite( res ,{state:state , message:NFA.message})
  }else{
    if( NFA.result.alphabet.length === 1 && NFA.result.alphabet[0] === 'ε'){
      state = 0;
      jsonWrite(res, {state:state , message: "NFA is null."});
    }else{
      console.log(11111111)
      var DFA =new generateDFA(NFA.result)
      console.log(22222222)
      var s_DFA=new simplifyDFA(DFA)
      console.log(33333333)
      var NFAdata={
        transitionTable:tool(NFA.result),
        alphabet:NFA.result.alphabet,
        acceptStateList:NFA.result.acceptStateList};
      var DFAdata={
        transitionTable:tool(DFA),
        alphabet:DFA.alphabet,
        acceptStateList:DFA.acceptStateList};
      var S_DFAdata={
        transitionTable:tool(s_DFA),
        alphabet:s_DFA.alphabet,
        acceptStateList:s_DFA.acceptStateList
      };

      console.log(s_DFA)
      var NFAcode=generateCode(NFAdata)
      var DFAcode=generateCode(DFAdata)
      var S_DFAcode=generateCode(S_DFAdata)

      var code=[NFAcode,DFAcode,S_DFAcode]
      var result=[NFAdata,DFAdata,S_DFAdata]
      console.log(code[0])
      console.log(code[1])
      console.log(code[2])
      jsonWrite(res, {state:state,result:result,code:code});
    }
  }


});

module.exports = router;
