const express = require('express')
var router = express.Router()

var mobile = require('../controllers/mobile')
// 전체 gu, dong의 정보를 전송하기 위한 메소드를 import
var info = require('../controllers/bin').new

router.get('/list/:pos', (req, res, next) => {
	var {pos} = req.params
	if (pos == 'home') next()
	else mobile.list(req, res)
})
router.get('/list/home', mobile.home)
router.get('/alarm/:pos', mobile.alarm)
router.post('/replacement', mobile.replace2)
router.post('/replacement/:bin_id', mobile.replace)
// 회원 관리 기능
router.post('/login', mobile.login)
router.get('/info', info)
router.post('/info', mobile.info_process)
router.post('/find-pw', mobile.find_pw)
router.post('/pw', mobile.pw)

module.exports = router