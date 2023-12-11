var db = require('../db/db')
var mqtt = require('../lib/test_sub')
var ee = require('../lib/alert')

module.exports = {
	home: (req, res) => {
		var sql0 = `select * from pos_gu;`
		var sql1 = `select * from pos_dong;`
		db.query(sql0+sql1, (err, results) => {
			var data = {
				gu_list: results[0],
				dong_list: results[1]
			}
			res.json(data)
		})
	},
	view: (req, res) => {
		var { bin_id } = req.params
		var sql0 = `select gu, dong, amount from loadage l join bin b on l.bin_id=b.bin_id
					join pos_dong on pos=dong_id join pos_gu on p_gu=gu_id
					where (l.bin_id, load_time) in (select bin_id, max(load_time) from loadage group by bin_id) and l.bin_id=?;`
		db.query(sql0, [bin_id], (err, result) => {
			if (result.length == 0) {
				res.json({ err: 1 })
			} else {
				var pos = `{gu}구 {dong}동`
				var data = {
					err: 0,
					pos: pos,
					amount: result[0].amount
				}
				res.json(data)
			}
		})
	},
	pic: (req, res) => {
		var { bin_id } = req.params
		mqtt.publish('TrashPhoto', `{"server": true,"bin_id": ${bin_id}`)
		res.send({ image: __dirname+'/../public/loading.jpg' })
	},
	pic_wait: (req, res) => {
		res.setHeader({
			'Content-Type': 'text/event-stream',
			'Cache-Control': 'no-cache',
			'Connection': 'keep-alive'
		})
		res.flushHeaders()

		ee.once('photo', () => {
			let data = {type: 'photo', data: 'monitor.jpg'}
			res.write(`data: ${JSON.stringify(data)}\n\n`)
			res.end()
		})
	}
}