function KeyboardManager(){

  // This will hold all of the keys and their state
  this.keys = {}

  this.isKeyDown = function(key){
    return this.keys[key] ? this.keys[key].isDown : false;
  }

  this.isKeyUp = function(key){
    return this.keys[key] ? !this.keys[key].isDown : true;
  }

  // Listen out for key up / downs
  this.setup = () => {
    window.addEventListener("keydown",(e)=>{
      if(this.keys[e.key] == null) this.keys[e.key] = {};
      this.keys[e.key].isDown = true;
    },false);

    window.addEventListener("keyup",(e)=>{
      this.keys[e.key].isDown = false;
    },false)
  }

}

export KeyboardManager;
