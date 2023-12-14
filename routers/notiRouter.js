const express = require('express')
const router = express.Router()

var noti = require('../controllers/noti')

router.get('/', noti.list)
router.put('/:not_id', noti.check)
router.delete('/:not_id', noti.delete)
router.get('/alert', noti.alert)	// SSE 엔드포인트

module.exports = router