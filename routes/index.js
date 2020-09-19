const userController = require('../controllers/userControllers')
const multer = require('multer')
var upload = multer({ dest: 'temp/' })

module.exports = (app, passport) => {

  function authenticated(req, res, next) {
    passport.authenticate('jwt', { session: false }, (error, user, i) => {
      if (!user) { return res.status(401).json({ status: 'error', message: "驗證失敗" }) }
      req.user = user
      return next()
    })(req, res, next)
  }

  app.get('/', (req, res) => res.render('index'))

  app.get('/get_current_user', authenticated, userController.getCurrentUser)

  app.post('/api/signup', userController.signUp)
  app.post('/api/signin', userController.signIn)

  app.put('/api/user', authenticated, upload.single('avatar'), userController.putUser)
}
