const log = console.log;

// space and period are transparent
let palette = {
	k: '#000000', // blacK
	d: '#626252', // Dark-gray
	m: '#898989', // Mid-gray
	l: '#adadad', // Light-gray
	w: '#ffffff', // White
	c: '#cb7e75', // Coral
	r: '#9f4e44', // Red
	n: '#6d5412', // browN
	o: '#a1683c', // Orange
	y: '#c9d487', // Yellow
	e: '#9ae29b', // light grEEn
	g: '#5cab5e', // Green
	t: '#6abfc6', // Teal
	b: '#50459b', // Blue
	i: '#887ecb', // Indigo
	p: '#a057a3' // Purple
};

// an array of color letters
let colors = Object.keys(palette);

let paletteBoxes = spriteArt(colors, 25);

let brush = `
k
kkk
kkkk
kkkk
.kkww
...wnn
.....nn
......nn
.......nn
........nn
.........nn`;

let brushImg = spriteArt(brush);
let brushColor = 'k'; // black

let width = 20;
let height = 10;
let scale = 16;
let pixels = [];
let choosingBg = true;

class Pixel {
	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.color = 'd';
	}

	draw() {
		fill(palette[this.color]);
		stroke(0);
		rect(this.x, this.y, scale, scale);
	}
}

async function pickSize() {
	// let size = await pc.prompt("Canvas size (ex. 10x10): ", 5, 5, 35);
	// size = size.split('x');
	// width = size[0];
	// height = size[1];

	for (let i = 0; i < width; i++) {
		pixels.push([]);
		for (let j = 0; j < height; j++) {
			pixels[i].push(new Pixel(30 + i * scale, 5 + j * scale));
		}
	}

	pc.text("pick background color", 5, 5);

}

pickSize();

function draw() {
	background(50);
	if (!pixels.length) return;

	image(paletteBoxes, 0, 0);
	if (!choosingBg) {
		for (let i = 0; i < width; i++) {
			for (let j = 0; j < height; j++) {
				pixels[i][j].draw();
			}
		}
	}
	image(brushImg, mouseX, mouseY);
	if (mouseIsPressed) {
		drawOnPixels();
	}
}

function changeBackgroundColor(c) {
	for (let i = 0; i < width; i++) {
		for (let j = 0; j < height; j++) {
			pixels[i][j].color = c;
		}
	}
}

async function changeBrushColor(c) {
	if (choosingBg) {
		changeBackgroundColor(c);
		await pc.erase();
		let reBtn = pc.button("Save Image", 30, 24, () => {
			saveImage();
		});
		choosingBg = false;
	}
	let _brush = brush.replaceAll('k', c);
	brushImg = spriteArt(_brush);
	brushColor = c;
}

function saveImage() {
	let colorBoard = '';
	for (let i = 0; i < height; i++) {
		for (let j = 0; j < width; j++) {
			colorBoard += pixels[j][i].color;
		}
		colorBoard += "\n";
	}
	log(colorBoard);
	save(spriteArt(colorBoard));
}

function drawOnPixels() {
	// If the click is in the pallette area, change the brush color
	// according to the x,y.
	if (mouseX > 0 && mouseX < 25) {
		let y = 0;
		for (let c of colors) {
			if (mouseY > y && mouseY < y + 25) {
				changeBrushColor(c);
			}
			y += 25;
		}
		return;
	}

	// if clicked, change the pixel's color.
	for (let i = 0; i < width; i++) {
		for (let j = 0; j < height; j++) {
			let p = pixels[i][j];

			if (mouseX > p.x && mouseX < p.x + scale &&
				mouseY > p.y && mouseY < p.y + scale) {
				p.color = brushColor;
			}
		}
	}
}

function mouseWheel(event) {
	log(event.delta);
	//move the square according to the vertical scroll amount
	scale += event.delta / 30;
	let brushX = null;
	let brushY = null;
	for (let i = 0; i < width; i++) {
		for (let j = 0; j < height; j++) {
			let p = pixels[i][j];

			if (mouseX > p.x && mouseX < p.x + scale &&
				mouseY > p.y && mouseY < p.y + scale) {
				brushX = i;
				brushY = j;
			}
		}
	}
	if (brushX == null && brushY == null) {
		let minDistX = 1000000;
		let minDistY = 1000000;

		for (let i = 0; i < width; i++) {
			for (let j = 0; j < height; j++) {
				let p = pixels[i][j];

				let distX = Math.abs(p.x - mouseX);
				let distY = Math.abs(p.y - mouseY);

				if (distX < minDistX) {
					minDistX = distX;
					brushX = i;
				}
				if (distY < minDistY) {
					minDistY = distY;
					brushY = j;
				}
			}
		}
	}

	log(brushX, brushY);
	for (let i = 0; i < width; i++) {
		for (let j = 0; j < height; j++) {
			if (i == brushX && j == brushY) {
				log("before : ", pixels[i][j].x, pixels[i][j].y);
			}
			pixels[i][j].x = mouseX - (brushX + .5) * scale + i * scale;
			pixels[i][j].y = mouseY - (brushY + .5) * scale + j * scale;
			if (i == brushX && j == brushY) {
				log("after : ", pixels[i][j].x, pixels[i][j].y);
			}
		}
	}
	//uncomment to block page scrolling
	return false;
}
