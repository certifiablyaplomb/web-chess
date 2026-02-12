import { renderBoardHtml, handleBoardInput } from "./board.js";
import { pieceMap, pieceObjects } from './pieces.js'

const board = document.querySelector('.js-board');

let turn = 'w';
//render board
renderApp();

document.querySelectorAll('.js-promotion-button').forEach((button)=>{
    button.addEventListener('click', ()=>{
        const promotionUi = document.querySelector('.js-promotion-ui');
        const pieceId = promotionUi.dataset.pieceId;
        const type = button.dataset.type;
        pieceObjects[pieceId].type = type;

        const { position, id, color } = pieceObjects[pieceId];
        const newPieceClass = pieceMap[type]
        pieceObjects[pieceId] = new newPieceClass(type, position, id, color)

        promotionUi.style.display = 'none';
        renderApp()
    })
})  

function renderApp(){
    board.innerHTML = renderBoardHtml();
    //instantiate button function
    document.querySelectorAll('.js-board-square').forEach((button)=>{
        button.addEventListener('click', ()=>{
            if(handleBoardInput(button, turn)){
                renderApp();
                turn = turn==='w'? 'b':'w';
    }})
})
}
