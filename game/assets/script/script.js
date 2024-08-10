'use_strict';

async function sleep(ms) {
    return new Promise(r => setTimeout(r, ms));
}

/**
 * Increases the opacity of the cards,
 * waits for a few milliseconds,
 * and then decreases the opacity again.
 *
 * @param {Object[]} cards
 * @param {Boolean[]} lock
 * @param {Number} milliseconds
 */
async function showAndHide (cards, lock, milliseconds) {
    cards.forEach(card => getImage(card).style.opacity = '100%');
    await sleep(milliseconds);

    for (let i=0; i<cards.length; i++) {
        if (!lock[i]) {
            getImage(cards[i]).style.opacity = '0%';
        }
    }

}

function getImage(element) {
    return element.getElementsByTagName('img')[0];
}

/**
 * Shuffles the cards images.
 *
 * @param {Object[]} cards
 * @param {Boolean[]} lock
 */
function shuffle(cards, lock) {

    for (let i=0; i<cards.length; i++) {
        let randomNumber1 = generateRandomNumber(cards.length);
        let randomNumber2 = generateRandomNumber(cards.length);

        while (randomNumber1 == randomNumber2) {
            randomNumber1 = generateRandomNumber(cards.length);
            randomNumber2 = generateRandomNumber(cards.length);
        }

        while (lock[randomNumber1]) {
            randomNumber1 =  generateRandomNumber(cards.length);;
        }
        while (lock[randomNumber2]) {
            randomNumber2 =  generateRandomNumber(cards.length);
        }

        const aux = getImage(cards[randomNumber1]).src;
        getImage(cards[randomNumber1]).src = getImage(cards[randomNumber2]).src;
        getImage(cards[randomNumber2]).src = aux;
    }

}

/**
 * Shuffles the cards images and executes the show and hide.
 *
 * @param {Object[]} cards
 * @param {Boolean[]} lock
 */
async function reorder(cards, lock) {
    canPlay = false;
    await sleep(1200);
    shuffle(cards, lock);
    showAndHide(cards, lock, milliseconds);
    canPlay = true;
}

/**
 * Updates the color on the UI.
 */
function changeLayout() {
    document.getElementsByTagName('body')[0].style.backgroundColor = "#1a1919";
    document.getElementById('title').style.color = "#d2d233";
    cards.forEach(card => getImage(card).style.filter = 'brightness(100%)');
}

/**
 * Updates the score and matches on the UI.
 */
function updateScore() {
    let currentScore = Number(document.getElementById('score').textContent);
    let currentMatches = Number(document.getElementById('matches').textContent);

    document.getElementById('score').textContent = currentScore+=10;
    document.getElementById('matches').textContent = currentMatches+=1;
}

/**
 * Validates the received value by the `getNumberOfCards` function. 
 *
 * @param {Number} numberOfCards
 * @return {Boolean}
 */
function inputIsValid (numberOfCards) {
    const validation1 = numberOfCards % 2 === 0;
    const validation2 = numberOfCards >= 6 || numberOfCards <= 20;

    return validation1 && validation2
}

/**
 * Receives the input, checks if it is a default option and returns a number.
 *
 * @return {Number}
 */
function getNumberOfCards () {
    const input = prompt('Choose the number of cards (Press "OK" or "Enter" to default option): ');
    return input === '' ? 6 : Number(input)
}

/**
 * Adds an animal card in the HTML.
 *
 * @param {String} animal
 */
function generateAnimalCard (animal) {
    div = document.createElement('div');
    img = document.createElement('img');
    div.classList.add('card');
    img.src = `assets/images/${animal}.jpg`;
    img.style.width = '150px';
    img.style.height = '150px';
    div.appendChild(img);
    document.querySelector('.container-cards').appendChild(div);
}

/**
 * Generates a random integer number between 0 (inclusive) and the limit parameter (exclusive).
 *
 * @param {String} limit
 * @return {Number}
 */
function generateRandomNumber (limit) {
    return Math.trunc(Math.random() * limit)
}

/**
 * An object mapping the number of cards chosen
 * to the number of milisseconds required to display the cards.
 *
 */
const getMilisseconds = {
    6: 480,
    8: 1100,
    10: 1800,
    12: 2500,
    14: 2500,
    16: 2800,
    18: 3500,
    20: 3500
}

let numberOfCards = getNumberOfCards();
let milliseconds; 

while (!inputIsValid(numberOfCards)) {
    alert('Please, choose an even number between 6 and 20. (ex.: 6, 8, 10, 12, 14, 16, 18, 20)');
    numberOfCards = getNumberOfCards();
}

milliseconds = getMilisseconds[numberOfCards];

// If the numbers of cards chosen is greater than 6, then creates new cards of random animals.
if (numberOfCards > 6) {
    let quantity = numberOfCards - 6;
    const animals = ['bird', 'butterfly', 'deer', 'elephant', 'frog'];
    let index = generateRandomNumber(animals.length);
    let count = 0;

    for (let i=0; i<quantity; i++) {
        count++;
        generateAnimalCard(animals[index]);

        if (count == 2) {
            let aux = index;
            index = generateRandomNumber(animals.length);

            while (aux === index) {
                index = generateRandomNumber(animals.length);
            }

            count = 0;
        }
    }
}

// If the numbers of cards is greater than or equal to 10, decreases the cards size.
if (numberOfCards >= 10) {
    const cards = document.querySelectorAll('.card');
    const images = document.querySelectorAll('img');

    cards.forEach(card => {
        card.style.width = '100px';
        card.style.height = '100px';
    });

    images.forEach(image => {
        image.style.width = '100%';
        image.style.height = '100%';
    });
}

// Initialize the main variables.
const cards = document.querySelectorAll('.card');
const lock = Array(cards.length).fill(false)
let selected = [];
let won = false;
let canPlay = false;

shuffle(cards, lock);
// Hides the cards images.
showAndHide(cards, lock, milliseconds);
canPlay = true;

for(let i=0; i<cards.length; i++) {

    cards[i].addEventListener('click', function() {
        if (!lock[i] && canPlay) {

            // Shows the card's image.
            getImage(this).style.opacity = '100%';

            // Saves the index of the chosen card.
            selected.push(i);

            if (selected.length == 2) {
                const image1 = getImage(cards[selected[0]]);
                const image2 = getImage(cards[selected[1]]);

                // If the two selected cards are different but they have the same image...
                if ((selected[0] != selected[1]) && image1.src == image2.src) {
                    image1.style.filter = 'brightness(70%)';
                    image2.style.filter = 'brightness(70%)';

                    // Locks the two chosen cards.
                    lock[selected[0]] = true;
                    lock[selected[1]] = true;

                    selected = [];
                    updateScore();
                }
                else {
                    reorder(cards, lock);
                    selected = [];
                }
            }

            // Verifies wether the player won the game.

            let count = lock.filter(lockedCard => lockedCard === true).length

            if (count == cards.length - 2) {
                won = true;
            }

            if (won) {
                updateScore();
                canPlay = false;
                for (let i=0; i<cards.length; i++) {
                    getImage(cards[i]).style.opacity = '100%';
                }
                changeLayout();
            }

        }
        
    });
}


