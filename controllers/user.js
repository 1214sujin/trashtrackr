var db = require('../db/db')
const fs = require('fs')

module.exports = {
	info: (req, res) => {
		var sql0 = `select emp_id, name, tel from employee where emp_id=?;`
		db.query(sql0, [req.session.empid], (err, result) => {
			res.json(result)
		})
	},
	info_process: (req, res) => {
		var { password, name, tel } = req.body
		var sql0 = `select * from employee where emp_id=? and password=?;`
		db.query(sql0, [req.session.empid, password], (err, result) => {
			if (result.length == 1) {
				var sql1 = `update employee set name=?, tel=? where emp_id=?;`
				db.query(sql1, [name, tel, req.session.empid], (err, result) => {
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
		res.writeHead(200, { 'Content-Type':'text/html'})
    	res.end(fs.readFileSync(__dirname+'/../views/pw.html'))
	},
	pw_process: (req, res) => {
		var { password, new_pw } = req.body
		var sql0 = `select * from employee where emp_id=? and password=?;`
		db.query(sql0, [req.session.empid, password], (err, result) => {
			if (result.length == 1) {
				var sql1 = `update employee set password=? where emp_id=?;`
				db.query(sql1, [new_pw, req.session.empid], (err, result) => {
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