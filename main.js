var hexData = [];
var currentHexes;

var newPaletteButtonSection = document.querySelector('.button-area');
var newPaletteButton = document.querySelector('button');

var mainColorBoxes = document.querySelectorAll('.color-container');
var lockButton = document.querySelector('.main-display');

window.addEventListener('load', function () {
    console.log("getNewHexes()");
});

lockButton.addEventListener('click', function(event) {
    if (event.target.className === 'lock-box') {
        lockToggle(event.target);
    }
});

newPaletteButtonSection.addEventListener('click', function(event) {
    if(event.target.classList.contains('button-box-l') || event.target.id === 'new-palette' || event.target.classList.contains('button-box-r')) {
        getNewHexes();
    }
});

function getNewHexes() {
    currentHexes = [];
    mainColorBoxes.forEach((colorBox) => {
        var newColor = getRandomHex().toUpperCase();
        colorBox.firstElementChild.style.backgroundColor = `#${newColor}`;
        colorBox.lastElementChild.innerText = `#${newColor}`;
    });
}

function lockToggle(event) {
    if (event.getAttribute('src') === './assets/unlocked.png') {
        event.src = './assets/locked.png'
    } else {
        event.src = './assets/unlocked.png'
    }
}

function getRandomHex() {
    return (Math.floor(Math.random() * 16777216).toString(16).padStart(6, 0));
}
