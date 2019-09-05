module.exports = {
    "env": {
      "es6": true
    },
    "settings": {
      "polyfills": [
      ]
    },
    "extends": ["ash-nazg/sauron", "plugin:node/recommended-script"],
    "globals": {
      "Atomics": "readonly",
      "SharedArrayBuffer": "readonly"
    },
    "parserOptions": {
      "ecmaVersion": 2018,
      "sourceType": "module"
    },
    "rules": {
      "import/no-commonjs": 0,
      "import/unambiguous": 0,
      "object-curly-spacing": ["error", "always"],
      "no-console": 0,
      "compat/compat": 0,

      // Reenable later as possible
      "promise/prefer-await-to-callbacks": 0
    }
};
