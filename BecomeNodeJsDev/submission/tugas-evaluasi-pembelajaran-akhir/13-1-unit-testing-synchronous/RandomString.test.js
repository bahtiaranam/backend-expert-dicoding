const { generateRandomStringSync } = require("./utils");
const test = require('tape');


test('when given by invalid length, it should throw an error', (t) => {
    t.throws(() => generateRandomStringSync('not a number'));
    t.end();
});

test('when given length under 1, it should throw an error', (t) => {
    t.throws(() => generateRandomStringSync(0));
    t.end();
});

test('when given by a valid url, it should return a data object', (t) => {
    const data = generateRandomStringSync(5);
    t.notEqual(data, '', 'Generated string should not be empty');
    t.end();
});