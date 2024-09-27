/**
 * @TODO
 * Buatlah fungsi `createBase64TransformStream` yang mengonversi data yang masuk menjadi base64.
 */

const { Transform } = require('stream');

const  createBase64TransformStream = () => {
  return new Transform({
    transform(chunk, encoding, callback) {
      callback(null, Buffer.from(chunk).toString('base64'));
    }
  });
}
