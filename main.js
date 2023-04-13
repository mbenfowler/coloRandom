var hexData = [];
var currentHexes;

var newPaletteButtonSection = document.querySelector('.button-area');
var newPaletteButton = document.querySelector('button');

var mainColorBoxes = document.querySelectorAll('.color-container');
var lockButton = document.querySelector('.main-display');
var savedPalettes = document.querySelector('.mini-palettes')
var saveButton = document.querySelector('#save-palette')
var p = document.querySelector('p')

window.addEventListener('load', getNewHexes);

lockButton.addEventListener('click', function(event) {
    if (event.target.classList.contains('lock-box')) {
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
    var newColor;
    for(i = 0; i < mainColorBoxes.length; i++) {
        var thisColorBoxLock = mainColorBoxes[i].firstElementChild.firstElementChild
        if(thisColorBoxLock.classList.contains('unlocked')) {
            newColor = getRandomHex().toUpperCase();
            mainColorBoxes[i].firstElementChild.style.backgroundColor = `#${newColor}`;
            mainColorBoxes[i].lastElementChild.innerText = `#${newColor}`;
            currentHexes.push(newColor);
        }
    }
}

function lockToggle(event) {
    if (event.getAttribute('src') === './assets/unlocked.png') {
        event.src = './assets/locked.png';
        toggleLockClass(event);
    } else {
        event.src = './assets/unlocked.png';
        toggleLockClass(event);
    }
}

function toggleLockClass(element) {
    if(element.classList.contains('locked')) {
        element.classList.remove('locked');
        element.classList.add('unlocked');
    } else {
        element.classList.add('locked');
        element.classList.remove('unlocked');
    }
}

function getRandomHex() {
    return (Math.floor(Math.random() * 16777216).toString(16).padStart(6, 0));
}

saveButton.addEventListener('click', function(event) {
    if (event.target.id === 'save-palette') {
        savePalette();
    }
})

function savePalette() {
    if (!hexData.includes(currentHexes)) {
        hexData.push(currentHexes)
    }
    displaySavedPalettes()
}

function displaySavedPalettes() {
    savedPalettes.innerHTML = '';
    if (!hexData.length) {
        p.classList.remove('hidden');
    } else {
        p.classList.add('hidden');
        for (i = 0; i < hexData.length; i++) {
        savedPalettes.innerHTML += `
        <section class="mini-container">
            <div class="mini-box", style="background-color: #${hexData[i][0]}"></div>
            <div class="mini-box", style="background-color: #${hexData[i][1]}"></div>
            <div class="mini-box", style="background-color: #${hexData[i][2]}"></div>
            <div class="mini-box", style="background-color: #${hexData[i][3]}"></div>
            <div class="mini-box", style="background-color: #${hexData[i][4]}"></div>
        </section>
        `
        };
    }
}