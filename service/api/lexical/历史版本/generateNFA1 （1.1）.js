var express = require('express');
var router = express.Router();

var stateTransition1=function(s,i,e){
  this.startState=s;
  this.inputChar=i;
  this.endState=e;
  this.printStateTransition1=printStateTransition1
}
function printStateTransition1 (){
  console.log(this.startState,this.inputChar,this.endState)
}

var Stack = function(){
  this.dataStore=[];
  this.pop=pop;
  this.top=top;
  this.push=push;
  this.nullOrNot=nullOrNot;
}
function pop(){
  //console.log(this.dataStore.length)
  this.dataStore.length = this.dataStore.length-1;
}
function top(){
  return this.dataStore[this.dataStore.length-1];
}
function push(el){
  this.dataStore[this.dataStore.length]=el
}
function nullOrNot(){
  //null则返回true
  if(this.dataStore.length==0){return true}else{return false}
}

var NFA=function(s,e){
  this.stateTransitionList=[];
  this.startState=s;
  this.endState=e;
  this.printNFA=printNFA
  this.init = init
}
function printNFA(){
  //正则表达式
  for(var i=0;i<this.stateTransitionList.length;i++){
    this.stateTransitionList[i].printStateTransition1();
  }
  console.log("开始状态",this.startState)
  console.log("接受状态",this.endState)
}
function init(op1) {
  this.startState=op1.startState;
  this.endState=op1.endState;
  this.stateTransitionList=this.stateTransitionList.concat(op1.stateTransitionList);
}
//  单个NFA  生成状态流
var singalNFA =function(str){
  this.regularString=str;
  this.stateTable=[]
  //this.OperatorTable=[{operator:'(',priority:'0'},{operator:'|',priority:'1'},{operator:'.',priority:'2'},{operator:'*',priority:'3'},{operator:')',priority:'4'}]
  this.NFAStack=new Stack();
  this.OperatorStack=new Stack();
  this.state=0;
  this.new_state=0
  this.generateNFA=generateNFA;
  this.updateNFA=updateNFA;
  // this.updateNFA1=updateNFA1;
  this.connectOperator=connectOperator;
  this.selectOperator=selectOperator;
  this.clodureOperator=clodureOperator;
  this.printSingalNFA=printSingalNFA;
  this.generateStateTable=generateStateTable
  this.generateStateTable1=generateStateTable1
 // this.getOperatorStackTopPriority=getOperatorStackTopPriority
  //this.getOperatorPriority=getOperatorPriority
}
function generateNFA(){
  //初始化状态
  var str=this.regularString;
  var length=str.length
  this.state=0;
  //遍历
  for(var i=0;i<length;i++){
    var temp_char = str[i];
    switch (temp_char){
      case'|':
        while(!this.OperatorStack.nullOrNot()){
          //逐步弹出所有比|优先级高的操作符 并且执行
          //遇到(或者| 停止
          // var temp_priority=this.getOperatorStackTopPriority(this);
          // if(temp_priority==-1){console.log("-1!!!!!!!!!!!!!")}else{
          //   var operator =this.OperatorStack.top();
          //   if(temp_priority>this.getOperatorPriority(this,temp_char)){
          //     switch (operator){
          //       case '|':
          //         this.selectOperator(this)
          //         break;
          //       case '*':
          //         this.clodureOperator(this)
          //         break;
          //       case '.':
          //         this.connectOperator(this)
          //         break;
          //     }
          //   }else{
          //     break;
          //   }
          // }
          var operator=this.OperatorStack.top()
          if(operator=='.'){
            this.connectOperator()
          }else{if(operator=='('||operator=='|'){break;}else{console.log(' error！！！！！ |读入时符号栈里面出现',operator)}}
        }
        //将|压入OperatorStack
        this.OperatorStack.push('|')
        break;
      case'(':
        //将(压入OperatorStack
        this.OperatorStack.push('(')
        break;
      case')':
        while(!this.OperatorStack.nullOrNot()){
          //逐步弹出所有比|优先级高的操作符 并且执行
          //遇到(或者| 停止

          var operator =this.OperatorStack.top();
            if(operator!='('){
              switch (operator){
                case '|':
                  this.selectOperator()
                  break;
                case '.':
                  this.connectOperator()
                  break;
              }
            }else{
              this.OperatorStack.pop()
              break;
            }

        }
        //逐步弹出所有操作符 并且执行
        //遇到( 停止
        if(i+1<length){
          if(str[i+1]=='('){this.OperatorStack.push('.')}else{
            if(str[i+1]!="*"&&str[i+1]!=")"&&str[i+1]!="|"){
              this.OperatorStack.push('.')
            }
          }
        }
        break;
      case'*':
        //逐步弹出所有比*优先级高的操作符（理论上只有‘)’） 并且执行
        this.clodureOperator();
        if(i+1<length){
          if(str[i+1]=='('){this.OperatorStack.push('.')}else{
            if(str[i+1]!="*"&&str[i+1]!=")"&&str[i+1]!="|"){
              this.OperatorStack.push('.')
            }
          }
        }
        break;
      default:
        var regularChar=new NFA(this.state,this.state+1)
        regularChar.stateTransitionList[regularChar.stateTransitionList.length]=new stateTransition1(this.state,temp_char,this.state+1)
        this.state+=2
        this.NFAStack.push(regularChar)
        if(i+1<length){
          if(str[i+1]=='('){this.OperatorStack.push('.')}else{
            if(str[i+1]!="*"&&str[i+1]!=")"&&str[i+1]!="|"){
              this.OperatorStack.push('.')
            }
          }
        }
        break;
    }
  }
  //console.log("遍历完成")
  //遍历完成
  //弹出所有操作符
  while(!this.OperatorStack.nullOrNot()){

    var operator =this.OperatorStack.top();
    //console.log(operator)
    switch (operator){
      case '|':
        this.selectOperator()
        break;
      case '*':
        this.clodureOperator()
        break;
      case '.':
        this.connectOperator()
        break;
    }
  }
  this.printSingalNFA()

  //弹出完毕
  //更新状态
  this.generateStateTable()

  this.updateNFA()
  //更新状态完毕
  this.printSingalNFA()
  //生成字母表

  //打印字母表

  //打印更新状态后的结果

}
function generateStateTable(){
  for(var i=0;i<this.state;i++){
    this.stateTable[i]=-1;
  }
  var temp_NFA=this.NFAStack.top().stateTransitionList
  this.stateTable[this.NFAStack.top().startState]=this.new_state;
  //this.stateTable[this.NFAStack.top().endState]=this.state-1;
  this.new_state++;
  var start=this.NFAStack.top().startState;
  for (var i=0;i<this.NFAStack.top().stateTransitionList.length;i++){
    if(this.NFAStack.top().stateTransitionList[i].startState==start&&this.stateTable[this.NFAStack.top().stateTransitionList[i].endState]==-1){

      if(this.NFAStack.top().stateTransitionList[i].endState!=this.NFAStack.top().endState){
        this.stateTable[this.NFAStack.top().stateTransitionList[i].endState]=this.new_state;
        this.new_state++;
        this.generateStateTable1(this,this.NFAStack.top().stateTransitionList[i].endState)
      }
    }

  }
  this.stateTable[this.NFAStack.top().endState]=this.state-1;
}
function generateStateTable1(self,start){
  for (var i=0;i<self.NFAStack.top().stateTransitionList.length;i++){
    if(self.NFAStack.top().stateTransitionList[i].startState==start&&self.stateTable[self.NFAStack.top().stateTransitionList[i].endState]==-1){
      //console.log(self.NFAStack.top().stateTransitionList[i].endState)

      if(self.NFAStack.top().stateTransitionList[i].endState!=self.NFAStack.top().endState){
        self.stateTable[self.NFAStack.top().stateTransitionList[i].endState]=self.new_state;
        self.new_state++;
        self.generateStateTable1(self,self.NFAStack.top().stateTransitionList[i].endState)}
    }

  }

}
function updateNFA(){
  var result = this.NFAStack.top();
  result.startState=this.stateTable[result.startState]
  result.endState=this.stateTable[result.endState]
  for(var i=0;i<result.stateTransitionList.length;i++){
    result.stateTransitionList[i].startState=this.stateTable[result.stateTransitionList[i].startState]
    result.stateTransitionList[i].endState=this.stateTable[result.stateTransitionList[i].endState]
  }

}
function connectOperator(){
  var op2=new NFA(0,0);
  op2.init(this.NFAStack.top());
  this.NFAStack.pop();
  var op1=new NFA(0,0);
  op1.init(this.NFAStack.top());
  this.NFAStack.pop();
  var op3=new NFA(op1.startState,op2.endState)
  op3.stateTransitionList=op3.stateTransitionList.concat(op1.stateTransitionList,op2.stateTransitionList)
  op3.stateTransitionList[op3.stateTransitionList.length]=new stateTransition1(op1.endState,'ε',op2.startState)
  this.NFAStack.push(op3);
  this.OperatorStack.pop();
}
function selectOperator(){
  var op2=new NFA(0,0);
  op2.init(this.NFAStack.top());
  this.NFAStack.pop();
  var op1=new NFA(0,0);
  op1.init(this.NFAStack.top());
  this.NFAStack.pop();
  var op3=new NFA(this.state,this.state+1)
  op3.stateTransitionList=op3.stateTransitionList.concat(op1.stateTransitionList,op2.stateTransitionList)
  op3.stateTransitionList[op3.stateTransitionList.length]=new stateTransition1(op3.startState,'ε',op1.startState)
  op3.stateTransitionList[op3.stateTransitionList.length]=new stateTransition1(op3.startState,'ε',op2.startState)
  op3.stateTransitionList[op3.stateTransitionList.length]=new stateTransition1(op1.endState,'ε',op3.endState)
  op3.stateTransitionList[op3.stateTransitionList.length]=new stateTransition1(op2.endState,'ε',op3.endState)
  this.state=this.state+2
  this.NFAStack.push(op3);
  this.OperatorStack.pop();
}
function clodureOperator(){
  var op1=new NFA(0,0);
  op1.init(this.NFAStack.top());
  this.NFAStack.pop();
  var op3=new NFA(this.state,this.state+1)

  op3.stateTransitionList=op3.stateTransitionList.concat(op1.stateTransitionList)
  op3.stateTransitionList[op3.stateTransitionList.length]=new stateTransition1(op3.startState,'ε',op1.startState)
  op3.stateTransitionList[op3.stateTransitionList.length]=new stateTransition1(op3.startState,'ε',op3.endState)
  op3.stateTransitionList[op3.stateTransitionList.length]=new stateTransition1(op1.endState,'ε',op3.endState)
  op3.stateTransitionList[op3.stateTransitionList.length]=new stateTransition1(op1.endState,'ε',op1.startState)
  this.state=this.state+2
  this.NFAStack.push(op3);
}
function printSingalNFA(){
  console.log(this.regularString)
  this.NFAStack.top().printNFA()
}
// function getOperatorStackTopPriority() {
//   var operator = this.OperatorStack.top()
//   for(var i=0;i<this.OperatorTable;i++){
//     if(operator==this.OperatorTable[i].operator){
//       return this.OperatorTable[i].priority;
//     }
//   }
//   return -1;
// }
// function getOperatorPriority(operator) {
//   for(var i=0;i<this.OperatorTable;i++){
//     if(operator==this.OperatorTable[i].operator){
//       return this.OperatorTable[i].priority;
//     }
//   }
//   return -1;
// }
var finalNFA=function(strArray){
  this.strArray=strArray
  this.startState=0
  this.state=1
  this.StateTransition=[]
  this.generateFinalNFAStateTransition=generateFinalNFAStateTransition
  this.alphabet=[]
  this.generatealphabet=generatealphabet
  this.acceptStateList=[]
//  this.generateStateList=generateStateList
  this.StateTransitionTable=[]
  this.generateStateTransitionTable=generateStateTransitionTable
  var result={
    stateTransition:[],
    alphabet:[],
    acceptStateList:[]//元素state
  }

}
function generateFinalNFAStateTransition() {
  for (var i=0;i<this.strArray.length;i++){

    var temp_NFA1=new singalNFA(this.strArray[i])
    temp_NFA1.generateNFA()
    var temp_NFA =temp_NFA1.NFAStack.top()
    this.StateTransition[this.StateTransition.length]=new stateTransition1(this.startState,'ε',temp_NFA.startState+this.state)
    for(var j=0;j<temp_NFA.stateTransitionList.length;j++){
      this.StateTransition[this.StateTransition.length]=new stateTransition1(temp_NFA.stateTransitionList[j].startState+this.state,temp_NFA.stateTransitionList[j].inputChar,temp_NFA.stateTransitionList[j].endState+this.state)
    }
    this.acceptStateList[this.acceptStateList.length]={state:temp_NFA.endState+this.state,REId:i}
    this.state+=temp_NFA1.state
  }
  this.generatealphabet()
  this.generateStateTransitionTable()
  console.log(this.StateTransition)
  console.log(this.alphabet)
  console.log(this.acceptStateList)
  console.log(this.StateTransitionTable)

}
function generatealphabet(){
  for (var i=0;i<this.StateTransition.length;i++){
    var char=this.StateTransition[i].inputChar
    var notIn=true;
    for(var j=0;j<this.alphabet.length;j++){
      if(this.alphabet[j]==char){
        notIn=false
        break;
      }
    }
    if(notIn){
    this.alphabet[this.alphabet.length]=char}
  }
}
function generateStateTransitionTable(){
console.log(this)
  for(var i=0;i<this.state;i++){
    var vector2=[]
    for(var j=0;j<this.alphabet.length;j++){
      var vector1=[]
      vector2[vector2.length]=vector1
    }
    this.StateTransitionTable[this.StateTransitionTable.length]=vector2
  }
  console.log(this.StateTransitionTable)
  for(var i=0;i<this.StateTransition.length;i++){
    var input =0
    for(var j=0;j<this.alphabet.length;j++){
      if(this.alphabet[j]==this.StateTransition[i].inputChar){input=j;break}
    }
    this.StateTransitionTable[this.StateTransition[i].startState][input][this.StateTransitionTable[this.StateTransition[i].startState][input].length]=this.StateTransition[i].endState

  }
}
// var output =function(strArray){
//   var result={
//     stateTransition:[],
//     alphabet:[],
//     acceptStateList:[]//元素state
//   }
//
//   return result;
// }
// var acceptStateElement={
//   acceptState:0,
//   REID:1
// }

var test=new finalNFA(['a|b','b','c'])
test.generateFinalNFAStateTransition()
module.exports = router;
module.exports = finalNFA;
