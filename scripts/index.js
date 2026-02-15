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
            <div class="clickable-button index-button">
                Computer
            </div>
            <div class="clickable-button index-button">
                Find a Game
            </div>
            <div class="clickable-button index-button">
                Settings
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


function renderLocalGames(){
    app.innerHTML =`
        <div class="menu-container">
            <div class="header">
                    <button class="js-back-button clickable-button">Back</button>
                    Your Games 
                    <button class="clickable-button">New Game</button>
                    
            </div>
            <div class="game-list">
                <div class="js-game-option game-option">
                    <div class="game-description">
                        <div>
                            <p class="game-type">Local Game</p>
                            <p class="game-info">Last Played 2 days ago</p>
                        </div>
                        <p>Your Turn</p>
                    </div>
                    <div class="js-game-preview game-preview">
                        <img src="./assets/king-b.png">
                    </div>
                </div>
                <div class="js-game-option game-option">
                    <div class="game-description">
                        <div>
                            <p class="game-type">Local Game</p>
                            <p class="game-info">Last Played 2 days ago</p>
                        </div>
                        <p>Your Turn</p>
                    </div>
                    <div class="js-game-preview game-preview">
                        <img src="./assets/king-b.png">
                    </div>
                </div>
                <div class="js-game-option game-option">
                    <div class="game-description">
                        <div>
                            <p class="game-type">Local Game</p>
                            <p class="game-info">Last Played 2 days ago</p>
                        </div>
                        <p>Your Turn</p>
                    </div>
                    <div class="js-game-preview game-preview">
                        <img src="./assets/king-b.png">
                    </div>
                </div>
                <div class="js-game-option game-option">
                    <div class="game-description">
                        <div>
                            <p class="game-type">Local Game</p>
                            <p class="game-info">Last Played 2 days ago</p>
                        </div>
                        <p>Your Turn</p>
                    </div>
                    <div class="js-game-preview game-preview">
                        <img src="./assets/king-b.png">
                    </div>
                </div>
                <div class="js-game-option game-option">
                    <div class="game-description">
                        <div>
                            <p class="game-type">Local Game</p>
                            <p class="game-info">Last Played 2 days ago</p>
                        </div>
                        <p>Your Turn</p>
                    </div>
                    <div class="js-game-preview game-preview">
                        <img src="./assets/king-b.png">
                    </div>
                </div>
                <div class="js-game-option game-option">
                    <div class="game-description">
                        <div>
                            <p class="game-type">Local Game</p>
                            <p class="game-info">Last Played 2 days ago</p>
                        </div>
                        <p>Your Turn</p>
                    </div>
                    <div class="js-game-preview game-preview">
                        <img src="./assets/king-b.png">
                    </div>
                </div>
                <div class="js-game-option game-option">
                    <div class="game-description">
                        <div>
                            <p class="game-type">Local Game</p>
                            <p class="game-info">Last Played 2 days ago</p>
                        </div>
                        <p>Your Turn</p>
                    </div>
                    <div class="js-game-preview game-preview">
                        <img src="./assets/king-b.png">
                    </div>
                </div>
                <div class="js-game-option game-option">
                    <div class="game-description">
                        <div>
                            <p class="game-type">Local Game</p>
                            <p class="game-info">Last Played 2 days ago</p>
                        </div>
                        <p>Your Turn</p>
                    </div>
                    <div class="js-game-preview game-preview">
                        <img src="./assets/king-b.png">
                    </div>
                </div>
                <div class="js-game-option game-option">
                    <div class="game-description">
                        <div>
                            <p class="game-type">Local Game</p>
                            <p class="game-info">Last Played 2 days ago</p>
                        </div>
                        <p>Your Turn</p>
                    </div>
                    <div class="js-game-preview game-preview">
                        <img src="./assets/king-b.png">
                    </div>
                </div>
                <div class="js-game-option game-option">
                    <div class="game-description">
                        <div>
                            <p class="game-type">Local Game</p>
                            <p class="game-info">Last Played 2 days ago</p>
                        </div>
                        <p>Your Turn</p>
                    </div>
                    <div class="js-game-preview game-preview">
                        <img src="./assets/king-b.png">
                    </div>
                </div>
                <div class="js-game-option game-option">
                    <div class="game-description">
                        <div>
                            <p class="game-type">Local Game</p>
                            <p class="game-info">Last Played 2 days ago</p>
                        </div>
                        <p>Your Turn</p>
                    </div>
                    <div class="js-game-preview game-preview">
                        <img src="./assets/king-b.png">
                    </div>
                </div>
            </div>  
        </div> 
    `
    renderGameMenuButtons();
}
function renderGameMenuButtons(){
    document.querySelector('.js-back-button').addEventListener('click', ()=>{
        renderMainMenu();
    });
   
}






const exampleStruct={
    name:'mike',
    age:22,
    occupation:{
        location:'munds park',
        pay: 'bad'
    }
}
console.log(JSON.parse(JSON.stringify(exampleStruct)))
