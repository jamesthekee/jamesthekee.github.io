const canvas = document.getElementById('gameBoard');
const ctx = canvas.getContext('2d');


const arrowColour = "#9b4548";
const boardColour1 = "#fecd9d";
const boardColour2 = "#d18b47";
const bg = "#ffe6c8";
const moveIndicatorOpacity = 0.2;

// class board
// is queen move
// move from a, b
// shoot at c.	
// game won?
// get valid moves
class BoardManager {
	constructor(boardSize) {
		this.boardSize = boardSize;
		this.board = new Board(this.boardSize);
		this.showMoves = true;
		this.showLastMove = false;
	}

	initialise(boardSize) {
		this.boardSize = boardSize;
		this.tileSize = canvas.width / this.boardSize;

		this.board.initialise(this.boardSize);
		this.moveStack = [];
		this.redoStack = []
		this.gameOver = false;
		this.update();
        updateTurnIndicator(this.board.playerTurn, this.board.gameState);
        updateMoveList(this.moveStack);
	}

	toggleShowMoves(){
		this.showMoves = !this.showMoves;
		this.update();
	}


	toggleShowLastMove(){
		this.showLastMove = !this.showLastMove;
		this.update();
	}

	getPixelPosition(index){
		var x = this.tileSize * (index%this.boardSize);
		var y = this.tileSize * Math.floor(index/this.boardSize);
		return [x,y]
	}

	drawBoard() {
		for (let row = 0; row < this.boardSize; row++) {
			for (let col = 0; col < this.boardSize; col++) {
				ctx.fillStyle = (row + col) % 2 === 0 ? boardColour1 : boardColour2;
				ctx.fillRect(col * this.tileSize, row * this.tileSize, this.tileSize, this.tileSize);
			}
		}

		var x;
		if (this.board.gameState === 1) {
			ctx.globalAlpha = moveIndicatorOpacity;
			ctx.fillStyle = "rgb(0, 255, 0)";
			x = this.getPixelPosition(this.board.selectedAmazon)
			ctx.fillRect(x[0], x[1], this.tileSize, this.tileSize);
			ctx.globalAlpha = 1;
		} else if (this.board.gameState === 2) {
			ctx.globalAlpha = moveIndicatorOpacity;
			ctx.fillStyle = "rgb(255, 0, 0)";
			x = this.getPixelPosition(this.board.movedAmazon)

			ctx.fillRect(x[0], x[1], this.tileSize, this.tileSize);
			ctx.globalAlpha = 1;
		
		}
		if(this.showLastMove && this.moveStack.length > 0){
			var lastMove = this.moveStack[this.moveStack.length-1].move;
			this.drawArrow(lastMove[0], lastMove[1], 14, "green");
			this.drawArrow(lastMove[1], lastMove[2], 9, "red");
		}

		for (let row = 0; row < this.boardSize; row++) {
			for (let col = 0; col < this.boardSize; col++) {
				if (this.board.board[col+row*this.boardSize] === 1) this.drawPiece(col, row, "white", "circle");
				if (this.board.board[col+row*this.boardSize] === 2) this.drawPiece(col, row, "black", "circle");
				if (this.board.board[col+row*this.boardSize] === 3) this.drawPiece(col, row, arrowColour, "arrow");
			}
		}
		if(this.showMoves)this.drawMoves();

	}

	drawArrow(from, to, lineWidth, color){
		ctx.globalAlpha = moveIndicatorOpacity;
		var fromx = (from%this.boardSize)  * this.tileSize + this.tileSize / 2;
		var fromy = Math.floor(from/this.boardSize) * this.tileSize + this.tileSize / 2;
		var tox = (to%this.boardSize) * this.tileSize + this.tileSize / 2;
		var toy = Math.floor(to/this.boardSize) * this.tileSize + this.tileSize / 2;
		//variables to be used when creating the arrow
	 
		// ctx.save();
		ctx.strokeStyle = color;
		ctx.fillStyle = color;
		ctx.beginPath();
		ctx.moveTo(fromx, fromy);
		ctx.lineTo(tox, toy);
		ctx.lineWidth = lineWidth;
		ctx.stroke();
		ctx.globalAlpha = 1;
	}

	drawIndicatorCircle(move){
		var x = (move[1]%this.boardSize) * this.tileSize + this.tileSize / 2;
		var y = Math.floor(move[1]/this.boardSize) * this.tileSize + this.tileSize / 2;
		ctx.beginPath();
		ctx.arc(x, y, this.tileSize / 6, 0, Math.PI * 2);
		ctx.fill();
		ctx.closePath();
	}

	drawMoves(){
		if(this.board.gameState == 0) return;
		// Actually works the same for shooting/moving.
		
		ctx.globalAlpha = .2;
		var origin;
		if(this.board.gameState === 1){
			ctx.fillStyle = "green";
			origin = this.board.selectedAmazon;
		}
		if(this.board.gameState === 2){
			ctx.fillStyle = "red";
			origin = this.board.movedAmazon;
		}

		var moves = Board.generatePartialMoves(origin, this.board.board, this.boardSize);
		for (var move of moves)
			this.drawIndicatorCircle(move);
	
		ctx.globalAlpha = 1;	
	}

	drawPiece(col, row, color, shape) {
		const x = col * this.tileSize + this.tileSize / 2;
		const y = row * this.tileSize + this.tileSize / 2;

		ctx.fillStyle = color;
		
		ctx.beginPath();
		if (shape === 'circle') {
			ctx.arc(x, y, this.tileSize / 2.5, 0, Math.PI * 2);
		} else if (shape === 'arrow') {
			ctx.beginPath();
			ctx.moveTo(x - this.tileSize / 2, y);
			ctx.lineTo(x, y + this.tileSize / 2);
			ctx.lineTo(x + this.tileSize / 2, y);
			ctx.lineTo(x, y - this.tileSize / 2);
		}
		ctx.fill();
		ctx.closePath();
	}
	undo() {
		if (this.board.gameState === 2){
			this.board.revertHalfMove();
			this.update();
			return;
		}
		var move = this.moveStack.pop();
		if(typeof move !== "undefined"){
			this.redoStack.push({
				board: Array.from(this.board.board),
				turn: this.board.turn,
				playerTurn: this.board.playerTurn,
                move: move.move,
				moveString: move.moveString   
   
			});

			this.board.setBoard(move.board, move.playerTurn, move.turn);
			
			this.update();
		}
	}

	redo() {
		if (this.board.gameState == 2)return;
		var move = this.redoStack.pop();
		if(typeof move !== "undefined"){
			this.moveStack.push({
				board: Array.from(this.board.board),
				turn: this.board.turn,
				playerTurn: this.board.playerTurn,
                move: move.move,
				moveString: move.moveString   
			});
			
			this.board.setBoard(move.board, move.playerTurn, move.turn);
		
			this.update();
		}
	}


	clicked(event) {
		if(this.gameOver)
			return;		
		
		var col = Math.floor(event.offsetX / this.tileSize);
		var row = Math.floor(event.offsetY / this.tileSize);
		var result = this.board.cellPressed(col, row);
		if (result !== null) {
			this.moveStack.push(result);
			this.redoStack = []
		}
		this.update();
	}

	update(){
		this.gameOver = false;
		if(Board.gameWon(this.board.board, this.boardSize, this.board.playerTurn)){
			var s;
			if (this.board.playerTurn === 1) s = "Black has won the game";
			else if(this.board.playerTurn === 2) s = "White has won the game";
			document.getElementById("overlay-text").innerHTML = s;
			this.gameOver = true;
		}else {
			document.getElementById("overlay-text").innerHTML = '';
		}
		this.drawBoard();
		updateTurnIndicator(this.board.playerTurn, this.board.gameState);
        updateMoveList(this.moveStack);	

		var count;
		if(this.boardSize === 10)count = 10*10-8;
		if(this.boardSize === 8)count = 8*8-6;
		if(this.boardSize === 6)count = 6*6-4;

		count -= this.board.turn;
		count++;

		updateTilesCount(count);	
	}
}