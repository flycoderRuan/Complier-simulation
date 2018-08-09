function generateDFACode(dfa){
  var transTable = JSON.parse(JSON.stringify(dfa.transitionTable))
  for( var i = 0 ; i < transTable.length ; i++ ){
    for( var j = 0 ; j < transTable[i].length ; j++ ){
      if( transTable[i][j] == "" ){
        transTable[i][j] = -1
      }
    }
  }

  var kTransitionTableStr = ""
  var subStr1 = "Int kTransitionTable[kNumState][kNumSymbols] = {\n"
  var subStr2 = ""
  for( var i = 0; i < transTable.length ; i++ ){
    subStr2 += "    {" + transTable[i].toString() + "}"
    if( i != transTable.length ){
      subStr2 += ","
    }
    subStr2 += "\n"
  }
  subStr2 += "};\n"

  kTransitionTableStr = subStr1 + subStr2

  var kAcceptTableStr = "bool kAcceptTable[kNumStates] = {\n    "
  for( var i = 0 ; i < dfa.transitionTable.length ; i ++ ){
    if( isAcceptState(i,dfa.acceptStateList) ){
      kAcceptTableStr += "true"
    }else{
      kAcceptTableStr += "false"
    }

    if( i !== dfa.transitionTable.length ){
      kAcceptTableStr += ","
    }
  }
  kAcceptTableStr += "\n};\n"

  var simulateDFAStr = "bool simulateDFA( string input ){\n"
  simulateDFAStr += "    int state = 0;\n    for( int i = 0 ; i < input.length() ; i ++ )\n        if(kTransition[state][i] == -1)\n"
  simulateDFAStr += "            return false;\n        state = kTransition[state][ch];\n    return kAcceptTable[state];\n};\n"


  return kTransitionTableStr + kAcceptTableStr + simulateDFAStr
}

function isAcceptState( state , acceptStateList ){
  for( var i = 0 ; i < acceptStateList.length ; i ++ ){
    if(acceptStateList[i].state === state ){
      return true
    }
  }
  return false
}

module.exports = function(dfa) {
  return generateDFACode(dfa);
}
