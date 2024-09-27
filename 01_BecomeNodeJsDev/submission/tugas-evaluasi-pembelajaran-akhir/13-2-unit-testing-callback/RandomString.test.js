const { generateRandomString } = require("./utils");
const test = require('tape');


test('when given by invalid length, it should throw an error', (t) => {
    // t.throws(() => generateRandomString('not a number'));
    // t.end();
    generateRandomString('not a number', (error) => {
        t.ok(error);
        t.end();
      });
});

test('when given length under 1, it should throw an error', (t) => {
    // t.throws(() => generateRandomString(0));
    // t.end();
    generateRandomString(0, (error) => {
        t.ok(error);
        t.end();
      });
});

test('when given by a valid url, it should return a data object', (t) => {
    // const data = generateRandomString(5);
    // t.notEqual(data, '', 'Generated string should not be empty');
    // t.end();
    generateRandomString(5, (error, data) => {
        t.equal(error, null);
        t.notEqual(data, '', 'Generated string should not be empty');
    t.end();
      });
});