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

let imgPaddleY = spriteArt('.wwwwww.\nwwwwwwww\n' +
	'ww....ww\n'.repeat(50) + 'wwwwwwww\n.wwwwww.');

let imgPaddleX = spriteArt(
	' ' + 'w'.repeat(52) + ' \n' +
	'w'.repeat(54) + '\n' +
	('ww' + ' '.repeat(50) + 'ww\n').repeat(4) +
	'w'.repeat(54) + '\n' +
	' ' + 'w'.repeat(52)
);

// let imgWall = spriteArt(('w'.repeat(320) + '\n').repeat(3));

let imgBg = createGraphics(640, 400);
imgBg.scale(2);
imgBg.background(color16('g'));
imgBg.fill(color16('e'));
imgBg.stroke(color16('w'));
imgBg.strokeWeight(1);
imgBg.rect(20, 30, 280, 140);
imgBg.line(125, 30, 125, 170);
imgBg.line(195, 30, 195, 170);
imgBg.circle(160, 25, 3);
imgBg.circle(160, 175, 3);
imgBg.circle(160, 100, 40);
imgBg.line(160, 25, 160, 175);


let imgLogo = `
..wwwwwwwwwwwwwwwwwwwww
.wwwwwwwwwwwwwwwwwwwwwwwww
wwwwwwwwwwwwwwwwwwwwwwwwwwwww
wwwwwwwww..........wwwwwwwwww
wwwwwww..............wwwwwwwww
wwwwwww..............wwwwwwwww
wwwwwww..............wwwwwwwww
wwwwwww..............wwwwwwwww
wwwwwww..............wwwwwwwww
wwwwwwwww...........wwwwwwwwww
wwwwwwwwwwwwwwwwwwwwwwwwwwwww
wwwwwwwwwwwwwwwwwwwwwwwwwwww
wwwwwwwwwwwwwwwwwwwwwwwww\n` +
	('wwwwwww\n').repeat(8) +
	'.wwwwww';
log(imgLogo);
imgLogo = spriteArt(imgLogo);


class Ball {

	constructor(x, y, r) {
		this.x = x;
		this.y = y;
		this.r = r;
		this.w = r * 2;
		this.h = r * 2;
		this.vel = {
			x: 0,
			y: 0
		};
		this.speed = 1;
		this.active = false;
		this.changeDirection();
	}

	draw() {
		/* PART A2: make the ball move */
		this.x += this.vel.x;
		this.y += this.vel.y;
		image(imgBall, this.x, this.y);
	}

	changeDirection() {
		// (x, y) = (r*cos(ÃŽÂ¸),r*sin(ÃŽÂ¸))
		let angle = [.25, .75, 1.25, 1.75];
		let theta = angle[Math.floor(Math.random() * angle.length)]
		if (Math.random() < .5) {
			theta += Math.random() * .15;
		} else {
			theta -= Math.random() * .15;
		}
		theta *= Math.PI;
		this.vel.x = this.speed * Math.cos(theta);
		this.vel.y = this.speed * Math.sin(theta);
	}

	bounce() {
		// arccos(x/speed) =  theta;
		let theta;

		if (this.vel.x > 0 && this.vel.y > 0) {
			theta = .25;
		} else if (this.vel.x < 0 && this.vel.y > 0) {
			theta = .75;
		} else if (this.vel.x < 0 && this.vel.y < 0) {
			theta = 1.25;
		} else {
			theta = 1.75;
		}
		// log('nearest diagonal: ' + theta);
		// let actual = Math.acos(this.vel.x / this.speed) / Math.PI;
		// log('actual: ' + actual);

		if (Math.random() < .5) {
			theta += Math.random() * .15;
		} else {
			theta -= Math.random() * .15;
		}
		theta *= Math.PI;
		this.vel.x = this.speed * Math.cos(theta);
		this.vel.y = this.speed * Math.sin(theta);
	}
}

class Paddle {
	constructor(x, y, w, h) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
	}

	draw() {
		// mouse y position changes the paddle's y value
		// -this.h/2 is used to center the paddle
		this.y = mouseY - this.h / 2;
		image(imgPaddleY, this.x, this.y);
	}
}

class Paddle0 {
	constructor(x, y, w, h) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
	}

	draw() {
		this.x = mouseX - this.w / 2;
		image(imgPaddleX, this.x, this.y)
	}
}

/* PART A0: create a ball and two paddles on each end of the screen */
// use the Ball and Paddle classes
let numOfBalls = 4;
let servedBalls = 0;
let activeBalls = 0;
let isGameOver = false;
let score = 0;
let balls = [];
for (let i = 0; i < numOfBalls; i++) {
	balls.push(new Ball(-50, -50, 8));
}
let paddle0 = new Paddle(3, 200, 16, 108);
let paddle1 = new Paddle(621, 200, 16, 108);
// let wall0 = new Wall(0, 0);
// let wall1 = new Wall(0, 197);
let paddle2 = new Paddle0(320, 3, 108, 16);
let paddle3 = new Paddle0(320, 381, 108, 16);

async function spawn() {
	for (let i = 0; i < numOfBalls; i++) {
		if (isGameOver) return;
		let ball = balls[i];
		// place balls at (312, 192)
		ball.x = 312;
		ball.y = 192;
		ball.active = true;
		servedBalls++;
		activeBalls++;
		await delay(4000);
	}
}

async function spawnTest() {
	let b0 = balls[0];
	let b1 = balls[1];
	b0.x = 280;
	b0.y = 220;
	b1.x = 320;
	b1.y = 220;
	b0.active = true;
	b1.active = true;
	servedBalls = 2;
	activeBalls = 2;
	b0.vel.x = 1;
	b0.vel.y = 1;
	b1.vel.x = -1;
	b1.vel.y = 1;
}

// spawnTest();
spawn();

function intersectsRect(a, b) {
	// right  zone            left zone
	if (a.x > b.x + b.w || a.x + a.w < b.x ||
		a.y + a.h < b.y || a.y > b.y + b.h) {
		// top                bottom
		return false; //if this is all false the function becomes true
	}
	// log(a, b);
	return true;
}

function intersectsCircle(a, b) {
	// d=√((x_2-x_1)²+(y_2-y_1)²)
	let x1 = a.x + a.r;
	let x2 = b.x + b.r;
	let y1 = a.y + a.r;
	let y2 = b.y + b.r;

	let d = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
	return (d <= a.r + b.r);
}

async function gameOver() {
	background(0);
	await pc.alert('Game Over');
	pc.erase();
	numOfBalls = 4;
	servedBalls = 0;
	activeBalls = 0;
	score = 0;
	for (let i = 0; i < numOfBalls; i++) {
		let ball = balls[i];
		ball.speed = 1;
		ball.active = false;
		ball.x = -50;
		ball.y = -50;
	}
	isGameOver = false;
	spawn();
}



async function increaseSpeed() {
	while (!isGameOver) {
		await delay(1000);
		for (let i = 0; i < numOfBalls; i++) {
			let ball = balls[i];
			ball.speed += 0.01;
		}
	}
}

increaseSpeed();

/* PART A1: create the p5 draw function, draw the ball and paddles */
function draw() {
	if (isGameOver) return;
	image(imgBg, 0, 0);
	image(imgLogo, 294, 180);

	for (let i = 0; i < numOfBalls; i++) {
		if (i > servedBalls) break;
		let ball = balls[i];
		if (!ball.active) continue;

		if (intersectsRect(ball, paddle0) || intersectsRect(ball, paddle1)) {
			ball.vel.x *= -1;
			ball.bounce();
			log(ball.vel.x);
			score += 1;
		}
		if (intersectsRect(ball, paddle2) || intersectsRect(ball, paddle3)) {
			ball.vel.y *= -1;
			ball.bounce();
			log(ball.vel.y);
			score += 1;
		}
		pc.text("Score : " + score, 5, 5);

		// PART B: check for collisions with all other active balls
		for (j = i + 1; j < numOfBalls; j++) {
			if (!balls[j].active) continue;
			let bi = balls[i];
			let bj = balls[j];
			if (intersectsCircle(bi, bj)) {
				log(bi, bj);
				// log('intersected');
				if (!(bi.vel.x < 0 && bj.vel.x < 0) &&
					!(bi.vel.x > 0 && bj.vel.x > 0)) {
					log('invert x');
					bi.vel.x *= -1;
					bj.vel.x *= -1;
				}
				if (!(bi.vel.y < 0 && bj.vel.y < 0) &&
					!(bi.vel.y > 0 && bj.vel.y > 0)) {
					log('invert y');
					bi.vel.y *= -1;
					bj.vel.y *= -1;
				}
			}
		}
		//reset ball
		if (ball.x < -9 || ball.x > 640 || ball.y < -9 || ball.y > 400) {
			activeBalls--;
			ball.active = false;
			// ball.x = 320;
			// ball.y = 200;
			// ball.changeDirection();
		}
		ball.draw();
	}


	paddle0.draw();
	paddle1.draw();
	paddle2.draw();
	paddle3.draw();

	if (servedBalls >= 2 && activeBalls < 2 && !isGameOver) {
		isGameOver = true;
		gameOver();
	}
}
