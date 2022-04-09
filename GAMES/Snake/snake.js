// CLASSIC MODE: VERSION 2.0
// bitmap lcd is 28w x 20h
const log = console.log;
let score = 0;

pc.text("SNAKE-SWAP", 0, 0);
pc.text(score, 0, 1);

class LinkedList {
	constructor() {
		this.size = 0;
		this.head = null;
		this.tail = null;
	}

	push(elem) {
		// adding the first node
		if (!this.head) {
			this.head = elem;
			this.head.prev = null;
			this.head.next = null;

			this.tail = elem;
			this.tail.prev = null;
			this.tail.next = null;
			return;
		}
		// when adding the second node
		if (!this.head.next) {
			this.head.next = elem;
			this.tail.prev = this.head;
		}
		// for adding any besides first node
		this.tail.next = elem;
		elem.prev = this.tail;
		this.tail = elem;
		elem.next = null;
		this.head.prev = null;
	}
}

let snake = new LinkedList();

// add the original three nodes to the snake
snake.push({
	block: "snake head",
	direction: "right",
	x: 15,
	y: 10,
});

for (let i = 0; i < 10; i++) {
	snake.push({
		block: "snake body",
		direction: "right",
		x: 14 - i,
		y: 10,
	});
}

snake.push({
	block: "snake tail",
	direction: "right",
	x: 3,
	y: 10,
});

let food = {
	block: "food",
	x: 0,
	y: 0,
};
let inputDirection = "right";
let isSnakeDead = false;
let friction = 10; // decrease to increase snake speed
// increase speed gradually
async function increaseSpeed() {
	while (!isSnakeDead && friction > 3) {
		await delay(10000);
		if (friction < 6) await delay(15000);
		if (friction == 4) await delay(60000);
		friction -= 1;
		console.log("snake friction: " + friction);
	}
}
increaseSpeed();

function draw() {
	// frameCount is a p5.js variable that stores how many frames
	// have been drawn, slow down the motion of the snake to 6fps
	if (frameCount % friction != 0) return;

	// the last input the player gives changes the head's direction
	if (!isSnakeDead) snake.head.direction = inputDirection;

	// after this if statement is the draw frame
	// friction has to be the same or int for the frame to run constantly
	let head = snake.head;
	// check if the snake will die
	if (
		(head.y == 0 && head.direction == "up") ||
		(head.y == 19 && head.direction == "down") ||
		(head.x == 0 && head.direction == "left") ||
		(head.x == 27 && head.direction == "right")
	) {
		isSnakeDead = true;
	}

	for (let s = snake.tail; s != snake.head; s = s.prev) {
		// set lcd segment to null where the tail used to be
		if (s == snake.tail) {
			pc.lcd(null, s.x, s.y);
		}

		// prevent the rest of the snake from moving when it dies
		if (!isSnakeDead) {
			s.x = s.prev.x;
			s.y = s.prev.y;
			s.direction = s.prev.direction;
		}

		// if the snake dead, show the block every three frames, null otherwise
		if (!isSnakeDead || frameCount % 3 == 0) {
			pc.lcd(s.block, s.x, s.y, s.direction);
		} else {
			pc.lcd(null, s.x, s.y);
		}
	}

	// spawn new body part after snake head eats food pellet
	if (head.x == food.x && head.y == food.y) {
		spawnFood();

		let node = {
			block: "snake body",
			x: head.x,
			y: head.y,
			direction: head.direction,
			prev: head,
			next: head.next,
		};
		head.next.prev = node;
		head.next = node;
	}
	// change head position
	if (!isSnakeDead) {
		if (head.direction == "up") head.y--;
		if (head.direction == "down") head.y++;
		if (head.direction == "left") head.x--;
		if (head.direction == "right") head.x++;
	}
	if (!isSnakeDead || frameCount % 3 == 0) {
		pc.lcd(head.block, head.x, head.y, head.direction);
	} else {
		pc.lcd(null, head.x, head.y);
	}

	for (let s = snake.tail; s != snake.head; s = s.prev) {
		if (head.x == s.x && head.y == s.y) {
			isSnakeDead = true;
		}
	}
}

function keyPressed() {
	// only accept the first/last direction input on each frame
	if (!isSnakeDead) {
		if (keyCode == UP_ARROW && snake.head.direction != "down") {
			inputDirection = "up";
		} else if (keyCode == DOWN_ARROW && snake.head.direction != "up") {
			inputDirection = "down";
		} else if (keyCode == LEFT_ARROW && snake.head.direction != "right") {
			inputDirection = "left";
		} else if (keyCode == RIGHT_ARROW && snake.head.direction != "left") {
			inputDirection = "right";
		}
	}
	return false;
}

// function filter(arr, condition) {
// 	// what filter does
// 	let res = [];
// 	for (let i = 0; i < arr.length; i++) {
// 		if (condition) {
// 			res.push(arr[i]);
// 		}
// 	}
// 	return res;
// }

let avail;

function spawnFood() {
	// add all coordinates to avail coordinates array
	avail = [];
	for (let i = 0; i < 28; i++) {
		for (let j = 0; j < 20; j++) {
			avail.push([i, j]);
		}
	}

	// remove coordinates with snake blocks in them
	for (let s = snake.tail; s.prev != null; s = s.prev) {
		avail = avail.filter((pos) => !(pos[0] == s.x && pos[1] == s.y));
	}

	let coord = avail[Math.floor(Math.random() * avail.length)];
	food.x = coord[0];
	food.y = coord[1];
	pc.lcd(food.block, food.x, food.y);

	score++;
	pc.text(score, 0, 1);
}

spawnFood();
