var canvas = document.getElementById("conway");

var gliderBtn = document.getElementById("glider");
var startBtn = document.getElementById("start");
var clearBtn = document.getElementById("clear");
var stopBtn = document.getElementById("stop");
var nextBtn = document.getElementById("next");

canvas.addEventListener("mousedown",getPosition,false);
var interval;

nextBtn.addEventListener('click', function() {
	getNextGen();
});

stopBtn.addEventListener('click', function() {
	clearInterval(interval);
});

clearBtn.addEventListener('click', function() {
	console.log("clear clicked");
	cellState = {};
	canvas.width = canvas.width;
	drawBoard();
	clearInterval(interval);
});



gliderBtn.addEventListener('click', function() {
	canvas.width = canvas.width;
	drawBoard();
	cellState = {};
	var arr = [[1,5],[1,6],[2,5],[2,6],[11,5],[11,6],[11,7],[12,4],[13,3],[14,3], [15,6],[16,4],[17,5],[17,6],[17,7],[18,6],[16,8],[12,8],[13,9],
[14,9], [21,5], [22,5],[22,4], [21,4], [21,3], [22,3], [23,2],
[25,2], [25,1], [23, 6],[25,6],[25,7],[35,3],[36,3],[36,4],[35,4]];

		arr.forEach(function(i) {
			turnCellOn(i[0],i[1]);
		}); 

});

var cellState = {};

// Any live cell with fewer than two live neighbours dies, as if 
//   caused by under-population.
// Any live cell with two or three live neighbours lives on to the 
//    next generation.
// Any live cell with more than three live neighbours dies, as if 
//    by overcrowding.
// Any dead cell with exactly three live neighbours becomes a live 
//    cell, as if by reproduction.

startBtn.addEventListener('click', function() {
	interval = setInterval(getNextGen,1000);
});

function getNextGen() {
	console.log("cellState",cellState);
	var keys = Object.keys(cellState);
	var turnOff = [];
	var birthCheck = {};
	
	keys.forEach(function(i) {
		if(cellState[i]) {
			var sp = i.split(",");
			var nbrs = findNeighbours(parseInt(sp[0]),parseInt(sp[1]));
			
			nbrs.forEach(function(k) {
				if(!cellState[""+k[0]+","+k[1]]) {
					birthCheck[""+k[0]+","+k[1]]=true;
				}
			});
			
			var liveNum = nbrs.filter(function(j) {
				return cellState[""+j[0]+","+j[1]];
			}).length;

			if(liveNum < 2) {
				turnOff.push([parseInt(sp[0]),parseInt(sp[1])]);
			} else if(liveNum === 2 || liveNum === 3) {
				// live on
			} else if(liveNum > 3) {
			  turnOff.push([parseInt(sp[0]),parseInt(sp[1])]);
			}
		}
	});
	
	
	var turnOn = [];
	Object.keys(birthCheck).forEach(function(i) {
		var sp = i.split(",");
		var nbrs = findNeighbours(parseInt(sp[0]),parseInt(sp[1]));
		
		var liveNum = nbrs.filter(function(j) {
				return cellState[""+j[0]+","+j[1]];
			}).length;

			if(liveNum === 3) {
				// turnCellOn(parseInt(sp[0]),parseInt(sp[1]));
				if(parseInt(sp[0]) >= 0 && parseInt(sp[1]) >= 0) {
					turnOn.push([parseInt(sp[0]),parseInt(sp[1])]);
				}
				console.log("born",[parseInt(sp[0]),parseInt(sp[1])]);
			}
		
	});
	
	
	turnOff.forEach(function(i) {
		//console.log("turnoff",turnOff);
		turnCellOff(i[0],i[1]);
	});
	
	turnOn.forEach(function(i) {
		//console.log("turnOn",turnOn);
		turnCellOn(i[0],i[1]);
	});
}


function liveNeighbours(x,y) { 
	console.log("liveNeighbours",x,y);
}

function getPosition(e) {
	var x = e.x;
	var y = e.y;

	x -= canvas.offsetLeft;
	y -= canvas.offsetTop;

	var xf = Math.floor(x/15);
	var yf = Math.floor(y/15);

	if(cellState[""+xf+","+yf]) {
		turnCellOff(xf,yf);
	} else {
		turnCellOn(xf,yf);
	}

}

function turnCellOn(x,y) {
	context.fillStyle = "lightblue";
  context.fillRect((x*15)+1,(y*15)+1,14,14);

  cellState[""+x+","+y] = true;
}

function turnCellOff(x,y) {
	context.fillStyle = "white";
  context.fillRect((x*15)+1,(y*15)+1,14,14);
  cellState[""+x+","+y] = false;
}

function findNeighbours(x,y) {
	return [[x,y-1],[x,y+1],[x-1,y],[x+1,y],[x-1,y-1],
	        [x-1,y+1],[x+1,y-1],[x+1,y+1]];
}


var context = canvas.getContext("2d");

// grid width and height
var gridWidth = 601;
var gridHeight = 601;
var gridPadding = 0;
var canvasWidth = gridWidth + (gridPadding * 2) 
var canvasHeight = gridHeight + (gridPadding * 2)  

function drawBoard() {

	// draw the horizontal lines
	for(var y = 0.5; y <= gridWidth; y +=15) {
		context.moveTo(gridPadding , gridPadding + y);
		context.lineTo(gridPadding + gridWidth , gridPadding + y);
	}

	//draw the vertical lines
	for(var x = 0.5; x <= gridWidth; x +=15) {
		context.moveTo(gridPadding + x, gridPadding);
		context.lineTo(gridPadding + x , gridPadding + gridHeight );
	}

	context.strokeStyle = "black";
	context.stroke();
}

drawBoard();