import { Queen, Knight, makePieces, pieceMap } from "./pieces.js";

export class Board{
    //variables assigned to null pre-construct are objects
    mainDisplay=false;
    boardsPieces=null;
    boardState = [];
    turn = '';
    pieceSelected = '';
    availableMoves = [];

    wKing = 0;
    bKing = 0;
    
    constructor(boardState=null, turn='w', wKing=null, bKing=null){
        this.boardsPieces = makePieces(); 
        if(!boardState){
            this.boardState = Array.from({ length: 64 }, (_, index) => {
            const piece = this.boardsPieces.find((piece)=>piece.position === index) || '';
            if (piece && piece.type === 'king'){
                piece.color === 'w'? this.wKing = piece.position : this.bKing = piece.position;
            }
            return piece;
            });
        }
        else{
            if (!wKing || !bKing){
                throw new Error("Fatal Error: no king position(s) provided")//yes, i could compute them anyways, but this feature is mostly for testing potential boardstates
            }                                                               //and in those situations it can get computationally expensive to look up those positions 64 * n! times
            this.boardState = boardState;
        }
        this.turn = turn;



        //only render html for a fresh board-- otherwise odds are it's BTS simulated moves
        if(!boardState){
            this.mainDisplay = true;
            this.#renderBoardHtml();
            this.#renderPromotionUI();
        }
    }
    //one time use //
   #renderBoardHtml(){
        const board = document.querySelector('.js-board');
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
            data-id=${tile.id} data-color=${tile.color}`:
            ''}
            </button>`;

            count++;
            if (count === 8){
                parser++;
                count = 0;
            }
        })

        board.innerHTML = boardHtml;    

        document.querySelectorAll('.js-board-square').forEach((button)=>{
        button.addEventListener('click', ()=>{
            this.#handleBoardInput(button);
            })
        })
    };  
    // one time use
    #renderPromotionUI(){
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
    if(piece && piece.dataset.color === this.turn){
        
        if(piece && !this.pieceSelected){ //if clicking piece for first time
            this.pieceSelected = piece;
            button.style.backgroundColor = 'rgba(230, 230, 230, 0.568)';
            this.availableMoves = this.boardsPieces[this.pieceSelected.dataset.id].assessMoves(this.boardState)
        }
        else if(piece && this.boardsPieces[piece.dataset.id].color === this.turn){ //if clicking piece of same color
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
                this.pieceSelected=null;
                this.availableMoves=[];
            }
            
        }
        this.#colorMoves(this.availableMoves, 'rgba(230, 230, 230, 0.8)');
    }
    
    else if(this.pieceSelected){
        if ( this.availableMoves.includes(Number(index)) ){
            this.#movePiece(this.boardsPieces[this.pieceSelected.dataset.id], Number(index));
        }
    }
    }

    #movePiece(piece, newPosition){
    //check if pawn is getting promoted 
        if (this.mainDisplay && piece.constructor.name === 'Pawn' && piece.isEndOfBoard(newPosition)){
            const promotionUi = document.querySelector('.js-promotion-ui');
            promotionUi.style.display='flex';
            promotionUi.dataset.pieceId = piece.id;
        }
        //VISUAL UPDATE
        const cPos = piece.position;
        const cTile = document.querySelector(`.js-board-square-${cPos}`);
        const nTile = document.querySelector(`.js-board-square-${newPosition}`);
        nTile.innerHTML = cTile.innerHTML;
        cTile.innerHTML = '';
        //BOARDSTATE UPDATE
        this.boardState[piece.position] = '';
        this.boardState[newPosition] = piece;
        //disinstantiate available moves
        this.#colorMoves([piece.position], '');
        this.#colorMoves(this.availableMoves, '');
        this.availableMoves = []
        //OBJECT UPDATE
        piece.position= newPosition;
        //swap turns
        this.turn = this.turn==='w'? 'b':'w';
        this.pieceSelected = null;

    }

    #colorMoves(moves, color){
        moves.forEach((tileIndex) => {
            const tile = document.querySelector(`.js-board-square-${tileIndex}`);
            tile.style.backgroundColor=color;
        })
    }

    //The complex shit probably, idk i havent written it yet

        
    #checkForCheck(){ //low level base function
        
    }

    
}

new Board();

//only need one across all boardstates 
