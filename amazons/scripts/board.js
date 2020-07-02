class board{
    constructor(board_size_, board_width_, debug_) {
    	this.board_size = board_size_;

    	this.board_width = board_width_;
		this.cell_width = this.board_width/this.board_size;

		this.debug = debug_;

    	this.board_colour1 = color(209, 139, 71);
		this.board_colour2 = color(254, 205, 157);
		this.arrow_color = color(155, 69, 72);
		this.background_color = color(255, 230, 200);


		this.circle_width = this.cell_width - 10;
		this.arrow_inset = 5;

		this.initialise();
    }

    initialise(){
		this.board = new Array(this.board_size);

		for(var i=0; i<this.board_size; i++){
			this.board[i] = new Array(this.board_size);
			for(var j=0; j<this.board_size; j++){
				this.board[i][j] = 0;
			}
		}
		this.board[3][0] = 2;
	    this.board[6][0] = 2;
	    this.board[0][3] = 2;
	    this.board[9][3] = 2;
	    
	    this.board[3][9] = 1;
	    this.board[6][9] = 1;
	    this.board[0][6] = 1;
	    this.board[9][6] = 1;

	    this.player_turn = 1;
	    this.game_state = 0;

	    this.game_won = false;
	    this.turn = 1;
	    this.selected_amazon = [-1,-1];
	}

	mousePressed(x, y){
		if((width-this.board_width)/2 < x && (width+this.board_width)/2 > x &&
			(height-this.board_width)/2 < y && (height+this.board_width)/2 > y){
				var column = (x + (this.board_width-width)/2)/this.cell_width;
				var ro = (y + (this.board_width-height)/2)/this.cell_width;

				this.cellPressed(Math.floor(column), Math.floor(ro));
		}
	}

	cellPressed(col, row){
		if(this.debug){
			console.log("Cell pressed: ", col, row);
		}
		// If selecting an an amazon
		if(this.game_state == 0){
			if(this.board[col][row] == this.player_turn){
				this.selected_amazon = [col,row];
				this.game_state = 1;
				if(this.debug){
					console.log("	Cell selected: ", col, row);
				}
			}
		}
		// If amazon is selected
		else if(this.game_state == 1){
			// Reselect amazon
			if(this.board[col][row] == this.player_turn){
				this.selected_amazon = [col,row];
				if(this.debug){
					console.log("	Cell selected: ", col, row);
				}
			}
			// Move amazon
			else if(this.valid_queen_move(this.selected_amazon[0], this.selected_amazon[1], col, row)){
				this.board[this.selected_amazon[0]][this.selected_amazon[1]] = 0;
	            this.board[col][row] = this.player_turn;
	            this.game_state = 2;
	           
	            this.selected_amazon = [col, row];
			}
			else if(this.debug){
				console.log("	", col, row, " is an invalid move")
			}
		}
		// Shoot arrow
		else if(this.game_state == 2){
			if(this.valid_queen_move(this.selected_amazon[0], this.selected_amazon[1], col, row)){
				this.board[col][row] = 3;
		        this.game_state = 0;
		        this.player_turn = 3 - this.player_turn;
		        this.turn += 1;
			}
			else if(this.debug){
				console.log("	", col, row, " is an invalid arrow")
			}
			this.gameEnded();
		}
		
	}

	valid_queen_move(x1, y1, x2, y2){
		var xdiff = x1-x2;
		var ydiff = y1-y2;

		if(xdiff == 0 && ydiff == 0){
			return false;
		}

		if(!(xdiff == 0 || ydiff == 0 || abs(xdiff)==abs(ydiff))){
			return false;
		}

		var xdir;
		if(xdiff == 0)xdir = 0;
		else if(xdiff > 0)xdir = 1;
		else xdir = -1;

		var ydir;
		if(ydiff == 0)ydir = 0;
		else if(ydiff > 0)ydir = 1;
		else ydir = -1;

		for(var i=1; i <= max(abs(xdiff), abs(ydiff)); i++){
			if(this.board[x1 - i*xdir][y1 - i*ydir] != 0){
				return false;
			}
		}
		return true;
	}

	gameEnded(){
		if(this.wincheck()){
			this.game_won = true;
			console.log("Game has been won.");
		}
		console.log("Game hasn't been won.");
	}

	wincheck(){
		for(var x=0; x<this.board_size; x++){
			for(var y=0; y<this.board_size; y++){
				if(this.board[x][y] == this.player_turn){
					// Check all adjacent tiles
					if(x!=0){
						if(this.board[x-1][y] == 0)
							return false;

						if(y!=0){
							if(this.board[x-1][y-1] == 0)
								return false;
						}

						if(y!=this.board_size-1){
							if(this.board[x-1][y+1] == 0)
								return false;
						}
					}

					if(x!=this.board_size-1){
						if(this.board[x+1][y] == 0)
							return false;

						if(y!=0){
							if(this.board[x+1][y-1] == 0)
								return false;
						}

						if(y!=this.board_size-1){
							if(this.board[x+1][y+1] == 0)
								return false;
						}
					}

					if(y!=0){
						if(this.board[x][y-1] == 0)
							return false;
					}

					if(y!=this.board_size-1){
						if(this.board[x][y+1] == 0)
							return false;
					}
				}
			}
		}
		return true;
	}

	draw(){
		background(this.background_color);
  		this.drawGUI();
  		push();
  		this.drawBoard();
  		this.drawPieces();
  		pop();
	}

	drawGUI(){
		// show turn
		textAlign(CENTER);
		textSize(32);
		if(this.player_turn == 1){
		  	fill(255);
		    text("White's turn", width/2, (height-this.board_width)/4);
		}else{
			fill(0);
		    text("Black's turn", width/2, (height-this.board_width)/4);
		}

		// Show turn number
		textAlign(LEFT);
		fill(0);
  		text("Turn " + this.turn, 20, (height-this.board_width)/4);

  		if(this.game_won){
  			textSize(64);
  			textAlign(CENTER);
  			if(this.player_turn == 1){
  				fill(0);
  				text("Black wins", width/2, (3*height + this.board_width)/4);
  			}else{
  				fill(255);
  				text("White wins", width/2, (3*height + this.board_width)/4);  			
  			}
  		}
	}

	drawBoard(){
		// Draw board
  		translate(width/2, height/2);
  		strokeWeight(3);
  		stroke(0);

  		line(-this.board_width/2, -this.board_width/2, -this.board_width/2, this.board_width/2);
  		line(-this.board_width/2, -this.board_width/2, this.board_width/2, -this.board_width/2);
  		line(-this.board_width/2, this.board_width/2, this.board_width/2, this.board_width/2);
  		line(this.board_width/2, -this.board_width/2, this.board_width/2, this.board_width/2);
  		noStroke();

  		for(var x=0; x<this.board_size; x++){
  			for(var y=0; y<this.board_size; y++){
  				if((x+y)%2 == 0){
  					fill(this.board_colour1);
  				}else{
  					fill(this.board_colour2);
  				}
  				rect(-this.board_width/2 + x*this.cell_width,
  					-this.board_width/2 + y*this.cell_width, 
  					this.cell_width, this.cell_width);
  			}
  		}

  		// Show the selected tile
  		if(this.game_state == 1){
    		fill(0, 255, 0, 50);
    		rect(-this.board_width/2 + this.selected_amazon[0]*this.cell_width , 
    			-board_width/2 + this.selected_amazon[1]*this.cell_width, this.cell_width, this.cell_width);
  		}else if(this.game_state == 2){
    		fill(255, 0, 0, 50);
    		rect(-board_width/2 + this.selected_amazon[0]*this.cell_width , 
    			-board_width/2 + this.selected_amazon[1]*this.cell_width, this.cell_width, this.cell_width);
  		}
	}

	drawPieces(){
		for(var x=0; x<this.board_size; x++){
  			for(var y=0; y<this.board_size; y++){
  				// If player 1's piece
  				if(this.board[x][y] == 1){
  					fill(255);
  					ellipse(-this.board_width/2 + (x+0.5)*this.cell_width,
  							-this.board_width/2 + (y+0.5)*this.cell_width,
  							this.circle_width, this.circle_width);
  				}
  				// If player 2's piece
  				else if(this.board[x][y] == 2){
  					fill(0);
  					ellipse(-this.board_width/2 + (x+0.5)*this.cell_width,
  							-this.board_width/2 + (y+0.5)*this.cell_width,
  							this.circle_width, this.circle_width);

  				}
  				// If an arrow
  				if(this.board[x][y] == 3){
  					fill(this.arrow_color);
  					quad(-this.board_width/2 + x*this.cell_width + this.arrow_inset,
  						-this.board_width/2 + (y+0.5)*this.cell_width,
  						-this.board_width/2 + (x+0.5)*this.cell_width,
  						-this.board_width/2 + y*this.cell_width + this.arrow_inset,

  						-this.board_width/2 + (x+1)*this.cell_width - this.arrow_inset,
  						-this.board_width/2 + (y+0.5)*this.cell_width,
  						-this.board_width/2 + (x+0.5)*this.cell_width,
  						-this.board_width/2 + (y+1)*this.cell_width - this.arrow_inset
  						);
  				}
  			}
  		}
	}
}