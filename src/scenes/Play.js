import { Container, Graphics, Sprite, Texture } from 'pixi.js';
import Scene from './Scene';
import gsap from 'gsap';
import Footer from '../components/Footer';
import Character from '../components/Character';
import Symbol from '../components/Symbol';
import GameBoard from '../components//GameBoard';
import Fire from '../components/Fire';
import Moves from '../components/Moves';
import ProgressBar from '../components/ProgressBar';
import Tooltip from '../components/Tooltip';
import Label from '../components/Label';
import End from '../components/End';
import LoadingBar from '../components/LoadingBar';

let done = false;
export default class Play extends Scene {
  async onCreated() {

    const footer = new Footer();
    footer.x = - window.innerWidth / 2;
    footer.y = window.innerHeight / 2 - footer.height;
    //this.addChild(footer);
    
    this.fireLeft = new Fire('fire-left', -680, -20, -5, 10);
    this.fireRight = new Fire('fire-right', 720, -20, -15, 20);
    this.addChild(this.fireLeft, this.fireRight);
   
    //this._createLoadingScreen();
    await this._createMainScreen();
    //this._createEndScreen();

  }

  _createLoadingScreen(){
    const loadingBar = new LoadingBar();
    this.addChild(loadingBar);

  }

  async _createMainScreen(){
    this.characterBig = new Character('characterBig', 0, 0);
    this.characterSmall = new Character('characterSmall', 690, -220);
    this.characterSmall.scale.set(0.5);

    this.characterBig.move();
    this.characterSmall.move();

    this.addChild(this.characterBig, this.characterSmall);

    this.gameBoard = new GameBoard('board');
    this.addChild(this.gameBoard);

    this.moves = new Moves();
    this.moves._setNextNumber(this.gameBoard._moves);
    this.addChild(this.moves);

    this.bar = new ProgressBar();
    this.addChild(this.bar);

    this.tooltip = new Tooltip();
    this.addChild(this.tooltip);

    this.gameBoard.on(GameBoard.events.MOVE_MADE, 
      () => {
        this.moves._setNextNumber(this.gameBoard._moves);
        this.bar._fillBar();
        this.bar._showXp(this.gameBoard._score);
      });

    this.gameBoard.on(GameBoard.events.END_SUCCESS,
      () => {
        this._hideMainScreen();
        this._createEndScreen('win');
      });
    
    this.gameBoard.on(GameBoard.events.END_FAIL,
      () => {
        this._hideMainScreen();
        this._createEndScreen('fail');
      });

  }
  
  _createEndScreen(result){
    if(result === 'win'){
       this.end = new End('win');
       this.addChild(this.end);
       this._addEventListeners();
    } else {
      this.end = new End('fail');
      this.addChild(this.end);
      this._addEventListeners();
    }
  }
  
  _hideMainScreen(){
     const timeline = new gsap.timeline();

     timeline
        .fromTo(this.characterBig, { alpha: 1 }, { alpha: 0, duration: 1})
        .fromTo(this.characterSmall, { alpha: 1 }, { alpha: 0, duration: 1}, '<')
        .fromTo(this.gameBoard, { alpha: 1 }, { alpha: 0, duration: 1}, '<')
        .fromTo(this.moves, { alpha: 1 }, { alpha: 0, duration: 1}, '<')
        .fromTo(this.bar, { alpha: 1 }, { alpha: 0, duration: 1}, '<')
        .fromTo(this.tooltip, { alpha: 1 }, { alpha: 0, duration: 1}, '<')
  }

  _addEventListeners() {
    document.addEventListener('keydown', (key) => {
      const keyPressed = key.code;
      if (keyPressed === 'Space') {
        
        this.end.on(End.events.RESTART, 
          () => {
            this.end._handleClick();
            this._createMainScreen();
          })
      }
    });
  }

  /**
   * Hook called by the application when the browser window is resized.
   * Use this to re-arrange the game elements according to the window size
   *
   * @param  {Number} width  Window width
   * @param  {Number} height Window height
   */
  onResize(width, height) { // eslint-disable-line no-unused-vars

  }
}
