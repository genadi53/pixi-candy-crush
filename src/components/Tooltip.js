import { _numWithUnitExp } from 'gsap/gsap-core';
import { Container, Sprite, Texture , Text} from 'pixi.js';

export default class Tooltip extends Container{
    constructor(){
        super();
        this.name = 'tooltip';
        this._element = new Sprite(Texture.from('tooltip'));
        this.interactive = true;
        this.buttonMode = true;
        
        this._element.anchor.set(1, 0);
        this.x = 390;
        this.y = 435;
        this.addChild(this._element);

        this._goal = new Text('3600xp');
        this._goal.style = {
            fill: 0xFFFFFF,
            fontSize: 16,
            fontStyle: 'bold'
        };
        this._goal.x = -57.5;
        this._goal.y = 5.5;

        this.addChild(this._goal);

    }
}