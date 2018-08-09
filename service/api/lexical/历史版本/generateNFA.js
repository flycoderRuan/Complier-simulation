var express = require('express');
var router = express.Router();

function StateTransition(s,i,e) {
  this.startState=s
  this.inputChar=i
  this.endState=e
  this.printStateTransition=printStateTransition
}
printStateTransition=function(){
  console.log(this.startState,this.inputChar,this.endState)
}

function NFA(s,e){
  this.startState=s
  this.endState=e
  this.stateSteam=[]
  this.printNFA=printNFA
  this.init=init
}
addStateTransition=function(start,input,end){
  var temp=new StateTransition()
  temp.startState=start
  temp.inputChar=input
  temp.endState=end
  this.stateSteam[this.stateSteam.length]=temp
}
init=function(op1){
  this.endState=op1.endState
  this.startState=op1.startState
  this.stateSteam= this.stateSteam.concat(op1.stateSteam)
}
printNFA=function () {
  console.log("开始状态为  "+this.startState.toString())
  console.log("接受状态为  "+this.endState.toString())
  console.log("NFA的状态流图")
  for(var i=0;i<this.stateSteam.length;i++){
    this.stateSteam[i].printStateTransition()
  }

}


function Stark() {
  this.dataStore=[]
  //top 指的是元素的个数
  this.push=push;
  this.pop=pop;
  this.peek=peek;
  this.clear=clear;
  this.nullOrNot=nullOrNot
}
function nullOrNot() {
  if(this.dataStore.length==0){
    return true;
  }else {
    return false
  }
}
function peek(){
  return this.dataStore[this.dataStore.length-1]
}
function push(element) {
  this.dataStore[this.dataStore.length]=element;
  //console.log(element)
}
function pop() {
 this.dataStore.length=this.dataStore.length-1
}
function clear() {
  this.datastore=[]
}

var regularExpression= function(str){
  this.regularString =str
  this.generateNFA=generateNFA
  this.NFAStark=new Stark()
  this.OperatorStark=new Stark()
  this.connectOperator=connectOperator;
  this.connectOperator=connectOperator;
  this.clodureOperator=clodureOperator;
  this.selectOperator=selectOperator;
  this.state=0
  this.printResult=printResult
//  this.updateState=updateState
  this.updateStateTable1=updateStateTable1
  this.updateStateTable2=updateStateTable2
  this.stateTable1=[]
  this.stateTable2=[]
  this.modifyNFA=modifyNFA
}
function connectOperator(){
  var op1=new NFA(0,0)
  console.log(this.NFAStark.peek().startState)
  console.log(this.NFAStark.peek().endState)
  op1.init(this.NFAStark.peek())
  this.NFAStark.pop()

  var op2=new NFA(0,0)
  console.log(this.NFAStark.peek().startState)
  console.log(this.NFAStark.peek().endState)
  op2.init(this.NFAStark.peek())

  this.NFAStark.pop()
  //  start  op2  end -->>  start op1 end
  var op3=new NFA(op2.startState,op1.endState)
  op3.stateSteam=op3.stateSteam.concat(op1.stateSteam,op2.stateSteam)
  op3.stateSteam[op3.stateSteam.length]=new StateTransition(op2.endState,'ε',op1.startState)
  this.NFAStark.push(op3)
  this.OperatorStark.pop()
}
function selectOperator(){
  var op1=new NFA(0,0)
  op1.init(this.NFAStark.peek())
  this.NFAStark.pop()

  var op2=new NFA(0,0)
  op2.init(this.NFAStark.peek())
  this.NFAStark.pop()

  var op3=new NFA(this.state,this.state+1)
  this.state+=2
  op3.stateSteam=op3.stateSteam.concat(op1.stateSteam,op2.stateSteam);
  op3.stateSteam[op3.stateSteam.length]=new StateTransition(op3.startState,'ε',op1.startState)
  op3.stateSteam[op3.stateSteam.length]=new StateTransition(op3.startState,'ε',op2.startState)
  op3.stateSteam[op3.stateSteam.length]=new StateTransition(op1.endState,'ε',op3.endState)
  op3.stateSteam[op3.stateSteam.length]=new StateTransition(op2.endState,'ε',op3.endState)
  this.NFAStark.push(op3)
  this.OperatorStark.pop()
  console.log("操作成功")
}
function clodureOperator(){
  var op1=new NFA(0,0)
  op1.init(this.NFAStark.peek())
  this.NFAStark.pop()

  var op3=new NFA(this.state,this.state+1)
  this.state+=2
  op3.stateSteam=op3.stateSteam.concat(op1.stateSteam);
  op3.stateSteam[op3.stateSteam.length]=new StateTransition(op3.startState,'ε',op1.startState)
  op3.stateSteam[op3.stateSteam.length]=new StateTransition(op3.startState,'ε',op3.endState)
  op3.stateSteam[op3.stateSteam.length]=new StateTransition(op1.endState,'ε',op3.endState)
  op3.stateSteam[op3.stateSteam.length]=new StateTransition(op1.endState,'ε',op1.startState)
  this.NFAStark.push(op3)
}
function generateNFA() {
  var str =this.regularString
  var length =str.length

  for (var i=0;i<length;i++){
    var temp=0
    switch(str[i]){
      case'(':
        //左括号直接入栈   不用考虑其他操作
        this.OperatorStark.push('(')
        break;
      case')':
        //弹出所有操作符号，直到遇到左括号为止
        while(!this.OperatorStark.nullOrNot())
        {
          switch(this.OperatorStark.peek()){
            case'*':
              //this.clodureOperator()
              console.log("算法出错  闭包运算符不应该入栈")
              break;
            case'.':
              this.connectOperator()
              //console.log("算法出错  连接运算符")
              break;
            case'|':
              this.selectOperator()
              //console.log("算法出错  闭包运算符")
              break;
            case'(':
              temp=1;
              break;
            default:
              break;
          }
          if (temp==1){break;}
        }
        if(temp==1){this.OperatorStark.pop()}
        if(i+1<length){
          if(str[i+1]=='('){this.OperatorStark.push('.')}
          else{
            if(str[i+1]!=')'&&str[i+1]!='|'&&str[i+1]!='*')
            {this.OperatorStark.push('.')}
          }
        }
        break;
      case'*':
        this.clodureOperator()
        if(i+1<length){
          if(str[i+1]=='('){this.OperatorStark.push('.')}
          else{
            if(str[i+1]!=')'&&str[i+1]!='|'&&str[i+1]!='*')
            {this.OperatorStark.push('.')}
          }
        }
        break;
      case'.':
        console.log("输入错误  .默认为连接操作符")
        break;
      case'|':
        while(!this.OperatorStark.nullOrNot())
        {
          var temp=0
          switch(this.OperatorStark.peek()){
            case'*':
              //this.clodureOperator()
              console.log("算法出错  闭包运算符不应该入栈")
              break;
            case'.':
              this.connectOperator()
              //console.log("算法出错  连接运算符")
              break;
            case'|':
              temp=1
              //this.selectOperator()
              //console.log("算法出错  闭包运算符")
              break;
            case'(':
              temp=1;
              break;
            default:
              break;
          }
          if (temp==1){break;}
        }
        this.OperatorStark.push('|')
        break;
      default:
        var temp=new NFA(this.state,this.state+1)
        this.state+=2
        temp.stateSteam[temp.stateSteam.length]=new StateTransition(temp.startState,str[i],temp.endState)
        this.NFAStark.push(temp)
        if(i+1<length){
          if(str[i+1]=='('){this.OperatorStark.push('.')}
          else{
            if(str[i+1]!=')'&&str[i+1]!='|'&&str[i+1]!='*')
            {this.OperatorStark.push('.')}
          }
        }
        break;
    }
  }
  // while (!this.OperatorStark.nullOrNot()){
  //   console.log(this.OperatorStark.peek(),this.OperatorStark.dataStore.length)
  //   this.OperatorStark.pop()
  // }
  // while (!this.NFAStark.nullOrNot()){
  //   this.NFAStark.peek().printNFA()
  //   this.OperatorStark.pop()
  // }
  console.log('遍历完毕')
  while( !this.OperatorStark.nullOrNot()/*符号栈不为空*/){
    console.log(this.OperatorStark.peek())
    switch(this.OperatorStark.peek()){
      case'(':
        console.log("请检查输入 左括号出错")
        break;
      case')':
        console.log("请检查算法 右括号出错")
        break;
      case'*':
        console.log("请检查算法 闭包符号出错")
        break;
      case'.':
        this.connectOperator()
        break;
      case'|':
        console.log(this.NFAStark.dataStore.length)
        this.selectOperator()

        break;
      default:
        break;
    }

  }
  console.log("整合完毕")
  this.printResult()
}
function printResult(){
  console.log('正则表达式',this.regularString)
  this.NFAStark.peek().printNFA()
}

// function updateState(){
//   var temp = new NFA(0,0)
//   temp.startState=this.NFAStark.peek().startState
//   temp.endState=this.NFAStark.peek().endState
//   temp.stateSteam=temp.stateSteam.concat(this.NFAStark.peek().stateSteam)
//   var length=temp.stateSteam.length;
//   console.log("length",length)
//   console.log(temp.stateSteam)
//   console.log(this.NFAStark.peek().stateSteam)
//   var judge=[]
//   for(var i=0;i<length;i++){
//     judge[judge.length]=0
//   }
//   var result =new NFA(0,0)
//   var new_state=0
//
//
//   //得出 init 的开始状态
//   var start =temp.startState
//   var tempEndState=0
//   for(var i=0;i<temp.stateSteam.length;i++){
//     if(temp.stateSteam[i].startState==start&&judge[i]==0){
//       if(tempEndState==0){
//         if(temp.stateSteam[i].endState==temp.endState){
//           result.endState=new_state+1
//           tempEndState=1
//         }
//       }
//       judge[i]=1;
//       result.stateSteam[result.stateSteam.length]=new StateTransition(new_state,temp.stateSteam[i].inputChar,new_state+1)
//       new_state++;
//       var new_start=temp.stateSteam[i].endState
//       update(new_start,result,temp,judge,new_state,tempEndState);
//     }
//   }
//
//   result.printNFA()
// }
// function update(start,result,temp,judge,new_state,tempEndState){
//   for(var i=0;i<temp.stateSteam.length;i++){
//     if(temp.stateSteam[i].startState==start&&judge[i]==0){
//       if(tempEndState==0){
//         if(temp.stateSteam[i].endState==temp.endState){
//           result.endState=new_state+1
//           tempEndState=1
//         }
//       }
//       judge[i]=1;
//       result.stateSteam[result.stateSteam.length]=new StateTransition(new_state,temp.stateSteam[i].inputChar,new_state+1)
//       new_state++;
//       var new_start=temp.stateSteam[i].endState
//       update(new_start,result,temp,judge,new_state,tempEndState);
//     }
//   }
//
// }
//  stateTable  -1  表示占位符
function updateStateTable1(){
  var self=this
  //console.log(self)
  for(var i=0;i<this.state;i++){
    this.stateTable1[this.stateTable1.length]=i;
    this.stateTable2[this.stateTable2.length]=-1;
  }
  var new_state=0;
  var start=this.NFAStark.peek().startState
  for( var j=0;j<this.stateTable1.length;j++){

    if(this.stateTable1[j]==start){
      console.log(j)
      if(this.stateTable2[j]==-1){
        this.stateTable2[j]=new_state;
        new_state+=1;
        break;
      }
    }
  }
  // console.log(this.stateTable1)
  // console.log(this.stateTable2)
  for(var i=0;i<this.NFAStark.peek().stateSteam.length;i++){
    if(this.NFAStark.peek().stateSteam[i].startState==start){
      //表示state++  存在 并且可以使用

      var end = this.NFAStark.peek().stateSteam[i].endState
      var temp=0
      for( var j=0;j<this.stateTable1.length;j++){
        if(this.stateTable1[j]==end){
          if(this.stateTable2[j]==-1){
            this.stateTable2[j]=new_state;
            new_state+=1;

          }else{temp=1}
        }
      }
      if(temp==0){
      updateStateTable2(end,new_state,self)}
    }
  }
  //console.log(this.stateTable1)
  //console.log(this.stateTable2)
  modifyNFA(this)
}
function updateStateTable2(start,new_state,self){
  //console.log(self)
  for(var i=0;i<self.NFAStark.peek().stateSteam.length;i++){
    if(self.NFAStark.peek().stateSteam[i].startState==start){
      //表示state++  存在 并且可以使用
      var temp=0
      var end = self.NFAStark.peek().stateSteam[i].endState
      for(var j=0;j<self.stateTable1.length;j++){
        if(self.stateTable1[j]==end){
          if(self.stateTable2[j]==-1){
            self.stateTable2[j]=new_state;
            new_state+=1;
          }else{temp=1}
        }
      }
      if(temp==0){
      updateStateTable2(end,new_state,self)}

    }

  }

}
function modifyNFA(self){
  console.log(self)
  for(var i=0;i<self.NFAStark.peek().stateSteam.length;i++){
    //console.log(i)
    self.NFAStark.peek().stateSteam[i].printStateTransition()
    for(var j=0;j<self.stateTable1.length;j++){
      if(self.stateTable1[j]==self.NFAStark.peek().stateSteam[i].startState){
        //console.log("start","变更前",self.NFAStark.peek().stateSteam[i].startState,self.stateTable2[j])
        self.NFAStark.peek().stateSteam[i].startState=self.stateTable2[j]
       // console.log("start","变更后",self.NFAStark.peek().stateSteam[i].startState,self.stateTable2[j])
        break;
      }

    }
    for(var j=0;j<self.stateTable1.length;j++){

      if(self.stateTable1[j]==self.NFAStark.peek().stateSteam[i].endState){
       // console.log("end","变更前",self.NFAStark.peek().stateSteam[i].endState,self.stateTable2[j])
        self.NFAStark.peek().stateSteam[i].endState=self.stateTable2[j]
       // console.log("end","变更后",self.NFAStark.peek().stateSteam[i].endState,self.stateTable2[j])
        break;
      }
    }
  }
  for(var j=0;j<self.stateTable1.length;j++) {
    if (self.stateTable1[j] == self.NFAStark.peek().startState) {
      self.NFAStark.peek().startState = self.stateTable2[j]
    }
    if (self.stateTable1[j] == self.NFAStark.peek().endState) {
      self.NFAStark.peek().endState = self.stateTable2[j]
    }
  }
  // }
  // self.printResult();
}
var output=function(strArray){
  this.startState=0
  this.state=1
  this.stateSteam=[]
  this.transitionTable=[]

  this.acceptState=[]
  this.alphabet=[]
  this.generateStateSteam=generateStateSteam(this,strArray)
  this.generateAlphabet=generateAlphabet
  this.generateAcceptTable=generateAcceptTable
  this.generateTransitionTable=generateTransitionTable
  this.printOutput=printOutput
}
function generateStateSteam(self,strArray){
  // var REs=[]
  // console.log(this)
  // for(var i=0;i<strArray.length;i++){
  //   var RE=new regularExpression(strArray[i])
  //   REs[REs.length]=RE
  //   this.stateSteam[this.stateSteam.length]=new StateTransition(this.startState,'ε',this.state)
  //   for(var j=0;j<RE.NFAStark.peek().stateSteam.length;j++){
  //     this.stateSteam[this.stateSteam.length]=new StateTransition(RE.NFAStark.peek().stateSteam[j].startState+this.state,
  //     RE.NFAStark.peek().stateSteam[j].inputChar,
  //     RE.NFAStark.peek().stateSteam[j].endState+this.state)
  //   }
  //   this.acceptState[this.acceptState.length]=new acceptStateElement(this.RE.NFAStark.peek().endState+this.state,i)
  //   this.state+=RE.state;
  // }
  var REs=[]
  console.log(self)
  for(var i=0;i<strArray.length;i++){
    var RE=new regularExpression(strArray[i])
    RE.generateNFA()
    RE.updateStateTable1()
    //console.log(RE)
   //REs[REs.length]=RE
    self.stateSteam[self.stateSteam.length]=new StateTransition(self.startState,'ε',self.state)
    for(var j=0;j<RE.NFAStark.peek().stateSteam.length;j++){
      self.stateSteam[self.stateSteam.length]=new StateTransition(RE.NFAStark.peek().stateSteam[j].startState+self.state,
        RE.NFAStark.peek().stateSteam[j].inputChar,
        RE.NFAStark.peek().stateSteam[j].endState+self.state)
    }
    self.acceptState[self.acceptState.length]={state:RE.NFAStark.peek().endState+self.state,REID:i}
    self.state+=RE.state;
  }
}
function generateAlphabet (){

  for(var i=0;i<this.stateSteam.length;i++){

    var temp=0;

    for(var j=0;j<this.alphabet.length;j++){

      if(this.alphabet[j]==this.stateSteam[i].inputChar){
        temp=1;break;
      }
    }
    if(temp==0){
      this.alphabet[this.alphabet.length]=this.stateSteam[i].inputChar
    }
  }

}
function generateAcceptTable(){

}
function generateTransitionTable(){
  var vector1=[]   //存放状态集合
  var vector2=[]
  //存放不同输入的状态集合 一个输入字符就对应着一个元素
  //根据字母表的大小  构建vector2
  for(var i=0;i<this.state;i++){
    var vector2=[]
    for(var j=0;j<this.alphabet.length;j++){
      var vector1=[]
      vector2[vector2.length]=vector1;
    }
    this.transitionTable[this.transitionTable.length]=vector2
  }

  for(var i=0;i<this.state;i++){
    for(var j=0;j<this.alphabet.length;j++){

    }
  }
  for(var i=0;i<this.stateSteam.length;i++){
   var s=this.stateSteam[i].startState;
   var input=this.stateSteam[i].inputChar;
   var input1
   for(var j=0 ;j<this.alphabet.length;j++){
     if(this.alphabet[j]==input){input1=j;break;}
   }
   var e=this.stateSteam[i].endState;
    this.transitionTable[s][input1][this.transitionTable[s][input1].length]=e
  }


}
function printOutput(){
  console.log(this.alphabet)
  console.log(this.acceptState)
  console.log(this.stateSteam)
  console.log(this.transitionTable)
}
var re=['a','a']
var test=new output(re)
test.generateAcceptTable();
test.generateStateSteam;
test.generateAlphabet();

test.generateTransitionTable();
//test.printOutput();
//
// var result={
//   transitionTable: [
//     [[1, 4], [], [], [], [], [], []], // 0
//     [[], [], [2], [], [], [], []], // 1
//     [[], [], [], [], [], [3], []], // 2
//     [[], [], [], [], [], [], []], // 3
//     [[], [], [5], [], [], [], []], // 4
//     [[], [], [], [], [], [6], []], // 5
//     [[], [], [], [], [], [], [7]], // 6
//     [[], [8], [], [], [], [], []], // 7
//     [[], [], [], [], [9], [], []], // 8
//     [[], [], [], [10], [], [], []], // 9
//     [[], [], [], [], [], [], []] // 10
//   ],
//   alphabet: ['ε', 'b', 'd', 'e', 'l', 'o', 'u'],
//   acceptState: [
//     {
//       state: 3,
//       REId: 0
//     }, {
//       state: 10,
//       REId: 1
//     }
//   ]
// }
module.exports = router;
module.exports = output;
