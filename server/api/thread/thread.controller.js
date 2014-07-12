'use strict';

var Thread = require('./thread.model');
var passport = require('passport');
var config = require('../../config/environment');
var jwt = require('jsonwebtoken');
var Photo = require('../photo/photo.model');

var validationError = function(res, err) {
  return res.json(422, err);
};

/**
 * Get list of threads
 * restriction: 'admin'
 */
exports.index = function(req, res) {
  Thread.find({}, function (err, threads) {
    if(err) return res.send(500, err);
    res.json(200, threads);
  });
};

/**
 * Creates a new thread
 * req.body.participants -> Expect >= 2 participants -> ex: [ObjectId, ObjectId]
 * req.body.url -> Photo url -> ex: String
 * req.body.owner -> Photo owner id -> ex: String
 */
exports.create = function (req, res, next) {
  var newThread = new Thread({participants: req.body.participants});
  newThread.save(function(err, thread) {
    if (err) return validationError(res, err);
    var newPhoto = new Photo({url: req.body.url, owner: req.body.owner});
    newPhoto.save(function(err, photo) {
      thread.photos.push(photo.id);
      thread.save(function(err, updatedThread) {
        console.log('Successfully created new thread with new photo!');
        res.json({ data: updatedThread });
      });
    });
  });
};

/**
 * Get a single thread
 */
exports.show = function (req, res, next) {
  var threadId = req.params.id;

  Thread.findById(threadId, function (err, thread) {
    if (err) return next(err);
    if (!thread) return res.send(401);
    res.json(thread.profile);
  });
};

/**
 * Deletes a thread
 * restriction: 'admin'
 */
exports.destroy = function(req, res) {
  Thread.findByIdAndRemove(req.params.id, function(err, thread) {
    if(err) return res.send(500, err);
    return res.send(204);
  });
};

/**
 * Change a threads password
 */
exports.changePassword = function(req, res, next) {
  var threadId = req.thread._id;
  var oldPass = String(req.body.oldPassword);
  var newPass = String(req.body.newPassword);

  Thread.findById(threadId, function (err, thread) {
    if(thread.authenticate(oldPass)) {
      thread.password = newPass;
      thread.save(function(err) {
        if (err) return validationError(res, err);
        res.send(200);
      });
    } else {
      res.send(403);
    }
  });
};

/**
 * Get my info
 */
exports.me = function(req, res, next) {
  var threadId = req.thread._id;
  Thread.findOne({
    _id: threadId
  }, '-salt -hashedPassword', function(err, thread) { // don't ever give out the password or salt
    if (err) return next(err);
    if (!thread) return res.json(401);
    res.json(thread);
  });
};

/**
 * Authentication callback
 */
exports.authCallback = function(req, res, next) {
  res.redirect('/');
};
