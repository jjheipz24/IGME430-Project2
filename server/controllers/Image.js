// Import our Image model
const models = require('../models');
const Img = models.Images;

/* Handles image upload via express-fileupload
Checks if files were sent, and makes sure they aren't too large

File data is then saved to the image schema and saved to the database
under the current logged in user
https://github.com/AustinWilloughby/SimpleNodeFileUpload*/
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

  // redirect after finished saving
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

/* Handles image retrieval

find the image via image name, then return it if
it is successfully found
https://github.com/AustinWilloughby/SimpleNodeFileUpload */
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

/* Get the csrfToken */
const getToken = (request, response) => {
  const req = request;
  const res = response;

  const csrfJSON = {
    csrfToken: req.csrfToken(),
  };
  res.json(csrfJSON);
};

/* Render the home page

Find 36 random images (or as many as there are <36) and create
an array of their img paths. Then, split that array into 3 parts to pass
into the 3 columns in the view. Also, pass in the username and csrf token\

Also, ad placeholders are added on home page only*/
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

    // This inserts ads into the images array every 5 images
    for (let i = 0; i < allImages.length; i += 5) {
      allImages.splice(i, 0, './assets/img/ad.png');
    }

    const categories = [];

    // Split array
    //https://ourcodeworld.com/articles/read/278/how-to-split-an-array-into-chunks-of-the-same-size-easily-in-javascript
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

/* Render the user page

Find the images uploaded by the user and create
an array of their img paths. Then, split that array into 3 parts to pass
into the 3 columns in the view. Also, pass in the username and csrf token */
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

    // split array
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

/* Exports */
module.exports.uploadImage = uploadImage;
module.exports.homePage = homePage;
module.exports.userPage = userPage;
module.exports.getToken = getToken;
module.exports.retrieve = retrieveImage;
