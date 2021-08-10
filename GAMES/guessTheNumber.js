(async () => { // wrapper

	/* YOUR CODE GOES HERE! Inside the wrapper function :D */

	// PART A: Make the random number between 1 and 100
	let num = Math.random() * 100;
	// round up to nearest whole integer
	num = Math.ceil(num);

	let guess = 0;
	for (let attempt = 0; guess != num; attempt++) {
		// ask user to guess a number, returns the number they guessed
		if (attempt > 7) {
			break;
		}
		guess = await prompt("Guess a number 1 to 100");
		if (guess < 0 || guess > 100) {
			await alert("Your guess is invalid");
			attempt--;
		} else if (guess < num) {
			await alert("Your guess is too low");
		} else if (guess > num) {
			await alert("Your guess is too high");
		} else {
			await alert("Enter numbers only");
			attempt--;
		}
	}

	if (attempt > 7) {
		await alert("You ran out of attempts");
	} else {
		await alert("You got it right!");
	}

	exit();
})(); // end of the wrapper (runs the code in the function)
