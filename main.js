var savedPalettes = [];
var currentPalette = {};
var shouldDelete = false;

var main = document.querySelector('main');
var paletteName = document.getElementById('paletteName')
var savedContainer = document.querySelector('.save-container');
var buttonSection = document.querySelector('.button-area');
var newPaletteButton = document.querySelector('button');
var mainColorBoxes = document.querySelectorAll('.color-container');
var lockButton = document.querySelector('.main-display');
var savedPalettesSection = document.querySelector('.mini-palettes');
var saveModal = document.getElementById('namePaletteModal');
var saveModalText = document.getElementById('saveModalText');
var saveModalInput = document.querySelector('input');
var saveModalButtonArea = document.getElementById('confirmSaveButtonArea');
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
        modalClassToggler([[deleteModal, 'hidden'], [main, 'block'], [savedContainer, 'block']]);
        await getPromiseFromEvent(deleteModal);
        if (shouldDelete) {
            var eventTargetParent = event.target.parentNode.parentNode;
            var thisSavedPaletteIndex = Array.from(eventTargetParent.parentNode.children).indexOf(eventTargetParent);
            deletePalette(eventTargetParent, thisSavedPaletteIndex);
        } 
        modalClassToggler([[deleteModal, 'hidden'], [main, 'block'], [savedContainer, 'block']]);
        shouldDelete = false;
    } else if (event.target.classList.contains('mini-box')) {
        displayMainColours(getSavedPalette(event.target));
    }
});

function getPromiseFromEvent(event) {
    return new Promise(function (resolve) {
        event.addEventListener('click', listener);
        function listener(event) {
            if (event.target.classList.contains('modal-exit-button')) {
                shouldDelete = false;
                resolve(event);
            } else if (event.target.classList.contains('confirm-delete-palette-button')) {
                shouldDelete = true;
                resolve(event);
            }
        };
    });
}

function modalClassToggler(elementsClasses) {
    for (var i = 0; i < elementsClasses.length; i++) {
        elementsClasses[i][0].classList.toggle(elementsClasses[i][1]);
    }
}

function getNewHexes(mainDisplayedColors) {
    paletteName.classList.add('hidden');
    var oldHexes = currentPalette.hexes;
    currentPalette = {
        hexes: [],
        name: ''
    };
    var newColor;
    for(var i = 0; i < mainDisplayedColors.length; i++) {

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
    modalClassToggler([[saveModal, 'hidden'], [main, 'block'], [savedContainer, 'block']]);
    if (!savedPalettes.length) {
        paragraph.classList.add('hidden');
    } 
    if (isPaletteUnique(savedPalettes, currentPalette)) {
        await getPromiseFromEvent2(confirmSaveButtonArea, 'click');
        savedPalettes.push(currentPalette);
        addPaletteToSavedPalettes(currentPalette);
    }
    modalClassToggler([[saveModal, 'hidden'], [main, 'block'], [savedContainer, 'block']]);
    getNewHexes(mainColorBoxes);
}

function getPromiseFromEvent2(element, listenerName) {
    return new Promise(function (resolve) {
        async function listener(event) {
            if (event.target.classList.contains('confirm-save-palette-button')) {
                currentPalette.name = saveModalInput.value;
                saveModalInput.value = ''
            }
            if (currentPalette.name.length && !isPaletteNameUnique(currentPalette.name)) {
                saveModalText.innerText = 'Name already taken! Name this palette something else?';
                saveModalText.setAttribute('id', 'validation');
                saveModalText.style.fontStyle = 'italic';
                await getPromiseFromEvent2(confirmSaveButtonArea, 'click');
            }
            resolve(event);
            element.removeEventListener(listenerName, listener);
        };
        element.addEventListener(listenerName, listener);
    });
}

function isPaletteUnique(savedPalettes, currentPalette) {
    var isUnique = true;
    for (var i = 0; i < savedPalettes.length; i++) {
        if (arePalettesEquivalent(savedPalettes[i].hexes, currentPalette.hexes)) {
            isUnique = false;
        }
    }
    return isUnique;
}

function arePalettesEquivalent(savedPaletteToCheck, currentPalette) {
    for (var i = 0; i < savedPaletteToCheck.length; i++) {
        if (savedPaletteToCheck[i] !== currentPalette[i]) {
            return false;
            break;
        }
    }
    return true;
}

function isPaletteNameUnique(name) {
    var matches = true;
    for (var i = 0; i < savedPalettes.length; i++) {
        if (savedPalettes[i].name === name) {
            matches = false;
            break;
        }
    }
    return matches;
}

function deletePalette(savedPalette, savedPalettesIndex) {
    savedPalettes.splice(savedPalettesIndex, 1);
    savedPalette.remove();
    paletteName.classList.add('hidden');
    if (!savedPalettes.length) {
        paragraph.classList.remove('hidden');
    }
}

function addPaletteToSavedPalettes(palette) {
    var newMiniContainer = document.createElement('div');
    var newMiniColorsContainer = document.createElement('div');
    var newHoverContainer = document.createElement('div');

    newMiniContainer.classList.add('mini-container');
    newHoverContainer.classList.add('hover');
    newMiniColorsContainer.classList.add('hover', 'mini-colors');
    
    savedPalettesSection.appendChild(newMiniContainer);    
    newMiniContainer.appendChild(newMiniColorsContainer);

    for (var i = 0; i < palette.hexes.length; i++) {
        newMiniColorsContainer.innerHTML += `<div class="mini-box", style="background-color: #${palette.hexes[i]}"></div>`;
    }

    newMiniContainer.appendChild(newHoverContainer);
    newHoverContainer.innerHTML += `<img class="delete-button" src='./assets/delete.png'></img>`;
}

function getSavedPalette(eventTarget) {
    var eventTargetParent = eventTarget.parentNode.parentNode;
    var thisSavedPaletteIndex = Array.from(eventTargetParent.parentNode.children).indexOf(eventTargetParent);
    var thisSavedPalette = savedPalettes[thisSavedPaletteIndex];
    return thisSavedPalette;
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
    if (currentPalette.name.length) {
        paletteName.innerText = `palette name: "${currentPalette.name}"`;
        paletteName.classList.remove('hidden');
    } else {
        paletteName.classList.add('hidden');
    }
    
    for (var i = 0; i < currentPalette.hexes.length; i++) {
        mainColorBoxes[i].firstElementChild.style.backgroundColor = `#${currentPalette.hexes[i]}`;
        mainColorBoxes[i].lastElementChild.innerText = `#${currentPalette.hexes[i]}`;
    }
}
