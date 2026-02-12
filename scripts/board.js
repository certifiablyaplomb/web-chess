import { pieceObjects } from "./pieces.js";



export function renderBoardHtml(){
    let boardHtml = '';
    let parser = 0;
    let count = 0;
    boardState.forEach((tile, index)=>{
        const tileColor = (index - parser) % 2 === 0? 'w': 'b';
        boardHtml += 
        `<button 
        class="js-board-square board-square-${tileColor}" 
        data-index=${index}>
        ${tile?`<img src='./assets/${tile.type}-${tile.color}.png' class="piece" data-id=${tile.id}>`:''}
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
let pieceSelected = null;
export function handleBoardInput(button){
    const {index} = button.dataset;
    const piece = button.querySelector('img');
    if(piece){
        if(button.style.backgroundColor != 'lightgray' && !pieceSelected){ //if clicking piece for first time
            button.style.backgroundColor = 'lightgray';
            pieceSelected = piece;
        }
        else if(piece === pieceSelected){ //if reclicking same piece
            button.style.backgroundColor = '';
            pieceSelected = null;
        }
        else if(pieceSelected){ //if trying to move piece to other piece
            const id = pieceSelected.dataset.id
            if (pieceObjects[id].attemptMove(Number(index), boardState)){
                pieceSelected = null;
                return true;
        } 
        }
    }
    else if(pieceSelected){//if moving to open square
        const id = pieceSelected.dataset.id
        if (pieceObjects[id].attemptMove(Number(index), boardState)){
            pieceSelected = null;
            return true;
        }  
    }
    return false;
}

// BOARD DATA \\
//this only runs once at execution
export const boardState = Array.from({ length: 64 }, (_, index) => {
  return pieceObjects.find((piece)=>piece.position === index) || '';
});