'use strict';
const express = require('express')
const router = express.Router()
const MainController = require('../../controllers/main.controller')

router.get('/areas', MainController.getAreas)
router.get('/chart', MainController.getDataChart)
router.get('/table', MainController.getDataTable)

module.exports = router