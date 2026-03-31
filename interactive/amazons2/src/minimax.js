"use strict";
class Minimax {
    static applyMove(newBoard, move, turn) {
        newBoard[move[0]] = BoardCell.EMPTY;
        newBoard[move[1]] = turn;
        newBoard[move[2]] = BoardCell.ARROW;
        return newBoard;
    }
    static resetMove(newBoard, move, turn) {
        newBoard[move[1]] = BoardCell.EMPTY;
        newBoard[move[2]] = BoardCell.EMPTY;
        newBoard[move[0]] = turn;
        // MUST BE THIS ORDER DONT REORDER IT AGAIN IDIOT.
        return newBoard;
    }
    static playerTerritory(board, boardSize, player) {
        const queue = Board.getPlayersPieces(board, player);
        const distanceMatrix = new Array(boardSize);
        // Init distance matrix
        for (let i = 0; i < boardSize; i++)
            distanceMatrix[i] = new Array(boardSize).fill(Infinity);
        for (let cell of queue)
            distanceMatrix[cell % boardSize][Math.floor(cell / boardSize)] = 0;
        // Pop elements off queue, and see how quickly they can reach other cells - adding them onto the queue if not already explored.
        while (queue.length > 0) {
            const curCell = queue.shift();
            const x = curCell % boardSize;
            const y = Math.floor(curCell / boardSize);
            for (const [dx, dy] of DIRECTIONS) {
                let nx = x + dx, ny = y + dy;
                while (Board.inBounds(nx, ny, boardSize) && board[nx + ny * boardSize] === BoardCell.EMPTY) {
                    if (distanceMatrix[nx][ny] === Infinity) {
                        distanceMatrix[nx][ny] = distanceMatrix[x][y] + 1;
                        queue.push(nx + boardSize * ny);
                    }
                    nx += dx;
                    ny += dy;
                }
            }
        }
        return distanceMatrix;
    }
    static relativeTerritory(board, boardSize) {
        const n = boardSize * boardSize;
        const dist1 = new Array(n).fill(Infinity);
        const dist2 = new Array(n).fill(Infinity);
        const cur_queue = [];
        // const nxt_queue: [number, number][] = [];
        for (const cell of Board.getPlayersPieces(board, 1)) {
            dist1[cell] = 0;
            cur_queue.push([cell, 1]);
        }
        for (const cell of Board.getPlayersPieces(board, 2)) {
            dist2[cell] = 0;
            cur_queue.push([cell, 2]);
        }
        while (cur_queue.length > 0) {
            const [curCell, player] = cur_queue.shift();
            if (dist1[curCell] === dist2[curCell])
                continue;
            const matrix = player === 1 ? dist1 : dist2;
            const x = curCell % boardSize;
            const y = Math.floor(curCell / boardSize);
            for (const [dx, dy] of DIRECTIONS) {
                let nx = x + dx, ny = y + dy;
                while (Board.inBounds(nx, ny, boardSize) && board[nx + ny * boardSize] === BoardCell.EMPTY) {
                    let index = nx + ny * boardSize;
                    if (matrix[index] === Infinity) {
                        matrix[index] = matrix[x + y * boardSize] + 1;
                        cur_queue.push([nx + boardSize * ny, player]);
                    }
                    nx += dx;
                    ny += dy;
                }
            }
        }
        let whiteTerritory = 0;
        for (let i = 0; i < n; i++) {
            if (dist1[i] < dist2[i])
                whiteTerritory++;
            else if (dist1[i] > dist2[i])
                whiteTerritory--;
        }
        return whiteTerritory;
    }
    static randomEval() {
        return Math.random() * 200 - 100;
    }
    static relativeMobility(board, boardSize) {
        const whiteMoves = AIBoardManager.getAllMoves(board, 1, boardSize, Infinity).length;
        const blackMoves = AIBoardManager.getAllMoves(board, 2, boardSize, Infinity).length;
        return whiteMoves - blackMoves;
    }
    static evaluate(board, boardSize) {
        if (Minimax.evalType === 1)
            return Minimax.relativeMobility(board, boardSize);
        if (Minimax.evalType === 2)
            return Minimax.randomEval();
        return Minimax.relativeTerritory(board, boardSize);
    }
    static minimax(board, size, turn, depth, alpha, beta, maximizingPlayer, branch_lim) {
        if (Board.gameLost(board, size, turn)) {
            return maximizingPlayer ? -Infinity : Infinity;
        }
        if (depth <= 0) {
            return Minimax.evaluate(board, size);
        }
        if (maximizingPlayer) {
            let maxEval = -Infinity;
            const moves = AIBoardManager.getAllMoves(board, turn, size, branch_lim);
            for (let i = 0; i < Math.min(moves.length, branch_lim); i++) {
                const move = moves[i];
                board = Minimax.applyMove(board, move, turn);
                const val = Minimax.minimax(board, size, 3 - turn, depth - 1, alpha, beta, false, branch_lim);
                maxEval = Math.max(maxEval, val);
                alpha = Math.max(alpha, val);
                board = Minimax.resetMove(board, move, turn);
                if (beta <= alpha)
                    break;
            }
            return maxEval;
        }
        else {
            let minEval = Infinity;
            const moves = AIBoardManager.getAllMoves(board, turn, size, branch_lim);
            for (let i = 0; i < Math.min(moves.length, branch_lim); i++) {
                const move = moves[i];
                board = Minimax.applyMove(board, move, turn);
                const val = Minimax.minimax(board, size, 3 - turn, depth - 1, alpha, beta, true, branch_lim);
                minEval = Math.min(minEval, val);
                beta = Math.min(beta, val);
                board = Minimax.resetMove(board, move, turn);
                if (beta <= alpha)
                    break;
            }
            return minEval;
        }
    }
    static evaluateMoves(board, computer_turn, depth, branch_lim) {
        const size = Math.sqrt(board.length);
        const moves = AIBoardManager.getAllMoves(board, computer_turn, size, branch_lim);
        const maximising = computer_turn === 1;
        const results = [];
        for (let i = 0; i < Math.min(moves.length, branch_lim); i++) {
            const move = moves[i];
            board = Minimax.applyMove(board, move, computer_turn);
            let val = Minimax.minimax(board, size, 3 - computer_turn, depth - 1, -Infinity, Infinity, !maximising, branch_lim);
            if (!maximising)
                val = -val;
            board = Minimax.resetMove(board, move, computer_turn);
            results.push({ move, val });
        }
        return results;
    }
    static findBestMove(board, computer_turn, depth, branch_lim) {
        console.time("searching");
        const results = Minimax.evaluateMoves(board, computer_turn, depth, branch_lim);
        const best = results.reduce((a, b) => a.val > b.val ? a : b);
        console.timeEnd("searching");
        return best.move;
    }
    static findBestThreeMoves(board, computer_turn, depth, branch_lim) {
        console.time("searching");
        const size = Math.sqrt(board.length);
        const results = Minimax.evaluateMoves(board, computer_turn, depth, branch_lim);
        let bestEval = -Infinity;
        const history = [];
        for (const { move, val } of results) {
            if (val > bestEval) {
                bestEval = val;
                if (history.length === 3)
                    history.shift();
                history.push(move);
            }
        }
        console.timeEnd("searching");
        return history;
    }
}
Minimax.evalType = 0; // 0=territory, 1=mobility, 2=random
