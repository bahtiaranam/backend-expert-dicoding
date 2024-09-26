const URL_REGEX = /^https?:\/\/(www\.)?([a-z0-9]+)\.([a-z]{2,})(\/[a-z0-9]+)*$/;
 
function pseudoRequest(url, callback) {
  setTimeout(() => {
    if (!URL_REGEX.test(url)) {
      callback(new Error('invalid url'));
      return;
    }
    
    if (url.includes('error')) {
      callback(new Error('network error'));
      return;
    }
 
    callback(null, { data: 'some data' });
  }, 100);
}
 
 
module.exports = pseudoRequest;
