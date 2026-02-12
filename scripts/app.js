import { renderBoardHtml, handleBoardInput } from "./board.js";


const board = document.querySelector('.js-board');

//render board
renderApp();

function renderApp(){
    board.innerHTML = renderBoardHtml();
    //instantiate button function
    document.querySelectorAll('.js-board-square').forEach((button)=>{
        button.addEventListener('click', ()=>{
            if(handleBoardInput(button)){
                renderApp();
                console.log('rendered')
            };
        })
})
}
