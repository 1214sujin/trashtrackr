db = require('../db/db')

module.exports = {
	home: (req, res) => {
		var sql0 = `select * from pos_gu;`
		var sql1 = `select * from pos_dong;`
		var sql2 = `select * from bin;`
		db.query(sql0+sql1+sql2, (err, results) => {
			var context = {
				'gu_list': results[0],
				'dong_list': results[1],
				'bin_list': results[2]
			}
			res.json(context)
			// req.app.render('bin-home', context, (err, html) => res.send(html))
		})
	},
	list: (req, res) => {
		var { dong_id } = req.params
		var sql0 = `select bin_id from bin where pos=${dong_id};`
		db.query(sql0, (err, results) => {
			var data = {
				"bin_id": results
			}
			res.json(data)
		})
	},
	detail: (req, res) => {
		var { bin_id } = req.params
		var sql0 = `select * from pos_gu;`
		var sql1 = `select * from pos_dong;`
		var sql2 = `select * from bin inner join pos_dong on dong_id=pos\
					join pos_gu on gu_id=p_gu where bin_id="${bin_id}";`
		var sql3 = `select name from bin b inner join employee e on e.pos=b.pos where bin_id="${bin_id}"`
		db.query(sql0+sql1+sql2+sql3, (err, results) => {
			var data = {
				'gu_list': results[0],
				'dong_list': results[1],
				'bin': results[2],
				'emp_name': results[3]
			}
			res.json(data)
		})
	},
	new: (req, res) => {
		var sql0 = `select * from pos_gu;`
		var sql1 = `select * from pos_dong;`
		db.query(sql0+sql1, (err, results) => {
			var data = {
				'gu_list': results[0],
				'dong_list': results[1]
			}
			res.json(data)
		})
	},
	create: (req, res) => {
		var { bin_id, dong_id, lat, lon } = req.body
		console.log(bin_id, dong_id, lat, lon)
		db.query(`insert into bin (bin_id, pos, lat, lon, install_date) values (?, ?, ?, ?, date_format(now(), '%Y-%m-%d'));`,[bin_id, dong_id, lat, lon], (err, result) =>{
			if (err) {
				if (err.code == 'ER_BAD_NULL_ERROR') res.json({'result': '비어있는 값이 존재합니다.'})
				else if (err.code == 'ER_DUP_ENTRY') res.json({'result': '중복된 쓰레기통 ID입니다.'})
				else res.json({'result': '신규 쓰레기통 정보 등록에 실패했습니다.'})
			}
			else res.json({'result': 1})
		})
	},
	update: (req, res) => {
		var { bin_id } = req.params
		var { dong_id, lat, lon } = req.body
		db.query(`update bin set pos=?, lat=?, lon=? where bin_id=?`, [dong_id, lat, lon, bin_id], (err, result) => {
			if (err) {
				if (err.code == 'ER_BAD_NULL_ERROR') res.json({'result': '비어있는 값이 존재합니다.'})
				else res.json({'result': '쓰레기통 정보 수정에 실패했습니다.'})
			}
			else res.json({'result': 1})
		})
	},
	delete: (req, res) => {
		var { bin_id } = req.params
		db.query(`delete from bin where bin_id=?`, [bin_id], (err, result) => {
			if (err) res.json({'result': '쓰레기통 정보 삭제에 실패했습니다.'})
			else res.json({'result': 1})
		})
	},
}