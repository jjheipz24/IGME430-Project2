const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const convertID = mongoose.Types.ObjectId;
let ImgModel = {};

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
    user: convertID(userId),
  };

  return ImgModel.find(search).select('name data size mimetype user').exec(callback);
};

ImageSchema.statics.findRandom = (callback) => ImgModel.find()
  .select('name data size mimetype user')
  .limit(36)
  .exec(callback);

ImgModel = mongoose.model('Images', ImageSchema);

module.exports.ImgModel = ImgModel;
module.exports.ImageSchema = ImageSchema;
