import { Container, Texture, Sprite, RenderTexture } from 'pixi.js';
import gsap from 'gsap';
import Symbol from './Symbol';
import { checkPrefix } from 'gsap/CSSPlugin';


const ROWS = 6;
const COLUMNS = 6;
const TILEWIDTH = 102;

// symbol textures
const textures = [
    'symbol_1', 
    'symbol_2',
    'symbol_3',
    'symbol_4',
    'symbol_5',
    'symbol_6'
];

let filledSquares = [
    [1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1],
];


/**
 * @property {Array} _squares 2d array filled with Symbols
 * @property {Boolean} _gameOver Showing is the game over
 * @property {Symbol} selectedTile The symbol the player is currently dragging
 * @property {Number} _moves Number of moves left
 * @property {Boolean} _settled Shows is there matches on the board
 * @property {Array} _matches Array containing the mached tiles
 * @property {Number} _score The amount of moves available to the players
 */
export default class GameBoard extends Container {
    constructor(name) {
        super();
        this.x = -200;
        this.y = -220;
        this.name = name;

        this._squares = Array.from(Array(ROWS), () => new Array(COLUMNS));
       
        this._gameOver = false;
        this._matches = [];
        this.selectedTile = null;
        this._moves = 20;
        this._settled = false;

        this._fillBoard();
        this.stettleTheBoard();

        this._score = 0;
        this.on(GameBoard.events.MOVE_MADE, () => this.stettleTheBoard());
    }

    static get events(){
        return {
            MOVE_MADE: 'move_made',
            ADD_POINTS: 'add_points',
            END_FAIL: 'end_fail',
            END_SUCCESS: 'end_success',
            RESTART: 'restart'
        }
    }
    
     /**
     *  @description fills the board and _squares array with Symbols and adds them to the stage
     *  @private
     */
    _fillBoard(){

        for (let row = 0; row < 6; row++) {
            for(let col = 0; col < 6; col++){
      
                const square = this.createSymbol(row, col);
                //square._texture = textureType;
                this._squares[row][col] = square;
                this.addChild(this._squares[row][col]);
            }
        }
    }

    /**
     *  @description returns random number for the texture 
     *  @returns {Number}
     *  @private
     */
    getRandomTextureType() {
        return Math.floor(Math.random() * textures.length);
    }
  
    /**
     *  @description creates new Symbol 
     *  @param {Number} row row of the symbol
     *  @param {Number} col column of the symbol
     *  @returns {Symbol}
     *  @private
     */
     createSymbol(row, col){

        const textureType = this.getRandomTextureType();
        const symbol = new Symbol(Texture.from(textures[textureType]), 
        col * TILEWIDTH, row * TILEWIDTH);
        symbol._texture = textureType;
        symbol.isEmpty = false;

        symbol.on('pointerdown', () => {
            this._onPointerDown(symbol);
        });

        symbol.on('pointerup', () => {
            this._onPointerUp(symbol);
        });
          
        symbol.on('pointerupoutside', () => {
            this._onPointerUpOutside();
        });

        symbol.on('pointerover', () => {
            gsap.to(symbol, { alpha: 0.75 });
        });
      
        symbol.on('pointerout', () => {
            gsap.to(symbol, { alpha: 1 });
        });

        symbol.setPosition(row, col);
        filledSquares[row][col] = 1;
        return symbol;

    }

    /**
     *  @description checks for horizontal matches and adds them to the array 
     *  @private
     */
    findHorizontalMatches(){
        let matchLength = 1;
        let checkedHorizontal = false;

        for (let row = 0; row < 6; row++) {
            for(let col = 0; col < 6; col++){
            checkedHorizontal = false;

          if (col === COLUMNS-1) {
              checkedHorizontal = true;
          } else {
             
              if(this._squares[row][col]._texture === this._squares[row][col+1]._texture){
                  matchLength += 1;
              } else { 
                  checkedHorizontal = true;
              }
          }
               
          if(checkedHorizontal){
              if(matchLength >= 3){
                 // console.log(`row: ${row}\ncolumn: ${col+1-matchLength}\nlenght: ${matchLength}\nhorizontal`)
                  this._matches.push({ column: col+1-matchLength, row:row,
                      length: matchLength, horizontal: true });
                }
              matchLength = 1;
            }

        }
        }
    }

    /**
     *  @description checks for vertical matches and adds them to the array 
     *  @private
     */
    findVerticalMatches(){
        let matchLength = 1;
        let checkedVertical = false;
   
        for (let col = 0; col < 6; col++) {
            matchLength = 1;
            for (let row = 0; row < 6; row++) {
                checkedVertical = false;
                
                if (row === ROWS-1) {
                    checkedVertical = true;
                } else {
                    if (this._squares[row][col]._texture === this._squares[row+1][col]._texture) {
                        matchLength += 1;
                    } else {
                        checkedVertical = true;
                    }
                }
                
                if (checkedVertical) {
                    if (matchLength >= 3) {
                        //console.log(`row: ${row+1-matchLength}\ncolumn: ${col}\nlenght: ${matchLength}\nvertical`)
                        this._matches.push({ column: col, row:row+1-matchLength,
                            length: matchLength, horizontal: false });
                    }
                    
                    matchLength = 1;
                }
            }
        }  
    }

    findMatches(){
        this.findHorizontalMatches();
        this.findVerticalMatches();    
    }

    /**
     *  @description loops try the matches and remove Symbols from the scene
     *  @private
     */
    breakMatches(){

        for(let i = 0; i < this._matches.length; i++){
            let match = this._matches[i];
            let rowOffset = 0; let columnOffset = 0;
            for(let j = 0; j < match.length; j++){
      
                if(match.horizontal){
      
                    this._squares[match.row][match.column+columnOffset]._texture = -1;
                    filledSquares[match.row][match.column+columnOffset] = 0;
                    this.removeChild(this._squares[match.row][match.column+columnOffset]);
                    columnOffset++;
      
                }
                
                if(!match.horizontal){
      
                    this._squares[match.row + rowOffset][match.column]._texture = -1;
                    filledSquares[match.row + rowOffset][match.column] = 0;
                    this.removeChild(this._squares[match.row + rowOffset][match.column]);
                    rowOffset++;
      
                }


            }
            this.addXp(match.length);
        }
        this._matches = [];
    }

     /**
     *  @description checks for empty squares and shifts the ones above them down
     *  @private
     */
    shiftTiles() {
       
        for (let col = 0; col < 6; col++) {
            let empty = false;
            let spaceY = 0;
            let row = 6-1;

            while(row >= 0){

                if(empty){
                    if(filledSquares[row][col]){

                        this._squares[spaceY][col] = this._squares[row][col];
                        
                        filledSquares[row][col] = 0;
                        filledSquares[spaceY][col] = 1
                        
                        gsap.fromTo(this._squares[row][col], {
                            y: this._squares[row][col].y,
                          }, {
                            y: `+=${((spaceY - row)  * TILEWIDTH)}`,
                            duration: 0.5,
                          });

                        this._squares[row][col].setPosition(row, col);
                        this._squares[spaceY][col].setPosition(spaceY, col);

                        empty = false;
                        row = spaceY;
                        spaceY = 0;
                    }
                } else if(filledSquares[row][col] === 0){
                    empty = true;

                    if(spaceY === 0) {
                        spaceY = row;
                    }
                }
                row--;
            }
        }
    }

     /**
     *  @description loops try the left empty tiles and creates Symbols to fill them
     *  @private
     */
    async fillEmptyTop(){
        for(let row = 0; row < 6; row++){
            for(let col = 0; col < 6; col++){
                if(filledSquares[row][col] === 0){
                    
                    filledSquares[row][col] = 1;

                    const square = this.createSymbol(row, col);                    
                    square.setPosition(row, col);

                    this._squares[row][col] = square;
                    this.addChild(this._squares[row][col]);

                    gsap.fromTo(this._squares[row][col], {
                        y: -100,
                      }, {
                        y: row * TILEWIDTH,
                        duration: 0.5,
                      });
                    
                }
            }
        }
    }

     /**
     *  @description swaps the positions of 2 tiles in the _squares array and on the scene
     *  @param {Number} row1 row of the first symbol
     *  @param {Number} col1 column of the first symbol
     *  @param {Number} row row of the second symbol
     *  @param {Number} col column of the second symbol
     *  @private
     */
    async swap(row1, col1, row2, col2) {
    
        if(this.isAdjacent(row1, col1, row2, col2)){

            let square = this._squares[row1][col1];
            this._squares[row1][col1] = this._squares[row2][col2];
            this._squares[row2][col2] = square;

            this._squares[row1][col1].setPosition(row1, col1);

            this._squares[row2][col2].setPosition(row2, col2);


            this._matches = [];
            this.findMatches();

        

            if(this._matches.length > 0){
                if(row1 === row2 && col1 < col2){
                    this._squares[row1][col1].moveSideway(-TILEWIDTH);
                    this._squares[row2][col2].moveSideway(TILEWIDTH);
                }

                if(row1 === row2 && col1 > col2){
                    this._squares[row1][col1].moveSideway(TILEWIDTH);
                    this._squares[row2][col2].moveSideway(-TILEWIDTH);
                }

                if(row1 > row2 && col1 === col2){

                    this._squares[row1][col1].moveVerticaly(TILEWIDTH);
                    this._squares[row2][col2].moveVerticaly(-TILEWIDTH);
                }

                if(row1 < row2 && col1 === col2){
                    this._squares[row1][col1].moveVerticaly(-TILEWIDTH);
                    this._squares[row2][col2].moveVerticaly(TILEWIDTH);
                }

                this._moves--;
                if(this._moves === 0 && this._score < 5000){
                    this._gameOver = true;
                    this.emit(GameBoard.events.END_FAIL);
                }

                this.emit(GameBoard.events.MOVE_MADE);

            } else {
                square = this._squares[row1][col1];
                this._squares[row1][col1] = this._squares[row2][col2];
                this._squares[row2][col2]= square;

                this._squares[row1][col1].setPosition(row1, col1);
    
                this._squares[row2][col2].setPosition(row2, col2);
            }
        }
    }

    
    /**
     *  @description checks is 2 tiles are adjacent
     *  @param {Number} row1 row of the first symbol
     *  @param {Number} col1 column of the first symbol
     *  @param {Number} row row of the second symbol
     *  @param {Number} col column of the second symbol
     *  @returns {Boolean}
     *  @private
     */
    isAdjacent(row1, col1, row2, col2){   
        return (
            (Math.abs(row1 - row2) === 1 && col1 === col2) || 
            (Math.abs(col1 - col2) === 1 && row1 === row2)) ? true : false;
    }


    /**
     *  @description resets current Symbol 
     *  @private
     */
    _onPointerUpOutside() {
        if (this.selectedTile === null) return;
        gsap.to(this.selectedTile.scale, { x: 1, y: 1, duration: 0.1});
    }

    /**
     *  @description if there is selected Symbol then swap it with the current
     *  @param {Symbol} symbol 
     *  @private
     */
    async _onPointerUp(symbol) {

        if (this.selectedTile === null) return;
        gsap.to(this.selectedTile.scale, { x: 1, y: 1, duration: 0.1});
        
        if (this.selectedTile.id === symbol.id) return;
    
        this.swap(this.selectedTile.row, this.selectedTile.col, symbol.row, symbol.col);
        this.selectedTile = null;
    }
    
    /**
     *  @description selects current Symbol
     *  @param {Symbol} symbol 
     *  @private
     */
    _onPointerDown(symbol) {
        this.selectedTile = symbol;
    }
    
    /**
     *  @description add amount of Xp for the match
     *  @param {Number} matchLength length of the match
     *  @private
     */
    addXp(matchLength){

        if(matchLength > 3){
            this._score += (((matchLength - 3) * 150) + 300);
        } else this._score += 300;
        
        if(this._score > 5000 && this._moves > 0) {
            this._gameOver = true;
            this.emit(GameBoard.events.END_SUCCESS);
        }
    }


    /**
     *  @description after the board is created or move is made checks for matches, removes them and fill the empty tiles
     *  @private
     */
    stettleTheBoard(){

        this._settled = false;
        this._matches = [];
        this.findMatches();
        this.breakMatches();
        this.shiftTiles();
        this.fillEmptyTop();
    }

}

