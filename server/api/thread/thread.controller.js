'use strict';

var Thread = require('./thread.model');
var passport = require('passport');
var config = require('../../config/environment');
var jwt = require('jsonwebtoken');

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
 */
exports.create = function (req, res, next) {
  var newThread = new Thread(req.body);
  // newThread.provider = 'local';
  newThread.save(function(err, thread) {
    if (err) return validationError(res, err);
    // var token = jwt.sign({_id: thread._id }, config.secrets.session, { expiresInMinutes: 60*5 });
    // res.json({ token: token });
    res.json({ data: thread });
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
