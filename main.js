var savedPalettes = [];
var currentPalette = [];

var buttonSection = document.querySelector('.button-area');
var newPaletteButton = document.querySelector('button');

var mainColorBoxes = document.querySelectorAll('.color-container');
var lockButton = document.querySelector('.main-display');
var savedPalettesSection = document.querySelector('.mini-palettes')
var p = document.querySelector('p')

window.addEventListener('load', getNewHexes);

lockButton.addEventListener('click', function(event) {
    if (event.target.classList.contains('lock-box')) {
        lockToggle(event.target);
    }
});

buttonSection.addEventListener('click', function(event) {
    if(event.target.classList.contains('new-palette')) {
        getNewHexes();
    }
});

function getNewHexes() {
    var oldHexes = currentPalette
    currentPalette = [];
    var newColor;
    for(i = 0; i < mainColorBoxes.length; i++) {
        var thisColorBoxLock = mainColorBoxes[i].firstElementChild.firstElementChild
        if(thisColorBoxLock.classList.contains('unlocked')) {
            newColor = getRandomHex().toUpperCase();
            mainColorBoxes[i].firstElementChild.style.backgroundColor = `#${newColor}`;
            mainColorBoxes[i].lastElementChild.innerText = `#${newColor}`;
            currentPalette.push(newColor);
        } else { 
            currentPalette.push(oldHexes[i])
        }
    }
}

function lockToggle(event) {
    if (event.getAttribute('src') === './assets/unlocked.png') {
        event.src = './assets/locked.png';
    } else {
        event.src = './assets/unlocked.png'; 
    }
    event.classList.toggle('unlocked')
}

function getRandomHex() {
    return (Math.floor(Math.random() * 16777216).toString(16).padStart(6, 0));
}

buttonSection.addEventListener('click', function(event) {
    if (event.target.classList.contains('save-palette')) {
        savePalette();
    }
})

function savePalette() {
    if (!savedPalettes.includes(currentPalette)) {
        savedPalettes.push(currentPalette);
    }
    displaysavedPalettesSection();
    getNewHexes();
}

function displaysavedPalettesSection() {
    savedPalettesSection.innerHTML = '';
    if (!savedPalettes.length) {
        p.classList.remove('hidden');
    } else {
        p.classList.add('hidden');
        for (i = 0; i < savedPalettes.length; i++) {
        savedPalettesSection.innerHTML += `
        <div class="mini-container">
            <div class="mini-box", style="background-color: #${savedPalettes[i][0]}"></div>
            <div class="mini-box", style="background-color: #${savedPalettes[i][1]}"></div>
            <div class="mini-box", style="background-color: #${savedPalettes[i][2]}"></div>
            <div class="mini-box", style="background-color: #${savedPalettes[i][3]}"></div>
            <div class="mini-box", style="background-color: #${savedPalettes[i][4]}"></div>
        </div>
        `
        };
    }
}