const models = require('../models');
const Img = models.Images;

const uploadImage = (req, res) => {

  console.log(req.files);
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json({ error: 'No files were uploaded' });
  }

  const imgFile = {
    name: req.files.img.name,
    data: req.file.img.data,
    size: req.file.img.size,
    tempFilePath: req.fies.img.tempFilePath,
    mimeType: req.files.img.mimeType,
    user: req.session.accoumt._id,
  };

  const imageModel = new Img.ImgModel(imgFile);

  const savePromise = imageModel.save();
  savePromise.then(() => {
    res.json({ message: 'upload successful' });
  });

  savePromise.catch((error) => {
    res.json({ error });
  });

  return savePromise;
};

const retrieveImage = (req, res, imgName) => {
  Img.ImgModel.findOne({ name: imgName }, (error, doc) => {
    if (error) {
      return res.status(400).json({ error });
    }

    if (!doc) {
      return res.status(400).json({ error: 'File not found' });
    }

    res.writeHead(200, {
      'Content-Type': doc.mimetype,
      'Content-Length': doc.size,
    });

    return res.end(doc.data);
  });
};

const getToken = (request, response) => {
  const req = request;
  const res = response;

  const csrfJSON = {
    csrfToken: req.csrfToken(),
  };
  res.json(csrfJSON);
};

const homePage = (req, res) => {
  Img.ImgModel.findRandom((err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }

    const allImages = [];

    docs.forEach((img) => {
      allImages.push(retrieveImage(req, res, img.name));
    });

    const categories = [];

    for (let i = 0; i < allImages.length; i += 3) {
      categories.push(this.slice(i, i + 3));
    }

    console.log(categories);
    return res.render('app', {
      csrfToken: req.csrfToken,
      name: req.session.account,
    });
  });
};

const userPage = (req, res) => res.render('user', {
  csrfToken: req.csrfToken,
  name: req.session.account.username,
});


module.exports.uploadImage = uploadImage;
module.exports.homePage = homePage;
module.exports.userPage = userPage;
module.exports.getToken = getToken;
module.exports.retrieve = retrieveImage;
