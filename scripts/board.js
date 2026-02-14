import { Queen, Knight, makePieces, pieceMap } from "./pieces.js";

//yeah that's right, i ripped em right out of the pieces module
function rowChange(position, opponentPosition){
    const cRow =  Math.floor(position / 8); 
    const n_row = Math.floor((opponentPosition) / 8);
    return Math.abs(cRow - n_row);
}
function columnChange(position, opponentPosition){
    const cCol = position % 8;
    const n_col = opponentPosition % 8;
    return Math.abs(cCol - n_col);
}




export class Board{
    //variables assigned to null pre-construct are objects
    mainDisplay=false;
    toggleShowMoves=true;

    boardsPieces=null;
    boardState = [];
    turn = '';
    pieceSelected = '';
    availableMoves = [];

    wKing = 0;
    bKing = 0;

    bInCheck = false;
    wInCheck = false;
    
    constructor(boardCopy=false, boardsPieces=null, turn='w'){
        this.boardsPieces = boardsPieces? makePieces(boardsPieces) : makePieces(); 
        if (boardCopy && !boardsPieces){
            throw new Error("Fatal Error: missing necessary constructor parameter(s)")
        }
        
        this.boardState = Array.from({ length: 64 }, (_, index) => {
        const piece = this.boardsPieces.find((piece)=> piece && piece.position === index) || ''; //that and gate saved a lot of trouble
        if (piece && piece.type === 'king'){
            piece.color === 'w'? this.wKing = piece.position : this.bKing = piece.position;
        }
        return piece;
        });
        this.turn = turn;
        
        //only render html for a fresh board-- otherwise odds are it's BTS simulated moves
        if(!boardCopy){

            this.mainDisplay = true;
            document.querySelector('.js-board').innerHTML = this.#renderBoardHtml();
            this.#addAllButtonFunctionality();
        }

    }
    #toggleShowMoves(state){ //true show, false hide
        if (state){
            this.toggleShowMoves = true;
            this.#colorMoves(this.availableMoves, 'rgba(230, 230, 230, 0.8)')
        }
        else{
            this.toggleShowMoves = false;
            this.#colorMoves(this.availableMoves, '')
        }
    }

    //one time use //
   #renderBoardHtml(){
        
        let boardHtml = '';
        let parser = 0;
        let count = 0;
        this.boardState.forEach((tile, index)=>{
            const tileColor = (index - parser) % 2 === 0? 'w': 'b';
            boardHtml += 
            `<button 
            class="js-board-square board-square-${tileColor} js-board-square-${index}" 
            data-index=${index}>
            ${tile?`<img src='./assets/${tile.type}-${tile.color}.png'
            class="piece" 
            data-id=${tile.id} data-color=${tile.color}>`:
            ''}
            </button>`;

            count++;
            if (count === 8){
                parser++;
                count = 0;
            }
        })

        return boardHtml;    
        //add fucntionality to squares
    };
    #addAllButtonFunctionality(){
        //board
        document.querySelectorAll('.js-board-square').forEach((button)=>{
            button.addEventListener('click', ()=>{
                this.#handleBoardInput(button);
            })
        })
        //add functionality to toggleShowMoves button
        const toggleShowMoves = document.querySelector('.js-toggle-moves');
            toggleShowMoves.addEventListener('change', ()=>{
            this.#toggleShowMoves(!(toggleShowMoves.checked))
        });
        //promotion button options
        document.querySelectorAll('.js-promotion-button').forEach((button)=>{
            button.addEventListener('click', ()=>{
                const promotionUi = document.querySelector('.js-promotion-ui');
                const pieceId = promotionUi.dataset.pieceId;
                const type = button.dataset.type;
                this.boardsPieces[pieceId].type = type;
        
                const { position, id, color } = this.boardsPieces[pieceId];
                const newPieceClass = pieceMap[type];
                this.boardsPieces[id] = new newPieceClass(type, position, id, color);
                //refresh tile
                const tileImage = document.querySelector(`.js-board-square-${position}`).querySelector('img');
                tileImage.src = `
                ./assets/${this.boardsPieces[id].type}-${color}.png`
                promotionUi.style.display = 'none';
            })
        })  
    }  
   

    #handleBoardInput(button){
        const {index} = button.dataset;
        const piece = button.querySelector('img');
        if(piece && piece.dataset.color === this.turn){ //if clicking piece of own color
            
            if(piece && !this.pieceSelected){ //if clicking piece for first time
                this.pieceSelected = piece;
                button.style.backgroundColor = 'rgba(230, 230, 230, 0.568)';
                this.availableMoves = this.boardsPieces[this.pieceSelected.dataset.id].assessMoves(this.boardState)
            }
            else{ 
                //reset prev button
                const prevChoice = this.boardsPieces[this.pieceSelected.dataset.id].position;
                this.#colorMoves([prevChoice], '');
                this.#colorMoves(this.availableMoves, '');

                if (this.boardsPieces[piece.dataset.id] != this.boardsPieces[this.pieceSelected.dataset.id]){
                    //set new available moves
                    button.style.backgroundColor = 'rgba(230, 230, 230, 0.568)';
                    this.pieceSelected = piece;
                    this.availableMoves = this.boardsPieces[this.pieceSelected.dataset.id].assessMoves(this.boardState)
                }
                else{
                    //unclick if clicking same piece
                    this.pieceSelected=null;
                    this.availableMoves=[];
                }
                
            }
            if (this.pieceSelected){
                this.availableMoves = this.availableMoves.filter((move)=>{
                    return !(this.#checkForCheck(this.turn, this.boardsPieces[this.pieceSelected.dataset.id].position, move));
                })
            }
            this.toggleShowMoves ? this.#colorMoves(this.availableMoves, 'rgba(230, 230, 230, 0.8)') : null;
        }
        //move selected piece
        else if(this.pieceSelected){
            if ( this.availableMoves.includes(Number(index)) ){
                const pieceToMove = this.boardsPieces[this.pieceSelected.dataset.id]
                //take yourself out of check aswell if you were in it

                this.#movePiece(pieceToMove, Number(index));
            }
        }
    }

    #movePiece(piece, newPosition, testBoard=false){
    //if king update position
        if(piece.type === 'king'){
            (piece.color ==='w') ? this.wKing = newPosition: this.bKing = newPosition;
        }
        //check if pawn is getting promoted 
        if (this.mainDisplay && piece.type === 'pawn' && piece.isEndOfBoard(newPosition)){
            const promotionUi = document.querySelector('.js-promotion-ui');
            promotionUi.style.display='flex';
            promotionUi.dataset.pieceId = piece.id;
        }
        //VISUAL UPDATE
        if (!testBoard){
            const cPos = piece.position;
            const cTile = document.querySelector(`.js-board-square-${cPos}`);
            const nTile = document.querySelector(`.js-board-square-${newPosition}`);
            nTile.innerHTML = cTile.innerHTML;
            cTile.innerHTML = '';

            this.#colorMoves([piece.position], '');
            this.#colorMoves(this.availableMoves, '');
            //CHECK IF PUT OPPONENT IN CHECK BEFORE BOARDSTATE UPDATE
            const opponentTurn = this.turn === 'w' ? 'b': 'w';
            if (this.#checkForCheck(opponentTurn, piece.position, newPosition)){
                opponentTurn === 'w' ? this.wInCheck = true : this.bInCheck = true;
            }
        }
        
        //UPDATE BOARD PIECES IF PIECE WAS TAKEN
        if(piece.isTaking(newPosition, this.boardState)){
            //remove from board pieces
            const takenPieceID = this.boardState[newPosition].id;
            this.boardsPieces[takenPieceID] = null;
        }
        //BOARDSTATE UPDATE
        this.boardState[piece.position] = '';
        this.boardState[newPosition] = piece;

        //disinstantiate available moves
        this.availableMoves = []
        //OBJECT UPDATE
        piece.position= newPosition;
        //swap turns
        if (!testBoard){
            this.#endOfTurn();
            this.#startOfOpponentTurn()
        }
        

    }

    #endOfTurn(){
        if (this.turn === 'w' && this.wInCheck){
            this.wInCheck = false;
        }
        else if (this.turn === 'b' && this.bInCheck){
            this.bInCheck = false;
        }

        this.turn = this.turn==='w'? 'b':'w';
        this.pieceSelected = null;
        
    }

    #startOfOpponentTurn(){
        if (this.turn === 'w' && this.wInCheck){
            if (this.#checkForCheckMate('w')){
                console.log('White Has Lost')
                }
            else{
                console.log('White Is In Check')
                }
            }   
        else if (this.turn === 'b' && this.bInCheck){
            if (this.#checkForCheckMate('b')){
                console.log('Black Has Lost')
                }
            else{
                console.log('Black Is In Check')
                }
        }
    }

    #colorMoves(moves, color, testBoard=false){
        moves.forEach((tileIndex) => {
            const tile = document.querySelector(`.js-board-square-${tileIndex}`);
            tile.style.backgroundColor=color;
        })
    }

    //The complex shit probably, idk i havent written it yet

    //takes what color it's checking check for, the position of the piece moving, and the position that piece is moving too

    #checkForCheck(color, cPos, nPos){ //returns true if in check
        let testBoard = new Board(true, this.boardsPieces) //turn doesn't matter for checking check

        testBoard.#movePiece(testBoard.boardState[cPos], nPos, true);
        const kingToTest = color === 'w' ? testBoard.wKing : testBoard.bKing;
        
        //Queen Sweep
        let kPiece = testBoard.boardState[kingToTest];
        kPiece = new Queen('queen', kPiece.position, kPiece.id, kPiece.color)
        let accessibleAt = kPiece.assessMoves(testBoard.boardState, true); //returns locations of any piece colliding of opposing color
        let inCheck = accessibleAt.some((pos)=>{ //check if pieces actually matter
            const type = testBoard.boardState[pos].type
            if(['queen', 'bishop', 'rook', 'king', 'pawn'].includes(type)){
                if (type === 'queen'){
                    return true;
                }

                const rChange = rowChange(kPiece.position, pos);
                const cChange = columnChange(kPiece.position, pos);
                if (type === 'bishop'){
                    if(rChange === cChange){
                        return true;
                    }
                }
                if(type === 'rook'){
                    if (rChange != cChange){
                        return true;
                    }
                }
                if(type === 'king'){ //not possible, but prevents pieces from trying it
                    if ((rChange <= 1 && cChange <= 1)){
                        return true;
                    }
                }
                // I HATE PAWNS SO MUCH
                // simplest piece is the genuine worst
                if (type === 'pawn'){
                    if (color === 'w'){
                        if ((kPiece.position - 7 === pos) || (kPiece.position - 9 === pos)){
                            return true;
                        }
                    }
                    else{
                        if ((kPiece.position + 7 === pos) || (kPiece.position + 9 === pos)){
                            return true;
                        }
                }
                
                
            }   
            } 
        })
        if (inCheck) return true;

        //Knight Swap
        kPiece = new Knight('knight', kPiece.position, kPiece.id, kPiece.color)
        accessibleAt = kPiece.assessMoves(testBoard.boardState); //knights are cool and don't need to be told they're looking for check
        inCheck = accessibleAt.some((pos)=>{ //check if any pieces are a knight
            const type = testBoard.boardState[pos].type;
            if (type === 'knight'){
                return true;
            }
        })
        if (inCheck) return true;
        //i coudlnt delete testboard at end so i turned it to null instead
        testBoard = null;  
        return false;
    } 
    
    #checkForCheckMate(color){
        return !this.boardsPieces.some((piece) => {
            if (piece && piece.color === color){
                const moves = piece.assessMoves(this.boardState);
                return moves.some((move)=>{
                    return !(this.#checkForCheck(color, piece.position, move)) //color to check, kings location, potential move
                })
            }
        })
    }
}



const gameBoard = new Board();



