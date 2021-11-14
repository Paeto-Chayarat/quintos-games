// bitmap lcd is 28w x 20h
const log = console.log;
let score = 0;

pc.text("SNAKE", 0, 0);
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

class Iterator {
	constructor(list) {
		this.list = list;
		this.cur = null;
	}

	hasNext() {
		// in the beginning it should be true
		// otherwise it is true until cur.next is null
		return !this.cur || this.cur.next;
	}

	next() {
		// in the beginning return the head
		if (!this.cur) {
			this.cur = this.list.head;
			return this.cur;
		}
		// set cur to cur.next
		this.cur = this.cur.next;
		return this.cur;
	}

	hasPrev() {
		return !this.cur || this.cur.prev;
	}

	prev() {
		if (!this.cur) {
			this.cur = this.list.tail;
			return this.cur;
		}
		this.cur = this.cur.prev;
		return this.cur;
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
let frameTrack = -1;
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
	let s = snake.head;
	// check if the snake will die
	if (
		(s.y == 0 && s.direction == "up") ||
		(s.y == 19 && s.direction == "down") ||
		(s.x == 0 && s.direction == "left") ||
		(s.x == 27 && s.direction == "right")
	) {
		isSnakeDead = true;
	}

	let itr = new Iterator(snake);
	while (itr.hasPrev()) {
		s = itr.prev();
		// set lcd segment to null where the tail used to be
		if (s == snake.tail) {
			pc.lcd(null, s.x, s.y);
		}
		if (s == snake.head) continue; // skip the head

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

	s = snake.head;
	// spawn new body part after snake head eats food pellet
	if (s.x == food.x && s.y == food.y) {
		spawnFood();

		let node = {
			block: "snake body",
			x: snake.head.x,
			y: snake.head.y,
			direction: snake.head.direction,
			prev: snake.head,
			next: snake.head.next,
		};
		snake.head.next.prev = node;
		snake.head.next = node;
	}
	// change head position
	if (!isSnakeDead) {
		if (s.direction == "up") s.y--;
		if (s.direction == "down") s.y++;
		if (s.direction == "left") s.x--;
		if (s.direction == "right") s.x++;
	}
	if (!isSnakeDead || frameCount % 3 == 0) {
		pc.lcd(s.block, s.x, s.y, s.direction);
	} else {
		pc.lcd(null, s.x, s.y);
	}

	{
		let itr = new Iterator(snake);
		while (itr.hasPrev()) {
			let sb = itr.prev();
			if (sb == snake.head) continue;

			if (s.x == sb.x && s.y == sb.y) {
				isSnakeDead = true;
			}
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
		frameTrack = frameCount;
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
	let itr = new Iterator(snake);
	while (itr.hasPrev()) {
		s = itr.prev();
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
