// screen width is 320, height is 200
const log = console.log;

let imgBall = spriteArt(`
..bbby..
.wbbbyb.
wbbbyybw
byyyybbb
yybbybbb
wbbbyybb
.bbbbyb.
..wbby..`);

let imgPaddle = spriteArt('.wwwwww.\nwwwwwwww\n' +
	'ww....ww\n'.repeat(50) + 'wwwwwwww\n.wwwwww.');

let imgWall = spriteArt(('w'.repeat(320) + '\n').repeat(3));

let imgBg = createGraphics(320, 200);
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

let imgLogo = spriteArt(`
  wwwwwwwwwwwwwwwwwwwww
 wwwwwwwwwwwwwwwwwwwwwwwww
wwwwwwwwwwwwwwwwwwwwwwwwwwwww
wwwwwwwww          wwwwwwwwww
wwwwwww              wwwwwwwww
wwwwwww              wwwwwwwww
wwwwwww              wwwwwwwww
wwwwwww              wwwwwwwww
wwwwwww              wwwwwwwww
wwwwwwwww           wwwwwwwwww
wwwwwwwwwwwwwwwwwwwwwwwwwwwww
wwwwwwwwwwwwwwwwwwwwwwwwwwww
wwwwwwwwwwwwwwwwwwwwwwwww\n` +
	'wwwwwww\n'.repeat(8) + ' wwwwww');


class Wall {
	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.w = 320;
		this.h = 3;
	}

	draw() {
		image(imgWall, this.x, this.y);
	}
}
class Ball {

	constructor(x, y, r) {
		this.x = x;
		this.y = y;
		this.r = r;
		this.w = r * 2;
		this.h = r * 2;
		this.vel = {
			x: 1,
			y: 1
		};
		this.changeDirection();
	}

	draw() {
		/* PART A2: make the ball move */
		this.x += this.vel.x;
		this.y += this.vel.y;
		image(imgBall, this.x, this.y);
	}

	changeDirection() {
		this.vel.x = Math.random() * .5 + .75;
		this.vel.y = Math.random() * .5 + .75;
		if (Math.random() < 0.5) {
			this.vel.x *= -1;
		}
		if (Math.random() < 0.5) {
			this.vel.y *= -1;
		}
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
		image(imgPaddle, this.x, this.y);
	}
}

/* PART A0: create a ball and two paddles on each end of the screen */
// use the Ball and Paddle classes
let ball = new Ball(160, 100, 4);
let paddle0 = new Paddle(3, 100, 8, 54);
let paddle1 = new Paddle(310, 100, 8, 54);
let wall0 = new Wall(0, 0);
let wall1 = new Wall(0, 197);


function intersects(a, b) {
	if (a.x > b.x + b.w || a.x + a.w < b.x ||
		a.y + a.h < b.y || a.y > b.y + b.h) {
		return false; //this if statement has ti be all false to return true
		//if one condition is true
	}
	log(a, b);
	return true;
}

/* PART A1: create the p5 draw function, draw the ball and paddles */
function draw() {
	image(imgBg, 0, 0);
	image(imgLogo, 147, 90);
	if (intersects(ball, paddle0) || intersects(ball, paddle1)) {
		ball.vel.x *= -1;
	}
	if (intersects(ball, wall0) || intersects(ball, wall1)) {
		ball.vel.y *= -1;
	}

	if (ball.x < -9 || ball.x > 320) {
		ball.x = 160;
		ball.y = 100;
		ball.changeDirection();
	}


	ball.draw();
	paddle0.draw();
	paddle1.draw();
	wall0.draw();
	wall1.draw();
}
