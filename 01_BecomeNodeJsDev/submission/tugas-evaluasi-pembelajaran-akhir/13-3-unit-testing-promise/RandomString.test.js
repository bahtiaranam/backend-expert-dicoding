const { generateRandomStringProm } = require("./utils");
const test = require('tape');


test('when given by invalid length, it should throw an error', async (t) => {
    try {
    await generateRandomStringProm('not a number');
    t.ok(false);
    } catch (error) {
    t.ok(error);
    }
});

test('when given length under 1, it should throw an error', async (t) => {
    try {
    await generateRandomStringProm(0);
    t.ok(false);
    } catch (error) {
    t.ok(error);
    }
});

test('when given by a valid url, it should return a data object', async (t) => {
    const data = await generateRandomStringProm(5);
    t.notEqual(data, '', 'Generated string should not be empty');
    t.end();
});