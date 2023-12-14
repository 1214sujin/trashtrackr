const express = require('express')
const router = express.Router()

var noti = require('../controllers/noti')

router.get('/', noti.list)
router.get('/alert', noti.alert)

module.exports = router