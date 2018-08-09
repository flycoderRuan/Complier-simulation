var express = require('express');
var generateNFA =require("./generateDFA");
var router = express.Router();
module.exports = function(nfa) {
  for(var i=0;i<nfa.alphabet.length;i++){
    if(nfa.alphabet[i]=="ε"){
      nfa.alphabet[i]=nfa.alphabet[nfa.alphabet.length-1];
      nfa.alphabet[nfa.alphabet.length-1]="ε"
      break;
    }
  }
  //console.log("1111111",nfa.alphabet)
  var nfa_tran_t =
    {
      nfa_tran_table: nfa.stateTransition,
      alphabet: nfa.alphabet,
      acceptState: nfa.acceptStateList
    }

  //   console.log("nfa_tran_table",nfa_tran_t.nfa_tran_table);
  // console.log("acceptState",nfa_tran_t.acceptState);
  //   console.log("nfa.stateTransition:",nfa.stateTransition);
  function AcceptState(s, id) {
    this.state = s;
    this.REId = id;
  }

  function StateTransition(s, i, e) {
    this.startState = s
    this.inputChar = i
    this.endState = e
//  this.printStateTransition=printStateTransition;
  }

  function dfa_mid_StateTransition(s, i, e) {
    this.startState = s
    this.inputChar = i
    this.endState = e
  }

  var dfaAcceptState = new Array();
  var dfaAcceptStateFinal = new Array();
  var nfaAlphabet = []
  for (i = 0; nfa_tran_t.alphabet[i] != undefined; i++) {
    if (nfa_tran_t.alphabet[i] != 'ε') nfaAlphabet.push(nfa_tran_t.alphabet[i]);
  }

  var nfa_tran = [];
//将table的内容读成转换流：
  for (i = 0; nfa_tran_t.nfa_tran_table[i] != undefined; i++) {
    nfa_tran[nfa_tran.length] = new StateTransition(nfa_tran_t.nfa_tran_table[i].startState, nfa_tran_t.nfa_tran_table[i].inputChar, nfa_tran_t.nfa_tran_table[i].endState);
  }
  //console.log("nfa_tran",nfa_tran);
  var state_num = 0;
  for (i = 0; nfa_tran[i] != undefined; i++) {
    if (nfa_tran[i].endState > state_num) {
      state_num = nfa_tran[i].endState;
    }
    if (nfa_tran[i].endState > state_num) {
      state_num = nfa_tran[i].endState;
    }
  }
// console.log("state_num:"+state_num+1);

// console.log("nfa转换流：");
// console.log(nfa_tran[1].endState);

  var EClosure = new Array();
// console.log(EClosure);
// console.log(nfa_tran_t.nfa_tran_table);
//计算闭包：
//console.log();
//console.log(EClosure[0]);
  function getEClosure(nfatran, eclosure, state_num) {

    for (var k = 0; k < state_num; k++) {
      Etemp = [];
      // console.log(eclosure)
      for (i = 0; Etemp[i] != undefined; i++) {
        Etemp[i] = undefined;
      }//清空Etemp
      Etemp[0] = k;
      j = 0;
      while (Etemp[j] != undefined) //找新闭包
      {
        for (i = 0; nfatran[i] != undefined; i++)//查看每条边，先找iεX
        {
          if (nfatran[i].startState == Etemp[j] && nfatran[i].inputChar == 'ε') {
            //判断是否将新状态放入Etemp
            for (var n = 0; Etemp[n] != undefined; n++) {
              if (Etemp[n] == nfatran[i].endState) {
                break;
              }
              else if (Etemp[n + 1] == undefined) {
                Etemp[n + 1] = nfatran[i].endState;
              }
            }

          }
        }
        j++;
      }
      //排列闭包
      for (i = 0; Etemp[i] != undefined; i++) {
        var min = i;
        for (var j = i; Etemp[j] != undefined; j++) {
          if (Etemp[j] < Etemp[min]) {
            min = j;
          }
        }
        temp = Etemp[min];
        Etemp[min] = Etemp[i];
        Etemp[i] = temp;

      }
      //最后导入
      eclosure.push(Etemp);
      //console.log(k+":")
      //console.log(eclosure[k]);
    }
    return eclosure
  }
state_num+=1;
   //console.log("state_num",state_num)
  EClosure = getEClosure(nfa_tran, EClosure, state_num);
//console.log("EClosure",EClosure);

  var dfa_mid = new Array();

  function getDFA(eclosure, dfa_mid, nfa_tran, alphabet) {

    var Eadd = new Array();
    var EaddN = 0;
    var dfa_tran_num = 0;
    dfa_mid[dfa_tran_num] = new dfa_mid_StateTransition(eclosure[0], undefined, undefined)//dfa初始状态为0的闭包
    var dfa_start_state = new Array();
    dfa_start_state.push(eclosure[0]);
    //console.log("dfa_start_state[0]");
    //console.log(dfa_mid);

    for (var num = 0;dfa_start_state[num]!=undefined; num++)//开始计算move（A，a），move（A,b）......dfa_start_state[num]!=undefined
    {
      // console.log("dfa_start_state[num]",dfa_start_state[num]);
      for (var c = 0; alphabet[c] != 'ε'&&alphabet[c] != undefined; c++)//每个转换条件都计算一遍
      {

        var newEState = new Array();
        for (var i = 0; dfa_start_state[num][i] != undefined; i++)//从dfa一个新集合开始（0的闭包开始）
        {
          for (var j = 0; nfa_tran[j] != undefined; j++)//循环每条nfa转换
          {
            if (nfa_tran[j].startState == dfa_start_state[num][i] && nfa_tran[j].inputChar == alphabet[c]) {
              ////
              if(newEState.length==0){newEState.push(nfa_tran[j].endState);}
              for (var k = 0; k < newEState.length; k++) {
                if (newEState[k] == nfa_tran[j].endState) {
                  break;
                }
                else if (k == newEState.length - 1) {
                  newEState.push(nfa_tran[j].endState);
                }//没出现过的新单状态
              }
              ////
            }
          }
        }
        //console.log("newEState",newEState);

        //闭包相加
        var tempEadd = new Array();

        for (i = 0; newEState[i] != undefined; i++) {
          var state = newEState[i];
          for (j = 0; eclosure[state][j] != undefined; j++) {
            tempEadd.push(eclosure[state][j]);
          }
        }

        //闭包相加后对闭包进行排序
        for(var k=0;k<tempEadd.length;k++)
        {
          var min=k
          for(var q=k+1;q<tempEadd.length;q++)
          {
            if(tempEadd[min]>tempEadd[q])
            {
              min=q;
            }
          }
          var temp= tempEadd[k]
          tempEadd[k]=tempEadd[min]
          tempEadd[min]=temp
        }

        Eadd.push(tempEadd);
        //console.log("tempEadd", tempEadd);
        EaddN++;

        //判断是否为新状态
        if (tempEadd[0] != undefined)
        {
          dfa_mid[dfa_tran_num] = new dfa_mid_StateTransition(dfa_start_state[num], alphabet[c], tempEadd);
          var isadd = 1;
          for (i = 0; dfa_start_state[i] != undefined; i++) {
            for (j = 0; Eadd[EaddN - 1][j] != undefined; j++) {
              if (Eadd[EaddN - 1][j] != dfa_start_state[i][j]) {
                break;
              }
              else if(Eadd[EaddN - 1][j + 1] == undefined && dfa_start_state[i][j + 1] == undefined){isadd=0;break;}
            }
          }
          //console.log("dfa_start_state[num]",dfa_start_state[num]);
          if (isadd == 1) {
            dfa_start_state.push(tempEadd);
            //console.log("dfa_start_state[num]",dfa_start_state[num]);
            // console.log("下一个",dfa_start_state[num+1]);
          }
          // console.log("isadd:", isadd);
          dfa_tran_num++;
        }

      }
    }
    return dfa_mid;
  }
  dfa_mid = getDFA(EClosure, dfa_mid, nfa_tran, nfa_tran_t.alphabet);
 //console.log("test");
 //console.log("dfa_mid",dfa_mid);


  var dfa_tran = new Array();

  function getDFA2(dfa_mid, dfa_tran) {
    var state = new Array();
    var isin=0;
    for (i = 0; dfa_mid[i] != undefined; i++)
    {
      isin=0;
      if (i == 0)
      {
        state.push(dfa_mid[i].startState)
      }
      else {
        for(j=0;state[j]!=undefined;j++)
        {
          for(k=0;state[j][k]!=undefined;k++)
          {
            if(state[j][k]!=dfa_mid[i].startState[k]){break;}
            if(state[j][k]==dfa_mid[i].startState[k])
            {
              if(state[j][k+1]==undefined&&dfa_mid[i].startState[k+1]==undefined)
              {
                 isin=1;
              }
            }
          }
        }
        if(isin!=1){state.push(dfa_mid[i].startState);}
      }

    }

    //endState编号
    for (i = 0; dfa_mid[i] != undefined; i++)
    {
      isin=0;
        for(j=0;state[j]!=undefined;j++)
        {
          for(k=0;state[j][k]!=undefined;k++)
          {
            if(state[j][k]!=dfa_mid[i].endState[k]){break;}
            if(state[j][k]==dfa_mid[i].endState[k])
            {
              if(state[j][k+1]==undefined&&dfa_mid[i].endState[k+1]==undefined)
              {
                isin=1;
              }
            }
          }
        }
        if(isin!=1){state.push(dfa_mid[i].endState);}
      }




    //console.log("state",state);
    for (i = 0; dfa_mid[i] != undefined; i++) {
      var start = -1;
      var end = -1;
      for (j = 0; state[j] != undefined; j++) {
        if (dfa_mid[i].startState == state[j]) {
          start = j;
        }
      }
      for (j = 0; state[j] != undefined; j++) {
        for (k = 0; state[j][k] != undefined; k++) {
          if (dfa_mid[i].endState[k] != state[j][k]) {
            break;
          }
          if (dfa_mid[i].endState[k] == state[j][k] && state[j][k + 1] == undefined&&dfa_mid[i].endState[k+1]==undefined) {
            end = j;
          }
        }
      }

      dfa_tran[i] = new StateTransition(start, dfa_mid[i].inputChar, end);

    }
    for (bet = 0; nfa_tran_t.acceptState[bet] != undefined; bet++) {
      for (s = 0; state[s] != undefined; s++) {
        for (ss = 0; state[s][ss] != undefined; ss++) {
          if (state[s][ss] == nfa_tran_t.acceptState[bet].state) {
            dfaAcceptState[dfaAcceptState.length] = new AcceptState(s, nfa_tran_t.acceptState[bet].REId);
          }
        }
      }
    }


    for(var i=0;i<dfaAcceptState.length;i++)//遍历要去多余的表
    {
      if(i==0){dfaAcceptStateFinal.push(dfaAcceptState[0])}//默认先弹入dfaAcceptState的第一条到dfaAcceptStateFinal
      else
        {//判断遍历到的dfaAcceptState是否有相同的state在dfaAcceptTableFinal里,并记录是哪条dfaAcceptStateFinal
          var isin=0
          var updateState=0
          for(var j=0;j<dfaAcceptStateFinal.length;j++)
          {
            if(dfaAcceptStateFinal[j].state==dfaAcceptState[i].state){isin=1;whichState=j;break;}
          }
          if(isin==1)
          {//如果有则判断REid大小，将较小的REid更新到dfaAcceptTableFinal里
            if(dfaAcceptStateFinal[updateState].REId>dfaAcceptState[i].REId){dfaAcceptStateFinal[updateState].REId=dfaAcceptState[i].REId;}
          }
           else//如果没有则push
          {
            dfaAcceptStateFinal.push(dfaAcceptState[i]);
          }
        }
    }
    // console.log("state:");
    // console.log(state);
    return dfa_tran;
  }

  dfa_tran = getDFA2(dfa_mid, dfa_tran);
// console.log(dfa_tran);


  var result = {
    stateTransition: dfa_tran,
    alphabet: nfaAlphabet,
    acceptStateList: dfaAcceptStateFinal
  }
  console.log("00000000000000000000000000000");
  console.log(result);
  return result;
}

// console.log("result.dfa_tran");
// console.log(result.dfa_tran);
// console.log("result.nfaAlphabet");
// console.log(result.nfaAlphabet);
// console.log("result.nfaAcceptState");
// console.log(result.nfaAcceptState);
