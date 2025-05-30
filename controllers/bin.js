var db = require('../db/db')

module.exports = {
	home: (req, res) => {
		var sql0 = `select * from pos_gu;`
		var sql1 = `select * from pos_dong;`
		var sql2 = `select * from bin;`
		db.query(sql0+sql1+sql2, (err, results) => {
			var context = {
				body: 'bin.ejs',
				name: req.session.name,
				active: ['active-menu','','','',''],
				gu_list: results[0],
				dong_list: results[1],
				bin_list: results[2]
			}
			req.app.render('menu', context, (err, html) => {if(err)console.error(err); res.send(html)})
		})
	},
	list: (req, res) => {
		var { dong_id } = req.params
		var sql0 = `select bin_id from bin where pos=?;`
		db.query(sql0, [dong_id], (err, result) => {
			var data = {
				bin_id: result
			}
			res.json(data)
		})
	},
	detail: (req, res) => {
		var { bin_id } = req.params
		var sql0 = `select * from pos_gu;`
		var sql1 = `select * from pos_dong;`
		var sql2 = `select * from bin inner join pos_dong on dong_id=pos
					join pos_gu on gu_id=p_gu where bin_id=?;`
		var sql3 = `select name from bin b inner join employee e on e.pos=b.pos where bin_id=?;`
		db.query(sql0+sql1+sql2+sql3, [bin_id, bin_id], (err, results) => {
			var data = {
				gu_list: results[0],
				dong_list: results[1],
				bin: results[2],
				emp_name: results[3]
			}
			res.json(data)
		})
	},
	new: (req, res) => {
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
	create: (req, res) => {
		var post = req.body
		for (let i=0; i<post.length; i++) if (post[i] == undefined) post[i] = null
		var { bin_id, dong_id, lat, lon } = post
		console.log(bin_id, dong_id, lat, lon)
		var sql0 = `insert into bin (bin_id, pos, lat, lon, install_date) values (?, ?, ?, ?, date_format(now(), '%Y-%m-%d'));`
		db.query(sql0, [bin_id, dong_id, lat, lon], (err, result) =>{
			if (err) {
				console.error(err.sqlMessage)
				console.error(err.sql)
				if (err.code == 'ER_BAD_NULL_ERROR') res.json({err: '비어있는 값이 존재합니다.'})
				else if (err.code == 'ER_DUP_ENTRY') res.json({err: '중복된 쓰레기통 ID입니다.'})
				else res.json({err: err.errno})
			}
			else res.json({err: 0})
		})
	},
	update: (req, res) => {
		var { bin_id } = req.params
		var post = req.body
		for (let i=0; i<post.length; i++) if (post[i] == undefined) post[i] = null
		var { dong_id, lat, lon } = post
		var sql0 = `update bin set pos=?, lat=?, lon=? where bin_id=?;`
		db.query(sql0, [dong_id, lat, lon, bin_id], (err, result) => {
			if (err) {
				console.error(err.sqlMessage)
				console.error(err.sql)
				if (err.code == 'ER_BAD_NULL_ERROR') res.json({err: '비어있는 값이 존재합니다.'})
				else res.json({err: err.errno})
			}
			else res.json({err: 0})
		})
	},
	delete: (req, res) => {
		var { bin_id } = req.params
		var sql0 = `delete from bin where bin_id=?;`
		db.query(sql0, [bin_id], (err, result) => {
			if (err) {
				console.error(err.sqlMessage)
				console.error(err.sql)
				res.json({err: err.errno})
			}
			else res.json({err: 0})
		})
	},
}