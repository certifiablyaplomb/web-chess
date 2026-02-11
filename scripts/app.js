import { renderBoardHtml, updateBoard } from "./objects/board.js";


const board = document.querySelector('.js-board');

//render board
renderApp();

function renderApp(){
    board.innerHTML = renderBoardHtml();
    //instantiate button function
    let pieceSelected = false;
    document.querySelectorAll('.js-board-square').forEach((button)=>{
        button.addEventListener('click', ()=>{
            //get data
            const {index, color} = button.dataset;

            //if it's a piece 
            const piece = button.querySelector('img');
            if(piece){
                //change css to signify clicked
                if(button.style.backgroundColor != 'lightgray' && !pieceSelected){
                    button.style.backgroundColor = 'lightgray';
                    pieceSelected = piece;
                }
                else if(piece === pieceSelected){
                    button.style.backgroundColor = '';
                    pieceSelected = null;
                }
            }
            else if(pieceSelected){
                updateBoard(pieceSelected.dataset.id, Number(index)) //piece id and new position
                renderApp();
            }
        })
})

}
