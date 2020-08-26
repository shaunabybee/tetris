// **********************************************
// TETRIS! An homage to one of my favorite games.
// Shauna Bybee (shaunameyerbybee@gmail.com | https://github.com/shaunabybee)
// May 2020
// **********************************************

document.addEventListener("DOMContentLoaded", function() {


// **********************************************
// Global Variables
// **********************************************

let board = document.getElementById("gameboard");
let playButton = document.getElementById("play");
let playMask = document.getElementById("boardMask");
let pointsDisplay = document.getElementById("points");
let linesDisplay = document.getElementById("lines");
let levelDisplay = document.getElementById("level");
let gameOverDisplay = document.getElementById("gameOver");


let isPlaying = false;
let isEnded = true;
let activePiece = null;
let boardArray;	// 2D array representing the entire gameboard - each squre contains a Brick or null
let level;
let points;
let speed;
let linesCleared;
let autoMove;	// Reference to the setInterval function that automatically moves the piece down

let colorChange;


// **********************************************
// Color Changing Background
// **********************************************
let hue = 200;

function changeColor() {
	if (hue <= 359) {
		hue += 1;
	}
	else {
		hue = 0;
	}

	document.body.style.background = "hsl(" + hue + ", 50%, 70%)";
}


// **********************************************
// Bricks and Pieces
// **********************************************

// Individual bricks are needed after the pieces settle (when lines clear, the individual bricks remain)
class Brick {
	constructor(type, x=0, y=0) {
		this.type = type;
		this.x = x;
		this.y = y;
	}

	draw() {
		let newBrick = document.createElement("div");
		newBrick.className = "brick " + this.type;
		newBrick.style.left = this.x * 31 + 1 + "px";
		newBrick.style.top = this.y * 31 + 1 + "px";
		newBrick.style.backgroundImage = "url(images/brick_" + this.type + ".svg)";
		board.append(newBrick);
	}
}

// Pieces are used when the piece is falling, before it settles - makes it easier to keep it together, rotate it, etc.
class Piece {
	constructor(type, x=0, y=0) {
		this.type = type;
		this.x = x;
		this.y = y;
		this.bricks = [];
		this.imageURL = "";
		this.rotation = 0;
	}

	canMoveDown() {
		for (let brick of this.bricks) {
			if ((brick.y >= 19 || (boardArray[brick.y + 1][brick.x]))) {
				return false;
			}
		}
		return true;
	}

	canMoveUp() {
		for (let brick of this.bricks) {
			if (brick.y < 20) {
				if ((brick.y <= 0 || (boardArray[brick.y - 1][brick.x]))) {
					return false;
				}
			}
		}
		return true;
	}

	canMoveLeft() {
		for (let brick of this.bricks) {
			if ((brick.x <= 0 || (boardArray[brick.y][brick.x - 1]))) {
				return false;
			}
		}
		return true;		
	}

	canMoveRight() {
		for (let brick of this.bricks) {
			if ((brick.x >= 9 || (boardArray[brick.y][brick.x + 1]))) {
				return false;
			}
		}
		return true;
	}

	moveDown() {
		this.y += 1;
		for (let brick of this.bricks) {
			brick.y += 1;
		}
	}

	moveUp() {
		this.y -= 1;
		for (let brick of this.bricks) {
			brick.y -= 1;
		}
	}

	moveLeft() {
		this.x -= 1;
		for (let brick of this.bricks) {
			brick.x -= 1;
		}

	}

	moveRight() {
		this.x += 1;
		for (let brick of this.bricks) {
			brick.x += 1;
		}
	}


	rotate() {

		// Store copies of original bricks in case we need to reverse
		let originalBricks = [
			new Brick(this.type, this.bricks[0].x, this.bricks[0].y),
			new Brick(this.type, this.bricks[1].x, this.bricks[1].y),
			new Brick(this.type, this.bricks[2].x, this.bricks[2].y),
			new Brick(this.type, this.bricks[3].x, this.bricks[3].y)
		];

		let originalX = this.x;
		let originalY = this.y;
		let originalRotation = this.rotation;

		// Move all the bricks based on which type of piece this is
		this.bricks[0].x += this.rotateDelta[this.rotation][0].x;
		this.bricks[0].y += this.rotateDelta[this.rotation][0].y;
		this.bricks[1].x += this.rotateDelta[this.rotation][1].x;
		this.bricks[1].y += this.rotateDelta[this.rotation][1].y;
		this.bricks[2].x += this.rotateDelta[this.rotation][2].x;
		this.bricks[2].y += this.rotateDelta[this.rotation][2].y;
		this.bricks[3].x += this.rotateDelta[this.rotation][3].x;
		this.bricks[3].y += this.rotateDelta[this.rotation][3].y;

		// this.stayInBounds();	// Keeps piece from going past the left and right walls
		
		this.rotation = (this.rotation + 90) % 360;
		this.stayInBounds();
		
		// Check for collisions with other pieces - if there is one, move the piece back to its original position
		if (this.hasCollision()) {
			if (this.canMoveLeft()) {
				this.moveLeft();
			}
			else if (this.canMoveRight()) {
				this.moveRight();
			}
			if (this.hasCollision()) {
				for (let index in this.bricks) {
					this.bricks[index] = originalBricks[index];
				}
				this.x = originalX;
				this.y = originalY;
				this.rotation = originalRotation;
			}
		}
	}




	// **********************************************
	// Collision
	// **********************************************

	hasFloorCollision() {
		for (let brick of this.bricks) {
			if (brick.y > 19) {
				return true;
			}
		}
		return false;
	}

	hasCollision() {
		let collision = false;
		for (let brick of this.bricks) {
			if (boardArray[brick.y][brick.x]) {
				collision = true;
			}
		}
		return collision;
	}

	// Keep the piece from overlapping the sides when rotating
	stayInBounds() {
		let leftDelta = 0;
		let rightDelta = 0;
		let bottomDelta = 0;
		for (let brick of this.bricks) {
			if (brick.x < 0) {
				leftDelta = Math.max((0 - brick.x), leftDelta);
			}
			else if (brick.x > 9) {
				rightDelta = Math.min((9 - brick.x), rightDelta);
			}
			if (brick.y > 19) {
				bottomDelta = Math.min((19 - brick.y), bottomDelta);
			}
		}

		this.x = this.x + leftDelta + rightDelta;
		this.y = this.y + bottomDelta;

		for (let brick of this.bricks) {
			brick.x = brick.x + leftDelta + rightDelta;
			brick.y = brick.y + bottomDelta;
		}
	}

	// **********************************************
	// Draw
	// **********************************************

	draw() {
		let newPiece = document.createElement("div");
		newPiece.className = "piece " + this.type;
		newPiece.style.left = this.x * 31 + 1 + "px";
		newPiece.style.top = this.y * 31 + 1 + "px";
		newPiece.style.backgroundImage = "url(images/" + this.type + "_" + this.rotation + ".svg)";
		board.append(newPiece);
	}
}


// **********************************************
// P1: Long piece
// **********************************************
class P1 extends Piece {
	constructor(x=0, y=0) {
		super("p1", x, y);
		this.bricks = [new Brick("p1", x+1, y), new Brick("p1", x+1, y+1), new Brick("p1", x+1, y+2), new Brick("p1", x+1, y+3)];
		this.rotateDelta = {
			0: {
				0: {x:  2, y:  1},
				1: {x:  1, y:  0},
				2: {x:  0, y: -1},
				3: {x: -1, y: -2}
			},
			90: {
				0: {x: -1, y:  2},
				1: {x:  0, y:  1},
				2: {x:  1, y:  0},
				3: {x:  2, y: -1}
			},
			180: {
				0: {x: -2, y: -1},
				1: {x: -1, y:  0},
				2: {x:  0, y:  1},
				3: {x:  1, y:  2}
			},
			270: {
				0: {x:  1, y: -2},
				1: {x:  0, y: -1},
				2: {x: -1, y:  0},
				3: {x: -2, y:  1}
			}
		}
	}
}


// **********************************************
// P2: T
// **********************************************
class P2 extends Piece {
	constructor(x=0, y=0) {
		super("p2", x, y);
		this.bricks = [new Brick("p2", x+1, y), new Brick("p2", x, y+1), new Brick("p2", x+1, y+1), new Brick("p2", x+2, y+1)];
		this.rotateDelta = {
			0: {
				0: {x:  1, y:  1},
				1: {x:  1, y: -1},
				2: {x:  0, y:  0},
				3: {x: -1, y:  1}
			},
			90: {
				0: {x: -1, y:  1},
				1: {x:  1, y:  1},
				2: {x:  0, y:  0},
				3: {x: -1, y: -1}
			},
			180: {
				0: {x: -1, y: -1},
				1: {x: -1, y:  1},
				2: {x:  0, y:  0},
				3: {x:  1, y: -1}
			},
			270: {
				0: {x:  1, y: -1},
				1: {x: -1, y: -1},
				2: {x:  0, y:  0},
				3: {x:  1, y:  1}
			}
		}
	}
}


// **********************************************
// P3: Forward S
// **********************************************
class P3 extends Piece {
	constructor(x=0, y=0) {
		super("p3", x, y);
		this.bricks = [new Brick("p3", x+1, y), new Brick("p3", x+2, y), new Brick("p3", x, y+1), new Brick("p3", x+1, y+1)];
		this.rotateDelta = {
			0: {
				0: {x:  1, y:  1},
				1: {x:  0, y:  2},
				2: {x:  1, y: -1},
				3: {x:  0, y:  0}
			},
			90: {
				0: {x: -1, y:  1},
				1: {x: -2, y:  0},
				2: {x:  1, y:  1},
				3: {x:  0, y:  0}
			},
			180: {
				0: {x: -1, y: -1},
				1: {x:  0, y: -2},
				2: {x: -1, y:  1},
				3: {x:  0, y:  0}
			},
			270: {
				0: {x:  1, y: -1},
				1: {x:  2, y:  0},
				2: {x: -1, y: -1},
				3: {x:  0, y:  0}
			}
		}
	}
}


// **********************************************
// P4: Backward S
// **********************************************
class P4 extends Piece {
	constructor(x=0, y=0) {
		super("p4", x, y);
		this.bricks = [new Brick("p4", x, y), new Brick("p4", x+1, y), new Brick("p4", x+1, y+1), new Brick("p4", x+2, y+1)];
		this.rotateDelta = {
			0: {
				0: {x:  2, y:  0},
				1: {x:  1, y:  1},
				2: {x:  0, y:  0},
				3: {x: -1, y:  1}
			},
			90: {
				0: {x:  0, y:  2},
				1: {x: -1, y:  1},
				2: {x:  0, y:  0},
				3: {x: -1, y: -1}
			},
			180: {
				0: {x: -2, y:  0},
				1: {x: -1, y: -1},
				2: {x:  0, y:  0},
				3: {x:  1, y: -1}
			},
			270: {
				0: {x:  0, y: -2},
				1: {x:  1, y: -1},
				2: {x:  0, y:  0},
				3: {x:  1, y:  1}
			}
		}
	}
}


// **********************************************
// P5: L
// **********************************************
class P5 extends Piece {
	constructor(x=0, y=0) {
		super("p5", x, y);
		this.bricks = [new Brick("p5", x+1, y), new Brick("p5", x+1, y+1), new Brick("p5", x+1, y+2), new Brick("p5", x+2, y+2)];
		this.rotateDelta = {
			0: {
				0: {x:  1, y:  1},
				1: {x:  0, y:  0},
				2: {x: -1, y: -1},
				3: {x: -2, y:  0}
			},
			90: {
				0: {x: -1, y:  1},
				1: {x:  0, y:  0},
				2: {x:  1, y: -1},
				3: {x:  0, y: -2}
			},
			180: {
				0: {x: -1, y: -1},
				1: {x:  0, y:  0},
				2: {x:  1, y:  1},
				3: {x:  2, y:  0}
			},
			270: {
				0: {x:  1, y: -1},
				1: {x:  0, y:  0},
				2: {x: -1, y:  1},
				3: {x:  0, y:  2}
			}
		}
	}
}


// **********************************************
// P6: Backward L
// **********************************************
class P6 extends Piece {
	constructor(x=0, y=0) {
		super("p6", x, y);
		this.bricks = [new Brick("p6", x+1, y), new Brick("p6", x+1, y+1), new Brick("p6", x+1, y+2), new Brick("p6", x, y+2)];
		this.rotateDelta = {
			0: {
				0: {x:  1, y:  1},
				1: {x:  0, y:  0},
				2: {x: -1, y: -1},
				3: {x:  0, y: -2}
			},
			90: {
				0: {x: -1, y:  1},
				1: {x:  0, y:  0},
				2: {x:  1, y: -1},
				3: {x:  2, y:  0}
			},
			180: {
				0: {x: -1, y: -1},
				1: {x:  0, y:  0},
				2: {x:  1, y:  1},
				3: {x:  0, y:  2}
			},
			270: {
				0: {x:  1, y: -1},
				1: {x:  0, y:  0},
				2: {x: -1, y:  1},
				3: {x: -2, y:  0}
			}
		}
	}
}


// **********************************************
// P7: Square
// **********************************************
class P7 extends Piece {
	constructor(x=0, y=0) {
		super("p7", x, y);
		this.bricks = [new Brick("p7", x, y), new Brick("p7", x+1, y), new Brick("p7", x, y+1), new Brick("p7", x+1, y+1)];
		this.rotateDelta = {
			0: {
				0: {x: 0, y: 0},
				1: {x: 0, y: 0},
				2: {x: 0, y: 0},
				3: {x: 0, y: 0}
			},
			90: {
				0: {x: 0, y: 0},
				1: {x: 0, y: 0},
				2: {x: 0, y: 0},
				3: {x: 0, y: 0}
			},
			180: {
				0: {x: 0, y: 0},
				1: {x: 0, y: 0},
				2: {x: 0, y: 0},
				3: {x: 0, y: 0}
			},
			270: {
				0: {x: 0, y: 0},
				1: {x: 0, y: 0},
				2: {x: 0, y: 0},
				3: {x: 0, y: 0}
			}
		}
	}

	rotate() {
		// do nothing for the square piece	
	} 
}


// **********************************************
// Move active piece down
// **********************************************

function moveActivePieceDown() {
	if (activePiece.canMoveDown()) {
		activePiece.moveDown();
		redraw();
	}

	else {
		stopPiece();
		return;
	}
}


// **********************************************
// Generate Pieces and Redraw
// **********************************************

function getNewPiece()  {
	// activePiece = new P1(4, 0);
	let pieceType = Math.floor(Math.random() * 7) + 1;
	if (pieceType == 1) {
		activePiece = new P1(4, 0);
	}
	else if (pieceType == 2) {
		activePiece = new P2(4, 0);
	}
	else if (pieceType == 3) {
		activePiece = new P3(4, 0);
	}
	else if (pieceType == 4) {
		activePiece = new P4(4, 0);
	}
	else if (pieceType == 5) {
		activePiece = new P5(4, 0);
	}
	else if (pieceType == 6) {
		activePiece = new P6(4, 0);
	}
	else if (pieceType == 7) {
		activePiece = new P7(4, 0);
	}

	redraw();

	if (activePiece.hasCollision()) {
		endGame();
	}
}

function redraw() {
	board.innerHTML = "";
	activePiece.draw();

	for (y=0; y<20; y++) {
		for (x=0; x<10; x++) {
			if (boardArray[y][x]) {
				boardArray[y][x].draw();
			}
		}
	}
	
	pointsDisplay.textContent = points;
	linesDisplay.textContent = linesCleared;
	levelDisplay.textContent = level;


}


// **********************************************
// Clear Lines
// **********************************************


// This sets the piece down on the floor
function stopPiece() {

	for (let brick of activePiece.bricks) {

	}

	// Store the y values of the piece as it's settling to the floor
	// so we can check and see if the lines need to be cleared
	let linesToCheck = [];

	for (let brick of activePiece.bricks) {
		
		// add the Brick to the board
		boardArray[brick.y][brick.x] = brick;

		// add the y value of the brick to linesToCheck so we can check if it needs to be cleared
		if (!(linesToCheck.includes(brick.y))) {	
			linesToCheck.push(brick.y);
		}


	}

	processLines(linesToCheck);
	redraw();
	activePiece = null;
	getNewPiece();
}

// Process the lines that correspond to the y-value for the bricks in the active piece
// to see if they need to be cleared
function processLines(linesToCheck) {
	linesToCheck.sort();
	let linesToClear = [];

	for (line of linesToCheck) {
		if (lineIsFull(line)) {
			linesToClear.push(line);
		}
	}

	for (line of linesToClear) {
		clearLine(line);
	}

	// Process scoring
	if (linesToClear.length == 4) {
		points = points + ((level + 1) * 1200);
	}
	else if (linesToClear.length == 3) {
		points = points + ((level + 1) * 300);
	}
	else if (linesToClear.length == 2) {
		points = points + ((level + 1) * 100);
	}
	else if (linesToClear.length == 1) {
		points = points + ((level + 1) * 40);
	}

	level = Math.floor(linesCleared / 10);

	if (level < 4) {
		speed = 1200 - (level * 200);	
	}
	else if (level < 10) {
		speed = 500 - ((level - 4) * 100);
	}
	else {
		speed = 50;
	}

}

// Checks an individual line to see if it is full and needs to be cleared
function lineIsFull(line) {
	full = true;
	for (x = 0; x < 10; x++) {
		if (boardArray[line][x] === null) {
			full = false;
		}
	}
	return full;
}

// Clears a line and moves everything down
function clearLine(line) {
	for (y = line; y > 0; y--) {
		for (x=0; x<10; x++) {
			boardArray[y][x] = boardArray[y - 1][x];
			if (boardArray[y][x]) {
				boardArray[y][x].y = boardArray[y][x].y + 1;
			} 
		}
	}
	linesCleared++;
	boardArray[0] = [null, null, null, null, null, null, null, null, null, null];
}


// **********************************************
// Bind Arrow Keys --> Motion
// **********************************************

window.addEventListener("keydown", function(e) {
	if (e.key == "ArrowDown" && activePiece && !(isEnded)) {
		if (activePiece.canMoveDown()) {
			clearInterval(autoMove);
			moveActivePieceDown();
			autoMove = setInterval(function() {
				moveActivePieceDown();
			}, speed);
			event.preventDefault();
		}

		else {
			stopPiece();
			event.preventDefault();
		}
	}

	if (e.key == "ArrowRight" && activePiece && !(isEnded)) {
		if (activePiece.canMoveRight()) {
			activePiece.moveRight();
			redraw();
		}
		event.preventDefault();
	}

	if (e.key == "ArrowLeft" && activePiece && !(isEnded)) {
		if (activePiece.canMoveLeft()) {
			activePiece.moveLeft();
			redraw();
		}
		event.preventDefault();
	}

	if (e.key == "ArrowUp" && activePiece && !(isEnded)) {
		activePiece.rotate();
		redraw();
		event.preventDefault();
	}

	if (e.key == " ") {
		togglePlay();
		event.preventDefault();
	}
});


// **********************************************
// Start and Stop Game
// **********************************************

function initializeGame() {
	boardArray = [
		[null, null, null, null, null, null, null, null, null, null],
		[null, null, null, null, null, null, null, null, null, null],
		[null, null, null, null, null, null, null, null, null, null],
		[null, null, null, null, null, null, null, null, null, null],
		[null, null, null, null, null, null, null, null, null, null],
		[null, null, null, null, null, null, null, null, null, null],
		[null, null, null, null, null, null, null, null, null, null],
		[null, null, null, null, null, null, null, null, null, null],
		[null, null, null, null, null, null, null, null, null, null],
		[null, null, null, null, null, null, null, null, null, null],
		[null, null, null, null, null, null, null, null, null, null],
		[null, null, null, null, null, null, null, null, null, null],
		[null, null, null, null, null, null, null, null, null, null],
		[null, null, null, null, null, null, null, null, null, null],
		[null, null, null, null, null, null, null, null, null, null],
		[null, null, null, null, null, null, null, null, null, null],
		[null, null, null, null, null, null, null, null, null, null],
		[null, null, null, null, null, null, null, null, null, null],
		[null, null, null, null, null, null, null, null, null, null],
		[null, null, null, null, null, null, null, null, null, null],
	];
	level = 0;
	points = 0;
	speed = 1200;
	linesCleared = 0;
	gameOverDisplay.style.display = "none";
}


function start() {
	if (isEnded) {
		isEnded = false;
		initializeGame();
		getNewPiece();	
	}

	playMask.style.display = "none";
	colorChange = setInterval(changeColor, 100);
	
	
	autoMove = setInterval(function() {
		moveActivePieceDown();
	}, speed);
	playButton.textContent = "PAUSE";

	isPlaying = true;
}

function pause() {
	clearInterval(autoMove);
	clearInterval(colorChange);

	playMask.style.backgroundColor = "hsl(" + hue + ", 50%, 70%)";
	playMask.style.display = "block";

	playButton.textContent = "PLAY";
	isPlaying = false;
}

function endGame() {
	clearInterval(autoMove);
	clearInterval(colorChange);

	playMask.style.backgroundColor = "hsl(" + hue + ", 50%, 70%)";
	playMask.style.display = "block";
	gameOverDisplay.style.display = "block";

	playButton.textContent = "PLAY AGAIN";
	isPlaying = false;
	isEnded = true;
}

function togglePlay() {
	if (!isPlaying) {
		start();
	}
	else {
		pause();
	}
}

playButton.addEventListener('click', togglePlay);

});


