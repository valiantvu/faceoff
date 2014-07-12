'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PhotoSchema = new Schema({
  owner: {type: Schema.Types.ObjectId, ref: 'User'},
  url: {type: String, required: true},
  created_at : {type: Date, default: Date.now},
  updated_at : {type: Date}
});


PhotoSchema.pre('save', function(next){
  var now = new Date();
  this.updated_at = now;
  if ( ! this.created_at ){
    this.created_at = now;
  }
  next();
});



module.exports = mongoose.model('Photo', PhotoSchema);
