import {Board} from './board.js'

// get the buttons \\
const app = document.querySelector('.js-app')

//renderMainMenu();
renderMainMenu();


function renderMainMenu(){
    app.innerHTML = `
        <div class="js-main-menu menu-container">
            <div class="js-local-game clickable-button index-button">
                Local Game
            </div>
        </div>`
    renderMainMenuButtons();
}
function renderMainMenuButtons(){
    const localGameButton = document.querySelector('.js-local-game');
    localGameButton.addEventListener('click', ()=>{
       renderLocalGames();
    })
}

// ""


function renderLocalGames(){
    app.innerHTML =`
        <div class="menu-container game-menu-container">
            <div class="header">
                    <button class="js-back-button clickable-button">Back</button>
                    Your Games 
                    <button class="js-new-game clickable-button">New Game</button>    
            </div>

            <div class="js-games-list game-list"></div>

            </div>  
        </div> 
    `

    let gameListHTML = '';
    const activeGameKeys = JSON.parse(localStorage.getItem('activeGameKeys'));
    if (activeGameKeys){
        activeGameKeys.forEach((key)=>{
            const board = JSON.parse(localStorage.getItem(key));
            if (!board) return; //if you dont make at least one move the game doesn't save
            gameListHTML += `
                <div class="game-option">
                            <div class="game-description">
                                <div>
                                    <p class="game-type">Local Game</p>
                                    <p class="game-info"></p>
                                    <p class="js-delete-game delete-game" data-board-id="${key}">Delete Game</p>
                                </div>
                                <p></p>
                            </div>
                            <div class="js-game-preview game-preview data-board-id="${key}">
                                <img src="./assets/king-${board.turn}.png">
                            </div>
                </div>
            `
        })
        document.querySelector('.js-games-list').innerHTML = gameListHTML;
    }
    
    renderGameMenuButtons();
}
function renderGameMenuButtons(){
    document.querySelector('.js-back-button').addEventListener('click', ()=>{
        renderMainMenu();
    });
    document.querySelector('.js-new-game').addEventListener('click', ()=>{
        createNewGame();
    })

    //picking a game
    document.querySelectorAll('.js-game-preview').forEach((game)=>{
        game.addEventListener('click', ()=>{
        const gameKey = game.dataset.boardId;
        console.log(gameKey)
        renderGameBoard(gameKey);
        
    })})
   //delete a game
    document.querySelectorAll('.js-delete-game').forEach((deleteButton)=>{
        deleteButton.addEventListener('click', ()=>{
            
            const gameKey = deleteButton.dataset.boardId;
            localStorage.removeItem(gameKey);
        })
    })
}



function renderGameBoard(gameKey){
    app.innerHTML = `
        <div class="board-header">
                <button class="js-back-button clickable-button"> Back </button>
                <div class="toggle-moves-container">
                    <span>Hide Moves</span>
                    <input type="checkbox" class="js-toggle-moves toggle-moves-checkbox">
                </div>
            </div>

            <div class="js-board board"></div>
            <div class="js-promotion-ui promotion-ui">
                <button class="js-promotion-button clickable-button" data-type="queen">Queen</button>
                <button class="js-promotion-button clickable-button" data-type="rook">Rook</button>
                <button class="js-promotion-button clickable-button" data-type="bishop">Bishop</button>  
                <button class="js-promotion-button clickable-button" data-type="knight">Knight</button>
            </div>
        </div>
        `
        const gameData = JSON.parse(localStorage.getItem(gameKey));
        //if it's a brand new game
        if (!gameData){
            const currentBoard = new Board()
            currentBoard.boardId = gameKey;
        }
        else{  
            const currentBoard = new Board(false, gameData.boardPieces, gameData.turn); //false, pieces, turn
            currentBoard.boardId = gameKey;
            currentBoard.toggleShowMoves = gameData.toggleShowMoves;// set old preference
        }
        

        //render back button
        document.querySelector('.js-back-button').addEventListener('click', ()=>{
            renderLocalGames();
        })
}

function createNewGame(){
    const newGameId = crypto.randomUUID()
    let gameKeys = JSON.parse(localStorage.getItem('activeGameKeys'))
    if (gameKeys){
       gameKeys.push(newGameId) 
    }
    else{
        gameKeys = [newGameId]
    }
    localStorage.setItem('activeGameKeys', JSON.stringify(gameKeys))
    renderGameBoard(newGameId);
}




