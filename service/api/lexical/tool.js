var DFA= function(test){
  this.StateTransition=test.stateTransition
  this.alphabet=test.alphabet
  this.acceptStateList=test.acceptStateList
  this.state=0
  // this.start=0
  this.new_state=0
  this.set_state=set_state
  this.stateTable=[]
  this.StateTransitionTable=[]
  this.generateTransitionTable=generateTransitionTable
  this.generateStateTable=generateStateTable
  this.generateStateTable1=generateStateTable1
  this.updateStateTransition=updateStateTransition

  // this.updateNFA=updateNFA;
  // this.generateStateTable=generateStateTable
  // this.generateStateTable1=generateStateTable1
}
function set_state(){
  var max=0
  for(var i=0;i<this.StateTransition.length;i++){
    if(max<this.StateTransition[i].endState){
      max=this.StateTransition[i].endState
    }
  }
  for(var i=0;i<this.StateTransition.length;i++){
    if(max<this.StateTransition[i].startState){
      max=this.StateTransition[i].startState
    }
  }
  this.state=max+1;
}
function generateStateTable() {
  this.set_state()
  for(var i=0;i<this.state;i++){
    this.stateTable[this.stateTable.length]=-1
  }
  //console.log(this.stateTable)
  this.stateTable[0]=0
  var start=this.start
  for(var i=0;i<this.stateTransition.length;i++){
    if(this.stateTransition[i].startState==start&&this.stateTable[this.stateTransition[i].endState]==-1){
      this.stateTable[this.stateTransition[i].endState]=this.new_state;
      this.new_state++;
      this.generateStateTable1(this,this.stateTransition[i].endState)
    }
  }
 // console.log(this.stateTable)
}
function generateStateTable1(self,start) {
  for(var i=0;i<self.stateTransition.length;i++){
    if(self.stateTransition[i].startState==start&&self.stateTable[self.stateTransition[i].endState]==-1){
      self.stateTable[self.stateTransition[i].endState]=self.new_state;
      self.new_state++;
      self.generateStateTable1(self,self.stateTransition[i].endState)
    }
  }
}
function updateStateTransition(){
  for(var i=0;i<this.stateTransition.length;i++){
    this.stateTransition[i].startState=this.stateTable[this.stateTransition[i].startState]
    this.stateTransition[i].endState=this.stateTable[this.stateTransition[i].endState]
  }
  for(var i=0;i<this.acceptStateList.length;i++){
    this.acceptStateList[i].state=this.stateTable[this.acceptStateList[i].state]
  }
}
function generateTransitionTable(){
  this.set_state()
  for(var i=0;i<this.state;i++){
    var vector2=[]
    for(var j=0;j<this.alphabet.length;j++){
      var vector1=[]
      vector2[vector2.length]=vector1
    }
    this.StateTransitionTable[this.StateTransitionTable.length]=vector2
  }
  //console.log(this.StateTransitionTable)
  for(var i=0;i<this.StateTransition.length;i++){
    var input =0
    for(var j=0;j<this.alphabet.length;j++){
      if(this.alphabet[j]==this.StateTransition[i].inputChar){input=j;break}
    }
    this.StateTransitionTable[this.StateTransition[i].startState][input][this.StateTransitionTable[this.StateTransition[i].startState][input].length]=this.StateTransition[i].endState

  }
}
module.exports=function(test){
  //console.log(test)
  var temp=new  DFA(test)

  temp.generateStateTable()
  temp.updateStateTransition()

  temp.generateTransitionTable()
  return temp.StateTransitionTable
}

function generateStateTable(){
  this.set_state()
  for(var i=0;i<this.state;i++){
    this.stateTable[i]=-1;
  }
  this.stateTable[0]=this.new_state;
  this.new_state++;
  var start=0;
  for (var i=0;i<this.StateTransition.length;i++){
    if(this.StateTransition[i].startState==start&&this.stateTable[this.StateTransition[i].endState]==-1){
      this.stateTable[this.StateTransition[i].endState]=this.new_state;
      this.new_state++;
      this.generateStateTable1(this,this.StateTransition[i].endState)
    }
  }

}
function generateStateTable1(self,start){
  for (var i=0;i<self.StateTransition.length;i++){
    if(self.StateTransition[i].startState==start&&self.stateTable[self.StateTransition[i].endState]==-1){
      //console.log(self.StateTransition[i].endState)
      self.stateTable[self.StateTransition[i].endState]=self.new_state;
      self.new_state++;
      self.generateStateTable1(self,self.StateTransition[i].endState)
    }

  }

}
function updateStateTransition(){
  for(var i=0;i<this.StateTransition.length;i++){
    this.StateTransition[i].startState=this.stateTable[this.StateTransition[i].startState]
    this.StateTransition[i].endState=this.stateTable[this.StateTransition[i].endState]
  }
  for(var i=0;i<this.acceptStateList.length;i++){
    this.acceptStateList[i].state=this.stateTable[this.acceptStateList[i].state]
  }
}
