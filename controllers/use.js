var db = require('../db/db')

module.exports = {
	gu_home: (req, res) => {		
		var sql0 = `select * from pos_gu;`
		db.query(sql0, (err, results) => {
			var context = {
				body: 'use_gu.ejs',
				name: req.session.name,
				active: ['','','','active-menu',''],
				gu_list: results
			}
			req.app.render('menu', context, (err, html) => {if(err)console.error(err); res.send(html)})
		})
	},
	gu: (req, res) => {
		var { gu_id } = req.params
		var { start, end } = req.query
		sql0 = "select dong, dong_id, count(rp_time)/10 as `use`\
				from (select rp_time, pos from replacement r join bin b on r.bin_id=b.bin_id where ?<=date_format(rp_time, '%Y-%m-%d')<=?) as s\
				right join pos_dong on pos=dong_id where p_gu=? group by dong, dong_id order by `use` desc limit 5;"
		sql1 = "select dong, dong_id, count(rp_time)/10 as `use`\
				from (select rp_time, pos from replacement r join bin b on r.bin_id=b.bin_id where ?<=date_format(rp_time, '%Y-%m-%d')<=?) as s\
				right join pos_dong on pos=dong_id where p_gu=? group by dong, dong_id order by `use` limit 5;"
		db.query(sql0+sql1, [start, end, gu_id, start, end, gu_id], (err, results) => {
			if (err) {
				console.error(err.sqlMessage)
				console.error(err.sql)
				res.json({ err: err.errno })
			} else {
				var data = {
					err: 0,
					top_list: results[0],
					btm_list: results[1]
				}
				res.json(data)
			}
		})
	},
	gu_detail: (req, res) => {
		var { dong_id } = req.params
		var { start, end } = req.query
		var sql0 = `select period, count(period)/10 as 'use'
					from ( select pos, rp_time, date_format(rp_time, '%Y-%m') as period from replacement r right join bin b on r.bin_id=b.bin_id
						where?<=date_format(rp_time, '%Y-%m')<=? ) as s
					right join pos_dong on pos=dong_id where dong_id=? group by period;`
		db.query(sql0, [start, end, dong_id], (err, result) => {
			if (err) {
				console.error(err.sqlMessage)
				console.error(err.sql)
				res.json({ err: err.errno })
			} else {
				var data = {
					err: 0,
					use_list: result
				}
				res.json(data)
			}
		})
	},
	dong_home: (req, res) => {
		var sql0 = `select * from pos_gu;`
		var sql1 = `select * from pos_dong;`
		db.query(sql0+sql1, (err, results) => {
			var context = {
				body: 'use_dong.ejs',
				name: req.session.name,
				active: ['','','','','active-menu'],
				gu_list: results[0],
				dong_list: results[1]
			}
			req.app.render('menu', context, (err, html) => {if(err)console.error(err); res.send(html)})
		})
	},
	dong: (req, res) => {
		var { dong_id } = req.params
		var { start, end } = req.query
		sql0 = "select b.bin_id, count(rp_time) as `use` from (select bin_id, rp_time from replacement where ?<=date_format(rp_time, '%Y-%m-%d')<=?) as r\
				right join bin b on r.bin_id=b.bin_id where pos=? group by bin_id order by `use` desc limit 5;"
		sql1 = "select b.bin_id, count(rp_time) as `use` from (select bin_id, rp_time from replacement where ?<=date_format(rp_time, '%Y-%m-%d')<=?) as r\
				right join bin b on r.bin_id=b.bin_id where pos=? group by bin_id order by `use` limit 5;"
		db.query(sql0+sql1, [start, end, dong_id, start, end, dong_id], (err, results) => {
			if (err) {
				console.error(err.sqlMessage)
				console.error(err.sql)
				res.json({ err: err.errno })
			} else {
				var data = {
					err: 0,
					top_list: results[0],
					btm_list: results[1]
				}
				res.json(data)
			}
		})
	},
	dong_detail: (req, res) => {
		var { bin_id } = req.params
		var { start, end } = req.query
		var sql0 = `select period, count(period) as 'use'
					from ( select bin_id, rp_time, date_format(rp_time, '%Y-%m') as period from replacement where ?<=date_format(rp_time, '%Y-%m-%d')<=? ) as r
					right join bin b on r.bin_id=b.bin_id where b.bin_id=? group by period;`
		db.query(sql0, [start, end, bin_id], (err, result) => {
			if (err) {
				console.error(err.sqlMessage)
				console.error(err.sql)
				res.json({ err: err.errno })
			} else {
				var data = {
					err: 0,
					use_list: result
				}
				res.json(data)
			}
		})
	}
}