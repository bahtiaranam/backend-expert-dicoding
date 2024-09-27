const test = require('tape');
const pseudoRequest = require('./pseudoRequest');
 
test('when given by invalid url, error argument should be not null', (t) => {
  pseudoRequest('invalid url', (error) => {
    t.ok(error);
    t.end();
  });
});
 
 
test('when given by "error" url, error argument should be not null', (t) => {
  pseudoRequest('https://error.com', (error) => {
    t.ok(error);
    t.end();
  });
});
 
 
test('when given by a valid url, error argument should be null and data object should be defined', (t) => {
  pseudoRequest('https://example.com', (error, data) => {
    t.equal(error, null);
    t.deepEqual(data, { data: 'some data' });
    t.end();
  });
});
