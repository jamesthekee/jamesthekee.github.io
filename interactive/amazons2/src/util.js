"use strict";
const DIRECTIONS = [
    [1, 0], [0, 1], [-1, 0], [0, -1],
    [1, 1], [-1, -1], [1, -1], [-1, 1]
];
function sign(x) {
    if (x === 0)
        return 0;
    if (x < 0)
        return -1;
    return 1;
}
var max = Math.max;
var min = Math.min;
var abs = Math.abs;
/* Randomize array in-place using Durstenfeld shuffle algorithm */
function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}
function takeNRandom(array, count) {
    let end = min(array.length, count);
    for (var i = 0; i < end; i++) {
        var j = i + Math.floor(Math.random() * (array.length - i));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    array.splice(end);
}
