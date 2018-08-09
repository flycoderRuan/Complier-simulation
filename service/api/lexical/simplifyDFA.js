function StateTransition(s,i,e) {
  this.startState=s
  this.inputChar=i
  this.endState=e
}

function AcceptStateList( s , id ){
  this.state = s
  this.REId = id
}
function judge_next( res , stPoint , edge , stateTransitions ){
  for( var j = 0 ; j < stateTransitions.length ; j ++){
    if( stPoint === stateTransitions[j].startState && edge === stateTransitions[j].inputChar ){
      for( var k = 0 ; k < res.length ; k++ ){
        for( var i = 0 ; i < res[k].length ; i ++ ){
          if( stateTransitions[j].endState === res[k][i]){
            return k;
          }
        }
      }
    }
  }
  return -1;
}
function findRE(state,acceptStates) {
  for( var i = 0 ; i < acceptStates.length ; i++ ){
    if(state === acceptStates[i].state){
      return acceptStates[i].REId;
    }
  }
  return -1;
}
// 判断state和endStates里面的元素是否有属于相同RE的接受状态，有就返回该元素的index值，没有就返回-1
function belongToSameRE (state, endStates, acceptStates) {
  for (var i = 0; i < endStates.length; i++) {
    var numOfRE1 = findRE(state,acceptStates)
    var numOfRE2 = findRE(endStates[i][0], acceptStates)
    if (numOfRE1 === numOfRE2) {
      return i
    }
  }
  return -1
}

module.exports =function simplifyDFA( DFA){
  // 该函数返回的结果是resStateTrans，alphabets , acceptStateList
  // console.log(DFA)
  var stateTransitions=DFA.stateTransition
  var alphabets=DFA.alphabet
  var acceptStates=DFA.acceptStateList

  // console.log('acceptState:')
  // for( var i = 0 ; i < acceptStates.length ; i ++ ){
  //   console.log( 'state:' + acceptStates[i].state + ' id:' + acceptStates[i].REId);
  // }

  var resStateTrans = new Array();
  var resAcceptStateList = new Array();

  // 找出所有接受状态数组
  var endStates = new Array();
  for ( var i = 0 ; i < acceptStates.length ; i++ ){
    endStates.push( acceptStates[i].state );
  }

  // 找出所有非接受状态
  var nonEndStates = new Array();
  for( var i = 0 ; i < stateTransitions.length ; i ++ ) {
    if (endStates.indexOf(stateTransitions[i].startState) ===  -1 && nonEndStates.indexOf(stateTransitions[i].startState) === -1 )
    {
      nonEndStates.push(stateTransitions[i].startState)
    }
    if( endStates.indexOf(stateTransitions[i].endState) ===  -1 && nonEndStates.indexOf(stateTransitions[i].endState) === -1){
      nonEndStates.push(stateTransitions[i].endState)
    }
  }

  // 对接受状态进行进一步划分（多条正则表达式时每条正则表达式的接受状态相互分开）
  endStates.splice(0,endStates.length);
  for (var i = 0 ; i < acceptStates.length ; i++){
    var index = belongToSameRE(acceptStates[i].state , endStates , acceptStates);
    if ( index === -1) {
      var termArray = new Array();
      termArray.push(acceptStates[i].state);
      endStates.push(termArray)
    } else {
      endStates[index].push(acceptStates[i].state);
    }
  }

  var res = new Array();
  res.push(nonEndStates);
  for (var i = 0; i < endStates.length; i++ ) {
    res.push(endStates[i]);
  }
  // console.log('res2222')
  // console.log(res)

  //对状态进行划分
  var i = 0 ;
  while( true ){
    for( ; i < res.length ; i++ ){
      var jumpNext = new Array();
      var belongTo = new Array();

      for( var j = 0 ; j < res[i].length ; j++ ){
        var eachJumpNext = new Array();

        for( var k = 0 ; k < alphabets.length ; k ++ ){
          eachJumpNext.push( judge_next(res,res[i][j],alphabets[k],stateTransitions));
        }

        var l;
        for( l = 0 ; l < jumpNext.length ; l++ ){
          var m;
          for( m = 0 ; m < eachJumpNext.length ; m++ ){
            if( jumpNext[l][m] != eachJumpNext[m] ){
              break;
            }
          }
          //完全匹配，标记为归到同一组
          if (m === eachJumpNext.length) {
            belongTo.push(l);
            break;
          }
        }

        //找不到匹配项，要分为新的一类
        if( l === jumpNext.length ){
          jumpNext.push( eachJumpNext );
          belongTo.push( jumpNext.length - 1 );
        }
      }

      //  大于1，说明有不同的分组，要进行拆分、删除、添加
      if (jumpNext.length > 1) {
        var toBeRemove = new Array();

        for( var j = 1 ; j < jumpNext.length ; j ++ ){
          var toBeRemoveTerm = new Array();
          for( var k = 0 ; k < belongTo.length ; k++ ){
            if( belongTo[k] == j ){
              toBeRemoveTerm.push(res[i][k]);
            }
          }
          toBeRemove.push(toBeRemoveTerm);
        }

        for( var l = 0 ; l < toBeRemove.length ; l ++ ){
          for( var m = 0 ; m < toBeRemove[l].length ; m++ ){
            var index = res[i].indexOf( toBeRemove[l][m] );
            res[i].splice( index , 1 );
          }
          res.push(toBeRemove[l]);
        }
        i = 0 ;
        break;
      }
    }

    if( i == res.length ){
      break;
    }
  }

  //找到开始状态,并将它移动到res数组的最开始位置
  for( var i = 0 ; i < res.length ; i ++ ){
    var startStateIndex = res[i].indexOf(0)
    if(startStateIndex != -1 ){
      if( i != 0 ){
        var startStateArray = res.splice(i,1);
        res.unshift( startStateArray[0] );
      }
      break;
    }
  }
  // 去掉可能出现为空的状态集合
  for( var i = 0 ; i < res.length ; i++ ){
    if (res[i].length===0){
      res.splice(i,1);
    }
  }

  //对新分好的分组构建状态转化流数组，即resStateTrans
  for( var i = 0 ; i < res.length ; i ++ ){
    for( var j = 0 ;  j < alphabets.length ; j ++ ){
      var goToState = judge_next(res,res[i][0],alphabets[j],stateTransitions)
      if( goToState != -1 ){
        var newStateTransition = new StateTransition( i , alphabets[j] , goToState )
        resStateTrans.push(newStateTransition);
      }
    }
  }

  //构建新的acceptStateList
  for( var i = 0 ; i < acceptStates.length ; i++ ){
    for( var j = 0 ; j < res.length ; j ++ ){
      if( res[j].indexOf(acceptStates[i].state) !== -1 ){
        var k = 0;
        for( ; k < resAcceptStateList.length ; k++ ){
          if( acceptStates[i].REId === resAcceptStateList[k].REId && j === resAcceptStateList[k].state){
            break;
          }
        }
        if( k == resAcceptStateList.length ){
          var newAcceptState = new AcceptStateList(j,acceptStates[i].REId);
          // console.log(resAcceptStateList.indexOf( newAcceptState ));
          resAcceptStateList.push(newAcceptState);
        }
        break;
      }
    }
  }
  return { stateTransition:resStateTrans , alphabet:alphabets , acceptStateList:resAcceptStateList};
}
