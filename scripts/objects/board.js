import { pieceData } from "../../data/piecePositions.js";

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

