const log = console.log;

function play(sound) {
	return new Promise((resolve, reject) => {
		sound.play();
		sound.onended(() => {
			resolve();
		});
	});
}

let firstGuess = true;
let gameCount = 0;
let point = 0;
let word;
let words;
let isSpeaking = false;

function pickRandWord() {
	let rand = Math.floor(Math.random() * words.length);
	word = words[rand];
	words.splice(rand, 1);
	log(word);
}

async function sayLetters() {
	for (let i = 0; i < word.length; i++) {
		let c = word[i].toUpperCase();
		await play(letterSounds[c]); //play from sound file
	}
}

//redo this function
async function nextWord() {
	await pc.erase();
	if (gameCount == 5) {
		pc.text("your score is " + point, 0, 0);
		return;
	}
	if (firstGuess) {
		pickRandWord();
	}
	// create the input
	// '*' means any key will trigger the onChange function
	pc.input('', 0, 0, onSubmit, onChange);
	await play(wordSounds[word]);
}

async function onSubmit(value) {
	isSpeaking = true;
	if (value == word) {
		firstGuess = true;
		point += 1;
		gameCount += 1;
		// checkEnd();
		let ins = speechCorrect[Math.floor(Math.random() * speechCorrect.length)];
		await play(speechSounds[ins]);
		await nextWord();
	} else if (value != word && !firstGuess) {
		firstGuess = true;
		gameCount += 1;
		await play(speechSounds["that_is_incorrect_the_correct_spelling_of"]);
		await play(wordSounds[word]);
		await play(speechSounds["is"]);
		await sayLetters();
		await play(speechSounds['now_spell']);
		await nextWord();
	} else {
		firstGuess = false;
		await play(speechSounds['wrong_try_again']);
		await nextWord();
	}
	isSpeaking = false;
}

// value is the text the user entered in the input
async function onChange(value) {
	if (isSpeaking) {
		return;
	}
	// last character entered
	c = value[value.length - 1];
	c = c.toUpperCase();

	// isSpeaking = true;
	await play(letterSounds[c]);
	// isSpeaking = false;
}

async function startGame(value) {
	if (value == 'a' || value == 'A') {
		words = [...shortWords];
	}
	if (value == 'b' || value == 'B') {
		words = [...longWords];
	}
	await play(speechSounds['spell']);
	await nextWord();
}

async function levelSelect() {
	pc.input('', 0, 1, startGame);

	pc.text('pick the size of words', 0, 0);
	await delay(1500);
	pc.text('Press A for short words', 0, 0);
	await delay(1500);
	await pc.erase(0, 0, 100, 1);
	pc.text('Press B for long words', 0, 0);
}

levelSelect();
