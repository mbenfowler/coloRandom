var savedPalettes = [];
var currentPalette = [];
var shouldDelete = false;

var main = document.querySelector('main');
var savedContainer = document.querySelector('.save-container')
var buttonSection = document.querySelector('.button-area');
var newPaletteButton = document.querySelector('button');
var mainColorBoxes = document.querySelectorAll('.color-container');
var lockButton = document.querySelector('.main-display');
var savedPalettesSection = document.querySelector('.mini-palettes')
var deleteModal = document.querySelector('.modal-window')
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

savedPalettesSection.addEventListener('click', async function(event) {
    if(event.target.classList.contains('delete-button')) {
        modalClassToggler()
        await getPromiseFromEvent(deleteModal, 'click')
        if(shouldDelete) {
            var eventTargetParent = event.target.parentNode
            var thisSavedPaletteIndex = Array.from(eventTargetParent.parentNode.children).indexOf(eventTargetParent);
            deletePalette(eventTargetParent, thisSavedPaletteIndex);
        } 
        modalClassToggler()
        shouldDelete = false;
    } else if(event.target.classList.contains('mini-box')) {
        displayMainColours(getSavedPalette(event));
    }
});

function getPromiseFromEvent(element, listenerName) {
    return new Promise(function (resolve) {
        function listener(event) {
            if(event.target.classList.contains('modal-exit-button')) {
                shouldDelete = false;
            } else if(event.target.nodeName === 'BUTTON') {
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
    var oldHexes = currentPalette;
    currentPalette = [];
    var newColor;
    for(var i = 0; i < mainDisplayedColors.length; i++) {
        var thisColorBoxLock = mainDisplayedColors[i].firstElementChild.firstElementChild;
        if(thisColorBoxLock.classList.contains('unlocked')) {
            newColor = getRandomHex();
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
    return (Math.floor(Math.random() * 16777216).toString(16).padStart(6, 0)).toUpperCase();
}

function savePalette() {
    if (!savedPalettes.length) {
        paragraph.classList.add('hidden');
    } 
    if (isPaletteUnique(savedPalettes, currentPalette)) {
        savedPalettes.push(currentPalette)
        addPaletteToSavedPalettes(currentPalette);
    }
    getNewHexes(mainColorBoxes);
}

function isPaletteUnique(palettesList, singlePalette) {
    for (var i = 0; i < palettesList.length; i++) {
        console.log('isPaletteUnique', i);
        if (areArraysEquivalent(palettesList[i], singlePalette)) {
            return false;
        } 
    }
    return true;   
}    

function areArraysEquivalent(array1, array2) {
    for (var i = 0; i < array1.length; i++) {
        console.log('areArraysEquivalent', i);
        if (array1[i] !== array2[i]) {
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
    for (var i = 0; i < palette.length; i++) {
        newMiniContainer.innerHTML += `<div class="mini-box", style="background-color: #${palette[i]}"></div>`
    }
    newMiniContainer.innerHTML += `<img class="delete-button" src='./assets/delete.png'></img>`
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
    for(var i = 0; i < rgbNumbers.length; i++) {
        rgbToHexString += rgbNumbers[i].toString(16).padStart(2, 0)
    }

    return rgbToHexString.toUpperCase();
}  

function displayMainColours(savedPalette) {
    currentPalette = savedPalette;
    for (var i = 0; i < savedPalette.length; i++) {
        mainColorBoxes[i].firstElementChild.style.backgroundColor = `#${savedPalette[i]}`;
        mainColorBoxes[i].lastElementChild.innerText = `#${savedPalette[i]}`;
    }
}
