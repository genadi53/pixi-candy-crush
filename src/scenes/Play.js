import { Container, Sprite, Texture } from 'pixi.js';
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
import End from '../scenes/End';
import LoadingBar from '../components/LoadingBar';

let done = false;
export default class Play extends Scene {
  async onCreated() {

    const footer = new Footer();
    footer.x = - window.innerWidth / 2;
    footer.y = window.innerHeight / 2 - footer.height;
    //this.addChild(footer);

    //this._pressedKeys = [];
    
    const fireLeft = new Fire('fire-left', -680, -20, -5, 10);
    const fireRight = new Fire('fire-right', 720, -20, -15, 20);
    this.addChild(fireLeft, fireRight);
   
    //this._createLoadingScreen();
    await this._createMainScreen();
    //this._createEndScreen();

  }

  _createLoadingScreen(){
    const loadingBar = new LoadingBar();
    this.addChild(loadingBar);

  }

  async _createMainScreen(){
    const characterBig = new Character('characterBig', 0, 0);
    const characterSmall = new Character('characterSmall', 690, -220);
    characterSmall.scale.set(0.5);
    this.addChild(characterBig, characterSmall);

    const gameBoard = new GameBoard('board');
    this.addChild(gameBoard);

    const moves = new Moves();
    this.addChild(moves);

    const bar = new ProgressBar();
    this.addChild(bar);

    const tooltip = new Tooltip();
    this.addChild(tooltip);
    //gameBoard.on(GameBoard.events.MOVE_MADE, () => moves._setNextNumber(20));

    gameBoard.on(GameBoard.events.MOVE_MADE, 
      () => {
        moves._setNextNumber(gameBoard._moves);
        bar._fillBar();
        gameBoard._score += 300;
        bar._showXp(gameBoard._score);
      });


  }
  
  _createEndScreen(){
    this.end = new End('win');
    this.addChild(this.end);
    this._addEventListeners();
  }
  

  _addEventListeners() {
    document.addEventListener('keydown', (key) => {
      const currentKeyPressed = key.code;
      if (
        currentKeyPressed === 'Space' //&&
        //!this._pressedKeys.includes(currentKeyPressed) &&
        //!this._gameOver
      ) {
        //this._pressedKeys.push(currentKeyPressed);
        this.end._handleClick(currentKeyPressed);
        //this.bird.goUp(70);
      }
    });

    document.addEventListener('keyup', (event) => {
      //this._pressedKeys.splice(this._pressedKeys.indexOf(event.code), 1);
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
