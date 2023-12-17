const express = require('express')
const router = express.Router()

var use = require('../controllers/use')

router.get('/gu', use.gu_home)
router.get('/gu/:gu_id', use.gu)
router.get('/gu/:gu_id/:dong_id', use.gu_detail)
router.get('/dong', use.dong_home)
router.get('/dong/:dong_id', use.dong)
router.get('/dong/:dong_id/:bin_id', use.dong_detail)

module.exports = router