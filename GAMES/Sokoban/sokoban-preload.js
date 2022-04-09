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

{
	let i = 0;
	for (let row = 17; row < 20; row++) {
		for (let col = 13; col < 16; col++) {
			walls.loadAni("furniture-" + i, { pos: [row, col] });
			i++;
		}
	}
}
walls.loadAni("furniture-6", { pos: [16, 13] });
walls.loadAni("furniture-7", { pos: [19, 15] });
walls.loadAni("furniture-8", { pos: [20, 13] });
walls.loadAni("furniture-9", { pos: [20, 14] });

let creatures = world.createGroup("creatures");
for (let i = 0; i < 16; i++) {
	creatures.loadAni("creature-" + i, { pos: [10, i] });
}
for (let i = 0; i < 8; i++) {
	creatures.loadAni("creature-" + (i + 16), { pos: [22, i] });
}

let floor = world.createGroup("floor");
for (let i = 0; i < 16; i++) {
	floor.loadAni("floor-" + i, { pos: [20 + Math.floor(i / 8), i % 8] });
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
let player = world.createSprite(5, 5, 2);
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
