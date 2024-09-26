const pseudoRequestProm = require('./pseudoRequestProm');
 
describe('pseudoRequestProm function', () => {
  test('when given by invalid url, it should be rejected', async () => {
    await expect(pseudoRequestProm('invalid url')).rejects.toThrow();
  });
 
 
  test('when given by "error" url, it should be rejected', async () => {
    await expect(pseudoRequestProm('https://error.com')).rejects.toThrow();
  });
 
 
  test('when given by a valid url, it should be resolved with a data object', async () => {
    await expect(pseudoRequestProm('https://valid.com')).resolves.toEqual({ data: 'some data' });
  });
})
