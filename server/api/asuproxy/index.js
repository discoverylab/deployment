/**
 * Created by mbalumur on 12/12/2014.
 */
'use strict';

var express = require('express');
var controller = require('./asuproxy.controller');

var router = express.Router();

router.get('/ticket/:ticket_id/quizid/:quiz_id', controller.index);

module.exports = router;
