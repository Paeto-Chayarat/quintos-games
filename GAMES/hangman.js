const log = console.log;

const hangman = [`
  +---+
  |   |
      |
      |
      |
      |
=========`, `
  +---+
  |   |
  O   |
      |
      |
      |
=========`, `
  +---+
  |   |
  O   |
  |   |
      |
      |
=========`, `
  +---+
  |   |
  O   |
 /|   |
      |
      |
=========`, `
  +---+
  |   |
  O   |
 /|\\  |
      |
      |
=========`, `
  +---+
  |   |
  O   |
 /|\\  |
 /    |
      |
=========`, `
  +---+
  |   |
  O   |
 /|\\  |
 / \\  |
      |
=========`];

let parts = 0;

let words = `abruptly absurd abyss affix askew avenue awkward axiom azure bagpipes bandwagon banjo bayou beekeeper bikini blitz blizzard boggle bookworm boxcar boxful buckaroo buffalo buffoon buxom buzzard buzzing buzzwords caliph cobweb cockiness croquet crypt curacao cycle daiquiri dirndl disavow dizzying duplex dwarves embezzle equip espionage euouae exodus faking fishhook fixable fjord flapjack flopping fluffiness flyby foxglove frazzled frizzled fuchsia funny gabby galaxy galvanize gazebo giaour gizmo glowworm glyph gnarly gnostic gossip grogginess haiku haphazard hyphen iatrogenic icebox injury ivory ivy jackpot jaundice jawbreaker jaywalk jazziest jazzy jelly jigsaw jinx jiujitsu jockey jogging joking jovial joyful juicy jukebox jumbo kayak kazoo keyhole khaki kilobyte kiosk kitsch kiwifruit klutz knapsack larynx lengths lucky luxury lymph marquis matrix megahertz microwave mnemonic mystify naphtha nightclub nowadays numbskull nymph onyx ovary oxidize oxygen pajama peekaboo phlegm pixel pizazz pneumonia polka pshaw psyche puppy puzzling quartz queue quips quixotic quiz quizzes quorum razzmatazz rhubarb rhythm rickshaw schnapps scratch shiv snazzy sphinx spritz squawk staff strength strengths stretch stronghold stymied subway swivel syndrome thriftless thumbscrew topaz transcript transgress transplant triphthong twelfth twelfths unknown unworthy unzip uptown vaporize vixen vodka voodoo vortex voyeurism walkway waltz wave wavy waxy wellspring wheezy whiskey whizzing whomever wimpy witchcraft wizard woozy wristwatch wyvern xylophone yachtsman yippee yoked youthful yummy zephyr zigzag zigzagging zilch zipper zodiac zombie`;

words = words.split(' ');

// generate random number between 0 and the length of the the words array
let random = Math.floor(Math.random() * words.length);
// our chooosen word
let word = words[random];
log(word); // don't look! no cheating! jk ;P

let guesses = [];
// word.length is the number of letters in the word
for (let i = 0; i < word.length; i++) {
	guesses.push('_'); // add something to array
}

// Example word: 'quiz'
// guesses -> ['_', '_', '_', '_']

/* PART A: make a function to display the guess lines */
function displayGuessLines() {
	let txt = '';
	for (let i in guesses) {
		txt += guesses[i] + " ";
	}
	// example quiz
	// txt = '_ _ _ _'
	return txt;
}

(async () => {

	/* PART A: make the game loop and implement game logic */
	while (guesses.includes("_")) {

		let msg = hangman[parts] + '\n' + displayGuessLines();
		// guess is the letter the user entered
		// or a guess of the full word
		let guess = await window.prompt(msg);
		let isCorrect = false;
		// test if the guess is a whole word, not just one letter
		if (guess.length > 1) {
			if (guess == word) {
				break; // if guess matches word the user won, end loop
			}
		} else {
			for (let i in guesses) {
				// the next letter in the word
				let letter = word.charAt(i);
				if (letter == guess) {
					guesses[i] = letter;
					isCorrect = true;
				}
			}
		}

		if (isCorrect == true) {
			await window.alert("correct!");
		} else {
			await window.alert("incorrect!");
			parts++;
		}

		if (parts > 6) {
			break;
		}
	}

	if (parts <= 6) {
		await window.alert("You got it! The word is " + word);
	} else {
		await window.alert("You ran out of attempts. The word is " + word);
	}


	// don't use the hangman yet!

	/* PART B: display the hangman in the prompt */

})(); // end of wrapper function
