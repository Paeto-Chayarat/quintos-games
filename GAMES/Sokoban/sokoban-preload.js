let player = createSprite(314, 80, 32, 32);
player.scale = 0.5;
player.autoResetAnimations = true;
let imgDir = QuintOS.dir + "/img/8bit";
let playerImg = imgDir + "/player16.png";

// loadAni(sprite, spritesheet, name, width, height, frameCount, line, frameDelay)
loadAni(player, playerImg, "idle-stand", 64, 64, 4, 0, 20);
loadAni(player, playerImg, "idle-blink", 64, 64, 4, 1, 10);
loadAni(player, playerImg, "idle-think", 64, 64, 8, 20, 20);
loadAni(player, playerImg, "idle-scratch", 64, 64, 14, 21, 10);
loadAni(player, playerImg, "idle-yawn", 64, 64, 2, 22, 60);
loadAni(player, playerImg, "idle-turn", 64, 64, 3, 17);
loadAni(player, playerImg, "walk-lr", 64, 64, 5, 3, 5);
loadAni(player, playerImg, "walk-up", 64, 64, 6, 18);
loadAni(player, playerImg, "walk-down", 64, 64, 6, 16);

let tiles = imgDir + "/world.png";

function loadAni2(spriteSheetImg, size, pos, frameCount, frameDelay) {
	// pos is a line number or tile coordinate pair
	let frames = [];

	let width, height;
	if (typeof size == "number") {
		width = size;
		height = size;
	} else {
		width = size[0];
		height = size[1];
	}

	// add all the frames in the animation to the frames array
	for (let i = 0; i < frameCount; i++) {
		let x, y;
		// if pos is a number, that means it's just a line number
		// and the animation's first frame is at x = 0
		// the line number is the location of the animation line
		// given as a distance in tiles from the top of the image
		if (typeof pos == "number") {
			x = width * i;
			y = height * pos;
		} else {
			// pos is the location of the animation line
			// given as a coordinate pair of distances in tiles
			// from the top left corner of the image
			x = width * (i + pos[0]);
			y = height * pos[1];
		}

		frames.push({
			frame: { x: x, y: y, width: width, height: height },
		});
	}
	let ani = loadAnimation(new SpriteSheet(spriteSheetImg, frames));
	if (typeof frameDelay != "undefined") {
		ani.frameDelay = frameDelay;
	}
	return ani;
}

let tileSize = 32;

let wallUp = loadAni2(tiles, tileSize, [1, 0]);
let wallLeft = loadAni2(tiles, tileSize, [0, 1]);
let wallRight = loadAni2(tiles, tileSize, [2, 1]);
let wallDown = loadAni2(tiles, tileSize, [1, 2]);
