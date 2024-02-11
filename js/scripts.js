import confetti from 'https://cdn.skypack.dev/canvas-confetti';

$(document).ready(function () {
	const firework = new Audio('assets/new-year-fireworks-sound4-180205.mp3');
	firework.onerror = function () {
		console.error('Error loading firework sound.');
	};
	const win = new Audio('assets/piglevelwin2mp3-14800.mp3');
	win.onerror = function () {
		console.error('Error loading win sound.');
	};

	function stopGame() {
		$.each($('.bottle'), function (index, element) {
			$(element).css('pointer-events', 'none');
		});

		firework.play();
		win.play();

		var duration = 5 * 1000;
		var animationEnd = Date.now() + duration;
		var defaults = { startVelocity: 30, spread: 1000, ticks: 60, zIndex: 0 };

		function randomInRange(min, max) {
			return Math.random() * (max - min) + min;
		}

		var interval = setInterval(function () {
			var timeLeft = animationEnd - Date.now();

			if (timeLeft <= 0) {
				return clearInterval(interval);
			}

			var particleCount = 100 * (timeLeft / duration);
			// since particles fall down, start a bit higher than random
			confetti({
				...defaults,
				particleCount,
				origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
			});
			confetti({
				...defaults,
				particleCount,
				origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
			});
		}, 250);
	}

	function verifySequence(sequence, original) {
		console.clear();
		let correctCount = 0;
		for (let i = 0; i < sequence.length; i++) {
			if (sequence[i] === original[i]) {
				correctCount++;
			}
		}

		if (correctCount === original.length) {
			$('#counter').text('You solved it, congrats');
			stopGame();
		} else {
			$('#counter').text(`${correctCount} bottle(s) is in correct position`);
		}
	}

	function checkSequence(original) {
		var bottles = $('.bottle');

		// Sort the bottle elements based on their --left value
		bottles.sort(function (a, b) {
			var leftA = parseFloat($(a).css('--left'));
			var leftB = parseFloat($(b).css('--left'));
			return leftA - leftB;
		});

		// Get the data-count attribute of each bottle and print the sequence
		var sequence = bottles
			.map(function () {
				return $(this).data('count');
			})
			.get();

		verifySequence(sequence, original);
	}

	function generateRandomArray() {
		const array = [1, 2, 3, 4, 5, 6];
		for (let i = array.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[array[i], array[j]] = [array[j], array[i]];
		}
		return array;
	}

	$(window).on('load', function () {
		$('.custom_loader').fadeOut('fast', function () {
			$(this).remove();
		});
	});

	const original = generateRandomArray();
	const woosh = new Audio('assets/whoosh-6316.mp3');
	woosh.onerror = function () {
		console.error('Error loading woosh sound.');
	};
	woosh.volume = 0.5;
	const click = new Audio('assets/shooting-sound-fx-159024.mp3');
	click.onerror = function () {
		console.error('Error loading shooting sound.');
	};
	click.volume = 0.8;

	let selectedBottle = null;
	let hasSelected = false;
	$.each($('.bottle'), function (index, element) {
		$(element).click(function (e) {
			e.preventDefault();
			const el = e.currentTarget;
			click.play();

			if (hasSelected) {
				let selectedBottle_left = $(selectedBottle).css('--left');
				let secondBottle_left = $(el).css('--left');

				$(selectedBottle).removeClass('selected');
				$(selectedBottle).css('--left', secondBottle_left);
				$(el).css('--left', selectedBottle_left);

				selectedBottle = null;
				hasSelected = false;

				woosh.play();

				checkSequence(original);
			} else {
				$(el).addClass('selected');
				selectedBottle = el;
				hasSelected = true;
			}
		});
	});
});
