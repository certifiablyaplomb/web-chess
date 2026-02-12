import { renderBoardHtml, handleBoardInput } from "./board.js";
import { pieceObjects } from './pieces.js'

const board = document.querySelector('.js-board');

//render board
renderApp();
document.querySelectorAll('.js-promotion-button').forEach((button)=>{
    button.addEventListener('click', ()=>{
        const promotionUi = document.querySelector('.js-promotion-ui');
        const pieceId = promotionUi.dataset.pieceId;
        const type = button.dataset.type;
        pieceObjects[pieceId].type = type;
        promotionUi.style.display = 'none';
        renderApp()
    })
})  

function renderApp(){
    board.innerHTML = renderBoardHtml();
    //instantiate button function
    document.querySelectorAll('.js-board-square').forEach((button)=>{
        button.addEventListener('click', ()=>{
            if(handleBoardInput(button)){
                renderApp();
 
    }})
})
}
