function getRandomHex() {
    return (Math.floor(Math.random() * 16777216).toString(16).padStart(6, 0));
}