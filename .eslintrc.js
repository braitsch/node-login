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
      "object-curly-spacing": ["error", "always"],

      "import/no-commonjs": 0,
      "import/unambiguous": 0,

      // Browser only
      "compat/compat": 0,

      "no-console": 0
    }
};
