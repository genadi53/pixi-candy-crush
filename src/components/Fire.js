import { Container, Sprite, Texture } from 'pixi.js';
import gsap from 'gsap/all';

export default class Fire extends Container{
    constructor(name, x, y, glowX, glowY){
        super();
        this.name = name;
        this._element = new Sprite(Texture.from('fire'));
        this._glow = new Sprite(Texture.from('fireGlow'));
        this._glow.name = 'fireGlow';
        this._glow.x = glowX;
        this._glow.y = glowY;

        this._glow.anchor.set(0.5, 0);
        this._element.anchor.set(0.5, 0);

        
        this.addChild(this._element, this._glow);
        
        this.x = x;
        this.y = y;        
    }



}