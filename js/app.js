import { GAME } from './GAME.js';

let currWorld, currLevel;

const $level = document.querySelector('#level');
const LOCAL = false;
const LOCAL_URL = 'http://localhost:8080';
const PUBLIC_URL = 'https://escapefromhyperisland.github.io';

const urlParams = new URLSearchParams(window.location.search);
let worldIndex = urlParams.get('world');
let levelIndex = urlParams.get('level');

switch (worldIndex) {
	case '1':
		worldIndex = 0;
		break;
	case '2':
		worldIndex = 1;
		break;
	case '3':
		worldIndex = 2;
		break;
	case '4':
		worldIndex = 3;
		break;
	case '5':
		worldIndex = 4;
		break;
	case '6':
		alert('Nope.');
		break;
	case '7':
		worldIndex = 5;
		break;
	case '8':
		worldIndex = 6;
		break;
}

console.log(`worldIndex: ${worldIndex}, levelIndex: ${levelIndex}`);
console.log(GAME);

// startGameBtn.addEventListener('click', startGame);
nextLevelBtn.addEventListener('click', nextLevel);

function startGame() {
	// let landing = document.querySelector('#landing');
	// landing.parentNode.removeChild(landing);
	// navigator.mediaDevices.getUserMedia({ video: true, audio: true });
	init();
	setup();
	showLevel();
	console.log('currWorld', currWorld);
	console.log('currLevel', currLevel);
}

function init() {
	if (worldIndex !== null) {
		GAME.worlds = [GAME.worlds[worldIndex]];
		if (levelIndex !== null)
			GAME.worlds[0].levels = [GAME.worlds[0].levels[levelIndex]];
	}

	if (GAME.order === 'random') {
		GAME.order = rarr(GAME.worlds.length);
	} else {
		GAME.order = [];
		GAME.worlds.forEach((world, index) => {
			GAME.order[index] = index;
		});
	}
	for (let world of GAME.worlds) {
		world.order = [];
		world.levels.forEach((level, index) => {
			world.order[index] = index;
		});
	}
}

function setup() {
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
	const path = currLevel.url;
	$level.src = new URL(path, window.location.href);
	document.title = `${currWorld.title} - ${currLevel.title}`;
	// console.log($level.src);
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

startGame();
// nextLevel();
