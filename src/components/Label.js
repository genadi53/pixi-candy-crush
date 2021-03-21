import { Container, Sprite, Texture } from 'pixi.js';


export default class ProgressBar extends Container{
    constructor(result){
        super();
        this.name = 'label';

        this._label = this.createLabel(result);
        this._label.anchor.set(0.5);
        this._label.scale.set(0.9);
        this._label.y = -100;
        this.addChild(this._label);
      
        this.interactive = true;
        this.buttonMode = true;
    }

    createLabel(result){
        if(result === 'win'){
            return new Sprite(Texture.from('label_win'));
        } else {
            return new Sprite(Texture.from('label_fail'))
        }
    }

}