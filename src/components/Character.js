import { Container, Sprite, Texture } from 'pixi.js';
import gsap from 'gsap/all';


export default class Character extends Container{
    constructor(name, x, y){
        super();
        this.name = name;
        this._body = new Sprite(Texture.from('charBody'));
        this._topLib = new Sprite(Texture.from('charLidTop'));
        this._bottomLib = new Sprite(Texture.from('charLidBottom'));
        this._eye = new Sprite(Texture.from('charEye'));

        this._body.anchor.set(0.5);
        this._body.x = -500;

        this._eye.anchor.set(0.5);
        this._eye.y = -18;
        this._eye.x = -500;


        this._topLib.anchor.set(0.5);
        this._topLib.y = -42.5;
        this._topLib.x = -500;


        this._bottomLib.anchor.set(0.5);
        this._bottomLib.y = 7.5;
        this._bottomLib.x = -500;

        this.addChild(this._body, this._eye, this._topLib, this._bottomLib);
        this.interactive = true;
        this.buttonMode = true;
        this.x = x;
        this.y = y;

        this._libsRemoved = false; 
        this.on('click', this.removeLibs);
        //this.move();
        
    }

    
    removeLibs(){
        if(this._libsRemoved){

            this._bottomLib.alpha = 1;
            this._topLib.alpha = 1;
            this._libsRemoved = false;

        } else {

            this._bottomLib.alpha = 0;
            this._topLib.alpha = 0;
            this._libsRemoved = true;

        }    
    }

    move(){
        gsap.to(this, {
            y: '+=15',
            duration: 2,
            yoyo: true,
            repeat: -1,
            ease: 'power1.inOut'
        })
    }

}