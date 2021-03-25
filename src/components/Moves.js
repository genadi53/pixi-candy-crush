import { Container, Sprite, Texture } from 'pixi.js';
import GameBoard from './GameBoard';

let rightNumber;
let leftNumber;
let centerNumber; 
let currentNumber = 21;

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

    _createNumbers(){
        for(let i = 0; i < 10; i++){
            const texture = new Texture.from(`${i}`);
            this._numberTextures.push(texture);
        }
    }

    _setNextNumber(newNumber){
        this.removeChild(leftNumber, rightNumber);

        if(newNumber > 0){

            leftNumber = new Sprite(this._numberTextures[(Math.floor(newNumber / 10))]);
            leftNumber.anchor.set(0.5, 1);
            leftNumber.x = -25;
            leftNumber.y = -55;
    
            rightNumber = new Sprite(this._numberTextures[newNumber % 10]);
            rightNumber.anchor.set(0.5, 1);
            rightNumber.x = 25;
            rightNumber.y = -55;

            this.addChild(leftNumber, rightNumber);
            currentNumber--;

        } else if(newNumber === 0){
            this.removeChild(centerNumber);
            centerNumber = new Sprite(this._numberTextures[0]);
            centerNumber.anchor.set(0.5, 1);
            centerNumber.y = -55;
            this.addChild(centerNumber);
        }
    }
}