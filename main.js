var savedPalettes = [];
var currentPalette = {};
var shouldDelete = false;

var main = document.querySelector('main');
var savedContainer = document.querySelector('.save-container');
var buttonSection = document.querySelector('.button-area');
var newPaletteButton = document.querySelector('button');
var mainColorBoxes = document.querySelectorAll('.color-container');
var lockButton = document.querySelector('.main-display');
var savedPalettesSection = document.querySelector('.mini-palettes');
var saveModal = document.getElementById('namePaletteModal');
var saveModalInput = document.querySelector('input');
var saveModalButton = document.getElementById('savePaletteButton');
var deleteModal = document.getElementById('deletePaletteModal');
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
    if (event.target.classList.contains('new-palette')) {
        getNewHexes(mainColorBoxes);
    }
});

buttonSection.addEventListener('click', function(event) {
    if (event.target.classList.contains('save-palette')) {
        savePalette();
    }
});

savedPalettesSection.addEventListener('click', async function(event) {
    if (event.target.classList.contains('delete-button')) {
        modalClassToggler();
        await getPromiseFromEvent(deleteModal, 'click');
        if (shouldDelete) {
            var eventTargetParent = event.target.parentNode;
            var thisSavedPaletteIndex = Array.from(eventTargetParent.parentNode.children).indexOf(eventTargetParent);
            deletePalette(eventTargetParent, thisSavedPaletteIndex);
        } 
        modalClassToggler();
        shouldDelete = false;
    } else if (event.target.classList.contains('mini-box')) {
        displayMainColours(getSavedPalette(event));
    }
});

function getPromiseFromEvent(element, listenerName) {
    return new Promise(function (resolve) {
        function listener(event) {
            if (event.target.classList.contains('modal-exit-button')) {
                shouldDelete = false;
            } else if (event.target.nodeName === 'BUTTON') {
                shouldDelete = true;
            }
            element.removeEventListener(listenerName, listener);
            resolve(event);
        };
        element.addEventListener(listenerName, listener);
    });
}

function modalClassToggler() {
    deleteModal.classList.toggle('hidden');
    main.classList.toggle('block');
    savedContainer.classList.toggle('block');
}

function getNewHexes(mainDisplayedColors) {
    var oldHexes = currentPalette.hexes;
    currentPalette = {
        hexes: [],
        name: ''
    };
    var newColor;
    for (i = 0; i < mainDisplayedColors.length; i++) {
        var thisColorBoxLock = mainDisplayedColors[i].firstElementChild.firstElementChild;
        if (thisColorBoxLock.classList.contains('unlocked')) {
            newColor = getRandomHex();
            mainDisplayedColors[i].firstElementChild.style.backgroundColor = `#${newColor}`;
            mainDisplayedColors[i].lastElementChild.innerText = `#${newColor}`;
            currentPalette.hexes.push(newColor);
        } else { 
            currentPalette.hexes.push(oldHexes[i]);
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
    return (Math.floor(Math.random() * 16777216).toString(16).padStart(6, 0)).toUpperCase();
}

async function savePalette() {
    modalClassToggler2();
    if (!savedPalettes.length) {
        paragraph.classList.add('hidden');
    } 
    if (isPaletteUnique(savedPalettes, currentPalette)) {
        await getPromiseFromEvent2(saveModalButton, 'click');
        savedPalettes.push(currentPalette);
        addPaletteToSavedPalettes(currentPalette);
    }
    modalClassToggler2();
    getNewHexes(mainColorBoxes);
}

function getPromiseFromEvent2(element, listenerName) {
    return new Promise(function (resolve) {
        function listener(event) {
            if (event.target.nodeName === 'BUTTON') {
                currentPalette.name = saveModalInput.value;
                saveModalInput.value = ''
            }
            element.removeEventListener(listenerName, listener);
            resolve(event);
        };
        element.addEventListener(listenerName, listener);
    });
}

function modalClassToggler2() {
    saveModal.classList.toggle('hidden');
    main.classList.toggle('block');
    savedContainer.classList.toggle('block');
}

function isPaletteUnique(savedPalettes, currentPalette) {
    for (i = 0; i < savedPalettes.length; i++) {
        var matches = true;
        for (j = 0; j < savedPalettes[i].hexes.length; j++) {
            if (savedPalettes[i].hexes[j] !== currentPalette.hexes[j]) {
                matches = false;
                break;
            }
        }
        if (matches) {
            return false;
        }
    }    
    return true;
}

function deletePalette(savedPalette, savedPalettesIndex) {
    savedPalettes.splice(savedPalettesIndex, 1);
    savedPalette.remove();
    if (!savedPalettes.length) {
        paragraph.classList.remove('hidden');
    }
}

function addPaletteToSavedPalettes(palette) {
    var newMiniContainer = document.createElement('div');
    newMiniContainer.classList.add('mini-container', 'hover');
    savedPalettesSection.appendChild(newMiniContainer);
    for (i = 0; i < palette.hexes.length; i++) {
        newMiniContainer.innerHTML += `<div class="mini-box", style="background-color: #${palette.hexes[i]}"></div>`;
    }
    newMiniContainer.innerHTML += `<img class="delete-button" src='./assets/delete.png'></img>`;
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
    rgbToHexString = '';
    for (var i = 0; i < rgbNumbers.length; i++) {
        rgbToHexString += rgbNumbers[i].toString(16).padStart(2, 0);
    }

    return rgbToHexString.toUpperCase();
}  

function displayMainColours(savedPalette) {
    currentPalette = savedPalette;
    for (i = 0; i < savedPalette.length; i++) {
        mainColorBoxes[i].firstElementChild.style.backgroundColor = `#${savedPalette[i]}`;
        mainColorBoxes[i].lastElementChild.innerText = `#${savedPalette[i]}`;
    }
}
