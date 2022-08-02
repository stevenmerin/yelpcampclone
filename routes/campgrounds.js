const express = require('express');
const router = express.Router();
const campgrounds = require('../controllers/campgrounds');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');
const multer  = require('multer');
// Node automatically looks for an index.js file in a folder
const { storage } = require('../cloudinary');
const upload = multer({ storage })

const Campground = require('../models/campground');

router.route('/')
   // campground index
  .get(catchAsync(campgrounds.index))
   // create a new campground
  .post(isLoggedIn, upload.array('image'), validateCampground, catchAsync(campgrounds.createCampground));
  // .post(upload.array('image'), (req, res) => {
  //   console.log(req.body, req.files);
  //   res.send("IT WORKED!");
  // })

// new page
router.get('/new', isLoggedIn, campgrounds.renderNewForm);

router.route('/:id')
   // show page/view campground
  .get(catchAsync(campgrounds.showCampground))
   // update campground
  .put(isLoggedIn, isAuthor, upload.array('image'), validateCampground, catchAsync(campgrounds.updateCampground))
   // delete campground
  .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));


//  populate() method is used to replace the user ObjectId field with the whole document consisting of all the user data.

// edit campground
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm));

module.exports = router;

