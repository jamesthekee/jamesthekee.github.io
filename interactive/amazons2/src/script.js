
var selectedSize = 10;
var selectedDifficulty = 2;
var showMovesEnabled = true;
var whiteSelected = true;
var showLastMove = false;

bm = new BoardManager(10);
bm.initialise(10);


function addButtonEvents(){
	document.getElementById('newGame').addEventListener('click', () => newGame());
	document.getElementById('newAIGame').addEventListener('click', () => newAIGame());

	canvas.addEventListener('click', event => bm.clicked(event));

	document.getElementById("size10Button").disabled = true;
	document.getElementById("mediumButton").disabled = true;
	document.getElementById("selectWhite").disabled = true;

	document.getElementById("size6Button").addEventListener('click', () => setSize(6));
	document.getElementById("size8Button").addEventListener('click', () => setSize(8));
	document.getElementById("size10Button").addEventListener('click', () => setSize(10));

	document.getElementById("easyButton").addEventListener('click', () => setDifficulty(1));
	document.getElementById("mediumButton").addEventListener('click', () => setDifficulty(2));
	document.getElementById("hardButton").addEventListener('click', () => setDifficulty(3));


	document.getElementById("undoButton").addEventListener('click', () => bm.undo());
	document.getElementById("redoButton").addEventListener('click', () => bm.redo());

	document.getElementById("showMoves").addEventListener('click', () => togglesm());
	document.getElementById("showLastMove").addEventListener('click', () => toggleShowLastMove());


	document.getElementById("selectWhite").addEventListener('click', () => toggleWhite());
	document.getElementById("selectBlack").addEventListener('click', () => toggleWhite());
}
addButtonEvents();

function newGame(){
	bm = new BoardManager(10);
	bm.initialise(selectedSize);
}

function newAIGame(){
	bm = new AIBoardManager(10);
	bm.initialise(selectedSize, selectedDifficulty, whiteSelected);
}

function togglesm(){
	showMovesEnabled = !showMovesEnabled;
	if(showMovesEnabled)document.getElementById("showMoves").innerHTML = "Hide Moves";
	else  document.getElementById("showMoves").innerHTML = "Show Moves";

	bm.toggleShowMoves();
}

function toggleShowLastMove(){
	showLastMove = !showLastMove;
	if(showLastMove)document.getElementById("showLastMove").innerHTML = "Hide Last Move";
	else  document.getElementById("showLastMove").innerHTML = "Show Last Move";

	bm.toggleShowLastMove();
}



function toggleWhite(){
	whiteSelected = !whiteSelected;
	if(whiteSelected){
		document.getElementById("selectWhite").disabled = true;
		document.getElementById("selectBlack").disabled = false;
	}
	else {
		document.getElementById("selectWhite").disabled = false;
		document.getElementById("selectBlack").disabled = true;
	}
}



function updateTurnIndicator(turn, state){
	if(turn == 1)document.getElementById('turnIndicator').innerHTML = "White";
	if(turn == 2)document.getElementById('turnIndicator').innerHTML = "Black";

	if(state <= 1)document.getElementById('turnType').innerHTML = "moving";
	if(state == 2)document.getElementById('turnType').innerHTML = "shooting";

}

function updateMoveList(stack){
	const movesContainer = document.getElementById('movesContainer');
	movesContainer.innerHTML = '';
	for(const move of stack){
		const moveDiv = document.createElement('div');
		moveDiv.classList.add('move');
		moveDiv.classList.add(move.turn % 2 === 0 ? 'blackMove' : 'whiteMove');
		moveDiv.innerHTML = `<b>${move.turn}.</b> ${move.moveString}`;
	
		movesContainer.appendChild(moveDiv);
	}
	movesContainer.scrollTop = movesContainer.scrollHeight;
}

function updateTilesCount(tiles){
	document.getElementById("tileCount").innerHTML = "Squares: " + tiles; 
}



function setDifficulty(x) {
	document.getElementById('easyButton').disabled = false;
	document.getElementById('mediumButton').disabled = false;
	document.getElementById('hardButton').disabled = false;

	if (x === 1) document.getElementById('easyButton').disabled = true;
	else if (x === 2)document.getElementById('mediumButton').disabled = true;
	else document.getElementById('hardButton').disabled = true;

	selectedDifficulty = x;
}

function setSize(x) {
	document.getElementById('size6Button').disabled = false;
	document.getElementById('size8Button').disabled = false;
	document.getElementById('size10Button').disabled = false;

	if (x === 6)document.getElementById('size6Button').disabled = true;
	else if (x === 8)document.getElementById('size8Button').disabled = true;
	else if (x === 10)document.getElementById('size10Button').disabled = true;
	selectedSize = x;
}
