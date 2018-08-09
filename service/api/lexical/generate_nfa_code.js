module.exports=function(NFAdata){
  var existOfNull=-1;

  for (var i = 0; i < NFAdata.alphabet.length; i++) {
    if (NFAdata.alphabet[i] == 'ε') {
      existOfNull = i
      break
    }
  }
  if (existOfNull != -1) {
    var code_str = ''
    code_str += 'var alphabet = ['
    for (var i = 0; i < NFAdata.alphabet.length; i++) {
      if (i == 0) {
        code_str += "'" + NFAdata.alphabet[i] + "'"
      } else {
        code_str += ",'" + NFAdata.alphabet[i] + "'"
      }
    }

    code_str += ']; //状态机中会用到的字符表\n\n'
    code_str += 'var kTransitionTable = [\n'
    for (var i = 0; i < NFAdata.transitionTable.length; i++) {
      var temp_str = '  [ '

      if (i + 1 == NFAdata.transitionTable.length) {
        for (var j = 0; j < NFAdata.transitionTable[i].length; j++) {
          var temp_str1 = '['
          if (j + 1 == NFAdata.transitionTable[i].length) {
            for (var k = 0; k < NFAdata.transitionTable[i][j].length; k++) {
              if (k == 0) {
                temp_str1 += NFAdata.transitionTable[i][j][k]
              } else {
                temp_str1 += ',' + NFAdata.transitionTable[i][j][k]
              }
            }
            temp_str1 += ']'
          } else {
            for (var k = 0; k < NFAdata.transitionTable[i][j].length; k++) {
              if (k == 0) {
                temp_str1 += NFAdata.transitionTable[i][j][k]
              } else {
                temp_str1 += ',' + NFAdata.transitionTable[i][j][k]
              }
            }
            temp_str1 += '],'
          }
          temp_str += temp_str1
        }

        temp_str +=
          ' ] //状态 ' +
          i +
          '在输入字符' +
          NFAdata.alphabet.toString() +
          '对应的变更状态 (空表示不存在) \n'
      } else {
        for (var j = 0; j < NFAdata.transitionTable[i].length; j++) {
          var temp_str1 = '['
          if (j + 1 == NFAdata.transitionTable[i].length) {
            for (var k = 0; k < NFAdata.transitionTable[i][j].length; k++) {
              if (k == 0) {
                temp_str1 += NFAdata.transitionTable[i][j][k]
              } else {
                temp_str1 += ',' + NFAdata.transitionTable[i][j][k]
              }
            }
            temp_str1 += ']'
          } else {
            for (var k = 0; k < NFAdata.transitionTable[i][j].length; k++) {
              if (k == 0) {
                temp_str1 += NFAdata.transitionTable[i][j][k]
              } else {
                temp_str1 += ',' + NFAdata.transitionTable[i][j][k]
              }
            }
            temp_str1 += '],'
          }
          temp_str += temp_str1
        }

        temp_str += ' ], //状态' + i + '\n'
      }

      code_str += temp_str
    }
    code_str += '];\n\n'
    code_str += 'var kAcceptTable = [\n'
    for (var i = 0; i < NFAdata.transitionTable.length; i++) {
      var endOrNot = false
      for (var j = 0; j < NFAdata.acceptStateList.length; j++) {
        if (NFAdata.acceptStateList[j].state == i) {
          endOrNot = true
          break
        }
      }
      if(i+1==NFAdata.transitionTable.length){
        if(endOrNot){code_str+=" true   //状态"+i+"为接受态!!!!!\n"}else{code_str+=" false  //状态"+i+"\n"}
      }else{
        if(endOrNot){code_str+=" true , //状态"+i+"为接受态!!!!!\n"}else{code_str+=" false, //状态"+i+"\n"}

      }
    }
    code_str += '];\n\n'
    code_str +=
      'function simulateStateMachine(input){\n' +
      '  var indexOfNull = -1;\n' +
      '  for(var i=0;i<alphabet.length;i++){\n' +
      "    if(alphabet[i]=='ε'){\n" +
      '      indexOfNull=i;\n' +
      '      break;\n' +
      '    }\n' +
      "  }//由于这里肯定存在'ε'  所以不考虑indexOfNull为-1 的情况\n" +
      '\n' +
      '  var closureOfState=[0];//开始状态为0，生成该状态的ε闭包\n' +
      '  for(var i=0 ;i<closureOfState.length;i++){\n' +
      '    //遍历状态表kTransitionTable，获取所有的ε闭包元素的同时，添加新的状态，并且继续遍历新状态的ε闭包，添加到closureOfState中，直至不再改变\n' +
      '    for(var j=0;j<kTransitionTable[closureOfState[i]][indexOfNull].length;j++) {\n' +
      '      //kTransitionTable[closureOfState[i]][indexOfNull]  当前状态的ε闭包  添加closureOfState中没有出现过的元素\n' +
      '      var existOrNot=false;\n' +
      '      for (var k=0;k<closureOfState.length;k++){\n' +
      '        if(closureOfState[k]==kTransitionTable[closureOfState[i]][indexOfNull][j]){existOrNot=true;break;}\n' +
      '      }\n' +
      '      if(!existOrNot){\n' +
      '        //查重，发现集合中没有该状态，添加该状态\n' +
      '        closureOfState.push(kTransitionTable[closureOfState[i]][indexOfNull][j]);\n' +
      '      }\n' +
      '    }\n' +
      '  }\n' +
      '//此时 closureOfState为开始状态0的ε闭包\n' +
      '  for(var i=0 ;i<input.length;i++){\n' +
      '    //遍历输入的词素的所有字符 判断这个词素是否能接受\n' +
      '    \n' +
      '    //该字符是否在 字母表中，是则返回对应的下标，否则返回-1\n' +
      '    var indexOfInput = -1;\n' +
      '    for(var j=0;j<alphabet.length;j++){\n' +
      '      if(alphabet[j]==input[i]){\n' +
      '        indexOfInput=j;\n' +
      '        break;\n' +
      '      }\n' +
      '    }\n' +
      '    if(indexOfInput==-1){\n' +
      '      //输入字符不存在字符表中，函数返回false\n' +
      '      return false;\n' +
      '    }else{\n' +
      '      var closure=[]  //用于临时存储状态转移后 状态的ε闭包\n' +
      '      for(var k=0;k<closureOfState.length;k++){\n' +
      '        // 遍历状态表kTransitionTable获取当前闭包 在输入字符后的所有状态 并将状态添加入closure中\n' +
      '        for(var l=0;l<kTransitionTable[closureOfState[k]][j].length;l++){\n' +
      '          var existOrNot=false;\n' +
      '          for (var m=0;m<closure.length;m++){\n' +
      '            if(closure[m]==kTransitionTable[closureOfState[k]][j][l]){existOrNot=true;break;}\n' +
      '          }\n' +
      '          if(!existOrNot){\n' +
      '            closure.push(kTransitionTable[closureOfState[k]][j][l]);\n' +
      '          }\n' +
      '        }\n' +
      '      }\n' +
      '      //获取closure状态集合的ε闭包\n' +
      '      for(var n=0 ;n<closure.length;n++){\n' +
      '        for(var o=0;o<kTransitionTable[closure[n]][indexOfNull].length;o++) {\n' +
      '          var existOrNot=false;\n' +
      '          for (var p=0;p<closure.length;p++){\n' +
      '            if(closure[p] == kTransitionTable[closure[n]][indexOfNull][o]){existOrNot=true;break;}\n' +
      '          }\n' +
      '          if(!existOrNot){\n' +
      '            closure.push(kTransitionTable[closure[n]][indexOfNull][o]);\n' +
      '          }\n' +
      '        }\n' +
      '      }\n' +
      '      if(closure.length == 0){\n' +
      '        //如果closure状态集合的长度为0，表示不存在任何转移状态，及不接受该词素\n' +
      '        return false;\n' +
      '      }else{\n' +
      '        //更新状态转移后的状态集合\n' +
      '        closureOfState=closure\n' +
      '      }\n' +
      '    }\n' +
      '\n' +
      '  }\n' +
      '  for( var i = 0 ; i < closureOfState.length ; i++){\n' +
      '    //如果最终状态集合中包含接受状态 则返回true\n' +
      '    if( kAcceptTable [closureOfState[i]] ){\n' +
      '      return true;\n' +
      '    }\n' +
      '  }\n' +
      '  //最终状态集合中不包含接受状态  返回false\n' +
      '  return false;\n' +
      '}\n'
    // console.log(code_str)
    return code_str
  } else {
    // 全是DFA   满足DFA的相关属性  一个状态 一个输入 一个状态结果
    console.log(NFAdata.transitionTable)
    console.log(NFAdata.alphabet)
    console.log(NFAdata.acceptStateList)
    // 构建字母表  ！！！！！
    var code_str =
      'const int kNumOfStates = ' +
      NFAdata.transitionTable.length +
      '; //状态机中状态的总数\n'
    code_str +=
      'const int kNumOfAlphabet = ' +
      NFAdata.alphabet.length +
      '; //状态机中使用到的字符的总数\n\n'
    code_str += 'char alphabet[ kNumOfAlphabet ] ={'
    for (var i = 0; i < NFAdata.alphabet.length; i++) {
      if (i == 0) {
        code_str += NFAdata.alphabet[i]
      } else {
        code_str += ',' + NFAdata.alphabet[i]
      }
    }
    code_str += '};\n\n'
    // 构建truefalse
    code_str += 'bool kAcceptTable[ kNumOfStates ] = {\n'
    for (var i = 0; i < NFAdata.transitionTable.length; i++) {
      var endOrNot = false
      for (var j = 0; j < NFAdata.acceptStateList.length; j++) {
        if (NFAdata.acceptStateList[j].state == i) {
          endOrNot = true
          break
        }
      }
      if (i + 1 == NFAdata.transitionTable.length) {
        if (endOrNot) {
          code_str += ' true //状态' + i + '是接受态\n'
        } else {
          code_str += ' false //状态' + i + '\n'
        }
      } else {
        if (endOrNot) {
          code_str += ' true,//状态' + i + '是接受态\n'
        } else {
          code_str += ' false,//状态' + i + '\n'
        }
      }
    }
    code_str += '};\n\n'
    code_str += 'int kTransitionTable[ kNumOfStates ][ kNumOfAlphabet ] = {\n'
    for (var i = 0; i < NFAdata.transitionTable.length; i++) {
      if (i + 1 == NFAdata.transitionTable.length) {
        var str = ' {'
        for (var j = 0; j < NFAdata.alphabet.length; j++) {
          if (j == 0) {
            if (NFAdata.transitionTable[i][j].length == 0) {
              str += '-1'
            } else {
              str += NFAdata.transitionTable[i][j][0]
            }
          } else {
            if (NFAdata.transitionTable[i][j].length == 0) {
              str += ',-1'
            } else {
              str += ',' + NFAdata.transitionTable[i][j][0]
            }
          }
        }
        str +=
          '} //状态 ' +
          i +
          '在输入字符' +
          NFAdata.alphabet.toString() +
          '对应的变更状态 (-1表示不存在) \n'
        code_str += str
      } else {
        var str = ' {'
        for (var j = 0; j < NFAdata.alphabet.length; j++) {
          if (j == 0) {
            if (NFAdata.transitionTable[i][j].length == 0) {
              str += '-1'
            } else {
              str += NFAdata.transitionTable[i][j][0]
            }
          } else {
            if (NFAdata.transitionTable[i][j].length == 0) {
              str += ',-1'
            } else {
              str += ',' + NFAdata.transitionTable[i][j][0]
            }
          }
        }
        str +=
          '},//状态 ' +
          i +
          '在输入字符' +
          NFAdata.alphabet.toString() +
          '对应的变更状态 (-1表示不存在)\n'
        code_str += str
      }
    }

    code_str += '}\n\n'

    code_str += 'bool simulateStateMachine(string input){\n'
    code_str +=
      ' int state = 0; //用来保存状态机数的变量0为开始状态，初始化为0\n'
    code_str += ' for (int i = 0 ; i < input.length ; i++ ){\n'
    code_str +=
      '   int indexOfInput = -1 ; //记录当前输入字符在字母表中的下标，如果输入字符不在字母表中，返回-1，反之返回字符在字母表中对应的下标\n'
    code_str += '   for( int j = 0; j < alphabet.length ; j++){\n'
    code_str += '     if(input[ i ] == alphabet[j] ){\n'
    code_str += '       indexOfInput = j ;\n'
    code_str += '       break;\n'
    code_str += '     }\n'
    code_str += '   }\n'
    code_str += '   if(indexOfInput == -1){\n'
    code_str += '     return false;\n'
    code_str += '   }else{\n'
    code_str +=
      '     state = kTransitionTable[state][indexOfInput] ; //当前状态在输入当前字符会出现的状态变更\n'
    code_str += '   }\n'
    code_str += ' }\n'
    code_str +=
      ' return kAcceptTable[state]; //判断最终状态是否为接受状态 为接受状态则返回true接受该字符串，反之返回false  \n'
    code_str += '}\n'

    // console.log()
    // console.log()
    // console.log(code_str)
    return code_str
  }
}
