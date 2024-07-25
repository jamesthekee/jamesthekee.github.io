

class Board{
    constructor(boardSize){
        this.boardSize = boardSize;
        this.board = []
		this.debug = true;
        this.initialise(this.boardSize);
    }
    
    initialise(boardSize_){
		this.boardSize = boardSize_;
        this.board = new Array(this.boardSize*this.boardSize).fill(0);
        

		if(this.boardSize === 6){
            this.board[this.getCoord(1,0)] = 2;
            this.board[this.getCoord(4,0)] = 2;
            
            this.board[this.getCoord(1,5)] = 1;
            this.board[this.getCoord(4,5)] = 1;
        }

		if(this.boardSize === 8){
            this.board[this.getCoord(3,0)] = 2;
            this.board[this.getCoord(6,0)] = 2;
            this.board[this.getCoord(0,2)] = 2;
            
            this.board[this.getCoord(1,7)] = 1;
            this.board[this.getCoord(4,7)] = 1;
			this.board[this.getCoord(7,5)] = 1;
        }

        if(this.boardSize === 10){
            this.board[this.getCoord(3,0)] = 2;
            this.board[this.getCoord(6,0)] = 2;
            this.board[this.getCoord(0,3)] = 2;
            this.board[this.getCoord(9,3)] = 2;
            
            this.board[this.getCoord(3,9)] = 1;
            this.board[this.getCoord(6,9)] = 1;
            this.board[this.getCoord(0,6)] = 1;
            this.board[this.getCoord(9,6)] = 1;
        }
		this.selectedAmazon = null;
		this.movedAmazon = null;
		this.playerTurn = 1;
	    this.turn = 1;
        this.gameState = 0;
		this.previousBoardState = Array.from(this.board);
    }

	getCoord(x, y){
		return x + y*this.boardSize;
	}

	revertHalfMove(){
		if(this.gameState != 2) return;

		this.gameState = 0;
		this.board[this.selectedAmazon] = this.playerTurn;
		this.board[this.movedAmazon] = 0;
	}

	static inBounds(x, y, size) {	
		return x >= 0 && x < size && y >= 0 && y < size;
	}

	static generatePartialMoves(from, board, size){
		var moves = []
		var x = from%size;
		var y = Math.floor(from/size);
		for(let [dx, dy] of DIRECTIONS){
			let nx = x+dx, ny = y+dy;
			while (Board.inBounds(nx, ny, size) && board[nx+ny*size] === 0) {
				moves.push([from, nx+ny*size]);
				nx += dx;
				ny += dy;
			}
		}
		return moves;
	}

	static getPlayersPieces(board, player){
		var pos = [];
		for(var x=0; x<board.length; x++)
            if(board[x] === player)pos.push(x);
		return pos;
	}

	cellPressed(col, row){
		var returnValue = null;
		var index = this.getCoord(col, row);
		// If selecting an an amazon
		if(this.gameState === 0){
			if(this.board[index] == this.playerTurn){
				this.selectedAmazon = index;
				this.gameState = 1;
			}
		}
		// If amazon is selected
		else if(this.gameState === 1){
			if(this.board[index] == this.playerTurn){
				this.selectedAmazon = index;
			}
			// Move amazon
			else if(this.validQueenMove(this.selectedAmazon%this.boardSize, Math.floor(this.selectedAmazon/this.boardSize), col, row)){
				this.movedAmazon = index;
				this.board[this.selectedAmazon] = 0;
	            this.board[this.movedAmazon] = this.playerTurn;
	            this.gameState = 2;
			}
			else if(this.debug)console.log("	", col, row, " is an invalid move")
        }
		// Shoot arrow
		else if(this.gameState === 2){
			if(this.validQueenMove(this.movedAmazon%this.boardSize, Math.floor(this.movedAmazon/this.boardSize), col, row)){
				this.board[index] = 3;
		        this.gameState = 0;
				// this.selectedAmazon = null;
				// this.movedAmazon = null;

				var returnValue = {
					moveString: this.moveToString(this.selectedAmazon, this.movedAmazon, index),
					move: [this.selectedAmazon, this.movedAmazon, this.getCoord(col, row)],
					board: this.previousBoardState,
					turn: this.turn,
					playerTurn: this.playerTurn		   
				}
				this.previousBoardState = Array.from(this.board);
		        this.playerTurn = 3 - this.playerTurn;
		        this.turn += 1;
			}
			else if(this.debug)console.log("	", col, row, " is an invalid arrow");
		}
		return returnValue;
	}


	setBoard(board, playerTurn, turn){
		this.board = Array.from(board);
		this.playerTurn = playerTurn;
		this.gameState = 0;
		this.turn = turn;
		this.previousBoardState = Array.from(board);
	}

	moveToString(selected, move, arrow){
		var letters = "ABCDEFGHIJKLM";
		var sx = selected %this.boardSize;
		var sy = Math.floor(selected/this.boardSize)
		var mx = move %this.boardSize;
		var my = Math.floor(move/this.boardSize)
		var ax = arrow %this.boardSize;
		var ay = Math.floor(arrow/this.boardSize)
		var string = letters[sx] + (1+sy).toString() + "-" + 
			letters[mx] + (1+my).toString() + "-" + letters[ax] + (1+ay).toString();
		return string;
	}

	validQueenMove(x1, y1, x2, y2){
		var xdiff = x1-x2;
		var ydiff = y1-y2;

		if(xdiff === 0 && ydiff === 0)return false;

		if(!(xdiff === 0 || ydiff === 0 || abs(xdiff)===abs(ydiff)))return false;

		var xdir = sign(xdiff);
        var ydir = sign(ydiff);

        // Check if path from p1, to p2 has nothing blocking.
		for(var i=1; i <= max(abs(xdiff), abs(ydiff)); i++)
			if(this.board[this.getCoord(x1 - i*xdir, y1 - i*ydir)] != 0)return false;
		
		return true;
	}

	makeMove(mv){
		var select = mv[0];
		var move = mv[1];
		var shoot = mv[2];
		var returnValue = {
			moveString: this.moveToString(select, move, shoot),
			move: [select, move, shoot],
			board: Array.from(this.board),
			turn: this.turn,
			playerTurn: this.playerTurn
		};

		this.board[select] = 0;
		this.board[move] = this.playerTurn;
		this.board[shoot] = 3;
		this.playerTurn = 3 - this.playerTurn;
		this.turn += 1;

		return returnValue;
	}

    static gameWon(board, size, turn){
		for(var x=0; x<size; x++){
			for(var y=0; y<size; y++){
				if(board[x+size*y] === turn){
                    // Check three tiles to left
					if(x!=0){
						if(board[x-1+size*y] === 0)return false;
						if(y!=0 && board[x-1+size*(y-1)] === 0)return false;
						if(y!=size-1 && board[x-1+size*(y+1)] === 0)return false;
					}
                    // Check three tiles to right
					if(x!=size-1){
						if(board[x+1+size*y] === 0)return false;
						if(y!=0 && board[x+1+size*(y-1)] === 0)return false;
						if(y!=size-1)if(board[x+1+size*(y+1)] === 0)return false;
					}
                    // Check up and down.
					if(y!=0 && board[x+size*(y-1)] === 0)return false;
					if(y!=size-1 && board[x+size*(y+1)] === 0)return false;
				}
			}
		}
		return true;
	}

}