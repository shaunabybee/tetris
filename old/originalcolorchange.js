let red = 60;
let green = 80;
let blue = 160;

redDirection = "up";
greenDirection = "up";
blueDirection = "up";

function changeColor1() {
	if (redDirection == "up" && red >= 255) {
		redDirection = "down";
		red -= 1;
	}
	else if (redDirection == "up") {
		red += 1;
	}
	else if (redDirection == "down" && red <= 40) {
		redDirection = "up";
		red += 1;
	}
	else {
		red -= 1;
	}

	if (greenDirection == "up" && green >= 255) {
		greenDirection = "down";
		green -= 1;
	}
	else if (greenDirection == "up") {
		green += 1;
	}
	else if (greenDirection == "down" && green <= 40) {
		greenDirection = "up";
		green += 1;
	}
	else {
		green -= 1;
	}

	if (blueDirection == "up" && blue >= 255) {
		blueDirection = "down";
		blue -= 1;
	}
	else if (blueDirection == "up") {
		blue += 1;
	}
	else if (blueDirection == "down" && blue <= 40) {
		blueDirection = "up";
		blue += 1;
	}
	else {
		blue -= 1;
	}

	body.style.background = "rgb(" + red + "," + green + "," + blue + ")";
}