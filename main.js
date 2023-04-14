var savedPalettes = [];
var currentPalette = [];

var buttonSection = document.querySelector('.button-area');
var newPaletteButton = document.querySelector('button');
var mainColorBoxes = document.querySelectorAll('.color-container');
var lockButton = document.querySelector('.main-display');
var savedPalettesSection = document.querySelector('.mini-palettes');
var paragraph = document.querySelector('p');

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
    if(event.target.classList.contains('save-palette')) {
        savePalette();
    }
});

savedPalettesSection.addEventListener('click', function(event) {
    if(event.target.classList.contains('delete-button')) {
        var eventTargetParent = event.target.parentNode;
        var thisSavedPaletteIndex = Array.from(eventTargetParent.parentNode.children).indexOf(eventTargetParent);
        deletePalette(eventTargetParent, thisSavedPaletteIndex);
    } else if (event.target.classList.contains('mini-box')){
        displayMainColours(getSavedPalette(event));
    }
});

function getNewHexes(mainDisplayedColors) {
    var oldHexes = currentPalette;
    currentPalette = [];
    var newColor;
    for(i = 0; i < mainDisplayedColors.length; i++) {
        var thisColorBoxLock = mainDisplayedColors[i].firstElementChild.firstElementChild;
        if(thisColorBoxLock.classList.contains('unlocked')) {
            newColor = getRandomHex().toUpperCase();
            mainDisplayedColors[i].firstElementChild.style.backgroundColor = `#${newColor}`;
            mainDisplayedColors[i].lastElementChild.innerText = `#${newColor}`;
            currentPalette.push(newColor);
        } else { 
            currentPalette.push(oldHexes[i]);
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

function deletePalette(savedPalette, savedPalettesIndex) {
    savedPalettes.splice(savedPalettesIndex, 1);
    savedPalette.remove();
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
                <img class="delete-button" src='./assets/delete.png'></img>
            </div>
            `
        }
    }
}

function getSavedPalette(event) {
    var color;
    var savedColors = [];
    if (event.target.classList.contains('mini-box')) {
        for (var i = 0; i < event.target.parentNode.children.length - 1; i++) {
            color = event.target.parentNode.children[i].style.backgroundColor;
            savedColors[i] = rgbToHex(rgbToNumbers(color));
        }
    }
    return savedColors;
}

function rgbToNumbers(rgbString) {
    var rgbArray = rgbString.substring(4, rgbString.length -1 ).split(',');
    var rgbNumbers = [];
    for (var i = 0; i < rgbArray.length; i++) {
        rgbNumbers.push(Number(rgbArray[i]));
    }
    return rgbNumbers;
}

function rgbToHex(rgbNumbers) {
    return (rgbNumbers[0].toString(16).padStart(2, 0) + rgbNumbers[1].toString(16).padStart(2, 0) + rgbNumbers[2].toString(16).padStart(2, 0)).toUpperCase();
}  

function displayMainColours(savedPalette) {
    currentPalette = savedPalette;
    for (i = 0; i < savedPalette.length; i++) {
        mainColorBoxes[i].firstElementChild.style.backgroundColor = `#${savedPalette[i]}`;
        mainColorBoxes[i].lastElementChild.innerText = `#${savedPalette[i]}`;
    }
}
