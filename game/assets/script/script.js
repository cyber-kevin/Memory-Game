'use_strict';

async function sleep(ms) {
    return new Promise(r => setTimeout(r, ms));
}

async function showAndHide() {
    await sleep(1000);
    cards.forEach(card => getImage(card).style.opacity = '0%');
}

function getImage(element) {
    return element.getElementsByTagName('img')[0];
}

function shuffle() {
    let randomNumber = Math.trunc((Math.random() * (cards.length - 1 )));
    let anotherRandomNumber = Math.trunc((Math.random() * (cards.length - 1 )));

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

async function reorder() {
    canPlay = false;
    await sleep(700);
    getImage(cards[selected[0]]).style.opacity = '0%';
    getImage(cards[selected[1]]).style.opacity = '0%';
    selected = [];
    await sleep(500);
    shuffle();
    canPlay = true;
}

function changeLayout() {
    document.getElementsByTagName('body')[0].style.backgroundColor = "#1a1919";
    document.getElementById('title').style.color = "#d2d233";
}

numberOfCards = prompt('Choose the number of cards (Press "OK" to default option): ');

if (numberOfCards != 6) {

    let quantity = numberOfCards - 6;
    const animals = ['bird', 'elephant', 'frog'];
    let pos = Math.trunc(Math.random() * 3);
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
            pos = Math.trunc(Math.random() * 3);
            count = 0;
        }
    }
}


while (numberOfCards % 2 != 0 || numberOfCards == null) {
    alert('Please, choose a even number. (ex.: 6, 8, 10, 12...)');
    numberOfCards = prompt('Choose the number of cards (Default is 6): ');
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
showAndHide();
canPlay = true;

for(let i=0; i<cards.length; i++) {

    cards[i].addEventListener('click', function() {
        if (!lock[i] && canPlay) {

            // Show the card image
            getImage(this).style.opacity = '100%';
            selected.push(i);

            if (selected.length == 2) {
                // If the two cards selected are different but they have the same image...
                if ((selected[0] != selected[1]) && getImage(cards[selected[0]]).src == getImage(cards[selected[1]]).src) {
                    lock[selected[0]] = true;
                    lock[selected[1]] = true;
                    selected = [];
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
                canPlay = false;
                for (let i=0; i<cards.length; i++) {
                    getImage(cards[i]).style.opacity = '100%';
                }
                changeLayout();
            }

        }
        
    });
}


