// image assets location
let imgDir = QuintOS.dir + "/img/bitBoi";

/* WORLD */

//      createTiles(tileSize, x, y)
let world = createTiles(16, 90, 40);
world.spriteSheet = loadImage(imgDir + "/world16.png");

let walls = world.createGroup("walls");
walls.loadAni("wall-up", { pos: [0, 1] });
walls.loadAni("wall-down", { pos: [2, 1] });
walls.loadAni("wall-left", { pos: [1, 0] });
walls.loadAni("wall-right", { pos: [1, 2] });
walls.loadAni("wall-topleft", { pos: [0, 0] });
walls.loadAni("wall-topright", { pos: [0, 2] });
walls.loadAni("wall-bottomleft", { pos: [2, 0] });
walls.loadAni("wall-bottomright", { pos: [2, 2] });

walls.loadAni("fire", { pos: [19, 2], frames: 2, delay: 10 });

for (let i = 0; i < 16; i++) {
	walls.loadAni("creature-" + i, { pos: [10, i] });
}
walls.loadAni("creature-16", { pos: [22, 4] });
walls.loadAni("creature-17", { pos: [22, 5] });
walls.loadAni("creature-18", { pos: [22, 6] });
walls.loadAni("creature-19", { pos: [22, 7] });
walls.loadAni("creature-20", { pos: [22, 0], frames: 4, delay: 20 });

{
	let i = 0;
	for (let row = 16; row < 21; row++) {
		for (let col = 13; col < 16; col++) {
			walls.loadAni("furniture-" + i, { pos: [row, col] });
			i++;
		}
	}
}

let boxes = world.createGroup("boxes");
// loads the animation for the tile representing the box
// at row 5, column 0 in the tile sheet
boxes.loadAni("box", { pos: [5, 0] });

/* PART A: Choose a tile to represent the box goal positions on the floor */
let goals = world.createGroup("goals");
goals.loadAni("goal", { pos: [15, 1] });

/* PLAYER */

//                 createSprite(row, col, layer)
let player = world.createSprite(5, 5, 1);
player.spriteSheet = loadImage(imgDir + "/bitBoi16.png");

player.loadAni("idle-stand", { line: 0, frames: 4, delay: 20 });
player.loadAni("idle-blink", { line: 1, frames: 4, delay: 10 });
player.loadAni("idle-think", { line: 20, frames: 8, delay: 20 });
player.loadAni("idle-scratch", { line: 21, frames: 14, delay: 10 });
player.loadAni("idle-yawn", { line: 22, frames: 2, delay: 60 });
player.loadAni("idle-turn", { line: 17, frames: 3 });
player.loadAni("walk-lr", { line: 3, frames: 5, delay: 5 });
player.loadAni("walk-up", { line: 18, frames: 6 });
player.loadAni("walk-down", { line: 16, frames: 6 });
player.loadAni("push-lr", { line: 13, frames: 5 });
player.loadAni("push-up", { line: 15, frames: 6 });
player.loadAni("push-down", { line: 14, frames: 6 });
player.loadAni("dance", { line: 2, frames: 4, delay: 6 });

let levelSet;

(async () => {
	levelSet = await (await fetch(QuintOS.dir + "/levels.json")).json();
})();
