const express = require('express')
const router = express.Router()
const product = require('../controllers/product.controller')

//middlewares
const upload = require('../middleware/multer.middleware')
const { isLogin, isAdmin } = require('../middleware')
router.post(
  '/add',
  isLogin,
  isAdmin,
  upload.single('image'),
  product.add
)
router.get('/fetch', isLogin, product.fetch)
router.get('/fetch/:productId', isLogin, product.fetchOne)
router.delete(
  '/delete/:productId',
  isLogin,
  isAdmin,
  product.delete
)

module.exports = router
