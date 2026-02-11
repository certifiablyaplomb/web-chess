import { pieceData } from "../data/piecePositions.js";

export function renderBoardHtml(){
    let boardHtml = '';
    let parser = 0;
    let count = 0;
    for (let index = 0; index < 64; index++){
        let c_piece=null;
        pieceData.forEach((piece)=>{
            if(piece.position === index){
                c_piece = piece;
            }
        })
        const tileColor = (index - parser) % 2 === 0? 'w': 'b';
        boardHtml += 
        `<button 
        class="js-board-square board-square-${tileColor}" 
        data-index=${index} data-color=${tileColor}>
        ${c_piece?`<img src='./assets/${c_piece.name}.png' class="piece" data-id=${c_piece.id}></img>`:' '}
        </button>`;
        count++;
        if (count === 8){
            parser++;
            count = 0;
        }
    };
    return boardHtml;
}

export function updateBoard(pieceId, newPosition){
    pieceData[pieceId].position = newPosition; 
    console.log(pieceData[pieceId].position)
}

//returns true if update occurs
let pieceSelected = null;
export function handleBoardInput(button){
    const {index, color} = button.dataset;
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
                    //TBD check if legal move by piece HANDLE IN DIFFERENT PIECES FILE
                    updateBoard(pieceSelected.dataset.id, Number(index)); //piece id and new position'
                    pieceSelected = null;
                    return true;
                }
            }

            else if(pieceSelected){//if moving to open square
                //TBD check for legal move by piece HANDLE IN DIFFERENT PIECES FILE
                updateBoard(pieceSelected.dataset.id, Number(index)); //piece id and new position'
                pieceSelected = null;
                return true;
            }
            return false;
}

