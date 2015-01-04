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
},
		alive = "X",
		dead = ".";

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
		this.board[i] = new Cell(i % this.width, Math.floor(i / this.width), dead);
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
	var living = 0,
			cell = this.get(cell);
	for (var dir in surround) {
		var check = cell.add(surround[dir]);
		if (this.contains(check)){
			if (this.get(check).state == alive) living ++;
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
				newGrid.set(cell, dead);
			else if (neighbors == 3) 
				newGrid.set(cell, alive);
			else if (neighbors == 2)
				newGrid.set(cell, cell.state)
		}
	}
	this.board = newGrid.board;
	console.log(this.print());
}

/*Run the Script*/
var grid = new Grid(10, 10);
console.log(grid.print());