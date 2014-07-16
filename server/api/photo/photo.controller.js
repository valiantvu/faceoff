'use strict';

var Photo = require('./photo.model');
var passport = require('passport');
var config = require('../../config/environment');
//var busboy = require('connect-busboy');
var Busboy = require('busboy');
var path = require('path');   
//var fs = require('fs-extra');
var fs = require('fs');
var AWS = require('aws-sdk');
var inspect = require('util').inspect;

if(config.env === 'development') { 
  var AWS_CREDS = require('../../config/local.env.js');
 };

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

  var fstream;
  var photoData = {};
  var busboy = new Busboy({ headers: req.headers });
  //initiate form processing
  req.pipe(busboy);

    busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
      console.log('File [' + fieldname + ']: filename: ' + filename + ', encoding: ' + encoding + ', mimetype: ' + mimetype);
      //save file
      fstream = fs.createWriteStream('./tempImages/' + filename);
      file.pipe(fstream);
      fstream.on('close', function () {    
            console.log("Saving Finished of " + filename);              
      });
      file.on('data', function(data) {
        console.log('File [' + fieldname + '] got ' + data.length + ' bytes');
      });
      file.on('end', function(data) {
        //add data to the storage object above
        photoData[fieldname]=filename;
        console.log('File [' + fieldname + '] Finished');
      });
    });
    busboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated) {
      //add owner userId to the storage object above
      photoData[fieldname]=val;
      console.log('Field [' + fieldname + ']: value: ' + inspect(val));
    });
    busboy.on('finish', function() {
      console.log('Done parsing form!');
      console.log('photo data', photoData);

      //check to see we have the required photo model data from the post
      if (photoData.owner && photoData.photo){

        var newPhoto = new Photo(photoData);
        newPhoto.save(function(err, photo) {
          if (err) res.send(validationError(res, err));
          //hard code for now
          photo.url='s3-us-west-1.amazonaws.com/tradingfaces/'+photo.id+'.jpg';
          photo.cloudStatus = 'pending';
          photo.name= photo.id;
          photo.save(function(err, photo) {
            if (err) return validationError(res, err);
            exports.uploadToCloud(photo, photoData.photo, photo.id);
            res.json({ data: photo });
          });
        });
      } else {
        res.send('we need a valid userId for the owner and photo data');
      }
    });
};

/**
 * Upload temp file to S3 / delete temp
 */

exports.uploadToCloud = function (photo, photoName, photoId) {




  console.log('upload to cloud got photo id of ' +  photoId + 'and name '+ photoName);


  var accessKeyId =  process.env.AWS_ACCESS_KEY || AWS_CREDS.AWS_KEY;
  var secretAccessKey = process.env.AWS_SECRET_KEY || AWS_CREDS.AWS_SECRET;

  AWS.config.update({
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey
  });

  fs.readFile('./tempImages/'+ photoName, function (err, data) {

    var params = {
        Bucket: 'tradingfaces',
        Key: photoId+'.jpg',
        Body: data
      };

    var s3 = new AWS.S3();
    s3.putObject(params, function (perr, pres) {
        if (perr) {
            console.log("Error uploading data: ", perr);
            photo.cloudStatus = 'error';
            photo.save(function(err, photo) {
              if (err) return validationError(res, err);
              console.log('Cloud status ERROR for photo ', photo);
            });
            return perr;
        } else {
          console.log('resp from amazon', pres);
            console.log("Successfully uploaded " +photoName +" to myBucket/myKey");
            photo.cloudStatus = 'confirmed';
            photo.save(function(err, photo) {
              if (err) return validationError(res, err);
              console.log('Cloud status updated for photo ', photo);
            });
            exports.deleteTempFile(photoName);
            return pres;
        }
    });
  });

};

/**
 * Delete TempFile
 */

exports.deleteTempFile = function (photoName) {

  fs.unlink('./tempImages/'+ photoName, function (err) {
    if (err) throw err;
    console.log('successfully deleted ./tempImages/'+ photoName);
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
