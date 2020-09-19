const db = require('../models')
const bcrypt = require('bcryptjs')
const User = db.User
const jwt = require('jsonwebtoken')
const fs = require('fs')

const userController = {
  signUp: (req, res) => {
    const { email, password, confirmPassword } = req.body
    const hashPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10))
    const error = []

    if (!email || !password || !confirmPassword) {
      error.push({ message: 'All fields are required' })
      return res.json({ status: 'error', message: error })
    }

    if (password !== confirmPassword) {
      error.push({ message: 'Password and confirm password must be the same' })
      return res.json({ status: 'error', message: error })
    }

    User.findOne({ where: { email }, raw: true })
      .then(user => {
        if (user) {
          if (user.email === email) { error.push({ message: 'Email has been registered' }) }
          return res.json({ status: 'error', message: error })
        }
        if (!user) {
          return User.create({ email, password: hashPassword })
            .then(() => res.json({ status: 'success', message: 'Registered successfully' }))
        }
      })
  },
  signIn: (req, res) => {
    let { email, password } = req.body

    if (!email || !password) {
      return res.status(401).json({ status: 'error', message: "Email or password incorrect" })
    }

    User.findOne({ where: { email } })
      .then(user => {
        console.log(user)
        const { id, name, email, isAdmin, realname, tel, avatar } = user
        if (!user) return res.status(401).json({ status: 'error', message: 'This email is not registered' })
        if (!bcrypt.compareSync(password, user.password)) {
          return res.status(401).json({ status: 'error', message: 'Password incorrect' })
        }

        const payload = { id }
        const token = jwt.sign(payload, process.env.JWT_SECRET)
        return res.json({
          status: 'success', message: 'Authorization succeeded', token: token,
          user: { id, name, realname, email, isAdmin, tel, avatar }
        })
      })
  },
  getCurrentUser: (req, res) => {
    const { id, name, email, avatar, isAdmin, realname, tel } = req.user
    return res.json({ id, name, email, realname, avatar, tel, isAdmin })
  },
  putUser: (req, res) => {
    const { id, name, realname, email, tel } = req.user
    const { name: updateName, realname: updateRealname, email: updateEmail, tel: updateTel } = req.body
    const file = req.file

    if (file) {
      fs.readFile(file.path, (err, data) => {
        if (err) console.log('Error:', err)
        fs.writeFile(`upload/${file.originalname}`, data, () => {
          return User.findByPk(id)
            .then(user => user.update({ avatar: file ? `/upload/${file.originalname}` : avatar }))
            .then(() => res.json({ status: 'success', message: 'Avatar update successfully' }))
        })
      })
    }

    return User.findByPk(id)
      .then(user => {
        return user.update({
          name: updateName ? updateName : name,
          realname: updateRealname ? updateRealname : realname,
          email: updateEmail ? updateEmail : email,
          tel: updateTel ? updateTel : tel,
          avatar: file ? `/upload/${file.originalname}` : avatar
        })
      })
      .then(() => res.json({ status: 'success', message: 'Update successfully' }))
  }
}

module.exports = userController