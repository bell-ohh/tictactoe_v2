
let player1Mark = "";
let player2Mark = "";
let xScore = 0;
let oScore = 0;
let ties = 0;
let currentTurn = "X";
let soloGame;
let roundOver = false;
let wonGame = false;

const winCombos = [
    [0, 1, 2], [0, 3, 6], [0, 4, 8],
    [1, 4, 7], [2, 5, 8], [2, 4, 6],
    [3, 4, 5], [6, 7, 8]
];

// Main Menu Elements
const vsCpuBttn = document.querySelector("#vs-cpu");
const vsPlayerBttn = document.querySelector("#vs-player");
const selectX = document.querySelector("#select-x");
const selectO = document.querySelector("#select-o");
const main = document.querySelector("main");
const mainMenu = document.querySelector("#main-menu");

// Game Board Elements
const boardContainer = document.querySelector("#board-container");
const turnEl = document.querySelector("#turn");
const restartBttn = document.querySelector("#restart-bttn");
const confirmRestartEl = document.querySelector("#confirm-restart");
const cancelRestartBttn = document.querySelector("#cancel-restart-bttn");
const confirmRestartBttn = document.querySelector("#confirm-restart-bttn");
const displayWinnerEl = document.querySelector("#display-winner");
const winnerMessage = document.querySelector("#winner-message");
const winnerEl = document.querySelector("#winner");
const winnerText = document.querySelector("#winner-text");
const xScoreEl = document.querySelector("#x-score");
const oScoreEl = document.querySelector("#o-score");
const tiesEl = document.querySelector("#total-ties");
const xPlayerEl = document.querySelector("#x-player");
const oPlayerEl = document.querySelector("#o-player");
const quitBttn = document.querySelector("#quit-bttn");
const nextRoundBttn = document.querySelector("#next-round-bttn");
const tiles = document.querySelectorAll(".tile");

// Main Menu Event Listeners
vsCpuBttn.addEventListener("click", () => {
    if (player1Mark === "") return;
    soloGame = true;
    mainMenu.style.display = "none";
    boardContainer.style.display = "flex";

    if (player1Mark === "X") {
        xPlayerEl.textContent = "YOU";
        oPlayerEl.textContent = "CPU";
    } else {
        xPlayerEl.textContent = "CPU";
        oPlayerEl.textContent = "YOU";
        setTimeout(cpuMove, 2000);
    }
});

vsPlayerBttn.addEventListener("click", () => {
    if (player1Mark === "") return;
    soloGame = false;
    mainMenu.style.display = "none";
    boardContainer.style.display = "flex";

    if (player1Mark === "X") {
        xPlayerEl.textContent = "P1";
        oPlayerEl.textContent = "P2";
    } else {
        xPlayerEl.textContent = "P2";
        oPlayerEl.textContent = "P1";
    }
});

selectX.addEventListener("click", () => {
    player1Mark = "X";
    selectX.style.backgroundColor = "#31C3BD";
    selectO.style.backgroundColor = "#A8BFC9";
});

selectO.addEventListener("click", () => {
    player1Mark = "O";
    selectO.style.backgroundColor = "#FFC860";
    selectX.style.backgroundColor = "#1A2A33";
});

restartBttn.addEventListener("click", confirmRestartGame);
cancelRestartBttn.addEventListener("click", cancelRestartGame);
confirmRestartBttn.addEventListener("click", restartGame);
quitBttn.addEventListener("click", restartGame);
nextRoundBttn.addEventListener("click", nextRound);

tiles.forEach((tile) => {
    tile.addEventListener("click", (e) => {
        if (tile.disabled || wonGame) return;

        if (!soloGame) {
            markTile(e.target, currentTurn);
            currentTurn = currentTurn === "X" ? "O" : "X";
        } else {
            markTile(e.target, currentTurn);
            currentTurn = currentTurn === "X" ? "O" : "X";
            setTimeout(cpuMove, 2000);
        }
    });
});

function markTile(tile, mark) {
    if (!tile) {
        return;
    }

    const icon = mark === "X" ? "assets/icon-x.svg" : "assets/icon-o.svg";
    tile.innerHTML = `<img src="assets/${icon}" alt="${mark} icon" class="icon">`;
    tile.dataset.val = mark;
    tile.disabled = true;
    updateTurnIcon();
    checkWinner();
}


function updateTurnIcon() {
    const icon = currentTurn === "X" ? "/ssets/xmark-solid.svg" : "assets/o-solid-grey.svg";
    turnEl.innerHTML = `<img src="assets/${icon}" class="turn-icon" alt="">`;
}

function enableGameboard() {
    tiles.forEach((tile) => tile.disabled = false);
}

function cpuMove() {
    if (wonGame) return;
    const availableCells = [...tiles].filter(tile => !tile.disabled);
    const index = Math.floor(Math.random() * availableCells.length);
    const tile = availableCells[index];
    const mark = player1Mark === "X" ? "O" : "X";
    markTile(tile, mark);
    currentTurn = player1Mark;
}

function checkWinner() {
    for (let combo of winCombos) {
        const [a, b, c] = combo;
        const pos1 = tiles[a].dataset.val;
        const pos2 = tiles[b].dataset.val;
        const pos3 = tiles[c].dataset.val;

        if (pos1 && pos1 === pos2 && pos2 === pos3) {
            const winner = pos1;
            highlightWin(combo, winner);
            updateScore(winner);
            displayWinMessage(winner);
            wonGame = true;
            return;
        }
    }

    if ([...tiles].every(tile => tile.dataset.val)) {
        ties++;
        setTimeout(() => {
            displayRoundTied();
            tiesEl.textContent = ties;
        }, 1500);
    }
}

function highlightWin(combo, mark) {
    const color = mark === "X" ? "#65E9E4" : "#FFC860";
    const outline = mark === "X" ? "assets/icon-x-outline.svg" : "assets/icon-o-outline.svg";
    combo.forEach(index => {
        tiles[index].style.backgroundColor = color;
        tiles[index].innerHTML = `<img src="assets/${outline}" alt="${mark} icon" class="icon">`;
    });
}

function updateScore(mark) {
    if (mark === "X") {
        xScore++;
        setTimeout(() => xScoreEl.textContent = xScore, 1500);
    } else {
        oScore++;
        setTimeout(() => oScoreEl.textContent = oScore, 1500);
    }
}

function displayWinMessage(mark) {
    const isPlayer = soloGame ? (mark === player1Mark ? "YOU WON!" : "OH NO, YOU LOST") : (mark === player1Mark ? "PLAYER 1" : "PLAYER 2");
    const icon = mark === "X" ? "assets/icon-x.svg" : "assets/icon-o.svg";
    winnerMessage.textContent = soloGame ? isPlayer : `${isPlayer} WINS!`;
    winnerEl.innerHTML = `<img src="assets/${icon}" alt="${mark} icon" class="icon">`;
    winnerText.textContent = "TAKES THE ROUND";
    winnerText.style.color = mark === "X" ? "#31C3BD" : "#FFC860";
    displayWinnerEl.style.display = "flex";
}

function displayRoundTied() {
    winnerMessage.textContent = "";
    winnerEl.innerHTML = "";
    winnerText.textContent = "ROUND TIED";
    displayWinnerEl.style.display = "flex";
}

function confirmRestartGame() {
    confirmRestartEl.style.display = "flex";
}

function cancelRestartGame() {
    confirmRestartEl.style.display = "none";
}

function restartGame() {
    wonGame = false;
    soloGame = null;
    player1Mark = "";
    currentTurn = "X";
    ties = xScore = oScore = 0;

    confirmRestartEl.style.display = "none";
    boardContainer.style.display = "none";
    displayWinnerEl.style.display = "none";
    mainMenu.style.display = "flex";

    selectX.style.backgroundColor = "#1A2A33";
    selectO.style.backgroundColor = "#A8BFC9";
    winnerMessage.textContent = "";
    winnerText.textContent = "";
    winnerEl.innerHTML = "";
    winnerText.style.color = "#DBE8ED";

    tiesEl.textContent = xScoreEl.textContent = oScoreEl.textContent = "";
    xPlayerEl.textContent = oPlayerEl.textContent = "";
    updateTurnIcon();
    resetTiles();
    enableGameboard();
}

function nextRound() {
    wonGame = false;
    displayWinnerEl.style.display = "none";
    currentTurn = "X";
    updateTurnIcon();
    resetTiles();
    enableGameboard();

    if (soloGame && player1Mark === "O") {
        setTimeout(cpuMove, 2000);
    }
}

function resetTiles() {
    tiles.forEach(tile => {
        tile.innerHTML = "";
        tile.dataset.val = "";
        tile.style.backgroundColor = "#1F3641";
    });
}