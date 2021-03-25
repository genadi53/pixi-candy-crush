import { Container, Sprite, Texture } from 'pixi.js';
import GameBoard from './GameBoard';

let firstTime = true;

export default class ProgressBar extends Container{
    constructor(){
        super();
        this.name = 'progressBar';

        this._base = new Sprite(Texture.from('scoreBase'));
        this._base.name = 'barBase';
        this._base.anchor.set(0.5, 0);
        this._base.y = 425;
        this.addChild(this._base);
    
        this._right = new Sprite(Texture.from('loadingRight'));
        this._left = new Sprite(Texture.from('loadingLeft'));
        this._setBarEnds();

        this._xp = new Container();
        this._xp.name = 'XP';
        this._xp.firstDigit = null;
        this._xp.secondDigit = null;
        this._xp.thirdDigit = null;
        this._xp.forthDigit = null;

        this._xp.X = null;
        this._xp.P = null;

        this._numberTextures = [];

        this.interactive = true;
        this.buttonMode = true;
        
        
        this._createNumbers();

        this._progressX = -260;

    }

    /** 
    *  @description Creates textures from number accets
    *  @private
    */
    _createNumbers(){
        for(let i = 0; i < 10; i++){
            const texture = new Texture.from(`${i}`);
            this._numberTextures.push(texture);
        }
    }

    /** 
    *  @description Set the properties of the bar's ends
    *  @private
    */
    _setBarEnds(){
        this._left.anchor.set(0.5, 0);
        this._left.y = 433;
        this._left.x = -290;
        this._left.alpha = 0;

        this._right.anchor.set(0.5, 0);
        this._right.y = 433;
        this._right.x = 290;
        this._right.alpha = 0;
        this.addChild(this._right, this._left);
    }

    /** 
    *  @description fills the middle of the bar when move is made
    */
    _fillBar(){

        if(firstTime){
            this._left.alpha = 1;
            firstTime = false;

        } else if(this._progressX > 275){
            this._right.alpha = 1;

        } else {
            const middle = new Sprite(Texture.from('loadingMiddle'));
            middle.anchor.set(0.5, 0);
            middle.y = 433;
            middle.x = this._progressX;
            this.addChild(middle);
            this._progressX += 30;
        } 
    }


    /** 
    *  @description changes the number of xp above the bar
    *  @param {Number} number current Xp shown
    */
    _showXp(number){
        let digits = [];

        this._xp.removeChild(this._xp.firstDigit, this._xp.secondDigit,
            this._xp.thirdDigit, this._xp.forthDigit);
        this._xp.removeChild(this._xp.X, this._xp.P);

        while (number) {
            digits.push(number % 10);
            number = Math.floor(number/10);
        }

        this._xp.firstDigit = new Sprite(this._numberTextures[digits[3]]);
        this._xp.secondDigit = new Sprite(this._numberTextures[digits[2]]);
        this._xp.thirdDigit = new Sprite(this._numberTextures[digits[1]]);
        this._xp.forthDigit = new Sprite(this._numberTextures[digits[0]]);

        if(this._xp.firstDigit === 0){
            this._xp.firstDigit.alpha = 0;
        }

        this._xp.firstDigit.anchor.set(0.5, 0);
        this._xp.secondDigit.anchor.set(0.5, 0);
        this._xp.thirdDigit.anchor.set(0.5, 0);
        this._xp.forthDigit.anchor.set(0.5, 0);

        this._xp.firstDigit.y = 380;
        this._xp.secondDigit.y = 380;
        this._xp.thirdDigit.y = 380;
        this._xp.forthDigit.y = 380;


        this._xp.firstDigit.scale.set(0.4);
        this._xp.secondDigit.scale.set(0.4);
        this._xp.thirdDigit.scale.set(0.4);
        this._xp.forthDigit.scale.set(0.4);

        this._xp.firstDigit.x = -60;
        this._xp.secondDigit.x = -40;
        this._xp.thirdDigit.x = -20;
        this._xp.forthDigit.x = 0;

        this._xp.X = new Sprite(Texture.from('x'));
        this._xp.P = new Sprite(Texture.from('p'));

        this._xp.X.anchor.set(0.5, 0);
        this._xp.X.scale.set(0.3);
        this._xp.X.y = 390;
        this._xp.X.x = 20;

        this._xp.P.anchor.set(0.5, 0);
        this._xp.P.scale.set(0.3);
        this._xp.P.y = 390;
        this._xp.P.x = 40;
    

        this._xp.addChild(this._xp.firstDigit, this._xp.secondDigit, this._xp.thirdDigit,   this._xp.forthDigit);
        this._xp.addChild(this._xp.X, this._xp.P);
        this.addChild(this._xp);
    }
}