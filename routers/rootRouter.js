const express = require('express')
const router = express.Router()
const fs = require('fs')

var root = require('../controllers/root')
//test
var ee = require('../lib/alert')

router.get('/', (req, res) => { res.redirect('/login') })
router.get('/login', root.login_home)
router.post('/login', root.login)
router.get('/logout', root.logout)
router.get('/find-pw', root.find_pw_home)
router.post('/find-pw', root.find_pw)

//TEST
router.get('/test', (req, res) => {
	res.writeHead(200, { 'Content-Type':'text/html'})
	res.end(fs.readFileSync(__dirname+'/../views-test/test.html'))
})
router.get('/photo', (req, res) => {
	setTimeout(() => ee.emit('photo'), 1000)
	res.json({data: '/loading.jpg'})
})
router.get('/photo/wait', (req, res) => {
	res.writeHead(200, {
		'Content-Type': 'text/event-stream',
		'Cache-Control': 'no-cache',
		'Connection': 'keep-alive'
	})
	res.flushHeaders()

	ee.once('photo', () => {
		let data = {type: 'photo', data: '/monitor.jpg'}
		console.log(`${JSON.stringify(data)}`)
		res.write(`data: ${JSON.stringify(data)}\n\n`)
		res.end()
	})
})
router.get('/alert-90', (req, res) => ee.emit('alert-90', 'SB0001'))
router.get('/alert-rp', (req, res) => ee.emit('alert-rp', 3))
router.get('/alert-fire', (req, res) => ee.emit('alert-fire', 2, 'SB0003'))

module.exports = router