var stateTransition1=function(s,i,e){
  this.startState=s;
  this.inputChar=i;
  this.endState=e;
  this.printStateTransition1=printStateTransition1
}
function printStateTransition1 (){
  console.log(this.startState,this.inputChar,this.endState)
}
export
