// image assets location
let imgDir = QuintOS.dir + "/img/bitBoi";

/* WORLD */

//    new Tiles(rows, cols, layers, tileSize, x, y)
let world = new Tiles(40, 12, 2, 16, 60, 55);
world.spriteSheet = loadImage(imgDir + "/world16.png");

world.addGroup("walls");
world.walls.loadAni("wall-up", { pos: [0, 1] });
world.walls.loadAni("wall-down", { pos: [2, 1] });
world.walls.loadAni("wall-left", { pos: [1, 0] });
world.walls.loadAni("wall-right", { pos: [1, 2] });
world.walls.loadAni("wall-topleft", { pos: [0, 0] });
world.walls.loadAni("wall-topright", { pos: [0, 2] });
world.walls.loadAni("wall-bottomleft", { pos: [2, 0] });
world.walls.loadAni("wall-bottomright", { pos: [2, 2] });

world.addGroup("boxes");
// loads the animation for the tile representing the box
// at row 5, column 0 in the tile sheet
world.boxes.loadAni("box", { pos: [5, 0] });

/* PART A: Choose a tile to represent the box goal positions on the floor */
world.addGroup("goals");
world.goals.loadAni("goal", { pos: [15, 1] });

/* PLAYER */

//               tile(row, col, layer)
let player = world.tile(0, 0, 1);
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

let levelSet;

async function getJson() {
	let req = await fetch(QuintOS.dir + "/levels.json");
	levelSet = await req.json();
}

getJson();
