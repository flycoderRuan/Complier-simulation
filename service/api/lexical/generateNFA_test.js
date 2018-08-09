

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
  this.deepInit = deepInit
  this.getNumOfState = getNumOfState
}

function deepInit(op1) {
  this.startState=op1.startState;
  this.endState=op1.endState;
  for (var i in op1.stateTransitionList) {
    var tempStateTrans = op1.stateTransitionList[i]
    var newStateTrans = new stateTransition1( tempStateTrans.startState, tempStateTrans.inputChar, tempStateTrans.endState)
    this.stateTransitionList.push(newStateTrans)
  }
  // this.stateTransitionList.push.apply(this.stateTransitionList,op1.stateTransitionList)
}
function getNumOfState(){
  var max = this.startState
  var min = this.startState
  for( var i = 0 ; i < this.stateTransitionList.length ; i++){
    var temp = this.stateTransitionList[i]
    if( temp.startState > max ){
      max = temp.startState
    }
    if( temp.endState > max ){
      max = temp.endState
    }
    if( temp.startState < min ){
      min = temp.startState
    }
    if( temp.endState < min ){
      min = temp.endState
    }
  }

  return max - min + 1
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

  // this.updateNFA1=updateNFA1;
  this.connectOperator=connectOperator;
  this.selectOperator=selectOperator;
  this.clodureOperator=clodureOperator;
  this.printSingalNFA=printSingalNFA;
  this.updateNFA=updateNFA;
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
          //逐步弹出所有操作符 并且执行
          //遇到(停止

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
            if(str[i+1]!="*"&&str[i+1]!=")"&&str[i+1]!="{"&&str[i+1]!="|"){
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
            if(str[i+1]!="*"&&str[i+1]!=")"&&str[i+1]!="{"&&str[i+1]!="|"){
              this.OperatorStack.push('.')
            }
          }
        }
        break;
      case'{':
        var tempCount = i + 1

        for( ; tempCount < str.length; tempCount++){
          if( str[tempCount] === ',' || str[tempCount] === '}'){
            break;
          }
        }

        if(tempCount - i === 1 ){
          console.log("invalid input after '{'")
          break
        }
        //大括号中只有一个数字
        if( str[tempCount] === '}'){
          var numStr = ""
          for( var m = i+1 ; m < tempCount ; m++ ){
            numStr += str[m]
          }
          var num = parseInt(numStr)
          console.log('test generate {: num = ' + num)
          if( num === 0 ){
            var op2=new NFA(0,0);
            op2.deepInit(this.NFAStack.top());
            this.NFAStack.pop();
            // console.log('op2: ')
            // op2.printNFA()
            this.state -= op2.getNumOfState()
            var op1 = new NFA( this.state , this.state + 1)
            op1.stateTransitionList.push( new stateTransition1(op1.startState, 'ε', op1.endState))
            this.state = this.state + 2
            console.log('op1: ')
            op1.printNFA()
            this.NFAStack.push(op1)
          }else{
            var op1=new NFA(0,0);
            op1.init(this.NFAStack.top());
            this.NFAStack.pop();

            console.log('op1: ' )
            op1.printNFA()

            var op3 = new NFA(0,0)
            op3.deepInit(op1)

            console.log('op3: ' )
            op3.printNFA()

            var res = new NFA(0,0)
            res.startState = op3.startState
            res.stateTransitionList = res.stateTransitionList.concat( op3.stateTransitionList)
            var countState = op1.getNumOfState()

            console.log('countState: ', countState)
            for( var m = 1; m < num; m++ ){
              var op2 = new NFA(0,0)
              for(var n = 0; n < op1.stateTransitionList.length ; n++ ){
                var temp = op1.stateTransitionList[n]
                temp.startState += countState
                temp.endState += countState
              }
              op1.startState += countState
              op1.endState += countState
              op2.deepInit(op1)
              console.log('op2: ' )
              op2.printNFA()
              // console.log('9999999')
              // op1.printNFA()
              res.stateTransitionList.push.apply(res.stateTransitionList,op2.stateTransitionList)
              res.stateTransitionList.push(new stateTransition1(op2.endState-countState,'ε',op2.startState))
              this.state += countState
            }
            res.endState = op1.endState
            console.log('res: ' )
            res.printNFA()
            this.NFAStack.push(res)
          }
          i = tempCount
        }else{//遇到','
          var numOne
          var numTwo

          if(tempCount - i === 1){
            numOne = 0
          }else{
            var numStr = ""//new Array()
            for( var m = i + 1 ; m < tempCount ; m ++ ){
              numStr += str[m]
            }
            // var numStr = numStrArray.join("")
            numOne = parseInt(numStr)
            if( numOne < 0){
              console.log("numOne < 0 , invalid")
              break;
            }
          }

          //开始检查第二个数字
          i = tempCount
          tempCount = tempCount + 1

          for( var m = tempCount ; m < str.length ; m ++){
            if( str[m] === '}'){
              i = m
              break
            }
          }

          //说明第二个数字为无穷，记为-1
          if( i === tempCount ){
            numTwo = -1
          }else{
            var numStr = ""//new Array()
            for( var m = tempCount ; m < i ; m ++ ){
              numStr += str[m]
            }
            // var numStr = numStrArray.join("")
            numTwo = parseInt(numStr)
            if( numTwo < numOne){
              console.log("numTwo < numOne , invalid")
              break;
            }
          }
          console.log('numOne :', numOne)
          console.log('numTwo :', numTwo)
          if( numOne === 0 ){
            if(numTwo === 0 ){//相当于 {0}
              var op2=new NFA(0,0);
              op2.deepInit(this.NFAStack.top());
              this.NFAStack.pop();
              this.state -= op2.getNumOfState()
              var op1 = new NFA( this.state , this.state + 1)
              op1.stateTransitionList.push( new stateTransition1(op1.startState, 'ε', op1.endState))
              this.state = this.state + 2
              console.log('op1: ')
              op1.printNFA()
              this.NFAStack.push(op1)
            }else{
              var op1=new NFA(0,0);
              op1.init(this.NFAStack.top());
              op1.stateTransitionList.push(new stateTransition1(op1.startState,'ε',op1.endState))
              this.NFAStack.pop();

              console.log('op1: ' )
              op1.printNFA()

              var op3 = new NFA(0,0)
              op3.deepInit(op1)
              console.log('op3: ' )
              op3.printNFA()

              var res = new NFA(0,0)
              res.startState = op3.startState
              res.stateTransitionList = res.stateTransitionList.concat( op3.stateTransitionList)
              var countState = op1.getNumOfState()
              // res.startState = op1.startState
              // res.stateTransitionList = res.stateTransitionList.concat( op1.stateTransitionList)
              // var countState = op1.getNumOfState()
              for( var m = 1; m < numTwo - numOne; m++ ){
                var op2 = new NFA(0,0)
                for(var n = 0; n < op1.stateTransitionList.length ; n++ ){
                  var temp = op1.stateTransitionList[n]
                  temp.startState += countState
                  temp.endState += countState
                }
                op1.startState +=  countState
                op1.endState += countState
                op2.deepInit(op1)
                console.log('op2: ' )
                op2.printNFA()
                // console.log('9999999')
                // op1.printNFA()
                res.stateTransitionList.push.apply(res.stateTransitionList,op2.stateTransitionList)
                res.stateTransitionList.push(new stateTransition1(op2.endState-countState,'ε',op2.startState))
                this.state += countState
              }
              res.endState = op1.endState
              console.log('res :')
              res.printNFA()
              this.NFAStack.push(res)
            }
          }
          else{//numOne > 0
            var op1=new NFA(0,0);
            op1.init(this.NFAStack.top());
            this.NFAStack.pop();
            var res = new NFA(0,0)
            res.startState = op1.startState
            res.stateTransitionList = res.stateTransitionList.concat( op1.stateTransitionList)
            var countState = op1.getNumOfState()
            for( var m = 1 ; m < numOne; m++ ){
              for(var n = 0; n < op1.stateTransitionList.length ; n++ ){
                var temp = op1.stateTransitionList[n]
                temp.startState += countState
                temp.endState += countState
              }
              res.stateTransitionList = res.stateTransitionList.concat( res.stateTransitionList , op1.stateTransitionList )
              res.stateTransitionList.push(new stateTransition1(op1.endState-countState,'ε',op1.startState))
              this.state += countState
            }
            res.endState = op1.endState

            if( numTwo === numOne ){
              this.NFAStack.push(res)
            }else{//
              op1.stateTransitionList.push(new stateTransition1(op1.startState,'ε',op1.endState))
              // res
              for( var m = 0 ; m < numTwo - numOne; m++ ){
                for(var n = 0; n < op1.stateTransitionList.length ; n++ ){
                  var temp = op1.stateTransitionList[n]
                  temp.startState += countState
                  temp.endState += countState
                }
                res.stateTransitionList = res.stateTransitionList.concat( res.stateTransitionList , op1.stateTransitionList )
                res.stateTransitionList.push(new stateTransition1(op1.endState-countState,'ε',op1.startState))
                this.state += countState
              }
              res.endState = op1.endState
              this.NFAStack.push(res)
            }
          }
        }
        if(i+1<length){
          if(str[i+1]=='('){this.OperatorStack.push('.')}else{
            if(str[i+1]!="*"&&str[i+1]!=")"&&str[i+1]!="{"&&str[i+1]!="|"){
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
            if(str[i+1]!="*"&&str[i+1]!=")"&&str[i+1]!="{"&&str[i+1]!="|"){
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
  //this.printSingalNFA()

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

var temp = 'a{0,2}'
var test = new singalNFA(temp)
test.generateNFA()
