const express = require('express')
const router = express.Router()

var root = require('../controllers/root')

router.get('/login', root.login_home)
router.post('/login', root.login)
router.get('/logout', root.logout)
router.get('/find-pw', root.find_pw_home)
router.post('/find-pw', root.find_pw)

module.exports = router