

const aiUndoAllowed = true;

class AIBoardManager extends BoardManager {
	constructor(boardSize) {
		super(boardSize);
	}

	initialise(boardSize, gameDifficulty, playerIsWhite) {

		this.gameDifficulty = gameDifficulty;
		this.computerTurn = 1;
        if(playerIsWhite)this.computerTurn = 2;
		
		super.initialise(boardSize);

		if(this.board.playerTurn === this.computerTurn)this.makeAIMove();
	}

	undo() {
        if(this.playerTurn === this.computerTurn)return;

		if (this.board.gameState === 2){
			this.board.revertHalfMove();
			this.update();
			return;
		}

		if (aiUndoAllowed){
			super.undo();
			super.undo();
		}
	}

	redo() {
        if(this.playerTurn === this.computerTurn)return;

		if (aiUndoAllowed){
			super.redo();
			super.redo();
		}
	}


	clicked(event) {
		if(this.gameOver || this.playerTurn === this.computerTurn){
			return;		
		}
		var col = Math.floor(event.offsetX / this.tileSize);
		var row = Math.floor(event.offsetY / this.tileSize);
		var result = this.board.cellPressed(col, row);
		if (result !== null) {
			this.moveStack.push(result);
			this.redoStack = []
		}
		this.update();
        // invoke AI to make move
        if(this.board.playerTurn === this.computerTurn)this.makeAIMove();
	}



    semiRandomMove(){
        var pieces = Board.getPlayersPieces(this.board.board, this.computerTurn);
		var allMoves = []
		for(var piece of pieces)
			allMoves.push(Board.generatePartialMoves(piece, board, this.boardSize));
		
        if(allMoves.length === 0)return -1;
		allMoves = allMoves.flat();

        var randIndex = Math.floor(Math.random()*allMoves.length);
        var move = allMoves[randIndex];

        var selected = move[0];
        var moveTo = move[1];

        
        this.board.board[selected] = 0;
    
        var arrowMoves = Board.generatePartialMoves(moveTo, board, this.boardSize) ;

        if(arrowMoves.length === 0)return -2;
        
        randIndex = Math.floor(Math.random()*arrowMoves.length);
        var shootMove = arrowMoves[randIndex];
        var shoot = shootMove[1];

        return [selected, moveTo, shoot];
    }

	static getAllMoves(board, turn, size){
		var pieces = Board.getPlayersPieces(board, turn);
		var halfMoves = []
		for(var piece of pieces)
			halfMoves.push(Board.generatePartialMoves(piece, board, size));
		
		
		var allMoves = [];
		var moves;
		for(var chunk of halfMoves){
			if(chunk.length === 0)continue;
			board[chunk[0][0]] = 0;
			for(var move of chunk){
				moves = Board.generatePartialMoves(move[1], board, size);
				for (var thing of moves)	
					allMoves.push([move[0], thing[0], thing[1]]);
				
			}
			board[chunk[0][0]] = turn;
		}
		var pieces2 = Board.getPlayersPieces(board, turn);

		if(pieces.length != pieces2.length) console.log("WTF");
		return allMoves;
	}

	randomMove(){
		var allMoves = AIBoardManager.getAllMoves(this.board.board, this.computerTurn, this.boardSize);
		var randIndex = Math.floor(Math.random()*allMoves.length);
		return allMoves[randIndex];
	}

    makeAIMove(){
		var engineMove;
		if(this.gameDifficulty === 1)engineMove = this.randomMove();

		else engineMove = Minimax.findBestMove(this.board.board, this.computerTurn, 2, 100);
        var mv = this.board.makeMove(engineMove);
		this.moveStack.push(mv);
        this.update();
    }
}