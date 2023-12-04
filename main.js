const express = require('express')
const app = express()
var port = 60036

app.set('views', __dirname + '/views')
app.set('view engine', 'ejs')

//사용자 정의 라우터 모듈
var rootRouter = require('./router/rootRouter')
var userRouter = require('./router/userRouter')
var binRouter = require('./router/binRouter')
var loadRouter = require('./router/loadRouter')
var fireRouter = require('./router/fireRouter')
var useRouter = require('./router/useRouter')
var notiRouter = require('./router/notiRouter')

// 회원 관리 기능 구현 후 주석 해제
// const session = require('./db/session')
// app.use(session)

var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({extended: false }))

//라우터 호출
app.use('/', rootRouter)
app.use('/', userRouter)
app.use('/', binRouter)
app.use('/', loadRouter)
app.use('/', fireRouter)
app.use('/', useRouter)
app.use('/', notiRouter)

//정적 파일 폴더 지정
app.use(express.static('public'))

app.listen(port)