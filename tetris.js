// **********************************************
// Global Variables for Gameboard, Pieces
// **********************************************

board = document.getElementById("gameboard");
let pieceArray = [];
let brickArray = [];



// **********************************************
// Color Changing Background
// **********************************************
hue = 200

function changeColor() {
	if (hue <= 359) {
		hue += 1;
	}
	else {
		hue = 0;
	}

	document.body.style.background = "hsl(" + hue + ", 50%, 70%)";
}

setInterval(changeColor, 100);




// **********************************************
// Define Piece Classes
// **********************************************

class Brick {
	constructor(x=0, y=0) {
		this.x = x;
		this.y = y;
	}
}

class Piece {
	constructor(type, x=0, y=0) {
		this.type = type;
		this.x = x;
		this.y = y;
		this.bricks = [];
		this.imageURL = "";
		this.rotation = 0;
	}

	moveDown() {
		this.y += 1;
		for (let brick of this.bricks) {
			brick.y += 1;
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

	draw() {
		let newPiece = document.createElement("div");
		newPiece.className = "piece " + this.type;
		newPiece.style.left = this.x * 31 + 1 + "px";
		newPiece.style.top = this.y * 31 + 1 + "px";
		newPiece.style.backgroundImage = "url(" + this.imageURL + ")";
		newPiece.style.transform = "rotate(" + this.rotation + "deg)";
		board.append(newPiece);
	}

	rotate() {
		this.rotation = (this.rotation + 90) % 360;
		console.log(this.rotation);
	}
}

class P1 extends Piece {
	constructor(x=0, y=0) {
		super("p1", x, y);
		this.bricks = [new Brick(x+1, y), new Brick(x+1, y+1), new Brick(x+1, y+2), new Brick(x+1, y+3)];
		this.imageURL = "images/p1.svg";
	}

	rotate() {
		if (this.rotation == 0) {
			this.bricks[0].x += 2;
			this.bricks[0].y += 1;
			this.bricks[1].x += 1;
			this.bricks[2].y -= 1;
			this.bricks[3].x -= 1;
			this.bricks[3].y -= 2;
		}

		else if (this.rotation == 90) {
			this.bricks[0].x -= 1;
			this.bricks[0].y += 2;
			this.bricks[1].y += 1;
			this.bricks[2].x += 1;
			this.bricks[3].x += 2;
			this.bricks[3].y -= 1;
		}

		else if (this.rotation == 180) {
			this.bricks[0].x -= 2;
			this.bricks[0].y -= 1;
			this.bricks[1].x -= 1;
			this.bricks[2].y += 1;
			this.bricks[3].x += 1;
			this.bricks[3].y += 2;
		}

		else if (this.rotation == 270) {
			this.bricks[0].x += 1;
			this.bricks[0].y -= 2;
			this.bricks[1].y -= 1;
			this.bricks[2].x -= 1;
			this.bricks[3].x -= 2;
			this.bricks[3].y += 1;
		}
		super.rotate();
	}
}

class P2 extends Piece {
	constructor(x=0, y=0) {
		super("p2", x, y);
		this.bricks = [new Brick(x+1, y), new Brick(x, y+1), new Brick(x+1, y+1), new Brick(x+2, y+1)];
		this.imageURL = "images/p2.svg";
	}

	rotate() {
		if (this.rotation == 0) {
			this.bricks[0].x += 1;
			this.bricks[0].y += 1;
			this.bricks[1].x += 1;
			this.bricks[1].y -= 1;
			this.bricks[3].x -= 1;
			this.bricks[3].y += 1;
		}

		else if (this.rotation == 90) {
			this.bricks[0].x -= 1;
			this.bricks[0].y += 1;
			this.bricks[1].x += 1;
			this.bricks[1].y += 1;
			this.bricks[3].x -= 1;
			this.bricks[3].y -= 1;

		}

		else if (this.rotation == 180) {
			this.bricks[0].x -= 1;
			this.bricks[0].y -= 1;
			this.bricks[1].x -= 1;
			this.bricks[1].y += 1;
			this.bricks[3].x += 1;
			this.bricks[3].y -= 1;

		}

		else if (this.rotation == 270) {
			this.bricks[0].x += 1;
			this.bricks[0].y -= 1;
			this.bricks[1].x -= 1;
			this.bricks[1].y -= 1;
			this.bricks[3].x += 1;
			this.bricks[3].y += 1;
		}
		super.rotate();
	}
}

class P3 extends Piece {
	constructor(x=0, y=0) {
		super("p3", x, y);
		this.bricks = [new Brick(x+1, y), new Brick(x+2, y), new Brick(x, y+1), new Brick(x+1, y+1)];
		this.imageURL = "images/p3.svg";
	}

	rotate() {
		if (this.rotation == 0) {
			this.bricks[0].x += 1;
			this.bricks[0].y += 1;
			this.bricks[1].y += 2;
			this.bricks[2].x += 1;
			this.bricks[2].y -= 1;
		}

		else if (this.rotation == 90) {
			this.bricks[0].x -= 1;
			this.bricks[0].y += 1;
			this.bricks[1].x -= 2;
			this.bricks[2].x += 1;
			this.bricks[2].y += 1;
		}

		else if (this.rotation == 180) {
			this.bricks[0].x -= 1;
			this.bricks[0].y -= 1;
			this.bricks[1].y -= 2;
			this.bricks[2].x -= 1;
			this.bricks[2].y += 1;
		}

		else if (this.rotation == 270) {
			this.bricks[0].x += 1;
			this.bricks[0].y -= 1;
			this.bricks[1].x += 2;
			this.bricks[2].x -= 1;
			this.bricks[2].y -= 1;
		}
		super.rotate();
	}
}

class P4 extends Piece {
	constructor(x=0, y=0) {
		super("p4", x, y);
		this.bricks = [new Brick(x, y), new Brick(x+1, y), new Brick(x+1, y+1), new Brick(x+2, y+1)];
		this.imageURL = "images/p4.svg";
	}

	rotate() {
		if (this.rotation == 0) {
			this.bricks[0].x += 2;
			this.bricks[1].x += 1;
			this.bricks[1].y += 1;
			this.bricks[3].x -= 1;
			this.bricks[3].y += 1;
		}

		else if (this.rotation == 90) {
			this.bricks[0].y += 2;
			this.bricks[1].x -= 1;
			this.bricks[1].y += 1;
			this.bricks[3].x -= 1;
			this.bricks[3].y -= 1;
		}

		else if (this.rotation == 180) {
			this.bricks[0].x -= 2;
			this.bricks[1].x -= 1;
			this.bricks[1].y -= 1;
			this.bricks[3].x += 1;
			this.bricks[3].y -= 1;

		}

		else if (this.rotation == 270) {
			this.bricks[0].y -= 2;
			this.bricks[1].x -= 1;
			this.bricks[1].y -= 1;
			this.bricks[3].x += 1;
			this.bricks[3].y -= 1;
		}
		super.rotate();
	}
}

class P5 extends Piece {
	constructor(x=0, y=0) {
		super("p5", x, y);
		this.bricks = [new Brick(x+1, y), new Brick(x+1, y+1), new Brick(x+1, y+2), new Brick(x+2, y+2)];
		this.imageURL = "images/p5.svg";
	}

	rotate() {
		if (this.rotation == 0) {
			this.bricks[0].x += 1;
			this.bricks[0].y += 1;
			this.bricks[2].x -= 1;
			this.bricks[2].y -= 1;
			this.bricks[3].x -= 2;
		}

		else if (this.rotation == 90) {
			this.bricks[0].x -= 1;
			this.bricks[0].y += 1;
			this.bricks[2].x += 1;
			this.bricks[2].y -= 1;
			this.bricks[3].y -= 2;
		}

		else if (this.rotation == 180) {
			this.bricks[0].x -= 1;
			this.bricks[0].y -= 1;
			this.bricks[2].x += 1;
			this.bricks[2].y += 1;
			this.bricks[3].x += 2;
		}

		else if (this.rotation == 270) {
			this.bricks[0].x += 1;
			this.bricks[0].y -= 1;
			this.bricks[2].x -= 1;
			this.bricks[2].y += 1;
			this.bricks[3].y += 2;
		}
		super.rotate();
	}
}

class P6 extends Piece {
	constructor(x=0, y=0) {
		super("p6", x, y);
		this.bricks = [new Brick(x+1, y), new Brick(x+1, y+1), new Brick(x+1, y+2), new Brick(x, y+2)];
		this.imageURL = "images/p6.svg";
	}

	rotate() {
		if (this.rotation == 0) {
			this.bricks[0].x += 1;
			this.bricks[0].y += 1;
			this.bricks[2].x -= 1;
			this.bricks[2].y -= 1;
			this.bricks[3].y -= 2;
		}

		else if (this.rotation == 90) {
			this.bricks[0].x -= 1;
			this.bricks[0].y += 1;
			this.bricks[2].x += 1;
			this.bricks[2].y -= 1;
			this.bricks[3].x += 2;
		}

		else if (this.rotation == 180) {
			this.bricks[0].x -= 1;
			this.bricks[0].y -= 1;
			this.bricks[2].x += 1;
			this.bricks[2].y += 1;
			this.bricks[3].y += 2;
		}

		else if (this.rotation == 270) {
			this.bricks[0].x += 1;
			this.bricks[0].y -= 1;
			this.bricks[2].x -= 1;
			this.bricks[2].y += 1;
			this.bricks[3].x -= 2;
		}
		super.rotate();
	}
}

class P7 extends Piece {
	constructor(x=0, y=0) {
		super("p7", x, y);
		this.bricks = [new Brick(x, y), new Brick(x+1, y), new Brick(x, y+1), new Brick(x+1, y+1)];
		this.imageURL = "images/p7.svg";
	}

	rotate() {} // do nothing for the square piece
}




// **********************************************
// Arrow Keys --> Motion
// **********************************************

window.addEventListener("keydown", function(e) {
	if (e.key == "ArrowDown" && activePiece) {
		for (let brick of activePiece.bricks) {
			if ((brick.y >= 19) || (brickArray.some((element) => element.x == brick.x && element.y == brick.y + 1)))  {
				for (let brick of activePiece.bricks) {
					brickArray.push(brick);
				}
				pieceArray.push(activePiece);
				activePiece = null;
				getNewPiece();
				return;
			}
		}
		activePiece.moveDown();
		redraw();
		event.preventDefault();
	}

	if (e.key == "ArrowRight" && activePiece) {
		for (let brick of activePiece.bricks) {
			if (brick.x >= 9) {
				return;
			}
		}
		activePiece.moveRight();
		redraw();
		event.preventDefault();
	}

	if (e.key == "ArrowLeft" && activePiece) {
		for (let brick of activePiece.bricks) {
			if (brick.x <= 0) {
				return;
			}
		}
		activePiece.moveLeft();
		redraw();
		event.preventDefault();
	}

	if (e.key == "ArrowUp" && activePiece) {
		activePiece.rotate();
		redraw();
		event.preventDefault();
	}
});


// **********************************************
// Generate Pieces and Redraw
// **********************************************

function getNewPiece() {
	let pieceType = Math.floor(Math.random() * 6) + 1;
	console.log(pieceType);
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
}

function redraw() {
	board.innerHTML = "";
	for (let piece of pieceArray) {
		piece.draw();
	}
	activePiece.draw();
}




getNewPiece();




