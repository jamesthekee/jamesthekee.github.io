"use strict";
const aiUndoAllowed = true;
class AIBoardManager extends BoardManager {
    constructor(boardSize) {
        super(boardSize);
        this.gameDifficulty = 0;
        this.computerTurn = 1;
        this.aiVsAi = false;
        this.randomMovesLeft = 0;
    }
    // @ts-ignore
    initialise(boardSize, gameDifficulty, playerIsWhite) {
        this.gameDifficulty = gameDifficulty;
        this.aiVsAi = false;
        this.computerTurn = playerIsWhite ? 2 : 1;
        super.initialise(boardSize);
        if (this.board.playerTurn === this.computerTurn) {
            this.asyncMakeAIMove();
        }
    }
    initialiseAiVsAi(boardSize, gameDifficulty) {
        this.gameDifficulty = gameDifficulty;
        this.aiVsAi = true;
        this.randomMovesLeft = 2; // one random move per player
        this.computerTurn = -1; // not used in ai vs ai mode
        super.initialise(boardSize);
        this.asyncMakeAIMove();
    }
    undo(onlyHalfMove) {
        if (this.board.playerTurn === this.computerTurn)
            return;
        if (this.board.gameState === 2) {
            this.board.revertHalfMove();
            this.update();
            return;
        }
        if (aiUndoAllowed) {
            super.undo(onlyHalfMove);
            super.undo(onlyHalfMove);
        }
    }
    redo() {
        if (this.board.playerTurn === this.computerTurn)
            return;
        if (aiUndoAllowed) {
            super.redo();
            super.redo();
        }
    }
    clicked(event) {
        if (this.gameOver || this.aiVsAi || this.board.playerTurn === this.computerTurn || this.aiThinking)
            return;
        const col = Math.floor(event.offsetX / this.tileSize);
        const row = Math.floor(event.offsetY / this.tileSize);
        const result = this.board.cellPressed(col, row);
        if (result !== null) {
            this.moveStack.push(result);
            this.redoStack = [];
        }
        this.update();
        if (this.board.playerTurn === this.computerTurn && !this.gameOver) {
            this.asyncMakeAIMove();
        }
    }
    semiRandomMove() {
        // Select random half move(move amazon) and then a random arrow 
        const pieces = Board.getPlayersPieces(this.board.board, this.computerTurn);
        let allMoves = [];
        for (const piece of pieces) {
            allMoves = allMoves.concat(Board.generatePartialMoves(piece, this.board.board, this.boardSize));
        }
        if (allMoves.length === 0)
            return [0, 0, 0];
        const randIndex = Math.floor(Math.random() * allMoves.length);
        const [selected, moveTo] = allMoves[randIndex];
        this.board.board[selected] = 0;
        const arrowMoves = Board.generatePartialMoves(moveTo, this.board.board, this.boardSize);
        this.board.board[selected] = this.computerTurn;
        if (arrowMoves.length === 0)
            return [0, 0, 0];
        const shootRandIndex = Math.floor(Math.random() * arrowMoves.length);
        const shoot = arrowMoves[shootRandIndex][1];
        return [selected, moveTo, shoot];
    }
    static getAllMoves(board, turn, size, max_lim) {
        const pieces = Board.getPlayersPieces(board, turn);
        const halfMoves = [];
        for (const piece of pieces) {
            halfMoves.push(Board.generatePartialMoves(piece, board, size));
        }
        // TODO: shuffle moves here a bit. So for every branch_lim every amazon has an even chance.
        shuffleArray(halfMoves);
        const allMoves = [];
        for (const chunk of halfMoves) {
            if (chunk.length === 0)
                continue;
            const piece = chunk[0][0];
            board[piece] = 0;
            for (const move of chunk) {
                const moves = Board.generatePartialMoves(move[1], board, size);
                for (const thing of moves) {
                    allMoves.push([move[0], thing[0], thing[1]]);
                }
            }
            board[piece] = turn;
            if (allMoves.length >= max_lim) {
                return allMoves;
            }
        }
        return allMoves;
    }
    randomMove() {
        const allMoves = AIBoardManager.getAllMoves(this.board.board, this.computerTurn, this.boardSize, Infinity);
        const randIndex = Math.floor(Math.random() * allMoves.length);
        return allMoves[randIndex];
    }
    asyncMakeAIMove() {
        this.aiThinking = true;
        this.update();
        setTimeout(() => this.makeAIMove(), 0);
    }
    randomMoveForPlayer(player) {
        const allMoves = AIBoardManager.getAllMoves(this.board.board, player, this.boardSize, Infinity);
        return allMoves[Math.floor(Math.random() * allMoves.length)];
    }
    makeAIMove() {
        const currentPlayer = this.aiVsAi ? this.board.playerTurn : this.computerTurn;
        const depth = getAiDepth();
        const branchLimOverride = getAiBranchLim();
        let engineMove;
        if (this.aiVsAi && this.randomMovesLeft > 0) {
            engineMove = this.randomMoveForPlayer(currentPlayer);
            this.randomMovesLeft--;
        }
        else if (this.gameDifficulty === 1) {
            engineMove = this.randomMoveForPlayer(currentPlayer);
        }
        else {
            const defaultLim = this.gameDifficulty === 2 ? 75 : 300;
            const branchLim = branchLimOverride ?? defaultLim;
            engineMove = Minimax.findBestMove(this.board.board, currentPlayer, depth, branchLim);
        }
        const mv = this.board.makeMove(engineMove);
        this.moveStack.push(mv);
        this.aiThinking = false;
        this.update();
        if (this.aiVsAi && !this.gameOver) {
            this.asyncMakeAIMove();
        }
    }
}
