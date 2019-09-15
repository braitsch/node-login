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

  async autoLogin (user, pass) {
    try {
      const o = await this.accounts.findOne({ user });
      return o.pass === pass ? o : null;
    } catch (err) {
      return null;
    }
  }

  async manualLogin (user, pass) {
    let o;
    try {
      o = await this.accounts.findOne({ user });
    } catch (err) {}
    if (isNullish(o)) {
      throw new Error('user-not-found');
    }
    const res = validatePassword(pass, o.pass);
    if (res) {
      return o;
    }
    throw new Error('invalid-password');
  }

  async generateLoginKey (user, ipAddress) {
    const cookie = guid();
    await this.accounts.findOneAndUpdate({ user }, { $set: {
      ip: ipAddress,
      cookie
    } }, { returnOriginal: false });
    return cookie;
  }

  // eslint-disable-next-line require-await
  async validateLoginKey (cookie, ipAddress) {
    // ensure the cookie maps to the user's last recorded ip address
    return this.accounts.findOne({ cookie, ip: ipAddress });
  }

  async generatePasswordKey (email, ipAddress) {
    const passKey = guid();
    let o, e;
    try {
      o = await this.accounts.findOneAndUpdate({ email }, { $set: {
        ip: ipAddress,
        passKey
      }, $unset: { cookie: '' } }, { returnOriginal: false });
    } catch (err) {
      e = err;
    }
    if (o && !isNullish(o.value)) {
      return o.value;
    }
    throw (e || new Error('account not found'));
  }

  // eslint-disable-next-line require-await
  async validatePasswordKey (passKey, ipAddress) {
    // ensure the passKey maps to the user's last recorded ip address
    return this.accounts.findOne({ passKey, ip: ipAddress });
  }

  /*
    record insertion, update & deletion methods
  */
  async addNewAccount (newData) {
    let o;
    try {
      o = await this.accounts.findOne({ user: newData.user });
    } catch (err) {}
    if (o) {
      throw new Error('username-taken');
    }
    let _o;
    try {
      _o = await this.accounts.findOne({ email: newData.email });
    } catch (err) {}
    if (_o) {
      throw new Error('email-taken');
    }

    const hash = saltAndHash(newData.pass);
    // eslint-disable-next-line require-atomic-updates
    newData.pass = hash;
    // append date stamp when record was created
    // eslint-disable-next-line require-atomic-updates
    newData.date = moment().format('MMMM Do YYYY, h:mm:ss a');
    return this.accounts.insertOne(newData);
  }

  // eslint-disable-next-line require-await
  async updateAccount (newData) {
    // eslint-disable-next-line require-await
    const findOneAndUpdate = async (data) => {
      const o = {
        name: data.name,
        email: data.email,
        country: data.country
      };
      if (data.pass) o.pass = data.pass;
      return this.accounts.findOneAndUpdate(
        { _id: getObjectId(data.id) },
        { $set: o },
        { returnOriginal: false }
      );
    };
    if (newData.pass === '') {
      return findOneAndUpdate(newData);
    }
    const hash = saltAndHash(newData.pass);
    newData.pass = hash;
    return findOneAndUpdate(newData);
  }

  // eslint-disable-next-line require-await
  async updatePassword (passKey, newPass) {
    const hash = saltAndHash(newPass);
    newPass = hash;
    return this.accounts.findOneAndUpdate({ passKey }, {
      $set: { pass: newPass }, $unset: { passKey: '' }
    }, { returnOriginal: false });
  }

  /*
    account lookup methods
  */

  // eslint-disable-next-line require-await
  async getAllRecords () {
    return this.accounts.find().toArray();
  }

  // eslint-disable-next-line require-await
  async deleteAccount (id) {
    return this.accounts.deleteOne({ _id: getObjectId(id) });
  }

  // eslint-disable-next-line require-await
  async deleteAllAccounts () {
    return this.accounts.deleteMany({});
  }
}

module.exports = AccountManager;
