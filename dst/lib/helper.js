"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sleep_for = exports.randomMouseMove = exports.randomIntFromInterval = void 0;
exports.generatePassword = generatePassword;
// get random between min/max
const randomIntFromInterval = (min, max) => {
    return Math.floor(Math.random() * (max - min) + min);
};
exports.randomIntFromInterval = randomIntFromInterval;
let randomMouseMove = async (page) => {
    for (let i = 0; i < 10; i++) {
        await page.mouse.move((0, exports.randomIntFromInterval)(0, 10000), (0, exports.randomIntFromInterval)(0, 1000));
    }
    await (0, exports.sleep_for)(1000);
};
exports.randomMouseMove = randomMouseMove;
/**
 *
 * @param min: number
 * @param max: number
 */
let sleep_for = async (min, max) => {
    let sleep_duration = (0, exports.randomIntFromInterval)(min, max ?? min);
    console.log("waiting for ", sleep_duration / 1000, "seconds");
    await new Promise((r) => setTimeout(r, sleep_duration));
};
exports.sleep_for = sleep_for;
const specials = "!@#$%^&*_+:<>?|,.~";
const lowercase = "abcdefghijklmnopqrstuvwxyz";
const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const numbers = "0123456789";
const all = specials + lowercase + uppercase + numbers;
function generatePassword() {
    let password = "";
    password += pick(password, specials, 1, 3);
    password += pick(password, lowercase, 1, 3);
    password += pick(password, uppercase, 1, 3);
    password += pick(password, all, 10);
    return shuffle(password);
}
function pick(exclusions, string, min, max) {
    var n, chars = "";
    if (max === undefined) {
        n = min;
    }
    else {
        n = min + Math.floor(Math.random() * (max - min + 1));
    }
    var i = 0;
    while (i < n) {
        const character = string.charAt(Math.floor(Math.random() * string.length));
        if (exclusions.indexOf(character) < 0 && chars.indexOf(character) < 0) {
            chars += character;
            i++;
        }
    }
    return chars;
}
// Credit to @Christoph: http://stackoverflow.com/a/962890/464744
function shuffle(string) {
    var array = string.split("");
    var tmp, current, top = array.length;
    if (top)
        while (--top) {
            current = Math.floor(Math.random() * (top + 1));
            tmp = array[current];
            array[current] = array[top];
            array[top] = tmp;
        }
    return array.join("");
}
