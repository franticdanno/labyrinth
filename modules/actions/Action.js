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
    console.log("Adding action", action);
    this._actions.push(action);
    return this;
  }

}

export class ParallelAction extends CompositeAction {

  constructor(){
    super();
  }

  Update = (delta) => {

    // Update all actions
    this._actions.forEach((item, i) => {
      item.Update(delta);
    });

    // Remove any actions that are finished
    this._actions = this._actions.filter((action)=>{
        return action._isFinished == true;
    })

    this._isFinished = (this._actions.length == 0); // Only finished if all actions are finished

  }
}

export class SequenceAction extends CompositeAction {

  constructor(){
    super();
  }

  Update = (delta) => {

    if(this._actions.length > 0){

      this._actions[0].Update(delta);

      if(this._actions[0]._isFinished){
        console.log("Finished?",this._actions[0]._isFinished);
        this._actions.shift()
      }

    }

    // This action is only finished if the length is now 0
    this._isFinished = this._actions.length == 0;
  }
}
