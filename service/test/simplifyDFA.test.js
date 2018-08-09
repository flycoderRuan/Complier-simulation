var simplifyDFA =require('../api/lexical/simplifyDFA');
var StateTransition=simplifyDFA.StateTransition;
var AcceptStateList=simplifyDFA.AcceptStateList
var tool = require('../api/lexical/tool.js');
var expect = require('chai').expect;
var assert = require('assert');


//第一组测试，正常输入情况，DFA比较简单
var re = ['a|b']
var stateTransitions_1 = new Array();
var acceptStates_1 = new Array();
var edge1=new StateTransition(0,'a',1);
var edge2=new StateTransition(0,'b',1);
stateTransitions_1.push(edge1,edge2);
var acceptState=new AcceptStateList(1,1);
acceptStates_1.push(acceptState);
var res1=new simplifyDFA({stateTransition:stateTransitions_1 ,alphabet: ['a','b'] ,acceptStateList: acceptStates_1} );
describe('DFA化简简单测试',function(){
	it('状态转换流的测试',function(){
		expect(res1.stateTransition).to.be.equal(stateTransitions_1);
	});
	it('字母表的测试',function(){
		assert.deepEqual(res1.alphabet,['a','b']);
	});
	it('接受状态的测试',function(){
		expect(res1.acceptStates).to.be.equal(acceptStates_1);
	});
});

//第二组测试，非正常输入情况，不符合分割法的要求，验证改进后的K次划分法
var stateTransitions = new Array();
var acceptStates = new Array();

var term = new StateTransition( 0 , 'a' , 1 );
var term1 = new StateTransition( 0 , 'b' , 2 );
var term2 = new StateTransition( 1 , 'a' , 3 );
var term3 = new StateTransition( 1 , 'b' , 2 );
var term4 = new StateTransition( 2 , 'a' , 1 );
var term5 = new StateTransition( 2 , 'b' , 4 );
var term6 = new StateTransition( 3 , 'a' , 3 );
var term7 = new StateTransition( 3 , 'b' , 5 );
var term8 = new StateTransition( 4 , 'a' , 6 );
var term9 = new StateTransition( 4 , 'b' , 5 );
var term10 = new StateTransition( 5 , 'a' , 6 );
var term11 = new StateTransition( 6 , 'b' , 5 );
var term12 = new StateTransition( 6 , 'a' , 3 );

stateTransitions.push( term , term1 ,term2, term3 , term4 , term5 , term6 , term7, term8 , term9 ,term10,term11,term12);

var acceptTerm = new AcceptStateList( 3 , 1 );
var acceptTerm2 = new AcceptStateList( 4 , 1 );
var acceptTerm3 = new AcceptStateList( 5 , 1 );
var acceptTerm4 = new AcceptStateList( 6 , 1 );

acceptStates.push(acceptTerm , acceptTerm2 ,acceptTerm3 , acceptTerm4);

var res = new simplifyDFA({stateTransition:stateTransitions ,alphabet: ['a','b'] ,acceptStateList: acceptStates} );
console.log(res)
// var stateTrans = res.resStateTrans;
// var alphabets = res.alphabets;
// var acceptStates = res.acceptStates;

var stateTransitions_test = new Array();
var acceptStates_test = new Array();

var term_test = new StateTransition( 0 , 'a' , 1 );
var term1_test = new StateTransition( 0 , 'b' , 2 );
var term2_test = new StateTransition( 1 , 'a' , 3 );
var term3_test = new StateTransition( 1 , 'b' , 2 );
var term4_test = new StateTransition( 2 , 'a' , 1 );
var term5_test = new StateTransition( 2 , 'b' , 3 );
var term6_test = new StateTransition( 3 , 'a' , 4 );
var term7_test = new StateTransition( 3 , 'b' , 3 );
var term8_test = new StateTransition( 4 , 'a' , 3 );
stateTransitions_test.push(term_test,term1_test,term2_test,term3_test,term4_test,term5_test,term6_test,term7_test,term8_test);

var acceptTerm_test = new AcceptStateList( 3 , 1 );
var acceptTerm1_test = new AcceptStateList( 4 , 1 );
acceptStates_test.push(acceptTerm_test,acceptTerm1_test);

describe('DFA化简分割法不适用测试',function(){
	it('状态转换流的测试',function(){
		expect(res.stateTransition).to.be.equal(stateTransitions_test);
	});
	it('字母表的测试',function(){
		assert.deepEqual(res.alphabet,['a','b']);
		// var alp=['a','b'];
		// expect(res.alphabets).to.be.equal(alp);
	});
	it('接受状态的测试',function(){
		expect(res.acceptStates).to.be.equal(acceptStates_test);
	});
});

//第三组测试，边界值输入情况，测试算法的能力
//该单元测试无边界值输入，边界值测试在生成NFA处
//exports.StateTransition= StateTransition;
//exports.AcceptStateList=AcceptStateList;
//exports.simplifyDFA = simplifyDFA;
