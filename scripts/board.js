import { pieceObjects } from "./pieces.js";

export function renderBoardHtml(){
    let boardHtml = '';
    let parser = 0;
    let count = 0;
    boardState.forEach((tile, index)=>{
        const tileColor = (index - parser) % 2 === 0? 'w': 'b';
        boardHtml += 
        `<button 
        class="js-board-square board-square-${tileColor} js-board-square-${index}" 
        data-index=${index}>
        ${tile?`<img src='./assets/${tile.type}-${tile.color}.png' class="piece" data-id=${tile.id} data-color=${tile.color}`:''}
        </button>`;
        count++;
        if (count === 8){
            parser++;
            count = 0;
        }
    })
    return boardHtml;    
};
    

//returns true if update occurs
let availableMoves;
let pieceSelected = null;
let id;
let turn = 'w';
export function handleBoardInput(button){
    const {index} = button.dataset;
    const piece = button.querySelector('img');
    if(piece && piece.dataset.color === turn){
        
        if(!pieceSelected){ //if clicking piece for first time
            pieceSelected = piece;
            id = pieceSelected.dataset.id;

            button.style.backgroundColor = 'rgba(230, 230, 230, 0.568)';
            availableMoves = pieceObjects[id].assessMoves(boardState)
        }
        else if(pieceObjects[piece.dataset.id].color === turn){ //if clicking piece of same color
            //reset prev button
            const prevChoice = pieceObjects[id].position;
            colorMoves([prevChoice], '');
            colorMoves(availableMoves, '');

            if (pieceObjects[piece.dataset.id] != pieceObjects[pieceSelected.dataset.id]){
                //set new available moves
                button.style.backgroundColor = 'rgba(230, 230, 230, 0.568)';
                pieceSelected = piece;
                id = pieceSelected.dataset.id;
                availableMoves = pieceObjects[id].assessMoves(boardState)
            }
            else{
                pieceSelected=null;
                availableMoves=[];
            }
            
        }
        colorMoves(availableMoves, 'rgba(230, 230, 230, 0.8)');
    }
    
    else if(pieceSelected){
        if ( availableMoves.includes(Number(index)) ){
            movePiece(pieceObjects[id], Number(index));
        }
    }
    
}

async function movePiece(piece, newPosition){
    //check if pawn is getting promoted 
    if (piece.constructor.name === 'Pawn' && piece.isEndOfBoard(newPosition)){
        const promotionUi = window.document.querySelector('.js-promotion-ui');
        promotionUi.style.display='flex';
        promotionUi.dataset.pieceId = piece.id;
    }
    //VISUAL UPDATE
    const cPos = piece.position;
    const cTile = window.document.querySelector(`.js-board-square-${cPos}`);
    const nTile = window.document.querySelector(`.js-board-square-${newPosition}`);
    nTile.innerHTML = cTile.innerHTML;
    cTile.innerHTML = '';
    //BOARDSTATE UPDATE
    boardState[piece.position] = '';
    boardState[newPosition] = piece;
    //disinstantiate available moves
    colorMoves([piece.position], '');
    colorMoves(availableMoves, '');
    availableMoves = []
    //OBJECT UPDATE
    piece.position= newPosition;
    //swap turns
    turn = turn==='w'? 'b':'w';
    pieceSelected = null;
    
}

function colorMoves(moves, color){
    moves.forEach((tileIndex) => {
        const tile = window.document.querySelector(`.js-board-square-${tileIndex}`);
        tile.style.backgroundColor=color;
    })
}
    
// BOARD DATA \\
//this only runs once at execution
export const boardState = Array.from({ length: 64 }, (_, index) => {
  return pieceObjects.find((piece)=>piece.position === index) || '';
});