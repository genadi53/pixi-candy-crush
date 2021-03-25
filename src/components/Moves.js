import { Container, Sprite, Texture } from 'pixi.js';
import GameBoard from './GameBoard';

let rightDigit;
let leftDigit;
let centerDigit; 

export default class Moves extends Container{
    constructor(){
        super();
        this.name = 'moves';
        this._background = new Sprite(Texture.from('movesBg'));
        this._moves = new Sprite(Texture.from('moves'));
        this._background.name = 'background';
        this._moves.name = 'movesLabel';

        this._numberTextures = [];

        this.interactive = true;
        this.buttonMode = true;
        
        this._background.anchor.set(0.5, 1);
        this._moves.anchor.set(0.5, 1);
        this._moves.y = -150;
        this.y = -330;
        this.addChild(this._background, this._moves);
     
        this._createNumbers();

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
     *  @description Creates and set the params for the number of moves
     *  @param {Number} newNumber number that will be displayed
     *  @private
     */
    _setNextNumber(newNumber){
        this.removeChild(leftDigit, rightDigit);

        if(newNumber > 0){

            leftDigit = new Sprite(this._numberTextures[(Math.floor(newNumber / 10))]);
            leftDigit.anchor.set(0.5, 1);
            leftDigit.x = -25;
            leftDigit.y = -55;
    
            rightDigit = new Sprite(this._numberTextures[newNumber % 10]);
            rightDigit.anchor.set(0.5, 1);
            rightDigit.x = 25;
            rightDigit.y = -55;

            this.addChild(leftDigit, rightDigit);

        } else if(newNumber === 0){
            this.removeChild(centerDigit);
            centerDigit = new Sprite(this._numberTextures[0]);
            centerDigit.anchor.set(0.5, 1);
            centerDigit.y = -55;
            this.addChild(centerDigit);
        }
    }
}