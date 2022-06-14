import { GAME } from './GAME.js';

let currWorld, currLevel;

const $level = document.querySelector('#level');
const LOCAL = false;
const LOCAL_URL = 'http://localhost:8080';
const PUBLIC_URL = 'https://escapefromhyperisland.github.io';
const TRANSITION_TIME = 2000;

const urlParams = new URLSearchParams(window.location.search);
let worldIndex = urlParams.get('world');
let levelIndex = urlParams.get('level');

if (worldIndex > 0) worldIndex = worldIndex - 1
if (levelIndex > 0) levelIndex = levelIndex - 1

/*switch (worldIndex) {
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
		worldIndex = 5;
		break;
	case '7':
		worldIndex = 6;
		break;
	case '8':
		worldIndex = 7;
		break;
	case '9':
		worldIndex = 8;
		break;
}*/

const pane = new Tweakpane.Pane();
if (levelIndex === null){
	const nextLevelBtn = pane.addButton({ title: 'next level' });
	nextLevelBtn.on('click', nextLevel);
}
const restartLevelBtn = pane.addButton({ title: 'restart level' });
const authorBtn = pane.addButton({ title: 'author' });
restartLevelBtn.on('click', restartLevel);

function startGame() {
	init();
	setup();
	showLevel();
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
	}, TRANSITION_TIME / 2);
}

function showLevel() {
	if (LOCAL) currLevel.url = currLevel.url.replace(PUBLIC_URL, LOCAL_URL);
	const path = currLevel.url;
	$level.src = new URL(path, window.location.href);
	document.body.className = currLevel.title.slugify();
	// document.body.className = `${worldIndex}${levelIndex}`;
	document.title = `${currWorld.title} - ${currLevel.title}`;
	updateAuthor();
	setTimeout(function () {
		document.body.classList.remove('transition');
	}, TRANSITION_TIME);
}

function updateAuthor() {
	authorBtn.hidden = true;
	if (currLevel.author.name) {
		authorBtn.hidden = false;
		authorBtn.title = currLevel.author.name;
	}
	if (currLevel.author.link) {
		authorBtn.on('click', function () {
			window.open(currLevel.author.link, '_blank');
		});
	}
}

function restartLevel() {
	$level.src += '';
}

function gameOver() {
	alert('Game Over!');
}

// Courtesy of https://stackoverflow.com/questions/25098021/securityerror-blocked-a-frame-with-origin-from-accessing-a-cross-origin-frame
window.addEventListener('message', function (event) {
	switch (event.data) {
		case 'nextLevel':
			nextLevel();
			break;
	}
});

startGame();
