
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
  app.get('/', function (req, res) {
    // check if the user has an auto login key saved in a cookie
    if (req.cookies.login === undefined) {
      res.render('login', { title: 'Hello - Please Login To Your Account' });
    } else {
      // attempt automatic login
      AM.validateLoginKey(req.cookies.login, req.ip, (e, o) => {
        if (o) {
          AM.autoLogin(o.user, o.pass, (_o) => {
            req.session.user = _o;
            res.redirect('/home');
          });
        } else {
          res.render('login', {
            title: 'Hello - Please Login To Your Account'
          });
        }
      });
    }
  });

  app.post('/', function (req, res) {
    AM.manualLogin(req.body.user, req.body.pass, (e, o) => {
      if (!o) {
        res.status(400).send(e);
      } else {
        req.session.user = o;
        if (req.body['remember-me'] === 'false') {
          res.status(200).send(o);
        } else {
          AM.generateLoginKey(o.user, req.ip, (key) => {
            res.cookie('login', key, { maxAge: 900000 });
            res.status(200).send(o);
          });
        }
      }
    });
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

  app.post('/home', function (req, res) {
    if (isNullish(req.session.user)) {
      res.redirect('/');
    } else {
      const { name, email, pass, country } = req.body;
      AM.updateAccount({
        id: req.session.user._id,
        name,
        email,
        pass,
        country
      }, (e, o) => {
        if (e) {
          res.status(400).send('error-updating-account');
        } else {
          req.session.user = o.value;
          res.status(200).send('ok');
        }
      });
    }
  });

  /*
    new accounts
  */
  app.get('/signup', function (req, res) {
    res.render('signup', { title: 'Signup', countries });
  });

  app.post('/signup', function (req, res) {
    const { name, email, user, pass, country } = req.body;
    AM.addNewAccount({
      name,
      email,
      user,
      pass,
      country
    }, (e) => {
      if (e) {
        res.status(400).send(e);
      } else {
        res.status(200).send('ok');
      }
    });
  });

  /*
    password reset
  */
  app.post('/lost-password', function (req, res) {
    const { email } = req.body;
    AM.generatePasswordKey(email, req.ip, async (e, account) => {
      if (e) {
        res.status(400).send(e);
      } else {
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
      }
    });
  });

  app.get('/reset-password', function (req, res) {
    AM.validatePasswordKey(req.query.key, req.ip, (e, o) => {
      if (e || isNullish(o)) {
        res.redirect('/');
      } else {
        req.session.passKey = req.query.key;
        res.render('reset', { title: 'Reset Password' });
      }
    });
  });

  app.post('/reset-password', function (req, res) {
    const newPass = req.body.pass;
    const { passKey } = req.session;
    // destory the session immediately after retrieving the stored passkey
    req.session.destroy();
    AM.updatePassword(passKey, newPass, (e, o) => {
      if (o) {
        res.status(200).send('ok');
      } else {
        res.status(400).send('unable to update password');
      }
    });
  });

  /*
    view, delete & reset accounts
  */
  app.get('/print', function (req, res) {
    AM.getAllRecords((e, accounts) => {
      res.render('print', { title: 'Account List', accts: accounts });
    });
  });

  app.post('/delete', function (req, res) {
    AM.deleteAccount(req.session.user._id, (e, obj) => {
      if (!e) {
        res.clearCookie('login');
        req.session.destroy((_e) => {
          res.status(200).send('ok');
        });
      } else {
        res.status(400).send('record not found');
      }
    });
  });

  app.get('/reset', function (req, res) {
    AM.deleteAllAccounts(() => {
      res.redirect('/print');
    });
  });

  app.get('*', function (req, res) {
    res.render('404', { title: 'Page Not Found' });
  });
};
