const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const convertID = mongoose.Types.ObjectId;
let ImgModel = {};

const ImageSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  data: {
    type: Buffer,
  },
  size: {
    type: Number,
  },
  tempFilePath: {
    type: String,
  },
  mimetype: {
    type: String,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },
});

ImageSchema.statics.toAPI = (doc) => ({
  img: doc.path,
});

ImageSchema.statics.findByUser = (userId, callback) => {
  const search = {
    owner: convertID(userId),
  };

  return ImgModel.find(search).select('name data size tempFilePath mimeType user').exec(callback);
};

ImageSchema.statics.findRandom = (callback) => ImgModel.find()
  .select('name data size tempFilePath mimeType user')
  .limit(36)
  .exec(callback);

ImgModel = mongoose.model('Images', ImageSchema);

module.exports.ImgModel = ImgModel;
module.exports.ImageSchema = ImageSchema;
