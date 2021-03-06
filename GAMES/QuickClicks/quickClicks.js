const log = console.log;

const target =
	" .d88b. \n" +
	".8P  Y8.\n" +
	"88    88\n" +
	"88    88\n" +
	"'8b  d8'\n" +
	" 'Y88P' ";

let btn;
let times = [];

/* PART B calculate player's response time */
async function calcAvg() {
	let speeds = [];
	for (let i = 0; i < times.length - 1; i++) {
		speeds.push(times[i + 1] - times[i]);
	}
	log(speeds);

	// add difference between times in milliseconds to sum
	let sum = 0;
	for (let i = 0; i < speeds.length; i++) {
		sum += speeds[i];
	}
	let avg = Math.ceil(sum / speeds.length);

	let fastest = speeds[0];
	let slowest = speeds[0];
	for (let i = 0; i < speeds.length; i++) {
		if (fastest > speeds[i]) {
			fastest = speeds[i];
		}
		if (slowest < speeds[i]) {
			slowest = speeds[i];
		}
	}

	let msg = "Your average response time was " + avg + "ms\n";
	msg += "Your fastest response time was " + fastest + "ms\n";
	msg += "Your slowest response time was " + slowest + "ms";
	await pc.alert(msg);
}

/* PART B make a background pattern */
function makeBg() {
	let patternA = "\\⎽⎽/⎺⎺"; //odd
	let patternB = "/⎺⎺\\⎽⎽"; //even
	for (let j = 0; j < 28; j++) {
		let pattern = patternA;
		if (j % 2 == 0) {
			pattern = patternB;
		}
		for (let i = 0; i < 13; i++) {
			pc.text(pattern, i * 6 + 1, j + 1);
		}
	}
}

/* PART A: change the values of x and y to be random */
// screen size is 80w x 30h
// target is 8w x 6h
// drawing starts from top left corner
// we want to draw the target within the bounds of the frame
// 80 screen width - 8 target width - 1 frame line = 71
// 30 screen height - 6 target height - 1 frame line = 23
function btnClick() {
	if (btn) {
		times.push(Date.now());
		btn.erase();
	}
	makeBg();
	if (times.length <= 5) {
		let x = Math.random() * 71;
		x = Math.ceil(x);

		let y = Math.random() * 23;
		y = Math.ceil(y);
		/* PART A: Use recursion to make a new button after clicking a button */
		btn = pc.button(target, x, y, btnClick);
	} else {
		calcAvg();
	}
}

async function startGame() {
	await pc.alert("Click the buttons as fast as you can!");
	btnClick();
}

startGame();
