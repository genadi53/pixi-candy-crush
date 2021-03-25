import { Container, Texture, Sprite, RenderTexture } from 'pixi.js';
import gsap from 'gsap';
import Symbol from './Symbol';
import { checkPrefix } from 'gsap/CSSPlugin';


const ROWS = 6;
const COLUMNS = 6;
const TILEWIDTH = 102;

const textures = [
    'symbol_1', // texture_texture - 0
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


export default class GameBoard extends Container {
    constructor(name) {
        super();
        this.x = -200;
        this.y = -220;
        this.name = name;

        this._squares = Array.from(Array(ROWS), () => new Array(COLUMNS));
       
        this._gameOver = false;
        this.matches = [];
        this.selectedTile = null;
        this._transition = false;
        this._moves = 20;
        this._settled = false;

        this.fillBoard();
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

    fillBoard(){

        for (let row = 0; row < 6; row++) {
            for(let col = 0; col < 6; col++){
      
                const square = this.createSymbol(row, col);
                //square._texture = textureType;
                this._squares[row][col] = square;
                this.addChild(this._squares[row][col]);
            }
        }
    }
   
    createSymbol(row, col){

        const textureType = this.getRandomTextureType();
        const symbol = new Symbol(Texture.from(textures[textureType]), 
        col * TILEWIDTH, row * TILEWIDTH);//, 0.5);
        symbol._texture = textureType;
        symbol.isEmpty = false;

        symbol.on('pointerdown', () => {
            this._symbolOnPointerDown(symbol);
        });

        symbol.on('pointerup', () => {
            this._symbolOnPointerUp(symbol);
        });
          
        symbol.on('pointerupoutside', () => {
            this._symbolOnPointerUpOutside();
        });
      
        symbol.on('pointerover', () => {
            if (this._transition) return;
            gsap.to(symbol, {
              alpha: 0.8,
              duration: 0,
            });
        });
      
        symbol.on('pointerout', () => {
            gsap.to(symbol, {
              alpha: 1,
              duration: 0,
            });
        });

        symbol.setPosition(row, col);
        filledSquares[row][col] = 1;
        return symbol;

    }

    getRandomTextureType() {
        return Math.floor(Math.random() * textures.length);
    }
  
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
                  this.matches.push({ column: col+1-matchLength, row:row,
                      length: matchLength, horizontal: true });
                }
              matchLength = 1;
            }

        }
        }
    }

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
                        this.matches.push({ column: col, row:row+1-matchLength,
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

    breakMatches(){

        for(let i = 0; i < this.matches.length; i++){
            let match = this.matches[i];
            let rowOffset = 0; let columnOffset = 0;
            for(let j = 0; j < match.length; j++){
      
                if(match.horizontal){
      
                    this._squares[match.row][match.column+columnOffset]._texture = -1;
                    filledSquares[match.row][match.column+columnOffset] = 0;
                    this.removeChild(this._squares[match.row][match.column+columnOffset]);
                    //this._squares[match.row][match.column+columnOffset] = null;
                    columnOffset++;
      
                }
                
                if(!match.horizontal){
      
                    this._squares[match.row + rowOffset][match.column]._texture = -1;
                    filledSquares[match.row + rowOffset][match.column] = 0;
                    this.removeChild(this._squares[match.row + rowOffset][match.column]);
                    //this._squares[match.row + rowOffset][match.column] = null;
                    rowOffset++;
      
                }


            }
            this.addXp(match.length);
        }
        this.matches = [];
    }

    shiftTiles() {
       
        for (let col = 0; col < 6; col++) {
            let empty = false;
            let spaceY = 0;
            let row = 6-1;

            while(row >= 0){

                if(empty){
                    if(filledSquares[row][col]){

                        this._squares[spaceY][col] = this._squares[row][col];
                        //this._squares[row][col] = null
                        
                        filledSquares[row][col] = 0;
                        filledSquares[spaceY][col] = 1;
                

                        //this._squares[row][col].
                        //dropDownFromTop((spaceY - row) * TILEWIDTH);
                        
                        gsap.fromTo(this._squares[row][col], {
                            y: this._squares[row][col].y,
                          }, {
                            y: `+=${((spaceY - row)  * TILEWIDTH)}`,
                            ease: 'linear',
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
                        ease: 'linear',
                        duration: 0.5,
                      });
                    
                }
            }
        }
    }

    async swap(row1, col1, row2, col2) {
    
        if(this.isAdjacent(row1, col1, row2, col2)){

            let square = this._squares[row1][col1];
            this._squares[row1][col1] = this._squares[row2][col2];
            this._squares[row2][col2] = square;

            this._squares[row1][col1].setPosition(row1, col1);

            this._squares[row2][col2].setPosition(row2, col2);


            this.matches = [];
            this.findMatches();

        

            if(this.matches.length > 0){
                // let result = this.moveTiles(row1, col1, row2, col2);
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

    isAdjacent(row1, col1, row2, col2){   
        return (
            (Math.abs(row1 - row2) === 1 && col1 === col2) || 
            (Math.abs(col1 - col2) === 1 && row1 === row2)) ? true : false;
    }


    _symbolOnPointerUpOutside() {
        if (this.selectedTile === null) return;
        gsap.to(this.selectedTile.scale, {
          x: 1,
          y: 1,
          duration: 0.05,
          ease: 'linear',
        });
    }

    async _symbolOnPointerUp(symbol) {

        if (this.selectedTile === null || this._transition) return;
    
        gsap.to(this.selectedTile.scale, {
          x: 1,
          y: 1,
          duration: 0.05,
          ease: 'linear',
        });
    
        if (this.selectedTile.id === symbol.id) return;
    
        this.swap(this.selectedTile.row, this.selectedTile.col, symbol.row, symbol.col);

        this.selectedTile = null;
    }
    
    _symbolOnPointerDown(symbol) {

        if (this._transition) return;

        this.selectedTile = symbol;
        symbol.alpha = 0.5;
    }
    
    addXp(matchLength){
        console.log(this._score, matchLength);
        if(matchLength > 3){
            this._score += (((matchLength - 3) * 150) + 300);
        } else this._score += 300;
        
        if(this._score > 5000 && this._moves > 0) {
            this._gameOver = true;
            this.emit(GameBoard.events.END_SUCCESS);
        }
    }


    async stettleTheBoard(){

        this._settled = false;

        this.matches = [];
        this.findMatches();
        this.breakMatches();
        this.shiftTiles();
        this.fillEmptyTop();
    }

}

