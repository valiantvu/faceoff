'use strict';

var express = require('express');
var controller = require('./thread.controller');
var config = require('../../config/environment');

var router = express.Router();

router.get('/', controller.index);
router.delete('/:id', controller.destroy);
router.get('/:id', controller.show);
router.get('/all/:id', controller.showAllData);
router.get('/:id/creator/mark-read', controller.creatorMarkRead);
router.get('/:id/recipient/mark-read', controller.recipientMarkRead);
router.post('/find-thread', controller.findThread);
router.post('/', controller.create);
router.post('/photos', controller.addPhoto);

module.exports = router;
