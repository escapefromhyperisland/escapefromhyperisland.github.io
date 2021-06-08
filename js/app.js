import { GAME } from './GAME.js';

console.log(GAME);

let currWorld, currLevel;
const $level = document.querySelector('#level');
const LOCAL = false;
const LOCAL_URL = 'http://localhost:8080';
const PUBLIC_URL = 'https://escapefromhyperisland.github.io';

startGameBtn.addEventListener('click', startGame);

function startGame() {
	navigator.mediaDevices.getUserMedia({ video: true, audio: true });
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
	if (LOCAL) currLevel.url = currLevel.url.replace(PUBLIC_URL, LOCAL_URL);
	const path = currLevel.url || `worlds/${worldSlug}/${levelSlug}/index.html`;
	$level.src = new URL(path, window.location.href);
	document.title = `${currWorld.title} - ${currLevel.title}`;
	console.log($level.src);
}

function gameOver() {
	alert('Game Over!');
}
// Courtesy of https://stackoverflow.com/questions/25098021/securityerror-blocked-a-frame-with-origin-from-accessing-a-cross-origin-frame
window.addEventListener('message', function (event) {
	console.log(event);
	switch (event.data) {
		case 'nextLevel':
			nextLevel();
			break;
	}
});
