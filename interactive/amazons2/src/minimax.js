class Minimax{


    static applyMove(newBoard, move, turn){
        newBoard[move[0]] = 0;
		newBoard[move[1]] = turn;
		newBoard[move[2]] = 3;
        return newBoard;
    }

    static resetMove(newBoard, move, turn){
		newBoard[move[1]] = 0;
		newBoard[move[2]] = 0;
        newBoard[move[0]] = turn;
        return newBoard;
    }

    static playerTerritory (board, size, player){
		var queue = Board.getPlayersPieces(board, player);
		var distanceMatrix = new Array(size);
		for (let i = 0; i < size; i++)
            distanceMatrix[i] = new Array(size).fill(-1);

        
		while(queue.length > 0){
			var z = queue.shift()
            var x = z % size;
            var y = Math.floor(z/size);

			for(let [dx, dy] of DIRECTIONS){
				let nx = x+dx, ny = y+dy;
				while (Board.inBounds(nx, ny, size) && board[nx+ny*size] === 0) {
					if (distanceMatrix[nx][ny] == -1) {
						distanceMatrix[nx][ny] = distanceMatrix[x][y]+1;
						queue.push(nx+size*ny);
					}
					nx += dx;
					ny += dy;
				}
			}
		}
		return distanceMatrix;
	}
	static relativeTerritory(board, size){
		var white = Minimax.playerTerritory(board, size, 1);
		var black = Minimax.playerTerritory(board, size, 2);

		var count = 0;
		for (let i = 0; i < size; i++)
            for (let j = 0; j < size; j++)
                if(white[i][j] > black[i][j])count++;
        // Should return infinity if win or lose.
		return count;
	}

    static minimax(board, size, turn, depth, alpha, beta, maximizingPlayer, branch_lim) {
        if (depth === 0 || Board.gameWon(board, size, turn)) {
            return Minimax.relativeTerritory(board, size); // evaluation function
        }

        if(Board.getPlayersPieces(board, turn).length !== 4)console.log("bruh that's not great");
        
        if (maximizingPlayer) {
            let maxEval = -Infinity;
            var moves = AIBoardManager.getAllMoves(board, turn, size);
            var move;
            for (let i=0; i<min(moves.length, branch_lim);i++){
                move = moves[i];
                board = Minimax.applyMove(board, move, turn);
        
                const val = Minimax.minimax(board, size, 3-turn, depth - 1, alpha, beta, false);
                maxEval = Math.max(maxEval, val);
                alpha = Math.max(alpha, val);

                board = Minimax.resetMove(board, move, turn);

                if (beta <= alpha)
                    break; // Beta cut-off
            }
            return maxEval;
        } else {
            let minEval = Infinity;
            var moves  = AIBoardManager.getAllMoves(board, turn, size);
            
            var move;
            for (let i=0; i<min(moves.length, branch_lim);i++){
                move = moves[i];
                board = Minimax.applyMove(board, move, turn);
                const val = Minimax.minimax(board, size, 3-turn, depth - 1, alpha, beta, true);
                minEval = Math.min(minEval, val);
                beta = Math.min(beta, val);

                board = Minimax.resetMove(board, move, turn);
                if (beta <= alpha)
                    break; // Alpha cut-off
            }
            return minEval;
        }
    }
    
    static findBestMove(board, turn, depth, branch_lim) {
        console.time("searching");
        
        let bestMove = null;
        let bestEval = -Infinity;
        const alpha = -Infinity;
        const beta = Infinity;
        let size = Math.floor(Math.sqrt(board.length));
        console.log("Running minimax", size, branch_lim);
        const maximising = turn == 1;
    
        var moves = AIBoardManager.getAllMoves(board, turn, size);
        var move;
        //console.log("Percent considered: ", branch_lim/moves.length);
        for (let i=0; i<min(moves.length, branch_lim);i++){
            move = moves[i];
            board = Minimax.applyMove(board, move, turn);
    
            var val = Minimax.minimax(board, size, 3-turn, depth - 1, alpha, beta, maximising, branch_lim);
            if(!maximising) val = -1*val;
            board = Minimax.resetMove(board, move, turn)
            if (val > bestEval) {
                bestEval = val;
                bestMove = move;
            }
        }

        console.timeEnd("searching")
        return bestMove;
    }
}