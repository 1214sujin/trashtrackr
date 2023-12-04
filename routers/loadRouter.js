const express = require('express')
const router = express.Router()

var load = require('../controllers/load')

router.get('/', load.home)
router.get('/:bin_id', load.view)
router.get('/pic/:bin_id', load.picture)

module.exports = router