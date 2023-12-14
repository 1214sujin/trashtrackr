var db = require('../db/db')
const ee = require('../lib/alert')

module.exports = {
	list: (req, res) => {
		let sql0 = `select * from notification;`
	},	// 관리자가 알림 버튼을 누른 경우(select), 확인한 경우(update), 알림을 삭제한 경우(delete)의 코드 필요
	alert: (req, res) => {
		res.writeHead(200, {
			'Content-Type': 'text/event-stream',
			'Cache-Control': 'no-cache',
			'Connection': 'keep-alive'
		})
		res.flushHeaders()

		ee.on('photo', () => {
			let data = {type: 'photo', data: '/monitor.jpg'}
			console.log(`${JSON.stringify(data)}`)
			res.write(`data: ${JSON.stringify(data)}\n\n`)
		})
	
		ee.on('alert-rp', (id) => {
			var sql0 = `select * from notification n join (select type, not_time from notification where not_id=?) s on n.type=s.type and n.not_time=s.not_time;`	// 특정 emp_id에 대해서 알림을 발송하면 안 되므로... code로 조회했음
			db.query(sql0, [id], (err, result) => {
				let data = {type: 'alert-rp', data: result[0]}
				res.write(`data: ${JSON.stringify(data)}\n\n`)
			})
		})

		ee.on('alert-fire', (id, _) => {
			var sql0 = `select * from notification n join (select type, not_time from notification where not_id=?) s on n.type=s.type and n.not_time=s.not_time;`
			db.query(sql0, [id], (err, result) => {
				let data = {type: 'alert-fire', data: result[0]}
				res.write(`data: ${JSON.stringify(data)}\n\n`)
			})
		})
	}
}