const Campground = require('../models/campground');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });
const { cloudinary } = require('../cloudinary');

// campground index
module.exports.index = async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render('campgrounds/index', { campgrounds });
}

// new page
module.exports.renderNewForm = (req, res) => {
  res.render('campgrounds/new');
}

// create a new campground
module.exports.createCampground = async (req, res, next) => {
  const geoData = await geocoder.forwardGeocode({
    query: req.body.campground.location,
    limit: 1
  }).send()
  // if(!req.body.campground) throw new ExpressError('Invalid Campground Data', 400);
  // this is not a mongoose schema, this is going to validate our data before saving it to mongoose
  const campground = new Campground(req.body.campground);
  campground.geometry = geoData.body.features[0].geometry;
  campground.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
  campground.author = req.user._id;
  await campground.save();
  console.log(campground);
  req.flash('success', 'Succesfully made a new campground!');
  res.redirect(`/campgrounds/${campground._id}`);
}

// show page/view campground
module.exports.showCampground = async(req, res) => {
  const campground = await Campground.findById(req.params.id).populate({ 
    path: 'reviews',
    populate: {
      path: 'author'
    }
  }).populate('author');
  if(!campground) {
    req.flash('error', 'Cannot find that campground!');
    return res.redirect('/campgrounds');
  }
  res.render('campgrounds/show', { campground });
}

// edit campground
module.exports.renderEditForm = async(req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  if(!campground) {
    req.flash('error', 'Cannot find that campground!');
    return res.redirect('/campgrounds');
  }
  res.render('campgrounds/edit', { campground });
}

// update campground
module.exports.updateCampground = async(req, res) => {
  const { id } = req.params;
  console.log(req.body);
  const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground});
  const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
  campground.images.push(...imgs);
  await campground.save();
  if(req.body.deleteImages) {
    for(let filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(filename);
    }
    await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } });
    console.log(campground);
  }
  req.flash('success', 'Succesfully updated campground!');
  res.redirect(`/campgrounds/${campground._id}`);
  // console.log(req.body.campground);
}

// delete campground
module.exports.deleteCampground = async(req, res) => {
  const { id } = req.params;
  await Campground.findByIdAndDelete(id);
  req.flash('success', 'Successfully deleted campground');
  res.redirect('/campgrounds');
}

// From models/campgrounds.js
// CampgroundSchema.post('findOneAndDelete', async function(doc) {
//   if(doc) {
//     await Review.deleteMany({
//       _id: {
//         $in: doc.reviews
//       }
//     })
//   }
// })