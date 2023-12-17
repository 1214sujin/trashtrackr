const mqtt = require('mqtt')
const fs = require('fs')
const db = require('../db/db')
const ee = require('./alert')

var broker = 'mqtt://test.mosquitto.org'
const client = mqtt.connect(broker)

client.on('connect', () => {
	console.log('RPi: Connected:', client.connected)
	client.subscribe('TrashTrackr/RP')
	client.subscribe('TrashPhoto/RP')
})
client.on('error', (err) => {
	console.error('RPi: Cannot connect:', err)
	process.exit(1)
})

client.on('message', (topic, message) => {
	const msg = JSON.parse(message)
	if (topic=='TrashTrackr/RP') {
		console.log(msg)
		if (msg.amount) {
			let sql0 = `insert into loadage values (?, now(), ?);`
			db.query(sql0, [msg.bin_id, msg.amount], (err, result) => {
				if (err) console.error(err)
			})
		}
		if (msg.load_img) {	// 적재량이 90% 이상인 경우
			ee.emit('alert-90', msg.bin_id)	// 미화원에게 알림 전송
			try {
				const imageBuffer = Buffer.from(msg.load_img, 'base64')
				fs.writeFileSync(__dirname+'/../public'+msg.load_img_name, imageBuffer)
				let sql1 = "insert into alarm values (?, now(), ?);"
				db.query(sql1, [msg.bin_id, msg.load_img_name], (err, result) => {
					if (err) console.error(err)
				})
			} catch (error) {
				console.error('Error:', error.message)
			}
		}
		if (msg.fire_img) {
			console.log(`fire: ${msg.fire}`)
			if (msg.fire) {
				let sql0 = `insert into notification (emp_id, bin_id, type, not_time, url)
							select distinct emp_id, ?, 'fire', now(), concat('/fire/list/', ?) from employee where code='0';`
				db.query(sql0, [msg.bin_id, msg.bin_id, msg.bin_id], (err, result) => {
					if (err) console.error(err)
					ee.emit('alert-fire', result.insertId, msg.bin_id)	// 화재 최초 감지시에만 알림 발송
				})
			}
			try {
				const imageBuffer = Buffer.from(msg.fire_img, 'base64')
				fs.writeFileSync(__dirname+'/../public'+msg.fire_img_name, imageBuffer)
				let sql1 = `insert into fire values (?, now(), ?);`
				db.query(sql1, [msg.bin_id, msg.fire_img_name], (err, result) => {
					if (err) console.error(err)
				})
			} catch (error) {
				console.error('Error:', error.message)
			}
		}
	} else if (topic=='TrashPhoto/RP') {
		console.log(msg)
		try {
			const imageBuffer = Buffer.from(msg.img, 'base64')
			fs.writeFileSync(__dirname+'/../public/monitor.jpg', imageBuffer)
			ee.emit('photo')
		} catch (error) {
			console.error('Error:', error.message)
		}
	}
})

module.exports = client