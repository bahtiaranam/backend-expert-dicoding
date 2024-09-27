const pseudoRequestSync = require('./pseudoRequestSync');
 
describe('pseudoRequestSync function', () => {
  test('when given by invalid url, it should throw an error', () => {
    expect(() => pseudoRequestSync('invalid url')).toThrow();
  });
 
  test('when given by "error" url, it should throw an error', () => {
    expect(() => pseudoRequestSync('https://error.com')).toThrow();
  });
 
  test('when given by a valid url, it should return a data object', () => {
    expect(pseudoRequestSync('https://valid.com')).toEqual({ data: 'some data' });
  });
});
