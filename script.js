// ==========================================
// TIC-TAC-TOE AI ARENA
// ==========================================

// ---------- ELEMENTS ----------

const cells = document.querySelectorAll(".cell");

const aiModeBtn = document.getElementById("aiModeBtn");
const friendsModeBtn = document.getElementById("friendsModeBtn");
const gameCard = document.getElementById("gameCard");

const difficultySelect =
    document.getElementById("difficulty");

const starterSelect =
    document.getElementById("starter");

const localStarterSelect =
    document.getElementById("localStarter");

const matchFormatSelect =
    document.getElementById("matchFormat");

const symbolButtons =
    document.querySelectorAll(".symbol-btn");

const aiSettings =
    document.getElementById("aiSettings");

const localSettings =
    document.getElementById("localSettings");

const symbolGroup =
    document.getElementById("symbolGroup");

const playerName =
    document.getElementById("playerName");

const opponentName =
    document.getElementById("opponentName");

const playerSymbolText =
    document.getElementById("playerSymbol");

const opponentSymbolText =
    document.getElementById("opponentSymbol");

const playerScoreText =
    document.getElementById("playerScore");

const opponentScoreText =
    document.getElementById("opponentScore");

const turnMessage =
    document.getElementById("turnMessage");

const resultMessage =
    document.getElementById("resultMessage");

const roundNumber =
    document.getElementById("roundNumber");

const matchText =
    document.getElementById("matchText");

const matchPointText =
    document.getElementById("matchPointText");

const progressFill =
    document.getElementById("progressFill");

const restartBtn =
    document.getElementById("restartBtn");

const newMatchBtn =
    document.getElementById("newMatchBtn");

const startMatchBtn =
    document.getElementById("startMatchBtn");

const resetSettingsBtn =
    document.getElementById("resetSettingsBtn");

const swapBtn =
    document.getElementById("swapBtn");

const modal =
    document.getElementById("gameModal");

const modalIcon =
    document.getElementById("modalIcon");

const modalTitle =
    document.getElementById("modalTitle");

const modalMessage =
    document.getElementById("modalMessage");

const primaryModalBtn =
    document.getElementById("primaryModalBtn");

const secondaryModalBtn =
    document.getElementById("secondaryModalBtn");


// ---------- GAME VARIABLES ----------

let board = [
    "", "", "",
    "", "", "",
    "", "", ""
];

let gameMode = "ai";

let playerSymbol = "X";

let opponentSymbol = "O";

let currentTurn = "player";

let gameActive = true;

let round = 1;

let playerScore = 0;

let opponentScore = 0;

let matchFormat = 3;

let matchStarted = false;


// ---------- WINNING COMBINATIONS ----------

const winningConditions = [

    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],

    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],

    [0, 4, 8],
    [2, 4, 6]

];


// ==========================================
// MODE BUTTONS
// ==========================================

function applyModeUI() {

    const isAiMode = gameMode === "ai";

    aiModeBtn.classList.toggle("active", isAiMode);
    friendsModeBtn.classList.toggle("active", !isAiMode);

    gameCard.classList.toggle("ai-mode", isAiMode);
    gameCard.classList.toggle("local-mode", !isAiMode);

    if (aiSettings) {
        aiSettings.classList.toggle("hidden", !isAiMode);
    }

    if (localSettings) {
        localSettings.classList.toggle("hidden", isAiMode);
    }

    if (symbolGroup) {
        symbolGroup.classList.toggle("hidden", !isAiMode);
    }

    if (isAiMode) {
        playerName.textContent = "YOU";
        opponentName.textContent = "AI";
    }
    else {
        playerName.textContent = "PLAYER 1";
        opponentName.textContent = "PLAYER 2";
    }

    updateSymbols();
}

function setControlsLocked(locked) {
    const controls = [
        ...document.querySelectorAll("select, .symbol-btn, .swap-btn")
    ];

    controls.forEach(control => {
        control.disabled = locked;
    });

    if (aiModeBtn) aiModeBtn.disabled = locked;
    if (friendsModeBtn) friendsModeBtn.disabled = locked;

    gameCard.classList.toggle("locked", locked);
    updateSetupButtons();
}

function updateSetupButtons() {
    const setupActions = document.getElementById("setupActions");
    if (!setupActions) return;

    const showSetup = !matchStarted;
    setupActions.classList.toggle("hidden", !showSetup);

    if (startMatchBtn) {
        startMatchBtn.disabled = matchStarted;
    }

    if (resetSettingsBtn) {
        resetSettingsBtn.disabled = matchStarted;
    }
}

function showModal({ icon, title, message, primaryText, secondaryText, primaryAction, secondaryAction }) {
    modalIcon.textContent = icon;
    modalTitle.textContent = title;
    modalMessage.textContent = message;
    primaryModalBtn.textContent = primaryText;
    secondaryModalBtn.textContent = secondaryText;
    primaryModalBtn.onclick = primaryAction;
    secondaryModalBtn.onclick = secondaryAction;
    modal.classList.remove("hidden");
}

function hideModal() {
    modal.classList.add("hidden");
}

function triggerCelebration() {
    const layer = document.getElementById("celebrationLayer");
    if (!layer) return;

    layer.innerHTML = "";

    const colors = ["#38bdf8", "#f472b6", "#22c55e", "#fbbf24", "#a78bfa", "#f97316"];

    for (let i = 0; i < 28; i++) {
        const piece = document.createElement("span");
        piece.className = "celebration-piece";
        piece.style.background = colors[i % colors.length];
        piece.style.left = "50%";
        piece.style.top = "50%";
        piece.style.setProperty("--x", String((Math.random() - 0.5) * 600));
        piece.style.setProperty("--y", String((Math.random() - 0.5) * 420));
        piece.style.setProperty("--r", `${(Math.random() - 0.5) * 720}deg`);
        layer.appendChild(piece);
    }

    setTimeout(() => {
        layer.innerHTML = "";
    }, 1200);
}

function openStartModal() {
    showModal({
        icon: "🎯",
        title: "Ready to begin?",
        message: "Choose your settings, then start the match when you are ready.",
        primaryText: "Start Match",
        secondaryText: "Reset Settings",
        primaryAction: beginMatch,
        secondaryAction: resetSettings
    });
}

function lockMatchSettings() {
    setControlsLocked(true);
    restartBtn.disabled = false;
    newMatchBtn.disabled = false;
}

function unlockMatchSettings() {
    setControlsLocked(false);
    restartBtn.disabled = false;
    newMatchBtn.disabled = false;
}

aiModeBtn.addEventListener("click", () => {

    if (matchStarted) {
        return;
    }

    gameMode = "ai";
    applyModeUI();
    resetMatch();

});


friendsModeBtn.addEventListener("click", () => {

    if (matchStarted) {
        return;
    }

    gameMode = "friends";
    applyModeUI();
    resetMatch();

});


// ==========================================
// SYMBOL SELECTION
// ==========================================

symbolButtons.forEach(button => {

    button.addEventListener("click", () => {

        if (matchStarted || gameMode !== "ai") {
            return;
        }

        symbolButtons.forEach(btn => {

            btn.classList.remove("active");

        });

        button.classList.add("active");

        playerSymbol =
            button.dataset.symbol;

        opponentSymbol =
            playerSymbol === "X"
                ? "O"
                : "X";

        updateSymbols();

    });

});


// ==========================================
// SWAP SYMBOLS
// ==========================================

swapBtn.addEventListener("click", () => {

    if (matchStarted || gameMode !== "ai") {
        return;
    }

    playerSymbol =
        playerSymbol === "X"
            ? "O"
            : "X";

    opponentSymbol =
        playerSymbol === "X"
            ? "O"
            : "X";


    symbolButtons.forEach(button => {

        button.classList.toggle(
            "active",
            button.dataset.symbol === playerSymbol
        );

    });

    updateSymbols();

});


// ==========================================
// UPDATE SYMBOLS
// ==========================================

function updateSymbols() {

    if (gameMode === "friends") {
        playerSymbolText.textContent = "X";
        opponentSymbolText.textContent = "O";

        playerSymbolText.className = "score-symbol x-symbol";
        opponentSymbolText.className = "score-symbol o-symbol";
        return;
    }

    playerSymbolText.textContent =
        playerSymbol;

    opponentSymbolText.textContent =
        opponentSymbol;


    playerSymbolText.className =
        "score-symbol " +
        (
            playerSymbol === "X"
                ? "x-symbol"
                : "o-symbol"
        );


    opponentSymbolText.className =
        "score-symbol " +
        (
            opponentSymbol === "X"
                ? "x-symbol"
                : "o-symbol"
        );

}


// ==========================================
// MATCH FORMAT
// ==========================================

matchFormatSelect.addEventListener(
    "change",
    () => {

        if (matchStarted) {
            return;
        }

        matchFormat =
            Number(matchFormatSelect.value);

        updateScore();
        updateProgress();

    }
);


// ==========================================
// STARTER
// ==========================================

starterSelect.addEventListener(
    "change",
    () => {

        if (matchStarted) {
            return;
        }

    }
);

localStarterSelect.addEventListener(
    "change",
    () => {

        if (matchStarted) {
            return;
        }

    }
);


// ==========================================
// CELL CLICK
// ==========================================

cells.forEach(cell => {

    cell.addEventListener(
        "click",
        () => {

            const index =
                Number(cell.dataset.index);

            playerMove(index);

        }
    );

});


// ==========================================
// PLAYER MOVE
// ==========================================

function playerMove(index) {

    if (!gameActive) {
        return;
    }

    if (board[index] !== "") {
        return;
    }

    if (gameMode === "ai") {
        if (currentTurn !== "player") {
            return;
        }

        makeMove(index, playerSymbol);
    }
    else {
        const symbol = currentTurn === "player1" ? "X" : "O";
        makeMove(index, symbol);
    }

    const result =
        checkGame();

    if (result) {

        finishRound(result);

        return;

    }

    switchTurn();


    if (
        gameMode === "ai" &&
        currentTurn === "opponent"
    ) {

        turnMessage.textContent =
            "🤖 AI is analyzing your move...";

        setTimeout(
            makeAIMove,
            450
        );

    }

}


// ==========================================
// MAKE MOVE
// ==========================================

function makeMove(index, symbol) {

    board[index] = symbol;

    cells[index].textContent =
        symbol;


    cells[index].classList.add(
        symbol === "X"
            ? "x"
            : "o"
    );

}


// ==========================================
// SWITCH TURN
// ==========================================

function switchTurn() {

    if (gameMode === "friends") {
        currentTurn =
            currentTurn === "player1"
                ? "player2"
                : "player1";
    }
    else {
        currentTurn =
            currentTurn === "player"
                ? "opponent"
                : "player";
    }

    updateTurnText();

}


// ==========================================
// TURN TEXT
// ==========================================

function updateTurnText() {

    if (!gameActive) {
        return;
    }

    if (gameMode === "ai") {

        if (currentTurn === "player") {

            turnMessage.textContent =
                `Your turn — play ${playerSymbol}`;

        }
        else {

            turnMessage.textContent =
                "🤖 AI's turn";

        }

    }
    else {

        if (currentTurn === "player1") {

            turnMessage.textContent =
                "🎮 Player 1's turn — X";

        }
        else {

            turnMessage.textContent =
                "🎮 Player 2's turn — O";

        }

    }

}


// ==========================================
// AI MOVE
// ==========================================

function makeAIMove() {

    if (!gameActive) {
        return;
    }

    let move;

    const difficulty =
        difficultySelect.value;


    if (difficulty === "easy") {

        move = randomMove();

    }

    else if (difficulty === "medium") {

        move = mediumMove();

    }

    else {

        move = bestMove();

    }


    if (move !== undefined) {

        makeMove(
            move,
            opponentSymbol
        );

    }


    const result =
        checkGame();

    if (result) {

        finishRound(result);

        return;

    }


    currentTurn = "player";

    updateTurnText();

}


// ==========================================
// EASY AI
// ==========================================

function randomMove() {

    const emptyCells =
        getEmptyCells();

    if (emptyCells.length === 0) {
        return undefined;
    }

    return emptyCells[
        Math.floor(
            Math.random() *
            emptyCells.length
        )
    ];

}


// ==========================================
// MEDIUM AI
// ==========================================

function mediumMove() {

    // Try to win
    const winningMove =
        findTacticalMove(
            opponentSymbol
        );

    if (winningMove !== undefined) {
        return winningMove;
    }


    // Block player
    const blockingMove =
        findTacticalMove(
            playerSymbol
        );

    if (blockingMove !== undefined) {
        return blockingMove;
    }


    // Take center
    if (board[4] === "") {
        return 4;
    }


    // Take corner
    const corners =
        [0, 2, 6, 8];

    const freeCorners =
        corners.filter(
            index =>
                board[index] === ""
        );

    if (freeCorners.length > 0) {

        return freeCorners[
            Math.floor(
                Math.random() *
                freeCorners.length
            )
        ];

    }


    return randomMove();

}


// ==========================================
// FIND TACTICAL MOVE
// ==========================================

function findTacticalMove(symbol) {

    for (let i = 0; i < board.length; i++) {

        if (board[i] === "") {

            board[i] = symbol;

            const winner =
                getWinner(board);

            board[i] = "";

            if (winner === symbol) {

                return i;

            }

        }

    }

    return undefined;

}


// ==========================================
// HARD AI
// MINIMAX
// ==========================================

function bestMove() {

    let bestScore = -Infinity;

    let move;


    for (
        let i = 0;
        i < board.length;
        i++
    ) {

        if (board[i] === "") {

            board[i] =
                opponentSymbol;


            const score =
                minimax(
                    board,
                    false
                );


            board[i] = "";


            if (score > bestScore) {

                bestScore = score;

                move = i;

            }

        }

    }


    return move;

}


// ==========================================
// MINIMAX
// ==========================================

function minimax(
    currentBoard,
    isMaximizing
) {

    const winner =
        getWinner(currentBoard);


    if (
        winner === opponentSymbol
    ) {

        return 10;

    }


    if (
        winner === playerSymbol
    ) {

        return -10;

    }


    if (
        !currentBoard.includes("")
    ) {

        return 0;

    }


    // AI maximizing
    if (isMaximizing) {

        let bestScore =
            -Infinity;


        for (
            let i = 0;
            i < currentBoard.length;
            i++
        ) {

            if (
                currentBoard[i] === ""
            ) {

                currentBoard[i] =
                    opponentSymbol;


                const score =
                    minimax(
                        currentBoard,
                        false
                    );


                currentBoard[i] = "";


                bestScore =
                    Math.max(
                        bestScore,
                        score
                    );

            }

        }


        return bestScore;

    }


    // Player minimizing
    else {

        let bestScore =
            Infinity;


        for (
            let i = 0;
            i < currentBoard.length;
            i++
        ) {

            if (
                currentBoard[i] === ""
            ) {

                currentBoard[i] =
                    playerSymbol;


                const score =
                    minimax(
                        currentBoard,
                        true
                    );


                currentBoard[i] = "";


                bestScore =
                    Math.min(
                        bestScore,
                        score
                    );

            }

        }


        return bestScore;

    }

}


// ==========================================
// CHECK GAME
// ==========================================

function checkGame() {

    const winner =
        getWinner(board);


    if (winner) {

        highlightWinner();

        return winner;

    }


    if (
        !board.includes("")
    ) {

        return "draw";

    }


    return null;

}


// ==========================================
// WINNER
// ==========================================

function getWinner(currentBoard) {

    for (
        const condition
        of winningConditions
    ) {

        const [
            a,
            b,
            c
        ] = condition;


        if (

            currentBoard[a] !== "" &&

            currentBoard[a] ===
            currentBoard[b] &&

            currentBoard[a] ===
            currentBoard[c]

        ) {

            return currentBoard[a];

        }

    }


    return null;

}


// ==========================================
// FIND WINNING LINE
// ==========================================

function getWinningLine() {

    for (
        const condition
        of winningConditions
    ) {

        const [
            a,
            b,
            c
        ] = condition;


        if (

            board[a] !== "" &&

            board[a] === board[b] &&

            board[a] === board[c]

        ) {

            return condition;

        }

    }


    return null;

}


// ==========================================
// HIGHLIGHT WINNER
// ==========================================

function highlightWinner() {

    const line =
        getWinningLine();


    if (!line) {
        return;
    }


    line.forEach(index => {

        cells[index]
            .classList
            .add("winner");

    });

}


// ==========================================
// FINISH ROUND
// ==========================================

function finishRound(result) {

    gameActive = false;

    cells.forEach(cell => {
        cell.classList.add("disabled");
    });

    let roundSummary = "";
    let winnerText = "";

    if (result === "draw") {
        roundSummary = "The round ended in a draw.";
        winnerText = "Draw game";
        turnMessage.textContent = "🤝 No winner this time.";
        resultMessage.textContent = "It’s a draw — both sides played well.";
    }
    else if (gameMode === "friends" && result === "X") {
        playerScore++;
        roundSummary = "Player 1 takes the round.";
        winnerText = "Player 1 wins";
        turnMessage.textContent = "🎮 Player 1 takes the round.";
        resultMessage.textContent = "Player 1 wins the round!";
    }
    else if (gameMode === "friends" && result === "O") {
        opponentScore++;
        roundSummary = "Player 2 takes the round.";
        winnerText = "Player 2 wins";
        turnMessage.textContent = "🎮 Player 2 takes the round.";
        resultMessage.textContent = "Player 2 wins the round!";
    }
    else if (result === playerSymbol) {
        playerScore++;
        roundSummary = "You won the round.";
        winnerText = "You win";
        turnMessage.textContent = "🔥 Great move! You won the round.";
        resultMessage.textContent = "🏆 You won this round!";
    }
    else {
        opponentScore++;
        if (gameMode === "ai") {
            roundSummary = "The AI won the round.";
            winnerText = "AI wins";
            turnMessage.textContent = "🤖 The AI got this one.";
            resultMessage.textContent = "AI wins the round. Nice try!";
        }
        else {
            roundSummary = "Player 2 takes the round.";
            winnerText = "Player 2 wins";
            turnMessage.textContent = "🎮 Player 2 takes the round.";
            resultMessage.textContent = "Player 2 wins the round!";
        }
    }

    updateScore();

    if (result !== "draw" && hasMatchWinner()) {
        triggerCelebration();
        finishMatch();
        return;
    }

    showModal({
        icon: "🏆",
        title: winnerText,
        message: `${roundSummary} Choose what you want to do next.`,
        primaryText: "New Round",
        secondaryText: "Reset Match",
        primaryAction: () => {
            hideModal();
            newRound();
        },
        secondaryAction: () => {
            hideModal();
            resetMatch();
        }
    });

}


// ==========================================
// MATCH WINNER
// ==========================================

function hasMatchWinner() {

    const targetWins =
        Math.ceil(
            matchFormat / 2
        );


    return (
        playerScore >= targetWins ||
        opponentScore >= targetWins
    );

}


// ==========================================
// FINISH MATCH
// ==========================================

function finishMatch() {

    let message;
    let winnerTitle;

    if (
        playerScore >
        opponentScore
    ) {

        winnerTitle =
            gameMode === "ai"
                ? "You win the match!"
                : "Player 1 wins the match!";

        message =
            gameMode === "ai"
                ? "You conquered the AI and won the match."
                : "Player 1 completed the full match and took the victory.";

    }
    else {

        winnerTitle =
            gameMode === "ai"
                ? "AI wins the match!"
                : "Player 2 wins the match!";

        message =
            gameMode === "ai"
                ? "The AI took the match in a strong finish."
                : "Player 2 won the overall match.";

    }

    resultMessage.textContent =
        message;

    turnMessage.textContent =
        "✨ Match complete — choose your next move.";

    triggerCelebration();

    gameActive = false;
    matchStarted = false;
    updateProgress();

    cells.forEach(cell => {
        cell.classList.add("disabled");
    });

    showModal({
        icon: "🎉",
        title: winnerTitle,
        message: `${message} Start a new match or reset the setup.`,
        primaryText: "New Match",
        secondaryText: "Reset Match",
        primaryAction: () => {
            hideModal();
            newMatch();
        },
        secondaryAction: () => {
            hideModal();
            resetSettings();
        }
    });

}


// ==========================================
// RESTART ROUND
// ==========================================

restartBtn.addEventListener(
    "click",
    () => {

        if (!matchStarted) {
            beginMatch();
            return;
        }

        newRound();

    }
);

startMatchBtn.addEventListener("click", () => {
    beginMatch();
});

resetSettingsBtn.addEventListener("click", () => {
    resetSettings();
});

// ==========================================
// NEW MATCH
// ==========================================

newMatchBtn.addEventListener(
    "click",
    () => {

        resetMatch();

    }
);


// ==========================================
// NEW ROUND
// ==========================================

function newRound() {

    if (hasMatchWinner()) {
        return;
    }

    if (matchStarted && board.some(cell => cell !== "")) {
        round += 1;
    }

    board = [
        "", "", "",
        "", "", "",
        "", "", ""
    ];

    gameActive = true;
    matchStarted = true;
    resultMessage.textContent = "";

    cells.forEach(cell => {
        cell.textContent = "";
        cell.classList.remove("x", "o", "winner", "disabled");
    });

    roundNumber.textContent = round;
    determineStarter();
}


// ==========================================
// NEW MATCH
// ==========================================

function resetMatch() {
    playerScore = 0;
    opponentScore = 0;
    round = 1;
    matchStarted = false;
    gameActive = false;
    updateScore();
    updateProgress();
    unlockMatchSettings();
    resetBoard();
    hideModal();
}

function resetSettings() {
    playerSymbol = "X";
    opponentSymbol = "O";
    difficultySelect.value = "hard";
    starterSelect.value = "you";
    localStarterSelect.value = "player1";
    matchFormatSelect.value = "3";
    matchFormat = 3;
    symbolButtons.forEach(btn => {
        btn.classList.toggle("active", btn.dataset.symbol === "X");
    });
    updateSymbols();
    updateScore();
    updateProgress();
    unlockMatchSettings();
    hideModal();
}

function resetBoard() {
    board = ["", "", "", "", "", "", "", "", ""];
    cells.forEach(cell => {
        cell.textContent = "";
        cell.classList.remove("x", "o", "winner", "disabled");
    });
    resultMessage.textContent = "";
    roundNumber.textContent = round;
    turnMessage.textContent = gameMode === "ai"
        ? "🎯 Configure your match and press start when ready."
        : "🎯 Set up your local match and press start when ready.";
}

function beginMatch() {
    matchStarted = true;
    gameActive = true;
    lockMatchSettings();
    hideModal();
    round = 1;
    resetBoard();
    newRound();
}

function newMatch() {
    playerScore = 0;
    opponentScore = 0;
    round = 1;
    matchStarted = false;
    gameActive = false;
    updateScore();
    updateProgress();
    unlockMatchSettings();
    resetBoard();
    hideModal();
}


// ==========================================
// DETERMINE STARTER
// ==========================================

function determineStarter() {

    let selected;

    if (gameMode === "friends") {
        selected = localStarterSelect.value;
    }
    else {
        selected = starterSelect.value;
    }

    if (gameMode === "friends") {
        if (selected === "player1") {
            currentTurn = "player1";
        }
        else if (selected === "player2") {
            currentTurn = "player2";
        }
        else {
            currentTurn = Math.random() < 0.5 ? "player1" : "player2";
        }
    }
    else if (selected === "you") {
        currentTurn = "player";
    }
    else if (selected === "opponent") {
        currentTurn = "opponent";
    }
    else {
        currentTurn = Math.random() < 0.5 ? "player" : "opponent";
    }

    updateTurnText();

    if (gameMode === "ai" && currentTurn === "opponent") {
        turnMessage.textContent = "🤖 AI starts this round...";
        setTimeout(makeAIMove, 500);
    }

}


// ==========================================
// UPDATE SCORE
// ==========================================

function updateScore() {

    playerScoreText.textContent =
        playerScore;

    opponentScoreText.textContent =
        opponentScore;

    updateProgress();

}


// ==========================================
// UPDATE PROGRESS
// ==========================================

function updateProgress() {

    const targetWins =
        Math.ceil(
            matchFormat / 2
        );


    matchText.textContent =
        matchFormat === 1
            ? "Single Round"
            : `Best of ${matchFormat}`;


    matchPointText.textContent =
        matchFormat === 1
            ? "Winner takes the round"
            : `First to ${targetWins} wins`;


    const progress =
        Math.min(
            (
                Math.max(
                    playerScore,
                    opponentScore
                ) /
                targetWins
            ) * 100,
            100
        );


    progressFill.style.width =
        `${progress}%`;

}


// ==========================================
// GET EMPTY CELLS
// ==========================================

function getEmptyCells() {

    return board

        .map(
            (value, index) =>
                value === ""
                    ? index
                    : null
        )

        .filter(
            value =>
                value !== null
        );

}


// ==========================================
// INITIALIZE
// ==========================================

applyModeUI();
updateSymbols();
updateScore();
updateProgress();
resetBoard();
unlockMatchSettings();
updateSetupButtons();