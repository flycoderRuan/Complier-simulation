export { createEdges, createNodes }
import { NFALayout } from './nfaLayout'
import { DFALayout } from './dfaLayout'
function createEdges(transitionTable, alphabet, openPlug = true) {
  var Edges = []
  let _range = length => Array.from({ length }).map((v, k) => k)

  let transitable_hack = deepcopy(transitionTable);
  if (alphabet.indexOf('ε') != -1) {
    if (openPlug === true) transitable_hack = NFALayout(transitable_hack, alphabet)[0];
  } else {
    if (openPlug === true) transitable_hack = DFALayout(transitable_hack, alphabet)[0];
  }

  for (var fState of _range(transitionTable.length)) {
    for (var chIndex of _range(alphabet.length)) {
      for (var tState of transitionTable[fState][chIndex]) {
        if (transitable_hack[fState][chIndex].indexOf(tState) != -1) {
          //if (alphabet.indexOf('ε') != -1) console.log(`edge: from ${fState} to ${tState}, in transitable_hack`);
          Edges.push({ id: Edges.length, from: fState, to: tState, arrows: 'to', label: alphabet[chIndex] })
        } else {
          if (alphabet.indexOf('ε') != -1) console.log(`edge: from ${fState} to ${tState}, not in transitable_hack`);
          Edges.push({ id: Edges.length, from: fState, to: tState, arrows: 'to', label: alphabet[chIndex], smooth: { type: 'curvedCW', roundness: 0.5 } })
        }
      }
    }
  }
  Edges.push({ id: 10086, from: 10086, to: 0, arrows: 'to', label: 'Start' })
  return Edges
}
function createNodes(transitionTable, acceptState, alphabet) {
  var Nodes = []
  for (let i = 0; i < transitionTable.length; i++) {
    Nodes[i] = {
      id: i, label: i.toString()
    }
  }
  for (let i = 0; i < acceptState.length; i++) {
    Nodes[acceptState[i].state].borderWidth = 5
  }
  Nodes.push({ id: 10086, size: 0 })


  console.log('createnodes: ' + alphabet)
  if (alphabet.indexOf('ε') != -1) {
    let nodesLevelInfo = NFALayout(deepcopy(transitionTable), alphabet)[1];
    nodesLevelInfo.forEach((level, node) => {
      //console.log(`node: ${node}, level: ${level}`)
      Nodes[node]['level'] = level;
    })
    Nodes[Nodes.length - 1]['level'] = 0;
  } else {
    let nodesLevelInfo = DFALayout(deepcopy(transitionTable), alphabet)[1];
    nodesLevelInfo.forEach((level, node) => {
      console.log(`node: ${node}, level: ${level}`)
      Nodes[node]['level'] = level;
    })
    Nodes[Nodes.length - 1]['level'] = 0;
  }


  return Nodes
}
function deepcopy(arr) {
  /**
   * @description 实现多维数组的深复制
   */
  var out = [], i = 0, len = arr.length;
  for (; i < len; i++) {
    if (arr[i] instanceof Array) {
      out[i] = deepcopy(arr[i]);
    }
    else out[i] = arr[i];
  }
  return out;
}