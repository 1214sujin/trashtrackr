const express = require('express')
const router = express.Router()

var user = require('../controllers/user')

router.get('/info', user.info)
router.post('/info', user.info_process)
router.get('/pw', user.pw)
router.post('/pw', user.pw_process)

module.exports = router