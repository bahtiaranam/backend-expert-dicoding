const URL_REGEX = /^https?:\/\/(www\.)?([a-z0-9]+)\.([a-z]{2,})(\/[a-z0-9]+)*$/;
 
function pseudoRequestSync(url) {  
  if (!URL_REGEX.test(url)) {
    throw new Error('invalid url');
  }
 
  if (url.includes('error')) {
    throw new Error('network error');
  }
 
  return { data: 'some data' };
}
 
module.exports = pseudoRequestSync;
