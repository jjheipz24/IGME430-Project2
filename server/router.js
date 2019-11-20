const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  app.get('/', controllers.Image.homePage);
  app.get('/home', controllers.Image.homePage);

  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);
  app.get('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signupPage);
  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);
  app.get('/userPage', mid.requiresLogin, controllers.Image.userPage);
  app.post('/changePassword', mid.requiresLogin, controllers.Account.changePassword);
  app.get('/logout', mid.requiresLogin, controllers.Account.logout);

  app.post('/uploadImg', controllers.Image.uploadImage);
  app.get('/retrieve', controllers.Image.retrieve);

  // https://stackoverflow.com/questions/6528876/how-to-redirect-404-errors-to-a-page-in-expressjs
  app.get('/*', controllers.Account.errorPage);
};

module.exports = router;
