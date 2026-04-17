document.addEventListener("DOMContentLoaded", () => {

const BASE_URL = "https://prodigy-wd-03-1.onrender.com";

let socket;

// ✅ SAFE SOCKET LOAD
try {
    if (typeof io !== "undefined") {
        socket = io(BASE_URL);
    }
} catch (e) {
    console.log("Socket error:", e);
}

const board = document.getElementById("board");
const statusText = document.getElementById("status");

let gameMode = "ai";
let playerSymbol = "X";
let roomId = "";

let gameState = ["","","","","","","","",""];
let currentPlayer = "X";
let gameActive = true;

let xWins = 0, oWins = 0, draws = 0;

const patterns = [
 [0,1,2],[3,4,5],[6,7,8],
 [0,3,6],[1,4,7],[2,5,8],
 [0,4,8],[2,4,6]
];

// MODE CHANGE
document.getElementById("mode").addEventListener("change", e=>{
    gameMode = e.target.value;
    restartGame();
});

// CREATE BOARD
function createBoard(){
    board.innerHTML="";
    for(let i=0;i<9;i++){
        let cell=document.createElement("div");
        cell.classList.add("cell");
        cell.dataset.index=i;
        cell.onclick=handleClick;
        board.appendChild(cell);
    }
}

// CLICK
function handleClick(){
    let index=this.dataset.index;

    if(gameState[index]!=="" || !gameActive) return;

    if(gameMode==="multi" && currentPlayer!==playerSymbol) return;

    gameState[index]=currentPlayer;
    this.textContent=currentPlayer;

    if(gameMode==="multi" && socket){
        socket.emit("move",{index,player:currentPlayer,roomId});
    }

    checkWinner();

    if(gameMode==="ai" && currentPlayer==="O" && gameActive){
        setTimeout(aiMove,500);
    }
}

// CHECK WINNER
function checkWinner(){
    for(let p of patterns){
        let [a,b,c]=p;

        if(gameState[a] && gameState[a]===gameState[b] && gameState[a]===gameState[c]){
            statusText.textContent=gameState[a]+" Wins!";
            gameActive=false;

            // ✅ WIN ANIMATION
            p.forEach(i=>{
                document.querySelectorAll(".cell")[i].classList.add("win");
            });

            if(gameState[a]==="X") xWins++; else oWins++;
            updateScore();

            saveGame(gameState[a]);
            return;
        }
    }

    // ✅ DRAW FIX
    if(!gameState.includes("")){
        statusText.textContent="Draw!";
        gameActive = false; // IMPORTANT
        draws++;
        updateScore();

        saveGame("Draw");
        return;
    }

    currentPlayer=currentPlayer==="X"?"O":"X";
    statusText.textContent="Player "+currentPlayer+" Turn";
}

// SAVE HISTORY (LOCAL)
function saveGame(winner){
    let history = JSON.parse(localStorage.getItem("history")) || [];

    history.push({
        winner: winner,
        time: new Date().toLocaleString()
    });

    localStorage.setItem("history", JSON.stringify(history));
}

// SCORE
function updateScore(){
    document.getElementById("xWins").textContent=xWins;
    document.getElementById("oWins").textContent=oWins;
    document.getElementById("draws").textContent=draws;
}

// RESTART (FULL FIX)
function restartGame(){
    gameState = ["","","","","","","","",""];
    currentPlayer = "X";
    gameActive = true;

    statusText.textContent = "Player X Turn";

    // ✅ FULL RESET
    createBoard();
}

// AI MOVE
function aiMove(){
    let empty=gameState.map((v,i)=>v===""?i:null).filter(v=>v!==null);
    let move=empty[Math.floor(Math.random()*empty.length)];
    document.querySelectorAll(".cell")[move].click();
}

// SOCKET EVENTS
if (socket) {
    socket.on("startGame",({symbol})=>{
        playerSymbol=symbol;
    });

    socket.on("move",({index,player})=>{
        gameState[index]=player;
        document.querySelectorAll(".cell")[index].textContent=player;
        checkWinner();
    });
}

// INIT
createBoard();
window.restartGame = restartGame;
});
