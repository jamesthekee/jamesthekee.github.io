"use strict";
var selectedSize = 10;
var selectedDifficulty = 2;
var aiGameSelected = false;
var aiVsAiSelected = false;
var showMovesEnabled = true;
var whiteSelected = true;
var showLastMove = false;
var showTerritory = false;
var debug = false;
let bm = new BoardManager(10);
bm.initialise(selectedSize);
function test() {
    let example = new Board(6);
    let moves = AIBoardManager.getAllMoves(example.board, 1, 6, Infinity);
    for (let move of moves) {
        if (move[0] == move[1] || move[1] == move[2]) {
            console.log(move);
        }
    }
    for (let i = 0; i < moves.length; i++) {
        Minimax.applyMove(example.board, moves[i], 1);
        Minimax.resetMove(example.board, moves[i], 1);
    }
    console.log(Board.count_pieces(example.board, example.boardSize));
    console.log(example.board);
}
function setupDebugBoard() {
    if (bm.board.boardSize == 10) {
        bm.board.board = [
            3, 3, 0, 0, 0, 0, 3, 3, 0, 0,
            3, 2, 0, 0, 2, 0, 3, 3, 0, 0,
            3, 3, 3, 0, 0, 0, 0, 0, 0, 0,
            3, 3, 0, 0, 3, 3, 0, 3, 0, 0,
            3, 3, 0, 0, 1, 0, 3, 0, 2, 3,
            3, 3, 0, 0, 0, 0, 3, 3, 1, 3,
            3, 1, 0, 0, 0, 0, 0, 0, 0, 0,
            3, 3, 0, 0, 0, 0, 0, 3, 0, 0,
            3, 3, 3, 3, 0, 3, 3, 3, 0, 0,
            3, 3, 3, 3, 0, 3, 3, 3, 0, 0,
        ];
    }
    else if (bm.board.boardSize == 8) {
        bm.board.board = [
            3, 3, 0, 0, 0, 0, 3, 3,
            3, 3, 0, 0, 2, 0, 3, 3,
            3, 3, 3, 0, 0, 0, 3, 3,
            3, 3, 0, 0, 3, 3, 3, 3,
            3, 3, 0, 0, 1, 0, 3, 3,
            3, 3, 0, 0, 0, 0, 3, 3,
            3, 3, 0, 0, 0, 0, 3, 3,
            3, 3, 0, 0, 0, 0, 3, 3,
        ];
    }
    else if (bm.board.boardSize == 6) {
        bm.board.board = [
            3, 3, 0, 0, 0, 0,
            3, 3, 0, 0, 2, 0,
            3, 3, 3, 0, 0, 0,
            3, 3, 0, 0, 3, 3,
            3, 3, 0, 0, 1, 0,
            3, 3, 0, 0, 0, 0,
        ];
    }
    bm.board.playerTurn = 1;
    bm.update();
}
function setOneAmazon() {
    const whitePieces = Board.getPlayersPieces(bm.board.board, 1);
    const blackPieces = Board.getPlayersPieces(bm.board.board, 2);
    for (let i = 1; i < whitePieces.length; i++)
        bm.board.board[whitePieces[i]] = 0;
    for (let i = 1; i < blackPieces.length; i++)
        bm.board.board[blackPieces[i]] = 0;
}
function getAIHints() {
    // if(!(bm instanceof AIBoardManager))return;
    let moves = Minimax.findBestThreeMoves(bm.board.board, bm.board.playerTurn, 2, 500);
    bm.drawBoard();
    let i = 1;
    for (let m of moves) {
        bm.drawArrow(m[0], m[1], 22, 'green');
        bm.drawArrow(m[1], m[2], 18, 'blue');
        bm.drawHintCircle(m[2], i);
        i++;
    }
}
function addButtonEvents() {
    document.getElementById('startGame').addEventListener('click', () => startGame());
    document.getElementById('humanGameButton').addEventListener('click', () => setAiPlayer(false));
    document.getElementById('AIGameButton').addEventListener('click', () => setAiPlayer(true));
    canvas.addEventListener('click', event => bm.clicked(event));
    canvas.addEventListener('contextmenu', event => { bm.undo(true); event.preventDefault(); });
    document.getElementById("humanGameButton").disabled = true;
    document.getElementById("size10Button").disabled = true;
    document.getElementById("mediumButton").disabled = true;
    document.getElementById("selectWhite").disabled = true;
    document.getElementById("size6Button").addEventListener('click', () => setSize(6));
    document.getElementById("size8Button").addEventListener('click', () => setSize(8));
    document.getElementById("size10Button").addEventListener('click', () => setSize(10));
    document.getElementById("easyButton").addEventListener('click', () => setDifficulty(1));
    document.getElementById("mediumButton").addEventListener('click', () => setDifficulty(2));
    document.getElementById("hardButton").addEventListener('click', () => setDifficulty(3));
    document.getElementById("undoButton").addEventListener('click', () => bm.undo(false));
    document.getElementById("redoButton").addEventListener('click', () => bm.redo());
    document.getElementById("showMoves").addEventListener('click', () => togglesm());
    document.getElementById("showLastMove").addEventListener('click', () => toggleShowLastMove());
    document.getElementById("selectWhite").addEventListener('click', () => toggleWhite());
    document.getElementById("selectBlack").addEventListener('click', () => toggleWhite());
    document.getElementById("exportButton").addEventListener('click', () => bm.export());
    document.getElementById("importButton").addEventListener('click', () => bm.import());
    document.getElementById("setupboard").addEventListener('click', () => setupDebugBoard());
    document.getElementById("debugButton2").addEventListener('click', () => setOneAmazon());
    document.getElementById("aiHint").addEventListener('click', () => getAIHints());
    document.getElementById('AIvsAIButton').addEventListener('click', () => setAiVsAi());
    document.getElementById("showTerritory").addEventListener('click', () => toggleTerritory());
    document.getElementById("evalTerritory").addEventListener('click', () => setEvalType(0));
    document.getElementById("evalMobility").addEventListener('click', () => setEvalType(1));
    document.getElementById("evalRandom").addEventListener('click', () => setEvalType(2));
    document.getElementById("evalTerritory").disabled = true;
    let mc = document.getElementById("movesContainer");
    mc.addEventListener('click', (event) => {
        if (event.target === mc) {
            bm.returnFromHistory();
        }
    });
    if (debug) {
        let debugs = (document.getElementsByClassName('debug'));
        for (let i = 0; i < debugs.length; i++) {
            debugs[i].style.display = 'block';
        }
    }
    else {
        let debugs = (document.getElementsByClassName('debug'));
        for (let i = 0; i < debugs.length; i++) {
            debugs[i].style.display = 'none';
        }
    }
}
addButtonEvents();
// Help modal
const helpModal = document.getElementById('helpModal');
document.getElementById('helpButton').addEventListener('click', () => helpModal.classList.add('open'));
document.getElementById('helpClose').addEventListener('click', () => helpModal.classList.remove('open'));
helpModal.addEventListener('click', e => { if (e.target === helpModal)
    helpModal.classList.remove('open'); });
// Advanced options toggle
const showAdvancedBtn = document.getElementById('showAdvancedOptions');
const advancedOptions = document.getElementById('advancedOptions');
const aivsaiBtn = document.getElementById('AIvsAIButton');
showAdvancedBtn.addEventListener('click', () => {
    const visible = advancedOptions.style.display !== 'none';
    advancedOptions.style.display = visible ? 'none' : 'block';
    aivsaiBtn.style.display = visible ? 'none' : '';
    showAdvancedBtn.classList.toggle('active', !visible);
});
function getAiDepth() {
    const v = parseInt(document.getElementById('aiDepthInput').value);
    return isNaN(v) || v < 1 ? 2 : v;
}
function getAiBranchLim() {
    const v = parseInt(document.getElementById('aiBranchLimInput').value);
    return isNaN(v) || v < 1 ? null : v;
}
function startGame() {
    if (aiVsAiSelected) {
        bm = new AIBoardManager(selectedSize);
        bm.initialiseAiVsAi(selectedSize, selectedDifficulty);
    }
    else if (aiGameSelected) {
        bm = new AIBoardManager(selectedSize);
        bm.initialise(selectedSize, selectedDifficulty, whiteSelected);
    }
    else {
        bm = new BoardManager(selectedSize);
        bm.initialise(selectedSize);
    }
}
function togglesm() {
    showMovesEnabled = !showMovesEnabled;
    if (showMovesEnabled)
        document.getElementById("showMoves").innerHTML = "Hide Moves";
    else
        document.getElementById("showMoves").innerHTML = "Show Moves";
    bm.toggleShowMoves();
}
function toggleShowLastMove() {
    showLastMove = !showLastMove;
    if (showLastMove)
        document.getElementById("showLastMove").innerHTML = "Hide Last Move";
    else
        document.getElementById("showLastMove").innerHTML = "Show Last Move";
    bm.toggleShowLastMove();
}
function toggleWhite() {
    whiteSelected = !whiteSelected;
    if (whiteSelected) {
        document.getElementById("selectWhite").disabled = true;
        document.getElementById("selectBlack").disabled = false;
    }
    else {
        document.getElementById("selectWhite").disabled = false;
        document.getElementById("selectBlack").disabled = true;
    }
}
function updateTurnIndicator(turn, state, isAi) {
    if (turn == 1)
        document.getElementById('turnIndicator').innerHTML = "White";
    else if (turn == 2)
        document.getElementById('turnIndicator').innerHTML = "Black";
    if (isAi)
        document.getElementById('turnType').innerHTML = "computing";
    else if (state <= 1)
        document.getElementById('turnType').innerHTML = "moving";
    else if (state == 2)
        document.getElementById('turnType').innerHTML = "shooting";
}
function updateMoveList(stack, historyViewIndex) {
    const movesContainer = document.getElementById('movesContainer');
    movesContainer.innerHTML = '';
    for (let i = 0; i < stack.length; i++) {
        const move = stack[i];
        const moveDiv = document.createElement('div');
        moveDiv.classList.add('move');
        if (i === historyViewIndex) {
            moveDiv.classList.add('selectedMove');
        }
        else {
            moveDiv.classList.add(move.turn % 2 === 0 ? 'blackMove' : 'whiteMove');
        }
        moveDiv.innerHTML = `<b>${move.turn}.</b> ${move.moveString}`;
        moveDiv.style.cursor = 'pointer';
        const idx = i;
        moveDiv.addEventListener('click', () => bm.setHistoryView(idx));
        movesContainer.appendChild(moveDiv);
    }
    if (historyViewIndex === null) {
        movesContainer.scrollTop = movesContainer.scrollHeight;
    }
}
function updateTilesCount(tiles) {
    document.getElementById("tileCount").innerHTML = "Squares: " + tiles.toString();
}
function setAiPlayer(x) {
    aiGameSelected = x;
    aiVsAiSelected = false;
    document.getElementById('AIGameButton').disabled = x;
    document.getElementById('humanGameButton').disabled = !x;
    document.getElementById('AIvsAIButton').disabled = false;
}
function setAiVsAi() {
    aiVsAiSelected = true;
    aiGameSelected = false;
    document.getElementById('AIvsAIButton').disabled = true;
    document.getElementById('AIGameButton').disabled = false;
    document.getElementById('humanGameButton').disabled = false;
}
function toggleTerritory() {
    showTerritory = !showTerritory;
    const btn = document.getElementById("showTerritory");
    btn.innerHTML = showTerritory ? "Hide territory" : "Show territory";
    bm.update();
}
function setEvalType(type) {
    Minimax.evalType = type;
    document.getElementById("evalTerritory").disabled = type === 0;
    document.getElementById("evalMobility").disabled = type === 1;
    document.getElementById("evalRandom").disabled = type === 2;
}
function setDifficulty(x) {
    document.getElementById('easyButton').disabled = false;
    document.getElementById('mediumButton').disabled = false;
    document.getElementById('hardButton').disabled = false;
    if (x === 1)
        document.getElementById('easyButton').disabled = true;
    else if (x === 2)
        document.getElementById('mediumButton').disabled = true;
    else
        document.getElementById('hardButton').disabled = true;
    selectedDifficulty = x;
}
function setSize(x) {
    document.getElementById('size6Button').disabled = false;
    document.getElementById('size8Button').disabled = false;
    document.getElementById('size10Button').disabled = false;
    if (x === 6)
        document.getElementById('size6Button').disabled = true;
    else if (x === 8)
        document.getElementById('size8Button').disabled = true;
    else if (x === 10)
        document.getElementById('size10Button').disabled = true;
    selectedSize = x;
}
