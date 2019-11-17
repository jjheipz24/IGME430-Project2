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

const errorPage = (req, res) => {
  res.render('404');
};

// handles the login function on the login page
const login = (request, response) => {
  const req = request;
  const res = response;

  const username = `${req.body.username}`;
  const password = `${req.body.pass}`;

  // makes sure all fields are filled
  if (!username || !password) {
    return res.status(400).json({
      error: 'Please fill in the required fields',
    });
  }
  // checks to make sure login and password are correct
  return Account.AccountModel.authenticate(username, password, (err, account) => {
    if (err || !account) {
      return res.status(401).json({
        error: 'Wrong username or password',
      });
    }
    // sets the current session account based on username and password added
    req.session.account = Account.AccountModel.toAPI(account);

    // redirects user to their personal page
    return res.status(200).json({
      redirect: '/userPage',
    });
  });
};

// creates a new account
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

  // encrypts the users information
  return Account.AccountModel.generateHash(req.body.pass, (salt, hash) => {
    const accountData = {
      username: req.body.username,
      salt,
      password: hash,
    };

    // creates the new account model
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

// allows the user to change their password
//Thanks to Austin for all of the help
const changePassword = (request, response) => {
  const req = request;
  const res = response;

  req.body.currentPass = `${req.body.currentPass}`;
  req.body.newPass = `${req.body.newPass}`;
  req.body.pass2 = `${req.body.pass2}`;

  //checks for errors with the fields
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

  //checks to make sure the current password entered is actually the password
  return Account.AccountModel.authenticate(req.session.account.username, req.body.currentPass,
    (err, doc) => {
      if (err) {
        return res.status(400).json({
          err,
        });
      }

      if (!doc) {
        return res.status(400).json({
          err: 'invalid credentials',
        });
      }
      //encrypts new password
      Account.AccountModel.generateHash(req.body.newPass, (salt, hash) => {
        Account.AccountModel.updateOne({
          username: req.session.account.username,
        }, {
          salt,
          password: hash,
        }, (error) => {
          if (error) {
            return res.status(400).json({
              error,
            });
          }
          return hash;
        });
      });
      //redirects to the user page
      return res.status(200).json({
        redirect: '/userPage',
      });
    });
};

// gets the csrf token for encryption
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
module.exports.errorPage = errorPage;