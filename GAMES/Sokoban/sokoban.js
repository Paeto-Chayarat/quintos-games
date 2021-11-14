let loading = true;

let board = [];
let levelNum = 2;

player.steps = 0;

function loadLevel(level) {
	level = level.split("\n");
	for (let row = 0; row < level.length; row++) {
		board.push(level[row].split(""));
	}

	for (let row = 0; row < board.length; row++) {
		for (let col = 0; col < board[row].length; col++) {
			let t = board[row][col];
			if (t == "#") {
				world.walls.tile(row, col, "wall-up");
			}
			if (t == "$" || t == "*") {
				world.boxes.tile(row, col, 1, "box");
			}
			if (t == "." || t == "*" || t == "+") {
				world.goals.tile(row, col, "goal");
			}
			if (t == "@" || t == "+") {
				player.row = row;
				player.col = col;
				player.destRow = row;
				player.destCol = col;
				player.x = world.x + col * world.tileSize;
				player.y = world.y + row * world.tileSize;
			}
		}
	}
}

loadLevel(levelSet.levels[levelNum]);

function displayLevel() {
	text("level " + levelNum, 3, 20);
}
displayLevel();

button("Reset", 0, 22, resetBoard);

function resetBoard() {
	world.walls.removeSprites();
	world.boxes.removeSprites();
	world.goals.removeSprites();
	board = [];
	loadLevel(levelSet.levels[levelNum]);
}

function keyPressed() {
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
}

function moveOnBoard(row, col) {
	board[row][col] = "@";

	// if the player is on any goal tile, make it a + sign
	// to indicate that
	for (let i = 0; i < world.goals.length; i++) {
		let goal = world.goals[i];
		if (goal.row == row && goal.col == col) {
			board[row][col] = "+";
		}
	}
}

function moveBox(r1, c1, r2, c2) {
	if (board[r1][c1] != "$" && board[r1][c1] != "*") {
		return true;
	} else if (
		board[r2][c2] != "#" &&
		board[r2][c2] != "$" &&
		board[r2][c2] != "*"
	) {
		board[r2][c2] = "$";
		for (let i = 0; i < world.goals.length; i++) {
			let goal = world.goals[i];
			if (goal.row == r2 && goal.col == c2) {
				board[r2][c2] = "*";
			}
		}
		return true;
	}
	return false;
}

function displaySteps() {
	text("steps " + player.steps, 3, 5);
}
displaySteps();

player.walk = async function (direction) {
	let r = player.row;
	let c = player.col;
	// prevent player from moving if they try to move into a wall
	if (direction == "up") {
		if (board[r - 1][c] == "#" || !moveBox(r - 1, c, r - 2, c)) {
			return;
		}
	} else if (direction == "down") {
		if (board[r + 1][c] == "#" || !moveBox(r + 1, c, r + 2, c)) {
			return;
		}
	} else if (direction == "left") {
		if (board[r][c - 1] == "#" || !moveBox(r, c - 1, r, c - 2)) {
			return;
		}
	} else if (direction == "right") {
		if (board[r][c + 1] == "#" || !moveBox(r, c + 1, r, c + 2)) {
			return;
		}
	}

	// for (let i = 0; i < world.boxes.length; i++) {
	// 	let box = world.boxes[i];
	// 	board[box.row][box.col] = "$";
	// }

	let aniName = "walk-" + direction;
	if (direction == "left" || direction == "right") {
		aniName = "walk-lr";
	}

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
	displayBoard();

	world.move(player, 0.85, direction);

	player.steps++;
	displaySteps();

	// the name of the current animation being used
	let cur = this.getAnimationLabel();

	// player is already walking that way or turning
	// no need to change animation
	if (cur == aniName || cur == "idle-turn") return;

	// have the player turn before walking upwards
	if (direction != "up") {
		this.ani(aniName);
	} else {
		await this.ani("idle-turn");
		this.ani("walk-up");
	}

	if (direction == "left") {
		this.mirrorX(-1); // flip the character left
	} else {
		this.mirrorX(1);
	}

	if (checkWin()) {
		await alert("You win!!");
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

	if (cur == "walk-up") {
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
	background(0);

	player.collide(world.walls); // handles player collisions with walls
	player.displace(world.boxes);
	world.boxes.collide(world.walls);
	world.boxes.collide(world.boxes);

	if (!player.isMoving) player.idle();

	// snap boxes to nearest tile (row, col)
	// when player stops moving
	world.update({ snap: !player.isMoving });
	// p5.play function for drawing all sprites
	drawSprites();
}
