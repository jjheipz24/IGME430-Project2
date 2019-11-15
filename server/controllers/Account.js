const models = require('../models');

const Account = models.Account;

const loginPage = (req, res) => {
  res.render('login', {
    csrfToken: req.csrfToken,
  });
};

const signupPage = (req, res) => {
  res.render('signup', {
    csrfToken: req.csrfToken,
  });
};

const logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
};

const login = (request, response) => {
  const req = request;
  const res = response;

  const username = `${req.body.username}`;
  const password = `${req.body.pass}`;

  if (!username || !password) {
    return res.status(400).json({
      error: 'Please fill in the required fields',
    });
  }

  return Account.AccountModel.authenticate(username, password, (err, account) => {
    if (err || !account) {
      return res.status(401).json({
        error: 'Wrong username or password',
      });
    }

    req.session.account = Account.AccountModel.toAPI(account);

    return res.status(200).json({
      redirect: '/userPage',
    });
  });
};

const signup = (request, response) => {
  const req = request;
  const res = response;

  req.body.username = `${req.body.username}`;
  req.body.pass = `${req.body.pass}`;
  req.body.pass2 = `${req.body.pass2}`;

  if (!req.body.username || !req.body.pass || !req.body.pass2) {
    return res.status(400).json({
      error: 'Please fill in the required fields',
    });
  }

  if (req.body.pass !== req.body.pass2) {
    return res.status(400).json({
      error: 'Passwords do not match',
    });
  }

  return Account.AccountModel.generateHash(req.body.pass, (salt, hash) => {
    const accountData = {
      username: req.body.username,
      salt,
      password: hash,
    };

    const newAccount = new Account.AccountModel(accountData);

    const savePromise = newAccount.save();
    savePromise.then(() => {
      req.session.account = Account.AccountModel.toAPI(newAccount);
      return res.status(201).json({
        redirect: '/userPage',
      });
    });
    savePromise.catch((err) => {
      console.log(err);

      if (err.code === 11000) {
        return res.status(400).json({
          error: 'Username already in use',
        });
      }

      return res.status(400).json({
        error: 'An error occured',
      });
    });
  });
};

const changePassword = (request, response) => {
  const req = request;
  const res = response;

  req.body.currentPass = `${req.body.currentPass}`;
  req.body.newPass = `${req.body.newPass}`;
  req.body.pass2 = `${req.body.pass2}`;

  if (!req.body.currentPass || !req.body.newPass || !req.body.pass2) {
    return res.status(400).json({
      error: 'Please fill in the required fields',
    });
  }

  if (req.body.newPass !== req.body.pass2) {
    return res.status(400).json({
      error: 'Passwords do not match',
    });
  }

  Account.findById(req.session.account._id, (err, doc) => {
    if (err) {
      res.json(err);
    }
    if (!doc) {
      res.json({
        error: 'no document found',
      });
    }

    const account = doc;
    account.password = req.body.newPass;
    const savePromise = account.save();
    savePromise.then(() => res.json({
      redirect: '/user',
    }));
    savePromise.catch((err) => res.json(err));
  });
};

const getToken = (request, response) => {
  const req = request;
  const res = response;

  const csrfJSON = {
    csrfToken: req.csrfToken(),
  };
  res.json(csrfJSON);
};

module.exports.loginPage = loginPage;
module.exports.login = login;
module.exports.logout = logout;
module.exports.signupPage = signupPage;
module.exports.signup = signup;
module.exports.getToken = getToken;
module.exports.changePassword = changePassword;
