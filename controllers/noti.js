var db = require('../db/db')
const ee = require('../lib/alert')

module.exports = {
	list: (req, res) => {
		let sql0 = `select * from notification;`
		db.query(sql0, (err, result) => { res.json({result}) })
	},
	check: (req, res) => {
		var { not_id } = req.params
		let sql0 = "update notification set `read`=1 where not_id=?;"
		let sql1 = `select * from notification where not_id=?;`
		db.query(sql0+sql1, [not_id, not_id], (err, results) => {
			if (results[1][0].type == 'rp') res.redirect(`/load/${results[1][0].bin_id}`)
			else res.redirect(`/fire/list/${results[1][0].bin_id}`)
		})
	},
	delete: (req, res) => {
		var { not_id } = req.params
		let sql0 = `delete from notification where not_id=?;`
		db.query(sql0, [not_id], (err, result) => res.end())
	},
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