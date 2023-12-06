const express = require('express')
const app = express()
var port = 60036

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

// 회원 관리 기능 구현 후 주석 해제
// const session = require('./db/session')
// app.use(session)

app.use(express.json())
app.use(express.urlencoded( {extended : false } ))

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
app.use(express.static('public'))

app.listen(port)