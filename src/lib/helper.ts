// Helper
import puppeteer, { Locator, Page } from "puppeteer";

// get random between min/max
export const randomIntFromInterval = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min) + min);
};

export let randomMouseMove = async (page: Page) => {
  for (let i = 0; i < 10; i++) {
    await page.mouse.move(
      randomIntFromInterval(0, 10000),
      randomIntFromInterval(0, 1000)
    );
  }
  await sleep_for(1000);
};

/**
 *
 * @param min: number
 * @param max: number
 */
export let sleep_for = async (min: number, max?: number) => {
  let sleep_duration = randomIntFromInterval(min, max ?? min);
  console.log("waiting for ", sleep_duration / 1000, "seconds");
  await new Promise((r) => setTimeout(r, sleep_duration));
};

const specials = "!@#$%^&*_+:<>?|,.~";
const lowercase = "abcdefghijklmnopqrstuvwxyz";
const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const numbers = "0123456789";

const all = specials + lowercase + uppercase + numbers;

export function generatePassword() {
  let password = "";

  password += pick(password, specials, 1, 3);
  password += pick(password, lowercase, 1, 3);
  password += pick(password, uppercase, 1, 3);
  password += pick(password, all, 10);

  return shuffle(password);
}

function pick(exclusions: string, string: string, min: number, max?: number) {
  var n,
    chars = "";

  if (max === undefined) {
    n = min;
  } else {
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
function shuffle(string: string) {
  var array = string.split("");
  var tmp,
    current,
    top = array.length;

  if (top)
    while (--top) {
      current = Math.floor(Math.random() * (top + 1));
      tmp = array[current];
      array[current] = array[top];
      array[top] = tmp;
    }

  return array.join("");
}
