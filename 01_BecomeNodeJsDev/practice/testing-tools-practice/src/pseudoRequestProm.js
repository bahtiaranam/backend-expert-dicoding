const pseudoRequest = require('./pseudoRequest');
const { promisify } = require('util');
 
const pseudoRequestProm = promisify(pseudoRequest);
 
module.exports = pseudoRequestProm;
