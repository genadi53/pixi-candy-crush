import { Container, Texture, Sprite, RenderTexture } from 'pixi.js';
import gsap from 'gsap';
import Symbol from './Symbol';


const ROWS = 6;
const COLUMNS = 6;
const TILEWIDTH = 102;

let filledSquares = [
    [1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1],
];

const textures = [
  'symbol_1', // texture_texture - 0
  'symbol_2',
  'symbol_3',
  'symbol_4',
  'symbol_5',
  'symbol_6'
];

let done = false;
let selectedTile = { selected: false, column: -1, row: -1 };

export default class GameBoard extends Container {
    constructor(name) {
        super();
        this._squares = Array.from(Array(ROWS), () => new Array(COLUMNS));
        this.score = 0;

        this.x = -250;
        this.y = -220;
        this.name = name;

        
        this.gameOver = false;
        this.dragging = false;

        this.matches = [];

        this.fillBoard();
   
        do{
            this.findMatches();
            this.breakMatches();
            this.shiftTiles(); 
            this.fillEmptyTop();
            this.matches = [];
            this.findMatches();

            if(this.matches.length === 0) done = true;

        }while(!done);

        this._addEventsListeners();
            
    }

    static get events(){
        return {
            MOVE_MADE: 'move_made',
            ADD_POINTS: 'add_points',

        }
    }

    fillBoard(){

        for (let row = 0; row < 6; row++) {
            for(let col = 0; col < 6; col++){
      
              
      
                const square = this.createSymbol(row, col);
                //square._texture = textureType;
                square._id = (row * 6) + col;
                square.row = row;
                square.col = col; 

                this._squares[row][col] = square;
                this.addChild(this._squares[row][col]);
            }
        }
    }
   
    createSymbol(row, col){
        const textureType = this.getRandomTextureType();
        const symbol = new Symbol(Texture.from(textures[textureType]), 
        col * TILEWIDTH, row * TILEWIDTH, 0.5);
        symbol._texture = textureType;
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
              // Last tile
              checkedHorizontal = true;
          } else {
              // Check the type of the next tile
              if(this._squares[row][col]._texture === this._squares[row][col+1]._texture){
                  // Same type as the previous tile, increase matchlength
                  matchLength += 1;
              } else {
                  // Different type
                  checkedHorizontal = true;
              }
          }
               
          if(checkedHorizontal){
              if(matchLength >= 3){
                  console.log(`row: ${row}\ncolumn: ${col+1-matchLength}\nlenght: ${matchLength}\nhorizontal`)
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

        
   // Find vertical matches
   for (let col = 0; col < 6; col++) {
    // Start with a single tile, match of 1
    matchLength = 1;
    for (let row = 0; row < 6; row++) {
        checkedVertical = false;
        
        if (row === ROWS-1) {
            // Last tile
            checkedVertical = true;
        } else {
            // Check the type of the next tile
            if (this._squares[row][col]._texture === this._squares[row+1][col]._texture) {
                // Same type as the previous tile, increase matchLength
                matchLength += 1;
            } else {
                // Different type
                checkedVertical = true;
            }
        }
        
        // Check if there was a match
        if (checkedVertical) {
            if (matchLength >= 3) {
                // Found a vertical match
                console.log(`row: ${row+1-matchLength}\ncolumn: ${col}\nlenght: ${matchLength}\nvertical`)
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
            let roffset = 0; let coffset = 0;
            for(let j = 0; j < match.length; j++){
      
                if(match.horizontal){
      
                    this._squares[match.row][match.column+coffset]._texture = -1;
                    filledSquares[match.row][match.column+coffset] = 0;
                    this.removeChild(this._squares[match.row][match.column+coffset]);
                    //this._squares[match.row][match.column+coffset] = null;
                    coffset++;
      
                }
                
                if(!match.horizontal){
      
                    this._squares[match.row + roffset][match.column]._texture = -1;
                    filledSquares[match.row + roffset][match.column] = 0;
                    this.removeChild(this._squares[match.row + roffset][match.column]);
                    //this._squares[match.row + roffset][match.column] = null;
                    roffset++;
      
                }
            }
        }

    }

    removeSymbol(symbol){
        gsap.to(symbol,{
            onComplete: () => {
                const row = symbol.row;
                const col = symbol.col;
      
                filledSquares[row][col] = 0;
                this.removeChild(this._squares[row][col])
                this._squares[row][col] = null;
                
            }
        })
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
                        this._squares[row][col].dropDownFromTop((spaceY - row) * 102);
                        
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

            // for (let row = 6-1; row >= 0; row--) {
            
            //     if(this._squares[row][col]._texture === -1){
            //         //console.log(row + ' ' + col + ' space')

            //     }
            // }
        }
    }

    fillEmptyTop(){
        for(let row = 0; row < 6; row++){
            for(let col = 0; col < 6; col++){
                if(filledSquares[row][col] === 0){
                    
                    filledSquares[row][col] = 1;
                    
                    const textureType = this.getRandomTextureType();
                    const square = new Symbol(Texture.from(textures[textureType]), 
                    col * TILEWIDTH, -1 * TILEWIDTH, 0.5);
                   
                    square._texture = textureType;
                    
                    square._id = (row * 6) + col;
                    square.row = row;
                    square.col = col; 
    
                    square.on('pointerdown', this.onDragStart);

                    this._squares[row][col] = square;
                    this.addChild(this._squares[row][col]);

                    this._squares[row][col].dropDownFromTop((row + 1) * 102);
                }
            }
        }
    }
    
    moveTiles(row1, col1, row2, col2) {
        console.log(row1, row2, col1, col2);
        
        if(row1 === row2 && col1 < col2){
            return {
                tile1: 'right',
                tile2: 'left'
            }
        }
    
        if(row1 === row2 && col1 < col2){
            return {
                tile1: 'left',
                tile2: 'right'
            }
        }
    
        if(row1 > row2 && col1 === col2){
            return {
                tile1: 'up',
                tile2: 'down'
            }
        }
    
        if(row1 < row2 && col1 === col2){
            return {
                tile1: 'down',
                tile2: 'up'
            }
        }
    }

    swap(row1, col1, row2, col2) {
    
        if(this.isAdjacent(row1, col1, row2, col2)){

            let square = this._squares[row1][col1];
            this._squares[row1][col1] = this._squares[row2][col2];
            this._squares[row2][col2]= square;

            // let result = this.moveTiles(row1, col1, row2, col2);
                    
            if(row1 === row2 && col1 < col2){
                this._squares[row1][col1].moveSideway(-102);
                this._squares[row2][col2].moveSideway(102);
            }
        
            if(row1 === row2 && col1 > col2){
                this._squares[row1][col1].moveSideway(102);
                this._squares[row2][col2].moveSideway(-102);
            }
    
            if(row1 > row2 && col1 === col2){
            
                this._squares[row1][col1].moveVerticaly(102);
                this._squares[row2][col2].moveVerticaly(-102);
            }
    
            if(row1 < row2 && col1 === col2){
                this._squares[row1][col1].moveVerticaly(-102);
                this._squares[row2][col2].moveVerticaly(102);
            }

        }
        // swap coordinates and array pos

    }

    onDragEnd(event){
        delete this.data;
        this.dragging = false;
    }

    onDragMove(event){
        if(this.dragging){
            const newPos = this.data.getLocalPosition(this.parent);
            
            this.x = newPos.x;
            this.y = newPos.y;
        }
    }

    isAdjacent(row1, col1, row2, col2){   
        return (
            (Math.abs(row1 - row2) === 1 && col1 === col2) || 
            (Math.abs(col1 - col2) === 1 && row1 === row2)) ? true : false;
    }

    onDragStart(event){


        // take position and selection and set them to global var and in other func(swap mb) deal with them


        let squareBeingDragged = { 
            id: this._id,
            row: this.row,
            col: this.col,
            texture: this._texture  
        }

        this.data = event.data;
        this.dragging = true;

        //console.log(this.parent._squares[selectedTile.row][selectedTile.column])

        if(!selectedTile.selected){
            selectedTile.selected = true;
            selectedTile.row = this.row;
            selectedTile.column = this.col;

            //console.log(this.parent._squares[selectedTile.row][selectedTile.column].alpha)
            this.alpha = 0.5;


        } else if(selectedTile.row === this.row && selectedTile.column === this.col){
                
                this.alpha = 1;
                this.parent._squares[selectedTile.row][selectedTile.column].alpha = 1;
                selectedTile.selected = false;
                selectedTile.row = -1;
                selectedTile.column = -1;
             

        } else {

            if(!this.parent.isAdjacent(selectedTile.row, selectedTile.column, this.row, this.col)){
                
                this.alpha = 1;
                this.parent._squares[selectedTile.row][selectedTile.column].alpha = 1;
                selectedTile.selected = false;
                selectedTile.row = -1;
                selectedTile.column = -1;
                

            } else{

                this.parent.swap(selectedTile.row, selectedTile.column, this.row, this.col)
                 
                this.alpha = 1;
                this.parent._squares[this.row][this.col].alpha = 1;
    
                selectedTile.selected = false;
                selectedTile.row = -1;
                selectedTile.column = -1;
    
            }

       
        }


            // if(selectedTile.selected){

            //     if(selectedTile.row === this.row && selectedTile.column === this.col){

            //         selectedTile.selected = false;
            //         selectedTile.row = -1;
            //         selectedTile.column = -1;

            //         this.selected = false; 
            //         this.alpha = 1;


            //     } else if(!this.parent.isAdjacent(selectedTile.row, selectedTile.column, this.row, this.col)){
                 
            //         selectedTile.selected = false;
            //         selectedTile.row = -1;
            //         selectedTile.column = -1;

            //         this.selected = false; 
            //         this.alpha = 1;

            //     } else {

            //         this.parent.swap(selectedTile.row, selectedTile.column, this.row, this.col)
                   
            //         selectedTile.selected = false;
            //         selectedTile.row = -1;
            //         selectedTile.column = -1;

            //         this.selected = false; 
            //         this.alpha = 1;
    
            //     }
    
            // } else {

            //     selectedTile.selected = true;
            //     selectedTile.row = this.row;
            //     selectedTile.column = this.col;

            //     this.selected = true; 
            //     this.alpha = 0.5;
            // }


       

        // if(selectedTile.selected){

        //     if(selectedTile.row === this.row && selectedTile.column === this.col){
        //         selectedTile.selected = false;
        //         selectedTile.row = -1;
        //         selectedTile.column = -1;
        //     } else if(!this.parent.isAdjacent(selectedTile.row, selectedTile.column, this.row, this.col)){
        //         console.log('not adjacent');
        //         selectedTile.selected = false;
        //         selectedTile.row = -1;
        //         selectedTile.column = -1;
        //     } else {
        //         console.log('adjasent')
        //         this.parent.swap(selectedTile.row, selectedTile.column, this.row, this.col)
        //         selectedTile.selected = false;
        //         selectedTile.row = -1;
        //         selectedTile.column = -1;

        //     }

        // } else {
        //     selectedTile.selected = true;
        //     selectedTile.row = this.row;
        //     selectedTile.column = this.col;
        // }

      
        //console.log(squareBeingDragged)
        //console.log(selectedTile);
        //console.log(event.data.getLocalPosition(this.parent))
    } 

    getMousePos(canvas, e) {
        var rect = canvas.getBoundingClientRect();
        return {
            x: Math.round((e.clientX - rect.left)/(rect.right - rect.left)*canvas.width),
            y: Math.round((e.clientY - rect.top)/(rect.bottom - rect.top)*canvas.height)
        };
    }

    _addEventsListeners(){

         //this._squares.forEach(square => square.on('pointerdown', this.onDragStart))
        //this._squares.forEach(square => square.on('mousedown', this.onDragStart))
        //this._squares.forEach(square => square.on('mousemove', this.onDragMove))
        //this._squares.forEach(square => square.on('mouseup', this.onDragMove))
        //this._squares.forEach(square => square.on('mouseout', this.onDragMove))
        //                                           mouseupoutside

        let selectedTile = this.selectedTile;

        for(let row = 0; row < 6; row++){
            for(let col = 0; col < 6; col++){

                this._squares[row][col]
                .on('pointerdown', this.onDragStart);
               
                //.on('pointermove', this.onDragMove)
                //.on('pointerup', this.onDragEnd)
                //.on('pointerout', this.onMouseOut)
                //.on('pointerupoutside', this.onDragEnd);
            }
        }
    }

    
     
       
}

