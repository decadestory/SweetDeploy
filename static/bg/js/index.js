'use strict';

function random(arr) {
    return arr[Math.floor(arr.length * Math.random())];
}

var ALPHABET = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'];

function randomHex(length) {
    var string = '';

    for (var i = 0; i < length; i++) {
        string += random(ALPHABET);
    }

    return string;
}

function genColors(string) {
    var colors = [];

    for (var i = 0; i < string.length - 5; i += 1) {
        colors.push(string.slice(i, i + 6));
    }

    return colors;
}

function createGradient(colors) {
    var colorStrings = colors.map(function (color) {
        return '#' + color;
    });
    return ['135deg'].concat(colorStrings).join(', ');
}

function updateElement(elem) {
    var hex = randomHex(7);
    var colors = genColors(hex);
    elem.style.background = 'linear-gradient(' + createGradient(colors) + ')';
    //elem.innerText = hex;

    return elem;
}

var elem = document.querySelector('.colors');

updateElement(elem);

elem.addEventListener('click', function (e) {
    return updateElement(e.target);
});