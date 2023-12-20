var db = require('../db/db')
const fs = require('fs')

module.exports = {
	login_home: (req, res) => {
		res.writeHead(200, { 'Content-Type':'text/html'})
    	res.end(fs.readFileSync('views/log_in.html'))
	},
	login: (req, res) => {
		var { emp_id, password } = req.body
		var sql0 = `select * from employee where emp_id=? and password=? and code='0';`
		db.query(sql0, [emp_id, password], (err, result) => {
			if (result.length == 1) {
				req.session.logined = true
				req.session.empid = emp_id
				req.session.name = result[0].name
				res.json({ err: 0 })
			} else {
				res.json({ err: 1 })
			}
		})
	},
	logout: (req, res) => {
		req.session.destroy((err) => {
			if (err) res.json({ err: 1 })
			else res.redirect('/login')
		})
		
	},
	find_pw_home: (req, res) => {
		res.writeHead(200, { 'Content-Type':'text/html'})
    	res.end(fs.readFileSync(__dirname+'/../views/find-pw.html'))
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
	}
}