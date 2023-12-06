const express = require('express')
var router = express.Router()

var bin = require('../controllers/bin')

router.get('/', bin.home)
router.get('/list/:dong_id', bin.list)
router.get('/detail/:bin_id', bin.detail)
router.get('/new', bin.new)
router.post('/', bin.create)
router.put('/:bin_id', bin.update)
router.delete('/:bin_id', bin.delete)

module.exports = router