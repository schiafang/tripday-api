const userController = require('../controllers/userControllers')

module.exports = (app, passport) => {
  app.post('/api/signup', userController.signUp)
  app.post('/api/signin', userController.signIn)
}
