const log = console.log;

let name = 'Paeto';

function pickPath(choice) {
	let msg; // message
	let opt = []; // options

	// in the beginning of the game, before the user has choosen
	// any path, the initial choice is 1000
	if (choice == 1000) {
		pc.textAt(10, 1, `
           .-'""p 8o""\`-.
        .-'8888P'Y.\`Y[ ' \`-.
      ,']88888b.J8oo_      '\`.
    ,' ,88888888888["        Y\`.
   /   8888888888P            Y8\\
  /    Y8888888P'             ]88\\
 :     \`Y88'   P              \`888:
 :       Y8.oP '- >            Y88:
 |          \`Yb  __             \`'|
 :            \`'d8888bo.          :
 :             d88888888ooo.      ;
  \\            Y88888888888P     /
   \\            \`Y88888888P     /
    \`.            d88888P'    ,'
      \`.          888PP'    ,'
        \`-.      d8P'    ,-'
           \`-.,,_'__,,.-'`);

		pc.textAt(1, 4, `
			 _..._
			.'     '.      _
		 /    .-""-\\   _/ \\
	 .-|   /:.   |  |   |
	 |  \\  |:.   /.-'-./
	 | .-'-;:__.'    =/
	 .'=  *=|NASA _.='
	/   _.  |    ;
 ;-.-'|    \\   |
/   | \\    _\\  _\\
\\__/'._;.  ==' ==\\
				 \\    \\   |
				 /    /   /
				 /-._/-._/
	jgs    \\   \`\\  \\
					\`-._/._/`);
		pc.textAt(40, 15, `
				.-.
			 ( (
				\`-'`);
		msg = name + " and his friends are on a space station. They hear an explosive sound at the far end of their station. What should " + name + " do?  \n" +
			"0: Go towards the end of the station to investigate.\n" +
			"1: Close off the door to that compartment.";
		opt = [0, 1];
	} else if (choice == 0) {
		msg = "The sound of air rushing out of the compartment gets louder as " + name + " gets closer to the end of the station. What should they do?\n" +
			"3: Keep going\n" +
			"4: Get help!\n" +
			"5: It's too late for them. Close the doors.";
		opt = [3, 4, 5];
	} else if (choice == 1) {
		msg = "But your friend is in that compartment! Are you sure you want to close the doors?\n" +
			"0: Go towards the end of the station to investigate.\n" +
			"2: Tell your friend to get out!\n" +
			"5: It's too late for them. Close the doors.";
		opt = [0, 2, 5];
	} else if (choice == 2) {
		msg = name + " yells to his friend but the sound is getting louder. What should they do?\n" +
			"0: Go towards the end of the space station.\n" +
			"5: It's too late for them. Close the doors.";
		opt = [0, 5];
	} else if (choice == 3) {
		msg = name + " reaches the end of the space station but another explosion happens. They die! Game Over."
		opt = [];
	} else if (choice == 4) {
		msg = "Another crew member wants to shut down the component to stop the electrical hazard but this will also turn off the oxygen system!\n" +
			"6: Shut down the component.\n" +
			"7: Keep the electricity and oxygen systems on."
		opt = [6, 7];
	} else if (choice == 5) {
		msg = name + " closed the compartment doors. They didn't have a full understanding of the situation and uncessarily murdered their friend! Game Over.";
		opt = [];
	} else if (choice == 6) {
		// good ending
		msg = name + "'s friend makes it out of the compartment alive! The explosion had caused a fire which stops burning. Everyone is safe, you won!";
		opt = [];
	} else if (choice == 7) {
		msg = "Another explosion occurs. Your friend dies! Game Over.";
		opt = [];
	}
	let p = {
		message: msg,
		options: opt
	};
	return p;
}

async function startNewGame() {
	let playingGame = true;

	let currentChoice = 1000;

	while (playingGame) {

		let path = pickPath(currentChoice);

		let res;
		// the user's response
		// if user can respond, the path's options array
		// will have a length above 0
		if (path.options.length != 0) {
			res = await pc.prompt(1, 22, path.message);
		} else {
			await window.alert(path.message);
		}

		log(res);

		// if the user responds to the prompt by
		// pressing the cancel button
		// then the response will be null
		if (res == null) {
			// quit playing the game
			playingGame = false;
			// exit while loop
			break;
			// will not run the rest of the code
			// in the while loop block
		}

		// only change the currentChoice variable
		// to the user's response
		// if the response is included in the array
		// of valid options for the current path
		// response must be converted to a number first
		if (path.options.includes(Number(res))) {
			currentChoice = res;
		} else {
			await window.alert('Invalid choice!');
		}
	}

	await window.alert('Try playing again!');

	startNewGame();
}

startNewGame();
