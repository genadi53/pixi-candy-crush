import { Container,Graphics, Sprite, Text, } from 'pixi.js';
import gsap from 'gsap/all';


const COLOR = 0xFFA500;

export default class Button extends Container{
    constructor(){
        super();
        this.name = 'button';
        this._button = new Graphics();
        this._text =  new Text('PRESS SPACE TO PLAY AGAIN');

        this._createButton();
    }

    
    /**
     *  @description Sets the properties of the Button and its text
     *  @private
     */
  _createButton(){

    this._button.lineStyle(5, COLOR, 1);
    this._button.beginFill(COLOR, 0);
    this._button.drawRoundedRect(-190, 200, 380, 50, 55);
    this._button.endFill();

    this._text.style = {
      fill: COLOR,
      fontSize: 20,
      fontStyle: 'bold'
    };

    this._text.name = 'buttonText';
    this._text.anchor.set(0.5);
    this._text.y = 225;

    this.addChild(this._button, this._text);
  }

}