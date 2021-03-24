import Assets from '../core/AssetManager';
import Scene from './Scene';
import { Text } from 'pixi.js';
import config from '../config';

export default class Splash extends Scene {
  constructor() {
    super();

    this.loadingText = new Text('0%', {
      fontSize: 75,
      fill: 0xffc900,
    });

    this.config = config.scenes.Splash;

    this.loadingText.anchor.set(0.5);
    this.loadingText.x = this.width / 2;
    this.loadingText.y = this.height / 2;
    this.addChild(this.loadingText);
  }

  get finish() {
    return new Promise((res)=>setTimeout(res, this.config.hideDelay));
  }

  preload() {
    const images = {
      logo: Assets.images.logo,

      charBody: Assets.images['char-body'],
      charLidBottom: Assets.images['char-lid-bottom'],
      charLidTop: Assets.images['char-lid-top'],
      charEye: Assets.images['char-eye'],

      symbol_1: Assets.images['symbol-1'],
      symbol_2: Assets.images['symbol-2'],
      symbol_3: Assets.images['symbol-3'],
      symbol_4: Assets.images['symbol-4'],
      symbol_5: Assets.images['symbol-5'],
      symbol_6: Assets.images['symbol-6'],

      fire: Assets.images['fire'],
      fireGlow: Assets.images['fire-glow'],

      movesBg: Assets.images['moves-bg'],
      moves: Assets.images.moves,

      m1: Assets.images['-1'],
      0: Assets.images['0'],
      1: Assets.images['1'],
      2: Assets.images['2'],
      3: Assets.images['3'],
      4: Assets.images['4'],
      5: Assets.images['5'],
      6: Assets.images['6'],
      7: Assets.images['7'],
      8: Assets.images['8'],
      9: Assets.images['9'],
      x: Assets.images['X'],
      p: Assets.images['P'],

      tooltip: Assets.images.tooltip,
      scoreBase: Assets.images['score-base'],
      loadingLeft: Assets.images['loading-left'],
      loadingMiddle: Assets.images['loading-middle'],
      loadingRight: Assets.images['loading-right'],

      label_win: Assets.images['label-passed'],
      label_fail: Assets.images['label-failed'],

      loadingBar: Assets.images['loading-bar'],
      loadingBar_mask_left: Assets.images['loading-bar-mask-left'],
      loadingBar_mask_right: Assets.images['loading-bar-mask-right'],
      loadingBar_glow: Assets.images['loading-bar-glow'],

      xp: Assets.images['xp'],

    };
    const sounds = {
      
    };

    return super.preload({ images, sounds });
  }

  onResize(width, height) { // eslint-disable-line no-unused-vars
    this.loadingText.x = width / 2;
    this.loadingText.y = (height / 2) + 500;
  }

  onLoadProgress(val) {
    this.loadingText.text = `${val}%`;
  }
}
