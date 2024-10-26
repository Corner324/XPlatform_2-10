(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){

},{}],2:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],3:[function(require,module,exports){
(function (process){(function (){
// Функция для получения пользовательского ввода
function getUserInput(question) {
    return new Promise((resolve) => {
        if (typeof window !== 'undefined') {
            // Мы в браузере
            const answer = prompt(question);
            resolve(answer);
        } else {
            // Мы в Node.js
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

// Функция для генерации случайного числа в диапазоне [min, max]
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Функция для вывода вступления
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

// Функция для ввода ставки с валидацией
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

// Функция для генерации тайного числа и подсказки
function generateTargetNumber() {
    let baseNumber = randomInt(25, 34); // Тайное базовое число
    let targetNumber = randomInt(baseNumber, baseNumber * 2); // Само тайное число
    let deviationPercentage = randomInt(1, 15) / 100; // Отклонение в процентах
    let hint = Math.random() < 0.5 
        ? Math.floor(targetNumber - targetNumber * deviationPercentage)
        : Math.floor(targetNumber + targetNumber * deviationPercentage);
    return { targetNumber, hint };
}

// Функция для получения карты с ограничением
function getAllowanceCard() {
    return randomInt(2, 10); // Карта с ограничением — случайное число от 2 до 10
}

// Функция для добавления карт и проверки, не превысили ли лимит
async function drawCards(targetNumber, allowanceCard) {
    let total = 0;
    let cardCount = 0;
    while (true) {
        cardCount++;
        let card = randomInt(2, 10); // Получаем случайную карту
        total += card;
        console.log(`CARD #${cardCount} IS A ${card}. YOU ARE TRYING TO COME NEAR ${targetNumber}`);
        console.log(`YOUR TOTAL IS ${total}`);

        if (total > targetNumber) {
            console.log(`YOUR TOTAL IS OVER THE NUMBER ${targetNumber} AN AUTOMATIC LOSS!`);
            return false; // Проигрыш
        }

        // Спрашиваем игрока, хочет ли он продолжать брать карты
        let continueDrawing = await getUserInput("DO YOU WANT TO CONTINUE (Y/N)? ");
        if (continueDrawing.toUpperCase() !== 'Y') {
            break; // Игрок решил остановиться
        }
    }

    // Проверяем, попадает ли сумма в диапазон допустимого отклонения
    if (total >= targetNumber - allowanceCard && total <= targetNumber) {
        console.log(`YOU WIN!  THE NUMBER WAS ${targetNumber} YOUR GUESS TOTAL WAS ${total}`);
        console.log("WITHIN YOUR LIMIT CARD.");
        return true; // Победа
    } else {
        console.log(`YOU BLEW IT!  THE NUMBER WAS ${targetNumber}, OUTSIDE YOUR LIMIT BY ${Math.abs(targetNumber - allowanceCard - total)}`);
        return false; // Проигрыш
    }
}

// Основная функция игры
async function playGame() {
    let money = 200; // Стартовая сумма денег
    showIntro();

    while (money > 0) {
        let { targetNumber, hint } = generateTargetNumber(); // Генерируем тайное число и подсказку
        let allowanceCard = getAllowanceCard(); // Получаем карту с ограничением

        let bet = await getBet(money);
        console.log();
        console.log(`YOUR 'LUCKY LIMIT' CARD IS A ${allowanceCard}`);
        console.log(`YOU MUST COME WITHIN ${allowanceCard} WITHOUT GOING OVER TO WIN.`);
        console.log();
        console.log("HERE WE GO");
        console.log();

        // Тянем карты и проверяем результат
        let won = await drawCards(hint, allowanceCard);

        if (won) {
            money += bet; // Победа — добавляем ставку
        } else {
            money -= bet; // Проигрыш — вычитаем ставку
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

// Запускаем игру
playGame();

}).call(this)}).call(this,require('_process'))
},{"_process":2,"readline":1}]},{},[3]);
