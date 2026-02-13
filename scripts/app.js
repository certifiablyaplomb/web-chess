import { Board } from "./board.js";
import { pieceMap, pieceObjects } from './pieces.js'


new Board;


//ill leave this for now because it's partially ui and not board-- but will proabbly be moved to board
document.querySelectorAll('.js-promotion-button').forEach((button)=>{
    button.addEventListener('click', ()=>{
        const promotionUi = document.querySelector('.js-promotion-ui');
        const pieceId = promotionUi.dataset.pieceId;
        const type = button.dataset.type;
        pieceObjects[pieceId].type = type;

        const { position, id, color } = pieceObjects[pieceId];
        const newPieceClass = pieceMap[type];
        pieceObjects[id] = new newPieceClass(type, position, id, color);
        //refresh tile
        const tileImage = document.querySelector(`.js-board-square-${position}`).querySelector('img');
        console.log(tileImage)
        console.log(pieceObjects[id])
        tileImage.src = `
        ./assets/${pieceObjects[id].type}-${color}.png`
        promotionUi.style.display = 'none';
    })
})  


