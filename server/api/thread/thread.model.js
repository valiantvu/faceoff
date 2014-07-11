'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ThreadSchema = new Schema({
  users: [{type: Schema.Types.ObjectId, ref: 'User'}],
  photos: [{type: Schema.Types.ObjectId, ref: 'Photo'}],
  created_at : {type: Date, default: Date.now},
  updated_at : {type: Date}
});


ThreadSchema.pre('save', function(next){
  var now = new Date();
  this.updated_at = now;
  if ( ! this.created_at ){
    this.created_at = now;
  }
  next();
});



module.exports = mongoose.model('Thread', ThreadSchema);
