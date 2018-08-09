// generateNFA.test.js
var generateNFA = require('../api/lexical/generateNFA.js');
var ST = generateNFA.ST;
var alphabet = generateNFA.alphabet;
var AcceptStateList=generateNFA.AcceptStateList;
var tool = require('../api/lexical/tool.js');
var expect = require('chai').expect;

function ST_sort(a,b){
	if (a.startState === b.startState) {
            return a.endState - b.endState;
    } else {
            return a.startState - b.startState;
    }
}

function ASL_sort(a,b){
	if (a.state === b.state) {
            return a.REId - b.REId;
    } else {
            return a.state - b.state;
    }
}

//第一组测试，正常输入情况，RE比较简单，单接受状态
var re_0 = ['abc|d'];
var NFA_0 = new generateNFA(re_0);
var stateTransitions_0 = new Array();
var acceptStates_0 = new Array();
var edge1 = new ST(0,'ε',1);
var edge2 = new ST(1,'a',2);
var edge3 = new ST(2,'ε',3);
var edge4 = new ST(3,'b',4);
var edge5 = new ST(4,'ε',5);
var edge6 = new ST(5,'c',6);
var edge7 = new ST(6,'ε',9);
var edge8 = new ST(0,'ε',7);
var edge9 = new ST(7,'d',8);
var edge10 = new ST(8,'ε',9);
stateTransitions_0.push(edge1,edge2,edge3,edge4,edge5,edge6,edge7,edge8,edge9,edge10);
var alphabet_0 = ['ε','a','b','c','d'];
var acceptState=new AcceptStateList(9,0);
acceptStates_0.push(acceptState);
describe('NFA生成测试1', function(){
	it('状态转换流测试',function(){
		expect(NFA_0.stateTransition.sort(ST_sort)).to.be.deep.equal(stateTransitions_0.sort(ST_sort));
	});
	it('字母表测试',function(){
		expect(NFA_0.alphabet.sort()).to.be.deep.equal(alphabet_0.sort());
	});
	it('接受状态测试',function(){
		expect(NFA_0.acceptStateList.sort(ASL_sort)).to.be.deep.equal(acceptStates_0.sort(ASL_sort));
	});
});

//附：测试的基本格式
var re_1 = ['a'];
var NFA_1 = new generateNFA(re_1);
var stateTransitions_1 = new Array();
var acceptStates_1 = new Array();
var edge1 = new ST(0,'a',1);
stateTransitions_1.push(edge1);
var alphabet_1 = ['a'];
var acceptState=new AcceptStateList(1,0);
acceptStates_1.push(acceptState);
describe('NFA生成测试2', function(){
	it('状态转换流测试',function(){
		expect(NFA_1.stateTransition.sort(ST_sort)).to.be.deep.equal(stateTransitions_1.sort(ST_sort));
	});
	it('字母表测试',function(){
		expect(NFA_1.alphabet.sort()).to.be.deep.equal(alphabet_1.sort());
	});
	it('接受状态测试',function(){
		expect(NFA_1.acceptStateList.sort(ASL_sort)).to.be.deep.equal(acceptStates_1.sort(ASL_sort));
	});
});
//第二组测试，非正常输入情况，测试算法是否能发现RE中的错误
var re_2 = ['()'];
try{
var NFA_2 = new generateNFA(re_2);
describe('NFA生成测试', function(){
	it('状态转换流测试',function(){
		expect(NFA_2.StateTransition).to.be.undefined;
	});
	it('字母表测试',function(){
		expect(NFA_2.alphabet).to.be.undefined;
	});
	it('接受状态测试',function(){
		expect(NFA_2.AcceptStateList).to.be.undefined;
	});
});
}catch(error){
console.log('该正则表达式为非法输入，测试结束');
};
//第一组测试，正常输入情况，RE比较简单，多接受状态
var re_3 = ['a','b','c'];
var NFA_3 = new generateNFA(re_3);
var stateTransitions_3 = new Array();
var acceptStates_3 = new Array();
var edge1 = new ST(0,'ε',1);
var edge2 = new ST(1,'a',2);
var edge3 = new ST(0,'ε',3);
var edge4 = new ST(3,'b',4);
var edge5 = new ST(0,'ε',5);
var edge6 = new ST(5,'c',6);
/*var edge7 = new ST(0,'ε',5);
var edge8 = new ST(5,'c',6);
var edge9 = new ST(6,'ε',7);
/*var edge10 = new ST(7,'c',8);*/
stateTransitions_3.push(edge1,edge2,edge3,edge4,edge5,edge6);
var alphabet_3 = ['ε','a','b','c'];
var acceptState1=new AcceptStateList(2,0);
var acceptState2=new AcceptStateList(4,1);
var acceptState3=new AcceptStateList(6,2);
acceptStates_3.push(acceptState1,acceptState2,acceptState3);
describe('NFA生成测试3', function(){
	it('状态转换流测试',function(){
		expect(NFA_3.stateTransition.sort(ST_sort)).to.be.deep.equal(stateTransitions_3.sort(ST_sort));
	});
	it('字母表测试',function(){
		expect(NFA_3.alphabet.sort()).to.be.deep.equal(alphabet_3.sort());
	});
	it('接受状态测试',function(){
		expect(NFA_3.acceptStateList.sort(ASL_sort)).to.be.deep.equal(acceptStates_3.sort(ASL_sort));
	});
});

//第三组测试，边界值输入情况，测试算法的能力
//该单元测试无边界值输入，边界值测试在生成NFA处
//exports.StateTransition= StateTransition;
//exports.AcceptStateList=AcceptStateList;
//exports.generateNFA = generateNFA;

