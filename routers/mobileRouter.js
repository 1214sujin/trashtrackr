const express = require('express')
var router = express.Router()

var mobile = require('../controllers/mobile')
// 전체 gu, dong의 정보를 전송하기 위한 메소드를 import
var info = require('../controllers/bin').new

router.get('/home', mobile.home)
router.get('/list', mobile.list)
router.get('/alarm', mobile.alarm)
router.post('/replacement', mobile.replace)
// 회원 관련 기능(로그인, )
router.post('/login', mobile.login)
router.get('/info', info)
router.post('/info', mobile.info_process)

module.exports = router