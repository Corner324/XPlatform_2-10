function getUserInput(question) {
    return new Promise((resolve) => {
        if (typeof window !== 'undefined') {
            // Браузере
            const answer = prompt(question);
            resolve(answer);
        } else {
            // Node.js
            const readline = require('readline');
            const rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout
            });
            rl.question(question, (answer) => {
                resolve(answer);
                rl.close();
            });
        }
    });
}

// Генерируем случайное число
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Вызов вступления
function showIntro() {
    console.log(" ".repeat(28) + "TWO TO TEN");
    console.log(" ".repeat(15) + "CREATIVE COMPUTING  MORRISTOWN NEW JERSEY");
    console.log();
    console.log();
    console.log();
    console.log("WELCOME TO THE GAME OF TWO TO TEN.  THAT NAME COMES FROM THE");
    console.log("SPECIAL 'DECK OF CARDS' USED. THERE ARE NO FACE CARDS - ONLY");
    console.log("THE CARDS 2-10.  THIS GAME IS EASY AND FUN TO PLAY IF YOU");
    console.log("UNDERSTAND WHAT YOU ARE DOING SO READ THE INSTRUCTIONS");
    console.log("CAREFULLY.");
    console.log("AT THE START OF THE GAME, YOU BET ON WINNING. TYPE IN ANY");
    console.log("NUMBER BETWEEN 0 AND 200.  I THEN PICK A RANDOM NUMBER");
    console.log("YOU ARE TO REACH BY THE SUM TOTAL OF MORE CARDS CHOSEN.");
    console.log("BECAUSE OF THE RARE CHANCE OF YOU GETTING TO THAT NUMBER");
    console.log("EXACTLY, YOU ARE GIVEN AN ALLOWANCE CARD.  THE OBJECT OF");
    console.log("THE GAME OF TO GET THE TOTAL OF CARDS WITHIN THE MYSTERY");
    console.log("NUMBER WITHOUT GOING OVER.");
    console.log("YOU ARE GIVEN A HINT AS TO WHAT THE NUMBER IS.  THIS IS NOT");
    console.log("THE EXACT NUMBER ONLY ONE CLOSE. ALL YOU DO IN THIS GAME IS");
    console.log("DECIDE WHEN TO STOP.  AT THIS POINT YOUR TOTAL IS COMPARED");
    console.log("WITH THE NUMBER AND YOUR WINNINGS ARE DETERMINED.");
}

// Валидация ввода
async function getBet(currentMoney) {
    let bet;
    while (true) {
        bet = parseInt(await getUserInput(`PLACE YOUR BET ... YOU HAVE $${currentMoney} TO SPEND. `), 10);
        if (bet < 0) {
            console.log("YOU MAY NOT BET AGAINST YOURSELF.");
        } else if (bet > currentMoney) {
            console.log("YOU CAN'T BET MORE THAT YOU'VE GOT!");
        } else {
            break;
        }
    }
    return bet;
}

// Генерируем случайное число с подсказкой
function generateTargetNumber() {
    let baseNumber = randomInt(25, 34);
    let targetNumber = randomInt(baseNumber, baseNumber * 2); 
    let deviationPercentage = randomInt(1, 15) / 100;
    let hint = Math.random() < 0.5 
        ? Math.floor(targetNumber - targetNumber * deviationPercentage)
        : Math.floor(targetNumber + targetNumber * deviationPercentage);
    return { targetNumber, hint };
}

// Карта с ограничением
function getAllowanceCard() {
    return randomInt(2, 10);
}

// Проверка на превышение лимита
async function drawCards(targetNumber, allowanceCard) {
    let total = 0;
    let cardCount = 0;
    while (true) {
        cardCount++;
        let card = randomInt(2, 10);
        total += card;
        console.log(`CARD #${cardCount} IS A ${card}. YOU ARE TRYING TO COME NEAR ${targetNumber}`);
        console.log(`YOUR TOTAL IS ${total}`);

        if (total > targetNumber) {
            console.log(`YOUR TOTAL IS OVER THE NUMBER ${targetNumber} AN AUTOMATIC LOSS!`);
            return false;
        }

        // Спрашиваем игрока, хочет ли он продолжать брать карты
        let continueDrawing = await getUserInput("DO YOU WANT TO CONTINUE (Y/N)? ");
        if (continueDrawing.toUpperCase() !== 'Y') {
            break;
        }
    }

    // Проверка на победу
    if (total >= targetNumber - allowanceCard && total <= targetNumber) {
        console.log(`YOU WIN!  THE NUMBER WAS ${targetNumber} YOUR GUESS TOTAL WAS ${total}`);
        console.log("WITHIN YOUR LIMIT CARD.");
        return true;
    } else {
        console.log(`YOU BLEW IT!  THE NUMBER WAS ${targetNumber}, OUTSIDE YOUR LIMIT BY ${Math.abs(targetNumber - allowanceCard - total)}`);
        return false;
    }
}


async function playGame() {
    let money = 200;
    showIntro();

    while (money > 0) {
        let { targetNumber, hint } = generateTargetNumber();
        let allowanceCard = getAllowanceCard();

        let bet = await getBet(money);
        console.log();
        console.log(`YOUR 'LUCKY LIMIT' CARD IS A ${allowanceCard}`);
        console.log(`YOU MUST COME WITHIN ${allowanceCard} WITHOUT GOING OVER TO WIN.`);
        console.log();
        console.log("HERE WE GO");
        console.log();

        // Вытягивание карт
        let won = await drawCards(hint, allowanceCard);

        if (won) {
            money += bet; // Победа
        } else {
            money -= bet; // Проигрыш
        }

        console.log(`YOU NOW HAVE $${money} IN CASH TO BET IN THE NEXT GAME!`);

        if (money <= 0) {
            console.log("\x07YOU ARE BROKE!! YOU MAY NOT PLAY ANYMORE!!");
            break;
        }

        let playAgain = await getUserInput("WOULD YOU LIKE TO PLAY THE NEXT GAME (Y/N)? ");
        if (playAgain.toUpperCase() !== 'Y') {
            console.log("HOPE YOU HAD FUN.");
            break;
        }
    }
}


playGame();

module.exports = {
    randomInt,
    showIntro,
    getBet,
    generateTargetNumber,
    getAllowanceCard,
    drawCards,
    playGame
    };