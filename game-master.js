const numWorlds = 8;
const currentLevel = document.querySelector('#level');

function nextLevel(levelId) {
	localStorage.setItem(levelId, 'true');
	currentLevel.src = '1-2.html';
	console.log(allStorage);
}

function resetGame() {
	localStorage.clear();
}

function allStorage() {
	var values = [],
		keys = Object.keys(localStorage),
		i = keys.length;

	while (i--) {
		values.push(localStorage.getItem(keys[i]));
	}

	return values;
}
