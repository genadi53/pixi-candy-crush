import { Container, Graphics, Sprite, Texture } from 'pixi.js';
import gsap from 'gsap/all';
import Character from './Character';


import PixiPlugin from 'gsap/PixiPlugin';
import MotionPathPlugin from 'gsap/MotionPathPlugin';

gsap.registerPlugin(PixiPlugin, MotionPathPlugin);

export default class LoadingBar extends Container{
    constructor(){
        super();
        this.name = 'loading-bar';
        this._emement = new Sprite(Texture.from('loadingBar'));

        this._glow = new Sprite(Texture.from('loadingBar_glow'));
        this._glow.anchor.set(0.5);

        this._emement.anchor.set(0.5);

        this._maskLeft = new Sprite(Texture.from('loadingBar_mask_left'));
        this._maskLeft.anchor.set(0.5);
        this._maskLeft.x = -85;

        this._maskRight = new Sprite(Texture.from('loadingBar_mask_right'));
        this._maskRight.anchor.set(0.5);
        this._maskRight.x = 90;

        //this._emement.mask = this._maskLeft;
        // this._emement.addChild(this._maskLeft);

        // this._emement.mask = this._maskRight;
        // this._emement.addChild(this._maskRight);
       
        this.character = new Character('character', 480, 0);
        this.character.zIndex = 0;
        this.character.scale.set(0.95)
      

        this.addChild(
            this.character, 
            this._emement,
            this._glow, 
            this._maskLeft, 
            this._maskRight
        );

        this.load();
    }

    load(){
        const animation = gsap.timeline();
        
        // animation.to(this._glow, {
        //     duration: 2,
        //     motionPath: {
        //         path: [{ x: 0, y: 160 }, { x: -160, y: 0 }, { x: 0, y: -160 }, { x: 160, y: 0 }],
        //         type: "cubic",
        //         autoRotate: true,
        //         alignOrigin: [0.5, 0.5]
        //       }
        //     });

    }
}