"use strict";
const canvas = document.getElementById('gameBoard');
const ctx = canvas.getContext('2d');
const arrowColour = "#9b4548";
const boardColour1 = "#fecd9d";
const boardColour2 = "#d18b47";
const bg = "#ffe6c8";
const moveIndicatorOpacity = 0.2;
class BoardManager {
    constructor(boardSize) {
        this.boardSize = boardSize;
        this.board = new Board(this.boardSize);
        this.showMoves = true;
        this.showLastMove = false;
        this.tileSize = 0;
        this.moveStack = [];
        this.redoStack = [];
        this.gameOver = false;
        this.aiThinking = false;
        this.historyViewIndex = null;
    }
    setHistoryView(index) {
        this.historyViewIndex = index;
        this.update();
    }
    initialise(boardSize) {
        this.boardSize = boardSize;
        this.tileSize = canvas.width / this.boardSize;
        this.board.initialise(this.boardSize);
        this.moveStack = [];
        this.redoStack = [];
        this.gameOver = false;
        this.update();
    }
    toggleShowMoves() {
        this.showMoves = !this.showMoves;
        this.update();
    }
    toggleShowLastMove() {
        this.showLastMove = !this.showLastMove;
        this.update();
    }
    getPixelPosition(index) {
        const x = this.tileSize * (index % this.boardSize);
        const y = this.tileSize * Math.floor(index / this.boardSize);
        return [x, y];
    }
    drawBoard() {
        const viewing = this.historyViewIndex !== null;
        const i = this.historyViewIndex;
        // Board to render: after the selected history move, or live board
        const displayBoard = viewing
            ? (i + 1 < this.moveStack.length ? this.moveStack[i + 1].board : this.board.board)
            : this.board.board;
        const historyMove = viewing ? this.moveStack[i].move : null;
        for (let row = 0; row < this.boardSize; row++) {
            for (let col = 0; col < this.boardSize; col++) {
                ctx.fillStyle = (row + col) % 2 === 0 ? boardColour1 : boardColour2;
                ctx.fillRect(col * this.tileSize, row * this.tileSize, this.tileSize, this.tileSize);
            }
        }
        if (!viewing && this.board.gameState === 1) {
            ctx.globalAlpha = moveIndicatorOpacity;
            ctx.fillStyle = "rgb(0, 255, 0)";
            const [x, y] = this.getPixelPosition(this.board.selectedAmazon);
            ctx.fillRect(x, y, this.tileSize, this.tileSize);
            ctx.globalAlpha = 1;
        }
        else if (!viewing && this.board.gameState === 2) {
            ctx.globalAlpha = moveIndicatorOpacity;
            ctx.fillStyle = "rgb(255, 0, 0)";
            const [x, y] = this.getPixelPosition(this.board.movedAmazon);
            ctx.fillRect(x, y, this.tileSize, this.tileSize);
            ctx.globalAlpha = 1;
        }
        if (viewing && historyMove) {
            this.drawArrow(historyMove[0], historyMove[1], 14, "green");
            this.drawArrow(historyMove[1], historyMove[2], 9, "red");
        }
        else if (!viewing && this.showLastMove && this.moveStack.length > 0) {
            const lastMove = this.moveStack[this.moveStack.length - 1].move;
            this.drawArrow(lastMove[0], lastMove[1], 14, "green");
            this.drawArrow(lastMove[1], lastMove[2], 9, "red");
        }
        for (let row = 0; row < this.boardSize; row++) {
            for (let col = 0; col < this.boardSize; col++) {
                const index = col + row * this.boardSize;
                if (displayBoard[index] === BoardCell.WHITE_AMAZON)
                    this.drawPiece(col, row, "white", "circle");
                if (displayBoard[index] === BoardCell.BLACK_AMAZON)
                    this.drawPiece(col, row, "black", "circle");
                if (displayBoard[index] === BoardCell.ARROW)
                    this.drawPiece(col, row, arrowColour, "arrow");
            }
        }
        if (!viewing && this.showMoves)
            this.drawMoves();
        if (this.aiThinking) {
            ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
    }
    drawArrow(from, to, lineWidth, color) {
        // Draw arrows showing moves on the board, i.e from amazon moved from A to B
        ctx.globalAlpha = moveIndicatorOpacity;
        const fromx = (from % this.boardSize) * this.tileSize + this.tileSize / 2;
        const fromy = Math.floor(from / this.boardSize) * this.tileSize + this.tileSize / 2;
        const tox = (to % this.boardSize) * this.tileSize + this.tileSize / 2;
        const toy = Math.floor(to / this.boardSize) * this.tileSize + this.tileSize / 2;
        ctx.strokeStyle = color;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(fromx, fromy);
        ctx.lineTo(tox, toy);
        ctx.lineWidth = lineWidth;
        ctx.stroke();
        ctx.globalAlpha = 1;
    }
    drawHintCircle(cell, order) {
        ctx.fillStyle = "#FFffff";
        ctx.strokeStyle = "#000000";
        ctx.globalAlpha = 1;
        const x = (cell % this.boardSize) * this.tileSize + this.tileSize / 2;
        const y = Math.floor(cell / this.boardSize) * this.tileSize + this.tileSize / 2;
        ctx.beginPath();
        ctx.arc(x, y, 12, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
        ctx.fillStyle = "#000000";
        ctx.font = "20px Arial";
        ctx.fillText(order.toString(), x - 5, y + 5, 20);
        // ctx.fillText(number.toString(), x, y, 30);
    }
    drawIndicatorCircle(move) {
        const x = (move[1] % this.boardSize) * this.tileSize + this.tileSize / 2;
        const y = Math.floor(move[1] / this.boardSize) * this.tileSize + this.tileSize / 2;
        ctx.beginPath();
        ctx.arc(x, y, this.tileSize / 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
    }
    drawMoves() {
        if (this.board.gameState === 0)
            return;
        ctx.globalAlpha = 0.2;
        let origin;
        if (this.board.gameState === 1) {
            ctx.fillStyle = "green";
            origin = this.board.selectedAmazon;
        }
        else {
            ctx.fillStyle = "red";
            origin = this.board.movedAmazon;
        }
        const moves = Board.generatePartialMoves(origin, this.board.board, this.boardSize);
        for (const move of moves) {
            this.drawIndicatorCircle(move);
        }
        ctx.globalAlpha = 1;
    }
    drawPiece(col, row, color, shape) {
        const x = col * this.tileSize + this.tileSize / 2;
        const y = row * this.tileSize + this.tileSize / 2;
        ctx.fillStyle = color;
        ctx.beginPath();
        if (shape === 'circle') {
            ctx.arc(x, y, this.tileSize / 2.5, 0, Math.PI * 2);
        }
        else if (shape === 'arrow') {
            ctx.moveTo(x - this.tileSize / 2, y);
            ctx.lineTo(x, y + this.tileSize / 2);
            ctx.lineTo(x + this.tileSize / 2, y);
            ctx.lineTo(x, y - this.tileSize / 2);
        }
        ctx.fill();
        ctx.closePath();
    }
    undo(onlyHalfMove) {
        if (this.board.gameState === 2) {
            this.board.revertHalfMove();
            this.update();
            return;
        }
        if (onlyHalfMove) {
            return;
        }
        const move = this.moveStack.pop();
        if (move !== undefined) {
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
        if (this.board.gameState === 2)
            return;
        const move = this.redoStack.pop();
        if (move !== undefined) {
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
    returnFromHistory() {
        this.historyViewIndex = null;
        this.update();
    }
    clicked(event) {
        if (this.historyViewIndex !== null) {
            this.returnFromHistory();
            return;
        }
        if (this.gameOver)
            return;
        const col = Math.floor(event.offsetX / this.tileSize);
        const row = Math.floor(event.offsetY / this.tileSize);
        const result = this.board.cellPressed(col, row);
        if (result !== null) {
            this.moveStack.push(result);
            this.redoStack = [];
        }
        this.update();
    }
    update() {
        this.gameOver = false;
        if (Board.gameLost(this.board.board, this.boardSize, this.board.playerTurn)) {
            let s;
            s = (this.board.playerTurn === 1) ? "Black has won!" : "White has won!";
            document.getElementById("overlay-text").innerHTML = s;
            this.gameOver = true;
        }
        else {
            document.getElementById("overlay-text").innerHTML = '';
        }
        this.drawBoard();
        updateTurnIndicator(this.board.playerTurn, this.board.gameState, this.aiThinking);
        updateMoveList(this.moveStack, this.historyViewIndex);
        let count;
        if (this.boardSize === 10)
            count = 10 * 10 - 8;
        else if (this.boardSize === 8)
            count = 8 * 8 - 6;
        else
            count = 6 * 6 - 4;
        count -= this.board.turn;
        count++;
        updateTilesCount(count);
        if (showTerritory) {
            const score = Minimax.relativeTerritory(this.board.board, this.boardSize);
            document.getElementById("score").innerHTML = "Territory: " + score;
        }
        else {
            document.getElementById("score").innerHTML = "";
        }
    }
    import() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.txt';
        input.onchange = (e) => {
            const file = e.target.files?.[0];
            if (!file)
                return;
            const reader = new FileReader();
            reader.onload = (ev) => {
                this.loadFromString(ev.target?.result);
            };
            reader.readAsText(file);
        };
        input.click();
    }
    loadFromString(text) {
        const letters = "ABCDEFGHIJKLM";
        const lines = text.split('\n').map(l => l.trim()).filter(l => l && !l.startsWith('//'));
        const boardSize = parseInt(lines[0]);
        if (isNaN(boardSize) || ![6, 8, 10].includes(boardSize)) {
            console.error('Invalid board size in imported file');
            return;
        }
        this.initialise(boardSize);
        const parseIndex = (token) => {
            const col = letters.indexOf(token[0].toUpperCase());
            const row = parseInt(token.slice(1)) - 1;
            return col + row * boardSize;
        };
        for (let i = 1; i < lines.length; i++) {
            const parts = lines[i].replace(/,$/, '').split('-');
            if (parts.length !== 3)
                continue;
            const mv = [parseIndex(parts[0]), parseIndex(parts[1]), parseIndex(parts[2])];
            if (mv.some(idx => isNaN(idx) || idx < 0 || idx >= boardSize * boardSize))
                continue;
            this.moveStack.push(this.board.makeMove(mv));
        }
        this.update();
    }
    export() {
        const dateTime = new Date();
        const dateStr = dateTime.toLocaleDateString('en-GB').replace(/\//g, '-');
        const timeStr = dateTime.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
        let string = `// Amazons game played on ${dateStr} ${timeStr}\n`;
        string += `// played at https://jamesthekee.github.io/amazons\n`;
        string += `${this.boardSize}\n`;
        for (const move of this.moveStack) {
            string += move.moveString + ',\n';
        }
        const blob = new Blob([string], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `amazons_${dateStr}_${timeStr.replace(':', '')}.txt`;
        a.click();
        URL.revokeObjectURL(url);
    }
}
