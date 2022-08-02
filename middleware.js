const { campgroundSchema, reviewSchema } = require('./schemas.js');
const ExpressError = require('./utils/ExpressError');
const Campground = require('./models/campground');
const Review = require('./models/review');

// middleware for users Login
module.exports.isLoggedIn = (req, res, next) => {
  // store the url they are requesting
  if(!req.isAuthenticated()) {
    const { id } = req.params;
    // redirect the user from where they were
    req.session.returnTo = req.originalUrl;
    // req.session.returnTo = (req.query._method === 'DELETE' ? `/campgrounds/${id}` : req.originalUrl);
    req.flash('error', 'You must be signed in first');
    // if we dont return this code, the 'res.render('campgrounds/new')' will run and result in an error 'Cannot set headers after they are sent to the client'
    return res.redirect('/login');
  } 
  next();
}

// middleware function
module.exports.validateCampground = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body);
  if(error) {
    const msg = error.details.map(el => el.message).join(',');
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
}
// for author on each campgrounds
module.exports.isAuthor = async (req, res, next) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  if(!campground.author.equals(req.user._id)) {
    req.flash('error', 'You do not have permission!');
    return res.redirect(`/campgrounds/${id}`);
  }
  next();
}
// for reviews
module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if(error) {
    const msg = error.details.map(el => el.message).join(',');
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
}
// for review author
module.exports.isReviewAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if(!review.author.equals(req.user._id)) {
    req.flash('error', 'You do not have permission!');
    return res.redirect(`/campgrounds/${id}`);
  }
  next();
}

