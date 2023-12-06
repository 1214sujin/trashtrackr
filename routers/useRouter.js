const express = require('express')
const router = express.Router()

var use = require('../controllers/use')

router.get('/use/gu', use.gu_home)
router.get('/use/gu/:gu_id', use.gu)
router.get('/use/gu/:gu_id/:dong_id', use.gu_detail)
router.get('/use/dong', use.dong_home)
router.get('/use/dong/:dong_id', use.dong)
router.get('/use/dong/:dong_id/:bin_id', use.dong_detail)

module.exports = router