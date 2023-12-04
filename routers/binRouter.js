const express = require('express')
var router = express.Router()

var bin = require('../controllers/bin')

router.get('/', bin.home)
router.get('/:gu/:dong', bin.list)
router.get('/:bin_id', bin.detail)
router.get('/new', bin.new)
router.post('/', bin.create)
router.put('/', bin.update)
router.delete('/', bin.delete)

module.exports = router