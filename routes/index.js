const userController = require('../controllers/userControllers')

module.exports = (app, passport) => {
  app.get('/', (req, res) => res.render('index'))
  app.post('/api/signup', userController.signUp)
  app.post('/api/signin', userController.signIn)
}
