export class Action {

  constructor(){
    this._isFinished  = false;
  }

  Update       = (delta) => {}
}

export class CompositeAction extends Action {

  constructor(){
    super();
    this._actions = []
  }

  AddAction(action){
    if(this._actions == null) this._actions = []
    this._actions.push(action);
    return this;
  }

  AddActions(actions){
    for(let i=0; i < actions.length; i++){
      this.AddAction(actions[i])
    }
    return this;
  }

  StopAllActions(){
    if(this._actions != null){
      for(let i=0; i < this._actions.length; i++){
        this._actions[i]._isFinished = true;
      }
      this._actions = null;
    }
  }
}

export class ParallelAction extends CompositeAction {

  constructor(actions){
    super();

    // Add all actions to the existing action list
    if(actions!=null){
      this.AddActions(actions);
    }
  }

  Update = (delta) => {

    // Update all actions
    for(let actionIndex = 0; actionIndex < this._actions.length; actionIndex++){
      this._actions[actionIndex].Update(delta);
    }

    // Remove any actions that are finished
    this._actions = this._actions.filter((action,i,a)=>{
        return action._isFinished == false;
    })

    if(this._actions.length == 0){
      this._isFinished = true; // Only finished if all actions are finished
    }
  }
}

export class SequenceAction extends CompositeAction {

  constructor(actions){
    super();

    if(actions!=null){
      this.AddActions(actions);
    }

  }

  Update = (delta) => {

    if(this._actions.length > 0){

      if(this._actions[0]._isFinished){
        //console.log("Finished?",this._actions[0]._isFinished);
        this._actions.shift()
      } else {
        this._actions[0].Update(delta);
      }

    }

    // This action is only finished if the length is now 0
    this._isFinished = this._actions.length == 0;
  }
}
