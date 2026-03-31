"use strict";
var BoardCell;
(function (BoardCell) {
    BoardCell[BoardCell["EMPTY"] = 0] = "EMPTY";
    BoardCell[BoardCell["WHITE_AMAZON"] = 1] = "WHITE_AMAZON";
    BoardCell[BoardCell["BLACK_AMAZON"] = 2] = "BLACK_AMAZON";
    BoardCell[BoardCell["ARROW"] = 3] = "ARROW";
})(BoardCell || (BoardCell = {}));
class Board {
    constructor(boardSize) {
        this.boardSize = boardSize;
        this.board = [];
        this.debug = true;
        this.selectedAmazon = -1;
        this.movedAmazon = -1;
        this.playerTurn = 1;
        this.turn = 1;
        this.gameState = 0;
        this.previousBoardState = [];
        this.initialise(this.boardSize);
    }
    initialise(boardSize) {
        this.boardSize = boardSize;
        this.board = new Array(this.boardSize * this.boardSize).fill(0);
        if (this.boardSize === 6) {
            this.board[this.getCoord(1, 0)] = BoardCell.BLACK_AMAZON;
            this.board[this.getCoord(4, 0)] = BoardCell.BLACK_AMAZON;
            this.board[this.getCoord(1, 5)] = BoardCell.WHITE_AMAZON;
            this.board[this.getCoord(4, 5)] = BoardCell.WHITE_AMAZON;
        }
        if (this.boardSize === 8) {
            this.board[this.getCoord(3, 0)] = BoardCell.BLACK_AMAZON;
            this.board[this.getCoord(6, 0)] = BoardCell.BLACK_AMAZON;
            this.board[this.getCoord(0, 2)] = BoardCell.BLACK_AMAZON;
            this.board[this.getCoord(1, 7)] = BoardCell.WHITE_AMAZON;
            this.board[this.getCoord(4, 7)] = BoardCell.WHITE_AMAZON;
            this.board[this.getCoord(7, 5)] = BoardCell.WHITE_AMAZON;
        }
        if (this.boardSize === 10) {
            this.board[this.getCoord(3, 0)] = BoardCell.BLACK_AMAZON;
            this.board[this.getCoord(6, 0)] = BoardCell.BLACK_AMAZON;
            this.board[this.getCoord(0, 3)] = BoardCell.BLACK_AMAZON;
            this.board[this.getCoord(9, 3)] = BoardCell.BLACK_AMAZON;
            this.board[this.getCoord(3, 9)] = 1;
            this.board[this.getCoord(6, 9)] = 1;
            this.board[this.getCoord(0, 6)] = 1;
            this.board[this.getCoord(9, 6)] = 1;
        }
        this.selectedAmazon = -1;
        this.movedAmazon = -1;
        this.playerTurn = 1;
        this.turn = 1;
        this.gameState = 0;
        this.previousBoardState = Array.from(this.board);
    }
    getCoord(x, y) {
        return x + y * this.boardSize;
    }
    revertHalfMove() {
        if (this.gameState !== 2)
            return;
        this.gameState = 0;
        this.board[this.selectedAmazon] = this.playerTurn;
        this.board[this.movedAmazon] = 0;
    }
    static inBounds(x, y, size) {
        return x >= 0 && x < size && y >= 0 && y < size;
    }
    static generatePartialMoves(from, board, size) {
        const moves = [];
        const x = from % size;
        const y = Math.floor(from / size);
        for (const [dx, dy] of DIRECTIONS) {
            let nx = x + dx, ny = y + dy;
            while (Board.inBounds(nx, ny, size) && board[nx + ny * size] === BoardCell.EMPTY) {
                moves.push([from, nx + ny * size]);
                nx += dx;
                ny += dy;
            }
        }
        return moves;
    }
    static getPlayersPieces(board, player) {
        const pos = [];
        for (let x = 0; x < board.length; x++) {
            if (board[x] === player)
                pos.push(x);
        }
        return pos;
    }
    cellPressed(col, row) {
        let returnValue = null;
        const index = this.getCoord(col, row);
        // If selecting an amazon
        if (this.gameState === 0) {
            if (this.board[index] === this.playerTurn) {
                this.selectedAmazon = index;
                this.gameState = 1;
            }
        }
        // If amazon is selected
        else if (this.gameState === 1) {
            if (this.board[index] === this.playerTurn) {
                this.selectedAmazon = index;
            }
            // Move amazon
            else if (this.validQueenMove(this.selectedAmazon % this.boardSize, Math.floor(this.selectedAmazon / this.boardSize), col, row)) {
                this.movedAmazon = index;
                this.board[this.selectedAmazon] = 0;
                this.board[this.movedAmazon] = this.playerTurn;
                this.gameState = 2;
            }
            else if (this.debug) {
                console.log("	", col, row, " is an invalid move");
                // this.selectedAmazon = -1;
                // this.gameState = 0;
            }
        }
        // Shoot arrow
        else if (this.gameState === 2) {
            if (this.validQueenMove(this.movedAmazon % this.boardSize, Math.floor(this.movedAmazon / this.boardSize), col, row)) {
                this.board[index] = 3;
                this.gameState = 0;
                let fm = [this.selectedAmazon, this.movedAmazon, this.getCoord(col, row)];
                returnValue = {
                    moveString: Board.moveToString(fm, this.boardSize),
                    move: fm,
                    board: this.previousBoardState,
                    turn: this.turn,
                    playerTurn: this.playerTurn
                };
                this.previousBoardState = Array.from(this.board);
                this.playerTurn = 3 - this.playerTurn;
                this.turn += 1;
            }
            else if (this.debug)
                console.log("	", col, row, " is an invalid arrow");
        }
        return returnValue;
    }
    setBoard(board, playerTurn, turn) {
        this.board = Array.from(board);
        this.playerTurn = playerTurn;
        this.gameState = 0;
        this.turn = turn;
        this.previousBoardState = Array.from(board);
    }
    static moveToString(fullMove, boardSize) {
        const [selected, move, arrow] = fullMove;
        const letters = "ABCDEFGHIJKLM";
        const sx = selected % boardSize;
        const sy = Math.floor(selected / boardSize);
        const mx = move % boardSize;
        const my = Math.floor(move / boardSize);
        const ax = arrow % boardSize;
        const ay = Math.floor(arrow / boardSize);
        return letters[sx] + (1 + sy).toString() + "-" +
            letters[mx] + (1 + my).toString() + "-" +
            letters[ax] + (1 + ay).toString();
    }
    validQueenMove(x1, y1, x2, y2) {
        const xdiff = x1 - x2;
        const ydiff = y1 - y2;
        if (xdiff === 0 && ydiff === 0)
            return false;
        if (!(xdiff === 0 || ydiff === 0 || abs(xdiff) === abs(ydiff)))
            return false;
        const xdir = sign(xdiff);
        const ydir = sign(ydiff);
        // Check if path from p1, to p2 has nothing blocking.
        for (let i = 1; i <= max(abs(xdiff), abs(ydiff)); i++) {
            if (this.board[this.getCoord(x1 - i * xdir, y1 - i * ydir)] !== 0)
                return false;
        }
        return true;
    }
    makeMove(mv) {
        const select = mv[0];
        const move = mv[1];
        const shoot = mv[2];
        const returnValue = {
            moveString: Board.moveToString(mv, this.boardSize),
            move: mv,
            board: Array.from(this.board),
            turn: this.turn,
            playerTurn: this.playerTurn
        };
        this.board[select] = BoardCell.EMPTY;
        this.board[move] = this.playerTurn;
        this.board[shoot] = BoardCell.ARROW;
        this.playerTurn = 3 - this.playerTurn;
        this.turn += 1;
        return returnValue;
    }
    static gameLost(board, size, turn) {
        // Returns true if game lost for current player. 
        for (let x = 0; x < size; x++) {
            for (let y = 0; y < size; y++) {
                if (board[x + size * y] === turn) {
                    // Check three tiles to left
                    if (x !== 0) {
                        if (board[x - 1 + size * y] === BoardCell.EMPTY)
                            return false;
                        if (y !== 0 && board[x - 1 + size * (y - 1)] === BoardCell.EMPTY)
                            return false;
                        if (y !== size - 1 && board[x - 1 + size * (y + 1)] === BoardCell.EMPTY)
                            return false;
                    }
                    // Check three tiles to right
                    if (x !== size - 1) {
                        if (board[x + 1 + size * y] === BoardCell.EMPTY)
                            return false;
                        if (y !== 0 && board[x + 1 + size * (y - 1)] === BoardCell.EMPTY)
                            return false;
                        if (y !== size - 1 && board[x + 1 + size * (y + 1)] === BoardCell.EMPTY)
                            return false;
                    }
                    // Check up and down.
                    if (y !== 0 && board[x + size * (y - 1)] === BoardCell.EMPTY)
                        return false;
                    if (y !== size - 1 && board[x + size * (y + 1)] === BoardCell.EMPTY)
                        return false;
                }
            }
        }
        return true;
    }
    static count_pieces(board, size) {
        let white = 0;
        let black = 0;
        for (let x = 0; x < size * size; x++) {
            if (board[x] == 1)
                white++;
            if (board[x] == 2)
                black++;
        }
        return [white, black];
    }
}
