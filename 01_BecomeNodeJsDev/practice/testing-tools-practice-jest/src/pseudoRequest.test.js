const pseudoRequest = require('./pseudoRequest');
 
describe('pseudoRequest function', () => {
  test('when given by invalid url, error argument should be not null', (done) => {
    pseudoRequest('invalid url', (error) => {
      expect(error).not.toBeNull();
      done();
    });
  });
 
 
  test('when given by "error" url, error argument should be not null', (done) => {
    pseudoRequest('https://error.com', (error) => {
      expect(error).not.toBeNull();
      done();
    });
  });
 
 
  test('when given by a valid url, error argument should be null and data object should be defined', (done) => {
    pseudoRequest('https://valid.com', (error, data) => {
      expect(error).toBeNull();
      expect(data).toEqual({ data: 'some data' });
      done();
    });
  });
});
