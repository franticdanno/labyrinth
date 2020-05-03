export default class  KeyboardManager {

  constructor(){
    this._keys = {}
  }

  // This will hold all of the keys and their stat
  IsKeyDown = (key) => {
    return this._keys[key] ? this._keys[key].isDown : false;
  }

  IsKeyUp = (key) => {
    return this._keys[key] ? !this._keys[key].isDown : true;
  }

  // Listen out for key up / downs
  Setup = () => {
    window.addEventListener("keydown",(e)=>{
      if(this._keys[e.key] == null) this._keys[e.key] = {};
      this._keys[e.key].isDown = true;
    },false);

    window.addEventListener("keyup",(e)=>{
      this._keys[e.key].isDown = false;
    },false)
  }

}
