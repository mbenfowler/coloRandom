var savedPalettes = [];
var currentPalette = [];

var buttonSection = document.querySelector('.button-area');
var newPaletteButton = document.querySelector('button');
var mainColorBoxes = document.querySelectorAll('.color-container');
var lockButton = document.querySelector('.main-display');
var savedPalettesSection = document.querySelector('.mini-palettes')
var paragraph = document.querySelector('p')

window.addEventListener('load', function() {
    getNewHexes(mainColorBoxes);
});

lockButton.addEventListener('click', function(event) {
    if (event.target.classList.contains('lock-box')) {
        toggleLock(event.target);
    }
});

buttonSection.addEventListener('click', function(event) {
    if(event.target.classList.contains('new-palette')) {
        getNewHexes(mainColorBoxes);
    }
});

buttonSection.addEventListener('click', function(event) {
    if (event.target.classList.contains('save-palette')) {
        savePalette();
    }
});

savedPalettesSection.addEventListener('click', function(event) {
    // getSavedPalette(event);
    displaySavedPalettesSection(getSavedPalette(event));
});

function getNewHexes(mainColorBoxes) {
    var oldHexes = currentPalette;
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

function toggleLock(event) {
    if (event.getAttribute('src') === './assets/unlocked.png') {
        event.src = './assets/locked.png';
    } else {
        event.src = './assets/unlocked.png'; 
    }
    event.classList.toggle('unlocked');
}

function getRandomHex() {
    return (Math.floor(Math.random() * 16777216).toString(16).padStart(6, 0));
}

function savePalette() {
    savedPalettes.push(currentPalette);
    displaySavedPalettesSection(savedPalettes);
    getNewHexes(mainColorBoxes);
}

function displaySavedPalettesSection(palette) {
    savedPalettesSection.innerHTML = '';
    if (!palette.length) {
        paragraph.classList.remove('hidden');
    } else {
        paragraph.classList.add('hidden');
        for (i = 0; i < palette.length; i++) {
            savedPalettesSection.innerHTML += `
            <div class="mini-container hover">
                <div class="mini-box", style="background-color: #${palette[i][0]}"></div>
                <div class="mini-box", style="background-color: #${palette[i][1]}"></div>
                <div class="mini-box", style="background-color: #${palette[i][2]}"></div>
                <div class="mini-box", style="background-color: #${palette[i][3]}"></div>
                <div class="mini-box", style="background-color: #${palette[i][4]}"></div>
            </div>
            `
        }
    }
}

function getSavedPalette(event) {
    var savedColour = [];
    
    if (event.target.classList.contains('mini-box')) {
        for (var i = 0; i < event.target.parentNode.children.length; i++) {
            savedColour[i] = event.target.parentNode.children[i].style.backgroundColor;
        }
    }
    console.log(event)
    console.log(savedColour)
    return [savedColour];
}