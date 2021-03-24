import gsap from 'gsap/all';
import { Container, Sprite, Texture } from 'pixi.js';

export default class Symbol extends Container{
    constructor(texture, x, y){
        super();
        this._symbol = new Sprite(texture);
        this._symbol.anchor.set(0.5);
        this.x = x;
        this.y = y;
        
        this.row = null;
        this.col = null;

        this.interactive = true;
        //this.buttonMode = true;
        this.dragging = false;
        this.selected = false;

        this.pivot.set(50, 50);

        this.addChild(this._symbol);
    }

    setPosition(row, column){
        this.row = row;
        this.col = column;
        this.id = (row * 6) + this.col;
    }


    moveVerticaly(val){
        gsap.fromTo(this._symbol,
            {
                y: this._symbol.y
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
                x: this._symbol.x
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
                duration: 0.5,
                alpha: this._symbol.alpha,
                ease: 'linear'
            },
            {
                y: `+=${val}`,
                duration: 0.5,
                alpha: 1,
                ease: 'linear'
            }); 
    }

}