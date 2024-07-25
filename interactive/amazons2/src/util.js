
const DIRECTIONS = [
    [1, 0], [0, 1], [-1, 0], [0, -1],
    [1, 1], [-1, -1], [1, -1], [-1, 1]
];



function sign(x) {
	if (x === 0) return 0;
	if (x < 0) return -1;
	return 1;
}

function fillBoard(){
	// assume boardSize = 10

	for(var x=0;x<10;x++)
		for(var y=0; y<10; y++)
			bm.board.board[x+y*10]=3;
	bm.board.board[3+0] = 2;
	bm.board.board[6+0] = 2;
	bm.board.board[0+30] = 2;
	bm.board.board[9+30] = 2;
	bm.board.board[3+90] = 1;
	bm.board.board[6+90] = 1;
	bm.board.board[0+60] = 1;
	bm.board.board[9+60] = 1;
	bm.board.board[6+80] = 0;
}

var max = Math.max;
var min = Math.min;
var abs = Math.abs;
