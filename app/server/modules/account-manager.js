/* eslint-disable callback-return, standard/no-callback-literal */
/* eslint-disable-next-line no-shadow  */
const crypto = require('crypto');
const moment = require('moment');
const { MongoClient, ObjectID } = require('mongodb');

const { isNullish } = require('./common');

const guid = function () {
  /* eslint-disable no-bitwise */
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/gu, (c) => {
    const r = Math.random() * 16 | 0,
      v = c === 'x' ? r : r & 0x3 | 0x8;
    return v.toString(16);
  });
  /* eslint-enable no-bitwise */
};

/*
  private encryption & validation methods
*/

const generateSalt = function () {
  // eslint-disable-next-line max-len
  const set = '0123456789abcdefghijklmnopqurstuvwxyzABCDEFGHIJKLMNOPQURSTUVWXYZ';
  let salt = '';
  for (let i = 0; i < 10; i++) {
    const p = Math.floor(Math.random() * set.length);
    salt += set[p];
  }
  return salt;
};

const md5 = function (str) {
  return crypto.createHash('md5').update(str).digest('hex');
};

const saltAndHash = function (pass) {
  const salt = generateSalt();
  return salt + md5(pass + salt);
};

const validatePassword = function (plainPass, hashedPass) {
  const salt = hashedPass.substr(0, 10);
  const validHash = salt + md5(plainPass + salt);
  return hashedPass === validHash;
};

const getObjectId = function (id) {
  return new ObjectID(id);
};

/*
const listIndexes = function () {
  accounts.indexes(null, (e, indexes) => {
    // eslint-disable-next-line unicorn/no-for-loop
    for (let i = 0; i < indexes.length; i++) {
      console.log('index:', i, indexes[i]);
    }
  });
};
*/

class AccountManager {
  constructor (config) {
    this.config = config;
  }

  async connect () {
    const {
      DB_URL,
      DB_NAME
    } = this.config;

    try {
      const client = await MongoClient.connect(DB_URL, {
        useUnifiedTopology: true,
        useNewUrlParser: true
      });
      this.db = client.db(DB_NAME);
      this.accounts = this.db.collection('accounts');
      // index fields 'user' & 'email' for faster new account validation
      await this.accounts.createIndex({ user: 1, email: 1 });
      console.log(
        'mongo :: connected to database :: "' + DB_NAME + '"'
      );
    } catch (err) {
      console.log(err);
    }
    return this;
  }

  /*
    login validation methods
  */

  autoLogin (user, pass, callback) {
    this.accounts.findOne({ user }, (e, o) => {
      if (o) {
        o.pass === pass ? callback(o) : callback(null);
      } else {
        callback(null);
      }
    });
  }

  manualLogin (user, pass, callback) {
    this.accounts.findOne({ user }, (e, o) => {
      if (isNullish(o)) {
        callback('user-not-found');
      } else {
        const res = validatePassword(pass, o.pass);
        if (res) {
          callback(null, o);
        } else {
          callback('invalid-password');
        }
      }
    });
  }

  generateLoginKey (user, ipAddress, callback) {
    const cookie = guid();
    this.accounts.findOneAndUpdate({ user }, { $set: {
      ip: ipAddress,
      cookie
    } }, { returnOriginal: false }, (e, o) => {
      callback(cookie);
    });
  }

  validateLoginKey (cookie, ipAddress, callback) {
    // ensure the cookie maps to the user's last recorded ip address
    this.accounts.findOne({ cookie, ip: ipAddress }, callback);
  }

  generatePasswordKey (email, ipAddress, callback) {
    const passKey = guid();
    this.accounts.findOneAndUpdate({ email }, { $set: {
      ip: ipAddress,
      passKey
    }, $unset: { cookie: '' } }, { returnOriginal: false }, (e, o) => {
      if (!isNullish(o.value)) {
        callback(null, o.value);
      } else {
        callback(e || 'account not found');
      }
    });
  }

  validatePasswordKey (passKey, ipAddress, callback) {
    // ensure the passKey maps to the user's last recorded ip address
    this.accounts.findOne({ passKey, ip: ipAddress }, callback);
  }

  /*
    record insertion, update & deletion methods
  */
  addNewAccount (newData, callback) {
    this.accounts.findOne({ user: newData.user }, (e, o) => {
      if (o) {
        callback('username-taken');
      } else {
        this.accounts.findOne({ email: newData.email }, (_e, _o) => {
          if (_o) {
            callback('email-taken');
          } else {
            const hash = saltAndHash(newData.pass);
            newData.pass = hash;
            // append date stamp when record was created
            newData.date = moment().format('MMMM Do YYYY, h:mm:ss a');
            this.accounts.insertOne(newData, callback);
          }
        });
      }
    });
  }

  updateAccount (newData, callback) {
    const findOneAndUpdate = (data) => {
      const o = {
        name: data.name,
        email: data.email,
        country: data.country
      };
      if (data.pass) o.pass = data.pass;
      this.accounts.findOneAndUpdate(
        { _id: getObjectId(data.id) },
        { $set: o },
        { returnOriginal: false },
        callback
      );
    };
    if (newData.pass === '') {
      findOneAndUpdate(newData);
    } else {
      const hash = saltAndHash(newData.pass);
      newData.pass = hash;
      findOneAndUpdate(newData);
    }
  }

  updatePassword (passKey, newPass, callback) {
    const hash = saltAndHash(newPass);
    newPass = hash;
    this.accounts.findOneAndUpdate({ passKey }, {
      $set: { pass: newPass }, $unset: { passKey: '' }
    }, { returnOriginal: false }, callback);
  }

  /*
    account lookup methods
  */

  getAllRecords (callback) {
    this.accounts.find().toArray(
      (e, res) => {
        if (e) callback(e);
        else callback(null, res);
      }
    );
  }

  deleteAccount (id, callback) {
    this.accounts.deleteOne({ _id: getObjectId(id) }, callback);
  }

  deleteAllAccounts (callback) {
    this.accounts.deleteMany({}, callback);
  }
}

module.exports = AccountManager;
