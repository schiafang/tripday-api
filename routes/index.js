const userController = require('../controllers/userControllers')
const passport = require('../config/passport')

const authenticated = passport.authenticate('jwt', { session: false })

module.exports = (app, passport) => {
  app.get('/', (req, res) => res.render('index'))

  app.get('/get_current_user', authenticated, userController.getCurrentUser)

  app.post('/api/signup', userController.signUp)
  app.post('/api/signin', userController.signIn)
}
