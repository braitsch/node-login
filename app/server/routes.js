
const AccountManager = require('./modules/account-manager');
const EmailDispatcher = require('./modules/email-dispatcher');

const { isNullish, hasOwn } = require('./modules/common');

module.exports = async function (app, config) {
  const {
    NL_EMAIL_HOST,
    NL_EMAIL_USER,
    NL_EMAIL_PASS,
    NL_EMAIL_FROM,
    NL_SITE_URL,
    DB_URL,
    DB_NAME,
    countries
  } = config;

  const AM = await (new AccountManager({
    DB_URL,
    DB_NAME
  })).connect();
  const ED = new EmailDispatcher({
    NL_EMAIL_HOST,
    NL_EMAIL_USER,
    NL_EMAIL_PASS,
    NL_EMAIL_FROM,
    NL_SITE_URL
  });

  /*
    login & logout
  */
  app.get('/', async function (req, res) {
    // check if the user has an auto login key saved in a cookie
    if (req.cookies.login === undefined) {
      res.render('login', { title: 'Hello - Please Login To Your Account' });
    } else {
      // attempt automatic login
      let o;
      try {
        o = await AM.validateLoginKey(req.cookies.login, req.ip);
      } catch (err) {}

      if (o) {
        const _o = await AM.autoLogin(o.user, o.pass);
        // eslint-disable-next-line require-atomic-updates
        req.session.user = _o;
        res.redirect('/home');
      } else {
        res.render('login', {
          title: 'Hello - Please Login To Your Account'
        });
      }
    }
  });

  app.post('/', async function (req, res) {
    let o;
    try {
      o = await AM.manualLogin(req.body.user, req.body.pass);
    } catch (err) {
      res.status(400).send(err.message);
      return;
    }

    // eslint-disable-next-line require-atomic-updates
    req.session.user = o;
    if (req.body['remember-me'] === 'false') {
      res.status(200).send(o);
    } else {
      const key = await AM.generateLoginKey(o.user, req.ip);
      res.cookie('login', key, { maxAge: 900000 });
      res.status(200).send(o);
    }
  });

  app.post('/logout', function (req, res) {
    res.clearCookie('login');
    req.session.destroy((e) => { res.status(200).send('ok'); });
  });

  /*
    control panel
  */
  app.get('/home', function (req, res) {
    if (isNullish(req.session.user)) {
      res.redirect('/');
    } else {
      res.render('home', {
        title: 'Control Panel',
        countries,
        udata: req.session.user
      });
    }
  });

  app.post('/home', async function (req, res) {
    if (isNullish(req.session.user)) {
      res.redirect('/');
    } else {
      const { name, email, pass, country } = req.body;
      let o;
      try {
        o = await AM.updateAccount({
          id: req.session.user._id,
          name,
          email,
          pass,
          country
        });
      } catch (e) {
        res.status(400).send('error-updating-account');
        return;
      }
      // eslint-disable-next-line require-atomic-updates
      req.session.user = o.value;
      res.status(200).send('ok');
    }
  });

  /*
    new accounts
  */
  app.get('/signup', function (req, res) {
    res.render('signup', { title: 'Signup', countries });
  });

  app.post('/signup', async function (req, res) {
    const { name, email, user, pass, country } = req.body;
    try {
      await AM.addNewAccount({
        name,
        email,
        user,
        pass,
        country
      });
    } catch (e) {
      res.status(400).send(e.message);
      return;
    }
    res.status(200).send('ok');
  });

  /*
    password reset
  */
  app.post('/lost-password', async function (req, res) {
    const { email } = req.body;
    let account;
    try {
      account = await AM.generatePasswordKey(email, req.ip);
    } catch (e) {
      res.status(400).send(e.message);
      return;
    }
    try {
      /* const { status, text } = */
      await ED.dispatchResetPasswordLink(account);
      // TODO this promise takes a moment to return, add a loader to
      //   give user feedback
      res.status(200).send('ok');
    } catch (_e) {
      for (const k in _e) {
        if (hasOwn(_e, k)) {
          console.log('ERROR:', k, _e[k]);
        }
      }
      res.status(400).send('unable to dispatch password reset');
    }
  });

  app.get('/reset-password', async function (req, res) {
    let o, e;
    try {
      o = await AM.validatePasswordKey(req.query.key, req.ip);
    } catch (err) {
      e = err;
    }
    if (e || isNullish(o)) {
      res.redirect('/');
    } else {
      // eslint-disable-next-line require-atomic-updates
      req.session.passKey = req.query.key;
      res.render('reset', { title: 'Reset Password' });
    }
  });

  app.post('/reset-password', async function (req, res) {
    const newPass = req.body.pass;
    const { passKey } = req.session;
    // destory the session immediately after retrieving the stored passkey
    req.session.destroy();
    let o;
    try {
      o = await AM.updatePassword(passKey, newPass);
    } catch (err) {}
    if (o) {
      res.status(200).send('ok');
    } else {
      res.status(400).send('unable to update password');
    }
  });

  /*
    view, delete & reset accounts
  */
  app.get('/print', async function (req, res) {
    const accounts = await AM.getAllRecords();
    res.render('print', { title: 'Account List', accts: accounts });
  });

  app.post('/delete', async function (req, res) {
    try {
      /* obj = */ await AM.deleteAccount(req.session.user._id);
    } catch (err) {
      res.clearCookie('login');
      req.session.destroy((_e) => {
        res.status(200).send('ok');
      });
      return;
    }
    res.status(400).send('record not found');
  });

  app.get('/reset', async function (req, res) {
    await AM.deleteAllAccounts();
    res.redirect('/print');
  });

  app.get('*', function (req, res) {
    res.render('404', { title: 'Page Not Found' });
  });
};
