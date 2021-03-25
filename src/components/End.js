import { Container, Graphics, Sprite, Text, Texture} from 'pixi.js';
import gsap from 'gsap/all';
import Label from './Label';
import Character from './Character';
import Button from './Button';

export default class End extends Container {
  constructor(result) {
    super();

    this.visible = true;

    this.interactive = true;
    //this.buttonMode = true;

    this._label = null;
    this._button = new Button();
    this._characters = [];
    this._xps = [];

    if(result === 'win'){
      this._label = new Label(result);
      this._createCharacters();
      
    } else if(result === 'fail'){
      this._label = new Label(result);
    } 

    this.addChild(this._label, this._button);
    this.on('keyup', () => this._handleClick());
    this.on('keydown', () => this._handleClick());
  }


  static get events(){
    return {
        RESTART: 'restart'
    }
  }

  /**
  *  @description check if the container is visible
  */
  async _handleClick() {

      if(this.visible){
        await this.hide();
        this.emit(End.events.RESTART);
      } else {
        await this.show();
      }
  }

   /**
    *  @description creates characters and xp Sprites and adds them to the scene
    *  @private
    */
    _createCharacters(){
      const character1 = new Character('characterLeft', 150, -275);
      character1.scale.set(0.6);
      character1.removeLibs();
  
  
      const character2 = new Character('characterMiddle', 200, -400);
      character2.scale.set(0.4);
      character2.removeLibs();
  
      const character3 = new Character('characterRight', 550, -280);
      character3.scale.set(0.75);
      character3.removeLibs();
  
  
      const xpRight = new Sprite(Texture.from('xp'));
      xpRight.name = 'xpRight';
      xpRight.anchor.set(0.5);
      xpRight.x = 375;
      xpRight.y = -215;
      xpRight.angle = 45;
      xpRight.scale.set(0.8);
  
      const xpMiddle = new Sprite(Texture.from('xp'));
      xpMiddle.name = 'xpMiddle';
      xpMiddle.anchor.set(0.5);
      xpMiddle.x = 130;
      xpMiddle.y = -475;
      xpMiddle.angle = 25;
      xpMiddle.scale.set(0.55);
  
      const xpLeft = new Sprite(Texture.from('xp'));
      xpLeft.name = 'xpLeft';
      xpLeft.anchor.set(0.5);
      xpLeft.x = -370;
      xpLeft.y = -265;
      xpLeft.angle = 150 + 180;
      xpLeft.scale.set(0.5);
  
      this._characters.push(character1, character2, character3);
      this._xps.push(xpLeft, xpMiddle, xpRight);
  
      this.addChild(xpRight, xpMiddle, xpLeft);
      this.addChild(character1, character2, character3);
    }  

 /**
  *  @description sets the visible property to true and alpha to 1
  */
  async show() {
    this.visible = true;
    await gsap.fromTo(this,
      { 
        alpha: 0 
      },
      {
        duration: 0.5,
        alpha: 1,
      }
    );
  }

  
 /**
  *  @description sets the visible property to false and alpha to 0
  */
  async hide() {
    this.visible = false;
    await gsap.fromTo(this, 
      { 
        alpha: 1 
      }, {
        alpha: 0, 
        duration: 0.5 
      });
  }

}