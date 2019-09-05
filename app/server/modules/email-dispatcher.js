const emailjs = require('emailjs/email');

class EmailDispatcher {
  constructor (config) {
    const {
      NL_EMAIL_HOST = 'smtp.gmail.com',
      NL_EMAIL_USER = 'your-email-address@gmail.com',
      NL_EMAIL_PASS = '1234',
      NL_EMAIL_FROM = 'Node Login <do-not-reply@gmail.com>',
      NL_SITE_URL = 'http://localhost:3000'
    } = config;
    Object.assign(this, {
      NL_EMAIL_HOST, NL_EMAIL_USER, NL_EMAIL_PASS,
      NL_EMAIL_FROM, NL_SITE_URL
    });

    this.server = emailjs.server.connect({
      host: NL_EMAIL_HOST,
      user: NL_EMAIL_USER,
      password: NL_EMAIL_PASS,
      ssl: true
    });
  }

  dispatchResetPasswordLink (account) {
    return this.server.send({
      from: this.NL_EMAIL_FROM,
      to: account.email,
      subject: 'Password Reset',
      text: 'something went wrong... :(',
      attachment: this.composeEmail(account)
    });
  }

  composeEmail (o) {
    const baseurl = this.NL_SITE_URL;
    const html = `<html><body>
      Hi ${o.name},<br><br>
      Your username is <b>${o.user}</b><br><br>
      <a href="${baseurl}/reset-password?key=${o.passKey}">
        Click here to reset your password
      </a><br><br>
      Cheers,<br>
      <a href='https://braitsch.io'>braitsch</a><br><br>
      </body></html>`;
    return [{ data: html, alternative: true }];
  }
}

module.exports = EmailDispatcher;
