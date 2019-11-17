/* Get the mongoose */
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

/* Convert ID method and create empty ImgModel */
const convertID = mongoose.Types.ObjectId;
let ImgModel = {};

/* Create a new schema for images 
https://github.com/AustinWilloughby/SimpleNodeFileUpload*/
const ImageSchema = new mongoose.Schema({
  name: { // The file name
    type: String,
  },
  data: { // The actual image data
    type: Buffer,
  },
  size: { // The size of the image in bytes
    type: Number,
  },
  mimetype: { // The type of image it is
    type: String,
  },
  user: { // The user id of the uploader
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },
});

ImageSchema.statics.toAPI = (doc) => ({
  img: doc.path,
});

/* Enter a userID to find all ImgModels associated with that user

Select all image data for return */
ImageSchema.statics.findByUser = (userId, callback) => {
  const search = {
    user: convertID(userId),
  };

  return ImgModel.find(search).select('name data size mimetype user').exec(callback);
};

/* This returns all images from the server from all users

This is capped at 36 total so it will return the 36 most recent uploads
Used to create a randomized homepage with images from multiple users */
ImageSchema.statics.findRandom = (callback) => ImgModel.find()
  .select('name data size mimetype user')
  .limit(36)
  .exec(callback);

ImgModel = mongoose.model('Images', ImageSchema);

/* Exports */
module.exports.ImgModel = ImgModel;
module.exports.ImageSchema = ImageSchema;
