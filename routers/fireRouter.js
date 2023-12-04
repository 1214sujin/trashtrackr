const express = require('express')
const router = express.Router()

var fire = require('../controllers/fire')

router.get('/', fire.home)
router.get('/bin-list', fire.bin_list)
router.get('/list/:bin_id', fire.list)
router.get('/:bin_id', fire.detail)

module.exports = router