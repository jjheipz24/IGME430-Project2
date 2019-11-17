const models = require('../models');
const Img = models.Images;

const uploadImage = (req, res) => {
  // If there are no files, return an error
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json({ error: 'No files were uploaded' });
  }


  if (req.files.img.truncated) {
    return res.status(400).json({
      error: 'File is too large',
    });
  }

  const imgFile = {
    name: req.files.img.name,
    data: req.files.img.data,
    size: req.files.img.size,
    mimetype: req.files.img.mimetype,
    user: req.session.account._id,
  };

  const imageModel = new Img.ImgModel(imgFile);

  // Save the image to mongo
  const savePromise = imageModel.save();

  // When it is finished saving, let the user know
  savePromise.then(() => res.status(201).json({
    redirect: '/userPage',
  }));

  // If there is an error while saving, let the user know
  savePromise.catch((error) => {
    res.json({ error });
  });

  // Return out
  return savePromise;
};

const retrieveImage = (req, res) => {
  Img.ImgModel.findOne({ name: req.query.name }, (error, doc) => {
    if (error) {
      return res.status(400).json({ error });
    }

    if (!doc) {
      return res.status(400).json({
        error: 'File not found',
      });
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
    docs.forEach((doc) => {
      const imagePath = `./retrieve?name=${doc.name}`;
      allImages.push(imagePath);
    });

    const categories = [];

    for (let i = 0; i < allImages.length; i += allImages.length / 3) {
      categories.push(allImages.slice(i, i + allImages.length / 3));
    }

    return res.render('app', {
      csrfToken: req.csrfToken,
      name: req.session.account,
      imgs: categories[1],
      imgs2: categories[0],
      imgs3: categories[2],
    });
  });
};

const userPage = (req, res) => {
  Img.ImgModel.findByUser(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }

    const allImages = [];
    docs.forEach((doc) => {
      const imagePath = `./retrieve?name=${doc.name}`;
      allImages.push(imagePath);
    });

    const categories = [];

    for (let i = 0; i < allImages.length; i += allImages.length / 3) {
      categories.push(allImages.slice(i, i + allImages.length / 3));
    }

    return res.render('user', {
      csrfToken: req.csrfToken,
      name: req.session.account.username,
      imgs: categories[1],
      imgs2: categories[0],
      imgs3: categories[2],
    });
  });
};


module.exports.uploadImage = uploadImage;
module.exports.homePage = homePage;
module.exports.userPage = userPage;
module.exports.getToken = getToken;
module.exports.retrieve = retrieveImage;
