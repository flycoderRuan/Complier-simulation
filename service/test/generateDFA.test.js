// generateDFA.test.js
var generateDFA = require('../api/lexical/generateDFA.js');
var generateNFA = require('../api/lexical/generateNFA.js');

var ST = generateNFA.ST;
var AcceptStateList=generateNFA.AcceptStateList;
var tool = require('../api/lexical/tool.js');
var expect = require('chai').expect;

function AcceptState(s, id) {
    this.state = s;
    this.REID = id;
}
function StateTransition(s, i, e) {
    this.startState = s
    this.inputChar = i
    this.endState = e
}
function ST_sort(a,b){
	if (a.startState === b.startState) {
            return a.endState - b.endState;
    } else {
            return a.startState - b.startState;
    }
}

function AS_sort(a,b){
	if (a.state === b.state) {
            return a.REId - b.REId;
    } else {
            return a.state - b.state;
    }
}


//第一组测试，正常输入情况，NFA比较简单，作为范例
var re_0 = ['a|b'];
var stateTransitions_0 = new Array();
var acceptStates_0 = new Array();
var edge1=new ST(0,'ε',1);
var edge2=new ST(1,'a',2);
var edge3=new ST(2,'ε',5);
var edge4=new ST(0,'ε',3);
var edge5=new ST(3,'b',4);
var edge6=new ST(4,'ε',5);
stateTransitions_0.push(edge1,edge2,edge3,edge4,edge5,edge6);
var acceptState=new AcceptStateList(5,0);
acceptStates_0.push(acceptState);

var dfa_ST = new Array();
var dfa_AS = new Array();
var d_edge1=new StateTransition(0,'a',1);
var d_edge2=new StateTransition(0,'b',2);
dfa_ST.push(d_edge1,d_edge2);
var d_acceptState1=new AcceptState(1,0);
var d_acceptState2=new AcceptState(2,0);
dfa_AS.push(d_acceptState1,d_acceptState2);

var DFA_0=new generateDFA({stateTransition:stateTransitions_0 ,alphabet: ['ε','a','b'] ,acceptStateList: acceptStates_0});
describe('DFA生成测试1', function(){
	it('状态转换流测试',function(){
		expect(DFA_0.stateTransition.sort(ST_sort)).to.be.deep.equal(dfa_ST.sort(ST_sort));
	});
	it('字母表测试',function(){
		expect(DFA_0.alphabet.sort()).to.be.deep.equal(['a','b']);
	});
	it('接受状态测试',function(){
		expect(DFA_0.acceptStateList.sort(AS_sort)).to.be.deep.equal(dfa_AS.sort(AS_sort));
	});
});

//第一组测试，正常输入情况，NFA比较复杂
var re_1 = ['a','b*a'];
var stateTransitions_1 = new Array();
var acceptStates_1 = new Array();
var edge1=new ST(0,'ε',1);
var edge2=new ST(1,'a',2);
var edge3=new ST(0,'ε',3);
var edge4=new ST(3,'ε',4);
var edge5=new ST(4,'b',5);
var edge6=new ST(5,'ε',6);
var edge7=new ST(6,'ε',7);
var edge8=new ST(7,'a',8);
var edge9=new ST(5,'ε',4);
var edge10=new ST(3,'ε',6);
stateTransitions_1.push(edge1,edge2,edge3,edge4,edge5,edge6,edge7,edge8,edge9,edge10);
var acceptState1=new AcceptStateList(2,0);
var acceptState2=new AcceptStateList(8,1);
acceptStates_1.push(acceptState1,acceptState2);

var dfa_ST_1 = new Array();
var dfa_AS_1 = new Array();
var d_edge1=new StateTransition(0,'a',2);
var d_edge2=new StateTransition(0,'b',1);
var d_edge3=new StateTransition(1,'a',3);
var d_edge4=new StateTransition(1,'b',1);
dfa_ST_1.push(d_edge1,d_edge2,d_edge3,d_edge4);
var d_acceptState1=new AcceptState(2,0);
var d_acceptState2=new AcceptState(2,1);
var d_acceptState3=new AcceptState(3,1);
dfa_AS_1.push(d_acceptState1,d_acceptState2,d_acceptState3);

var DFA_1=new generateDFA({stateTransition:stateTransitions_1 ,alphabet: ['ε','a','b'] ,acceptStateList: acceptStates_1});
describe('DFA生成测试2', function(){
	it('状态转换流测试',function(){
		expect(DFA_1.stateTransition.sort(ST_sort)).to.be.deep.equal(dfa_ST_1.sort(ST_sort));
	});
	it('字母表测试',function(){
		expect(DFA_1.alphabet.sort()).to.be.deep.equal(['a','b']);
	});
	it('接受状态测试',function(){
		expect(DFA_1.acceptStateList.sort(AS_sort)).to.be.deep.equal(dfa_AS_1.sort(AS_sort));
	});
});

//第二组测试，非正常输入情况(无ε的NFA)
var stateTransitions_2 = new Array();
var acceptStates_2 = new Array();
var edge1=new ST(0,'a',1);
var edge2=new ST(0,'b',1);
stateTransitions_2.push(edge1,edge2);
var acceptState1=new AcceptStateList(1,0);
acceptStates_2.push(acceptState1);

var dfa_ST_2 = new Array();
var dfa_AS_2 = new Array();
var d_edge1=new StateTransition(0,'a',1);
var d_edge2=new StateTransition(0,'b',1);
dfa_ST_2.push(d_edge1,d_edge2);
var d_acceptState1=new AcceptState(1,0);
dfa_AS_2.push(d_acceptState1);
try{
var DFA_2=new generateDFA({stateTransition:stateTransitions_2 ,alphabet: ['ε','a','b'] ,acceptStateList: acceptStates_2});
describe('DFA生成测试3', function(){
	it('状态转换流测试',function(){
		expect(DFA_2.stateTransition.sort(ST_sort)).to.be.deep.equal(dfa_ST_2.sort(ST_sort));
	});
	it('字母表测试',function(){
		expect(DFA_2.alphabet.sort()).to.be.deep.equal(['a','b']);
	});
	it('接受状态测试',function(){
		expect(DFA_2.acceptStateList.sort(AS_sort)).to.be.deep.equal(dfa_AS_2.sort(AS_sort));
	});
});
}catch(error){
console.log('该NFA为非法输入，测试结束');
};
//第二组测试，非正常输入情况(不符合Thompson构造法的NFA)
var stateTransitions_3 = new Array();
var acceptStates_3 = new Array();
var edge1=new ST(0,'ε',1);
var edge2=new ST(1,'a',2);
var edge3=new ST(2,'ε',3);
var edge4=new ST(2,'ε',0);
stateTransitions_3.push(edge1,edge2,edge3,edge4);
var acceptState1=new AcceptStateList(3,0);
acceptStates_3.push(acceptState1);

var dfa_ST_3 = new Array();
var dfa_AS_3 = new Array();
var d_edge1=new StateTransition(0,'a',1);
var d_edge2=new StateTransition(1,'a',1);
dfa_ST_3.push(d_edge1,d_edge2);
var d_acceptState1=new AcceptState(1,0);
dfa_AS_3.push(d_acceptState1);
try{
var DFA_3=new generateDFA({stateTransition:stateTransitions_3 ,alphabet: ['ε','a'] ,acceptStateList: acceptStates_3});
describe('DFA生成测试4', function(){
	it('状态转换流测试',function(){
		expect(DFA_3.stateTransition.sort(ST_sort)).to.be.deep.equal(dfa_ST_3.sort(ST_sort));
	});
	it('字母表测试',function(){
		expect(DFA_3.alphabet.sort()).to.be.deep.equal(['a']);
	});
	it('接受状态测试',function(){
		expect(DFA_3.acceptStateList.sort(AS_sort)).to.be.deep.equal(dfa_AS_3.sort(AS_sort));
	});
});
}catch(error){
console.log('该NFA为非法输入，测试结束');
};
//第三组测试，边界值输入情况，测试算法的能力
//该单元测试无边界值输入，边界值测试在生成NFA处
//exports.StateTransition= StateTransition;
//exports.AcceptStateList=AcceptStateList;
//exports.generateDFA = generateDFA;
