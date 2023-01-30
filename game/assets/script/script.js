'use_strict';

async function sleep(ms) {
    return new Promise(r => setTimeout(r, ms));
}

const showAndHide = async function(milliseconds) {
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

function shuffle() {

    for (let i=0; i<cards.length; i++) {
        let randomNumber = Math.trunc((Math.random() * (cards.length - 1 )));
        let anotherRandomNumber = Math.trunc((Math.random() * (cards.length - 1 )));

        while (randomNumber == anotherRandomNumber) {
            randomNumber = Math.trunc((Math.random() * (cards.length - 1 )));
            anotherRandomNumber = Math.trunc((Math.random() * (cards.length - 1 )));
        }

        while (lock[randomNumber]) {
            randomNumber =  Math.trunc((Math.random() * (cards.length - 1 )));;
        }
        while (lock[anotherRandomNumber]) {
            anotherRandomNumber =  Math.trunc((Math.random() * (cards.length - 1 )));
        }

        const aux = getImage(cards[randomNumber]).src;
        getImage(cards[randomNumber]).src = getImage(cards[anotherRandomNumber]).src;
        getImage(cards[anotherRandomNumber]).src = aux;
    }

}

async function reorder() {
    canPlay = false;
    await sleep(700);
    selected = [];
    await sleep(500);
    shuffle();
    showAndHide(milliseconds);
    canPlay = true;
}

function changeLayout() {
    document.getElementsByTagName('body')[0].style.backgroundColor = "#1a1919";
    document.getElementById('title').style.color = "#d2d233";
    cards.forEach(card => getImage(card).style.filter = 'brightness(100%)');
}

function updateScore() {
    score+=10;
    matches+=1;
    document.getElementById('matches').textContent = matches;
    document.getElementById('score').textContent = score;
}

let score = Number(document.getElementById('score').textContent);
let matches = Number(document.getElementById('matches').textContent);
let numberOfCards = prompt('Choose the number of cards (Press "OK" or "Enter" to default option): ');
let milliseconds; 

if (numberOfCards === '') {
    numberOfCards = 6;
}

while (numberOfCards % 2 != 0 || (numberOfCards < 6 || numberOfCards > 20) || numberOfCards == null) {
    alert('Please, choose a even number between 6 and 20. (ex.: 6, 8, 10, 12, 14, 16, 18, 20)');
    numberOfCards = prompt('Choose the number of cards (Press "OK" or "Enter" to default option): ');

    if (numberOfCards === '') {
        numberOfCards = 6;
    }
}

numberOfCards = Number(numberOfCards);

switch (numberOfCards) {
    case 6:
        milliseconds = 480;
        break;
    case 8:
        milliseconds = 1100;
        break;
    case 10:
        milliseconds = 1800;
        break;
    case 12:
    case 14:
        milliseconds = 2500;
        break;
    case 16:
        milliseconds = 2800;
        break;
    case 18:
    case 20:
        milliseconds = 3500;
        break;
}

if (numberOfCards != 6) {

    let quantity = numberOfCards - 6;
    const animals = ['bird', 'butterfly', 'deer', 'elephant', 'frog',];
    let pos = Math.trunc(Math.random() * (animals.length - 1));
    console.log('pos: ' + pos);
    let count = 0;

    for (let i=0; i<quantity; i++) {
        count++;
        div = document.createElement('div');
        img = document.createElement('img');
        div.classList.add('card');
        img.src = `assets/images/${animals[pos]}.jpg`;
        img.style.width = '150px';
        img.style.height = '150px';
        div.appendChild(img);
        document.querySelector('.container-cards').appendChild(div);

        if (count == 2) {
            let aux = pos;
            pos = Math.trunc(Math.random() * (animals.length - 1));

            while (aux === pos) {
                pos = Math.trunc(Math.random() * (animals.length - 1));
            }

            count = 0;
        }
    }
}

if (numberOfCards >= 10) {
    const cards = document.querySelectorAll('.card');
    const images = document.querySelectorAll('img');

    cards.forEach(card => {
        card.style.width = '100px';
        card.style.height = '100px';
    });

    images.forEach(image => {
        image.style.width = '100px';
        image.style.height = '100px';
    });
}

const cards = document.querySelectorAll('.card');
const lock = [];
for (let i=0; i<cards.length; i++) {
    lock.push(false);
}
let selected = [];
let win = false;
let canPlay = false;

shuffle();
// Hide the cards images
showAndHide(milliseconds);
canPlay = true;

for(let i=0; i<cards.length; i++) {

    cards[i].addEventListener('click', function() {
        if (!lock[i] && canPlay) {

            // Show the card image
            getImage(this).style.opacity = '100%';
            selected.push(i);

            if (selected.length == 2) {
                const image1 = getImage(cards[selected[0]]);
                const image2 = getImage(cards[selected[1]]);
                // If the two cards selected are different but they have the same image...
                if ((selected[0] != selected[1]) && image1.src == image2.src) {
                    image1.style.filter = 'brightness(70%)';
                    image2.style.filter = 'brightness(70%)';
                    lock[selected[0]] = true;
                    lock[selected[1]] = true;
                    selected = [];
                    updateScore();
                }
                else {
                    reorder();
                }
            }

            // Verify if the player won the game
            let count = 0;

            for (let i=0; i<cards.length; i++) {
                if (lock[i]) {
                    count++;
                }
            }

            if (count == cards.length - 2) {
                win = true;
            }

            if (win) {
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


