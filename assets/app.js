let currWorld, currLevel;
const $level = document.querySelector('#level');

function startGame() {
	setup();
	showLevel();
	console.log('currWorld', currWorld);
	console.log('currLevel', currLevel);
}

function setup() {
	if (GAME.order === null) GAME.order = arr(GAME.worlds.length);
	for (let world of GAME.worlds) {
		if (world.order === null) world.order = arr(world.levels.length);
	}
	currWorld = getWorld();
	let levelIndex = currWorld.order[0];
	currLevel = currWorld.levels[levelIndex];
}

function getWorld() {
	let index = GAME.order[0];
	return GAME.worlds[index];
}

function getLevel() {
	let i = currWorld.order[0];
	return currWorld.levels[i];
}

function nextLevel() {
	currWorld.order.shift();
	if (currWorld.order.length === 0 && GAME.order.length === 1) {
		gameOver();
	} else {
		if (currWorld.order.length === 0) {
			GAME.order.shift();
			currWorld = getWorld();
		}
		currLevel = getLevel();
		showLevel();
	}
	console.log('currWorld', currWorld);
	console.log('currLevel', currLevel);
}

function showLevel() {
	const worldSlug = currWorld.title.slugify('-');
	const levelSlug = currLevel.title.slugify('-');
	const path = `worlds/${worldSlug}/${levelSlug}/index.html`;
	$level.src = new URL(path, window.location.href);
	document.title = `${currWorld.title} - ${currLevel.title}`;
	console.log($level.src);
}

function gameOver() {
	alert('Game Over!');
}
