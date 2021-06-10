import { GAME } from './GAME.js';

let currWorld, currLevel;

const $level = document.querySelector('#level');
const LOCAL = false;
const DEBUG = false;
const LOCAL_URL = 'http://localhost:8080';
const PUBLIC_URL = 'https://escapefromhyperisland.github.io';
const TRANSITION_TIME = 2000;

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

if (DEBUG) console.log(`worldIndex: ${worldIndex}, levelIndex: ${levelIndex}`);
if (DEBUG) console.log(GAME);

nextLevelBtn.addEventListener('click', nextLevel);
restartLevelBtn.addEventListener('click', restartLevel);

function startGame() {
	init();
	setup();
	showLevel();
	if (DEBUG) console.log('currWorld', currWorld);
	if (DEBUG) console.log('currLevel', currLevel);
	setTimeout(function () {
		document.body.classList.remove('transition');
	}, TRANSITION_TIME);
}

function init() {
	if (worldIndex !== null) {
		GAME.worlds = [GAME.worlds[worldIndex]];
		if (levelIndex !== null)
			GAME.worlds[0].levels = [GAME.worlds[0].levels[levelIndex]];
	}

	if (GAME.order === 'random') {
		GAME.order = rarr(GAME.worlds.length);
	} else if (GAME.order === Array) {
		GAME.order = [];
		GAME.worlds.forEach((world, index) => {
			GAME.order[index] = index;
		});
	}
	for (let world of GAME.worlds) {
		// if (world.order === Array) {
		world.order = [];
		world.levels.forEach((level, index) => {
			world.order[index] = index;
		});
		// }
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
	document.body.classList.add('transition');
	setTimeout(function () {
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
		if (DEBUG) console.log('currWorld', currWorld);
		if (DEBUG) console.log('currLevel', currLevel);
	}, TRANSITION_TIME / 2);
}

function showLevel() {
	if (LOCAL) currLevel.url = currLevel.url.replace(PUBLIC_URL, LOCAL_URL);
	const path = currLevel.url;
	$level.src = new URL(path, window.location.href);
	document.title = `${currWorld.title} - ${currLevel.title}`;
	// if (DEBUG) console.log($level.src);
	setTimeout(function () {
		document.body.classList.remove('transition');
	}, TRANSITION_TIME);
}

function restartLevel() {
	$level.src += '';
}

function gameOver() {
	alert('Game Over!');
}

// Courtesy of https://stackoverflow.com/questions/25098021/securityerror-blocked-a-frame-with-origin-from-accessing-a-cross-origin-frame
window.addEventListener('message', function (event) {
	if (DEBUG) console.log(event);
	switch (event.data) {
		case 'nextLevel':
			nextLevel();
			break;
	}
});

startGame();
