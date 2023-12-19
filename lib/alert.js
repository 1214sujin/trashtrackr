const EventEmitter = require('events')

var ee = new EventEmitter()
ee.on('test', (text) => {
	console.log(text)
})
ee.emit('test', { msg: 'test event occurred'})

module.exports = ee