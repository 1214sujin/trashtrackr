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
	// console.log(`${message}`)
	const msg = JSON.parse(message)
	if (topic=='TrashTrackr/RP') {
		console.log(`bin_id: '${msg.bin_id}'`)
		if (msg.amount) {
			console.log(`amount: ${msg.amount} %`)
			try {
				const imageBuffer = Buffer.from(msg.load_img, 'base64')
				fs.writeFileSync(__dirname+'/../public/'+msg.load_img_name, imageBuffer)
				db.query(`insert into loadage (?, now(), ?)`, [msg.bin_id, msg.amount], (err, result) => {
					if (err) console.error
				})
			} catch (error) {
				console.error('Error:', error.message)
			}
		}
		if (msg.fire) {
			console.log(`fire: ${msg.fire}`)
			try {
				const imageBuffer = Buffer.from(msg.fire_img, 'base64')
				fs.writeFileSync(__dirname+'/../public/'+msg.fire_img_name, imageBuffer)
			} catch (error) {
				console.error('Error:', error.message)
			}
			// 데이터 받은 것을 데이터베이스에 넣는 것까지 구현
		}
	} else if (topic=='TrashPhoto/RP') {
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