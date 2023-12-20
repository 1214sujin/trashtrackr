var db = require('../db/db')

module.exports = {
	home: (req, res) => {
		var sql0 = `select * from pos_gu;`
		var sql1 = `select * from pos_dong;`
		db.query(sql0+sql1, (err, results) => {
			var context = {
				body: 'fire.ejs',
				name: req.session.name,
				active: ['','','active-menu','',''],
				gu_list: results[0],
				dong_list: results[1]
			}
			req.app.render('menu', context, (err, html) => {if(err)console.error(err); res.send(html)})
		})
	},
	bin_list: (req, res) => {
		var { dong, start, end } = req.query
		var sql0 = `select distinct f.bin_id from fire f join bin b on f.bin_id=b.bin_id where pos=? and ?<=date_format(fire_time, '%Y-%m-%d')<=?;`
		db.query(sql0, [dong, start, end], (err, result) => {
			if (err) {
				console.error(err.sqlMessage)
				console.error(err.sql)
				res.json({err: err.errno})
			} else {
				var data = {
					err: 0,
					bin_list: result
				}
				res.json(data)
			}
		})
	},
	list: (req, res) => {
		var { bin_id } = req.params
		var { start, end } = req.query
		var sql0 = `select distinct date_format(fire_time, '%Y-%m-%d') from fire where bin_id=? and ?<=date_format(fire_time, '%Y-%m-%d')<=?;`
		// start, end가 없으면 DB 상 전체 기간에 대하여 조회
		if (start == undefined || end == undefined) var sql0 = `select distinct date_format(fire_time, '%Y-%m-%d') from fire where bin_id=?;`
		db.query(sql0, [bin_id, start, end], (err, result) => {
			if (err) {
				console.error(err.sqlMessage)
				console.error(err.sql)
				res.json({err: err.errno})
			} else {
				var data = {
					err: 0,
					fire_list: result
				}
				res.json(data)
			}
		})
	},
	detail: (req, res) => {
		var { bin_id, date } = req.params
		var sql0 = `select date_format(fire_time, '%H:%i:%s') as time, fire_img from fire where bin_id=? and date_format(fire_time, '%Y-%m-%d')=?;`
		db.query(sql0, [bin_id, date], (err, result) => {
			if (err) {
				console.error(err.sqlMessage)
				console.error(err.sql)
				res.json({err: err.errno})
			} else {
				var data = {
					err: 0,
					date: date,
					monitor: result
				}
				res.json(data)
			}
		})
	}
}