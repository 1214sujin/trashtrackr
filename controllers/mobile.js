const fs = require('fs')
const db = require('../db/db')
const ee = require('../lib/alert')
const mqtt = require('../lib/mqtt')

module.exports = {
	home: (req, res) => {
		var sql0 = `select b.bin_id, dong, lat, lon, amount from bin b left join ( select * from loadage where (bin_id, load_time)
						in (select bin_id, max(load_time) from loadage group by bin_id) ) as l on b.bin_id=l.bin_id join pos_dong on pos=dong_id;`
		db.query(sql0, (err, result) => {
			if (err) {
				console.error(err.sqlMessage)
				console.error(err.sql)
				res.json({ err: err.errno })
			} else {
				var data = { err: 0, bin_list: result }
				res.json(data)
			}
		})
	},
	list: (req, res) => {
		var { pos } = req.params
		var sql0 = `select b.bin_id, gu, dong, lat, lon, install_date,
						amount, date_format(load_time, '%H:%i:%s') as load_time, rp_time, emp_id, fire_time
					from bin b join pos_dong on pos=dong_id join pos_gu on p_gu=gu_id
					left join ( select * from loadage where (bin_id, load_time)
						in (select bin_id, max(load_time) from loadage group by bin_id) ) as l on b.bin_id=l.bin_id
					left join ( select * from replacement where (bin_id, rp_time)
						in (select bin_id, max(rp_time) from replacement group by bin_id) ) as r on b.bin_id=r.bin_id
					left join ( select * from fire where (bin_id, fire_time)
						in (select bin_id, max(fire_time) from fire group by bin_id) ) as f on b.bin_id=f.bin_id
					where pos=?;`
		db.query(sql0, [pos], (err, result) => {
			if (err) {
				console.error(err.sqlMessage)
				console.error(err.sql)
				res.json({ err: err.errno })
			} else {
				var data = { err: 0, bin_list: result }
				res.json(data)
			}
		})
	},
	alarm: (req, res) => {
		var { pos } = req.params
		var sql0 = "select * from (select l.bin_id, gu, dong, amount, l.load_time as time, null as fire, load_img as img, pos from loadage l\
					join alarm a on l.bin_id=a.bin_id and l.load_time=a.load_time\
					join bin b on b.bin_id=l.bin_id join pos_dong on pos=dong_id join pos_gu on p_gu=gu_id\
					union\
					select f.bin_id, gu, dong, null as amount, fire_time as time, 'true' as fire, fire_img as img, pos from fire f\
					join bin b on b.bin_id=f.bin_id join pos_dong on pos=dong_id join pos_gu on p_gu=gu_id\
					group by bin_id, time, pos) as s where pos=? order by time desc;"	// 모니터링을 위해 alarm 창에서는 모든 fire정보를 넘김 (알림은 최초만)
		db.query(sql0, [pos], (err, result) => {
			if (err) {
				console.error(err.sqlMessage)
				console.error(err.sql)
				res.json({ err: err.errno })
			} else {
				var data = {
					'err': 0,
					'alarm_list': result,
				}
				for (let i=0; i<result.length; i++) {
					let image = fs.readFileSync(__dirname+'/../public/images'+result[i].img)
					data.alarm_list[i].img = Buffer.from(image).toString('base64')
				}
				res.json(data)
			}
		})
	},
	replace2: (req, res) => {
		var { emp_id, bin_id } = req.body
		console.log('Replace2:', emp_id, bin_id)
		if (emp_id == undefined || bin_id == undefined) { res.json({ err: 1 }); return }
		var sql0 = `insert into replacement values (?, now(), ?);`
		var sql1 = `insert into notification (emp_id, bin_id, type, not_time, url)
					select distinct emp_id, ?, 'rp', now(), CONCAT('/load/', ?) from employee where code='0';`
		db.query(sql0+sql1, [bin_id, emp_id, bin_id, bin_id], (err, results) => {
			if (err) {
				console.error(err.sqlMessage)
				console.error(err.sql)
				res.json({ err: err.errno })
			} else {
				ee.emit('alert-rp', results[1].insertId)
				mqtt.publish('TrashMeasure/PC', `{"server": true, "bin_id": "${bin_id}"}`)
				res.json({ err: 0 })
			}
		})
	},
	replace: (req, res) => {
		var { bin_id } = req.params
		var { emp_id } = req.body
		console.log('Replace:', emp_id, bin_id)
		if (emp_id == undefined) { res.json({ err: 1 }); return }
		var sql0 = `insert into replacement values (?, now(), ?);`
		var sql1 = `insert into notification (emp_id, bin_id, type, not_time, url)
					select distinct emp_id, ?, 'rp', now(), CONCAT('/load/', ?) from employee where code='0';`
		db.query(sql0+sql1, [bin_id, emp_id, bin_id, bin_id], (err, results) => {
			if (err) {
				console.error(err.sqlMessage)
				console.error(err.sql)
				res.json({ err: err.errno })
			} else {
				ee.emit('alert-rp', results[1].insertId)
				mqtt.publish('TrashMeasure/PC', `{"server": true, "bin_id": "${bin_id}"}`)
				res.json({ err: 0 })
			}
		})
	},
	// 로그인이나 정보 수정 시 사용자의 정보를 모바일에 전송 (정보 확인 시마다 요청하지 않아도 되도록)
	login: (req, res) => {
		var { id, password } = req.body
		var sql0 = `select * from employee where emp_id=? and password=?;`
		db.query(sql0, [id, password], (err, result) => {
			if (result.length == 0) {
				res.json({ err: 1 })
			} else {
				var sql1 = `select emp_id, name, tel, gu, dong, pos from employee
				join pos_dong on pos=dong_id join pos_gu on p_gu=gu_id where emp_id=?;`
				db.query(sql1, [id], (err, result) => {
					res.json({ err: 0, emp_info: result })
				})
			}
		})
	},
	info_process: (req, res) => {
		var post = req.body
		for (let i=0; i<post.length; i++) if (post[i] == undefined) post[i] = null
		var { emp_id, password, name, tel, dong_id } = post
		// 사용자 본인이 정보를 수정하는 것인지 확인
		var sql0 = `select * from employee where emp_id=? and password=?;`
		db.query(sql0, [emp_id, password], (err, result) => {
			if (result.length == 0) {
				res.json({ err: 1 })
			} else {
				// 사용자 본인이 확인되면 회원 정보 업데이트
				var sql1 = `update employee set name=?, tel=?, pos=? where emp_id=?;`
				db.query(sql1, [name, tel, dong_id, emp_id], (err, result) => {
					if (err) {
						if (err.code == 'ER_BAD_NULL_ERROR') res.json({err: '비어있는 값이 존재합니다.'})
						else res.json({err: err.errno})
					} else {
						// 업데이트 정상 수행 시 회원 정보 전송
						var sql2 = `select name, tel, gu, dong, pos from employee
									join pos_dong on pos=dong_id join pos_gu on p_gu=gu_id where emp_id=?;`
						db.query(sql2, [emp_id], (err, result) => {
							res.json({ err: 0, emp_info: result })
						})
					}
				})
			}
		})
	},
	find_pw: (req, res) => {
		var post = req.body
		for (let i=0; i<post.length; i++) if (post[i] == undefined) post[i] = null
		var { emp_id, tel, new_pw } = post
		var sql0 = `select * from employee where emp_id=? and tel=?;`
		db.query(sql0, [emp_id, tel], (err, result) => {
			if (result.length == 1) {
				var sql1 = `update employee set password=? where emp_id=?`
				db.query(sql1, [new_pw, emp_id], (err, result) => {
					if (err) {
						console.error(err.sqlMessage)
						console.error(err.sql)
						res.json({ err: err.errno })
					} else {
						res.json({ err: 0 })
					}
				})
			} else {
				res.json({ err: 1 })
			}
		})
	},
	pw: (req, res) => {
		var post = req.body
		for (let i=0; i<post.length; i++) if (post[i] == undefined) post[i] = null
		var { emp_id, password, new_pw } = post
		var sql0 = `select * from employee where emp_id=? and password=?;`
		db.query(sql0, [emp_id, password], (err, result) => {
			if (result.length == 1) {
				var sql1 = `update employee set password=? where emp_id=?;`
				db.query(sql1, [new_pw, emp_id], (err, result) => {
					if (err) {
						console.error(err.sqlMessage)
						console.error(err.sql)
						res.json({ err: err.errno })
					} else {
						res.json({ err: 0 })
					}
				})
			} else {
				res.json({ err: 1 })
			}
		})
	}
}