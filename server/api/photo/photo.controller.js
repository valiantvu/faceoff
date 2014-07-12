'use strict';

var Photo = require('./photo.model');
var passport = require('passport');
var config = require('../../config/environment');
var jwt = require('jsonwebtoken');

var validationError = function(res, err) {
  return res.json(422, err);
};

/**
 * Get list of photos
 * restriction: 'admin'
 */
exports.index = function(req, res) {
  Photo.find({}, function (err, photos) {
    if(err) return res.send(500, err);
    res.json(200, photos);
  });
};

/**
 * Creates a new photo
 */
exports.create = function (req, res, next) {
  var newPhoto = new Photo(req.body);
  // newPhoto.provider = 'local';
  newPhoto.save(function(err, photo) {
    if (err) return validationError(res, err);
    // var token = jwt.sign({_id: photo._id }, config.secrets.session, { expiresInMinutes: 60*5 });
    // res.json({ token: token });
    res.json({ data: photo });
  });
};

/**
 * Get a single photo
 */
exports.show = function (req, res, next) {
  var photoId = req.params.id;

  Photo.findById(photoId, function (err, photo) {
    if (err) return next(err);
    if (!photo) return res.send(401);
    res.json(photo.profile);
  });
};

/**
 * Deletes a photo
 * restriction: 'admin'
 */
exports.destroy = function(req, res) {
  Photo.findByIdAndRemove(req.params.id, function(err, photo) {
    if(err) return res.send(500, err);
    return res.send(204);
  });
};

/**
 * Change a photos password
 */
exports.changePassword = function(req, res, next) {
  var photoId = req.photo._id;
  var oldPass = String(req.body.oldPassword);
  var newPass = String(req.body.newPassword);

  Photo.findById(photoId, function (err, photo) {
    if(photo.authenticate(oldPass)) {
      photo.password = newPass;
      photo.save(function(err) {
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
  var photoId = req.photo._id;
  Photo.findOne({
    _id: photoId
  }, '-salt -hashedPassword', function(err, photo) { // don't ever give out the password or salt
    if (err) return next(err);
    if (!photo) return res.json(401);
    res.json(photo);
  });
};

/**
 * Authentication callback
 */
exports.authCallback = function(req, res, next) {
  res.redirect('/');
};
