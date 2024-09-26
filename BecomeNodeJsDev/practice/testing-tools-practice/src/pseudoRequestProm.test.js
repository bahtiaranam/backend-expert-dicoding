const test = require('tape');
const pseudoRequestProm = require('./pseudoRequestProm');
 
test('when given by invalid url, it should be rejected', async (t) => {
  try {
    await pseudoRequestProm('invalid url');
    t.ok(false);
  } catch (error) {
    t.ok(error);
  }
});
 
 
test('when given by "error" url, it should be rejected', async (t) => {
  try {
    await pseudoRequestProm('https://error.com');
    t.ok(false);
  } catch (error) {
    t.ok(error);
  }
});
 
 
test('when given by a valid url, it should be resolved with a data object', async (t) => {
  const data = await pseudoRequestProm('https://example.com');
  t.deepEqual(data, { data: 'some data' });
});
