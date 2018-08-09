// // var kTransitionTable[kNumStates][kNumSymbols]={
// // {{ {},{},{},{},{},{} }},
// // {{ {},{},{},{},{},{} }},
// // {{ {},{},{},{},{},{} }},
// // {{ {},{},{},{},{},{} }},
// // {{ {},{},{},{},{},{} }},
// // {{ {},{},{},{},{},{} }}
// // };
// //
// // //状态数目
// // bool kAcceptTable[kNumStates]={
// //   true,
// //   true,
// //   true,
// //   true,
// //   false
// // };
// //
// // 字母表
// // bool simulateDFA(string input){
// //   int state ={0};
// //   获取ε的下标
// //   构建状态0 的闭包 ε  state={}
// //
// //   int tempOfNull=-1;
// //   for(int i=0;i<alphabet.length;i++){
// //     if(alphabet[i]=="ε"){tempOfNull=i;break;}
// //   }
// //   if(tempOfNull==-1){
// //     int state=0;
// //     for(int i=0;i<input.length;i++){
// //       int indexOfInput=-1
// //       for(int j=0;j<alphabet.length;k++){
// //         if(alphabet[j]==input[i]){
// //           indexOfInput=j
// //           break;
// //         }
// //       }
// //       state=kTransitionTable[state][j];
// //     }
// //   }else{
// //
// //   }
// //   for(int a=0;a<input.length();a++){
// //     state
// //   }
// //   return kAcceptTable[];
// // }
//
//
// 没有空串0.0
// const int kNumOfStates = 2; //状态机中状态的总数
// const int kNumOfAlphabet = 1; //状态机中使用到的字符的总数
//
// char alphabet[ kNumOfAlphabet ] ={a};
//
// bool kAcceptTable[ kNumOfStates ] = {
//   false,//状态0
//   true //状态1是接受态
// };
//
// int kTransitionTable[ kNumOfStates ][ kNumOfAlphabet ] = {
// {1},//状态 0在输入字符a对应的变更状态 (-1表示不存在)
// {-1} //状态 1在输入字符a对应的变更状态 (-1表示不存在)
// }
//
// bool simulateDFA(string input){
//   int state = 0; //用来保存状态机数的变量0为开始状态，初始化为0
//   for (int i = 0 ; i < input.length ; i++ ){
//     int indexOfInput = -1 ; //记录当前输入字符在字母表中的下标，如果输入字符不在字母表中，返回-1，反之返回字符在字母表中对应的下标
//     for( int j = 0; j < alphabet.length ; j++){
//       if(input[ i ] == alphabet[j] ){
//         indexOfInput = j ;
//         break;
//       }
//     }
//     if(indexOfInput == -1){
//       return false;
//     }else{
//       state = kTransitionTable[state][indexOfInput] ; //当前状态在输入当前字符会出现的状态变更
//     }
//   }
//   return kAcceptTable[state]; //判断最终状态是否为接受状态 为接受状态则返回true接受该字符串，反之返回false
// }
//
console.log(kTransitionTable)
console.log(NFAdata.alphabet)
console.log(NFAdata.acceptStateList)

var alphabet=[
  自行编写
];
var kTransitionTable = [
  自行编写
];
var kAcceptTable = [
  自行编写
];

function simulateStateMachine(input){
  var indexOfNull = -1;
  for(var i=0;i<alphabet.length;i++){
    if(alphabet[i]=='ε'){
      indexOfNull=i;
      break;
    }
  }//由于这里肯定存在'ε'  所以不考虑indexOfNull为-1 的情况

  var closureOfState=[0];//开始状态为0，生成该状态的ε闭包
  for(var i=0 ;i<closureOfState.length;i++){
    //遍历状态表kTransitionTable，获取所有的ε闭包元素的同时，添加新的状态，并且继续遍历新状态的ε闭包，添加到closureOfState中，直至不再改变
    for(var j=0;j<kTransitionTable[closureOfState[i]][indexOfNull].length;j++) {
      //kTransitionTable[closureOfState[i]][indexOfNull]  当前状态的ε闭包  添加closureOfState中没有出现过的元素
      var existOrNot=false;
      for (var k=0;k<closureOfState.length;k++){
        if(closureOfState[k]==kTransitionTable[closureOfState[i]][indexOfNull][j]){existOrNot=true;break;}
      }
      if(!existOrNot){
        //查重，发现集合中没有该状态，添加该状态
        closureOfState.push(kTransitionTable[closureOfState[i]][indexOfNull][j]);
      }
    }
  }
//此时 closureOfState为开始状态0的ε闭包
  for(var i=0 ;i<input.length;i++){
    //遍历输入的词素的所有字符 判断这个词素是否能接受

    //该字符是否在 字母表中，是则返回对应的下标，否则返回-1
    var indexOfInput = -1;
    for(var j=0;j<alphabet.length;j++){
      if(alphabet[j]==input[i]){
        indexOfInput=j;
        break;
      }
    }
    if(indexOfInput==-1){
      //输入字符不存在字符表中，函数返回false
      return false;
    }else{
      var closure=[]  //用于临时存储状态转移后 状态的ε闭包
      for(var k=0;k<closureOfState.length;k++){
        // 遍历状态表kTransitionTable获取当前闭包 在输入字符后的所有状态 并将状态添加入closure中
        for(var l=0;l<kTransitionTable[closureOfState[k]][j].length;l++){
          var existOrNot=false;
          for (var m=0;m<closure.length;m++){
            if(closure[m]==kTransitionTable[closureOfState[k]][j][l]){existOrNot=true;break;}
          }
          if(!existOrNot){
            closure.push(kTransitionTable[closureOfState[k]][j][l]);
          }
        }
      }
      //获取closure状态集合的ε闭包
      for(var n=0 ;n<closure.length;n++){
        for(var o=0;o<kTransitionTable[closure[n]][indexOfNull].length;o++) {
          var existOrNot=false;
          for (var p=0;p<closure.length;p++){
            if(closure[p] == kTransitionTable[closure[n]][indexOfNull][o]){existOrNot=true;break;}
          }
          if(!existOrNot){
            closure.push(kTransitionTable[closure[n]][indexOfNull][o]);
          }
        }
      }
      if(closure.length == 0){
        //如果closure状态集合的长度为0，表示不存在任何转移状态，及不接受该词素
        return false;
      }else{
        //更新状态转移后的状态集合
        closureOfState=closure
      }
    }

  }
  for( var i = 0 ; i < closureOfState.length ; i++){
    //如果最终状态集合中包含接受状态 则返回true
    if( kAcceptTable [closureOfState[i]] ){
      return true;
    }
  }
  //最终状态集合中不包含接受状态  返回false
  return false;
}

