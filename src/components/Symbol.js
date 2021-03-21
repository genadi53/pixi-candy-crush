import gsap from 'gsap/all';
import { Container, Sprite, Texture } from 'pixi.js';

export default class Symbol extends Container{
    constructor(texture, x, y, anchor){
        super();
        this._symbol = new Sprite(texture);
        this._symbol.width = 101;
        this._symbol.height = 101;
        this._symbol.anchor.set(anchor);
        this.x = x;
        this.y = y;
        
        this.row = null;
        this.col = null;

        this.interactive = true;
        this.buttonMode = true;
        this.dragging = false;
        this.selected = false;

        this.addChild(this._symbol);
        //this.on('click', () => this.moveVerticaly(102))
    }

    moveVerticaly(val){
        gsap.fromTo(this._symbol,
            {
                y: this._symbol.y,
                duration: 0.1,
                ease: 'linear'
            },
            {
                y: `+=${val}`,
                duration: 0.1,
                ease: 'linear'
            }); 
    }

    moveSideway(val){
        gsap.fromTo(this._symbol,
            {
                x: this._symbol.x,
                duration: 0.1,
                ease: 'linear'
            },
            {
                x: `+=${val}`,
                duration: 0.1,
                ease: 'linear'
            }); 
    }

    dropDownFromTop(val){
        gsap.fromTo(this._symbol,
            {
                y: this._symbol.y,
                duration: 0.2,
                alpha: this._symbol.alpha,
                ease: 'linear'
            },
            {
                y: `+=${val}`,
                duration: 0.2,
                alpha: 1,
                ease: 'linear'
            }); 
    }

    
}