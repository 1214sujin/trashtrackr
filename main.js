const express = require('express')
const app = express()
var port = 60036
const websocket = require('ws')

app.set('views', __dirname + '/views')
app.set('view engine', 'ejs')

//사용자 정의 라우터 모듈
var rootRouter = require('./routers/rootRouter')
var userRouter = require('./routers/userRouter')
var binRouter = require('./routers/binRouter')
var loadRouter = require('./routers/loadRouter')
var fireRouter = require('./routers/fireRouter')
var useRouter = require('./routers/useRouter')
var notiRouter = require('./routers/notiRouter')
var mobileRouter = require('./routers/mobileRouter')

//기타 사용자 정의 모듈
var db = require('./db/db')
var mqtt = require('./lib/mqtt')
var ee = require('./lib/alert')

const session = require('./db/session')
app.use(session)

app.use(express.json())
app.use(express.urlencoded( {extended : false } ))

//로그인하지 않고 웹에 접속하는 경우 항상 로그인 페이지로 가도록 함
app.use((req, res, next) => {
	if (req.url[1]!='m' && req.url!='/login' && req.url!='/find-pw' && !req.session.logined) {
		res.redirect('/login')	
	} else next()
})

//라우터 호출
app.use('/', rootRouter)
app.use('/user', userRouter)
app.use('/bin', binRouter)
app.use('/load', loadRouter)
app.use('/fire', fireRouter)
app.use('/use', useRouter)
app.use('/noti', notiRouter)
app.use('/m', mobileRouter)

//정적 파일 폴더 지정
app.use(express.static(__dirname+'/public'))

const server = app.listen(port, () => {
	process.on('SIGINT', () => {
		mqtt.end()
		ee.removeAllListener('alert-90')
		ee.removeAllListener('alert-rp')
		ee.removeAllListener('alert-fire')
		ee.removeAllListener('photo')
		db.end()
		process.exit()
	}) 
})

const wss = new websocket.Server({ server })
wss.on('connection', (ws) => {
    console.log('WS: Connected')
	ee.on('alert-90', (bin_id) => {
		let sql0 = `select * from loadage where (bin_id, load_time) in (select bin_id, max(load_time) from loadage group by bin_id) and bin_id=?;`
		db.query(sql0, [bin_id], (err, result) => {
			let data = {bin_id: result[0].bin_id, amount: result[0].amount}
			ws.send(JSON.stringify(data))
		})
	})

	ee.on('alert-fire', (_, bin_id) => {
		let sql0 = `select * from fire where (bin_id, fire_time) in (select bin_id, max(fire_time) from fire group by bin_id) and bin_id=?;`
		db.query(sql0, [bin_id], (err, result) => {
			let data = {bin_id: result[0].bin_id}
			ws.send(JSON.stringify(data))
		})
	})

    ws.on('close', () =>{
        console.log('WS: Disconnected')
    })
})