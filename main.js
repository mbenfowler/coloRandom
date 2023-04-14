var savedPalettes = [];
var currentPalette = [];

var buttonSection = document.querySelector('.button-area');
var newPaletteButton = document.querySelector('button');

var mainColorBoxes = document.querySelectorAll('.color-container');
var lockButton = document.querySelector('.main-display');
var savedPalettesSection = document.querySelector('.mini-palettes')
var p = document.querySelector('p')
var deleteModal = document.querySelector('.modal-window')

window.addEventListener('load', getNewHexes);

lockButton.addEventListener('click', function(event) {
    if (event.target.classList.contains('lock-box')) {
        toggleLock(event.target);
    }
});

buttonSection.addEventListener('click', function(event) {
    if(event.target.classList.contains('new-palette')) {
        getNewHexes();
    }
});

buttonSection.addEventListener('click', function(event) {
    if(event.target.classList.contains('save-palette')) {
        savePalette();
    }
});


var shouldDelete = false;
savedPalettesSection.addEventListener('click', async function(event) {
    if(event.target.classList.contains('delete-button')) {
        deleteModal.classList.toggle('hidden');
        await getPromiseFromEvent(deleteModal, 'click')
        if(shouldDelete) {
            var eventTargetParent = event.target.parentNode
            var thisSavedPaletteIndex = Array.from(eventTargetParent.parentNode.children).indexOf(eventTargetParent);
            deletePalette(eventTargetParent, thisSavedPaletteIndex);
        }
        deleteModal.classList.toggle('hidden');
        shouldDelete = false;
    }
});

function getPromiseFromEvent(element, listenerName) {
    return new Promise(function (resolve) {
        var listener = event => {
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

function toggleLock(event) {
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

function savePalette() {
    savedPalettes.push(currentPalette)
    displaySavedPalettesSection();
    getNewHexes();
}

function deletePalette(savedPalette, savedPalettesIndex) {
    savedPalettes.splice(savedPalettesIndex, 1);
    savedPalette.remove();
}

function displaySavedPalettesSection() {
    savedPalettesSection.innerHTML = '';
    if (!savedPalettes.length) {
        p.classList.remove('hidden');
    } else {
        p.classList.add('hidden');
        for (i = 0; i < savedPalettes.length; i++) {
            savedPalettesSection.innerHTML += `
                <div class="mini-container">
                    <div class="mini-box" style="background-color: #${savedPalettes[i][0]}"></div>
                    <div class="mini-box" style="background-color: #${savedPalettes[i][1]}"></div>
                    <div class="mini-box" style="background-color: #${savedPalettes[i][2]}"></div>
                    <div class="mini-box" style="background-color: #${savedPalettes[i][3]}"></div>
                    <div class="mini-box" style="background-color: #${savedPalettes[i][4]}"></div>
                    <img class="delete-button" src='./assets/delete.png'></img>
                </div>
            `
        };
    }
}