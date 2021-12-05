let loading = true;

let board = [];
let levelNum = 0;
let inGame = false;
let didWin = false;

player.steps = 0;

let moves = [];

async function loadMenu() {
	resetBoard();
	displayLevel();
	levelNum = await prompt("Select level (0-110): ", 9, 7, 26);
	moves = [levelSet.levels[levelNum]];
	loadLevel(levelSet.levels[levelNum]);
	displayLevel();
	displaySteps();
}

loadMenu();

function undo() {
	if (moves.length <= 1) {
		return;
	}
	resetBoard();
	moves.pop();
	loadLevel(moves[moves.length - 1], true); // load it again
}

button("Undo", 2, 24, undo);

button("Reset", 2, 29, () => {
	resetBoard();
	loadLevel(levelSet.levels[levelNum], true); // load it again
});

button("Menu", 2, 35, loadMenu);

function displayLevel() {
	text("level " + ("" + levelNum).padStart(3, "0"), 2, 0);
}

function displaySteps() {
	text("steps " + ("" + player.steps).padStart(3, "0"), 2, 10);
}

let objects = [];

function loadLevel(level, doReset) {
	level = level.slice(0, -1).split("\n");
	for (let row = 0; row < level.length; row++) {
		board.push(level[row].split(""));
	}

	let objectNum = 0;

	for (let row = 0; row < board.length; row++) {
		for (let col = 0; col < board[row].length; col++) {
			let t = board[row][col];
			if (t == "#") {
				let img = "wall-up";

				if (col == 0 && row == 0) {
					img = "wall-topleft";
				} else if (col == 0 && row == board.length - 1) {
					img = "wall-bottomleft";
				} else if (col == board[row].length - 1 && row == 0) {
					img = "wall-topright";
				} else if (col == board[row].length - 1 && row == board.length - 1) {
					img = "wall-bottomright";
				} else if (col == 0) {
					img = "wall-left";
				} else if (col == board[row].length - 1) {
					img = "wall-right";
				} else if (row == board.length - 1) {
					img = "wall-down";
				} else if (row == 0) {
					img = "wall-up";
				} else if (doReset) {
					img = objects[objectNum];
					objectNum++;
				} else {
					let num = Math.floor(Math.random() * 15);
					img = "furniture-" + num;
					objects.push(img);
				}
				walls.createSprite(img, row, col);
			}
			if (t == "$" || t == "*") {
				let box = boxes.createSprite("box", row, col, 1);
				box.setCollider(
					"rectangle",
					world.tileSize * 0.2,
					world.tileSize * 0.49,
					world.tileSize * 0.6,
					world.tileSize * 0.3
				);
			}
			if (t == "." || t == "*" || t == "+") {
				goals.createSprite("goal", row, col);
			}
			if (t == "@" || t == "+") {
				player.row = row;
				player.col = col;
			}
		}
	}

	inGame = true;
}

function resetBoard() {
	player.steps = 0;
	displaySteps();
	walls.removeSprites();
	boxes.removeSprites();
	goals.removeSprites();
	board = [];
	player.row = 0;
	player.col = 0;
}

function keyPressed() {
	if (key == "u") {
		undo();
	} else if (key == "r") {
		resetBoard();
		loadLevel(levelSet.levels[levelNum], true); // load it again
	} else if (key == "m") {
		loadMenu();
	}
	if (player.isMoving) return;
	if (keyCode === UP_ARROW) {
		player.walk("up");
	} else if (keyCode === DOWN_ARROW) {
		player.walk("down");
	} else if (keyCode === LEFT_ARROW) {
		player.walk("left");
	} else if (keyCode === RIGHT_ARROW) {
		player.walk("right");
	}
}

function displayBoard() {
	let str = "";
	for (let row = 0; row < board.length; row++) {
		str += board[row].join("") + "\n";
	}
	log(str);
	return str;
}

function moveOnBoard(row, col) {
	board[row][col] = "@";

	// if the player is on any goal tile, make it a + sign
	// to indicate that
	for (let i = 0; i < goals.length; i++) {
		let goal = goals[i];
		if (goal.row == row && goal.col == col) {
			board[row][col] = "+";
		}
	}
}

function moveBox(r1, c1, r2, c2) {
	if (board[r1][c1] != "$" && board[r1][c1] != "*") {
		return null; // there is no box to move
	} else if (
		board[r2][c2] != "#" &&
		board[r2][c2] != "$" &&
		board[r2][c2] != "*"
	) {
		board[r2][c2] = "$";
		for (let i = 0; i < goals.length; i++) {
			let goal = goals[i];
			if (goal.row == r2 && goal.col == c2) {
				board[r2][c2] = "*";
			}
		}
		return true; // box can be moved
	}
	return false; // the player is not able to push the box
}

player.walk = async function (direction) {
	let r = player.row;
	let c = player.col;

	let aniName = "walk-" + direction;
	if (direction == "left" || direction == "right") {
		aniName = "walk-lr";
	}

	let canMoveBox;
	if (inGame) {
		// prevent player from moving if they try to move into a wall
		if (direction == "up") {
			if (board[r - 1][c] == "#") return;
			canMoveBox = moveBox(r - 1, c, r - 2, c);
		} else if (direction == "down") {
			if (board[r + 1][c] == "#") return;
			canMoveBox = moveBox(r + 1, c, r + 2, c);
		} else if (direction == "left") {
			if (board[r][c - 1] == "#") return;
			canMoveBox = moveBox(r, c - 1, r, c - 2);
		} else if (direction == "right") {
			if (board[r][c + 1] == "#") return;
			canMoveBox = moveBox(r, c + 1, r, c + 2);
		}
		if (canMoveBox == false) return;

		if (canMoveBox) aniName = "push" + aniName.slice(4);
	}

	// for (let i = 0; i < boxes.length; i++) {
	// 	let box = boxes[i];
	// 	board[box.row][box.col] = "$";
	// }

	if (inGame) {
		if (board[player.row][player.col] == "+") {
			board[player.row][player.col] = ".";
		} else {
			board[player.row][player.col] = " ";
		}
		if (direction == "up") {
			moveOnBoard(player.row - 1, player.col);
		} else if (direction == "down") {
			moveOnBoard(player.row + 1, player.col);
		} else if (direction == "left") {
			moveOnBoard(player.row, player.col - 1);
		} else if (direction == "right") {
			moveOnBoard(player.row, player.col + 1);
		}
		moves.push(displayBoard());
	}

	player.move(direction, 0.85);

	if (inGame) {
		player.steps++;
		displaySteps();
	}

	// the name of the current animation being used
	let cur = player.getAnimationLabel();

	// player is already walking that way or turning
	// no need to change animation
	if (cur == aniName || cur == "idle-turn") return;

	// have the player turn before walking upwards
	if (direction != "up") {
		player.depth = 1;
		player.ani(aniName);
	} else {
		player.depth = 2;
		await player.ani("idle-turn");
		player.ani("walk-up");
	}

	if (direction == "left") {
		player.mirrorX(-1); // flip the character left
	} else {
		player.mirrorX(1);
	}

	if (inGame && checkWin()) {
		didWin = true;
		player.ani("dance");
		await alert("You win!!", 10, 27, 12);
		didWin = false;
		levelNum++;
		displayLevel();
		resetBoard();
		loadLevel(levelSet.levels[levelNum]);
	}
};

player.idle = function () {
	// switch between idle animations
	// some have a higher probability of occurring than others
	async function _idle() {
		let chance = Math.random();

		if (chance > 0.4) {
			await player.ani("idle-stand");
		} else if (chance > 0.2) {
			await player.ani("idle-blink");
		} else if (chance > 0.1) {
			await player.ani("idle-think");
		} else if (chance > 0.05) {
			await player.ani("idle-scratch");
		} else {
			await player.ani("idle-yawn");
		}
		_idle();
	}

	// the name of the current animation being used
	let cur = this.getAnimationLabel();

	if (cur == "walk-up" || cur == "push-up") {
		this.ani("idle-turn");
		this.animation.changeFrame(2);
		this.animation.goToFrame(0);
		this.animation.onComplete = () => {
			this.ani("idle-stand");
			this.animation.onComplete = _idle;
		};
	} else if (!cur.includes("idle")) {
		this.ani("idle-stand");
		this.animation.onComplete = _idle;
	}
};

function checkWin() {
	for (let i = 0; i < board.length; i++) {
		for (let j = 0; j < board[i].length; j++) {
			if (board[i][j] == "." || board[i][j] == "+") {
				return false;
			}
		}
	}
	return true;
}

loading = false;

function draw() {
	if (loading) return;
	clear();
	background("#19142b");

	player.collide(walls); // handles player collisions with walls
	player.displace(boxes);
	boxes.snap(player);
	boxes.collide(walls);
	boxes.collide(boxes);

	if (!player.isMoving && !didWin) player.idle();

	// // snap boxes to nearest tile (row, col)
	// // when player stops moving
	// world.update({ snap: !player.isMoving });
	// p5.play function for drawing all sprites
	drawSprites();
}
