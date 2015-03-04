"use strict";

/*Globals*/
var surround = {
	"nw": new Cell(-1, -1),
	"n":  new Cell( 0, -1),
	"ne": new Cell( 1, -1),
	"e":  new Cell(-1,  0),
	"w":  new Cell( 1,  0),
	"sw": new Cell(-1,  1),
	"s":  new Cell( 0,  1),
	"se": new Cell( 1,  1)
};

/*Manipulate Individual Cells*/
function Cell(x, y, state){
	this.x = x;
	this.y = y;
	this.state = state;
}
Cell.prototype.add = function(addition){
	return new Cell(this.x + addition.x, this.y + addition.y, this.state)
};

/*Manipulate Grid*/
function Grid(width, height){
	this.width = width;
	this.height = height;
	this.board = new Array(width * height);
	for (var i = 0; i < this.board.length; i++) {
		this.board[i] = new Cell(i % this.width, Math.floor(i / this.width), "dead");
	}
};
Grid.prototype.print = function(){
	var line = "";
	for (var y = 0; y < this.height; y++) {
		for (var x = 0; x < this.width; x++) {
			line += this.board[x + this.width * y].state
		}
		line += "\n";
	}
	return line
};
Grid.prototype.contains = function(cell){
	return cell.x >= 0 && cell.x < this.width &&
				 cell.y >= 0 && cell.y < this.height
};
Grid.prototype.get = function(cell){
	return this.board[cell.x + this.width * cell.y]
}
Grid.prototype.set = function(cell, state){
	this.board[cell.x + this.width * cell.y].state = state;
}


Grid.prototype.checkNeighbors = function(cell){
	var living = 0;
	cell = this.get(cell);
	
	for (var dir in surround) {
		var check = cell.add(surround[dir]);
		if (this.contains(check)){
			if (this.get(check).state == "alive") living ++;
		}
	}
	return living
}

/*Run a Generation*/
Grid.prototype.generation = function(){
	var newGrid = new Grid(this.width, this.height);
	for (var y = 0; y < this.height; y++){
		for (var x = 0; x < this.width; x++){
			var cell = this.get(new Cell(x, y)),
					neighbors = this.checkNeighbors(cell);
			if (neighbors < 2 || neighbors > 3)
				newGrid.set(cell, "dead");
			else if (neighbors == 3) 
				newGrid.set(cell, "alive");
			else if (neighbors == 2)
				newGrid.set(cell, cell.state)
		}
	}
	this.board = newGrid.board;
}

/*Attach script to webpage*/

function displayGrid(){
	var life = document.getElementsByClassName('life')[0],
			rows = document.getElementsByClassName('row'),
	    height = rows.length,
	    cols = rows[0].getElementsByClassName('col'),
	    width = cols.length,
			grid = new Grid(width, height),
			gridLen = grid.board.length,
			cells = document.getElementsByClassName('col'),
			cellLen = cells.length,
			startButton = document.querySelector('button[name="start"]'),
			stopButton,
			resetButton = document.querySelector('button[name="reset"]');

	function setCell(){
		for (var j = 0; j < cellLen; j++){
			if (this == grid.board[j].node){
				if (grid.board[j].state == "alive"){
					grid.board[j].state = "dead";
					this.className = this.className.replace('alive', 'dead');
				}
				else {
					grid.board[j].state = "alive";
					this.className = this.className.replace('dead', 'alive')
				}
				break
			}
		}
	}

	/*Set effects of running a generation*/
	function runTick(){
		var total = 0;
		for (var y = 0; y < height; y++){
			var row = rows[y],
					col = row.getElementsByClassName('col');
			for (var x = 0; x < width; x++){
				var cell = col[x],
				    cellInfo = grid.get(new Cell(x, y));
				if ( cellInfo.state == "alive" ){ 
					cell.className = cell.className.replace('dead', 'alive');
					total ++;
				}
				else cell.className = cell.className.replace('alive', 'dead');
			}
		}
		if (total === 0) {
			stopButton.click();
			return displayGrid();
		}
	}

	for (var i = 0; i < gridLen; i++){
		grid.board[i].node = cells[i];
		if( !cells[i].className.match(/(dead|alive)/) )
			cells[i].className += " dead";
	}
	life.onclick = function setAllCells(e){
		setCell.call(e.target);
	};

	/*Set example board*/
	grid.set(new Cell(4,4), "alive");
	grid.set(new Cell(4,5), "alive");
	grid.set(new Cell(4,6), "alive");
	grid.set(new Cell(5,5), "alive");
	grid.set(new Cell(6,5), "alive");
	runTick();

	/*Run a generation*/
	function go(){
		grid.generation();
		runTick();
	}

	! function startStop(){
		startButton.onclick = function setGo(e){
			var callGo = setInterval(go, 500);
			stopButton = startButton;
			stopButton.setAttribute("name", "stop");
			stopButton.innerHTML = "Stop";
			startButton = null;

			stopButton.onclick = function setStop(ev){
				clearInterval(callGo);
				startButton = stopButton;
				startButton.setAttribute("name", "start");
				startButton.innerHTML = "Start";
				stopButton = null;
				startStop();
				ev.preventDefault();
			};
			e.preventDefault();
		};
	}();
	resetButton.onclick = function reset(){
		try { stopButton.click(); }
		finally { return displayGrid() }
	};

}

window.addEventListener("load", displayGrid);

