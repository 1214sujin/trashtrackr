var EventEmitter = require('events')

var ee = new EventEmitter()
ee.on('evt', (text) => {
	console.log(text)
})
ee.emit('evt', { msg: 'event occured'})

module.exports = ee