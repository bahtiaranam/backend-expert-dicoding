const test = require('tape');
const pseudoRequestSync = require('./pseudoRequestSync');
 
test('when given by invalid url, it should throw an error', (t) => {
  t.throws(() => pseudoRequestSync('invalid url'));
  t.end();
});
 
test('when given by "error" url, it should throw an error', (t) => {
  t.throws(() => pseudoRequestSync('https://error.com'));
  t.end();
});
 
test('when given by a valid url, it should return a data object', (t) => {
  const data = pseudoRequestSync('https://example.com');
  t.deepEqual(data, { data: 'some data' });
  t.end();
});
