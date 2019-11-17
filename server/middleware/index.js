/* Used when login is required for functionality
If an account is not logged in, redirect to the homepage */
const requiresLogin = (req, res, next) => {
  if (!req.session.account) {
    return res.redirect('/');
  }

  return next();
};


/* Used when logout is required for functionality
If logged in, redirect to the userpage */
const requiresLogout = (req, res, next) => {
  if (req.session.account) {
    return res.redirect('/userPage');
  }

  return next();
};

/* URL must be https */
const requiresSecure = (req, res, next) => {
  if (req.headers['x-forwarded-proto'] !== 'https') {
    return res.redirect(`https://${req.hostname}${req.url}`);
  }
  return next();
};

const bypassSecure = (req, res, next) => {
  next();
};

/* Exports */
module.exports.requiresLogin = requiresLogin;
module.exports.requiresLogout = requiresLogout;

if (process.env.NODE_ENV === 'production') {
  module.exports.requiresSecure = requiresSecure;
} else {
  module.exports.requiresSecure = bypassSecure;
}
