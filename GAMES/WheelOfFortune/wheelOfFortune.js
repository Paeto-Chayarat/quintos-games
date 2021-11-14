const log = console.log;

let phrases = "Tourist-Friendly Destination|Skateboarding & Snowboarding|Underground Entertainment|Competitive Shuffleboard|Cookie-Decorating Contest|Grand-Opening Celebration|Multicultural Activities|Neighborhood Get-Together|Photography & Scrapbooking|Skateboards & Rollerblades|Snowball-Throwing Contest|Snowshoeing & Snowboarding|International Carnivals|Performing-Arts Festival|Skateboard & Rollerblades|Spur-Of-The-Moment Getaway|Unforgettable Carnivals|Wholesome Entertainment|Afterschool Activities|Arts-And-Crafts Festival|Disappearing-Coin Trick|Ice-Carving Competition|Mixologist Competition|Snowbiking & Airboarding|Big-Ticket Attractions|City-Center Horseraces|Halloween Festivities|Hamletscenen Festival|Helium-Filled Balloons|Lion-Dance Competition|Mountaineering & Skiing|Snowboarding & Sledding|Spontaneous Nightlife|Traditional Macaroons|Battleship Destroyer|Building Sandcastles|Carnival Attractions|Festive Celebrations|Fingerprint Drawings|Fingerprints Drawing|Gingerbread-House Kit|Going Paddleboarding|Handball & Racquetball|Helium-Filled Baloons|Curling Championship|In-The-Kitchen Puzzles|Jack-O'-Lantern Carving|Model-Airplane Racing|Renaissance Festival|Alpine Snowboarding|Charades & Pictionary|Contestant Searches|Cross-Country Skiing|Festive Celebration|Five-Gallon Stockpot|Freestyle Wrestling|Frisbee Competition|Interactive Puzzles|Marshmallow Animals|Mini-Golf Tournament|Murder-Mystery Party|Playing Racquetball|Rhythmic Gymnastics|Roller-Coaster Rides|Sled-Pulling Contest|Sleight-Of-Hand Magic|Yuletide Activities|Back-Road Bicycling|Balance-Beam Tricks|Complicated Puzzle|Computer Solitaire|Fast-Pitch Softball|Festive Activities|Freshwater Fishing|Gymnastics Routine|Outdoor Recreation|Playful Activities|Playing Backgammon|Playing Horseshoes|Playing Pictionary|Ski Mountaineering|Slight-Of-Hand Magic|Table Shuffleboard|Water-Balloon Fight|Water-Balloon Throw|Weeklong Festivals|Baseball & Softball|Chess Competition|Collectible Dolls|Crossword Puzzles|Cultural Festival|Equestrian Sports|Filmmaking Genius|Football & Baseball|Football Practice|Going Parasailing|Goldfish Scooping|Halloween Hayride|Hot-Air Ballooning|Indoor Volleyball|Jovial Sing-Alongs|Juggling Beanbags|Late-Night Hayride|Medieval Festival|Miniature Golfing|Playing Asteroids|Playing Badminton|Playing Hopscotch|Playing Paintball|Playing Solitaire|Playing Tic-Tac-Toe|Pothole Exploring|Riverside Camping|Softball & Baseball|Tag-Team Wrestling|Two-Story Carousel|Water-Balloon Toss|Wheelbarrow Races|Writing Limericks|Adventure Racing|Alphabet Magnets|Ballroom Dancing|Barbeque Bonanza|Beach Volleyball|Biggie Boardings|Childhood Heroes|Chinese Checkers|Christmas Crafts|Crossword Puzzle|Demolition Derby|Disappearing Ink|Doing Handstands|Double-Coin Trick|Dungeons & Dragons|Fantasy Football|Fraternity Prank|Freestyle Skiing|Fun Brainteasers|Going Spelunking|Gorgeous Fishing|Gorgeous Golfing|Habanos Festival|Headband Antlers|Hula Competition|Hula-Hoop Contest|Indoor Go-Carting|Indoor Go-Karting|Inflatable Slide|Interactive Toys|Japanese Archery|Juggling Oranges|Knock-Knock Jokes|Masquerade Balls|Narrated Cruises|Paper Snowflakes|Ping-Pong Paddles|Playing Checkers|Playing Dominoes|Playing Jeopardy|Playing Jeopardy!|Playing Kickball|Playing Lacrosse|Playing Monopoly|Playing Peekaboo|Playing Ping-Pong|Playing Scrabble|Popcorn Garlands|Potato-Sack Races|Renaissance Fair|Riding Piggyback|Shooting Marbles|Spitting Contest|Sprint-Car Racing|Street Carnivals|Swim-Up Blackjack|Twenty Questions|Ultimate Frisbee|Urban Spelunking|Volleyball Match|Wheelbarrow Race|Winter Carnivals|Amazing History|Amusement Rides|Anderlecht Fair|Balloon Animals|Big-Wave Surfing|Board-Game Night|Boggle & Scrabble|Boogie Boarding|Burping Contest|Classic Yahtzee|Community Chest|Confetti Cannon|Country Dancing|Cricket & Croquet|Croquet Mallets|Deep-Sea Fishing|Downhill Skiing|Downhill Slalom|Dragon-Boat Race|Exciting Rounds|Family Cookouts|Finger Painting|Gaelic Football";

phrases = phrases.split('|');

// generate random number between 0 and the length of the the words array
let phrase;
let phraseNum = 0;

function randomPhrase() {
	let random = Math.floor(Math.random() * phrases.length);
	// our chooosen word
	phrase = phrases[random];
	phrase = phrase.split(' ');
	log(phrase); // don't look! no cheating! jk ;P
	phraseNum++;
}


// Example phrase: ['Community', 'Chest']
// guesses -> [
//   [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
//   [' ', ' ', ' ', ' ', ' ']
// ]
let guesses = [];
let word = "";

function createGuessSpaces() {
	guesses = [];
	// word.length is the number of letters in the word
	for (let i = 0; i < phrase.length; i++) {
		word = phrase[i];
		guesses.push([]);
		for (let j = 0; j < word.length; j++) {
			if (word[j] == '-' || word[j] == '&') {
				guesses[i].push(word[j]);
			} else {
				guesses[i].push(' ');
			}
		}
	}
}

/* PART A: make a function to display the guess lines */
function displayBoxes() {
	for (let i = 0; i < phrase.length; i++) {
		let word = phrase[i];
		for (let j = 0; j < word.length; j++) {
			pc.rect(3 + j * 3, 3 + i * 3, 3, 3);
			pc.text(guesses[i][j], 4 + j * 3, 4 + i * 3);
		}
	}
}

function getAvail() {
	// gets the available space coordinates [row, col]
	// puts them into an array
	let avail = []; //ex. phrase = big doge
	for (let i = 0; i < phrase.length; i++) { //phrase.length = 2
		for (let j = 0; j < phrase[i].length; j++) { //phrase[0] = big
			if (guesses[i][j] == ' ') {
				avail.push([i, j]); //[[0,0], [0,1], ...,[ 1,4]]
			}
		}
	}
	return avail;
}

async function addLetter() {
	let avail = getAvail();

	if (avail.length == 0) {
		score -= 3;
		scoreBoard();
		await pc.erase(1, 1, 53, 12);
		await pc.alert("You ran out of time! Your score decreased by 3")
		startGame();
		return;
	}


	let rand = Math.floor(Math.random() * avail.length);
	let pick = avail[rand]; //ex. if rand = 4, pick = [1,0]
	let wordIdx = pick[0];
	let letterIdx = pick[1];
	let letter = phrase[wordIdx][letterIdx];
	guesses[wordIdx][letterIdx] = letter;
	log(letter);

	displayBoxes();

	await delay(1000);

	if (!buzzed) addLetter();
}

let score = 0;

function scoreBoard() {
	pc.text('Phrase #' + phraseNum, 2, 20);
	pc.text('Score: ' + score, 44, 20);
}

function startGame() {
	randomPhrase();
	createGuessSpaces();
	scoreBoard();
	addLetter();
}

let buzzed = false;
let bigBuzzer = `
 _
| |__  _   _ ___________ _ __
| '_ \\| | | |_  /_  / _ \\ '__|
| |_) | |_| |/ / / /  __/ |
|_.__/ \\__,_/___/___\\___|_|
                              `;
let buzzer = pc.button(bigBuzzer, 13, 17, async () => {
	if (buzzed) return;
	buzzed = true;
	// guess is the letter the user entered
	// or a guess of the full word
	let guess = await pc.prompt(' ', 2, 24);
	log(guess);
	let isCorrect = false;
	// check if guess is correct
	if (guess != null) {
		guess = guess.toLowerCase().split(' ');
		// loop through each word of phrase
		isCorrect = true;
		for (let i = 0; i < phrase.length; i++) {
			if (guess[i] != phrase[i].toLowerCase()) {
				isCorrect = false;
			}
		}
	}

	if (isCorrect) {
		// calculate the increase in the player's score
		let avail = getAvail();
		score += avail.length;
		scoreBoard();
		await pc.erase(1, 1, 53, 12);
		await pc.alert("Correct! Your score increased by " + avail.length); // see if the guess matches the phrase
		buzzed = false;
		startGame();
	} else {
		buzzed = false;
		addLetter();
	}
});

startGame();
