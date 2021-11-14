// bitmap lcd is 28w x 20h
const log = console.log;
let score = 0;

pc.text('SNAKE', 0, 0);
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
	block: 'snake head',
	direction: 'right',
	x: 5,
	y: 10
});

snake.push({
	block: 'snake body',
	direction: 'right',
	x: 4,
	y: 10
});

snake.push({
	block: 'snake tail',
	direction: 'right',
	x: 3,
	y: 10
});


let food = {
	block: 'food',
	x: 0,
	y: 0
};
let isSnakeDead = false;
let canMove = true;
let friction = 10; // decrease to increase snake speed
// TODO: increase speed gradually

function draw() {
	// frameCount is a p5.js variable that stores how many frames
	// have been drawn, slow down the motion of the snake to 6fps
	if (frameCount % friction != 0) return;
	// after this if statement is the draw frame

	let s = snake.head;
	// check if the snake will die
	if ((s.y == 0 && s.direction == 'up') ||
		(s.y == 19 && s.direction == 'down') ||
		(s.x == 0 && s.direction == 'left') ||
		(s.x == 27 && s.direction == 'right')) {
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

		// TODO: prevent the rest of the snake from moving when it dies
		s.x = s.prev.x;
		s.y = s.prev.y;
		s.direction = s.prev.direction;

		if (!isSnakeDead || frameCount % 3 == 0) {
			pc.lcd(s.block, s.x, s.y, s.direction);
		}
	}

	s = snake.head;
	if (s.x == food.x && s.y == food.y) {
		// let bodyDirection = snake.head.direction;
		// canMove = false;
		spawnFood();

		let node = {
			block: 'snake body',
			x: snake.head.x,
			y: snake.head.y,
			direction: snake.head.direction,
			prev: snake.head,
			next: snake.head.next
		};
		snake.head.next.prev = node;
		snake.head.next = node;


		// canMove = true;
	}
	if (!isSnakeDead && canMove) {
		if (s.direction == 'up') s.y--;
		if (s.direction == 'down') s.y++;
		if (s.direction == 'left') s.x--;
		if (s.direction == 'right') s.x++;
	}
	if (!isSnakeDead || frameCount % 3 == 0) {
		pc.lcd(s.block, s.x, s.y, s.direction);
	}
}

function keyPressed() {
	// TODO: only accept the first/last direction input on each frame
	if (canMove) {
		if (keyCode == UP_ARROW && snake.head.direction != 'down') {
			snake.head.direction = 'up';
		} else if (keyCode == DOWN_ARROW && snake.head.direction != 'up') {
			snake.head.direction = 'down';
		} else if (keyCode == LEFT_ARROW && snake.head.direction != 'right') {
			snake.head.direction = 'left';
		} else if (keyCode == RIGHT_ARROW && snake.head.direction != 'left') {
			snake.head.direction = 'right';
		}
		return false;
	}
}

function spawnFood() {
	let avail = [];
	// TODO: fix this so food can't spawn in the snake
	for (let i = 0; i < 28; i++) {
		for (let j = 0; j < 20; j++) {
			// if (!(snake.x == i && snake.y == j)) {
			avail.push([i, j]);
			// }
		}
	}
	let coord = avail[Math.floor(Math.random() * avail.length)];
	food.x = coord[0];
	food.y = coord[1];
	pc.lcd(food.block, food.x, food.y);
}

spawnFood();
