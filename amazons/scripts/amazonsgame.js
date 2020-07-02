var current_board;

var board_size = 10;
var board_width = 640;

var debug = false;

function setup() {
    var canvas = createCanvas(1200, 800);
    //canvas.parent('sketch-div');
    textSize(32);
    
    current_board = new board(board_size, board_width, debug);
    current_board.draw();
}

function draw(){

}

function mousePressed(){
	current_board.mousePressed(mouseX, mouseY);
	current_board.draw();
}
