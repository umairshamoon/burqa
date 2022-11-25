//npm
const bcrypt = require('bcryptjs')
//models
const User = require('../models/user.model')
//validatoins
const validateLogin = require('../validations/login.validation')
//helpers
const joiHelper = require('../helpers/joi.helper')
const jwtSign = require('../helpers/jwtSign.helper')

module.exports = {
  login: async (req, res) => {
    try {
      const { password, email } = req.body
      joiHelper(validateLogin, req.body)
      const admin = await User.findOne({ email })
      if (!admin) throw Error('invalid email')
      if (admin?.role !== 'admin')
        return res
          .status(403)
          .json({ message: 'access denaied' })
      // const temp = await bcrypt.hash(password, 10)
      // console.log(temp)
      // return res.json(temp)

      if (!(await bcrypt.compare(password, admin.password)))
        throw Error('incorrect password')

      res.status(200).json({
        message: 'Login successfully',
        token: jwtSign({ id: admin.id, isAdmin: true }),
        user: {
          username: admin.username,
          email: admin.email,
          avatar: admin.avatar,
          contact: admin.contact,
          id: admin._id,
        },
      })
    } catch (error) {
      res.status(400).json({ message: error.message })
    }
  },

  deleteUser: async (req, res) => {
    try {
      await User.findByIdAndDelete(req.params.id)
    } catch (error) {
      res.status(400).json({ message: error.message })
    }
  },
  fetchCustomers: async (req, res) => {
    try {
      const users = await User.find({
        orderPlaced: true,
      }).select('_id username avatar address')
      if (!users.length) throw Error('No Customers Available')
      res.status(200).json(users)
    } catch (error) {
      res.status(400).json({ message: error.message })
    }
  },
}

// $2a$10$4HMkSQ0f6P7.QFnydvhm0uwoEPkjLgU2Lo9EZqt2SLRS9MGymRebS
