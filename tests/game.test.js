const fs = require('fs');
const { exec } = require('child_process');
const path = require('path');


const EXPECTED_LOG_PATH = path.join(__dirname, '../logs/expected.log');
const TEST_LOG_PATH = path.join(__dirname, '../logs/test.log');

// Функция для запуска игры с предопределенным вводом
const runGameWithInput = (callback) => {
    const command = `echo "100\nN\nN\n" | node ${path.join(__dirname, '../web/public/main.js')} > ${TEST_LOG_PATH}`;
    exec(command, callback);
};

// Сравнение логов
const compareLogs = () => {
    const expectedLog = fs.readFileSync(EXPECTED_LOG_PATH, 'utf8');
    const testLog = fs.readFileSync(TEST_LOG_PATH, 'utf8');


    console.log(expectedLog)
    console.log(testLog)

    return expectedLog === testLog;
};


describe('Тесты на поведение игры', () => {
    test('Игра ведет себя идентично оригиналу с предопределенными входными данными', (done) => {


        runGameWithInput((error) => {
            if (error) return done(error);

            const logsMatch = compareLogs();
            expect(logsMatch).toBe(true);
            done();
        });
    });

});
