// screen width is 640, height is 400
const log = console.log;

let imgBall = spriteArt(`
..bbby
.wbbbyb
wbbbyybw
byyyybbb
yybbybbb
wbbbyybb
.bbbbyb
..wbby`);

let imgPlatform = spriteArt(
	" " +
		"w".repeat(52) +
		" \n" +
		"w".repeat(54) +
		"\n" +
		("ww" + " ".repeat(50) + "ww\n").repeat(4) +
		"w".repeat(54) +
		"\n" +
		" " +
		"w".repeat(52)
);

class Ball {
	constructor(x, y, r) {
		this.x = x;
		this.y = y;
		this.r = r;
		this.w = r * 2;
		this.h = r * 2;
		this.vel = {
			x: 0,
			y: 0,
		};
		this.speed = 1;
	}

	draw() {
		this.vel.y += 0.25;
		/* PART A2: make the ball move */
		this.x += (mouseX - this.x) * 0.02;
		// this.x += this.vel.x;
		this.y += this.vel.y;
		image(imgBall, this.x, this.y);
	}
}

class Platform {
	constructor(x, y, w, h) {
		this.x = x || 0;
		this.y = y || 0;
		this.w = w || 108;
		this.h = h || 16;
		this.vel = {
			x: 0,
			y: 0,
		};
		this.speed = 0;
	}

	spawn() {
		//platfromX range btw 54-686
		this.x = 54 + Math.random() * 532;
		this.y = prevPlatY - (dist + Math.random() * 25);
		prevPlatY = this.y;
	}

	draw() {
		this.y += this.vel.y;
		image(imgPlatform, this.x, this.y);
	}
}

let ball = new Ball(350, 150, 8);

function intersectsRect(a, b) {
	// right  zone            left zone
	if (
		a.x > b.x + b.w ||
		a.x + a.w < b.x ||
		a.y + a.h < b.y ||
		(a.y > b.y + b.h && goingUp == false)
	) {
		// top                bottom
		return false; //if this is all false the function becomes true
	}
	// log(a, b);
	return true;
}

let levelProgress = 0;
let dist = 40;
let score = 0;
let initialPlatNum = 10;
let plats = [];
let goingUp = false; // goingUp true when ball approaches the top of the screen
let prevPlatY = 350; // position of the last paddle that was positioned
let restarting = false;

function createPlats() {
	for (let i = 0; i < initialPlatNum; i++) {
		let p = new Platform();
		if (i == 0) {
			p.x = 266;
			p.y = prevPlatY;
		} else {
			p.spawn();
		}
		plats.push(p);
		console.log(prevPlatY);
	}
}

createPlats();

function draw() {
	if (ball.y > 400) {
		if (!restarting) restart();
		return;
	}
	pc.text("score", 35, 2);
	pc.text(score, 36, 4);
	background(0);
	// if score exceed 500, increase distance btw plat
	if (score > 500 && levelProgress == 0) {
		dist += 5;
		levelProgress = score;
	}
	// every 1000 increase distance btw plat
	// limit the dist btw plat to 150 (150+25)
	if (score - levelProgress > 1000 && dist < 150) {
		dist += 5;
		levelProgress = score;
	}

	for (let p of plats) {
		// top of the ball is above the top of the platform
		// AND bottom of the ball is below the top of the platform
		// AND the ball must be falling
		// AND the ball and platform are intersecting
		if (
			ball.y < p.y &&
			ball.y + ball.h > p.y &&
			ball.vel.y >= 0 &&
			intersectsRect(ball, p)
		) {
			ball.vel.y = -9.75;
			log(ball.vel.y);
		}
	}

	// when the ball reaches it's height, scroll the screen down
	if (ball.y < 100 && ball.vel.y < 0) {
		goingUp = true;
		reachNext();
	} else {
		goingUp = false;
	}

	ball.draw();

	// if the platform passes the bottom, spawn a new one.
	for (let p of plats) {
		if (p.y < 400 && p.y > 0) {
			p.draw();
		}
		if (p.y > 400) {
			p.spawn();
		}
	}

	//making the ball appear on the other side
	if (ball.x > 640) {
		ball.x = 1;
		ball.vel.x *= -1;
	} else if (ball.x < 0) {
		ball.x = 639;
		ball.vel.x *= -1;
	}
}

function reachNext() {
	// scroll the platforms downwards at the rate of the ball's velocity
	for (let p of plats) {
		p.y += -ball.vel.y;
	}
	prevPlatY += -ball.vel.y;
	score += -ball.vel.y;
	score = Math.floor(score);

	// keep ball in the same place
	ball.y += -ball.vel.y;
}

async function restart() {
	restarting = true;
	await pc.alert("Game over", 10, 10, 10);
	await pc.erase(); // erase whole screen

	// reset all variables
	levelProgress = 0;
	dist = 40;
	score = 0;
	initialPlatNum = 10;
	plats = [];
	goingUp = false;
	prevPlatY = 350;
	ball.x = 350;
	ball.y = 150;
	ball.vel.y = 0;

	createPlats();
	restarting = false;
}
