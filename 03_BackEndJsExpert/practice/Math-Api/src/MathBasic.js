const MathBasic = {
    add: (...args) => {
        if (args.length !== 2) {
            throw new Error('fungsi hanya menerima dua parameter');
        }

        const [a, b] = args;

        if (typeof a !== 'number' || typeof b !== 'number') {
        throw new Error('fungsi hanya menerima parameter number');
        }

        return a + b;
      },
    subtract: (...args) => {
        const [a, b] = args;
        return a - b;
    },
    multiply: (...args) => {
        const [a, b] = args;

        return a * b;
    },
    divide: (...args) => {
        const [a, b] = args;

        return a / b;
    },
  };
   
  module.exports = MathBasic;
  